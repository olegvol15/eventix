package org.example.eventix.service;

import org.example.eventix.dto.AdminReviewResponse;
import org.example.eventix.model.Review;
import org.example.eventix.model.enums.ReviewStatus;
import org.example.eventix.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminReviewService {

    private final ReviewRepository reviews;

    public AdminReviewService(ReviewRepository reviews) {
        this.reviews = reviews;
    }

    public Page<AdminReviewResponse> list(
            String q, String status, Long eventId, Long userId, Pageable pageable) {

        Specification<Review> spec = (root, cq, cb) -> cb.conjunction();

        if (status != null && !status.isBlank()) {
            spec = spec.and((r, cq2, cb2) -> cb2.equal(r.get("status"), ReviewStatus.valueOf(status)));
        }
        if (eventId != null) {
            spec = spec.and((r, cq2, cb2) -> cb2.equal(r.get("event").get("id"), eventId));
        }
        if (userId != null) {
            spec = spec.and((r, cq2, cb2) -> cb2.equal(r.get("user").get("id"), userId));
        }
        if (q != null && !q.isBlank()) {
            String like = "%" + q.toLowerCase() + "%";
            spec = spec.and((r, cq2, cb2) -> cb2.like(cb2.lower(r.get("comment")), like));
        }

        return reviews.findAll(spec, pageable).map(this::toResponse);
    }

    public AdminReviewResponse approve(Long id) {
        Review r = reviews.findById(id).orElseThrow();
        r.setStatus(ReviewStatus.APPROVED);
        return toResponse(reviews.save(r));
    }

    public AdminReviewResponse reject(Long id) {
        Review r = reviews.findById(id).orElseThrow();
        r.setStatus(ReviewStatus.REJECTED);
        return toResponse(reviews.save(r));
    }

    public void delete(Long id) {
        reviews.deleteById(id);
    }

    private AdminReviewResponse toResponse(Review r) {
        return new AdminReviewResponse(
                r.getId(),
                r.getEvent().getId(),
                r.getEvent().getName(),
                r.getUser().getId(),
                r.getUser().getEmail(),
                r.getRating(),
                r.getComment(),
                r.getStatus().name(),
                r.getCreatedAt()
        );
    }
}

