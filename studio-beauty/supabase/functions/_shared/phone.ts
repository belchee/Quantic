/** Must match mobile/src/lib/phone.ts and handle_new_user() in the migrations. */
export const PHONE_LOGIN_DOMAIN = 'phone.studiobeauty.app';

export const E164 = /^\+[1-9][0-9]{6,14}$/;

export function loginEmailForPhone(e164: string): string {
  return `${e164.replace(/^\+/, '')}@${PHONE_LOGIN_DOMAIN}`;
}

export function isPhoneLoginEmail(email: string | undefined | null): boolean {
  return !!email && email.endsWith(`@${PHONE_LOGIN_DOMAIN}`);
}
