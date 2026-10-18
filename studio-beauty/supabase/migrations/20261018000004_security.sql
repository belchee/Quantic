-- Studio Beauty — Row Level Security & privileges.
-- Principle: customers read only their own data; all booking writes go through
-- SECURITY DEFINER RPCs that validate everything server-side.

alter table public.profiles              enable row level security;
alter table public.push_tokens           enable row level security;
alter table public.services              enable row level security;
alter table public.business_settings     enable row level security;
alter table public.working_hours         enable row level security;
alter table public.blocks                enable row level security;
alter table public.bookings              enable row level security;
alter table public.slot_counters         enable row level security;
alter table public.availability_signals  enable row level security;
alter table public.notification_outbox   enable row level security;

-- Start from zero, then grant precisely.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- ─── profiles ───────────────────────────────────────────────────────────────
grant select on public.profiles to authenticated;
grant update (full_name, language) on public.profiles to authenticated;  -- phone/role: never from client
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_owner()));
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- ─── push_tokens (via RPCs) ─────────────────────────────────────────────────
grant select on public.push_tokens to authenticated;
create policy push_tokens_select_own on public.push_tokens for select to authenticated
  using (user_id = (select auth.uid()));

-- ─── services ───────────────────────────────────────────────────────────────
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
create policy services_select on public.services for select to anon, authenticated
  using (active or (select public.is_owner()));
create policy services_owner_insert on public.services for insert to authenticated
  with check ((select public.is_owner()));
create policy services_owner_update on public.services for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));
create policy services_owner_delete on public.services for delete to authenticated
  using ((select public.is_owner()));

-- ─── business_settings ──────────────────────────────────────────────────────
grant select on public.business_settings to anon, authenticated;
grant update (open_time, close_time, slot_minutes, slot_capacity, booking_window_days,
              min_notice_minutes, cancel_hours, max_active_bookings, timezone,
              studio_name, address, contact_phone, instagram, latitude, longitude)
  on public.business_settings to authenticated;
create policy settings_select on public.business_settings for select to anon, authenticated
  using (true);
create policy settings_owner_update on public.business_settings for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));

-- ─── working_hours ──────────────────────────────────────────────────────────
grant select on public.working_hours to anon, authenticated;
grant update (open_time, close_time, is_closed) on public.working_hours to authenticated;
create policy hours_select on public.working_hours for select to anon, authenticated
  using (true);
create policy hours_owner_update on public.working_hours for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));

-- ─── blocks (owner only; customers see "blocked" via get_availability) ──────
grant select, delete on public.blocks to authenticated;
create policy blocks_owner_select on public.blocks for select to authenticated
  using ((select public.is_owner()));
create policy blocks_owner_delete on public.blocks for delete to authenticated
  using ((select public.is_owner()));

-- ─── bookings ───────────────────────────────────────────────────────────────
grant select on public.bookings to authenticated;
grant update (notes) on public.bookings to authenticated;
create policy bookings_select on public.bookings for select to authenticated
  using (customer_id = (select auth.uid()) or (select public.is_owner()));
create policy bookings_owner_update_notes on public.bookings for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));

-- ─── availability_signals (public, no PII; Realtime) ────────────────────────
grant select on public.availability_signals to anon, authenticated;
create policy signals_select on public.availability_signals for select to anon, authenticated
  using (true);

-- slot_counters, notification_outbox: no client access at all.

-- ─── Function privileges ────────────────────────────────────────────────────
grant execute on function public.is_owner()                                to anon, authenticated;
grant execute on function public.business_today()                          to anon, authenticated;
grant execute on function public.get_availability(date)                    to anon, authenticated;
grant execute on function public.get_calendar(date, date)                  to anon, authenticated;
grant execute on function public.create_booking(timestamptz, uuid, text)   to authenticated;
grant execute on function public.cancel_booking(uuid)                      to authenticated;
grant execute on function public.owner_create_booking(timestamptz, uuid, uuid, text, text, text) to authenticated;
grant execute on function public.owner_set_booking_status(uuid, public.booking_status)          to authenticated;
grant execute on function public.owner_create_block(date, date, time, time, text)               to authenticated;
grant execute on function public.owner_stats()                             to authenticated;
grant execute on function public.register_push_token(text, text)           to authenticated;
grant execute on function public.unregister_push_token(text)               to authenticated;
-- Service role (Edge Functions / cron) only:
grant execute on function public.enqueue_due_reminders()          to service_role;
grant execute on function public.claim_notifications(integer)     to service_role;
grant execute on function public.prepare_account_deletion(uuid)   to service_role;

-- Functions created later must not be callable by default.
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- ─── Realtime ───────────────────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.availability_signals;
  end if;
end;
$$;
