import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/studio_beauty_test';

/** Recreates the test database: Supabase stand-in bootstrap + every migration, in order. */
export default async function setup() {
  const url = new URL(TEST_DATABASE_URL);
  const dbName = url.pathname.slice(1);
  const adminUrl = new URL(TEST_DATABASE_URL);
  adminUrl.pathname = '/postgres';

  const admin = new pg.Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  await admin.query(`drop database if exists ${dbName} with (force)`);
  await admin.query(`create database ${dbName}`);
  await admin.end();

  const db = new pg.Client({ connectionString: TEST_DATABASE_URL });
  await db.connect();
  db.on('notice', () => {});
  const root = join(import.meta.dirname, '..');
  await db.query(readFileSync(join(root, 'tests', 'bootstrap.sql'), 'utf8'));
  for (const file of readdirSync(join(root, 'migrations')).filter((f) => f.endsWith('.sql')).sort()) {
    await db.query(readFileSync(join(root, 'migrations', file), 'utf8'));
  }
  await db.end();
}
