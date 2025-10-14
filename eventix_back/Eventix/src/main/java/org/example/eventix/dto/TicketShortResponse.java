package org.example.eventix.dto;

import org.example.eventix.model.enums.TicketCategory;
import java.math.BigDecimal;

public record TicketShortResponse(
        Long id,
        String number,
        BigDecimal cost,
        TicketCategory category
) {}

