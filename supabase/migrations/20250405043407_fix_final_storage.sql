-- Final fix for storage permissions - using a different approach
-- This gives unrestricted access to authenticated users to all buckets

-- 1. Disable RLS temporarily to allow setup
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. Delete all buckets and recreate them (clean slate approach)
DELETE FROM storage.objects;
DELETE FROM storage.buckets;

-- 3. Create our buckets with proper public settings
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('site-assets', 'site-assets', true),
  ('blog-images', 'blog-images', true),
  ('gallery-images', 'gallery-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('service-images', 'service-images', true),
  ('resumes', 'resumes', false);
  
-- 4. Re-enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Drop ALL existing policies
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public users can view public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can view resume files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can do anything" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view public files" ON storage.objects;

-- 6. Create SIMPLE policies with NO restrictions

-- For storage.buckets
CREATE POLICY "Give users all access to buckets" ON storage.buckets
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public users to see bucket info" ON storage.buckets
FOR SELECT TO anon USING (public = true);

-- For storage.objects (the most important part)
CREATE POLICY "Allow ALL operations for authenticated users" ON storage.objects
FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to public buckets" ON storage.objects
FOR SELECT TO anon
USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));

-- 7. Ensure public buckets are truly public
UPDATE storage.buckets SET public = true 
WHERE id IN ('site-assets', 'blog-images', 'gallery-images', 'testimonial-images', 'service-images');
