#!/usr/bin/env node
// Creates (or resets the password of) the two App Review demo accounts.
//
//   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//   DEMO_PASSWORD='choose-a-strong-one' node scripts/create-demo-accounts.mjs
//
// Optional: DEMO_CUSTOMER_PHONE (default +38970000101), DEMO_OWNER_PHONE (default +38970000102).
// Run from studio-beauty/ after `npm install` in mobile/ (uses its @supabase/supabase-js).
//
// To lock the demo owner between reviews (it can see client names/phones):
//   node scripts/create-demo-accounts.mjs --disable-owner
import { createRequire } from 'node:module';

const require = createRequire(new URL('../mobile/package.json', import.meta.url));
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.DEMO_PASSWORD;
const disableOwner = process.argv.includes('--disable-owner');
if (!url || !key || (!disableOwner && (!password || password.length < 8))) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and DEMO_PASSWORD (min 8 chars).');
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });
const DOMAIN = 'phone.studiobeauty.app'; // keep in sync with mobile/src/lib/phone.ts
const emailFor = (phone) => `${phone.replace('+', '')}@${DOMAIN}`;

const accounts = [
  { phone: process.env.DEMO_CUSTOMER_PHONE ?? '+38970000101', name: 'Demo Klient', role: 'customer' },
  { phone: process.env.DEMO_OWNER_PHONE ?? '+38970000102', name: 'Demo Pronare', role: 'owner' },
];

async function findUser(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email === email);
    if (hit || data.users.length < 1000) return hit;
  }
}

if (disableOwner) {
  const owner = await findUser(emailFor(accounts[1].phone));
  if (owner) await admin.auth.admin.updateUserById(owner.id, { ban_duration: '876000h' });
  console.log(owner ? '✓ demo owner disabled' : 'demo owner not found');
  process.exit(0);
}

for (const a of accounts) {
  const email = emailFor(a.phone);
  let user = await findUser(email);
  if (user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, { password, ban_duration: 'none' });
    if (error) throw error;
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: a.name, language: 'en' },
    });
    if (error) throw error;
    user = data.user;
  }
  const { error } = await admin.from('profiles').update({ role: a.role, full_name: a.name }).eq('id', user.id);
  if (error) throw error;
  console.log(`✓ ${a.role.padEnd(8)} ${a.phone}  (${user.id})`);
}
console.log('\nEnter these phone numbers + DEMO_PASSWORD in App Store Connect → App Review Information.');
