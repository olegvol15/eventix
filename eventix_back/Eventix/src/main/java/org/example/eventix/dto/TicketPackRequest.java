package org.example.eventix.dto;

import org.example.eventix.model.enums.TicketCategory;

public record TicketPackRequest(
        TicketCategory category,
        Double cost,
        Integer count
) {}

