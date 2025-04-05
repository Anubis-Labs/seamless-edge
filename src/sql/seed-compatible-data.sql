-- Seed data for website that's compatible with existing table structures
-- Run this script after checking existing tables

-- Clear existing data first
TRUNCATE TABLE services, messages, blog, testimonials, applications CASCADE;

-- Seed services with the correct structure
INSERT INTO public.services (name, description, short_description, icon, price, price_unit, is_featured, is_active, image, slug, display_order)
VALUES 
(
  'Drywall Installation', 
  'Our professional drywall installation service ensures perfect walls and ceilings for your home or business. Our experienced team handles projects of any size, from single rooms to entire buildings, with precision and attention to detail.',
  'Expert drywall installation for residential and commercial projects',
  'FaHammer',
  500.00,
  'per room',
  TRUE,
  TRUE,
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/drywall-installation.jpg',
  'drywall-installation',
  1
),
(
  'Drywall Repair', 
  'Our drywall repair services fix holes, cracks, water damage, and other imperfections in your walls and ceilings. We match textures and finishes perfectly for a seamless look that makes the damage disappear.',
  'Professional repairs for holes, cracks, and damaged drywall',
  'FaTools',
  150.00,
  'per repair',
  TRUE,
  TRUE,
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/drywall-repair.jpg',
  'drywall-repair',
  2
),
(
  'Texture Application', 
  'Add character and style to your walls with our professional texture application services. We offer a variety of texture styles including knockdown, orange peel, popcorn, and smooth finish.',
  'Custom texture finishes including knockdown, orange peel, and more',
  'FaPaintRoller',
  300.00,
  'per room',
  FALSE,
  TRUE,
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/texture-application.jpg',
  'texture-application',
  3
),
(
  'Commercial Drywall', 
  'Our commercial drywall services cater to businesses, offices, retail spaces, and industrial buildings. We understand the unique requirements of commercial projects, including fire ratings, sound insulation, and durability needs.',
  'Specialized drywall services for office, retail, and industrial spaces',
  'FaBuilding',
  1000.00,
  'per project',
  FALSE,
  TRUE,
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/commercial-drywall.jpg',
  'commercial-drywall',
  4
),
(
  'Ceiling Installation', 
  'Transform your spaces with our professional ceiling installation services. We install all types of ceilings, including traditional drywall, drop ceilings, decorative tin ceilings, and specialty designs.',
  'Expert installation of drywall, drop, and specialty ceiling systems',
  'FaCloudscale',
  600.00,
  'per room',
  TRUE,
  TRUE,
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/ceiling-installation.jpg',
  'ceiling-installation',
  5
);

-- Seed messages with correct structure
INSERT INTO public.messages (name, email, phone, subject, message, status, read, archived)
VALUES 
(
  'David Miller',
  'david.miller@example.com',
  '(403) 555-1234',
  'Quote Request for Basement Renovation',
  'I''m looking to finish my basement (approximately 800 sq ft) and need a quote for drywall installation. The framing is already complete. Would someone be available to come take a look next week? Thanks!',
  'new',
  FALSE,
  FALSE
),
(
  'Jennifer Wilson',
  'jennifer.w@example.com',
  '(403) 555-8765',
  'Water Damage Repair',
  'We recently had a small pipe leak that damaged the drywall in our kitchen ceiling. The area is about 4x6 feet. The leak has been fixed, but we need the drywall repaired and matched to our existing texture. How soon could you look at this?',
  'new',
  FALSE,
  FALSE
),
(
  'Tom Richardson',
  'tom.r@example.com',
  '(403) 555-3456',
  'Commercial Office Renovation',
  'I represent Altitude Business Solutions, and we''re renovating our office space (approximately 2500 sq ft). We need a complete drywall solution including some specialty sound-dampening requirements for our conference rooms. Would like to discuss your commercial services.',
  'read',
  TRUE,
  FALSE
),
(
  'Sandra Lee',
  'sandra.lee@example.com',
  '(403) 555-7890',
  'Popcorn Ceiling Removal',
  'We''re interested in having the popcorn ceiling removed from our 1990s home (approximately 1800 sq ft) and replaced with a modern flat or light texture finish. Could you provide information about this service and a general price range? Thanks!',
  'read',
  TRUE,
  FALSE
),
(
  'Michael Jordan',
  'michael.j@example.com',
  '(403) 555-2345',
  'Garage Drywall Installation',
  'I''ve just built a new detached garage (24x24 ft) and need drywall installed and finished. Looking for a quote and your availability in the next month. Is fire-rated drywall required for this type of structure?',
  'read',
  TRUE,
  TRUE
);

