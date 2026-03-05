-- Check current RLS policies on storage.objects
-- Run this to see existing policies
SELECT * FROM storage.policies WHERE bucket_id = 'warning-images';

-- If no delete policy exists, you need to add one through Supabase Dashboard:
-- 1. Go to https://app.supabase.com/project/_/storage/policies
-- 2. Select 'warning-images' bucket
-- 3. Click 'New Policy'
-- 4. Use these settings:
--    - Policy name: "Allow delete warning images"
--    - Allowed operation: DELETE
--    - Target roles: authenticated
--    - Policy definition: bucket_id = 'warning-images'
--
-- Or if you have admin access, run:
-- CREATE POLICY "Allow delete warning images"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'warning-images');
