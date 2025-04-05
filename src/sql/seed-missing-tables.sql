-- Seed data for the tables that were previously missing

-- Seed services table
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

-- Seed blog_categories table
INSERT INTO public.blog_categories (name, slug, description, display_order) 
VALUES
('Drywall Tips', 'drywall-tips', 'Helpful advice and techniques for drywall installation and repair', 1),
('Renovations', 'renovations', 'Ideas and inspiration for home renovation projects', 2),
('Industry News', 'industry-news', 'Latest updates from the drywall and construction industry', 3),
('Company Updates', 'company-updates', 'News and announcements about our services and team', 4),
('How-To Guides', 'how-to-guides', 'Step-by-step tutorials for DIY drywall projects', 5);

-- Seed blog table
INSERT INTO public.blog (title, slug, content, excerpt, author, category_id, image, published, featured, published_date)
VALUES
(
  'Top 5 Drywall Finishing Techniques',
  'top-5-drywall-finishing-techniques',
  '<h2>1. Basic Smooth Finish</h2><p>The most common technique, perfect for modern homes and businesses. This involves applying joint compound, embedding tape, and applying multiple coats with sanding between for a smooth surface.</p><h2>2. Knockdown Texture</h2><p>This popular texture adds character and helps hide imperfections. After applying joint compound in a pattern, a large knife is used to "knock down" the peaks, creating a subtle, textured appearance.</p><h2>3. Orange Peel</h2><p>Named for its resemblance to an orange peel, this texture is created by spraying thinned joint compound onto the wall. It's durable and excellent for hiding minor imperfections.</p><h2>4. Popcorn Ceiling</h2><p>Though less popular now, this acoustic texture is still used in some applications, especially for sound dampening. Applied by spraying a specialized mixture onto ceilings.</p><h2>5. Venetian Plaster</h2><p>A premium finishing technique that creates a marble-like appearance with depth and texture. Multiple layers of specialized plaster are applied and polished for a smooth, elegant look.</p>',
  'Discover the five most popular drywall finishing techniques and when to use each one for your home or business project.',
  'Mark Johnson',
  1, -- Drywall Tips category
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/drywall-techniques.jpg',
  TRUE,
  TRUE,
  NOW() - INTERVAL '5 days'
),
(
  'How to Repair a Drywall Hole in 5 Steps',
  'how-to-repair-drywall-hole',
  '<h2>Step 1: Gather Your Materials</h2><p>You\'ll need a drywall patch or scrap piece of drywall, joint compound, drywall tape, utility knife, sanding block, and paint to match your wall.</p><h2>Step 2: Prepare the Hole</h2><p>Clean the edges of the hole and make sure there are no loose pieces. For larger holes, create a clean square or rectangle shape.</p><h2>Step 3: Apply the Patch</h2><p>For small holes, use a self-adhesive mesh patch. For larger holes, cut a piece of drywall slightly larger than the hole and secure it with drywall screws.</p><h2>Step 4: Apply Joint Compound</h2><p>Cover the patch with joint compound, feathering the edges. Apply multiple thin coats rather than one thick coat, allowing each to dry completely.</p><h2>Step 5: Sand and Paint</h2><p>Once dry, sand the area smooth and apply primer followed by paint that matches your wall color.</p>',
  'Learn the professional process for repairing holes in drywall, from small nail holes to larger damage.',
  'Sarah Williams',
  5, -- How-To Guides category
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/drywall-repair.jpg',
  TRUE,
  FALSE,
  NOW() - INTERVAL '10 days'
),
(
  'New Fire-Resistant Drywall Standards Coming in 2023',
  'fire-resistant-drywall-standards-2023',
  '<p>The construction industry is preparing for new fire safety standards that will impact residential and commercial drywall installations beginning next year.</p><p>The updated standards, published by the International Building Code (IBC), will require enhanced fire resistance ratings for drywall used in multi-family housing, commercial buildings, and certain areas of single-family homes such as garages and utility rooms.</p><p>Key changes include:</p><ul><li>Increased minimum thickness requirements for fire-rated drywall in certain applications</li><li>New testing procedures to better simulate real-world fire conditions</li><li>Additional requirements for installations around electrical outlets and fixtures</li><li>Enhanced inspection protocols for fire barrier systems</li></ul><p>Industry experts anticipate these changes will improve overall building safety while adding only minimal costs to construction projects. Manufacturers have already begun updating their product lines to meet the new specifications.</p><p>Our team is already trained and prepared to implement these new standards in all upcoming projects. Contact us to learn how these changes might affect your construction or renovation plans.</p>',
  'Learn about the upcoming changes to fire-resistant drywall regulations and how they\'ll impact construction projects.',
  'Robert Chen',
  3, -- Industry News category
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/fire-resistant-drywall.jpg',
  TRUE,
  FALSE,
  NOW() - INTERVAL '15 days'
),
(
  'Our Team Completes Major Hospital Renovation',
  'hospital-renovation-completion',
  '<p>We\'re proud to announce the successful completion of our largest project to date: the comprehensive drywall installation and finishing for the new west wing of General Memorial Hospital.</p><p>This six-month project involved installing over 100,000 square feet of specialty drywall, including:</p><ul><li>Fire-resistant systems for critical areas</li><li>Moisture-resistant systems for sanitation areas</li><li>Lead-lined drywall for radiology departments</li><li>Acoustic solutions for patient rooms and consultation areas</li></ul><p>The project presented several unique challenges, including the need to work around existing hospital operations and maintain strict cleanliness protocols throughout the construction process. Our team implemented specialized dust containment systems and coordinated work schedules to minimize disruption to hospital staff and patients.</p><p>"The attention to detail and commitment to quality demonstrated by the installation team was exceptional," said Maria Reynolds, the hospital\'s Director of Facilities. "The project was completed on time and met all of our specialized requirements."</p><p>This successful project showcases our ability to handle large-scale, complex commercial drywall installations with the highest standards of quality and professionalism.</p>',
  'Read about our team\'s recently completed major hospital renovation project featuring specialized drywall systems.',
  'James Peterson',
  4, -- Company Updates category
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/hospital-renovation.jpg',
  TRUE,
  TRUE,
  NOW() - INTERVAL '20 days'
),
(
  'Planning Your Basement Renovation: What to Consider',
  'basement-renovation-planning-guide',
  '<h2>Assess Moisture Issues First</h2><p>Before beginning any basement renovation, thoroughly inspect for existing water issues. Look for water stains, mold, musty odors, or efflorescence (white mineral deposits) on walls. Address any moisture problems before installing drywall.</p><h2>Choose the Right Drywall</h2><p>For basements, we strongly recommend moisture-resistant drywall (often called "green board") or paperless drywall designed specifically for basement applications. While slightly more expensive, these products provide significant long-term protection against potential moisture problems.</p><h2>Insulation Considerations</h2><p>Proper insulation is crucial in basement renovations. Consider installing rigid foam insulation directly against foundation walls before framing. This creates a thermal and moisture barrier that helps protect your drywall.</p><h2>Professional Framing Matters</h2><p>Basement walls are rarely perfectly straight. Professional framing creates a flat, plumb surface for drywall installation while accounting for any foundation irregularities. This is not the place to cut corners if you want quality results.</p><h2>Plan for Access Points</h2><p>When designing your basement layout, remember to include access panels for important utilities like plumbing clean-outs, electrical panels, and shut-off valves. These can be integrated discreetly while maintaining necessary accessibility.</p><h2>Consider Sound Dampening</h2><p>If your basement will include entertainment areas or a home office, consider using acoustic insulation and specialized soundproof drywall for certain walls and ceilings. This investment pays dividends in comfort and usability.</p>',
  'Essential considerations before starting your basement renovation project, from moisture control to material selection.',
  'Mark Johnson',
  2, -- Renovations category
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/basement-renovation.jpg',
  TRUE,
  FALSE,
  NOW() - INTERVAL '25 days'
);

