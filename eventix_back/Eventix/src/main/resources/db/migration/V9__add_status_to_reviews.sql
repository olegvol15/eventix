ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS status text;
UPDATE reviews SET status = 'PENDING' WHERE status IS NULL;
ALTER TABLE reviews
    ALTER COLUMN status SET NOT NULL;
CREATE INDEX IF NOT EXISTS ix_reviews_event_status
    ON reviews (event_id, status);