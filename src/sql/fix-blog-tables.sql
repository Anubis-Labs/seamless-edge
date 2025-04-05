-- Fix blog and gallery table structures

-- First, check if columns exist and add them if they don't
DO $$
BEGIN
    -- Add category_id to blog if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'blog' 
                   AND column_name = 'category_id') THEN
        ALTER TABLE public.blog ADD COLUMN category_id BIGINT;
    END IF;

    -- Add slug to blog_categories if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'blog_categories' 
                   AND column_name = 'slug') THEN
        ALTER TABLE public.blog_categories ADD COLUMN slug TEXT UNIQUE;
    END IF;

    -- Add service_id to gallery if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'gallery' 
                   AND column_name = 'service_id') THEN
        ALTER TABLE public.gallery ADD COLUMN service_id BIGINT;
    END IF;
END $$;

-- Add relationship if not already there
ALTER TABLE IF EXISTS public.blog 
  DROP CONSTRAINT IF EXISTS blog_category_id_fkey,
  ADD CONSTRAINT blog_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.gallery 
  DROP CONSTRAINT IF EXISTS gallery_service_id_fkey,
  ADD CONSTRAINT gallery_service_id_fkey 
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;

-- Create or replace RLS policies
DO $$
BEGIN
    -- Drop existing policies first
    DROP POLICY IF EXISTS "Allow authenticated users full access to blog" ON public.blog;
    DROP POLICY IF EXISTS "Allow public read access to blog" ON public.blog;
    DROP POLICY IF EXISTS "Allow authenticated users full access to blog_categories" ON public.blog_categories;
    DROP POLICY IF EXISTS "Allow public read access to blog_categories" ON public.blog_categories;
    DROP POLICY IF EXISTS "Allow authenticated users full access to gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Allow public read access to gallery" ON public.gallery;
    
    -- Create new policies
    CREATE POLICY "Allow authenticated users full access to blog" 
      ON public.blog FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to blog" 
      ON public.blog FOR SELECT TO anon USING (published = true);
    
    CREATE POLICY "Allow authenticated users full access to blog_categories" 
      ON public.blog_categories FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to blog_categories" 
      ON public.blog_categories FOR SELECT TO anon USING (true);
    
    CREATE POLICY "Allow authenticated users full access to gallery" 
      ON public.gallery FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to gallery" 
      ON public.gallery FOR SELECT TO anon USING (published = true);
END $$; 