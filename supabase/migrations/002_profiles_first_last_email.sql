-- Add first_name, last_name, email to profiles (run if you already applied 001 without these columns)
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists email text;

-- Update trigger to set them on new signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    coalesce(
      trim((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name')),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$ language plpgsql security definer;
