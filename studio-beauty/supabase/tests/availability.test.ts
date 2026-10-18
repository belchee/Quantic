import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { availability, localDay, pool, resetData } from './helpers';

beforeEach(resetData);
afterAll(() => pool.end());

describe('slot grid', () => {
  it('generates 24 slots 06:00–17:30 every day of the week', async () => {
    for (let offset = 1; offset <= 7; offset++) {
      const slots = await availability(await localDay(offset));
      expect(slots).toHaveLength(24);
      expect(slots[0].local_time).toBe('06:00');
      expect(slots[23].local_time).toBe('17:30');
      expect(slots.every((s) => s.capacity === 2 && s.remaining === 2 && s.status === 'available')).toBe(true);
    }
  });

  it('uses Europe/Skopje wall time across the autumn DST change (2026-10-25)', async () => {
    // Window/notice do not matter for slot generation; widen the window so status is irrelevant.
    const before = await availability('2026-10-24'); // CEST, UTC+2
    const after = await availability('2026-10-25'); // CET,  UTC+1
    expect(before).toHaveLength(24);
    expect(after).toHaveLength(24);
    expect(before[0].slot_start.toISOString()).toBe('2026-10-24T04:00:00.000Z');
    expect(after[0].slot_start.toISOString()).toBe('2026-10-25T05:00:00.000Z');
    expect(after[23].slot_start.toISOString()).toBe('2026-10-25T16:30:00.000Z');
  });

  it('uses Europe/Skopje wall time across the spring DST change (2027-03-28)', async () => {
    const before = await availability('2027-03-27'); // CET
    const after = await availability('2027-03-28'); // CEST
    expect(before[0].slot_start.toISOString()).toBe('2027-03-27T05:00:00.000Z');
    expect(after[0].slot_start.toISOString()).toBe('2027-03-28T04:00:00.000Z');
    expect(after).toHaveLength(24);
  });

  it('follows working hours, closed weekdays, and slot length from the database', async () => {
    const day = await localDay(3);
    const { rows } = await pool.query(`select extract(isodow from $1::date)::int as wd`, [day]);
    const wd = rows[0].wd;

    await pool.query(`update public.working_hours set open_time = '09:00', close_time = '13:00' where weekday = $1`, [wd]);
    let slots = await availability(day);
    expect(slots.map((s) => s.local_time)).toEqual([
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    ]);

    await pool.query(`update public.business_settings set slot_minutes = 60, slot_capacity = 3`);
    slots = await availability(day);
    expect(slots.map((s) => s.local_time)).toEqual(['09:00', '10:00', '11:00', '12:00']);
    expect(slots[0].capacity).toBe(3);

    await pool.query(`update public.working_hours set is_closed = true where weekday = $1`, [wd]);
    expect(await availability(day)).toHaveLength(0);
    const cal = await pool.query(`select status from public.get_calendar($1::date, $1::date)`, [day]);
    expect(cal.rows[0].status).toBe('closed');
  });

  it('marks days beyond the booking window and past days as unavailable', async () => {
    await pool.query(`update public.business_settings set booking_window_days = 5`);
    const inside = await availability(await localDay(5));
    const outside = await availability(await localDay(6));
    const past = await availability(await localDay(-1));
    expect(inside.every((s) => s.status === 'available')).toBe(true);
    expect(outside.every((s) => s.status === 'unavailable')).toBe(true);
    expect(past.every((s) => s.status === 'unavailable')).toBe(true);
  });

  it('business_today() is the Skopje date, not the server/device date', async () => {
    const skopje = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Skopje', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    expect(await localDay(0)).toBe(skopje);

    // Run the session in a far-away zone: the result must not change.
    const c = await pool.connect();
    try {
      await c.query(`set timezone = 'Pacific/Kiritimati'`); // UTC+14
      const { rows } = await c.query(`select to_char(public.business_today(), 'YYYY-MM-DD') d`);
      expect(rows[0].d).toBe(skopje);
      const slots = await c.query(`select * from public.get_availability(public.business_today() + 1)`);
      expect(slots.rows[0].local_time).toBe('06:00');
    } finally {
      await c.query('reset timezone');
      c.release();
    }
  });
});
