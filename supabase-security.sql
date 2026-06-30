-- Schwarzes Gold — Sicherheits-Härtung vor dem Launch
-- EINMALIG im Supabase SQL-Editor ausführen.
-- Schützt Kundenanfragen (leads) und sperrt das Bearbeiten von Produkten/Bildern
-- für die Öffentlichkeit. Nach diesem Skript braucht der Admin einen echten Login.

------------------------------------------------------------------
-- 1) KUNDENANFRAGEN (leads): Öffentlichkeit darf NUR senden, nicht lesen
------------------------------------------------------------------
alter table public.leads enable row level security;

drop policy if exists "leads anon insert" on public.leads;
drop policy if exists "leads auth read"   on public.leads;
drop policy if exists "leads auth update" on public.leads;
drop policy if exists "leads auth delete" on public.leads;

-- Besucher dürfen über das Kontaktformular eine Anfrage anlegen …
create policy "leads anon insert" on public.leads
  for insert to anon, authenticated with check (true);
-- … aber nur eingeloggte Admins dürfen Anfragen lesen / bearbeiten / löschen.
create policy "leads auth read"   on public.leads for select to authenticated using (true);
create policy "leads auth update" on public.leads for update to authenticated using (true) with check (true);
create policy "leads auth delete" on public.leads for delete to authenticated using (true);

------------------------------------------------------------------
-- 2) PRODUKTE (products): öffentlich lesbar, aber nur Admin darf ändern
------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products public read"  on public.products;
drop policy if exists "products auth insert"   on public.products;
drop policy if exists "products auth update"   on public.products;
drop policy if exists "products auth delete"   on public.products;

create policy "products public read" on public.products for select to anon, authenticated using (true);
create policy "products auth insert" on public.products for insert to authenticated with check (true);
create policy "products auth update" on public.products for update to authenticated using (true) with check (true);
create policy "products auth delete" on public.products for delete to authenticated using (true);

------------------------------------------------------------------
-- 3) PRODUKTBILDER (Storage): öffentlich lesbar, Upload nur für Admin
------------------------------------------------------------------
drop policy if exists "sg product-images read"   on storage.objects;
drop policy if exists "sg product-images insert" on storage.objects;
drop policy if exists "sg product-images update" on storage.objects;
drop policy if exists "sg product-images delete" on storage.objects;

create policy "sg product-images read"   on storage.objects for select using (bucket_id = 'product-images');
create policy "sg product-images insert" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "sg product-images update" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "sg product-images delete" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

-- ----------------------------------------------------------------
-- WICHTIG danach: Admin-Benutzer anlegen
--   Supabase Dashboard → Authentication → Users → "Add user"
--   E-Mail + Passwort eingeben, "Auto Confirm User" aktivieren.
--   Mit diesen Daten meldest du dich künftig unter /admin an.
-- ----------------------------------------------------------------
