import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { asUser, book, createService, createUser, errorCode, localDay, pool, resetData, slotAt } from './helpers';

let serviceId: string;
beforeEach(async () => {
  await resetData();
  serviceId = await createService();
});
afterAll(() => pool.end());

describe('row level security', () => {
  it('customers see only their own bookings; owner sees all', async () => {
    const [a, b] = [await createUser(), await createUser()];
    const owner = await createUser({ role: 'owner' });
    const slot = await slotAt(await localDay(2), '10:00');
    await book(a, slot, serviceId);
    await book(b, slot, serviceId);

    const seenByA = await asUser(a, (c) => c.query(`select customer_id from public.bookings`));
    expect(seenByA.rows.map((r) => r.customer_id)).toEqual([a.id]);
    const seenByOwner = await asUser(owner, (c) => c.query(`select * from public.bookings`));
    expect(seenByOwner.rowCount).toBe(2);
  });

  it('guests (anon) can read availability and services but no bookings or profiles', async () => {
    const a = await createUser();
    await book(a, await slotAt(await localDay(2), '10:00'), serviceId);
    expect(await errorCode(asUser(null, (c) => c.query(`select * from public.bookings`)))).toMatch(/permission denied/);
    expect(await errorCode(asUser(null, (c) => c.query(`select * from public.profiles`)))).toMatch(/permission denied/);
    const services = await asUser(null, (c) => c.query(`select * from public.services`));
    expect(services.rowCount).toBe(1);
    const day = await localDay(2);
    const slots = await asUser(null, (c) => c.query(`select * from public.get_availability($1::date)`, [day]));
    expect(Object.keys(slots.rows[0]).sort()).toEqual(['capacity', 'local_time', 'remaining', 'slot_start', 'status']);
    expect(await errorCode(asUser(null, (c) => c.query(`select public.create_booking(now(), $1)`, [serviceId])))).toMatch(
      /permission denied/,
    );
  });

  it('customers cannot see other profiles, or change their role/phone', async () => {
    const [a, b] = [await createUser({ name: 'A' }), await createUser({ name: 'B' })];
    const seen = await asUser(a, (c) => c.query(`select id from public.profiles`));
    expect(seen.rows.map((r) => r.id)).toEqual([a.id]);

    expect(await errorCode(asUser(a, (c) => c.query(`update public.profiles set role = 'owner' where id = $1`, [a.id])))).toMatch(/permission denied/);
    expect(await errorCode(asUser(a, (c) => c.query(`update public.profiles set phone = '+38970000000' where id = $1`, [a.id])))).toMatch(/permission denied/);
    const upd = await asUser(a, (c) => c.query(`update public.profiles set full_name = 'Hacked' where id = $1`, [b.id]));
    expect(upd.rowCount).toBe(0);
    const ok = await asUser(a, (c) => c.query(`update public.profiles set full_name = 'Ana', language = 'mk' where id = $1`, [a.id]));
    expect(ok.rowCount).toBe(1);
  });

  it('profile phone comes from the login identifier, not client metadata', async () => {
    const { rows } = await pool.query(
      `insert into auth.users (email, raw_user_meta_data) values ('38975123456@phone.studiobeauty.app', '{"full_name":"X","phone":"+38970999999","role":"owner"}') returning id`,
    );
    const p = await pool.query(`select phone, role from public.profiles where id = $1`, [rows[0].id]);
    expect(p.rows[0]).toEqual({ phone: '+38975123456', role: 'customer' });
  });

  it('customers cannot write bookings directly or call owner/service functions', async () => {
    const a = await createUser();
    const slot = await slotAt(await localDay(2), '10:00');
    expect(await errorCode(asUser(a, (c) =>
      c.query(`insert into public.bookings (customer_id, slot_start, slot_minutes) values ($1, $2, 30)`, [a.id, slot]),
    ))).toMatch(/permission denied/);
    const id = await book(a, slot, serviceId);
    expect(await errorCode(asUser(a, (c) => c.query(`update public.bookings set status = 'completed' where id = $1`, [id])))).toMatch(/permission denied/);
    expect(await errorCode(asUser(a, (c) => c.query(`select public.owner_set_booking_status($1, 'no_show')`, [id])))).toBe('NOT_ALLOWED');
    expect(await errorCode(asUser(a, (c) => c.query(`select public.owner_stats()`)))).toBe('NOT_ALLOWED');
    expect(await errorCode(asUser(a, (c) => c.query(`select * from public.claim_notifications(10)`)))).toMatch(/permission denied/);
    expect(await errorCode(asUser(a, (c) => c.query(`select public.prepare_account_deletion($1)`, [a.id])))).toMatch(/permission denied/);
    expect(await errorCode(asUser(a, (c) => c.query(`select * from public.slot_counters`)))).toMatch(/permission denied/);
    expect(await errorCode(asUser(a, (c) => c.query(`update public.business_settings set slot_capacity = 10`)))).toBe('OK');
    const s = await pool.query(`select slot_capacity from public.business_settings`);
    expect(s.rows[0].slot_capacity).toBe(2); // RLS: 0 rows updated
  });

  it('owner can change settings and services', async () => {
    const owner = await createUser({ role: 'owner' });
    await asUser(owner, (c) => c.query(`update public.business_settings set slot_capacity = 3, cancel_hours = 4`));
    await asUser(owner, (c) => c.query(`update public.working_hours set is_closed = true where weekday = 7`));
    await asUser(owner, (c) => c.query(`insert into public.services (name_sq, name_mk, name_en, price_mkd) values ('Pedikyr','Педикир','Pedicure', 900)`));
    const s = await pool.query(`select slot_capacity, cancel_hours from public.business_settings`);
    expect(s.rows[0]).toEqual({ slot_capacity: 3, cancel_hours: 4 });
  });
});
