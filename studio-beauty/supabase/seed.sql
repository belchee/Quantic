-- LOCAL DEVELOPMENT ONLY (applied by `supabase db reset`). Not for production.
-- Production services are entered by the owner in the app (Settings → Services).
insert into public.services (name_sq, name_mk, name_en, duration_minutes, sort) values
  ('Shërbim demo', 'Демо услуга', 'Demo service', 30, 1);
