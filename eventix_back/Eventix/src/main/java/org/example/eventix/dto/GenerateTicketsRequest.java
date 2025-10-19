package org.example.eventix.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import org.example.eventix.model.enums.TicketCategory;

import java.math.BigDecimal;

public record GenerateTicketsRequest(
        @NotNull @Min(1) Integer count,
        @NotNull TicketCategory category,
        BigDecimal cost
) {}
