import pg from 'pg';
import { TEST_DATABASE_URL } from './global-setup';

export const pool = new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 20 });

let phoneSeq = 70_000_000;

export interface TestUser {
  id: string;
  phone: string;
}

/** Signs up a user the same way the app does (derived phone login e-mail). */
export async function createUser(
  opts: { name?: string; role?: 'customer' | 'owner'; withPhone?: boolean } = {},
): Promise<TestUser> {
  const digits = `389${phoneSeq++}`;
  const email = opts.withPhone === false ? `apple-${digits}@privaterelay.appleid.com` : `${digits}@phone.studiobeauty.app`;
  const { rows } = await pool.query<{ id: string }>(
    `insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`,
    [email, { full_name: opts.name ?? 'Test Client', language: 'sq' }],
  );
  const id = rows[0].id;
  if (opts.role === 'owner') {
    await pool.query(`update public.profiles set role = 'owner' where id = $1`, [id]);
  }
  return { id, phone: `+${digits}` };
}

/** Runs `fn` inside a transaction as the given user (like PostgREST does). */
export async function asUser<T>(
  user: TestUser | null,
  fn: (c: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query('begin');
    await impersonate(c, user);
    const result = await fn(c);
    await c.query('commit');
    return result;
  } catch (e) {
    await c.query('rollback').catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}

export async function impersonate(c: pg.PoolClient | pg.Client, user: TestUser | null) {
  if (user) {
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [
      JSON.stringify({ sub: user.id, role: 'authenticated' }),
    ]);
    await c.query('set local role authenticated');
  } else {
    await c.query(`select set_config('request.jwt.claims', '{"role":"anon"}', true)`);
    await c.query('set local role anon');
  }
}

/** Calls create_booking as `user`; resolves to the booking id or rejects with the error code. */
export async function book(user: TestUser, slotStart: string, serviceId: string): Promise<string> {
  return asUser(user, async (c) => {
    const { rows } = await c.query<{ id: string }>(
      `select (b).id from (select public.create_booking($1::timestamptz, $2::uuid) as b) x`,
      [slotStart, serviceId],
    );
    return rows[0].id;
  });
}

export async function errorCode(p: Promise<unknown>): Promise<string> {
  try {
    await p;
  } catch (e) {
    return (e as Error).message;
  }
  return 'OK';
}

export async function resetData() {
  await pool.query(`
    delete from auth.users;
    truncate public.bookings, public.slot_counters, public.blocks,
             public.notification_outbox, public.availability_signals, public.services restart identity cascade;
    update public.business_settings set
      open_time = '06:00', close_time = '18:00', slot_minutes = 30, slot_capacity = 2,
      booking_window_days = 30, min_notice_minutes = 60, cancel_hours = 2,
      max_active_bookings = 3, timezone = 'Europe/Skopje';
    update public.working_hours set open_time = null, close_time = null, is_closed = false;
  `);
}

export async function createService(): Promise<string> {
  const { rows } = await pool.query<{ id: string }>(
    `insert into public.services (name_sq, name_mk, name_en, price_mkd) values ('Manikyr', 'Маникир', 'Manicure', 800) returning id`,
  );
  return rows[0].id;
}

/** A local date N days after the business "today" (Europe/Skopje). */
export async function localDay(offset: number): Promise<string> {
  const { rows } = await pool.query<{ d: string }>(
    `select to_char(public.business_today() + $1::int, 'YYYY-MM-DD') as d`,
    [offset],
  );
  return rows[0].d;
}

/** The timestamptz (ISO) of local time HH:MM on a local date in Europe/Skopje. */
export async function slotAt(day: string, hhmm: string): Promise<string> {
  const { rows } = await pool.query<{ ts: Date }>(
    `select ($1::date + $2::time) at time zone 'Europe/Skopje' as ts`,
    [day, hhmm],
  );
  return rows[0].ts.toISOString();
}

export async function availability(day: string, asWho: TestUser | null = null) {
  return asUser(asWho, async (c) => {
    const { rows } = await c.query<{
      slot_start: Date;
      local_time: string;
      capacity: number;
      remaining: number;
      status: string;
    }>(`select * from public.get_availability($1::date)`, [day]);
    return rows;
  });
}
