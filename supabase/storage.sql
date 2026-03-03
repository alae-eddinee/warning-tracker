-- Supabase Storage setup for Warning Tracker
-- Run this in your Supabase SQL Editor

-- Create storage bucket for warning images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('warning-images', 'warning-images', true);

-- Allow public access to the bucket (SELECT)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'warning-images');

-- Allow authenticated users to upload (INSERT)
CREATE POLICY "Authenticated Uploads" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'warning-images');

-- Allow users to delete their own uploads (DELETE)
CREATE POLICY "Authenticated Deletes" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'warning-images');
