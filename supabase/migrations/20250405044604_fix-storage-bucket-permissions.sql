-- Direct SQL to fix storage buckets and permissions for admin uploads

-- First disable RLS to allow modifications
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

-- Create improved security policies

-- For storage.buckets: Policies for listing and accessing buckets
CREATE POLICY "Allow full bucket access for authenticated users" ON storage.buckets
FOR ALL TO authenticated USING (true);

CREATE POLICY "Public users can see buckets" ON storage.buckets
FOR SELECT TO anon USING (public = true);

-- For storage.objects: Policies for file operations
-- Policy for authenticated users to do all operations
CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
FOR ALL TO authenticated 
USING (bucket_id IN (SELECT id FROM storage.buckets));

-- Policy for public users to view files in public buckets
CREATE POLICY "Allow public access to public buckets" ON storage.objects
FOR SELECT TO anon
USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));

-- Special policy for admin uploads - ensure the current user always has access to files they upload
CREATE POLICY "Users can manage their own files" ON storage.objects
FOR ALL TO authenticated
USING (auth.uid() = owner::uuid) WITH CHECK (auth.uid() = owner::uuid);

-- Create a trigger function to set the owner on new uploads
CREATE OR REPLACE FUNCTION storage.set_file_owner()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the owner to the authenticated user
    NEW.owner = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to execute the function before insert
DROP TRIGGER IF EXISTS set_file_owner_trigger ON storage.objects;
CREATE TRIGGER set_file_owner_trigger
BEFORE INSERT ON storage.objects
FOR EACH ROW EXECUTE FUNCTION storage.set_file_owner();

-- Add owner column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'storage' 
        AND table_name = 'objects' 
        AND column_name = 'owner'
    ) THEN
        ALTER TABLE storage.objects ADD COLUMN owner uuid;
    END IF;
END $$;

-- Fix existing objects to set owner if NULL
UPDATE storage.objects
SET owner = auth.uid()
WHERE owner IS NULL;

-- Grant explicit permissions to buckets for service_role
GRANT ALL PRIVILEGES ON storage.buckets TO service_role;
GRANT ALL PRIVILEGES ON storage.objects TO service_role;

-- Show confirmation message
DO $$
BEGIN
    RAISE NOTICE 'Storage bucket setup completed successfully. Buckets ready for image uploads.';
END $$;
