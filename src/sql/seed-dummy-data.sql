-- Seed data for Seamless Edge website
-- Run this script after creating the tables

-- Seed blog categories
INSERT INTO public.blog_categories (name) VALUES
('Drywall Tips'),
('Renovations'),
('Home Improvement'),
('Industry News'),
('Company Updates')
ON CONFLICT (name) DO NOTHING;

-- Seed services
INSERT INTO public.services (name, description, short_description, category, icon, image, features, price, featured, display_order, is_active)
VALUES 
(
  'Drywall Installation', 
  'Our professional drywall installation service ensures perfect walls and ceilings for your home or business. Our experienced team handles projects of any size, from single rooms to entire buildings, with precision and attention to detail. We use premium materials and innovative techniques to deliver smooth, flawless results that will last for years to come.',
  'Expert drywall installation for residential and commercial projects',
  'Residential', 
  'FaHammer',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/drywall-installation.jpg',
  '["Professional installation team", "Premium drywall materials", "Dust containment system", "Detailed clean-up", "Quality assurance"]',
  'From $5 per sq. ft.',
  TRUE,
  1,
  TRUE
),
(
  'Drywall Repair', 
  'Our drywall repair services fix holes, cracks, water damage, and other imperfections in your walls and ceilings. We match textures and finishes perfectly for a seamless look that makes the damage disappear. Our skilled technicians can handle small patch jobs to major repairs with the same level of care and craftsmanship.',
  'Professional repairs for holes, cracks, and damaged drywall',
  'Residential', 
  'FaTools',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/drywall-repair.jpg',
  '["Patch holes and cracks", "Water damage repair", "Texture matching", "Seamless finishing", "Fast turnaround"]',
  'From $150 per repair',
  TRUE,
  2,
  TRUE
),
(
  'Texture Application', 
  'Add character and style to your walls with our professional texture application services. We offer a variety of texture styles including knockdown, orange peel, popcorn, and smooth finish. Our technicians are experts at creating consistent, beautiful textures that enhance your interior spaces and hide minor wall imperfections.',
  'Custom texture finishes including knockdown, orange peel, and more',
  'Residential', 
  'FaPaintRoller',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/texture-application.jpg',
  '["Multiple texture options", "Consistent application", "Custom finishes", "Skilled technicians", "Quality materials"]',
  'From $3 per sq. ft.',
  FALSE,
  3,
  TRUE
),
(
  'Commercial Drywall', 
  'Our commercial drywall services cater to businesses, offices, retail spaces, and industrial buildings. We understand the unique requirements of commercial projects, including fire ratings, sound insulation, and durability needs. Our team works efficiently to minimize disruption to your business operations while delivering exceptional results that meet all building codes and specifications.',
  'Specialized drywall services for office, retail, and industrial spaces',
  'Commercial', 
  'FaBuilding',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/commercial-drywall.jpg',
  '["Code-compliant installation", "Fire-rated assemblies", "Sound attenuation", "After-hours scheduling", "Project management"]',
  'Custom quotes for commercial projects',
  FALSE,
  4,
  TRUE
),
(
  'Ceiling Installation', 
  'Transform your spaces with our professional ceiling installation services. We install all types of ceilings, including traditional drywall, drop ceilings, decorative tin ceilings, and specialty designs. Our team handles everything from removal of old ceilings to finishing touches, ensuring a beautiful overhead view that complements your interior design.',
  'Expert installation of drywall, drop, and specialty ceiling systems',
  'Residential', 
  'FaCloudscale',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/service-images/ceiling-installation.jpg',
  '["Drywall ceilings", "Drop ceiling systems", "Decorative options", "Lighting integration", "Insulation inclusion"]',
  'From $6 per sq. ft.',
  TRUE,
  5,
  TRUE
);

