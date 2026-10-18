import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import {
  asUser, availability, book, createService, createUser, errorCode, localDay, pool, resetData, slotAt,
  type TestUser,
} from './helpers';

let serviceId: string;
beforeEach(async () => {
  await resetData();
  serviceId = await createService();
});
afterAll(() => pool.end());

const cancel = (u: TestUser, id: string) =>
  asUser(u, (c) => c.query(`select public.cancel_booking($1)`, [id]));

describe('booking rules', () => {
  it('rejects slots in the past and inside the minimum notice', async () => {
    const u = await createUser();
    expect(await errorCode(book(u, await slotAt(await localDay(-1), '10:00'), serviceId))).toBe('SLOT_TOO_SOON');

    await pool.query(`update public.business_settings set min_notice_minutes = 4320`); // 3 days
    expect(await errorCode(book(u, await slotAt(await localDay(2), '10:00'), serviceId))).toBe('SLOT_TOO_SOON');
    expect(await errorCode(book(u, await slotAt(await localDay(4), '10:00'), serviceId))).toBe('OK');
  });

  it('rejects slots beyond the booking window (counted in Skopje days)', async () => {
    const u = await createUser();
    await pool.query(`update public.business_settings set booking_window_days = 2, min_notice_minutes = 0`);
    expect(await errorCode(book(u, await slotAt(await localDay(2), '17:30'), serviceId))).toBe('OK');
    expect(await errorCode(book(u, await slotAt(await localDay(3), '06:00'), serviceId))).toBe('SLOT_OUT_OF_WINDOW');
  });

  it('rejects times that are not on the slot grid or outside working hours', async () => {
    const u = await createUser();
    const day = await localDay(2);
    for (const t of ['05:30', '06:15', '18:00', '23:00']) {
      expect(await errorCode(book(u, await slotAt(day, t), serviceId))).toBe('SLOT_INVALID');
    }
    // A UTC-aligned time that is NOT a Skopje slot (e.g. 06:00 UTC = 08:00/07:00 local is fine, 06:10 UTC is not).
    expect(await errorCode(book(u, `${day}T06:10:00Z`, serviceId))).toBe('SLOT_INVALID');
  });

  it('rejects closed weekdays', async () => {
    const u = await createUser();
    const day = await localDay(2);
    await pool.query(`update public.working_hours set is_closed = true where weekday = extract(isodow from $1::date)`, [day]);
    expect(await errorCode(book(u, await slotAt(day, '10:00'), serviceId))).toBe('SLOT_INVALID');
  });

  it('one customer cannot hold two active bookings in the same slot (incl. double-tap race)', async () => {
    const u = await createUser();
    const slot = await slotAt(await localDay(2), '10:00');
    const results = await Promise.all([1, 2, 3].map(() => errorCode(book(u, slot, serviceId))));
    expect(results.filter((r) => r === 'OK')).toHaveLength(1);
    expect(results.filter((r) => r === 'ALREADY_BOOKED_SLOT')).toHaveLength(2);
  });

  it('limits active future bookings per customer (default 3), also under concurrency', async () => {
    const u = await createUser();
    const day = await localDay(2);
    await book(u, await slotAt(day, '06:00'), serviceId);
    await book(u, await slotAt(day, '06:30'), serviceId);
    const slots = await Promise.all(['07:00', '07:30', '08:00'].map((t) => slotAt(day, t)));
    const results = await Promise.all(slots.map((s) => errorCode(book(u, s, serviceId))));
    expect(results.filter((r) => r === 'OK')).toHaveLength(1);
    expect(results.filter((r) => r === 'TOO_MANY_BOOKINGS')).toHaveLength(2);

    await pool.query(`update public.business_settings set max_active_bookings = 5`);
    expect(await errorCode(book(u, await slotAt(day, '09:00'), serviceId))).toBe('OK');
  });

  it('requires an active service and a complete profile', async () => {
    const u = await createUser();
    const slot = await slotAt(await localDay(2), '10:00');
    await pool.query(`update public.services set active = false`);
    expect(await errorCode(book(u, slot, serviceId))).toBe('SERVICE_INVALID');
    await pool.query(`update public.services set active = true`);

    const apple = await createUser({ withPhone: false }); // Sign in with Apple, phone not set yet
    expect(await errorCode(book(apple, slot, serviceId))).toBe('PROFILE_INCOMPLETE');
  });

  it('customers can cancel only before the cancel deadline; owner can always cancel', async () => {
    const u = await createUser();
    const owner = await createUser({ role: 'owner' });
    const id = await book(u, await slotAt(await localDay(2), '10:00'), serviceId);

    await pool.query(`update public.business_settings set cancel_hours = 96`);
    expect(await errorCode(cancel(u, id))).toBe('CANCEL_TOO_LATE');
    expect(await errorCode(cancel(owner, id))).toBe('OK');
    expect(await errorCode(cancel(owner, id))).toBe('BOOKING_NOT_ACTIVE');

    await pool.query(`update public.business_settings set cancel_hours = 2`);
    const id2 = await book(u, await slotAt(await localDay(2), '11:00'), serviceId);
    expect(await errorCode(cancel(u, id2))).toBe('OK');
  });

  it("a customer cannot cancel someone else's booking", async () => {
    const [a, b] = [await createUser(), await createUser()];
    const id = await book(a, await slotAt(await localDay(2), '10:00'), serviceId);
    expect(await errorCode(cancel(b, id))).toBe('BOOKING_NOT_FOUND');
  });
});

describe('owner free time (blocks)', () => {
  const block = (owner: TestUser, args: unknown[]) =>
    asUser(owner, async (c) => (await c.query(`select public.owner_create_block($1, $2, $3, $4, $5) n`, args)).rows[0].n);

  it('blocks a whole day', async () => {
    const owner = await createUser({ role: 'owner' });
    const u = await createUser();
    const day = await localDay(4);
    await block(owner, [day, day, null, null, 'Holiday']);

    const slots = await availability(day);
    expect(slots.every((s) => s.status === 'blocked')).toBe(true);
    const cal = await pool.query(`select status from public.get_calendar($1::date, $1::date)`, [day]);
    expect(cal.rows[0].status).toBe('blocked');
    expect(await errorCode(book(u, await slotAt(day, '12:00'), serviceId))).toBe('SLOT_BLOCKED');
    // The next day is unaffected (block ends at local midnight).
    expect((await availability(await localDay(5))).every((s) => s.status === 'available')).toBe(true);
  });

  it('blocks a time range and a single slot, and reports affected bookings', async () => {
    const owner = await createUser({ role: 'owner' });
    const u = await createUser();
    const day = await localDay(4);
    await book(u, await slotAt(day, '10:30'), serviceId);

    const affected = await block(owner, [day, day, '10:00', '12:00', 'Lunch']);
    expect(affected).toBe(1);
    await block(owner, [day, day, '15:00', '15:30', null]);

    const blocked = (await availability(day)).filter((s) => s.status === 'blocked').map((s) => s.local_time);
    expect(blocked).toEqual(['10:00', '10:30', '11:00', '11:30', '15:00']);
  });

  it('customers cannot create or see blocks', async () => {
    const u = await createUser();
    const day = await localDay(4);
    expect(await errorCode(block(u, [day, day, null, null, null]))).toBe('NOT_ALLOWED');
    const owner = await createUser({ role: 'owner' });
    await block(owner, [day, day, null, null, 'Private reason']);
    const seen = await asUser(u, (c) => c.query(`select * from public.blocks`));
    expect(seen.rowCount).toBe(0);
  });
});
