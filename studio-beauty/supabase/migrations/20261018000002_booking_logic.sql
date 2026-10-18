-- Studio Beauty — availability & booking logic.
-- Error contract: functions raise exceptions whose MESSAGE is a stable code
-- (e.g. 'SLOT_FULL'); the app maps codes to translated messages.

-- ─── Role helper ────────────────────────────────────────────────────────────
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

-- ─── Settings snapshot ──────────────────────────────────────────────────────
create or replace function public._settings()
returns public.business_settings
language sql
stable
set search_path = ''
as $$
  select s from public.business_settings s where s.id;
$$;

-- Today's date in the business timezone (never the device's or server's).
create or replace function public.business_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone (select timezone from public.business_settings where id))::date;
$$;

-- ─── Slot grid for one local day ────────────────────────────────────────────
-- Returns every slot of p_date (local), with capacity, current count and
-- whether a block overlaps it. Empty when the weekday is closed.
create or replace function public._day_slots(p_date date)
returns table (
  slot_start  timestamptz,
  slot_end    timestamptz,
  local_time  time,
  capacity    integer,
  booked      integer,
  is_blocked  boolean
)
language sql
stable
set search_path = ''
as $$
  with s as (
    select * from public.business_settings where id
  ),
  day as (
    select
      coalesce(w.open_time,  s.open_time)  as o,
      coalesce(w.close_time, s.close_time) as c,
      coalesce(w.is_closed, false)         as closed,
      s.slot_minutes                       as m,
      s.slot_capacity                      as cap,
      s.timezone                           as tz
    from s
    left join public.working_hours w on w.weekday = extract(isodow from p_date)
  ),
  grid as (
    select
      ((p_date + d.o + make_interval(mins => g.i * d.m)) at time zone d.tz)       as slot_start,
      ((p_date + d.o + make_interval(mins => (g.i + 1) * d.m)) at time zone d.tz) as slot_end,
      (d.o + make_interval(mins => g.i * d.m))::time                              as local_time,
      d.cap
    from day d
    cross join lateral generate_series(
      0,
      floor(extract(epoch from (d.c - d.o)) / 60 / d.m)::int - 1
    ) as g(i)
    where not d.closed
  )
  select
    g.slot_start,
    g.slot_end,
    g.local_time,
    g.cap,
    coalesce(sc.booked, 0),
    exists (
      select 1 from public.blocks b
      where b.starts_at < g.slot_end and b.ends_at > g.slot_start
    )
  from grid g
  left join public.slot_counters sc on sc.slot_start = g.slot_start
  order by g.slot_start;
$$;

-- ─── Public availability (no personal data) ─────────────────────────────────
-- status: available | limited | full | blocked | unavailable (past / too soon / outside window)
create or replace function public.get_availability(p_date date)
returns table (
  slot_start  timestamptz,
  local_time  text,
  capacity    integer,
  remaining   integer,
  status      text
)
language sql
stable
security definer
set search_path = ''
as $$
  with s as (select * from public.business_settings where id)
  select
    d.slot_start,
    to_char(d.local_time, 'HH24:MI'),
    d.capacity,
    greatest(d.capacity - d.booked, 0),
    case
      when d.is_blocked then 'blocked'
      when d.slot_start < now() + make_interval(mins => s.min_notice_minutes)
        or p_date > public.business_today() + s.booking_window_days then 'unavailable'
      when d.booked >= d.capacity then 'full'
      when d.booked > 0 then 'limited'
      else 'available'
    end
  from public._day_slots(p_date) d, s;
$$;

