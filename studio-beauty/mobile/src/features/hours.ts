import { trimSeconds } from '@/lib/dates';
import type { BusinessSettings, WorkingHours } from '@/types/database';

export interface DayHours {
  weekday: number;
  open: string | null; // null = closed
  close: string | null;
}

export function resolveHours(settings: BusinessSettings, rows: WorkingHours[]): DayHours[] {
  return [1, 2, 3, 4, 5, 6, 7].map((weekday) => {
    const r = rows.find((w) => w.weekday === weekday);
    if (r?.is_closed) return { weekday, open: null, close: null };
    return {
      weekday,
      open: trimSeconds(r?.open_time ?? settings.open_time),
      close: trimSeconds(r?.close_time ?? settings.close_time),
    };
  });
}

/** True when every day has the same opening hours. */
export function sameEveryDay(days: DayHours[]): boolean {
  return days.every((d) => d.open !== null && d.open === days[0]?.open && d.close === days[0]?.close);
}
