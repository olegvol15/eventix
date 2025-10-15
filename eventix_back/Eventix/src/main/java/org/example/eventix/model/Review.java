package org.example.eventix.model;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity @Table(name = "reviews",
        uniqueConstraints = @UniqueConstraint(name="ux_reviews_event_user", columnNames = {"event_id","user_id"}))
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false) private Integer rating; // 1..5
    @Column(nullable = false, columnDefinition = "text") private String comment;

    @Column(name="created_at", nullable=false) private LocalDateTime createdAt;
    @Column(name="updated_at", nullable=false) private LocalDateTime updatedAt;

    @PrePersist void prePersist() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void preUpdate()  { updatedAt = LocalDateTime.now(); }
}

