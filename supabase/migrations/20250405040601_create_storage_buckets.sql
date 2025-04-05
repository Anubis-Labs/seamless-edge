-- Create all necessary buckets for the application's image upload needs
-- This ensures all admin pages can properly store and retrieve images

-- 1. Create the site-assets bucket (general purpose)
INSERT INTO storage.buckets (id, name, public)
SELECT 'site-assets', 'site-assets', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'site-assets');

-- 2. Create blog-images bucket
INSERT INTO storage.buckets (id, name, public)
SELECT 'blog-images', 'blog-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images');

-- 3. Create gallery-images bucket
INSERT INTO storage.buckets (id, name, public)
SELECT 'gallery-images', 'gallery-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery-images');

-- 4. Create testimonial-images bucket
INSERT INTO storage.buckets (id, name, public)
SELECT 'testimonial-images', 'testimonial-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'testimonial-images');

-- 5. Create service-images bucket
INSERT INTO storage.buckets (id, name, public)
SELECT 'service-images', 'service-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'service-images');

-- 6. Create resumes bucket (if not exists) - for job applications
INSERT INTO storage.buckets (id, name, public)
SELECT 'resumes', 'resumes', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resumes');

-- Drop any conflicting RLS policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;

-- Enable RLS on the objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Authenticated users can upload to any bucket (MORE PERMISSIVE)
CREATE POLICY "Authenticated users can upload files"
ON storage.objects 
FOR INSERT TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to upload files

-- Everyone can view public bucket files (for displaying on the website)
CREATE POLICY "Public users can view public bucket files"
ON storage.objects 
FOR SELECT TO anon
USING (bucket_id IN ('site-assets', 'blog-images', 'gallery-images', 'testimonial-images', 'service-images'));

-- Admin users can delete files
CREATE POLICY "Admin users can delete files"
ON storage.objects 
FOR DELETE TO authenticated
USING (
    bucket_id IN ('site-assets', 'blog-images', 'gallery-images', 'testimonial-images', 'service-images', 'resumes')
    AND auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin')
);

-- Admins can view resume files (job applications)
CREATE POLICY "Admin users can view resume files"
ON storage.objects 
FOR SELECT TO authenticated
USING (
    bucket_id = 'resumes'
    AND auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin')
);

-- Authenticated users can upload resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects 
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Grant public read-only access to the specific buckets for efficient loading on website
UPDATE storage.buckets SET public = true
WHERE id IN ('site-assets', 'blog-images', 'gallery-images', 'testimonial-images', 'service-images');
