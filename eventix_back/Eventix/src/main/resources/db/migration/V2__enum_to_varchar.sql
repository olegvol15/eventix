
ALTER TABLE events
ALTER COLUMN category TYPE text USING category::text;

ALTER TABLE tickets
ALTER COLUMN category TYPE text USING category::text;

ALTER TABLE tickets
ALTER COLUMN status TYPE text USING status::text;