-- ─── Calendar overview (for disabling days) ─────────────────────────────────
-- status: closed | blocked | full | unavailable | available
create or replace function public.get_calendar(p_from date, p_to date)
returns table (
  day              date,
  status           text,
  available_slots  integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_to < p_from or p_to - p_from > 62 then
    raise exception 'RANGE_INVALID';
  end if;

  return query
  select
    d::date,
    case
      when count(a.slot_start) = 0 then 'closed'
      when count(*) filter (where a.status = 'blocked') = count(a.slot_start) then 'blocked'
      when count(*) filter (where a.status in ('available', 'limited')) > 0 then 'available'
      when count(*) filter (where a.status = 'full') > 0
       and count(*) filter (where a.status = 'unavailable') = 0 then 'full'
      else 'unavailable'
    end,
    (count(*) filter (where a.status in ('available', 'limited')))::int
  from generate_series(p_from, p_to, interval '1 day') as d
  left join lateral public.get_availability(d::date) a on true
  group by d
  order by d;
end;
$$;

-- ─── Capacity enforcement (row lock on slot_counters) ───────────────────────
-- Runs for EVERY write to bookings, whoever performs it, so capacity can never
-- be exceeded even by owner/manual/service-role writes.
create or replace function public.tg_bookings_capacity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_was_active  boolean := tg_op in ('UPDATE', 'DELETE') and old.status = 'confirmed';
  v_is_active   boolean := tg_op in ('INSERT', 'UPDATE') and new.status = 'confirmed';
  v_booked      integer;
  v_capacity    integer;
begin
  -- Release the old seat (cancel / status change / move / delete).
  if v_was_active and (not v_is_active or old.slot_start <> new.slot_start) then
    update public.slot_counters
       set booked = booked - 1, updated_at = now()
     where slot_start = old.slot_start;
  end if;

  -- Take a seat.
  if v_is_active and (not v_was_active or old.slot_start <> new.slot_start) then
    select s.slot_capacity into v_capacity from public.business_settings s where s.id;

    insert into public.slot_counters as sc (slot_start, booked)
    values (new.slot_start, 1)
    on conflict (slot_start) do update
       set booked = sc.booked + 1, updated_at = now()
    returning sc.booked into v_booked;

    if v_booked > v_capacity then
      raise exception 'SLOT_FULL' using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger bookings_capacity
  before insert or update of status, slot_start or delete on public.bookings
  for each row execute function public.tg_bookings_capacity();

-- ─── Realtime signal bump ───────────────────────────────────────────────────
create or replace function public._bump_signal(p_ts timestamptz)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.availability_signals as a (day, version, changed_at)
  values ((p_ts at time zone (select timezone from public.business_settings where id))::date, 1, now())
  on conflict (day) do update set version = a.version + 1, changed_at = now();
$$;

create or replace function public.tg_bookings_signal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform public._bump_signal(old.slot_start);
  end if;
  if tg_op in ('INSERT', 'UPDATE') and (tg_op = 'INSERT' or new.slot_start <> old.slot_start) then
    perform public._bump_signal(new.slot_start);
  end if;
  return null;
end;
$$;
create trigger bookings_signal
  after insert or update of status, slot_start or delete on public.bookings
  for each row execute function public.tg_bookings_signal();

create or replace function public.tg_blocks_signal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
  d date;
  v_tz text := (select timezone from public.business_settings where id);
begin
  for r in
    select old.starts_at as s, old.ends_at as e where tg_op in ('UPDATE', 'DELETE')
    union all
    select new.starts_at, new.ends_at where tg_op in ('INSERT', 'UPDATE')
  loop
    for d in
      select generate_series((r.s at time zone v_tz)::date,
                             ((r.e - interval '1 microsecond') at time zone v_tz)::date,
                             interval '1 day')::date
    loop
      insert into public.availability_signals as a (day) values (d)
      on conflict (day) do update set version = a.version + 1, changed_at = now();
    end loop;
  end loop;
  return null;
end;
$$;
create trigger blocks_signal
  after insert or update or delete on public.blocks
  for each row execute function public.tg_blocks_signal();

-- ─── Validate a slot against the grid / blocks ──────────────────────────────
create or replace function public._resolve_slot(p_slot_start timestamptz)
returns table (local_date date, slot_minutes integer, is_blocked boolean)
language plpgsql
stable
set search_path = ''
as $$
declare
  v_tz    text    := (select timezone from public.business_settings where id);
  v_date  date    := (p_slot_start at time zone v_tz)::date;
  v_slot  record;
begin
  select d.* into v_slot from public._day_slots(v_date) d where d.slot_start = p_slot_start;
  if not found then
    raise exception 'SLOT_INVALID' using errcode = 'P0001';
  end if;
  return query
    select v_date, (extract(epoch from (v_slot.slot_end - v_slot.slot_start)) / 60)::int, v_slot.is_blocked;
end;
$$;

-- ─── Customer: create booking ───────────────────────────────────────────────
create or replace function public.create_booking(
  p_slot_start  timestamptz,
  p_service_id  uuid,
  p_notes       text default null
)
returns public.bookings
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := auth.uid();
  v_profile  public.profiles;
  v_s        public.business_settings := public._settings();
  v_slot     record;
  v_active   integer;
  v_row      public.bookings;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  -- Lock the customer's profile row: serializes concurrent requests from the
  -- same customer so the active-bookings limit cannot be raced.
  select * into v_profile from public.profiles where id = v_uid for update;
  if not found or v_profile.phone is null or char_length(trim(v_profile.full_name)) = 0 then
    raise exception 'PROFILE_INCOMPLETE' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.services where id = p_service_id and active) then
    raise exception 'SERVICE_INVALID' using errcode = 'P0001';
  end if;

  select * into v_slot from public._resolve_slot(p_slot_start);

  if p_slot_start < now() + make_interval(mins => v_s.min_notice_minutes) then
    raise exception 'SLOT_TOO_SOON' using errcode = 'P0001';
  end if;
  if v_slot.local_date > public.business_today() + v_s.booking_window_days then
    raise exception 'SLOT_OUT_OF_WINDOW' using errcode = 'P0001';
  end if;
  if v_slot.is_blocked then
    raise exception 'SLOT_BLOCKED' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.bookings
    where customer_id = v_uid and slot_start = p_slot_start and status = 'confirmed'
  ) then
    raise exception 'ALREADY_BOOKED_SLOT' using errcode = 'P0001';
  end if;

  select count(*) into v_active from public.bookings
  where customer_id = v_uid and status = 'confirmed' and slot_start > now();
  if v_active >= v_s.max_active_bookings then
    raise exception 'TOO_MANY_BOOKINGS' using errcode = 'P0001';
  end if;

  begin
    insert into public.bookings (customer_id, service_id, slot_start, slot_minutes, created_by, notes)
    values (v_uid, p_service_id, p_slot_start, v_slot.slot_minutes, v_uid, nullif(trim(p_notes), ''))
    returning * into v_row;  -- capacity enforced by trigger (SLOT_FULL)
  exception when unique_violation then
    raise exception 'ALREADY_BOOKED_SLOT' using errcode = 'P0001';
  end;

  return v_row;
