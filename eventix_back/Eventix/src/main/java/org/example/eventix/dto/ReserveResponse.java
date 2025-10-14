package org.example.eventix.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ReserveResponse(
        UUID reservationId,
        BigDecimal total,
        Instant expiresAt
) {}

