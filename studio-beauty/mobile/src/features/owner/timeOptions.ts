import { isoWeekday } from '@/lib/dates';
import { resolveHours } from '@/features/hours';
import type { BusinessSettings, WorkingHours } from '@/types/database';

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number) as [number, number];
  return h * 60 + m;
};
const toHhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Slot start times within a date's opening hours; `ends` are the matching range end options. */
export function timeOptions(settings: BusinessSettings, hours: WorkingHours[], date: string) {
  const day = resolveHours(settings, hours).find((d) => d.weekday === isoWeekday(date));
  const open = toMin(day?.open ?? settings.open_time.slice(0, 5));
  const close = toMin(day?.close ?? settings.close_time.slice(0, 5));
  const starts: string[] = [];
  for (let t = open; t + settings.slot_minutes <= close; t += settings.slot_minutes) starts.push(toHhmm(t));
  const ends = starts.map((s) => toHhmm(toMin(s) + settings.slot_minutes));
  return { starts, ends, closedDay: !day?.open };
}