end;
$$;

-- ─── Cancel (customer within rule, owner anytime) ───────────────────────────
create or replace function public.cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid    uuid := auth.uid();
  v_owner  boolean := public.is_owner();
  v_row    public.bookings;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  select * into v_row from public.bookings where id = p_booking_id for update;
  if not found or (not v_owner and v_row.customer_id is distinct from v_uid) then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_row.status <> 'confirmed' then
    raise exception 'BOOKING_NOT_ACTIVE' using errcode = 'P0001';
  end if;
  if not v_owner and v_row.slot_start - now() < make_interval(hours => (public._settings()).cancel_hours) then
    raise exception 'CANCEL_TOO_LATE' using errcode = 'P0001';
  end if;

  update public.bookings
     set status = 'cancelled', cancelled_by = v_uid, cancelled_at = now()
   where id = p_booking_id
  returning * into v_row;
  return v_row;
end;
$$;

-- ─── Owner: manual booking (client phoned) ──────────────────────────────────
-- Bypasses notice / window / per-customer limits, but NOT capacity or blocks.
create or replace function public.owner_create_booking(
  p_slot_start   timestamptz,
  p_service_id   uuid,
  p_customer_id  uuid default null,
  p_guest_name   text default null,
  p_guest_phone  text default null,
  p_notes        text default null
)
returns public.bookings
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid   uuid := auth.uid();
  v_slot  record;
  v_row   public.bookings;
