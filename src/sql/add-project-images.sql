-- Add before and after image fields to projects table
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

-- Update existing RLS policy for projects table to include the new columns
-- This assumes you're using RLS and have existing policies
ALTER POLICY IF EXISTS "Allow authenticated users full access to projects" 
ON public.projects FOR ALL TO authenticated USING (true); 