-- Seed testimonials
INSERT INTO public.testimonials (client_name, client_title, client_company, client_location, client_image, content, rating, status, service_type, display_on_homepage)
VALUES 
(
  'John Williams',
  'Homeowner',
  NULL,
  'Calgary, AB',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/testimonial-images/john-williams.jpg',
  'The drywall installation team was professional, efficient, and left my home spotless. The finished walls look perfect, and they completed the project ahead of schedule. I would definitely hire them again for future projects.',
  5,
  'approved',
  'Drywall Installation',
  TRUE
),
(
  'Sarah Johnson',
  'Interior Designer',
  'Modern Home Designs',
  'Calgary, AB',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/testimonial-images/sarah-johnson.jpg',
  'I've worked with many drywall contractors over the years, and this team is by far the best. Their attention to detail and quality of work is exceptional. I recommend them to all my clients with confidence.',
  5,
  'approved',
  'Texture Application',
  TRUE
),
(
  'Robert Chen',
  'Project Manager',
  'Urban Development Group',
  'Airdrie, AB',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/testimonial-images/robert-chen.jpg',
  'Our commercial renovation project had a tight timeline, and the team delivered exceptional results on schedule. Their knowledge of fire-rated assemblies and commercial building codes was impressive. A reliable partner for commercial projects.',
  4,
  'approved',
  'Commercial Drywall',
  FALSE
),
(
  'Emma Rodriguez',
  'Homeowner',
  NULL,
  'Cochrane, AB',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/testimonial-images/emma-rodriguez.jpg',
  'After significant water damage to our ceiling, we were worried about the repair process. The team made it stress-free with their professional approach, clear communication, and outstanding repair work. You can't even tell there was damage!',
  5,
  'approved',
  'Drywall Repair',
  TRUE
),
(
  'Michael Thompson',
  'Property Manager',
  'Calgary Properties Ltd.',
  'Calgary, AB',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/testimonial-images/michael-thompson.jpg',
  'We use this company for all our rental property drywall needs. Their work is consistently excellent, pricing is fair, and they're always responsive. As a property manager handling multiple locations, I appreciate their reliability and professionalism.',
  5,
  'approved',
  'Drywall Installation',
  FALSE
);

