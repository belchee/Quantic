import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import pg from 'pg';
import {
  availability, book, createService, createUser, errorCode, impersonate, localDay, pool, resetData, slotAt,
  type TestUser,
} from './helpers';
import { TEST_DATABASE_URL } from './global-setup';

let serviceId: string;
beforeEach(async () => {
  await resetData();
  serviceId = await createService();
});
afterAll(() => pool.end());

async function seatCount(slot: string) {
  const { rows } = await pool.query(
    `select count(*)::int n from public.bookings where slot_start = $1 and status = 'confirmed'`,
    [slot],
  );
  return rows[0].n as number;
}

/** A dedicated connection with an open transaction, impersonating `user`. */
async function openTx(user: TestUser) {
  const c = new pg.Client({ connectionString: TEST_DATABASE_URL });
  await c.connect();
  await c.query('begin');
  await impersonate(c, user);
  const pidRes = await c.query('select pg_backend_pid() pid');
  return { c, pid: pidRes.rows[0].pid as number };
}

async function waitUntilBlocked(pid: number) {
  for (let i = 0; i < 100; i++) {
    const { rows } = await pool.query(`select wait_event_type from pg_stat_activity where pid = $1`, [pid]);
    if (rows[0]?.wait_event_type === 'Lock') return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`backend ${pid} never blocked on a lock`);
}

describe('slot capacity (2 per slot)', () => {
  it('accepts two clients, rejects the third, and shows Available → 1 left → Full', async () => {
    const day = await localDay(2);
    const slot = await slotAt(day, '10:00');
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];

    const status = async () => (await availability(day)).find((s) => s.local_time === '10:00')!;
    expect(await status()).toMatchObject({ status: 'available', remaining: 2 });

    await book(a, slot, serviceId);
    expect(await status()).toMatchObject({ status: 'limited', remaining: 1 });

    await book(b, slot, serviceId);
    expect(await status()).toMatchObject({ status: 'full', remaining: 0 });

    expect(await errorCode(book(c, slot, serviceId))).toBe('SLOT_FULL');
    expect(await seatCount(slot)).toBe(2);
  });

  it('frees a seat when a booking is cancelled', async () => {
    const slot = await slotAt(await localDay(2), '11:00');
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    const idA = await book(a, slot, serviceId);
    await book(b, slot, serviceId);

    await pool.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ sub: a.id })]);
    await pool.query(`select public.cancel_booking($1)`, [idA]);
    await pool.query(`select set_config('request.jwt.claims', '', false)`);

    await book(c, slot, serviceId);
    expect(await seatCount(slot)).toBe(2);
  });

  it('RACE: 8 clients booking the same slot at the same moment → exactly 2 succeed', async () => {
    const slot = await slotAt(await localDay(3), '09:30');
    const users = await Promise.all(Array.from({ length: 8 }, () => createUser()));

    const results = await Promise.all(users.map((u) => errorCode(book(u, slot, serviceId))));

    expect(results.filter((r) => r === 'OK')).toHaveLength(2);
    expect(results.filter((r) => r === 'SLOT_FULL')).toHaveLength(6);
    expect(await seatCount(slot)).toBe(2);
    const { rows } = await pool.query(`select booked from public.slot_counters where slot_start = $1`, [slot]);
    expect(rows[0].booked).toBe(2);
  });

  it('RACE (deterministic): concurrent writers serialize on the slot row lock; the 3rd sees the committed count', async () => {
    const slot = await slotAt(await localDay(3), '12:00');
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    const [txA, txB, txC] = [await openTx(a), await openTx(b), await openTx(c)];
    const sql = `select public.create_booking($1::timestamptz, $2::uuid)`;
    try {
      await txA.c.query(sql, [slot, serviceId]); // A holds the seat, uncommitted

      const pB = txB.c.query(sql, [slot, serviceId]);
      await waitUntilBlocked(txB.pid); // B cannot read a stale count: it waits for A
      await txA.c.query('commit');
      await pB; // B takes the 2nd seat

      const pC = errorCode(txC.c.query(sql, [slot, serviceId]));
      await waitUntilBlocked(txC.pid); // C waits for B
      await txB.c.query('commit');
      expect(await pC).toBe('SLOT_FULL');
      await txC.c.query('rollback');
    } finally {
      await Promise.all([txA.c.end(), txB.c.end(), txC.c.end()]);
    }
    expect(await seatCount(slot)).toBe(2);
  });

  it('RACE (deterministic): a rolled-back booking releases its seat to the waiting client', async () => {
    const slot = await slotAt(await localDay(3), '13:00');
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    await book(a, slot, serviceId); // 1 seat committed
    const [txB, txC] = [await openTx(b), await openTx(c)];
    const sql = `select public.create_booking($1::timestamptz, $2::uuid)`;
    try {
      await txB.c.query(sql, [slot, serviceId]); // 2nd seat, uncommitted
      const pC = errorCode(txC.c.query(sql, [slot, serviceId]));
      await waitUntilBlocked(txC.pid);
      await txB.c.query('rollback'); // e.g. network drop
      expect(await pC).toBe('OK');
      await txC.c.query('commit');
    } finally {
      await Promise.all([txB.c.end(), txC.c.end()]);
    }
    expect(await seatCount(slot)).toBe(2);
  });

  it('RACE under REPEATABLE READ: never overbooks (serialization failure instead)', async () => {
    const slot = await slotAt(await localDay(3), '14:00');
    const [a, b, c] = [await createUser(), await createUser(), await createUser()];
    await book(a, slot, serviceId);
    const mk = async (u: TestUser) => {
      const t = new pg.Client({ connectionString: TEST_DATABASE_URL });
      await t.connect();
      await t.query('begin isolation level repeatable read');
      await impersonate(t, u);
      await t.query('select 1'); // take the snapshot now
      return t;
    };
    const [tB, tC] = [await mk(b), await mk(c)];
    const sql = `select public.create_booking($1::timestamptz, $2::uuid)`;
    try {
      await tB.query(sql, [slot, serviceId]);
      const pC = errorCode(tC.query(sql, [slot, serviceId]));
      await tB.query('commit');
      expect(await pC).toMatch(/could not serialize|SLOT_FULL/);
      await tC.query('rollback');
    } finally {
      await Promise.all([tB.end(), tC.end()]);
    }
    expect(await seatCount(slot)).toBe(2);
  });

  it('capacity is enforced for owner manual bookings too', async () => {
    const slot = await slotAt(await localDay(2), '15:00');
    const owner = await createUser({ role: 'owner' });
    const [a, b] = [await createUser(), await createUser()];
    await book(a, slot, serviceId);
    await book(b, slot, serviceId);
    const res = await errorCode(
      pool.connect().then(async (c) => {
        try {
          await c.query('begin');
          await impersonate(c, owner);
          await c.query(`select public.owner_create_booking($1, $2, null, 'Phone Client', '+38970111222')`, [slot, serviceId]);
        } finally {
          await c.query('rollback');
          c.release();
        }
      }),
    );
    expect(res).toBe('SLOT_FULL');
  });

  it('capacity setting is read from the database (capacity 3)', async () => {
    await pool.query(`update public.business_settings set slot_capacity = 3`);
    const slot = await slotAt(await localDay(2), '16:00');
    const users = await Promise.all(Array.from({ length: 5 }, () => createUser()));
    const results = await Promise.all(users.map((u) => errorCode(book(u, slot, serviceId))));
    expect(results.filter((r) => r === 'OK')).toHaveLength(3);
  });
});