begin
  if not public.is_owner() then
    raise exception 'NOT_ALLOWED' using errcode = 'P0001';
  end if;
  if p_customer_id is null and char_length(trim(coalesce(p_guest_name, ''))) = 0 then
    raise exception 'CLIENT_REQUIRED' using errcode = 'P0001';
  end if;
  if p_customer_id is not null and not exists (select 1 from public.profiles where id = p_customer_id) then
    raise exception 'CLIENT_REQUIRED' using errcode = 'P0001';
  end if;
  if p_service_id is not null and not exists (select 1 from public.services where id = p_service_id) then
    raise exception 'SERVICE_INVALID' using errcode = 'P0001';
  end if;

  select * into v_slot from public._resolve_slot(p_slot_start);
  if p_slot_start + make_interval(mins => v_slot.slot_minutes) <= now() then
    raise exception 'SLOT_TOO_SOON' using errcode = 'P0001';
  end if;
  if v_slot.is_blocked then
    raise exception 'SLOT_BLOCKED' using errcode = 'P0001';
  end if;

  begin
    insert into public.bookings (customer_id, guest_name, guest_phone, service_id, slot_start,
                                 slot_minutes, created_by, notes)
    values (p_customer_id,
            case when p_customer_id is null then trim(p_guest_name) end,
            case when p_customer_id is null then nullif(trim(p_guest_phone), '') end,
            p_service_id, p_slot_start, v_slot.slot_minutes, v_uid, nullif(trim(p_notes), ''))
    returning * into v_row;
  exception when unique_violation then
    raise exception 'ALREADY_BOOKED_SLOT' using errcode = 'P0001';
  end;
  return v_row;
end;
$$;

-- ─── Owner: mark completed / no-show (or revert to confirmed) ───────────────
create or replace function public.owner_set_booking_status(
  p_booking_id  uuid,
  p_status      public.booking_status
)
returns public.bookings
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_row public.bookings;
begin
  if not public.is_owner() then
    raise exception 'NOT_ALLOWED' using errcode = 'P0001';
  end if;
  if p_status = 'cancelled' then
    raise exception 'USE_CANCEL' using errcode = 'P0001';
  end if;

  update public.bookings set status = p_status where id = p_booking_id
  returning * into v_row;  -- reverting to confirmed re-checks capacity in trigger
  if not found then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0001';
  end if;
  return v_row;
end;
$$;

-- ─── Owner: free time ───────────────────────────────────────────────────────
-- Whole days:  p_start_time / p_end_time NULL → every day from p_start_date to p_end_date.
-- Time range:  times given → that range on each day from p_start_date to p_end_date.
-- Single slot: a time range of one slot length.
-- Returns the number of confirmed bookings inside the new blocks (they are kept;
-- the owner decides whether to cancel them).
create or replace function public.owner_create_block(
  p_start_date  date,
  p_end_date    date,
  p_start_time  time default null,
  p_end_time    time default null,
  p_reason      text default null
)
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_tz        text := (select timezone from public.business_settings where id);
  v_day       date;
  v_starts    timestamptz;
  v_ends      timestamptz;
  v_affected  integer := 0;
  v_n         integer;