-- Seed blog posts
INSERT INTO public.blog (title, slug, content, excerpt, featured_image, category, tags, status, published_at)
VALUES 
(
  '5 Signs You Need Drywall Repair',
  '5-signs-you-need-drywall-repair',
  '<h2>Identifying Drywall Damage Early Can Save You Money</h2><p>Drywall damage often starts small but can quickly become a bigger problem if not addressed. Here are five signs that indicate it''s time to call in the professionals for drywall repair:</p><h3>1. Visible Cracks</h3><p>Small hairline cracks might seem minor, but they can indicate structural movement or settling in your home. Larger cracks definitely require professional attention to determine if there''s an underlying issue.</p><h3>2. Water Stains</h3><p>Yellow or brown discoloration on your walls or ceiling is a clear sign of water damage. This requires immediate attention as the moisture can lead to mold growth and compromise the structural integrity of the drywall.</p><h3>3. Holes and Dents</h3><p>Whether from doorknobs, furniture moving, or accidents, holes and dents not only look unsightly but can worsen over time if not repaired properly.</p><h3>4. Bubbling or Peeling Paint</h3><p>When paint bubbles or peels from the wall, it often indicates moisture has penetrated the drywall, causing the paint to lose adhesion.</p><h3>5. Soft or Crumbly Drywall</h3><p>If your drywall feels soft to the touch or crumbles easily, this is a serious sign of water damage that requires immediate professional repair.</p><p>Don''t wait until these issues worsen. Contact our professional drywall repair team for a consultation today!</p>',
  'Learn to identify the early warning signs of drywall damage before they become expensive problems requiring major repairs.',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/drywall-cracks.jpg',
  'Drywall Tips',
  '["drywall repair", "home maintenance", "water damage", "drywall cracks"]',
  'published',
  '2023-10-15 09:00:00'
),
(
  'Choosing the Right Texture for Your Walls',
  'choosing-the-right-texture-for-your-walls',
  '<h2>Wall Textures Add Character to Any Space</h2><p>Wall textures can completely transform the look and feel of a room. Here''s a guide to the most popular drywall texture options to help you choose the right one for your home:</p><h3>Smooth Finish</h3><p>A smooth finish provides a clean, modern look that works well in contemporary spaces. While it shows imperfections more easily, it creates a refined appearance that many homeowners prefer, especially in newly built homes.</p><h3>Orange Peel</h3><p>One of the most common textures, orange peel resembles the surface of an orange with a subtle, slightly bumpy texture. It''s excellent at hiding minor imperfections and adds a bit of visual interest without being too pronounced.</p><h3>Knockdown</h3><p>Knockdown texture starts similar to orange peel but is then "knocked down" with a knife to flatten the peaks, creating a mottled, stucco-like appearance. It''s great for hiding wall imperfections and adds a rustic, textured look.</p><h3>Popcorn</h3><p>Though less popular for walls, popcorn texture (or acoustic texture) is still used for ceilings. It provides excellent sound dampening properties but can be more difficult to clean and maintain.</p><h3>Skip Trowel</h3><p>This Mediterranean-inspired texture creates a handcrafted, artistic finish with a skip trowel tool. It adds depth and visual interest, perfect for creating a focal wall or adding character to a space.</p><p>When choosing a texture, consider the overall style of your home, the specific room''s function, and your maintenance preferences. Our team can provide samples before application to help you visualize the final result.</p>',
  'Explore the most popular wall texture styles and learn which ones best suit different rooms and design aesthetics in your home.',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/wall-textures.jpg',
  'Home Improvement',
  '["wall texture", "interior design", "knockdown texture", "orange peel", "home improvement"]',
  'published',
  '2023-11-02 10:30:00'
),
(
  'The Benefits of Upgrading to Moisture-Resistant Drywall',
  'benefits-of-moisture-resistant-drywall',
  '<h2>Protect Your Home From Moisture Damage</h2><p>Standard drywall isn''t designed to withstand constant exposure to moisture, which is why specialized moisture-resistant drywall (often called "green board" due to its color) is essential in certain areas of your home. Here are the top benefits of upgrading:</p><h3>Superior Moisture Resistance</h3><p>The core and paper facing of moisture-resistant drywall are treated with water-repellent agents, making it significantly more resistant to water damage than standard drywall.</p><h3>Mold and Mildew Prevention</h3><p>The water-resistant properties help prevent the growth of mold and mildew, creating a healthier indoor environment, especially important for those with allergies or respiratory issues.</p><h3>Ideal for Humid Areas</h3><p>While not suitable for areas with direct water exposure (like shower stalls), moisture-resistant drywall is perfect for bathrooms, kitchens, laundry rooms, basements, and other areas that experience elevated humidity levels.</p><h3>Cost-Effective Long-Term Solution</h3><p>Though slightly more expensive than standard drywall initially, moisture-resistant drywall can save significant money in the long run by preventing costly water damage repairs.</p><h3>Easy Installation</h3><p>It installs just like regular drywall, requiring no special tools or techniques, making it a simple upgrade during renovation or new construction.</p><p>For bathrooms and areas with direct water exposure, consider cement board or other waterproof backer boards instead. Our team can help you determine the right materials for each area of your home to provide maximum protection and longevity.</p>',
  'Discover why moisture-resistant drywall is essential for bathrooms, kitchens, and basements, and how it can prevent costly water damage.',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/green-board-drywall.jpg',
  'Home Improvement',
  '["moisture-resistant drywall", "green board", "bathroom renovation", "mold prevention", "home improvement"]',
  'published',
  '2023-12-10 08:15:00'
),
(
  'New Building Codes Affecting Drywall Installation in 2024',
  'new-building-codes-drywall-installation-2024',
  '<h2>Staying Compliant with Updated Building Standards</h2><p>The building industry regularly updates codes to improve safety, efficiency, and sustainability. Here are the key 2024 building code changes that may affect your drywall installation projects:</p><h3>Enhanced Fire Resistance Requirements</h3><p>New residential codes require increased fire resistance ratings for drywall installed between attached garages and living spaces, as well as in multi-family dwellings. This may necessitate using thicker drywall or fire-resistant types in more applications.</p><h3>Acoustic Insulation Standards</h3><p>Updated codes include stricter requirements for sound transmission between units in multi-family buildings, potentially requiring specialized acoustic drywall products or installation techniques.</p><h3>Environmental and Health Considerations</h3><p>New regulations limit volatile organic compounds (VOCs) in drywall compounds and finishing materials to improve indoor air quality. Look for low-VOC or zero-VOC products that comply with these standards.</p><h3>Seismic Safety Updates</h3><p>In applicable regions, there are new specifications for drywall attachment methods to improve structural integrity during seismic events, including updated screw patterns and reinforcement requirements.</p><h3>Energy Efficiency Provisions</h3><p>While primarily affecting insulation, new energy code provisions may impact how drywall is installed around electrical outlets, recessed lighting, and other areas to maintain thermal envelope integrity.</p><p>Our company stays current with all building code updates to ensure your project is fully compliant while maintaining the highest quality standards. We handle all necessary permits and inspections, giving you peace of mind throughout your construction or renovation project.</p>',
  'Learn about the latest building code changes affecting drywall installation and what they mean for your upcoming construction or renovation project.',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/building-codes-inspection.jpg',
  'Industry News',
  '["building codes", "construction standards", "fire safety", "drywall installation", "2024 regulations"]',
  'published',
  '2024-01-18 11:45:00'
),
(
  'Our Team Completes Major Hospital Renovation Project',
  'hospital-renovation-project-completion',
  '<h2>Seamless Edge Delivers Excellence in Healthcare Facility Upgrade</h2><p>We''re proud to announce the successful completion of our largest commercial project to date: the comprehensive renovation of the west wing at Calgary General Hospital. This six-month project showcased our team''s ability to handle complex, large-scale commercial drywall installations with precision and professionalism.</p><h3>Project Scope</h3><p>The renovation encompassed 35,000 square feet of hospital space, including patient rooms, nursing stations, treatment areas, and corridors. Our team installed specialized drywall systems designed specifically for healthcare environments, including:</p><ul><li>Moisture-resistant drywall in wet areas</li><li>Impact-resistant drywall in high-traffic zones</li><li>Antimicrobial drywall for infection control</li><li>Acoustic solutions for patient comfort</li><li>Fire-rated assemblies meeting strict healthcare building codes</li></ul><h3>Unique Challenges</h3><p>Working in an active hospital environment presented unique challenges that our team successfully navigated:</p><p>- Maintaining strict infection control protocols<br>- Minimizing disruption to adjacent operational areas<br>- Adhering to hospital-specific safety regulations<br>- Coordinating with multiple trades in confined spaces<br>- Meeting accelerated timeline requirements</p><h3>Results</h3><p>Despite the challenges, our team delivered the project on schedule and within budget. Hospital administration commended our dust containment procedures, professional conduct, and the exceptional quality of our finished work.</p><p>This project demonstrates our capacity to handle institutional and commercial projects of significant scale while maintaining the same attention to detail and quality that defines all our work. We look forward to serving more commercial clients with specialized drywall installation needs.</p>',
  'Seamless Edge Drywall completes major renovation at Calgary General Hospital, showcasing our commercial project capabilities and healthcare facility expertise.',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/blog-images/hospital-renovation.jpg',
  'Company Updates',
  '["commercial project", "healthcare facility", "hospital renovation", "commercial drywall", "project completion"]',
  'published',
  '2024-02-05 14:00:00'
);

