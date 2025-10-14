package org.example.eventix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.eventix.model.enums.TicketCategory;
import org.example.eventix.model.enums.TicketStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "tickets", uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "number"}))
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID reservationId;
    private Instant reservedUntil;
    private String customerEmail;

    @Column(nullable = false, length = 30)
    private String number;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.FREE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @Version
    private Integer version;

}




