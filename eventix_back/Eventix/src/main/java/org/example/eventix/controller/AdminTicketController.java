package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.GenerateTicketsRequest;
import org.example.eventix.service.AdminTicketService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/api/v1/admin/events", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminTicketController {

    private final AdminTicketService service;

    public AdminTicketController(AdminTicketService service) {
        this.service = service;
    }

    @PostMapping("/{eventId}/tickets/generate")
    public Map<String,Object> generate(@PathVariable Long eventId,
                                       @Valid @RequestBody GenerateTicketsRequest req) {
        int created = service.generate(eventId, req);
        return Map.of("created", created);
    }
}