-- Seed gallery
INSERT INTO public.gallery (title, description, image_url, category, tags, is_featured, display_order, start_date, end_date, location)
VALUES 
(
  'Modern Living Room Renovation',
  'Complete drywall replacement and custom texture application in a contemporary living space',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery-images/modern-living-room.jpg',
  'Residential',
  '["living room", "knockdown texture", "renovation", "modern design"]',
  TRUE,
  1,
  '2023-09-10',
  '2023-09-25',
  'Calgary, AB'
),
(
  'Office Building Commercial Project',
  'Installation of fire-rated drywall systems throughout a three-story office building',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery-images/office-building.jpg',
  'Commercial',
  '["office space", "commercial", "fire-rated", "multi-floor"]',
  TRUE,
  2,
  '2023-10-15',
  '2023-12-10',
  'Calgary, AB'
),
(
  'Custom Ceiling Design',
  'Specialty drywall ceiling with integrated lighting and decorative elements',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery-images/custom-ceiling.jpg',
  'Residential',
  '["ceiling", "custom design", "lighting integration", "luxury home"]',
  TRUE,
  3,
  '2023-08-05',
  '2023-08-20',
  'Cochrane, AB'
),
(
  'Basement Finish Project',
  'Complete basement transformation with drywall installation, custom texturing, and finishing',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery-images/basement-finish.jpg',
  'Residential',
  '["basement", "renovation", "orange peel texture", "recreation room"]',
  FALSE,
  4,
  '2024-01-05',
  '2024-01-30',
  'Airdrie, AB'
),
(
  'Retail Store Renovation',
  'Commercial drywall installation with custom display niches and accent walls',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/gallery-images/retail-renovation.jpg',
  'Commercial',
  '["retail space", "commercial", "feature walls", "store design"]',
  FALSE,
  5,
  '2023-11-01',
  '2023-11-20',
  'Calgary, AB'
);

