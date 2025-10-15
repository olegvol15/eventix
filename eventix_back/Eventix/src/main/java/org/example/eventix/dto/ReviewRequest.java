package org.example.eventix.dto;
import jakarta.validation.constraints.*;

public record ReviewRequest(
        @Min(1) @Max(5) int rating,
        @NotBlank String comment
) {}

