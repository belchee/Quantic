# Studio Beauty — booking app

iOS booking app for **Studio Beauty** (Fatlinde Berisha), Skopje. Clients book 30‑minute
slots themselves; the owner manages her day, free time and settings in the same app.

| Part | Tech | Folder |
|---|---|---|
| iOS app | Expo SDK 58, React Native 0.88, Expo Router, TypeScript, TanStack Query, react-hook-form + zod, i18next | [`mobile/`](mobile) |
| Backend | Supabase: Postgres (RLS, RPCs), Auth, Realtime, Edge Functions (Deno), pg_cron | [`supabase/`](supabase) |
| Legal/support site | Static HTML for Vercel (privacy, support, account deletion) | [`web/`](web) |
| Store listing | Name, descriptions SQ/MK/EN, keywords, review notes, screenshot list | [`docs/APP_STORE.md`](docs/APP_STORE.md) |

---

## 1. Folder structure

```
studio-beauty/
├── mobile/                         Expo app (routes live in src/app)
│   ├── app.config.ts               bundle id, permissions, privacy manifest, plugins
│   ├── eas.json                    build/submit profiles
│   ├── locales/                    localized iOS permission strings (sq/mk/en)
│   ├── assets/                     icon, splash (placeholder wordmark), notification icon
│   ├── scripts/                    check-release.mjs, generate-placeholder-assets.py
│   ├── tests/                      unit tests (dates, phone, translations)
│   └── src/
│       ├── app/                    ROUTES
│       │   ├── _layout.tsx         providers + role guard (Stack.Protected)
│       │   ├── (customer)/         tabs: Home · Book (services) · Appointments · Profile
│       │   ├── book/               time (calendar + live slots) → confirm → success
│       │   ├── auth/               sign-in · sign-up · complete-profile (modal)
│       │   ├── account/            edit profile · language
│       │   └── owner/              (tabs): Today · Calendar · Free time · Settings
│       │                           + new-booking, new-block, hours, rules, studio, services
│       ├── api/                    typed query/mutation hooks per domain
│       ├── components/ui/          design system (Text, Button, Card, Input, …)
│       ├── features/               auth, booking, owner, notifications, account
│       ├── i18n/                   sq (default), mk (Cyrillic), en + formatting
│       ├── lib/                    supabase client, env, dates, phone, errors
│       ├── theme/                  tokens (palette, type), light/dark provider
│       └── types/database.ts       DB types for supabase-js
├── supabase/
│   ├── migrations/                 schema → booking logic → notifications → security
│   ├── functions/                  delete-account · change-phone · dispatch-notifications
│   ├── tests/                      vitest + real Postgres (races, DST, RLS, rules)
│   ├── cron.sql                    pg_cron jobs (run once per project)
│   ├── seed.sql                    local dev only
│   └── config.toml
├── web/                            privacy.html · support.html · delete-account.html
├── scripts/create-demo-accounts.mjs App Review demo customer + demo owner
└── docs/APP_STORE.md
```

## 2. Database schema

```
auth.users ──1:1── profiles (id, full_name, phone UNIQUE, role customer|owner, language sq|mk|en)
                     │  └─< push_tokens (token PK, user_id, platform)        one row per device
                     │
                     └─< bookings (id, customer_id NULL→guest, guest_name, guest_phone,
                                   service_id, slot_start timestamptz, slot_minutes,
                                   status confirmed|cancelled|completed|no_show,
                                   created_by, cancelled_by, cancelled_at, notes,
                                   reminded_24h_at, reminded_2h_at)
                                   UNIQUE (customer_id, slot_start) WHERE confirmed
services (id, name_sq/mk/en, description_*, duration_minutes, price_mkd, active, sort)
business_settings (single row: open_time, close_time, slot_minutes, slot_capacity,
                   booking_window_days, min_notice_minutes, cancel_hours,
                   max_active_bookings, timezone, studio_name, address, contact_phone,
                   instagram, latitude, longitude)
working_hours (weekday 1–7 PK, open_time, close_time, is_closed)   NULL → settings default
blocks (id, starts_at, ends_at, reason)                             owner "free time"
slot_counters (slot_start PK, booked)                               capacity lock row
availability_signals (day PK, version)                              Realtime, no PII
notification_outbox (user_id, kind, booking_id, payload, sent_at)   push queue
```

Seeded defaults (in the migration, so every environment has them): 06:00–18:00,
30‑min slots, capacity 2, Mon–Sun open, window 30 days, notice 60 min, cancel 2 h,
max 3 upcoming bookings per client, timezone `Europe/Skopje`. Nothing is hard-coded in
the app — the owner changes all of it in **Settings**.