-- Seed messages
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

-- Seed clients
INSERT INTO public.clients (first_name, last_name, email, phone, address, city, state, zip, company, notes, client_type, status, source)
VALUES 
(
  'Robert',
  'Johnson',
  'robert.johnson@example.com',
  '(403) 555-1111',
  '123 Maple Street',
  'Calgary',
  'AB',
  'T2P 1J9',
  NULL,
  'Previous kitchen renovation client. Interested in basement finishing for Spring 2024.',
  'individual',
  'active',
  'referral'
),
(
  'Elizabeth',
  'Smith',
  'elizabeth.smith@example.com',
  '(403) 555-2222',
  '456 Oak Avenue',
  'Airdrie',
  'AB',
  'T4B 2Y7',
  'Smith Family Dental',
  'Owner of dental practice. Initial commercial project completed Jan 2023. Potential for ongoing maintenance contract.',
  'business',
  'active',
  'website'
),
(
  'William',
  'Davis',
  'william.davis@example.com',
  '(403) 555-3333',
  '789 Pine Road',
  'Calgary',
  'AB',
  'T3H 4J8',
  NULL,
  'New construction home. Complete drywall package scheduled for completion March 2024.',
  'individual',
  'active',
  'builder partner'
),
(
  'Patricia',
  'Martinez',
  'patricia.m@example.com',
  '(403) 555-4444',
  '234 Birch Lane',
  'Cochrane',
  'AB',
  'T4C 1A2',
  'Cochrane Realty Group',
  'Property manager for multiple rental units. Regular client for repairs and renovations between tenants.',
  'business',
  'active',
  'repeat customer'
),
(
  'James',
  'Thompson',
  'james.t@example.com',
  '(403) 555-5555',
  '567 Cedar Drive',
  'Calgary',
  'AB',
  'T2J 6K5',
  NULL,
  'Had water damage repair done in 2023. Not currently active but good candidate for follow-up.',
  'individual',
  'inactive',
  'emergency call'
);

-- Seed bookings
INSERT INTO public.bookings (title, client_name, client_email, client_phone, service_type, start_time, end_time, status, notes)
VALUES 
(
  'Initial Consultation',
  'Margaret Reynolds',
  'margaret.r@example.com',
  '(403) 555-6666',
  'Quote',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
  'confirmed',
  'Looking for a quote on drywall repair for recently purchased home'
),
(
  'Project Estimate',
  'Daniel Wilson',
  'daniel.w@example.com',
  '(403) 555-7777',
  'Estimate',
  NOW() + INTERVAL '4 days',
  NOW() + INTERVAL '4 days' + INTERVAL '2 hours',
  'confirmed',
  'Basement development project, approximately 900 sq ft'
),
(
  'Texture Consultation',
  'Amanda Garcia',
  'amanda.g@example.com',
  '(403) 555-8888',
  'Consultation',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days' + INTERVAL '1 hour',
  'pending',
  'Wants to see different texture samples for living room renovation'
),
(
  'Commercial Project Review',
  'Richard Taylor',
  'richard.t@example.com',
  '(403) 555-9999',
  'Commercial Quote',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
  'confirmed',
  'Office renovation project, needs to discuss sound insulation options'
),
(
  'Final Inspection',
  'Stephanie Brown',
  'stephanie.b@example.com',
  '(403) 555-0000',
  'Inspection',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days' + INTERVAL '1 hour',
  'confirmed',
  'Final walkthrough of completed basement project'
);

