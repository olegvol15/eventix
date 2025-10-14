package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.ConfirmRequest;
import org.example.eventix.dto.PurchaseResponse;
import org.example.eventix.dto.ReserveRequest;
import org.example.eventix.dto.ReserveResponse;
import org.example.eventix.service.TicketPurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
public class PublicTicketsController {

    private final TicketPurchaseService service;

    public PublicTicketsController(TicketPurchaseService service) {
        this.service = service;
    }

    @PostMapping("/reserve")
    public ResponseEntity<ReserveResponse> reserve(@Valid @RequestBody ReserveRequest req) {
        return ResponseEntity.ok(service.reserve(req));
    }

    @PostMapping("/confirm")
    public ResponseEntity<PurchaseResponse> confirm(@Valid @RequestBody ConfirmRequest req) {
        return ResponseEntity.ok(service.confirm(req));
    }
}

