package org.example.eventix.repository;

import org.example.eventix.model.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    Page<Place> findByNameIgnoreCase(String name, Pageable pageable);
}