-- Add compatible sample jobs 
INSERT INTO public.jobs (title, department, location, type, experience, description, responsibilities, requirements, benefits, featured)
VALUES 
(
  'Senior Drywall Installer',
  'Installation',
  'Calgary, AB',
  'Full-time',
  '5+ years',
  'We''re looking for an experienced drywall installer to join our growing team. The ideal candidate will have extensive experience in both residential and commercial drywall installation, with the ability to work independently and supervise junior team members.',
  '["Install drywall panels according to blueprints and specifications", "Measure and cut drywall panels to fit around openings", "Secure panels to wall studs or ceiling joists", "Prepare surfaces for finishing team", "Train and supervise junior installers"]',
  '["Minimum 5 years of professional drywall installation experience", "Valid driver''s license and reliable transportation", "Own basic hand tools", "Strong attention to detail"]',
  '["Competitive pay based on experience", "Health and dental benefits", "Paid vacation", "Ongoing training opportunities", "Career advancement potential"]',
  TRUE
),
(
  'Drywall Finisher/Taper',
  'Finishing',
  'Calgary, AB',
  'Full-time',
  '3+ years',
  'We are seeking a skilled drywall finisher/taper to join our team. This position involves applying joint compound to drywall seams, embedding tape, and finishing drywall joints and corners to prepare walls for painting.',
  '["Apply joint compound to drywall seams", "Embed tape in joint compound", "Apply multiple coats of compound for smooth finish", "Sand between coats for flawless results", "Apply various textures as required"]',
  '["3+ years experience in drywall finishing and taping", "Proficiency with various textures (knockdown, orange peel, etc.)", "Experience with automatic taping tools preferred", "Attention to detail"]',
  '["Competitive pay based on experience", "Health and dental benefits", "Paid vacation", "Tool allowance", "Company vehicle for eligible employees"]',
  TRUE
),
(
  'Apprentice Drywall Installer',
  'Installation',
  'Calgary, AB',
  'Full-time',
  'Entry level',
  'Start your career in the drywall industry! We''re looking for motivated individuals to join our team as apprentice drywall installers. No experience necessary – we''ll provide on-the-job training under the supervision of our experienced installers.',
  '["Assist senior installers with measuring and cutting drywall", "Help secure panels to wall studs and ceiling joists", "Learn proper techniques for different applications", "Maintain clean and safe work areas", "Load and unload materials"]',
  '["High school diploma or equivalent", "Good physical condition", "Reliable transportation", "Willingness to learn", "Basic math skills"]',
  '["Competitive starting wage with regular increases", "Paid training", "Advancement opportunities", "Flexible scheduling", "Employee discounts"]',
  FALSE
);

-- Seed applications with correct structure
INSERT INTO public.applications (job_id, first_name, last_name, email, phone, resume_url, cover_letter, status)
VALUES 
(
  1, -- Senior Drywall Installer
  'Michael',
  'Anderson',
  'michael.anderson@example.com',
  '(403) 555-1122',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/michael-anderson-resume.pdf',
  'With over 8 years of experience in drywall installation across both residential and commercial projects, I believe I would be an excellent fit for your Senior Drywall Installer position.',
  'under review'
),
(
  1, -- Senior Drywall Installer
  'David',
  'Patel',
  'david.patel@example.com',
  '(403) 555-3344',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/david-patel-resume.pdf',
  'I am writing to express my interest in the Senior Drywall Installer position. With 7 years of experience in the construction industry, including 5 years specializing in drywall installation.',
  'new'
),
(
  2, -- Drywall Finisher/Taper
  'Jessica',
  'Williams',
  'jessica.williams@example.com',
  '(403) 555-5566',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/jessica-williams-resume.pdf',
  'I am excited to apply for the Drywall Finisher position with your company. I have 4 years of specialized experience in drywall finishing, with particular expertise in texture application.',
  'interview scheduled'
);

-- Create helper functions for Database Explorer if they don't exist
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

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_info(text) TO authenticated; 