import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { asUser, book, createService, createUser, localDay, pool, resetData, slotAt } from './helpers';

let serviceId: string;
beforeEach(async () => {
  await resetData();
  serviceId = await createService();
});
afterAll(() => pool.end());

const outbox = async () =>
  (await pool.query(`select user_id, kind, payload from public.notification_outbox order by id`)).rows;

describe('notification outbox', () => {
  it('customer booking → confirmation to customer + push to owner; owner cancel → customer notified', async () => {
    const owner = await createUser({ role: 'owner' });
    const u = await createUser({ name: 'Arta' });
    const day = await localDay(2);
    const id = await book(u, await slotAt(day, '10:00'), serviceId);

    let rows = await outbox();
    expect(rows.map((r) => [r.user_id, r.kind])).toEqual([
      [u.id, 'booking_confirmed'],
      [owner.id, 'owner_new_booking'],
    ]);
    expect(rows[1].payload).toMatchObject({ local_date: day, local_time: '10:00', client_name: 'Arta', service_en: 'Manicure' });

    await asUser(owner, (c) => c.query(`select public.cancel_booking($1)`, [id]));
    rows = await outbox();
    expect(rows[2]).toMatchObject({ user_id: u.id, kind: 'booking_cancelled_by_studio' });
  });

  it('customer cancel → owner notified; owner manual booking does not notify the owner', async () => {
    const owner = await createUser({ role: 'owner' });
    const u = await createUser();
    const id = await book(u, await slotAt(await localDay(2), '10:00'), serviceId);
    await asUser(u, (c) => c.query(`select public.cancel_booking($1)`, [id]));
    expect((await outbox()).at(-1)).toMatchObject({ user_id: owner.id, kind: 'owner_booking_cancelled' });

    await pool.query(`truncate public.notification_outbox`);
    const slot = await slotAt(await localDay(2), '11:00');
    await asUser(owner, (c) => c.query(`select public.owner_create_booking($1, $2, $3)`, [slot, serviceId, u.id]));
    expect((await outbox()).map((r) => [r.user_id, r.kind])).toEqual([[u.id, 'booking_confirmed']]);
  });

  it('enqueues 24h and 2h reminders exactly once', async () => {
    const u = await createUser();
    await pool.query(`update public.business_settings set min_notice_minutes = 0`);
    // Insert directly (as service) with created_at in the past so both reminders apply.
    const { rows } = await pool.query(
      `insert into public.bookings (customer_id, service_id, slot_start, slot_minutes, created_at)
       values ($1, $2, now() + interval '23 hours', 30, now() - interval '3 days'),
              ($1, $2, now() + interval '90 minutes', 30, now() - interval '3 days')
       returning id`,
      [u.id, serviceId],
    );
    await pool.query(`truncate public.notification_outbox`);
    expect((await pool.query(`select public.enqueue_due_reminders() n`)).rows[0].n).toBe(2);
    expect((await pool.query(`select public.enqueue_due_reminders() n`)).rows[0].n).toBe(0);
    const kinds = (await outbox()).map((r) => r.kind).sort();
    expect(kinds).toEqual(['reminder_24h', 'reminder_2h']);
    expect(rows).toHaveLength(2);
  });

  it('claim_notifications returns language + device tokens and is safe to call concurrently', async () => {
    const owner = await createUser({ role: 'owner' });
    const u = await createUser();
    await asUser(u, (c) => c.query(`select public.register_push_token('ExponentPushToken[abc]', 'ios')`));
    await book(u, await slotAt(await localDay(2), '10:00'), serviceId);
    await pool.query(`set role service_role`);
    const [r1, r2] = await Promise.all([
      pool.query(`select * from public.claim_notifications(10)`),
      pool.query(`select * from public.claim_notifications(10)`),
    ]);
    await pool.query(`reset role`);
    const all = [...r1.rows, ...r2.rows];
    expect(all).toHaveLength(2); // no duplicates
    const mine = all.find((r) => r.user_id === u.id)!;
    expect(mine).toMatchObject({ kind: 'booking_confirmed', language: 'sq', tokens: ['ExponentPushToken[abc]'] });
    expect(all.find((r) => r.user_id === owner.id)!.tokens).toEqual([]);
  });

  it('prepare_account_deletion cancels future bookings and frees seats', async () => {
    const u = await createUser();
    const slot = await slotAt(await localDay(2), '10:00');
    await book(u, slot, serviceId);
    await pool.query(`select public.prepare_account_deletion($1)`, [u.id]);
    await pool.query(`delete from auth.users where id = $1`, [u.id]);
    const b = await pool.query(`select status, customer_id from public.bookings`);
    expect(b.rows[0]).toEqual({ status: 'cancelled', customer_id: null });
    const sc = await pool.query(`select booked from public.slot_counters where slot_start = $1`, [slot]);
    expect(sc.rows[0].booked).toBe(0);
  });
});
