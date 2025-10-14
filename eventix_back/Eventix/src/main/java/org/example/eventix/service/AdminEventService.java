package org.example.eventix.service;

import org.example.eventix.dto.AdminEventRequest;
import org.example.eventix.dto.AdminEventResponse;
import org.example.eventix.model.Event;
import org.example.eventix.model.Place;
import org.example.eventix.model.enums.EventCategory;
import org.example.eventix.repository.EventRepository;
import org.example.eventix.repository.PlaceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminEventService {

    private final EventRepository events;
    private final PlaceRepository places;

    public AdminEventService(EventRepository events, PlaceRepository places) {
        this.events = events;
        this.places = places;
    }

    public Page<AdminEventResponse> list(String name, String category, Pageable pageable) {
        String nameLower = (name == null || name.isBlank()) ? null : name.toLowerCase();
        String namePattern = (nameLower == null) ? null : "%" + nameLower + "%";
        EventCategory cat = parseNullable(category);
        return events.findFiltered(namePattern, cat, pageable)
                .map(this::toResponse);
    }

    public AdminEventResponse get(Long id) {
        Event e = events.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        return toResponse(e);
    }

    public AdminEventResponse create(AdminEventRequest req) {
        Place p = places.findById(req.placeId())
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + req.placeId()));

        Event e = new Event();
        e.setName(req.name());
        e.setEventDate(req.eventDate());
        e.setCategory(parseRequired(req.category()));
        e.setPlace(p);
        e.setImageUrl(req.imageUrl());
        return toResponse(events.save(e));
    }

    public AdminEventResponse update(Long id, AdminEventRequest req) {
        Event e = events.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        Place p = places.findById(req.placeId())
                .orElseThrow(() -> new IllegalArgumentException("Place not found: " + req.placeId()));

        e.setName(req.name());
        e.setEventDate(req.eventDate());
        e.setCategory(parseRequired(req.category()));
        e.setPlace(p);
        e.setImageUrl(req.imageUrl());
        return toResponse(events.save(e));
    }

    public void delete(Long id) {
        if (!events.existsById(id)) throw new IllegalArgumentException("Event not found: " + id);
        events.deleteById(id);
    }

    private EventCategory parseRequired(String raw) {
        try { return EventCategory.valueOf(raw.trim().toUpperCase()); }
        catch (Exception e) { throw new IllegalArgumentException("Unknown category: " + raw); }
    }

    private EventCategory parseNullable(String raw) {
        if (raw == null || raw.isBlank()) return null;
        return parseRequired(raw);
    }

    private AdminEventResponse toResponse(Event e) {
        return new AdminEventResponse(
                e.getId(),
                e.getName(),
                e.getEventDate(),
                e.getCategory().name(),
                e.getPlace().getId(),
                e.getPlace().getName(),
                e.getImageUrl()
        );
    }
}


