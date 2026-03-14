-- Profiles: extended user data (username, avatar)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- User products (Prism device registry)
create table if not exists public.user_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  short_id text not null,
  product_name text default 'Prism',
  registered_at timestamptz default now() not null,
  unique(user_id, short_id)
);

alter table public.user_products enable row level security;

create policy "Users can read own products"
  on public.user_products for select
  using (auth.uid() = user_id);

create policy "Users can insert own products"
  on public.user_products for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own products"
  on public.user_products for delete
  using (auth.uid() = user_id);

-- Storage: create bucket "avatars" in Supabase Dashboard (Storage → New bucket → "avatars", Public).
-- Then in Storage → Policies for "avatars":
--   - "Users can upload own avatar": INSERT with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
--   - "Avatars are public": SELECT for all (or use bucket public URL)
