-- Auto-update profiles.updated_at on any column update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Safe locations: establishments (name, location text, coordinates)
-- Read-only for app users; create/update/delete only at DBMS level
create table if not exists public.safe_locations (
  id uuid primary key default gen_random_uuid(),
  establishment_name text not null,
  location text,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz default now() not null
);

alter table public.safe_locations enable row level security;

create policy "Anyone can read safe_locations"
  on public.safe_locations for select
  using (true);

-- Safe areas: city, town, street etc. for queer-friendly areas
create table if not exists public.safe_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_type text not null check (area_type in ('city', 'town', 'street', 'neighborhood', 'region', 'other')),
  region text,
  lat double precision,
  lng double precision,
  created_at timestamptz default now() not null
);

alter table public.safe_areas enable row level security;

create policy "Anyone can read safe_areas"
  on public.safe_areas for select
  using (true);

-- Feedback/comments on a location or area (chat-style)
create table if not exists public.location_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  safe_location_id uuid references public.safe_locations (id) on delete cascade,
  safe_area_id uuid references public.safe_areas (id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null,
  constraint feedback_target check (
    (safe_location_id is not null and safe_area_id is null) or
    (safe_location_id is null and safe_area_id is not null)
  )
);

create index if not exists idx_location_feedback_location on public.location_feedback (safe_location_id);
create index if not exists idx_location_feedback_area on public.location_feedback (safe_area_id);

alter table public.location_feedback enable row level security;

create policy "Anyone can read location_feedback"
  on public.location_feedback for select
  using (true);

create policy "Authenticated can insert own feedback"
  on public.location_feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own feedback"
  on public.location_feedback for update
  using (auth.uid() = user_id);

create policy "Users can delete own feedback"
  on public.location_feedback for delete
  using (auth.uid() = user_id);

-- Allow authenticated users to read display names (for feedback authors)
create policy "Authenticated can read profile display names"
  on public.profiles for select
  to authenticated
  using (true);

-- View: feedback with author display name (for listing comments)
create or replace view public.location_feedback_with_author as
select
  f.id,
  f.user_id,
  f.safe_location_id,
  f.safe_area_id,
  f.content,
  f.created_at,
  p.username,
  p.first_name,
  p.last_name
from public.location_feedback f
left join public.profiles p on p.id = f.user_id;

alter view public.location_feedback_with_author set (security_invoker = on);

grant select on public.location_feedback_with_author to authenticated;
grant select on public.location_feedback_with_author to anon;

-- Example: add safe locations/areas at DBMS level (e.g. in SQL editor or a seed script):
-- insert into public.safe_locations (establishment_name, location, lat, lng) values
--   ('The Center', '123 Main St', 40.7484, -73.9857),
--   ('Café Pride', '456 Oak Ave', 40.7520, -73.9820);
-- insert into public.safe_areas (name, area_type, region, lat, lng) values
--   ('Bryant Park', 'neighborhood', 'Manhattan', 40.7542, -73.9840);