begin
  if not public.is_owner() then
    raise exception 'NOT_ALLOWED' using errcode = 'P0001';
  end if;
  if p_end_date < p_start_date or p_end_date - p_start_date > 366 then
    raise exception 'RANGE_INVALID' using errcode = 'P0001';
  end if;
  if (p_start_time is null) <> (p_end_time is null)
     or (p_start_time is not null and p_end_time <= p_start_time) then
    raise exception 'RANGE_INVALID' using errcode = 'P0001';
  end if;

  if p_start_time is null then
    v_starts := p_start_date::timestamp at time zone v_tz;
    v_ends   := (p_end_date + 1)::timestamp at time zone v_tz;
    insert into public.blocks (starts_at, ends_at, reason, created_by)
    values (v_starts, v_ends, nullif(trim(p_reason), ''), auth.uid());
    select count(*) into v_affected from public.bookings
    where status = 'confirmed' and slot_start >= v_starts and slot_start < v_ends;
  else
    for v_day in select generate_series(p_start_date, p_end_date, interval '1 day')::date loop
      v_starts := (v_day + p_start_time) at time zone v_tz;
      v_ends   := (v_day + p_end_time) at time zone v_tz;
      insert into public.blocks (starts_at, ends_at, reason, created_by)
      values (v_starts, v_ends, nullif(trim(p_reason), ''), auth.uid());
      select count(*) into v_n from public.bookings b
      where b.status = 'confirmed' and b.slot_start < v_ends
        and b.slot_start + make_interval(mins => b.slot_minutes) > v_starts;
      v_affected := v_affected + v_n;
    end loop;
  end if;
  return v_affected;
end;
$$;

-- ─── Owner: dashboard numbers ───────────────────────────────────────────────
create or replace function public.owner_stats()
returns table (
  today_count          integer,
  week_count           integer,
  upcoming_count       integer,
  no_shows_30d         integer,
  cancellations_30d    integer,
  completed_30d        integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_tz     text := (select timezone from public.business_settings where id);
  v_today  date := public.business_today();
  v_week   date := date_trunc('week', v_today)::date;  -- ISO week, Monday
begin
  if not public.is_owner() then
    raise exception 'NOT_ALLOWED' using errcode = 'P0001';
  end if;
  return query
  select
    (count(*) filter (where b.status in ('confirmed', 'completed', 'no_show')
       and b.slot_start >= v_today::timestamp at time zone v_tz
       and b.slot_start <  (v_today + 1)::timestamp at time zone v_tz))::int,
    (count(*) filter (where b.status in ('confirmed', 'completed', 'no_show')
       and b.slot_start >= v_week::timestamp at time zone v_tz
       and b.slot_start <  (v_week + 7)::timestamp at time zone v_tz))::int,
    (count(*) filter (where b.status = 'confirmed' and b.slot_start > now()))::int,
    (count(*) filter (where b.status = 'no_show' and b.slot_start > now() - interval '30 days'))::int,
    (count(*) filter (where b.status = 'cancelled' and b.cancelled_at > now() - interval '30 days'))::int,
    (count(*) filter (where b.status = 'completed' and b.slot_start > now() - interval '30 days'))::int
  from public.bookings b;
end;
$$;

-- ─── Push token registration (re-assigns a device that changed account) ─────
create or replace function public.register_push_token(p_token text, p_platform text default 'ios')
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;
  insert into public.push_tokens (token, user_id, platform, updated_at)
  values (p_token, auth.uid(), p_platform, now())
  on conflict (token) do update
     set user_id = excluded.user_id, platform = excluded.platform, updated_at = now();
end;
$$;

create or replace function public.unregister_push_token(p_token text)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  delete from public.push_tokens where token = p_token and user_id = auth.uid();
$$;

-- ─── New auth user → profile ────────────────────────────────────────────────
-- Phone+password sign-up uses a derived login e-mail "<digits>@phone.<domain>",
-- so the profile phone is derived from the login identifier itself (not from
-- client-supplied metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_digits  text := substring(new.email from '^([1-9][0-9]{6,14})@phone\.');
  v_lang    text := new.raw_user_meta_data ->> 'language';
begin
  insert into public.profiles (id, full_name, phone, language)
  values (
    new.id,
    left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 80),
    case when v_digits is not null then '+' || v_digits end,
    case when v_lang in ('sq', 'mk', 'en') then v_lang::public.app_language else 'sq' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
