create table if not exists users (
                                     id bigserial primary key,
                                     email varchar(120) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null
    );
