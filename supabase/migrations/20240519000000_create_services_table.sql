-- Create services table for service offerings
CREATE TABLE IF NOT EXISTS public.services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  icon TEXT,
  price DECIMAL(10, 2),
  price_unit TEXT DEFAULT 'per service',
  duration INTEGER, -- in minutes
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  image TEXT,
  slug TEXT UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users full access to services" ON public.services
  FOR ALL TO authenticated USING (true);

-- Create policy for anonymous read access 
CREATE POLICY "Allow anonymous users to read services" ON public.services
  FOR SELECT TO anon USING (is_active = TRUE);

-- Add sample service if desired
INSERT INTO public.services (name, short_description, description, is_featured, is_active, slug, display_order)
VALUES 
('Window Cleaning', 
 'Professional window cleaning services for homes and businesses', 
 'Our window cleaning service uses professional-grade tools and solutions to leave your windows spotless and streak-free. We handle residential and commercial properties of all sizes.',
 TRUE, 
 TRUE, 
 'window-cleaning',
 10
); 