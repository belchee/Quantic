-- Studio Beauty — push notification outbox.
-- Triggers enqueue rows; the `dispatch-notifications` Edge Function (run every
-- minute by pg_cron, see supabase/cron.sql) claims, sends via Expo and marks them.

create or replace function public._booking_payload(b public.bookings)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'slot_start',  b.slot_start,
    'local_date',  to_char(b.slot_start at time zone s.timezone, 'YYYY-MM-DD'),
    'local_time',  to_char(b.slot_start at time zone s.timezone, 'HH24:MI'),
    'client_name', coalesce(p.full_name, b.guest_name),
    'service_sq',  sv.name_sq,
    'service_mk',  sv.name_mk,
    'service_en',  sv.name_en
  )
  from public.business_settings s
  left join public.profiles p on p.id = b.customer_id
  left join public.services sv on sv.id = b.service_id
  where s.id;
$$;

create or replace function public._enqueue_owner(p_kind text, b public.bookings)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notification_outbox (user_id, kind, booking_id, payload)
  select p.id, p_kind, b.id, public._booking_payload(b)
  from public.profiles p
  where p.role = 'owner';
$$;

create or replace function public.tg_bookings_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_is_owner boolean;
begin
  if tg_op = 'INSERT' and new.status = 'confirmed' then
    if new.customer_id is not null then
      insert into public.notification_outbox (user_id, kind, booking_id, payload)
      values (new.customer_id, 'booking_confirmed', new.id, public._booking_payload(new));
    end if;
    select exists (select 1 from public.profiles where id = new.created_by and role = 'owner')
      into v_actor_is_owner;
    if not v_actor_is_owner then
      perform public._enqueue_owner('owner_new_booking', new);
    end if;

  elsif tg_op = 'UPDATE' and old.status = 'confirmed' and new.status = 'cancelled' then
    select exists (select 1 from public.profiles where id = new.cancelled_by and role = 'owner')
      into v_actor_is_owner;
    if v_actor_is_owner then
      if new.customer_id is not null and new.slot_start > now() then
        insert into public.notification_outbox (user_id, kind, booking_id, payload)
        values (new.customer_id, 'booking_cancelled_by_studio', new.id, public._booking_payload(new));
      end if;
    else
      perform public._enqueue_owner('owner_booking_cancelled', new);
    end if;
  end if;
  return null;
end;
$$;

create trigger bookings_notify
  after insert or update of status on public.bookings
  for each row execute function public.tg_bookings_notify();

-- Called every few minutes by pg_cron. Idempotent (marks reminded_*_at).
create or replace function public.enqueue_due_reminders()
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_n1 integer;
  v_n2 integer;
begin
  with due as (
    update public.bookings b
       set reminded_24h_at = now()
     where b.status = 'confirmed'
       and b.customer_id is not null
       and b.reminded_24h_at is null
       and b.slot_start <= now() + interval '24 hours'
       and b.slot_start >  now() + interval '2 hours'
       and b.created_at <= b.slot_start - interval '24 hours'
    returning b.*
  )
  insert into public.notification_outbox (user_id, kind, booking_id, payload)
  select d.customer_id, 'reminder_24h', d.id, public._booking_payload(d::public.bookings) from due d;
  get diagnostics v_n1 = row_count;

  with due as (
    update public.bookings b
       set reminded_2h_at = now()
     where b.status = 'confirmed'
       and b.customer_id is not null
       and b.reminded_2h_at is null
       and b.slot_start <= now() + interval '2 hours'
       and b.slot_start >  now()
       and b.created_at <= b.slot_start - interval '2 hours'
    returning b.*
  )
  insert into public.notification_outbox (user_id, kind, booking_id, payload)
  select d.customer_id, 'reminder_2h', d.id, public._booking_payload(d::public.bookings) from due d;
  get diagnostics v_n2 = row_count;

  return v_n1 + v_n2;
end;
$$;

-- Claims a batch for sending (safe with concurrent dispatchers).
create or replace function public.claim_notifications(p_limit integer default 100)
returns table (
  id        bigint,
  user_id   uuid,
  kind      text,
  payload   jsonb,
  language  public.app_language,
  tokens    text[]
)
language sql
volatile
security definer
set search_path = ''
as $$
  with picked as (
    select o.id
    from public.notification_outbox o
    where o.sent_at is null
      and o.attempts < 5
      and (o.claimed_at is null or o.claimed_at < now() - interval '2 minutes')
    order by o.id
    limit p_limit
    for update skip locked
  ),
  claimed as (
    update public.notification_outbox o
       set attempts = o.attempts + 1, claimed_at = now()
      from picked
     where o.id = picked.id
    returning o.*
  )
  select c.id, c.user_id, c.kind, c.payload, p.language,
         coalesce(array_agg(t.token) filter (where t.token is not null), '{}')
  from claimed c
  join public.profiles p on p.id = c.user_id
  left join public.push_tokens t on t.user_id = c.user_id
  group by c.id, c.user_id, c.kind, c.payload, p.language;
$$;

-- ─── Account deletion support (service role only) ───────────────────────────
-- Cancels the user's future bookings and scrubs personal data before the
-- Edge Function deletes the auth user (which cascades to the profile).
create or replace function public.prepare_account_deletion(p_user_id uuid)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  update public.bookings
     set status = 'cancelled', cancelled_by = p_user_id, cancelled_at = now()
   where customer_id = p_user_id and status = 'confirmed' and slot_start > now();

  update public.bookings set notes = null where customer_id = p_user_id;
  delete from public.push_tokens where user_id = p_user_id;
  -- Owner notifications already queued keep only the snapshot needed to send them.
end;
$$;
