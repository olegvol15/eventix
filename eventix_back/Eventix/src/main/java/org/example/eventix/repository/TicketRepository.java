package org.example.eventix.repository;

import org.example.eventix.model.Ticket;
import org.example.eventix.model.enums.TicketCategory;
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

    @Query("""
        select coalesce(max(t.number), 0)
        from Ticket t
        where t.event.id = :eventId
          and t.category = :category
        """)
    int findMaxNumberByEventAndCategory(@Param("eventId") Long eventId,
                                        @Param("category") TicketCategory category);

    @Query("""
        select coalesce(max(t.number), 0)
        from Ticket t
        where t.event.id = :eventId
        """)
    int maxNumberForEvent(@Param("eventId") Long eventId);

    @Query(value = """
        SELECT t.*
        FROM tickets t
        WHERE t.event_id = :eventId
          AND t.category = :category
          AND t.status = 'FREE'
        ORDER BY t.id
        LIMIT :limit
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<Ticket> lockFreeForReservation(@Param("eventId") Long eventId,
                                        @Param("category") String category,
                                        @Param("limit") int limit);

    @Modifying
    @Query(value = """
        UPDATE tickets
        SET status = 'FREE',
            reservation_id = NULL,
            reserved_until = NULL,
            customer_email = NULL
        WHERE event_id = :eventId
          AND status = 'RESERVED'
          AND (reserved_until < now() OR reserved_until IS NULL)
          AND (:category IS NULL OR category = :category)
        """, nativeQuery = true)
    int releaseExpired(@Param("eventId") Long eventId,
                       @Param("category") String category);

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
        select count(t)
        from Ticket t
        where t.reservationId = :reservationId
        """)
    long countByReservation(@Param("reservationId") UUID reservationId);

    @Query(value = """
        SELECT COUNT(*)
        FROM tickets
        WHERE event_id = :eventId
          AND category = :category
          AND status = 'FREE'
        """, nativeQuery = true)
    long countFree(@Param("eventId") Long eventId,
                   @Param("category") String category);

    List<Ticket> findByEvent_IdAndStatus(Long eventId, TicketStatus status);

    long countByEvent_Id(Long eventId);

    long countByEvent_IdAndStatus(Long eventId, TicketStatus status);

    long countByEvent_IdAndStatusAndCategory(Long eventId,
                                             TicketStatus status,
                                             TicketCategory category);

    long countByEvent_IdAndCategory(@Param("eventId") Long eventId,
                                    @Param("category") TicketCategory category);
}




