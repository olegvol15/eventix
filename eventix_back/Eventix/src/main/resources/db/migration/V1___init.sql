DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_category') THEN
CREATE TYPE event_category AS ENUM ('CONCERT','SPORT','THEATER','CINEMA','CONFERENCE');
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_category') THEN
CREATE TYPE ticket_category AS ENUM ('VIP','PREMIUM','STANDARD','ECONOMY','FANZONE');
END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
CREATE TYPE ticket_status AS ENUM ('FREE','SOLD');
END IF;
END$$;

CREATE TABLE IF NOT EXISTS customers (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(40),
    password_hash VARCHAR(255) NOT NULL,
    roles         VARCHAR(120) NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS places (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(180) NOT NULL UNIQUE,
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS events (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    event_date  TIMESTAMP    NOT NULL,
    category    event_category NOT NULL,
    place_id    BIGINT NOT NULL REFERENCES places(id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_events_place_date
    ON events(place_id, date(event_date));

CREATE INDEX IF NOT EXISTS ix_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS ix_events_name ON events(lower(name));

CREATE TABLE IF NOT EXISTS tickets (
   id          BIGSERIAL PRIMARY KEY,
   number      VARCHAR(30) NOT NULL,
    cost        NUMERIC(10,2) NOT NULL CHECK (cost >= 0),
    status      ticket_status NOT NULL DEFAULT 'FREE',
    category    ticket_category NOT NULL,
    event_id    BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
    version     INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_tickets_event_number
    ON tickets(event_id, number);

CREATE INDEX IF NOT EXISTS ix_tickets_event_status
    ON tickets(event_id, status);