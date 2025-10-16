package org.example.eventix.dto;

import java.time.LocalDateTime;

public record AdminReviewResponse(
        Long id,
        Long eventId,
        String eventName,
        Long userId,
        String userEmail,
        int rating,
        String comment,
        String status,
        LocalDateTime createdAt
) {}
