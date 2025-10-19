ALTER TABLE tickets
ALTER COLUMN number TYPE integer USING number::integer;

ALTER TABLE tickets
    ALTER COLUMN number SET NOT NULL;