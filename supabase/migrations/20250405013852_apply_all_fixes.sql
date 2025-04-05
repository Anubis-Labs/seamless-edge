-- COMPREHENSIVE FIX SQL - RUN THIS IN SUPABASE SQL EDITOR
-- Fix for missing columns in projects table and verify job application functionality

-- 1. Add missing image columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS before_image TEXT,
ADD COLUMN IF NOT EXISTS after_image TEXT,
ADD COLUMN IF NOT EXISTS comparison_images JSONB DEFAULT '[]';

-- Comment on new columns
COMMENT ON COLUMN public.projects.before_image IS 'URL for the before image';
COMMENT ON COLUMN public.projects.after_image IS 'URL for the after image';
COMMENT ON COLUMN public.projects.comparison_images IS 'JSON array of additional before/after image pairs';

-- Create JSONB index for better performance on comparison_images
CREATE INDEX IF NOT EXISTS idx_projects_comparison_images ON public.projects USING GIN (comparison_images);

-- 2. Ensure job_applications table exists with proper structure
CREATE TABLE IF NOT EXISTS public.job_applications (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT,
    message TEXT,
    resume_url TEXT,
    job_id INTEGER REFERENCES public.jobs(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE OR REPLACE FUNCTION update_job_applications_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION update_job_applications_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 3. Create storage buckets if they don't exist
-- Gallery images bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Resumes bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO UPDATE
SET public = false;

-- 4. Set up storage bucket policies

-- GALLERY IMAGES BUCKET (PUBLIC) POLICIES
-- Public read access
CREATE POLICY IF NOT EXISTS "Gallery Images Public Read Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Authenticated users can upload, update, delete gallery images
CREATE POLICY IF NOT EXISTS "Authenticated Users Can Upload Gallery Images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Authenticated Users Can Update Gallery Images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY IF NOT EXISTS "Authenticated Users Can Delete Gallery Images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- RESUMES BUCKET (PRIVATE) POLICIES
-- Only authenticated users can view resumes
CREATE POLICY IF NOT EXISTS "Only Authenticated Users Can View Resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

-- Anyone can upload resumes (needed for job applications)
CREATE POLICY IF NOT EXISTS "Anyone Can Upload Resumes"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

-- Only authenticated users can update/delete resumes
CREATE POLICY IF NOT EXISTS "Only Authenticated Users Can Update Resumes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

CREATE POLICY IF NOT EXISTS "Only Authenticated Users Can Delete Resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

-- 5. Ensure RLS policies for job_applications

-- Anyone can create a job application
CREATE POLICY IF NOT EXISTS "Anyone can create a job application"
ON public.job_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view job applications
CREATE POLICY IF NOT EXISTS "Only authenticated users can view job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update job applications
CREATE POLICY IF NOT EXISTS "Only authenticated users can update job applications"
ON public.job_applications
FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete job applications
CREATE POLICY IF NOT EXISTS "Only authenticated users can delete job applications"
ON public.job_applications
FOR DELETE
TO authenticated
USING (true); 