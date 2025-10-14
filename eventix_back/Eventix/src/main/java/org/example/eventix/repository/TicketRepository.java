package org.example.eventix.repository;

import org.example.eventix.model.Ticket;
import org.example.eventix.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query(value = """
        SELECT t.* FROM tickets t
        WHERE t.event_id = :eventId
          AND t.category = :category
          AND t.status = 'FREE'
        ORDER BY t.id
        LIMIT :limit
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<Ticket> lockFreeForReservation(
            @Param("eventId") Long eventId,
            @Param("category") String category,
            @Param("limit") int limit
    );

    @Modifying
    @Query(value = """
        UPDATE tickets
        SET status = 'FREE',
            reservation_id = NULL,
            reserved_until = NULL,
            customer_email = NULL
        WHERE event_id = :eventId
          AND (:category IS NULL OR category = :category)
          AND status = 'RESERVED'
          AND (reserved_until < now() OR reserved_until IS NULL)
        """, nativeQuery = true)
    int releaseExpired(
            @Param("eventId") Long eventId,
            @Param("category") String category
    );

    @Modifying
    @Query("""
        UPDATE Ticket t
        SET t.status = 'PURCHASED',
            t.reservationId = null,
            t.reservedUntil = null
        WHERE t.reservationId = :reservationId
        """)
    int purchaseByReservation(@Param("reservationId") UUID reservationId);

    @Query("""
        SELECT COUNT(t)
        FROM Ticket t
        WHERE t.reservationId = :reservationId
        """)
    long countByReservation(@Param("reservationId") UUID reservationId);

    List<Ticket> findByEvent_IdAndStatus(Long eventId, TicketStatus status);

    @Query(value = """
        SELECT COUNT(*) FROM tickets
        WHERE event_id = :eventId
          AND category = :category
          AND status = 'FREE'
        """, nativeQuery = true)
    long countFree(@Param("eventId") Long eventId,
                   @Param("category") String category);
}


