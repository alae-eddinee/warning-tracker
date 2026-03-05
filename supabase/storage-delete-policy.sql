-- Fix Storage RLS Policies to allow image deletion
-- Run this in Supabase SQL Editor

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow delete own images" ON storage.objects;

-- Create policy to allow deleting images from warning-images bucket
-- This allows authenticated users to delete any file in the warning-images bucket
CREATE POLICY "Allow delete warning images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'warning-images');

-- Alternative: Allow service role to delete anything
-- CREATE POLICY "Allow service role delete"
-- ON storage.objects
-- FOR DELETE
-- TO service_role
-- USING (true);

-- Verify the policy was created
SELECT * FROM storage.policies WHERE bucket_id = 'warning-images';