-- Seed jobs
INSERT INTO public.jobs (title, description, requirements, location, job_type, salary_range, is_active, posted_date, closing_date)
VALUES 
(
  'Senior Drywall Installer',
  'We''re looking for an experienced drywall installer to join our growing team. The ideal candidate will have extensive experience in both residential and commercial drywall installation, with the ability to work independently and supervise junior team members. Responsibilities include measuring and cutting drywall panels, securing panels to wall studs or ceiling joists, and preparing surfaces for finishing.',
  '- Minimum 5 years of professional drywall installation experience\n- Experience with both residential and commercial projects\n- Knowledge of building codes and safety regulations\n- Valid driver''s license and reliable transportation\n- Ability to lift and maneuver heavy drywall panels (up to 50 lbs)\n- Own basic hand tools\n- Strong attention to detail and commitment to quality',
  'Calgary, AB',
  'Full-time',
  '$28 - $35 per hour based on experience',
  TRUE,
  NOW() - INTERVAL '14 days',
  NOW() + INTERVAL '30 days'
),
(
  'Drywall Finisher/Taper',
  'We are seeking a skilled drywall finisher/taper to join our team. This position involves applying joint compound to drywall seams, embedding tape, and finishing drywall joints and corners to prepare walls for painting. The ideal candidate has experience with various textures and finishing techniques and takes pride in delivering smooth, flawless results.',
  '- 3+ years experience in drywall finishing and taping\n- Proficiency in applying various textures (knockdown, orange peel, smooth finish, etc.)\n- Experience with automatic taping tools preferred\n- Attention to detail and quality workmanship\n- Ability to sand walls and ceilings with minimal dust\n- Valid driver''s license and reliable transportation\n- Own finishing tools preferred',
  'Calgary and surrounding areas',
  'Full-time',
  '$26 - $32 per hour based on experience',
  TRUE,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '45 days'
),
(
  'Apprentice Drywall Installer',
  'Start your career in the drywall industry! We''re looking for motivated individuals to join our team as apprentice drywall installers. No experience necessary – we''ll provide on-the-job training under the supervision of our experienced installers. This is an excellent opportunity to learn a valuable trade while earning a competitive wage.',
  '- High school diploma or equivalent\n- Strong work ethic and willingness to learn\n- Good physical condition and ability to lift up to 50 lbs\n- Reliable transportation to job sites\n- Basic math skills\n- Ability to follow instructions and work as part of a team\n- Construction experience a plus but not required',
  'Calgary, AB',
  'Full-time',
  '$18 - $22 per hour to start, with regular increases based on skill development',
  TRUE,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '60 days'
),
(
  'Project Estimator',
  'We''re seeking an experienced project estimator to join our team. This office-based role involves reviewing blueprints and specifications, calculating material and labor requirements, preparing detailed cost estimates, and assisting with project planning. The ideal candidate will have a combination of practical drywall knowledge and strong administrative skills.',
  '- 3+ years experience in construction estimating, preferably in drywall/finishing\n- Ability to read and interpret blueprints and construction documents\n- Proficiency with estimating software and Microsoft Office\n- Strong math skills and attention to detail\n- Excellent communication skills for client and supplier interactions\n- Experience with project management a plus\n- Knowledge of current material costs and labor rates\n- Construction background preferred',
  'Calgary (Office-based with occasional site visits)',
  'Full-time',
  '$60,000 - $75,000 annually depending on experience',
  TRUE,
  NOW() - INTERVAL '21 days',
  NOW() + INTERVAL '15 days'
),
(
  'Administrative Assistant',
  'We''re looking for an organized, detail-oriented Administrative Assistant to support our growing drywall company. This role involves managing office operations, coordinating schedules, handling customer inquiries, processing invoices, and providing general administrative support to our management team. The ideal candidate is a proactive problem-solver with excellent communication skills.',
  '- Previous administrative experience in construction or trades industry preferred\n- Proficiency with Microsoft Office and office management software\n- Excellent organizational and time management skills\n- Strong written and verbal communication abilities\n- Experience with bookkeeping and basic accounting procedures\n- Ability to manage multiple priorities in a fast-paced environment\n- Customer service orientation with a professional demeanor',
  'Calgary (Office-based)',
  'Part-time (25-30 hours/week)',
  '$21 - $25 per hour based on experience',
  FALSE,
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '30 days'
);

