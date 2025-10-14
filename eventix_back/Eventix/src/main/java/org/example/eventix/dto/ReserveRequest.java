package org.example.eventix.dto;

public record ReserveRequest(
        Long eventId,
        String category,
        int quantity,
        String customerEmail
) {}

