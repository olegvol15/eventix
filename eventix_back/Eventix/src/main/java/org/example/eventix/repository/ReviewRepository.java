package org.example.eventix.repository;

import org.example.eventix.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @EntityGraph(attributePaths = {"user"})
    Page<Review> findByEvent_IdOrderByCreatedAtDesc(Long eventId, Pageable pageable);

    boolean existsByEvent_IdAndUser_Id(Long eventId, Long userId);

    @Query("select coalesce(avg(r.rating),0) from Review r where r.event.id = :eventId")
    double avgRating(@Param("eventId") Long eventId);

    @Query("select count(r) from Review r where r.event.id = :eventId")
    long countByEvent(@Param("eventId") Long eventId);
}

