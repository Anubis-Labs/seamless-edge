-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user settings table for user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  default_calendar_view TEXT DEFAULT 'week',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create application settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT DEFAULT 'Seamless Edge',
  contact_email TEXT,
  contact_phone TEXT,
  business_hours TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  company TEXT,
  notes TEXT,
  client_type TEXT DEFAULT 'individual',
  status TEXT DEFAULT 'active',
  source TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  total_cost DECIMAL(10, 2),
  service_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  service_type TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT,
  tags JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_location TEXT,
  client_image TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  service_type TEXT,
  display_on_homepage BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table with archived column
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table with proper primary key
CREATE TABLE IF NOT EXISTS public.settings (
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (section, key)
);

-- Enable Row Level Security for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow users to manage their own settings" ON public.user_settings
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users full access to app_settings" ON public.app_settings
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to clients" ON public.clients
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to projects" ON public.projects
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to bookings" ON public.bookings
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to blog_categories" ON public.blog_categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to blog_posts" ON public.blog_posts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users full access to messages" ON public.messages
  FOR ALL TO authenticated USING (true);

-- Specifically create policies for the settings table
CREATE POLICY "Allow authenticated users to select from settings" ON public.settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert into settings" ON public.settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update settings" ON public.settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete from settings" ON public.settings
  FOR DELETE TO authenticated USING (true);

-- Create functions for dashboard
CREATE OR REPLACE FUNCTION public.get_project_status_counts()
RETURNS TABLE (status TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.status, COUNT(*) as count
  FROM public.projects p
  GROUP BY p.status;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_monthly_revenue(last_n_months INT DEFAULT 12)
RETURNS TABLE (month TEXT, revenue DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', p.end_date), 'YYYY-MM') as month,
    COALESCE(SUM(p.total_cost), 0) as revenue
  FROM public.projects p
  WHERE 
    p.status = 'completed' AND 
    p.end_date IS NOT NULL AND
    p.end_date >= (CURRENT_DATE - (last_n_months || ' month')::INTERVAL)
  GROUP BY DATE_TRUNC('month', p.end_date)
  ORDER BY DATE_TRUNC('month', p.end_date);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_service_distribution()
RETURNS TABLE (service TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.service_type, 'Other') as service,
    COUNT(*) as count
  FROM public.projects p
  GROUP BY p.service_type;
END;
$$ LANGUAGE plpgsql;
