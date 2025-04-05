-- Seed services table with drywall-related services
-- First clear existing services
TRUNCATE TABLE services CASCADE;

-- Insert new services
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