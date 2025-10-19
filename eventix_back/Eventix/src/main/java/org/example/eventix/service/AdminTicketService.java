package org.example.eventix.service;

import jakarta.transaction.Transactional;
import org.example.eventix.dto.GenerateTicketsRequest;
import org.example.eventix.model.Event;
import org.example.eventix.model.Ticket;
import org.example.eventix.model.enums.TicketCategory;
import org.example.eventix.model.enums.TicketStatus;
import org.example.eventix.repository.EventRepository;
import org.example.eventix.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminTicketService {

    private final EventRepository events;
    private final TicketRepository tickets;

    public AdminTicketService(EventRepository events, TicketRepository tickets) {
        this.events = events;
        this.tickets = tickets;
    }

//    private BigDecimal defaultCost(TicketCategory cat) {
//        return switch (cat) {
//            case VIP -> new BigDecimal("129.00");
//            case PREMIUM -> new BigDecimal("99.00");
//            case STANDARD -> new BigDecimal("49.00");
//            case ECONOMY -> new BigDecimal("29.00");
//            case FANZONE -> new BigDecimal("19.00");
//        };
//    }

    @Transactional
    public int generate(Long eventId, GenerateTicketsRequest req) {
        TicketCategory cat =  req.category();
        Event event = events.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        int from = tickets.maxNumberForEvent(eventId);
        int to = from + req.count() - 1;

        List<Ticket> batch = new ArrayList<>(req.count());
        for (int n = from; n <= to; n++) {
            Ticket t = new Ticket();
            t.setEvent(event);
            t.setCategory(cat);
            t.setNumber(n);
            t.setStatus(TicketStatus.FREE);
//            t.setCost(price);
            batch.add(t);
        }
        tickets.saveAll(batch);
        return batch.size();
    }

}