### RPCs (all `SECURITY DEFINER`, validated server-side)

| Function | Who | What |
|---|---|---|
| `get_availability(date)` | everyone (guests too) | slots with `remaining` and `status` available·limited·full·blocked·unavailable — no personal data |
| `get_calendar(from, to)` | everyone | per-day status for disabling closed/blocked/full days |
| `create_booking(slot_start, service_id, notes)` | customer | grid, notice, window, blocks, per-customer limits, capacity — atomically |
| `cancel_booking(id)` | customer (before deadline) / owner | frees the seat, notifies the other side |
| `owner_create_booking(…)` | owner | phone-in clients (registered or guest); obeys capacity & blocks |
| `owner_set_booking_status(id, status)` | owner | completed / no-show / restore |
| `owner_create_block(dates, times, reason)` | owner | whole days, time range, single slot; returns affected bookings |
| `owner_bookings(from, to)` · `owner_stats()` | owner | timeline/week view, today/week/no-show numbers |
| `business_today()` | everyone | "today" in Skopje — the app never uses device time for business dates |

### How overbooking is prevented

Every write that makes a booking `confirmed` (insert, status change, slot move — by
anyone, including service-role and owner writes) runs the `bookings_capacity` trigger,
which does `INSERT … ON CONFLICT DO UPDATE SET booked = booked + 1 RETURNING booked` on
the slot's `slot_counters` row and raises `SLOT_FULL` if the result exceeds capacity.
That row lock serializes concurrent bookers: under READ COMMITTED the second writer
waits and re-reads the committed count; under REPEATABLE READ it gets a serialization
error. A per-customer `FOR UPDATE` on the profile row prevents racing the active-booking
limit, and a partial unique index blocks double booking the same slot.
Tests prove it: 8 simultaneous clients → exactly 2 succeed; a lock-wait test shows the
3rd writer blocks until the first two commit; removing the trigger makes the tests fail.

### Time zone

All slot generation and rule checks use `business_settings.timezone` (Europe/Skopje)
wall time in Postgres (`(date + time) AT TIME ZONE tz`). The server returns local
strings (`local_time`, `local_date`), so the app does no time-zone math at all. Tests
cover both DST changes (24 slots, correct UTC instants) and a session running in UTC+14.

### Row Level Security

* Customers read only their own profile and bookings; they can update only `full_name`
  and `language` (role and phone are never writable from the client).
* The owner (`profiles.role = 'owner'`) reads everything and edits settings/services.
* Guests (`anon`) can read services, settings, hours and availability — nothing personal.
* `slot_counters` and `notification_outbox` are not reachable from clients at all.
* All functions are revoked from `public` by default and granted explicitly.

## 3. Key product decisions

* **Phone + password without SMS**: Supabase Auth is used with a derived identifier
  `<digits>@phone.studiobeauty.app` (e-mail confirmation off). No SMS provider/cost.
  The profile phone is derived from that identifier in the DB trigger, not from client
  metadata. *Trade-off:* no self-service password reset — clients call the studio
  (shown in the app). Phone changes go through the `change-phone` Edge Function.
* **Login only to confirm**: guests browse home, services, hours and live availability.
* **Notifications** go through an outbox table → `dispatch-notifications` (pg_cron, every
  minute): booking confirmed, cancelled by studio, reminders 24 h and 2 h before, and
  owner alerts for every new booking / cancellation. Messages are sent in each user's
  language. Personal data in the queue is cleared once delivered.
* **Account deletion** (Apple 5.1.1(v)) in Profile → Delete account: cancels future
  bookings, scrubs notes and tokens, deletes the auth user; past bookings stay anonymous.

## 4. Running locally

```bash
# Backend tests (needs any Postgres 15+; set TEST_DATABASE_URL if not localhost)
cd studio-beauty && npm install && npm test

# App
cd studio-beauty/mobile
npm install
cp .env.example .env        # fill in Supabase URL/key and web URL
npx expo run:ios            # or: eas build --profile development --platform ios
npm run typecheck && npx eslint . && npm test
```

CI (`.github/workflows/studio-beauty.yml`) runs the database tests against Postgres 16,
`deno check` on the Edge Functions, and typecheck/lint/unit tests for the app.

---

## 5. Go-live checklist

### Decisions needed from the client (blocking)
- [ ] **Bundle ID** — proposed `com.studiobeauty.app` (cannot change after the App Store record exists).
- [ ] **Services & prices** (names in SQ/MK/EN, optional MKD price) — entered by the owner in the app.
- [ ] **Logo & brand colours** — placeholder wordmark/monogram until then (`mobile/scripts/generate-placeholder-assets.py`, palette in `mobile/src/theme/tokens.ts`).
- [ ] **Apple Developer account owner** — individual (seller name = person) or organization (needs a D-U-N-S number; seller name = business).
- [ ] Studio address, public phone, Instagram handle, support e-mail (for the app and `web/`).

