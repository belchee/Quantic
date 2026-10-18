import { FunctionsHttpError } from '@supabase/supabase-js';
import en from '@/i18n/locales/en.json';

export type ErrorCode = keyof typeof en.errors;

const KNOWN = new Set(Object.keys(en.errors));

/** Maps any Supabase / network error to a stable code with a translation in `errors.*`. */
export function errorCode(err: unknown): ErrorCode {
  if (!err) return 'UNKNOWN';
  const e = err as { message?: string; code?: string; name?: string; status?: number };
  const message = e.message ?? '';

  if (KNOWN.has(message)) return message as ErrorCode; // RPC exceptions raise the code as message

  // Auth (GoTrue) error codes
  switch (e.code) {
    case 'invalid_credentials':
      return 'INVALID_CREDENTIALS';
    case 'user_already_exists':
    case 'email_exists':
      return 'USER_EXISTS';
    case 'weak_password':
      return 'WEAK_PASSWORD';
    case '23505':
      return 'ALREADY_BOOKED_SLOT';
  }
  if (/network request failed|fetch failed|load failed/i.test(message)) return 'NETWORK';
  return 'UNKNOWN';
}

/** Edge Functions return `{ error: CODE }` with a non-2xx status. */
export async function functionErrorCode(err: unknown): Promise<ErrorCode> {
  if (err instanceof FunctionsHttpError) {
    try {
      const body = (await err.context.json()) as { error?: string };
      if (body.error && KNOWN.has(body.error)) return body.error as ErrorCode;
    } catch {
      // fall through
    }
  }
  return errorCode(err);
}

export class AppError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}
