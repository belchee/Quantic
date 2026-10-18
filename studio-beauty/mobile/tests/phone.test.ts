import { describe, expect, it } from 'vitest';
import { formatPhone, loginEmailForPhone, normalizePhone } from '@/lib/phone';

describe('phone numbers', () => {
  it('normalizes Macedonian numbers in common formats to E.164', () => {
    expect(normalizePhone('070 123 456')).toBe('+38970123456');
    expect(normalizePhone('+389 70 123 456')).toBe('+38970123456');
    expect(normalizePhone('0038970123456')).toBe('+38970123456');
    expect(normalizePhone('075/123-456')).toBe('+38975123456');
  });

  it('accepts foreign numbers with a country code and rejects garbage', () => {
    expect(normalizePhone('+383 44 123 456')).toBe('+38344123456'); // Kosovo
    expect(normalizePhone('12')).toBeNull();
    expect(normalizePhone('abc')).toBeNull();
  });

  it('derives the login identifier expected by the database trigger', () => {
    expect(loginEmailForPhone('+38970123456')).toBe('38970123456@phone.studiobeauty.app');
    expect(formatPhone('+38970123456')).toBe('+389 70 123 456');
  });
});