-- Seed gallery table
INSERT INTO public.gallery (title, description, client, location, date, images, featured, published, service_id)
VALUES
(
  'Modern Office Renovation',
  'Complete drywall renovation for a downtown office space, including custom texture walls and acoustic ceiling treatments.',
  'Summit Financial Group',
  'Downtown Business District',
  '2023-10-15',
  '[{"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/office-renovation-1.jpg", "alt": "Modern reception area with textured feature wall"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/office-renovation-2.jpg", "alt": "Conference room with acoustic ceiling treatment"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/office-renovation-3.jpg", "alt": "Executive office with custom built-in wall features"}]',
  TRUE,
  TRUE,
  4 -- Commercial Drywall service
),
(
  'Luxury Home Theater Installation',
  'Specialized soundproof drywall installation for a custom home theater, including acoustic treatments and decorative wall panels.',
  'Private Residence - Johnson Family',
  'Highland Estates',
  '2023-08-22',
  '[{"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/theater-1.jpg", "alt": "Home theater with textured wall panels"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/theater-2.jpg", "alt": "Acoustic ceiling treatment with recessed lighting"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/theater-3.jpg", "alt": "Custom media wall with integrated equipment housing"}]',
  TRUE,
  TRUE,
  1 -- Drywall Installation service
),
(
  'Water Damage Restoration',
  'Complete restoration of a kitchen and dining area after significant water damage, including removal of damaged materials, installation of moisture-resistant drywall, and perfect texture matching.',
  'Wilson Residence',
  'Riverside Community',
  '2023-11-05',
  '[{"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/water-damage-1.jpg", "alt": "Before: Water damaged kitchen ceiling"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/water-damage-2.jpg", "alt": "During: Replacement of damaged drywall"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/water-damage-3.jpg", "alt": "After: Fully restored kitchen ceiling with matching texture"}]',
  FALSE,
  TRUE,
  2 -- Drywall Repair service
),
(
  'Custom Textured Accent Wall',
  'Creation of a custom textured accent wall for a modern living room, featuring a geometric pattern with metallic finish.',
  'Martinez Design Project',
  'Urban Lofts',
  '2023-09-18',
  '[{"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/accent-wall-1.jpg", "alt": "Living room with completed geometric accent wall"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/accent-wall-2.jpg", "alt": "Close-up of textured pattern and metallic finish"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/accent-wall-3.jpg", "alt": "During application of custom texture"}]',
  TRUE,
  TRUE,
  3 -- Texture Application service
),
(
  'Cathedral Ceiling Installation',
  'Installation of drywall on a complex cathedral ceiling in a custom home, including decorative coffers and lighting integration.',
  'Custom Home - Anderson Project',
  'Hillside Estates',
  '2023-07-12',
  '[{"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/ceiling-1.jpg", "alt": "Completed cathedral ceiling with coffers"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/ceiling-2.jpg", "alt": "During installation of ceiling framework"}, {"url": "https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery/ceiling-3.jpg", "alt": "Detail of coffer construction and lighting integration"}]',
  FALSE,
  TRUE,
  5 -- Ceiling Installation service
);

