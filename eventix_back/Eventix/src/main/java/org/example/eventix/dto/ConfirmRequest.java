package org.example.eventix.dto;

import java.util.UUID;

public record ConfirmRequest(
        UUID reservationId,
        String paymentToken
) {}

