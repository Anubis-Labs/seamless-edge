-- Migration: Add summary column and dummy data for blog_posts

-- Add the summary column if it doesn't exist
-- Using DO block to avoid error if column already exists (e.g., from manual changes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'blog_posts' AND column_name = 'summary'
  ) THEN
    ALTER TABLE public.blog_posts ADD COLUMN summary TEXT;
  END IF;
END $$;

-- Remove the CREATE TABLE statement below, it's now redundant
-- CREATE TABLE IF NOT EXISTS public.blog_posts (
--     id SERIAL PRIMARY KEY,
--     title TEXT NOT NULL,
--     summary TEXT,
--     content TEXT NOT NULL,
--     category TEXT NOT NULL,
--     author TEXT NOT NULL,
--     publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
--     read_time TEXT,
--     image TEXT,
--     featured BOOLEAN NOT NULL DEFAULT false,
--     status TEXT DEFAULT 'draft' NOT NULL,
--     slug TEXT NOT NULL UNIQUE,
--     tags TEXT[] DEFAULT '{}',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
--     CONSTRAINT unique_slug_constraint UNIQUE (slug)
-- );

-- Remove RLS definitions below, handled by RBAC migration
-- Drop existing policies if any
-- DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.blog_posts;
-- DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.blog_posts;

-- Set up RLS policies for blog_posts
-- ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Admin policy: allow full CRUD for authenticated users
-- CREATE POLICY "Allow all operations for authenticated users" ON public.blog_posts
--     FOR ALL 
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- Public policy: allow only read access for published posts
-- CREATE POLICY "Allow public read access to published posts" ON public.blog_posts
--     FOR SELECT
--     TO anon
--     USING (status = 'published');

-- Add dummy blog posts
INSERT INTO public.blog_posts 
    (title, summary, content, category, published_at, featured_image, status, slug, tags)
VALUES
    (
        'Maintaining Your Home Exterior', 
        'Top tips to keep your home looking its best from the outside', 
        '<p>Your home''s exterior is the first thing people notice. Regular maintenance not only keeps it looking beautiful but also prevents costly repairs down the line.</p><p>Here are some essential maintenance tasks:</p><ul><li>Clean gutters seasonally</li><li>Inspect the roof for damage</li><li>Power wash siding annually</li><li>Check for peeling paint</li><li>Trim vegetation away from the house</li></ul><p>By staying on top of these tasks, you''ll protect your investment and maintain your home''s curb appeal.</p>', 
        'Maintenance', 
        '2023-05-15T08:00:00Z', 
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3', 
        'published', 
        'maintaining-your-home-exterior', 
        '["maintenance", "exterior", "home care"]'::jsonb
    ),
    (
        'When to Replace vs. Repair Your Roof', 
        'Making the right decision for your home and budget', 
        '<p>Deciding whether to repair or replace your roof is a significant decision that affects both your home''s integrity and your finances.</p><h3>Signs you need a repair:</h3><ul><li>Minor leaks in limited areas</li><li>A few damaged or missing shingles</li><li>Damage isolated to one section</li></ul><h3>Signs you need a replacement:</h3><ul><li>Roof is over 20 years old</li><li>Multiple leaks across the roof</li><li>Significant sagging</li><li>Widespread shingle damage</li></ul><p>A professional inspection can help you make an informed decision based on your specific situation.</p>', 
        'Repairs', 
        '2023-06-22T10:30:00Z', 
        'https://images.unsplash.com/photo-1632889100339-115ad858beb2?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3', 
        'published', 
        'replace-vs-repair-roof', 
        '["roof", "repairs", "home improvement"]'::jsonb
    ),
    (
        'Modern Landscaping Ideas for 2023', 
        'Transform your outdoor space with these contemporary approaches', 
        '<p>Modern landscaping blends functionality, sustainability, and aesthetic appeal to create outdoor spaces that are both beautiful and practical.</p><h3>Trending Ideas:</h3><ul><li>Xeriscaping with drought-resistant plants</li><li>Outdoor living rooms with weather-resistant furniture</li><li>Vertical gardens for small spaces</li><li>Smart irrigation systems</li><li>Native plant gardens to support local ecosystems</li></ul><p>Consider incorporating these elements into your landscaping plan to create a space that''s both on-trend and timeless.</p>', 
        'Techniques', 
        '2023-07-05T09:15:00Z', 
        'https://images.unsplash.com/photo-1558051815-0f18e64e6280?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3', 
        'published', 
        'modern-landscaping-ideas-2023', 
        '["landscaping", "outdoors", "design"]'::jsonb
    )
ON CONFLICT DO NOTHING;

-- Create an update trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to blog_posts table
DROP TRIGGER IF EXISTS set_updated_at ON public.blog_posts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Remove GRANT statements below, handled by RLS policies
-- Grant appropriate privileges 
-- GRANT ALL ON public.blog_posts TO authenticated;
-- GRANT SELECT ON public.blog_posts TO anon;
-- GRANT USAGE, SELECT ON SEQUENCE public.blog_posts_id_seq TO authenticated;
