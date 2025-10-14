package org.example.eventix.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record AdminEventRequest(
        @NotBlank @Size(max = 200) String name,
        @NotNull LocalDateTime eventDate,
        @NotBlank String category,
        @NotNull Long placeId,
        @Size(max = 500) String imageUrl
) {}