-- Only add applications if jobs exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
    IF EXISTS (SELECT 1 FROM public.jobs WHERE id = 1) THEN
      INSERT INTO public.applications (job_id, first_name, last_name, email, phone, resume_url, cover_letter, status)
      VALUES 
      (
        1, -- Senior Drywall Installer or whatever job has ID=1
        'Michael',
        'Anderson',
        'michael.anderson@example.com',
        '(403) 555-1122',
        'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/michael-anderson-resume.pdf',
        'With over 8 years of experience in drywall installation across both residential and commercial projects, I believe I would be an excellent fit for your Senior Drywall Installer position.',
        'under review'
      ),
      (
        1, -- Same job ID
        'David',
        'Patel',
        'david.patel@example.com',
        '(403) 555-3344',
        'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/david-patel-resume.pdf',
        'I am writing to express my interest in the Senior Drywall Installer position. With 7 years of experience in the construction industry, including 5 years specializing in drywall installation.',
        'new'
      );
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.jobs WHERE id = 2) THEN
      INSERT INTO public.applications (job_id, first_name, last_name, email, phone, resume_url, cover_letter, status)
      VALUES 
      (
        2, -- Drywall Finisher/Taper or whatever job has ID=2
        'Jessica',
        'Williams',
        'jessica.williams@example.com',
        '(403) 555-5566',
        'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/jessica-williams-resume.pdf',
        'I am excited to apply for the Drywall Finisher position with your company. I have 4 years of specialized experience in drywall finishing, with particular expertise in texture application.',
        'interview scheduled'
      );
    END IF;
  END IF;
END
$$; 