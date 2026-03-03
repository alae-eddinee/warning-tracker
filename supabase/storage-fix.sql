-- Fix: Allow anonymous uploads for the warning-images bucket
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'warning-images');

-- Allow anonymous uploads (for anon key usage)
CREATE POLICY "Anon Uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'warning-images');

-- Allow anonymous deletes
CREATE POLICY "Anon Deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'warning-images');
