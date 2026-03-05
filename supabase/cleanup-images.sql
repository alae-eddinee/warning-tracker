-- Delete all images from warning-images bucket
-- Run this in Supabase SQL Editor after deleting warnings

-- List all objects in the bucket (run this first to see what files exist)
SELECT name FROM storage.objects WHERE bucket_id = 'warning-images';

-- Delete all objects (run this to clean up orphaned images)
DELETE FROM storage.objects WHERE bucket_id = 'warning-images';

-- Or delete specific files by name:
-- DELETE FROM storage.objects WHERE bucket_id = 'warning-images' AND name = 'filename.jpg';
