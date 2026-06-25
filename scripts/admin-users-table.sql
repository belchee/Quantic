-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  session_token text,
  created_at timestamptz DEFAULT now()
);

-- Disable RLS (this table is only accessed server-side via service role key)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Also add brand column to products if not already done
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text DEFAULT '';
