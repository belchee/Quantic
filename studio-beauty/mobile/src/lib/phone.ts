import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

/** Must match supabase/functions/_shared/phone.ts and handle_new_user(). */
export const PHONE_LOGIN_DOMAIN = 'phone.studiobeauty.app';
export const DEFAULT_COUNTRY: CountryCode = 'MK';

/** Parses user input ("070 123 456", "+389 70 123 456", "0038970…") into E.164, or null. */
export function normalizePhone(input: string, country: CountryCode = DEFAULT_COUNTRY): string | null {
  const cleaned = input.trim().replace(/^00/, '+');
  const parsed = parsePhoneNumberFromString(cleaned, country);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number;
}

/** The login identifier used for phone + password auth (no SMS required). */
export function loginEmailForPhone(e164: string): string {
  return `${e164.replace(/^\+/, '')}@${PHONE_LOGIN_DOMAIN}`;
}

export function formatPhone(e164: string | null | undefined): string {
  if (!e164) return '';
  const parsed = parsePhoneNumberFromString(e164);
  return parsed ? parsed.formatInternational() : e164;
}
