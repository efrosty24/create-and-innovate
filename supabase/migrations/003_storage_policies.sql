-- Storage policies using your blueprint pattern:
--   bucket_id = {bucket_name}
--   (storage.foldername(name))[1] = 'private'
--   (select auth.role()) = 'authenticated'
--
-- Create the bucket in Dashboard first: Storage → New bucket → name it "avatars" or "private".
-- If you use a bucket named "private", uncomment the "private" bucket policies below.
-- For "avatars" we use first folder = user id so each user only accesses their own path.

-- =============================================================================
-- AVATARS BUCKET (first folder = auth.uid() so users only access their own files)
-- =============================================================================
-- Bucket "avatars" must exist. Create in Dashboard: Storage → New bucket → "avatars".
-- Optional: set bucket to Public if you want avatar URLs to work without auth.

-- Authenticated users can upload only into their own folder: {user_id}/...
create policy "Authenticated users upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update/delete only their own folder
create policy "Authenticated users update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users delete own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read so profile pictures work (optional: remove if you want private avatars)
create policy "Public read avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- =============================================================================
-- BLUEPRINT: "private" folder (only authenticated, first path segment = 'private')
-- =============================================================================
-- Uncomment and set {bucket_name} if you have a bucket where the first folder is "private".
--
-- create policy "Authenticated read private"
-- on storage.objects for select
-- to authenticated
-- using (
--   bucket_id = 'your_bucket_name'
--   and (storage.foldername(name))[1] = 'private'
--   and (select auth.role()) = 'authenticated'
-- );
--
-- create policy "Authenticated insert private"
-- on storage.objects for insert
-- to authenticated
-- with check (
--   bucket_id = 'your_bucket_name'
--   and (storage.foldername(name))[1] = 'private'
--   and (select auth.role()) = 'authenticated'
-- );
--
-- create policy "Authenticated update private"
-- on storage.objects for update
-- to authenticated
-- using (
--   bucket_id = 'your_bucket_name'
--   and (storage.foldername(name))[1] = 'private'
--   and (select auth.role()) = 'authenticated'
-- );
--
-- create policy "Authenticated delete private"
-- on storage.objects for delete
-- to authenticated
-- using (
--   bucket_id = 'your_bucket_name'
--   and (storage.foldername(name))[1] = 'private'
--   and (select auth.role()) = 'authenticated'
-- );
