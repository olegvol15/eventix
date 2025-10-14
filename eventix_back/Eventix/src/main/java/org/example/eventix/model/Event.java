package org.example.eventix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.eventix.model.enums.EventCategory;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDateTime eventDate;

    @Enumerated(EnumType.STRING)
    private EventCategory category;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(name = "image_url")
    private String imageUrl;
}