### Supabase
- [ ] Create project in an **EU region** (Frankfurt).
- [ ] Auth → Providers → Email: enabled, **Confirm email OFF**, min password length 8.
- [ ] Auth → Providers → Apple: enabled, add the bundle ID under *Client IDs* (native sign-in).
- [ ] `supabase link --project-ref <ref>` → `supabase db push` (applies `supabase/migrations`).
- [ ] Database → Publications: `supabase_realtime` contains `availability_signals`.
- [ ] Deploy functions: `supabase functions deploy delete-account change-phone dispatch-notifications`
- [ ] Secrets: `supabase secrets set CRON_SECRET=<random 32+ chars> EXPO_ACCESS_TOKEN=<optional>`
- [ ] Enable `pg_cron` + `pg_net`, then run `supabase/cron.sql` (replace `<PROJECT_REF>`, `<CRON_SECRET>`).
- [ ] Owner account: Fatlinde signs up in the app, then in SQL:
      `update public.profiles set role = 'owner' where phone = '+389…';`
- [ ] In the app as owner: Studio info (address, phone, Instagram, map coordinates), Working hours, Booking rules, Services.
- [ ] Demo accounts: `SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… DEMO_PASSWORD=… node scripts/create-demo-accounts.mjs`

### Environment variables
| Name | Where | Value |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `mobile/.env` + EAS env | `https://<ref>.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `mobile/.env` + EAS env | anon / publishable key |
| `EXPO_PUBLIC_WEB_URL` | `mobile/.env` + EAS env | Vercel URL of `web/` |
| `APP_BUNDLE_ID` | EAS env | confirmed bundle ID |
| `EAS_PROJECT_ID` | EAS env | from `eas init` (needed for push tokens) |
| `CRON_SECRET`, `EXPO_ACCESS_TOKEN` | Supabase function secrets | see above |

`eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value … --visibility plaintext`
(repeat for each; use `sensitive` visibility for keys).

### Web (Vercel)
- [ ] Replace `REPLACE_SUPPORT_EMAIL`, `REPLACE_STUDIO_PHONE`, `REPLACE_STUDIO_ADDRESS` in `web/*.html`.
- [ ] Vercel → New Project → root directory `studio-beauty/web`, framework *Other* → deploy.
- [ ] URLs for App Store Connect: `/privacy`, `/support` (and `/delete-account`).

### EAS
```bash
cd studio-beauty/mobile
npx eas-cli@latest login
npx eas-cli@latest init                       # → set EAS_PROJECT_ID
npx eas-cli@latest credentials -p ios         # let EAS create certs, profile and the APNs push key
npx eas-cli@latest build -p ios --profile development   # dev client for testing on device
npm run check:release                          # must pass before production
npx eas-cli@latest build -p ios --profile production
npx eas-cli@latest submit -p ios --latest      # fill ascAppId/appleTeamId in eas.json first
```

### App Store Connect
- [ ] Enroll in the Apple Developer Program (account owner decided above).
- [ ] My Apps → New App: platform iOS, name, primary language, bundle ID, SKU `studio-beauty-ios`.
- [ ] App Information: category **Lifestyle** (secondary: Health & Fitness optional), content rights, age rating (no objectionable content → 4+).
- [ ] Privacy Policy URL + Support URL (from `web/`).
- [ ] App Privacy: see `docs/APP_STORE.md` (Name, Phone Number, User ID — App Functionality, linked, no tracking).
- [ ] Pricing: Free · Availability: North Macedonia (+ others if wanted).
- [ ] Version page: screenshots (6.9" required), description, keywords, promotional text, support URL.
- [ ] App Review Information: demo customer + demo owner credentials and the notes in `docs/APP_STORE.md`.
- [ ] Export compliance: already declared (`usesNonExemptEncryption: false`).
- [ ] Submit for review. After approval, disable the demo owner if real client data exists:
      `node scripts/create-demo-accounts.mjs --disable-owner`.

## 6. Known limitations / next steps
* No self-service password reset (by design, no SMS/e-mail). A small owner tool to reset a client's password can be added.
* Push delivery uses Expo tickets only; receipts (for silent APNs failures) are not polled yet.
* With **Sign in with Apple** enabled, Supabase stores the (possibly relay) Apple e-mail → declare *Email Address* in the privacy labels, or disable Apple sign-in to keep the labels at Name/Phone/User ID.
* Translations (especially Macedonian) should be proof-read by a native speaker before release.
