-- Fix permissions for storage buckets to prevent authentication issues
-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a super permissive policy for authenticated users to do anything
CREATE POLICY "Authenticated users can do anything" 
ON storage.objects
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Public users can view public files
CREATE POLICY "Anyone can view public files" 
ON storage.objects 
FOR SELECT
TO anon
USING (bucket_id IN ('site-assets', 'blog-images', 'gallery-images', 'testimonial-images', 'service-images'));

-- Ensure all buckets exist with proper public settings
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('site-assets', 'site-assets', true),
  ('blog-images', 'blog-images', true),
  ('gallery-images', 'gallery-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('service-images', 'service-images', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
