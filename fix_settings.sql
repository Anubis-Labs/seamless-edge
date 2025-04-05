-- Fix for settings - inserting with correct section names

-- Delete all existing settings (to ensure we start fresh)
DELETE FROM public.settings;

-- Clear any potential conflicting policies
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.settings;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.settings;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.settings;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.settings;

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Allow select for authenticated users" 
  ON public.settings FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" 
  ON public.settings FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" 
  ON public.settings FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" 
  ON public.settings FOR DELETE 
  USING (auth.role() = 'authenticated');

-- General Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_general', 'companyName', '"Seamless Edge"'),
  ('site_general', 'tagline', '"Your Drywall Experts in Calgary"'),
  ('site_general', 'description', '"Professional drywall installation, finishing, and repair services serving Calgary and surrounding areas."'),
  ('site_general', 'logoUrl', '""'),
  ('site_general', 'faviconUrl', '""');

-- Contact Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_contact', 'contactEmail', '"info@seamlessedge.com"'),
  ('site_contact', 'contactPhone', '"(403) 555-7890"'),
  ('site_contact', 'address', '"123 Drywall Avenue, Calgary, AB T2P 1J9"');

-- Social Media Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_social', 'facebook', '"https://facebook.com/seamlessedgecalgary"'),
  ('site_social', 'twitter', '""'),
  ('site_social', 'instagram', '"https://instagram.com/seamlessedge_yyc"'),
  ('site_social', 'linkedin', '""'),
  ('site_social', 'pinterest', '""'),
  ('site_social', 'youtube', '""');

-- Business Hours
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_hours', 'monday', '"8:00 AM - 6:00 PM"'),
  ('site_hours', 'tuesday', '"8:00 AM - 6:00 PM"'),
  ('site_hours', 'wednesday', '"8:00 AM - 6:00 PM"'),
  ('site_hours', 'thursday', '"8:00 AM - 6:00 PM"'),
  ('site_hours', 'friday', '"8:00 AM - 6:00 PM"'),
  ('site_hours', 'saturday', '"9:00 AM - 3:00 PM"'),
  ('site_hours', 'sunday', '"Closed"');

-- Appearance Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_appearance', 'primaryColor', '"#3D5734"'),
  ('site_appearance', 'secondaryColor', '"#1B365D"');

-- SEO Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_seo', 'metaTitle', '"Seamless Edge - Calgary''s Premier Drywall Contractor"'),
  ('site_seo', 'metaDescription', '"Professional drywall installation, finishing, and repair services. Serving Calgary and surrounding areas with quality craftsmanship."'),
  ('site_seo', 'ogImage', '""');

-- Integration Settings
INSERT INTO public.settings (section, key, value)
VALUES 
  ('site_integrations', 'googleMapsApiKey', '""'),
  ('site_integrations', 'googleAnalyticsId', '""'); 