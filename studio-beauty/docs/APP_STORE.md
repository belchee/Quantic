# App Store listing — Studio Beauty

> **Language note:** App Store Connect does not offer Albanian or Macedonian as listing
> localizations (verify in *App Information → Localizable Information* when creating the
> app). Use **English (U.K.)** as the primary listing language and include the Albanian
> and Macedonian text inside the description, as below. The app itself is fully
> localized (sq default, mk, en) and declares those languages in its Info.plist.

## Identity

| Field | Value | Limit |
|---|---|---|
| App name | **Studio Beauty Skopje** | 30 |
| Subtitle (EN) | Book your beauty appointment | 30 |
| Subtitle alt. (SQ) | Rezervo terminin tënd | 30 |
| Subtitle alt. (MK) | Закажи термин за убавина | 30 |
| Bundle ID | `com.studiobeauty.app` *(to be confirmed)* | — |
| SKU | `studio-beauty-ios` | — |
| Category | Lifestyle (secondary: Health & Fitness, optional) | — |
| Age rating | 4+ | — |
| Price | Free, no in-app purchases | — |

"Studio Beauty" alone is very likely taken on the App Store; the home-screen name stays
**Studio Beauty** (`CFBundleDisplayName`) regardless of the store name.

## Keywords (≤100 characters, comma-separated, no spaces)

```
beauty,salon,booking,appointment,Skopje,termin,rezervim,manikyr,nails,lashes,brows,закажи,салон
```
(95 characters — adjust once the service list is final, e.g. replace *lashes/brows* with actual services.)

## Promotional text (≤170)

**EN** — Book your appointment at Studio Beauty in seconds — see free times live, get reminders, cancel online.

## Description (single English-primary listing with SQ/MK sections)

```
Book your appointment at Studio Beauty in Skopje — anytime, in a few taps.

• See real-time availability for every 30-minute slot
• Choose your service, day and time — no calls or messages needed
• Instant confirmation and reminders 24 hours and 2 hours before
• Cancel online up to the studio's cancellation deadline
• Add appointments to your calendar
• Albanian, Macedonian and English · light and dark mode

Browse services and opening hours without an account; sign in with your phone number only when you confirm a booking.

— Shqip —
Rezervoni terminin tuaj në Studio Beauty, Shkup — kurdo, me disa prekje.
• Disponueshmëri e orareve në kohë reale
• Zgjidhni shërbimin, ditën dhe orën — pa telefonata e mesazhe
• Konfirmim i menjëhershëm dhe kujtesa 24 orë e 2 orë para terminit
• Anuloni online deri në afatin e studios
• Shtojeni terminin në kalendar

— Македонски —
Закажете термин во Studio Beauty, Скопје — во секое време, со неколку допири.
• Достапност на термините во живо
• Изберете услуга, ден и време — без повици и пораки
• Веднаш потврда и потсетници 24 часа и 2 часа пред терминот
• Онлајн откажување до рокот на студиото
• Додајте го терминот во календарот
```

## App Privacy ("nutrition labels")

| Data type | Collected | Linked to user | Tracking | Purpose |
|---|---|---|---|---|
| Contact Info → **Name** | Yes | Yes | No | App Functionality |
| Contact Info → **Phone Number** | Yes | Yes | No | App Functionality |
| Identifiers → **User ID** | Yes | Yes | No | App Functionality |
| Contact Info → Email Address | **Only if Sign in with Apple stays enabled** (Supabase stores the Apple / relay e-mail) | Yes | No | App Functionality |
| User Content → Other User Content | Optional booking note typed by the client — declare it, or remove the note field | Yes | No | App Functionality |

Not collected: location, contacts, photos, payments, browsing history, diagnostics,
advertising data. No third-party analytics or ads SDKs. "Data used to track you": **none**.
The privacy manifest (`app.config.ts → ios.privacyManifests`) matches this table.

## Screenshot checklist

Required size: **6.9" iPhone** (1320 × 2868 px, e.g. iPhone 16/17 Pro Max simulator).
iPad screenshots are not needed (`supportsTablet: false`). Take them in Albanian or English,
light mode, with realistic services and a few bookings from the demo accounts — no
placeholder text.

1. Home — wordmark, "Book appointment", opening hours, Directions/Call/Instagram
2. Services with prices
3. Date & time — calendar + live slots showing *2 left / 1 left / Full*
4. Confirm booking summary
5. Success screen ("You're booked!") with *Add to calendar*
6. My appointments (upcoming, cancel deadline visible)
7. Owner — Today timeline with names, phone, service
8. Owner — Free time (blocked day / time range)
9. (optional) Dark mode Home or Calendar

Optional caption ideas: "Book in seconds" · "Live availability" · "Reminders before every visit" · "Cancel online".

## App Review information

**Sign-in required:** yes — provide both accounts (created with `scripts/create-demo-accounts.mjs`).

| Account | Phone (enter in the "Phone number" field) | Password |
|---|---|---|
| Demo customer | 070 000 101 (+389 70 000 101) | *(DEMO_PASSWORD)* |
| Demo owner | 070 000 102 (+389 70 000 102) | *(DEMO_PASSWORD)* |

**Notes for the reviewer** (paste into *Notes*):

```
Studio Beauty is the booking app of a single beauty studio in Skopje, North Macedonia. Clients book 30-minute appointments; there are no payments or purchases.

LOGIN: Accounts use phone number + password (no SMS code is sent). Please type the phone number exactly as provided (e.g. 070 000 101) and the password.

CLIENT FLOW (demo customer): Book tab → choose a service → choose a day → choose a time (availability updates live; each slot has 2 places) → Confirm. The booking appears under Appointments, where it can be cancelled or added to the calendar.
Browsing works without an account; sign-in is only required to confirm a booking.

STUDIO OWNER (demo owner): the same app shows the owner interface for accounts with the owner role: Today timeline, Calendar (week/day), creating bookings for phone clients, blocking free time, and Settings (working hours, booking rules, services & prices).

ACCOUNT DELETION: Profile → Delete account (also documented at <WEB_URL>/delete-account). It deletes the account and personal data immediately.

NOTIFICATIONS: used only for booking confirmations, cancellations by the studio and appointment reminders. CALENDAR: write-only access, used only when the user taps "Add to calendar".

The app's default language is Albanian; the language can be changed in Profile → Language (Albanian, Macedonian, English).
```

## Before pressing "Submit for Review"
- [ ] `npm run check:release` passes (no placeholders, env set, eas.json filled)
- [ ] Real services and prices entered; studio address/phone/Instagram set
- [ ] Demo accounts work on a release build (TestFlight)
- [ ] Privacy & Support URLs open and show real contact details
- [ ] Logo/icon final (or the placeholder monogram is approved by the client)
