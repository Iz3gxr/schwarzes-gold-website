-- Run this in your Supabase SQL editor (one time)

-- 1. Add optional `product` column to leads (form pre-fill from /katalog)
alter table public.leads add column if not exists product text;

-- 2. Products catalog table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null,
  brand text not null,
  product_name text not null,
  image_url text,
  status text not null default 'Sofort verfügbar',
  description text
);

-- (RLS is currently disabled per your earlier setup — same as leads.)
-- If you re-enable RLS later:
--   alter table public.products enable row level security;
--   create policy "public read products" on public.products for select to anon using (true);

-- 3. Seed 20 starter products
insert into public.products (category, brand, product_name, status) values
  ('Reifen & Räder','Continental','315/80 R22.5','Sofort verfügbar'),
  ('Reifen & Räder','Michelin','385/65 R22.5','Sofort verfügbar'),
  ('Reifen & Räder','Bridgestone','295/80 R22.5','Sofort verfügbar'),
  ('Reifen & Räder','Goodyear','315/70 R22.5','Auf Anfrage'),
  ('Reifen & Räder','Pirelli','315/80 R22.5','Sofort verfügbar'),
  ('Reifen & Räder','Hankook','295/75 R22.5','Sofort verfügbar'),
  ('Reifen & Räder','Falken','315/80 R22.5','Auf Anfrage'),
  ('Reifen & Räder','Yokohama','385/65 R22.5','Sofort verfügbar'),
  ('Motor & Antriebsstrang','Mann-Filter','Luftfilter Euro 6','Sofort verfügbar'),
  ('Motor & Antriebsstrang','Mahle','Ölfilter Standardtyp','Sofort verfügbar'),
  ('Motor & Antriebsstrang','ATE','Bremsflüssigkeit DOT 4','Sofort verfügbar'),
  ('Motor & Antriebsstrang','Liqui Moly','Diesel-Additiv 5L','Auf Anfrage'),
  ('Bremsanlage','Knorr-Bremse','Bremsbeläge Achse 1','Sofort verfügbar'),
  ('Bremsanlage','Knorr-Bremse','Bremsbeläge Achse 2/3','Sofort verfügbar'),
  ('Bremsanlage','Wabco','Bremsscheiben (Paar)','Auf Anfrage'),
  ('Bremsanlage','BPW','Bremstrommeln','Auf Anfrage'),
  ('Beleuchtung & Elektrik','Hella','LED Blinker 24V','Sofort verfügbar'),
  ('Beleuchtung & Elektrik','Osram','Arbeitsleuchte 24V','Sofort verfügbar'),
  ('Beleuchtung & Elektrik','Hella','Batteriekabel','Auf Anfrage'),
  ('Wartung & Verschleißteile','Bosch','Wartungsset','Auf Anfrage'),
  ('Wartung & Verschleißteile','Diverse','Ersatzteilkits','Auf Anfrage');
