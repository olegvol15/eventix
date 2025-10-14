CREATE TABLE IF NOT EXISTS favorites (
                                         id        BIGSERIAL PRIMARY KEY,
                                         user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id  BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE
    );

CREATE UNIQUE INDEX IF NOT EXISTS ux_favorites_user_event
    ON favorites(user_id, event_id);
