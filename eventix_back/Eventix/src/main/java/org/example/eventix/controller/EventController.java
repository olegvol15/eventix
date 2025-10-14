package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.EventResponse;
import org.example.eventix.model.enums.EventCategory;
import org.example.eventix.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public Page<EventResponse> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EventCategory category,
            @PageableDefault(sort = "eventDate", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return service.list(name, String.valueOf(category), pageable);
    }

    @GetMapping("/{id}")
    public EventResponse getOne(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<EventResponse> create(@RequestBody @Valid org.example.eventix.dto.EventRequest request) {
        EventResponse created = service.create(request);
        return ResponseEntity
                .created(java.net.URI.create("/api/v1/events/" + created.id()))
                .body(created);
    }
}



