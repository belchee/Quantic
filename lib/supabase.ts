import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — for browser/read access
export const supabase = createClient(url, anonKey);

// Service client — for server-side writes (bypasses RLS)
export const supabaseAdmin = createClient(url, serviceKey ?? anonKey);
