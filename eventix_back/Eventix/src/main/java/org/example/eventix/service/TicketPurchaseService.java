package org.example.eventix.service;

import org.example.eventix.dto.ConfirmRequest;
import org.example.eventix.dto.ReserveRequest;
import org.example.eventix.dto.ReserveResponse;
import org.example.eventix.dto.PurchaseResponse;
import org.example.eventix.model.Ticket;
import org.example.eventix.model.enums.TicketStatus;
import org.example.eventix.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class TicketPurchaseService {

    private final TicketRepository tickets;

    public TicketPurchaseService(TicketRepository tickets) {
        this.tickets = tickets;
    }

    @Transactional
    public ReserveResponse reserve(ReserveRequest req) {
        if (req.quantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be > 0");
        }
        if (req.category() == null || req.category().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        final String category = req.category().trim().toUpperCase(Locale.ROOT);

        tickets.releaseExpired(req.eventId(), category);

        long free = tickets.countFree(req.eventId(), category);
        if (free < req.quantity()) {
            throw new IllegalStateException("Not enough tickets: available=" + free);
        }

        List<Ticket> batch = tickets.lockFreeForReservation(req.eventId(), category, req.quantity());
        if (batch.size() < req.quantity()) {
            throw new IllegalStateException("Not enough tickets: locked=" + batch.size());
        }

        UUID rid = UUID.randomUUID();
        Instant until = Instant.now().plus(15, ChronoUnit.MINUTES);
        BigDecimal total = BigDecimal.ZERO;

        for (Ticket t : batch) {
            t.setStatus(TicketStatus.RESERVED);
            t.setReservationId(rid);
            t.setReservedUntil(until);
            t.setCustomerEmail(req.customerEmail());
            if (t.getCost() != null) {
                total = total.add(t.getCost());
            }
        }

        return new ReserveResponse(rid, total, until);
    }

    @Transactional
    public PurchaseResponse confirm(ConfirmRequest req) {
        long count = tickets.countByReservation(req.reservationId());
        if (count == 0) {
            throw new IllegalStateException("Reservation not found");
        }
        tickets.purchaseByReservation(req.reservationId());
        return new PurchaseResponse(req.reservationId(), (int) count, "PURCHASED");
    }
}




