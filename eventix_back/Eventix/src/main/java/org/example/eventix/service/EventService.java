package org.example.eventix.service;

import org.example.eventix.dto.CategoryAvailabilityDto;
import org.example.eventix.dto.EventRequest;
import org.example.eventix.dto.EventResponse;
import org.example.eventix.exception.NotFoundException;
import org.example.eventix.model.Event;
import org.example.eventix.model.Place;
import org.example.eventix.model.enums.EventCategory;
import org.example.eventix.model.enums.TicketCategory;
import org.example.eventix.model.enums.TicketStatus;
import org.example.eventix.repository.EventRepository;
import org.example.eventix.repository.PlaceRepository;
import org.example.eventix.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final PlaceRepository placeRepository;
    private final TicketRepository ticketRepository;

    private static final Map<EventCategory, String> CATEGORY_IMG = Map.of(
            EventCategory.CONCERT,  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
            EventCategory.SPORT,    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
            EventCategory.THEATRE,  "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d",
            EventCategory.COMEDY,   "https://images.unsplash.com/photo-1515165562835-c3b8c8e0c9a0",
            EventCategory.FESTIVAL, "https://www.visit.alsace/wp-content/uploads/2018/11/festival-decibulles-2017-laurent-khram-longvixay-1-1600x900.jpg"
    );

    private static final String FALLBACK_IMG =
            "https://images.unsplash.com/photo-1525182008055-f88b95ff7980";

    public EventService(EventRepository eventRepository, PlaceRepository placeRepository,  TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.placeRepository = placeRepository;
        this.ticketRepository = ticketRepository;
    }

    public EventResponse create(EventRequest req) {
        Place place = placeRepository.findById(req.placeId())
                .orElseThrow(() -> new NotFoundException("Place not found"));

        EventCategory category = parseCategory(String.valueOf(req.category()));

        Event event = new Event();
        event.setName(req.name());
        event.setEventDate(req.eventDate());
        event.setCategory(category);
        event.setPlace(place);
        event.setImageUrl(pickImage(req.imageUrl(), category));

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public Page<EventResponse> list(String name, String category, Pageable pageable) {
        String nameLower = (name == null || name.isBlank()) ? null : name.toLowerCase();
        String namePattern = (nameLower == null) ? null : "%" + nameLower + "%";
        EventCategory cat = parseCategoryOrNull(category);
        return eventRepository.findFiltered(namePattern, cat, pageable)
                .map(this::toResponse);
    }


    public EventResponse get(Long id) {
        Event e = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        return toResponse(e);
    }

    private String pickImage(String provided, EventCategory category) {
        if (provided != null && !provided.isBlank()) {
            return provided.trim();
        }
        return CATEGORY_IMG.getOrDefault(category, FALLBACK_IMG);
    }

    private EventCategory parseCategory(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        try {
            return EventCategory.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown category: " + raw);
        }
    }

    private EventCategory parseCategoryOrNull(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return EventCategory.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private EventResponse toResponse(Event e) {
        return new EventResponse(
                e.getId(),
                e.getName(),
                e.getEventDate(),
                e.getCategory().name(),
                e.getPlace().getName(),
                e.getImageUrl()
        );
    }

    public List<CategoryAvailabilityDto> availabilityForEvent(Long eventId) {
        List<CategoryAvailabilityDto> out = new ArrayList<>();
        for (TicketCategory c : TicketCategory.values()) {
            long free  = ticketRepository.countByEvent_IdAndStatusAndCategory(eventId, TicketStatus.FREE, c);
            long total = ticketRepository.countByEvent_IdAndCategory(eventId, c);
            out.add(new CategoryAvailabilityDto(c.name(), free, total));
        }
        return out;
    }
}





