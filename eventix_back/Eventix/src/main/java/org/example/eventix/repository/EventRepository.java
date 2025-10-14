package org.example.eventix.repository;

import org.example.eventix.model.Event;
import org.example.eventix.model.enums.EventCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("""
       SELECT e
       FROM Event e
       WHERE (:namePattern IS NULL OR LOWER(e.name) LIKE :namePattern)
         AND (:category IS NULL OR e.category = :category)
       """)
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "place")
    Page<Event> findFiltered(
            @org.springframework.data.repository.query.Param("namePattern") String namePattern,
            @org.springframework.data.repository.query.Param("category") org.example.eventix.model.enums.EventCategory category,
            org.springframework.data.domain.Pageable pageable
    );


    @EntityGraph(attributePaths = "place")
    Optional<Event> findById(Long id);
}





