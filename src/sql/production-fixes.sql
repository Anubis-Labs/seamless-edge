-- Focused fixes for the production database
-- This handles only the specific tables that were causing issues

-- Create functions needed by DatabaseExplorer if they don't exist
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (table_name text) 
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT t.tablename::text
  FROM pg_catalog.pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$;

CREATE OR REPLACE FUNCTION get_column_info(target_table text)
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) 
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = target_table
  ORDER BY c.ordinal_position;
END;
$$;

-- Create services table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
    CREATE TABLE public.services (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      icon TEXT,
      price NUMERIC(10,2),
      price_unit TEXT DEFAULT 'per service',
      duration INTEGER,
      is_featured BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      image TEXT,
      slug TEXT UNIQUE,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Allow authenticated users full access to services" 
      ON public.services FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to services" 
      ON public.services FOR SELECT TO anon USING (is_active = true);

    -- Grant permissions
    GRANT ALL ON TABLE public.services TO authenticated;
    GRANT SELECT ON TABLE public.services TO anon;
    GRANT USAGE, SELECT ON SEQUENCE services_id_seq TO authenticated;
  END IF;
END$$;

-- Create applications table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'applications' AND table_schema = 'public') THEN
    CREATE TABLE public.applications (
      id BIGSERIAL PRIMARY KEY,
      job_id BIGINT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      resume_url TEXT,
      cover_letter TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add foreign key if jobs table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs' AND table_schema = 'public') THEN
      ALTER TABLE public.applications 
        ADD CONSTRAINT applications_job_id_fkey 
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;

    -- Enable RLS
    ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Allow authenticated users full access to applications" 
      ON public.applications FOR ALL TO authenticated USING (true);

    -- Grant permissions
    GRANT ALL ON TABLE public.applications TO authenticated;
    GRANT USAGE, SELECT ON SEQUENCE applications_id_seq TO authenticated;
  END IF;
END$$;

-- Create blog_categories table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_categories' AND table_schema = 'public') THEN
    CREATE TABLE public.blog_categories (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT UNIQUE,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Allow authenticated users full access to blog_categories" 
      ON public.blog_categories FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to blog_categories" 
      ON public.blog_categories FOR SELECT TO anon USING (true);

    -- Grant permissions
    GRANT ALL ON TABLE public.blog_categories TO authenticated;
    GRANT SELECT ON TABLE public.blog_categories TO anon;
    GRANT USAGE, SELECT ON SEQUENCE blog_categories_id_seq TO authenticated;
  END IF;
END$$;

-- Create blog table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog' AND table_schema = 'public') THEN
    CREATE TABLE public.blog (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      content TEXT,
      excerpt TEXT,
      author TEXT,
      category_id BIGINT,
      image TEXT,
      published BOOLEAN DEFAULT TRUE,
      featured BOOLEAN DEFAULT FALSE,
      views INTEGER DEFAULT 0,
      published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add foreign key if blog_categories exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_categories' AND table_schema = 'public') THEN
      ALTER TABLE public.blog 
        ADD CONSTRAINT blog_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;
    END IF;

    -- Enable RLS
    ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Allow authenticated users full access to blog" 
      ON public.blog FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to blog" 
      ON public.blog FOR SELECT TO anon USING (published = true);

    -- Grant permissions
    GRANT ALL ON TABLE public.blog TO authenticated;
    GRANT SELECT ON TABLE public.blog TO anon;
    GRANT USAGE, SELECT ON SEQUENCE blog_id_seq TO authenticated;
  END IF;
END$$;

-- Create gallery table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery' AND table_schema = 'public') THEN
    CREATE TABLE public.gallery (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      client TEXT,
      location TEXT,
      date DATE,
      images JSONB DEFAULT '[]',
      featured BOOLEAN DEFAULT FALSE,
      published BOOLEAN DEFAULT TRUE,
      service_id BIGINT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add foreign key if services exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
      ALTER TABLE public.gallery 
        ADD CONSTRAINT gallery_service_id_fkey 
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
    END IF;

    -- Enable RLS
    ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Allow authenticated users full access to gallery" 
      ON public.gallery FOR ALL TO authenticated USING (true);
      
    CREATE POLICY "Allow public read access to gallery" 
      ON public.gallery FOR SELECT TO anon USING (published = true);

    -- Grant permissions
    GRANT ALL ON TABLE public.gallery TO authenticated;
    GRANT SELECT ON TABLE public.gallery TO anon;
    GRANT USAGE, SELECT ON SEQUENCE gallery_id_seq TO authenticated;
  END IF;
END$$;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_info(text) TO authenticated; 