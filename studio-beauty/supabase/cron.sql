-- Run ONCE in the Supabase SQL editor after deploying the Edge Functions.
-- Requires the pg_cron and pg_net extensions (Database → Extensions).
-- Replace <PROJECT_REF> and <CRON_SECRET> (same value as the function secret).

create extension if not exists pg_cron;
create extension if not exists pg_net;

select vault.create_secret('<CRON_SECRET>', 'cron_secret');

select cron.schedule(
  'dispatch-notifications',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/dispatch-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body    := '{}'::jsonb,
    timeout_milliseconds := 20000
  );
  $$
);

-- Housekeeping: drop delivered notifications after 30 days.
select cron.schedule(
  'cleanup-notification-outbox',
  '17 3 * * *',
  $$ delete from public.notification_outbox where sent_at < now() - interval '30 days' $$
);
