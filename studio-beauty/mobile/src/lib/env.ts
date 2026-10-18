import { z } from 'zod';

const schema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  EXPO_PUBLIC_WEB_URL: z.url(), // static site with privacy / support / account deletion pages
});

// EXPO_PUBLIC_* must be referenced statically so Metro inlines them.
const parsed = schema.safeParse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_WEB_URL: process.env.EXPO_PUBLIC_WEB_URL,
});

if (!parsed.success) {
  throw new Error(
    'Missing Supabase configuration. Copy mobile/.env.example to .env (or set EAS environment variables).',
  );
}

export const env = {
  supabaseUrl: parsed.data.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.data.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  webUrl: parsed.data.EXPO_PUBLIC_WEB_URL.replace(/\/$/, ''),
};