-- Seed applications (for active jobs only)
INSERT INTO public.applications (job_id, first_name, last_name, email, phone, resume_url, cover_letter, status)
VALUES 
(
  1, -- Senior Drywall Installer
  'Michael',
  'Anderson',
  'michael.anderson@example.com',
  '(403) 555-1122',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/michael-anderson-resume.pdf',
  'With over 8 years of experience in drywall installation across both residential and commercial projects, I believe I would be an excellent fit for your Senior Drywall Installer position. I currently supervise a team of 3 installers and have extensive experience with specialty installations including fire-rated assemblies and sound-proof systems. I take pride in my attention to detail and commitment to quality craftsmanship on every project.',
  'under review'
),
(
  1, -- Senior Drywall Installer
  'David',
  'Patel',
  'david.patel@example.com',
  '(403) 555-3344',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/david-patel-resume.pdf',
  'I am writing to express my interest in the Senior Drywall Installer position. With 7 years of experience in the construction industry, including 5 years specializing in drywall installation, I have developed the skills necessary to excel in this role. I am particularly experienced in commercial projects with strict deadlines and have a reputation for clean, precise work that passes inspection on the first review.',
  'new'
),
(
  2, -- Drywall Finisher/Taper
  'Jessica',
  'Williams',
  'jessica.williams@example.com',
  '(403) 555-5566',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/jessica-williams-resume.pdf',
  'I am excited to apply for the Drywall Finisher position with your company. I have 4 years of specialized experience in drywall finishing, with particular expertise in texture application including knockdown, orange peel, and smooth finishes. I own a complete set of professional finishing tools including automatic tapers and am known for my attention to detail and efficient work pace. I look forward to bringing my skills to your team.',
  'interview scheduled'
),
(
  3, -- Apprentice Drywall Installer
  'Ryan',
  'Lopez',
  'ryan.lopez@example.com',
  '(403) 555-7788',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/ryan-lopez-resume.pdf',
  'Though I don''t have professional drywall experience, I am a quick learner with a strong work ethic. I recently completed a home renovation project where I installed drywall in my basement with guidance from an experienced friend, and I enjoyed the process immensely. I am physically fit, reliable, and eager to learn a skilled trade that offers career growth opportunities. I would appreciate the chance to discuss how my motivation and willingness to learn would make me a valuable addition to your team.',
  'new'
),
(
  4, -- Project Estimator
  'Jennifer',
  'Clark',
  'jennifer.clark@example.com',
  '(403) 555-9900',
  'https://abydznvlrzlcukrhxgqv.supabase.co/storage/v1/object/public/resumes/jennifer-clark-resume.pdf',
  'With 5 years of experience as a project estimator in the construction industry, including 3 years specifically in drywall and finishing work, I believe I would be an excellent candidate for your Project Estimator position. I am proficient with BlueBid estimating software and have a proven track record of accurate estimates that have helped maintain profitability while remaining competitive. My background includes 2 years of hands-on drywall installation experience, which gives me practical insight when preparing estimates.',
  'interview scheduled'
);

-- Seed settings with company information
INSERT INTO public.settings (section, key, value)
VALUES
-- Company information
('site_contact', 'company_name', 'Seamless Edge Drywall'),
('site_contact', 'contactEmail', 'info@seamlessedge.com'),
('site_contact', 'contactPhone', '(403) 555-7890'),
('site_contact', 'address', '123 Construction Way\nCalgary, AB T2P 1J9\nCanada'),

-- Social media links
('site_social', 'facebook', 'https://facebook.com/seamlessedgedrywall'),
('site_social', 'instagram', 'https://instagram.com/seamlessedge'),
('site_social', 'twitter', 'https://twitter.com/seamlessedge'),
('site_social', 'linkedin', 'https://linkedin.com/company/seamless-edge-drywall'),
('site_social', 'youtube', 'https://youtube.com/channel/seamlessedge'),

-- Business hours
('site_hours', 'monday', '8:00 AM - 5:00 PM'),
('site_hours', 'tuesday', '8:00 AM - 5:00 PM'),
('site_hours', 'wednesday', '8:00 AM - 5:00 PM'),
('site_hours', 'thursday', '8:00 AM - 5:00 PM'),
('site_hours', 'friday', '8:00 AM - 4:00 PM'),
('site_hours', 'saturday', '9:00 AM - 1:00 PM'),
('site_hours', 'sunday', 'Closed');

-- Complete the script by granting the current user access to the functions
GRANT EXECUTE ON FUNCTION get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_info(text) TO authenticated; 