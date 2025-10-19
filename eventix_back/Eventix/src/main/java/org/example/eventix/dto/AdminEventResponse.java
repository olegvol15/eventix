package org.example.eventix.dto;


import java.time.LocalDateTime;

public record AdminEventResponse(
        Long id,
        String name,
        LocalDateTime eventDate,
        String category,
        Long placeId,
        String placeName,
        String imageUrl,
        long ticketsTotal,
        long ticketsFree
) {}
