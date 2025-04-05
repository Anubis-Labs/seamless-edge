-- Seed clients table with dummy data
INSERT INTO public.clients (first_name, last_name, email, phone, address, city, state, zip_code, zip, company, notes, client_type, status, source)
VALUES
  ('John', 'Smith', 'john.smith@example.com', '(403) 555-1234', '123 Main St', 'Calgary', 'AB', 'T2P 1J9', 'T2P 1J9', 'ABC Construction', 'New residential client', 'business', 'active', 'referral'),
  ('Sarah', 'Johnson', 'sarah.j@example.com', '(403) 555-2345', '456 Elm Avenue', 'Calgary', 'AB', 'T3B 2K1', 'T3B 2K1', 'Johnson Family', 'Interested in basement renovation', 'individual', 'active', 'website'),
  ('Mike', 'Williams', 'mike.w@example.com', '(403) 555-3456', '789 Oak Drive', 'Airdrie', 'AB', 'T4B 3L2', 'T4B 3L2', 'Williams Contractors', 'Commercial client, multiple locations', 'business', 'active', 'linkedin'),
  ('Emma', 'Davis', 'emma.d@example.com', '(403) 555-4567', '101 Pine Road', 'Calgary', 'AB', 'T2A 4M3', 'T2A 4M3', NULL, 'Repeat customer', 'individual', 'active', 'repeat'),
  ('Robert', 'Brown', 'robert.b@example.com', '(403) 555-5678', '202 Cedar Lane', 'Okotoks', 'AB', 'T1S 5N4', 'T1S 5N4', 'Brown & Associates', 'Office renovation project', 'business', 'inactive', 'trade_show')
ON CONFLICT DO NOTHING;

-- Seed bookings table with dummy data
INSERT INTO public.bookings (title, client_name, client_email, client_phone, service_type, start_time, end_time, status, notes)
VALUES
  ('Initial Consultation', 'John Smith', 'john.smith@example.com', '(403) 555-1234', 'Consultation', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '1 hour', 'confirmed', 'Discuss office renovation'),
  ('Site Measurement', 'Sarah Johnson', 'sarah.j@example.com', '(403) 555-2345', 'Measurement', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '2 hours', 'confirmed', 'Take measurements for basement renovation'),
  ('Project Quote', 'Mike Williams', 'mike.w@example.com', '(403) 555-3456', 'Quote', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 'pending', 'Quote for multiple locations'),
  ('Follow-up Meeting', 'Emma Davis', 'emma.d@example.com', '(403) 555-4567', 'Consultation', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '45 minutes', 'pending', 'Follow up on previous project'),
  ('Final Inspection', 'Robert Brown', 'robert.b@example.com', '(403) 555-5678', 'Inspection', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 'confirmed', 'Final inspection of office renovation')
ON CONFLICT DO NOTHING;

-- Seed messages table with dummy data
INSERT INTO public.messages (name, email, phone, message, source, status, archived)
VALUES
  ('Alex Thompson', 'alex.t@example.com', '(403) 555-6789', 'I''m interested in getting a quote for drywall installation in my basement. Please contact me at your earliest convenience.', 'contact_form', 'new', false),
  ('Jessica Chen', 'jessica.c@example.com', '(403) 555-7890', 'We have a commercial renovation project starting next month and need drywall services. Can you provide a detailed quote?', 'contact_form', 'in_progress', false),
  ('Brian Wilson', 'brian.w@example.com', '(403) 555-8901', 'Do you offer drywall repair services? I have some water damage in my ceiling.', 'contact_form', 'completed', false),
  ('Kimberly Rodriguez', 'kim.r@example.com', '(403) 555-9012', 'Looking for assistance with finishing drywall in a new construction home. What is your availability in July?', 'referral', 'new', false),
  ('David Patel', 'david.p@example.com', '(403) 555-0123', 'Need help with acoustic ceiling removal and drywall installation. Is this a service you provide?', 'instagram', 'new', false)
ON CONFLICT DO NOTHING;

