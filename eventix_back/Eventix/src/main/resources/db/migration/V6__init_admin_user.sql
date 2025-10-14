INSERT INTO users (email, password_hash, role)
VALUES ('admin@test.com', '{bcrypt_hash_от_admin123}', 'ADMIN')
    ON CONFLICT DO NOTHING;
