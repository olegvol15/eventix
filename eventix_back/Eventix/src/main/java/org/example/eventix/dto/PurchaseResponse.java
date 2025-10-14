package org.example.eventix.dto;

import java.util.UUID;

public record PurchaseResponse(
        UUID reservationId,
        int tickets,
        String status
) {}

