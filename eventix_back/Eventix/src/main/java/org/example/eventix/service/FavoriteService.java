package org.example.eventix.service;

import java.util.List;

import org.example.eventix.dto.FavoriteResponse;
import org.example.eventix.model.Event;
import org.example.eventix.model.Favorite;
import org.example.eventix.model.User;
import org.example.eventix.repository.EventRepository;
import org.example.eventix.repository.FavoriteRepository;
import org.example.eventix.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository favorites;
    private final EventRepository events;
    private final UserRepository users;

    public FavoriteService(FavoriteRepository favorites, EventRepository events, UserRepository users) {
        this.favorites = favorites;
        this.events = events;
        this.users = users;
    }

    private User currentUser(Authentication auth) {
        String email = auth.getName(); // subject = email
        return users.findByEmailIgnoreCase(email).orElseThrow();
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> list(Authentication auth) {
        User u = currentUser(auth);
        return favorites.findAllByUserOrderByIdDesc(u)
                .stream()
                .map(f -> toDto(f.getEvent()))
                .toList();
    }

    @Transactional
    public void add(Authentication auth, Long eventId) {
        User u = currentUser(auth);
        Event e = events.findById(eventId).orElseThrow();
        if (!favorites.existsByUserAndEvent(u, e)) {
            Favorite f = new Favorite();
            f.setUser(u);
            f.setEvent(e);
            favorites.save(f);
        }
    }

    @Transactional
    public void remove(Authentication auth, Long eventId) {
        User u = currentUser(auth);
        Event e = events.findById(eventId).orElseThrow();
        favorites.findByUserAndEvent(u, e).ifPresent(favorites::delete);
    }

    private FavoriteResponse toDto(Event e) {
        return new FavoriteResponse(
                e.getId(),
                e.getName(),
                e.getEventDate(),
                e.getCategory().name(),
                e.getPlace().getName(),
                e.getImageUrl()
        );
    }
}

