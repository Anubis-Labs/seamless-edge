-- Direct SQL to fix storage buckets and permissions

-- First disable RLS to allow setup
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Create our buckets (recreate if they already exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('site-assets', 'site-assets', true),
  ('blog-images', 'blog-images', true),
  ('gallery-images', 'gallery-images', true),
  ('testimonial-images', 'testimonial-images', true),
  ('service-images', 'service-images', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

-- Drop ALL existing policies to start fresh
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN (
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'buckets'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.buckets', policy_name);
    END LOOP;
    
    FOR policy_name IN (
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create SIMPLE permissive policies (all new)

-- For storage.buckets
CREATE POLICY "Give users access to buckets" ON storage.buckets
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public users can see buckets" ON storage.buckets
FOR SELECT TO anon USING (public = true);

-- For storage.objects 
CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to public buckets" ON storage.objects
FOR SELECT TO anon
USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));

-- Show the results
-- SELECT id, name, public FROM storage.buckets ORDER BY id;
