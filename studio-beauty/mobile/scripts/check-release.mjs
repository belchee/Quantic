#!/usr/bin/env node
// Fails a production build if anything placeholder-like would ship.
// Runs automatically on EAS (eas-build-pre-install) for the "production" profile,
// or manually: `npm run check:release` (loads .env if present).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const mobile = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(mobile, '..');
const onEas = process.env.EAS_BUILD === 'true';
if (onEas && process.env.EAS_BUILD_PROFILE !== 'production') process.exit(0);

if (existsSync(join(mobile, '.env'))) {
  for (const line of readFileSync(join(mobile, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const problems = [];
const need = (name, bad = []) => {
  const v = process.env[name];
  if (!v) problems.push(`${name} is not set`);
  else if (bad.some((b) => v.includes(b))) problems.push(`${name} still has a placeholder value (${v})`);
};

need('EXPO_PUBLIC_SUPABASE_URL', ['YOUR-PROJECT-REF', 'example']);
need('EXPO_PUBLIC_SUPABASE_ANON_KEY', ['YOUR-ANON', 'dummy']);
need('EXPO_PUBLIC_WEB_URL', ['example.com']);
need('EAS_PROJECT_ID');

const eas = readFileSync(join(mobile, 'eas.json'), 'utf8');
if (eas.includes('REPLACE_')) problems.push('eas.json: submit.production still contains REPLACE_ values (ascAppId / appleTeamId)');

const webDir = join(root, 'web');
if (existsSync(webDir)) {
  for (const f of readdirSync(webDir).filter((f) => f.endsWith('.html'))) {
    const tokens = [...new Set(readFileSync(join(webDir, f), 'utf8').match(/REPLACE_[A-Z_]+/g) ?? [])];
    if (tokens.length) problems.push(`web/${f}: fill in ${tokens.join(', ')}`);
  }
}

const localesDir = join(mobile, 'src', 'i18n', 'locales');
for (const f of readdirSync(localesDir)) {
  if (/lorem|ipsum|TODO/i.test(readFileSync(join(localesDir, f), 'utf8'))) {
    problems.push(`translations ${f} contain placeholder text`);
  }
}

if (problems.length) {
  console.error('\n✗ Release check failed:\n' + problems.map((p) => `  • ${p}`).join('\n') + '\n');
  process.exit(1);
}
console.log('✓ Release check passed');
