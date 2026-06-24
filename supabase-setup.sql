-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Products table
create table if not exists products (
  id text primary key,
  name text not null,
  model text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  image text default '',
  short_desc text default '',
  specs text[] default '{}',
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- Categories table
create table if not exists categories (
  value text primary key,
  label text not null
);

-- Brands table
create table if not exists brands (
  name text primary key,
  tagline text not null,
  active boolean default true
);

-- Allow public read access
alter table products enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read brands" on brands for select using (true);

create policy "Service write products" on products for all using (true);
create policy "Service write categories" on categories for all using (true);
create policy "Service write brands" on brands for all using (true);

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict do nothing;

create policy "Public read product images" on storage.objects for select using (bucket_id = 'products');
create policy "Service upload product images" on storage.objects for insert with check (bucket_id = 'products');
create policy "Service delete product images" on storage.objects for delete using (bucket_id = 'products');

-- Seed categories
insert into categories (value, label) values
  ('bullet-cameras', 'Bullet Cameras'),
  ('dome-cameras', 'Dome Cameras'),
  ('ptz-cameras', 'PTZ Cameras'),
  ('nvr', 'NVR Recorders'),
  ('poe-switches', 'PoE Switches'),
  ('wifi-cameras', 'WiFi Cameras'),
  ('accessories', 'Accessories')
on conflict do nothing;

-- Seed brands
insert into brands (name, tagline, active) values
  ('TIANDY', 'AI-Powered Surveillance', true),
  ('DAHUA', 'Smart IoT Solutions', true),
  ('TVT', 'Professional CCTV', true),
  ('HIKVISION', 'Coming Soon', false),
  ('UNIVIEW', 'Coming Soon', false),
  ('AJAX', 'Coming Soon', false)
on conflict do nothing;
