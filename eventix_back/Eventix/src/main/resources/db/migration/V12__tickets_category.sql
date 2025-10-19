ALTER TABLE tickets
ALTER COLUMN category TYPE text USING category::text;

UPDATE tickets SET category = 'STANDARD' WHERE category = '0';
UPDATE tickets SET category = 'VIP'      WHERE category = '1';
UPDATE tickets SET category = 'PREMIUM'  WHERE category = '2';
UPDATE tickets SET category = 'ECONOMY'  WHERE category = '3';
UPDATE tickets SET category = 'FANZONE'  WHERE category = '4';
