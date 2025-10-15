package org.example.eventix.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        int rating,
        String comment,
        String author,         // email или имя
        LocalDateTime createdAt
) {}

