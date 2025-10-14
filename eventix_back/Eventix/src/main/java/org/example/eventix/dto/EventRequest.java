package org.example.eventix.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.eventix.model.enums.EventCategory;

import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank String name,
        @NotNull @Future LocalDateTime eventDate,
        @NotNull EventCategory category,
        @NotNull Long placeId,
        String imageUrl
) {}
