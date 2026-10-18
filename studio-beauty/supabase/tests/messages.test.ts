import { describe, expect, it } from 'vitest';
import { buildMessage, formatDay } from '../functions/_shared/messages';

describe('push notification texts', () => {
  const payload = { local_date: '2026-11-03', local_time: '09:30', client_name: 'Arta', service_sq: 'Manikyr', service_mk: 'Маникир', service_en: 'Manicure' };

  it('formats dates per language', () => {
    expect(formatDay('2026-11-03', 'sq')).toBe('3 nëntor');
    expect(formatDay('2026-11-03', 'mk')).toBe('3 ноември');
    expect(formatDay('2026-11-03', 'en')).toBe('November 3');
  });

  it('builds localized messages with the Skopje local time', () => {
    expect(buildMessage('booking_confirmed', 'sq', payload)).toEqual({
      title: 'Termini u konfirmua',
      body: '3 nëntor, ora 09:30 · Manikyr. Ju presim!',
    });
    expect(buildMessage('owner_new_booking', 'mk', payload).body).toBe('Arta · 3 ноември, 09:30 · Маникир');
    expect(buildMessage('reminder_2h', 'en', payload).body).toContain('09:30');
  });

  it('falls back to Albanian for unknown languages', () => {
    expect(buildMessage('reminder_24h', 'de' as never, payload).title).toBe('Kujtesë për terminin');
  });
});
