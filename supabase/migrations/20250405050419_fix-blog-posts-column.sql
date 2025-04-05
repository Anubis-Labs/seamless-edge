-- Fix missing 'summary' column in blog_posts table

-- Check if column exists first to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts' 
        AND column_name = 'summary'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN summary TEXT;
    END IF;
END $$;

-- Reset sequence if needed
ALTER SEQUENCE public.blog_posts_id_seq RESTART WITH 1;

-- Make sure row level security policies are correctly applied
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.blog_posts;
CREATE POLICY "Allow all operations for authenticated users" ON public.blog_posts
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blog_posts;
CREATE POLICY "Allow public read access to published posts" ON public.blog_posts
    FOR SELECT
    TO anon
    USING (status = 'published');

-- Grant privileges just to be sure
GRANT ALL ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_posts TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.blog_posts_id_seq TO authenticated;
