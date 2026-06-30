-- Schwarzes Gold — Webshop-Upgrade
-- EINMALIG im Supabase SQL-Editor ausführen (Dashboard → SQL Editor → New query → einfügen → Run).
-- Fügt Galerie-Bilder, technische Daten und ein optionales Preisfeld hinzu
-- und legt einen Storage-Bucket für hochgeladene Produktbilder an.

-- 1) Neue Spalten für die Produkte
alter table public.products add column if not exists images text[] default '{}';
alter table public.products add column if not exists specs  jsonb   default '{}'::jsonb;
alter table public.products add column if not exists price  numeric;            -- leer = "Preis auf Anfrage"

-- 2) Storage-Bucket für Produktbilder (öffentlich lesbar, damit die Bilder auf der Website erscheinen)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 3) Zugriffsregeln für den Bucket (passend zu eurem aktuellen Setup ohne Kunden-Login)
drop policy if exists "sg product-images read"   on storage.objects;
drop policy if exists "sg product-images insert" on storage.objects;
drop policy if exists "sg product-images update" on storage.objects;
drop policy if exists "sg product-images delete" on storage.objects;

create policy "sg product-images read"   on storage.objects for select using      (bucket_id = 'product-images');
create policy "sg product-images insert" on storage.objects for insert with check  (bucket_id = 'product-images');
create policy "sg product-images update" on storage.objects for update using       (bucket_id = 'product-images');
create policy "sg product-images delete" on storage.objects for delete using       (bucket_id = 'product-images');
