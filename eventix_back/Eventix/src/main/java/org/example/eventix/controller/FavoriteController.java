package org.example.eventix.controller;

import java.util.List;
import org.example.eventix.dto.FavoriteResponse;
import org.example.eventix.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/favorites")
public class FavoriteController {

    private final FavoriteService service;

    public FavoriteController(FavoriteService service) {
        this.service = service;
    }

    @GetMapping
    public List<FavoriteResponse> list(Authentication auth) {
        return service.list(auth);
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<Void> add(@PathVariable Long eventId, Authentication auth) {
        service.add(auth, eventId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> remove(@PathVariable Long eventId, Authentication auth) {
        service.remove(auth, eventId);
        return ResponseEntity.noContent().build();
    }
}
