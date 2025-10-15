create table reviews (
 id          bigserial primary key,
 event_id    bigint not null references events(id) on delete cascade,
 user_id     bigint not null references users(id) on delete cascade,
 rating      int    not null check (rating between 1 and 5),
 comment     text   not null,
 created_at  timestamp not null default now(),
 updated_at  timestamp not null default now()
);

create unique index ux_reviews_event_user on reviews(event_id, user_id);
create index ix_reviews_event_created on reviews(event_id, created_at desc);
