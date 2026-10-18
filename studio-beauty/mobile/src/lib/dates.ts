/**
 * Calendar math on local date keys ("YYYY-MM-DD") — independent of the device
 * time zone. All business dates/times come from the server already converted to
 * Europe/Skopje (get_availability.local_time, bookings.local_date/local_time,
 * business_today()). Never derive a business date from `new Date()` on device.
 */
export type DateKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

function toUtc(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(d: Date): DateKey {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = toUtc(key);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtc(d);
}

export function diffDays(a: DateKey, b: DateKey): number {
  return Math.round((toUtc(a).getTime() - toUtc(b).getTime()) / 86_400_000);
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export function isoWeekday(key: DateKey): number {
  const wd = toUtc(key).getUTCDay();
  return wd === 0 ? 7 : wd;
}

export function startOfWeek(key: DateKey): DateKey {
  return addDays(key, 1 - isoWeekday(key));
}

export function parts(key: DateKey) {
  const [year, month, day] = key.split('-').map(Number) as [number, number, number];
  return { year, month, day };
}

export function monthKey(key: DateKey): string {
  return key.slice(0, 7);
}

export function firstOfMonth(key: DateKey): DateKey {
  return `${key.slice(0, 7)}-01`;
}

export function addMonths(key: DateKey, months: number): DateKey {
  const { year, month } = parts(key);
  const d = new Date(Date.UTC(year, month - 1 + months, 1));
  return fromUtc(d);
}

export function lastOfMonth(key: DateKey): DateKey {
  return addDays(addMonths(firstOfMonth(key), 1), -1);
}

/** 6×7 grid of date keys (Monday-first) covering the month of `key`, null outside the month. */
export function monthGrid(key: DateKey): (DateKey | null)[][] {
  const first = firstOfMonth(key);
  const last = lastOfMonth(key);
  const start = startOfWeek(first);
  const weeks: (DateKey | null)[][] = [];
  let cursor = start;
  while (weeks.length === 0 || cursor <= last) {
    const week: (DateKey | null)[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor >= first && cursor <= last ? cursor : null);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** "HH:MM" + minutes → "HH:MM" (wall clock, no date rollover expected inside opening hours). */
export function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number) as [number, number];
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

export function trimSeconds(time: string | null | undefined): string {
  return time ? time.slice(0, 5) : '';
}
