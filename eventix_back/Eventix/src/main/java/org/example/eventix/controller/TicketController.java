package org.example.eventix.controller;

import org.example.eventix.dto.TicketShortResponse;
import org.example.eventix.model.enums.TicketStatus;
import org.example.eventix.repository.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketRepository ticketRepo;

    public TicketController(TicketRepository ticketRepo) {
        this.ticketRepo = ticketRepo;
    }

    @GetMapping("/free")
    public List<TicketShortResponse> getFreeTickets(@RequestParam("eventId") Long eventId) {
        return ticketRepo.findByEvent_IdAndStatus(eventId, TicketStatus.FREE)
                .stream()
                .map(t -> new TicketShortResponse(
                        t.getId(),
                        t.getNumber(),
                        t.getCost(),
                        t.getCategory()
                ))
                .toList();
    }
}



