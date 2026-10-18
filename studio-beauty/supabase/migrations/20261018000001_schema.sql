-- Studio Beauty — core schema
-- All business times are interpreted in business_settings.timezone (Europe/Skopje).
-- Timestamps are stored as timestamptz (UTC on disk).

create extension if not exists pgcrypto;

-- ─── Types ──────────────────────────────────────────────────────────────────
create type public.app_role as enum ('customer', 'owner');
create type public.app_language as enum ('sq', 'mk', 'en');
create type public.booking_status as enum ('confirmed', 'cancelled', 'completed', 'no_show');

-- ─── Helpers ────────────────────────────────────────────────────────────────
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 80),
  phone       text unique check (phone ~ '^\+[1-9][0-9]{6,14}$'),
  role        public.app_role not null default 'customer',
  language    public.app_language not null default 'sq',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- One row per device. A user can have several devices (e.g. owner's iPhone + iPad).
create table public.push_tokens (
  token       text primary key check (char_length(token) <= 256),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  platform    text not null default 'ios' check (platform in ('ios', 'android')),
  updated_at  timestamptz not null default now()
);
create index push_tokens_user_idx on public.push_tokens (user_id);

-- ─── Services ───────────────────────────────────────────────────────────────
create table public.services (
  id                uuid primary key default gen_random_uuid(),
  name_sq           text not null check (char_length(name_sq) between 1 and 80),
  name_mk           text not null check (char_length(name_mk) between 1 and 80),
  name_en           text not null check (char_length(name_en) between 1 and 80),
  description_sq    text check (char_length(description_sq) <= 300),
  description_mk    text check (char_length(description_mk) <= 300),
  description_en    text check (char_length(description_en) <= 300),
  duration_minutes  integer check (duration_minutes between 5 and 480), -- informational only
  price_mkd         integer check (price_mkd >= 0),                     -- optional
  active            boolean not null default true,
  sort              integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index services_sort_idx on public.services (sort, created_at);
create trigger services_updated_at before update on public.services
  for each row execute function public.tg_set_updated_at();

-- ─── Business settings (single row) ─────────────────────────────────────────
create table public.business_settings (
  id                   boolean primary key default true check (id),
  open_time            time not null default '06:00',  -- default for working_hours
  close_time           time not null default '18:00',
  slot_minutes         integer not null default 30 check (slot_minutes between 10 and 240),
  slot_capacity        integer not null default 2  check (slot_capacity between 1 and 20),
  booking_window_days  integer not null default 30 check (booking_window_days between 0 and 365),
  min_notice_minutes   integer not null default 60 check (min_notice_minutes between 0 and 10080),
  cancel_hours         integer not null default 2  check (cancel_hours between 0 and 168),
  max_active_bookings  integer not null default 3  check (max_active_bookings between 1 and 50),
  timezone             text not null default 'Europe/Skopje',
  -- Public studio info (owner-editable, shown on Home)
  studio_name          text not null default 'Studio Beauty' check (char_length(studio_name) <= 80),
  address              text check (char_length(address) <= 200),
  contact_phone        text check (contact_phone ~ '^\+[1-9][0-9]{6,14}$'),
  instagram            text check (instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  latitude             double precision check (latitude between -90 and 90),
  longitude            double precision check (longitude between -180 and 180),
  updated_at           timestamptz not null default now(),
  check (open_time < close_time)
);
create trigger business_settings_updated_at before update on public.business_settings
  for each row execute function public.tg_set_updated_at();

create or replace function public.tg_validate_timezone()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform now() at time zone new.timezone;  -- raises on an unknown zone
  return new;
end;
$$;
create trigger business_settings_tz before insert or update of timezone on public.business_settings
  for each row execute function public.tg_validate_timezone();

-- ─── Working hours (ISO weekday 1 = Monday … 7 = Sunday) ────────────────────
-- NULL open/close fall back to business_settings.open_time / close_time.
create table public.working_hours (
  weekday     smallint primary key check (weekday between 1 and 7),
  open_time   time,
  close_time  time,
  is_closed   boolean not null default false,
  updated_at  timestamptz not null default now(),
  check (open_time is null or close_time is null or open_time < close_time)
);
create trigger working_hours_updated_at before update on public.working_hours
  for each row execute function public.tg_set_updated_at();

-- ─── Blocks ("free time": day off, time range, single slot) ────────────────
create table public.blocks (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text check (char_length(reason) <= 120),
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index blocks_range_idx on public.blocks (starts_at, ends_at);

-- ─── Bookings ───────────────────────────────────────────────────────────────
create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references public.profiles (id) on delete set null,
  -- For bookings the owner enters for a client who phoned and has no account:
  guest_name       text check (char_length(guest_name) <= 80),
  guest_phone      text check (guest_phone ~ '^\+[1-9][0-9]{6,14}$'),
  service_id       uuid references public.services (id) on delete restrict,
  slot_start       timestamptz not null,
  slot_minutes     integer not null check (slot_minutes > 0),  -- snapshot at booking time
  status           public.booking_status not null default 'confirmed',
  created_by       uuid references public.profiles (id) on delete set null,
  cancelled_by     uuid references public.profiles (id) on delete set null,
  cancelled_at     timestamptz,
  notes            text check (char_length(notes) <= 500),
  reminded_24h_at  timestamptz,
  reminded_2h_at   timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index bookings_slot_idx on public.bookings (slot_start) where status = 'confirmed';
create index bookings_customer_idx on public.bookings (customer_id, slot_start);
create index bookings_slot_all_idx on public.bookings (slot_start);
-- A customer can hold at most one active booking in the same slot.
create unique index bookings_one_active_per_customer_slot
  on public.bookings (customer_id, slot_start)
  where status = 'confirmed' and customer_id is not null;
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.tg_set_updated_at();

-- ─── Slot counters: the capacity lock ───────────────────────────────────────
-- One row per slot that has (had) bookings. Every transition into/out of
-- 'confirmed' updates this row, which takes a row lock. Concurrent bookings of
-- the same slot therefore serialize on this row, and the capacity check is
-- evaluated against the latest committed count (READ COMMITTED re-check), or
-- fails with a serialization error under REPEATABLE READ/SERIALIZABLE.
create table public.slot_counters (
  slot_start  timestamptz primary key,
  booked      integer not null default 0 check (booked >= 0),
  updated_at  timestamptz not null default now()
);

-- ─── Availability signals (Realtime, no personal data) ──────────────────────
-- Bumped whenever availability for a local day changes. Clients subscribe with
-- filter day=eq.YYYY-MM-DD and refetch get_availability().
create table public.availability_signals (
  day         date primary key,
  version     bigint not null default 1,
  changed_at  timestamptz not null default now()
);

-- ─── Notification outbox (processed by the dispatch-notifications function) ─
create table public.notification_outbox (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in (
                'booking_confirmed', 'booking_cancelled_by_studio',
                'reminder_24h', 'reminder_2h',
                'owner_new_booking', 'owner_booking_cancelled')),
  booking_id  uuid references public.bookings (id) on delete cascade,
  payload     jsonb not null default '{}'::jsonb,  -- cleared once sent
  attempts    integer not null default 0,
  claimed_at  timestamptz,
  sent_at     timestamptz,
  last_error  text,
  created_at  timestamptz not null default now()
);
create index notification_outbox_pending_idx on public.notification_outbox (id) where sent_at is null;

-- ─── Default data (required in every environment) ───────────────────────────
insert into public.business_settings (id) values (true) on conflict do nothing;
insert into public.working_hours (weekday)
  select generate_series(1, 7) on conflict do nothing;
