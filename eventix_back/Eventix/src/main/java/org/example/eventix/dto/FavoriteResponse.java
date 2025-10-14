package org.example.eventix.dto;

import java.time.LocalDateTime;

public record FavoriteResponse(
        Long eventId,
        String name,
        LocalDateTime eventDate,
        String category,
        String placeName,
        String imageUrl
) {}
