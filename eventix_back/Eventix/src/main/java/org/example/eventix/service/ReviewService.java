package org.example.eventix.service;

import org.example.eventix.dto.ReviewRequest;
import org.example.eventix.dto.ReviewResponse;
import org.example.eventix.dto.ReviewSummary;
import org.example.eventix.model.Event;
import org.example.eventix.model.Review;
import org.example.eventix.model.User;
import org.example.eventix.repository.EventRepository;
import org.example.eventix.repository.ReviewRepository;
import org.example.eventix.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {
    private final ReviewRepository reviews;
    private final EventRepository events;
    private final UserRepository users;

    public ReviewService(ReviewRepository reviews, EventRepository events, UserRepository users) {
        this.reviews = reviews; this.events = events; this.users = users;
    }

    public Page<ReviewResponse> list(Long eventId, Pageable pageable) {
        return reviews.findByEvent_IdOrderByCreatedAtDesc(eventId, pageable).map(r ->
                new ReviewResponse(r.getId(), r.getRating(), r.getComment(), r.getUser().getEmail(), r.getCreatedAt()));
    }

    public ReviewSummary summary(Long eventId) {
        return new ReviewSummary(round1(reviews.avgRating(eventId)), reviews.countByEvent(eventId));
    }

    @Transactional
    public ReviewResponse create(Long eventId, String userEmail, ReviewRequest req) {
        Event e = events.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        User u = users.findByEmailIgnoreCase(userEmail).orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (reviews.existsByEvent_IdAndUser_Id(eventId, u.getId()))
            throw new IllegalStateException("You already left a review");

        Review r = new Review();
        r.setEvent(e); r.setUser(u);
        r.setRating(req.rating()); r.setComment(req.comment().trim());
        r = reviews.save(r);

        return new ReviewResponse(r.getId(), r.getRating(), r.getComment(), u.getEmail(), r.getCreatedAt());
    }

    @Transactional
    public void delete(Long reviewId, String userEmail, boolean isAdmin) {
        Review r = reviews.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!isAdmin && !r.getUser().getEmail().equalsIgnoreCase(userEmail))
            throw new AccessDeniedException("Not allowed");
        reviews.delete(r);
    }

    private double round1(double v) { return Math.round(v * 10.0) / 10.0; }
}

