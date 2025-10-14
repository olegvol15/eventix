alter table tickets
    add column if not exists reservation_id uuid,
    add column if not exists reserved_until timestamp,
    add column if not exists customer_email varchar(255);

create index if not exists idx_tickets_reservation on tickets(reservation_id);
