import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';

/** Messages are translation keys (validation.*), resolved at render time. */
export const phoneField = z
  .string()
  .trim()
  .refine((v) => normalizePhone(v) !== null, 'validation.phoneInvalid')
  .transform((v) => normalizePhone(v)!);

export const nameField = z
  .string()
  .trim()
  .min(3, 'validation.nameShort')
  .max(80, 'validation.nameShort')
  .refine((v) => v.includes(' '), 'validation.nameShort');

export const passwordField = z.string().min(8, 'validation.passwordShort').max(72, 'validation.passwordShort');

export const signInSchema = z.object({ phone: phoneField, password: z.string().min(1, 'validation.required') });
export const signUpSchema = z.object({ fullName: nameField, phone: phoneField, password: passwordField });
export const profileSchema = z.object({ fullName: nameField, phone: phoneField });

export type SignInInput = z.input<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
