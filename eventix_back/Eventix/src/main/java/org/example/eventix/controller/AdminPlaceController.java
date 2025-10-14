package org.example.eventix.controller;

import org.example.eventix.model.Place;
import org.example.eventix.repository.PlaceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/places")
public class AdminPlaceController {

    private final PlaceRepository places;

    public AdminPlaceController(PlaceRepository places) {
        this.places = places;
    }

    @GetMapping
    public Page<Place> list(
            @RequestParam(value = "q", required = false, defaultValue = "") String q,
            Pageable pageable
    ) {
        if (q == null || q.isBlank()) {
            return places.findAll(pageable);
        }
        return places.findByNameIgnoreCase(q, pageable);
    }
}


