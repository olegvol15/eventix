package org.example.eventix.repository;

import java.util.List;
import java.util.Optional;
import org.example.eventix.model.Event;
import org.example.eventix.model.Favorite;
import org.example.eventix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndEvent(User user, Event event);
    Optional<Favorite> findByUserAndEvent(User user, Event event);
    List<Favorite> findAllByUserOrderByIdDesc(User user);
    void deleteByUserAndEvent(User user, Event event);
}
