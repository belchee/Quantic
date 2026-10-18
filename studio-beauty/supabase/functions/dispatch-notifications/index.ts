// Runs every minute (pg_cron → net.http_post, see supabase/cron.sql):
//   1. enqueue due 24h / 2h reminders,
//   2. claim pending outbox rows,
//   3. send them through the Expo Push API,
//   4. mark sent / record errors, drop dead device tokens.
import { fail, json } from '../_shared/http.ts';
import { buildMessage, type Kind, type Lang, type Payload } from '../_shared/messages.ts';
import { admin } from '../_shared/supabase.ts';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CRON_SECRET = Deno.env.get('CRON_SECRET');
const EXPO_ACCESS_TOKEN = Deno.env.get('EXPO_ACCESS_TOKEN'); // optional (enhanced push security)

interface Claimed {
  id: number;
  user_id: string;
  kind: Kind;
  payload: Payload;
  language: Lang;
  tokens: string[];
}

interface ExpoTicket {
  status: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
}

Deno.serve(async (req) => {
  if (!CRON_SECRET || req.headers.get('x-cron-secret') !== CRON_SECRET) return fail('FORBIDDEN', 403);

  const { error: remErr } = await admin.rpc('enqueue_due_reminders');
  if (remErr) console.error('enqueue_due_reminders', remErr);

  const { data, error } = await admin.rpc('claim_notifications', { p_limit: 200 });
  if (error) {
    console.error('claim_notifications', error);
    return fail('CLAIM_FAILED', 500);
  }
  const rows = (data ?? []) as Claimed[];

  const messages: { outboxId: number; token: string; title: string; body: string; kind: Kind; bookingId?: string }[] = [];
  const noDevice: number[] = [];
  for (const row of rows) {
    if (row.tokens.length === 0) {
      noDevice.push(row.id);
      continue;
    }
    const { title, body } = buildMessage(row.kind, row.language, row.payload);
    for (const token of row.tokens) messages.push({ outboxId: row.id, token, title, body, kind: row.kind });
  }

  const failedOutbox = new Map<number, string>();
  const deadTokens: string[] = [];

  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(EXPO_ACCESS_TOKEN ? { Authorization: `Bearer ${EXPO_ACCESS_TOKEN}` } : {}),
        },
        body: JSON.stringify(
          chunk.map((m) => ({
            to: m.token,
            title: m.title,
            body: m.body,
            sound: 'default',
            priority: 'high',
            data: { kind: m.kind, url: m.kind.startsWith('owner_') ? '/owner' : '/appointments' },
          })),
        ),
      });
      if (!res.ok) throw new Error(`Expo push HTTP ${res.status}`);
      const { data: tickets } = (await res.json()) as { data: ExpoTicket[] };
      tickets.forEach((t, idx) => {
        if (t.status === 'error') {
          if (t.details?.error === 'DeviceNotRegistered') deadTokens.push(chunk[idx].token);
          else failedOutbox.set(chunk[idx].outboxId, t.message ?? 'error');
        }
      });
    } catch (e) {
      for (const m of chunk) failedOutbox.set(m.outboxId, String(e));
    }
  }

  const now = new Date().toISOString();
  const sentIds = rows.map((r) => r.id).filter((id) => !failedOutbox.has(id));
  if (sentIds.length) {
    // Payload holds a snapshot of personal data only until delivery.
    await admin.from('notification_outbox').update({ sent_at: now, payload: {}, last_error: null }).in('id', sentIds);
  }
  for (const [id, err] of failedOutbox) {
    await admin.from('notification_outbox').update({ last_error: err.slice(0, 500) }).eq('id', id);
  }
  if (deadTokens.length) await admin.from('push_tokens').delete().in('token', deadTokens);

  return json({ claimed: rows.length, sent: sentIds.length - noDevice.length, noDevice: noDevice.length, failed: failedOutbox.size });
});