-- Seed projects table with dummy data
INSERT INTO public.projects (title, description, client_id, status, start_date, end_date, total_cost, service_type)
VALUES
  ('Office Renovation - Brown & Associates', 'Complete drywall installation and finishing for 3000 sq ft office space', 5, 'completed', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', 12500.00, 'Commercial'),
  ('Johnson Basement Renovation', 'Drywall installation, taping, and finishing for basement development', 2, 'in_progress', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 4800.00, 'Residential'),
  ('Williams Multi-Location Repairs', 'Drywall repairs at 3 retail locations', 3, 'pending', NOW() + INTERVAL '5 days', NOW() + INTERVAL '25 days', 7200.00, 'Commercial'),
  ('ABC Construction New Build', 'Complete drywall package for new custom home', 1, 'scheduled', NOW() + INTERVAL '30 days', NOW() + INTERVAL '60 days', 18500.00, 'Residential'),
  ('Davis Home Ceiling Repair', 'Repair water damaged ceiling and repaint', 4, 'completed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '22 days', 950.00, 'Repair')
ON CONFLICT DO NOTHING;

-- Seed testimonials table with dummy data
INSERT INTO public.testimonials (client_name, client_title, client_company, client_location, client_image, content, rating, status, service_type, display_on_homepage)
VALUES
  ('John Smith', 'Project Manager', 'ABC Construction', 'Calgary, AB', 'https://plus.unsplash.com/premium_photo-1661775181124-11b11d8b671a?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Seamless Edge did an outstanding job on our custom home project. Their attention to detail and quality workmanship exceeded our expectations. The team was professional, punctual, and the finished product looks amazing.', 5, 'approved', 'Residential', true),
  ('Emma Davis', 'Homeowner', NULL, 'Calgary, AB', 'https://plus.unsplash.com/premium_photo-1692893358083-d395aa6b9816?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'I had water damage in my ceiling and Seamless Edge came to the rescue. They repaired the damage quickly and efficiently, leaving no trace that there was ever an issue. Their prices were fair and the service was excellent.', 5, 'approved', 'Repair', true),
  ('Robert Brown', 'Managing Partner', 'Brown & Associates', 'Okotoks, AB', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Our office renovation was completed on time and on budget thanks to Seamless Edge. The team was responsive to our needs and worked around our business hours to minimize disruption. The finished space looks fantastic!', 4, 'approved', 'Commercial', false),
  ('Sarah Johnson', 'Homeowner', NULL, 'Calgary, AB', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'We hired Seamless Edge for our basement renovation and couldn''t be happier with the results. The team was skilled, clean, and respectful of our home. The drywall finishing is flawless!', 5, 'approved', 'Residential', true),
  ('Mike Williams', 'Operations Director', 'Williams Contractors', 'Airdrie, AB', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Seamless Edge has been our go-to drywall contractor for multiple projects. Their work is consistently excellent, and they are reliable partners in our construction projects. Highly recommended for commercial work.', 5, 'pending', 'Commercial', false)
ON CONFLICT DO NOTHING;

-- Seed blog_categories table with dummy data
INSERT INTO public.blog_categories (name)
VALUES
  ('Drywall Tips'),
  ('Project Showcases'),
  ('Industry News'),
  ('DIY Guides'),
  ('Company Updates')
ON CONFLICT DO NOTHING;

-- Seed blog_posts table with dummy data
INSERT INTO public.blog_posts (title, slug, content, excerpt, featured_image, category, tags, status, published_at)
VALUES
  ('5 Tips for Perfect Drywall Finishing', '5-tips-for-perfect-drywall-finishing', 
   '# 5 Tips for Perfect Drywall Finishing

## 1. Proper Preparation
Before you begin the finishing process, ensure all drywall sheets are properly installed and secured. Check for protruding screws and hammer them in. The surface should be clean and free from dust.

## 2. Use Quality Materials
Investing in high-quality joint compound and drywall tape will save you time and frustration in the long run. Premium materials tend to be easier to work with and provide better results.

## 3. Apply Multiple Thin Coats
Rather than attempting to fill joints with a single thick application, apply multiple thin coats of joint compound. This approach reduces shrinkage and cracking while allowing each layer to dry properly.

## 4. Sand Between Coats
Light sanding between coats helps achieve a smoother finish. Use fine-grit sandpaper and don''t oversand, as this can damage the paper surface of the drywall.

## 5. Proper Lighting
Use adequate lighting when finishing drywall. Position lights to create shadows across the surface, which helps identify uneven areas that need additional attention.

Following these tips will help you achieve professional-quality drywall finishing results on your next project!',
   'Achieve professional-quality results with these expert tips for drywall finishing that focus on preparation, materials, application techniques, and final touches.',
   'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   'Drywall Tips',
   '["finishing", "tips", "how-to", "drywall"]',
   'published',
   NOW() - INTERVAL '30 days'),
   
  ('Commercial vs. Residential Drywall: Key Differences', 'commercial-vs-residential-drywall-differences', 
   '# Commercial vs. Residential Drywall: Key Differences

When it comes to drywall installation, there are significant differences between commercial and residential projects. Understanding these differences is crucial for proper planning and execution.

## Material Thickness
Commercial projects typically require thicker drywall panels, often 5/8" thickness compared to the standard 1/2" used in most residential applications. The increased thickness provides better fire resistance and sound insulation, which are critical in commercial buildings.

## Fire Codes
Commercial buildings are subject to stricter fire codes. Type X fire-resistant drywall is commonly required for commercial spaces, especially in walls separating different units or rooms, and in buildings with multiple stories.

## Sound Insulation
Commercial spaces often need superior sound insulation. This may involve using specialized soundproof drywall or installing multiple layers with acoustic sealant to minimize sound transmission between offices or commercial units.

## Durability Requirements
High-traffic commercial environments need more durable wall surfaces. This often means using impact-resistant drywall in corridors and public areas. These specialized panels contain fiberglass mesh or other reinforcement to withstand impacts and abrasion.

## Installation Scale and Timeline
Commercial projects typically cover larger areas and have tighter schedules. This requires more efficient installation methods, larger crews, and sometimes specialized equipment not needed for residential jobs.

## Finishing Standards
Commercial spaces often have different lighting conditions (e.g., bright overhead lighting) that can highlight imperfections. This requires higher-grade finishing work, particularly in upscale spaces like hotel lobbies or corporate offices.

Understanding these key differences helps contractors properly plan and execute drywall projects across different settings, ensuring compliance with building codes while meeting client expectations for quality and durability.',
   'Learn the critical differences between commercial and residential drywall projects, from material specifications and fire code requirements to installation methods and finishing standards.',
   'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   'Industry News',
   '["commercial", "residential", "construction", "building-codes"]',
   'published',
   NOW() - INTERVAL '15 days'),
   
  ('Project Showcase: The Henderson Office Building', 'project-showcase-henderson-office-building', 
   '# Project Showcase: The Henderson Office Building

We recently completed a major drywall installation and finishing project at the new Henderson Office Building in downtown Calgary. This project presented several unique challenges and opportunities for our team to demonstrate our expertise.

## Project Overview
The Henderson Building is a newly constructed 5-story office complex with over 25,000 square feet of drywall installation. Our scope included:

- Installation of fire-rated drywall in stairwells and elevator shafts
- Acoustic ceilings in meeting rooms and common areas
- Custom curved walls in the main lobby
- Sound-insulated partition walls between office suites

## Challenges and Solutions
One of the main challenges was the curved feature wall in the main lobby, which required precise cutting and installation of drywall on a radius. Our team used specialized techniques including:

1. Creating a template for the curved sections
2. Making multiple relief cuts in the back of the drywall to allow bending
3. Double-layering to achieve the required fire rating while maintaining the curve
4. Careful finishing to ensure a seamless appearance under the lobby''s dramatic lighting

## Timeline and Execution
The project was completed over 12 weeks with a team of 15 drywall professionals working in carefully coordinated phases to accommodate other trades. Despite supply chain challenges affecting material delivery, we completed the project on schedule by:

- Implementing just-in-time delivery logistics
- Utilizing evening shifts for noisy work to minimize disruption to neighboring businesses
- Coordinating closely with the general contractor and other subcontractors

## Results
The finished project has received praise from the building owner and tenants for its exceptional quality. The curved feature wall, in particular, has become a signature element of the building''s interior design.

We''re proud to add the Henderson Office Building to our portfolio of commercial projects and grateful for the opportunity to demonstrate our capabilities on such a visible and significant project in Calgary''s business district.',
   'Explore our recent completion of the Henderson Office Building project, featuring custom curved walls, fire-rated installations, and acoustic solutions for a modern office environment.',
   'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   'Project Showcases',
   '["commercial", "office", "project", "curved-walls"]',
   'published',
   NOW() - INTERVAL '7 days'),
   
  ('How to Repair Small Drywall Holes: DIY Guide', 'how-to-repair-small-drywall-holes-diy-guide', 
   '# How to Repair Small Drywall Holes: DIY Guide

Small holes in drywall from picture hangers, doorknobs, or minor accidents are common in any home. The good news is that these can be easily repaired without calling in professionals. Follow this step-by-step guide to make your walls look new again.

## What You''ll Need
- Spackle or lightweight joint compound
- Putty knife (3" or 4" wide)
- Fine-grit sandpaper (150-220 grit)
- Primer
- Paint that matches your wall
- Small paintbrush or roller
- Clean cloth
- Optional: self-adhesive mesh patch for holes larger than 1"

## Step 1: Prepare the Area
Clean the damaged area by removing any loose drywall or debris. For holes caused by nails or screws, use your finger or the putty knife to clear away any raised paper edges.

## Step 2: Fill the Hole
For tiny holes (less than 1/2"):
- Apply spackle directly over the hole using your putty knife
- Press firmly to ensure the spackle fills the hole completely
- Scrape the putty knife flat against the wall to remove excess

For holes between 1/2" and 2":
- For holes closer to 2", place a self-adhesive mesh patch over the hole
- Apply joint compound over the patch, feathering the edges to blend with the wall
- For multiple layers, allow each to dry completely before applying the next

## Step 3: Sand the Repair
Once the spackle or joint compound is completely dry:
- Lightly sand the area with fine-grit sandpaper
- Focus on creating a smooth transition between the repair and the surrounding wall
- Wipe away dust with a clean cloth

## Step 4: Prime and Paint
- Apply primer to the repaired area to seal the spackle and provide a uniform surface
- Once dry, apply paint that matches your wall
- For best results, use a small roller to match the texture of the surrounding wall

## Pro Tips
- For a perfect match, consider bringing a small chip of your existing paint to a hardware store for color matching
- Apply paint beyond the repaired area, feathering it outward to blend with the existing wall
- For textured walls, you may need to replicate the texture using specialized tools or spray texture

With these simple steps, you can easily repair small drywall damage and maintain the appearance of your walls. For larger holes or more significant damage, it might be best to consult with a professional drywall contractor.',
   'Learn how to easily repair small drywall holes with this step-by-step DIY guide covering everything from preparation and patching to achieving a seamless painted finish.',
   'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   'DIY Guides',
   '["diy", "repair", "home-maintenance", "how-to"]',
   'published',
   NOW() - INTERVAL '3 days'),
   
  ('Expanding Our Service Area to Airdrie and Okotoks', 'expanding-service-area-airdrie-okotoks', 
   '# Expanding Our Service Area to Airdrie and Okotoks

We''re excited to announce that Seamless Edge is officially expanding our service area to include Airdrie and Okotoks! This expansion comes in response to increasing demand from these growing communities and allows us to better serve the greater Calgary region.

## Why We''re Expanding
Over the past year, we''ve received numerous inquiries from homeowners and businesses in Airdrie and Okotoks. Rather than turning away these potential clients or charging additional travel fees, we''ve decided to incorporate these areas into our standard service region.

## What This Means for Clients
- **No Travel Surcharges**: Clients in Airdrie and Okotoks will now receive our services without any additional travel fees
- **Faster Response Times**: We''ve added crew members specifically to service these areas
- **Local Expertise**: We''ve been working with suppliers in these communities to ensure we understand local building requirements and preferences

## Our Full Range of Services
All services available to our Calgary clients will now be offered in Airdrie and Okotoks, including:

- Residential and commercial drywall installation
- Drywall finishing and texturing
- Repair services for damaged walls and ceilings
- Basement development
- Custom feature walls and ceiling details
- Renovations and remodeling projects

## Community Involvement
As part of our commitment to the communities we serve, we''ll be looking for opportunities to get involved in local events and initiatives in Airdrie and Okotoks. We believe in being more than just a service provider – we want to be an active part of the communities where we work.

## Schedule Your Consultation
If you''re located in Airdrie or Okotoks and have a drywall project in mind, we''d love to hear from you! Contact us today to schedule a free consultation and estimate. As a special introduction to these communities, we''re offering a 10% discount on all new projects booked in Airdrie and Okotoks through the end of the month.

We look forward to bringing our reputation for quality and reliability to these vibrant communities!',
   'Seamless Edge is proud to announce the expansion of our service area to include Airdrie and Okotoks, offering our full range of drywall services to these growing communities without travel surcharges.',
   'https://images.unsplash.com/photo-1654449153259-c0d8790eaea5?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   'Company Updates',
   '["expansion", "service-area", "airdrie", "okotoks"]',
   'draft',
   NULL)
ON CONFLICT DO NOTHING;
