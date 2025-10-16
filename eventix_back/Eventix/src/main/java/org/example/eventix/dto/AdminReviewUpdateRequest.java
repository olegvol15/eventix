package org.example.eventix.dto;

public record AdminReviewUpdateRequest(
    String action,
    String moderatorNote
) {}

