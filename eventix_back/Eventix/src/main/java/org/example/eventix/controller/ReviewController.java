package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.ReviewRequest;
import org.example.eventix.dto.ReviewResponse;
import org.example.eventix.dto.ReviewSummary;
import org.example.eventix.service.ReviewService;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events/{eventId}/reviews")
public class ReviewController {
    private final ReviewService service;
    public ReviewController(ReviewService service) { this.service = service; }

    @GetMapping
    public Page<ReviewResponse> list(@PathVariable Long eventId, Pageable pageable) {
        return service.list(eventId, pageable);
    }

    @GetMapping("/summary")
    public ReviewSummary summary(@PathVariable Long eventId) {
        return service.summary(eventId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse create(@PathVariable Long eventId,
                                 @Valid @RequestBody ReviewRequest req,
                                 Authentication auth) {
        return service.create(eventId, auth.getName(), req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId, @PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        service.delete(id, auth.getName(), isAdmin);
    }
}

