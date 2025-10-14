package org.example.eventix.controller;

import org.example.eventix.model.Place;
import org.example.eventix.repository.PlaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/places")
public class PlaceController {
    private final PlaceRepository repo;
    public PlaceController(PlaceRepository repo) { this.repo = repo; }

    @PostMapping
    public ResponseEntity<Place> create(@RequestBody Place place) {
        return ResponseEntity.ok(repo.save(place));
    }
}
