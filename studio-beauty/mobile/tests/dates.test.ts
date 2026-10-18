import { describe, expect, it } from 'vitest';
import { addDays, addMinutesToTime, addMonths, diffDays, isoWeekday, lastOfMonth, monthGrid, startOfWeek } from '@/lib/dates';

describe('date keys (device-timezone independent)', () => {
  it('adds days across month/year and DST boundaries', () => {
    expect(addDays('2026-10-24', 1)).toBe('2026-10-25');
    expect(addDays('2026-10-25', 1)).toBe('2026-10-26'); // Skopje DST change day
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
    expect(diffDays('2026-11-17', '2026-10-18')).toBe(30);
  });

  it('computes ISO weekdays and Monday week starts', () => {
    expect(isoWeekday('2026-10-19')).toBe(1); // Monday
    expect(isoWeekday('2026-10-25')).toBe(7); // Sunday
    expect(startOfWeek('2026-10-25')).toBe('2026-10-19');
  });

  it('builds a Monday-first month grid', () => {
    const grid = monthGrid('2026-11-15');
    expect(grid[0]).toEqual([null, null, null, null, null, null, '2026-11-01']); // Nov 1 2026 is a Sunday
    expect(grid.flat().filter(Boolean)).toHaveLength(30);
    expect(lastOfMonth('2028-02-10')).toBe('2028-02-29');
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-01');
  });

  it('adds minutes to wall-clock times', () => {
    expect(addMinutesToTime('17:30', 30)).toBe('18:00');
    expect(addMinutesToTime('06:00', 90)).toBe('07:30');
  });

  it('does not depend on the process time zone', () => {
    const before = process.env.TZ;
    process.env.TZ = 'Pacific/Kiritimati';
    expect(addDays('2026-10-25', 0)).toBe('2026-10-25');
    expect(isoWeekday('2026-10-25')).toBe(7);
    process.env.TZ = before;
  });
});
