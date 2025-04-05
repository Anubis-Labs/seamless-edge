-- Insert company app settings
INSERT INTO public.app_settings (id, company_name, contact_email, contact_phone, business_hours, address) 
VALUES (1, 'Seamless Edge', 'info@seamlessedge.com', '(403) 555-7890', 'Mon-Fri: 8am-6pm, Sat: 9am-3pm', '123 Drywall Avenue, Calgary, AB T2P 1J9')
ON CONFLICT (id) DO UPDATE 
SET company_name = EXCLUDED.company_name,
    contact_email = EXCLUDED.contact_email,
    contact_phone = EXCLUDED.contact_phone,
    business_hours = EXCLUDED.business_hours,
    address = EXCLUDED.address;

-- Insert website settings
INSERT INTO public.settings (section, key, value) VALUES
-- Site Contact Settings
('site_contact', 'contactEmail', 'info@seamlessedge.com'),
('site_contact', 'contactPhone', '(403) 555-7890'),
('site_contact', 'address', '123 Drywall Avenue, Calgary, AB T2P 1J9'),

-- Site Social Media Settings
('site_social', 'facebook', 'https://facebook.com/seamlessedgecalgary'),
('site_social', 'instagram', 'https://instagram.com/seamlessedge_yyc'),
('site_social', 'linkedin', 'https://linkedin.com/company/seamless-edge-drywall'),
('site_social', 'youtube', 'https://youtube.com/channel/seamlessedge'),

-- Site Business Hours
('site_hours', 'monday', '8:00 AM - 6:00 PM'),
('site_hours', 'tuesday', '8:00 AM - 6:00 PM'),
('site_hours', 'wednesday', '8:00 AM - 6:00 PM'),
('site_hours', 'thursday', '8:00 AM - 6:00 PM'),
('site_hours', 'friday', '8:00 AM - 6:00 PM'),
('site_hours', 'saturday', '9:00 AM - 3:00 PM'),
('site_hours', 'sunday', 'Closed'),

-- Calculator Settings
('calculator', 'baseRates', '{"boarding": 2.50, "taping": 2.00, "sanding": 1.75, "repair": 75, "texture": 3.00}'),
('calculator', 'materialCostPercentage', '0.35'),
('calculator', 'laborCostPercentage', '0.65'),
('calculator', 'complexityModifiers', '{"simple": 1.0, "moderate": 1.2, "complex": 1.5}'),
('calculator', 'locationModifiers', '{"calgary": 1.0, "airdrie": 1.05, "okotoks": 1.08, "chestermere": 1.03}'),
('calculator', 'discountThresholds', '{"threshold1": {"sqft": 1000, "discount": 0.05}, "threshold2": {"sqft": 2500, "discount": 0.08}, "threshold3": {"sqft": 5000, "discount": 0.12}}')
ON CONFLICT (section, key) DO UPDATE 
SET value = EXCLUDED.value;

-- Insert blog categories
INSERT INTO public.blog_categories (name)
VALUES 
('Drywall Tips'),
('Painting Techniques'),
('Home Renovation'),
('Industry News'),
('Project Showcase'),
('Calgary Homes')
ON CONFLICT (name) DO NOTHING;

-- Insert clients
INSERT INTO public.clients (first_name, last_name, email, phone, address, city, state, zip_code, company, client_type, status, source)
VALUES
('Michael', 'Thompson', 'michael.thompson@example.com', '(403) 555-1234', '456 Signature Place', 'Calgary', 'AB', 'T3C 0P4', 'Thompson Homes', 'contractor', 'active', 'referral'),
('Sarah', 'Johnson', 'sarah.j@example.com', '(403) 555-5678', '789 Elbow Drive SW', 'Calgary', 'AB', 'T2S 2H9', NULL, 'individual', 'active', 'website'),
('Robert', 'Williams', 'rob.williams@example.com', '(403) 555-9012', '321 Heritage Drive SE', 'Calgary', 'AB', 'T2H 1M8', 'Williams Construction', 'contractor', 'active', 'industry_contact'),
('Jennifer', 'Brown', 'jen.brown@example.com', '(403) 555-3456', '654 McKenzie Towne Ave', 'Calgary', 'AB', 'T2Z 4C2', NULL, 'individual', 'active', 'referral'),
('David', 'Wilson', 'david@wilsonbuilders.ca', '(403) 555-7890', '987 Crowfoot Way NW', 'Calgary', 'AB', 'T3G 5K8', 'Wilson Builders Ltd', 'contractor', 'active', 'trade_show');

-- Insert projects
INSERT INTO public.projects (title, description, client_id, status, start_date, end_date, total_cost, service_type)
VALUES
('Thompson Development - Phase 1', 'Complete drywall installation for 8 new townhomes in Sage Hill', 1, 'completed', '2023-06-15', '2023-07-30', 58500.00, 'boarding_taping'),
('Johnson Basement Renovation', 'Drywall installation and finishing for basement development', 2, 'completed', '2023-08-10', '2023-08-25', 4350.00, 'full_service'),
('Williams Office Complex', 'Commercial drywall installation and custom texture finish', 3, 'in_progress', '2023-10-01', NULL, 32800.00, 'commercial'),
('Brown Kitchen Renovation', 'Drywall repair and new installation after kitchen remodel', 4, 'scheduled', '2023-11-15', NULL, 3800.00, 'repair_remodel'),
('Wilson Custom Homes - The Peaks', 'Full drywall service for 6 luxury homes in Aspen Woods', 5, 'pending', '2023-12-01', NULL, 112000.00, 'new_construction');

-- Insert bookings
INSERT INTO public.bookings (title, client_name, client_email, client_phone, service_type, start_time, end_time, status, notes)
VALUES
('Initial Consultation - Smith Residence', 'John Smith', 'john.smith@example.com', '(403) 555-2468', 'consultation', '2023-11-10 10:00:00', '2023-11-10 11:00:00', 'confirmed', 'New home in Mahogany area, looking for full drywall service'),
('Estimate - Fraser Office Renovation', 'Emily Fraser', 'emily@fraserassociates.com', '(403) 555-1357', 'estimate', '2023-11-12 13:00:00', '2023-11-12 14:30:00', 'confirmed', 'Office renovation in downtown Calgary, approximately 2500 sq ft'),
('Drywall Repair - Chang Residence', 'Wei Chang', 'wei.chang@example.com', '(403) 555-8642', 'repair', '2023-11-15 09:00:00', '2023-11-15 12:00:00', 'confirmed', 'Water damage repair in master bathroom'),
('Project Review - Williams Office', 'Robert Williams', 'rob.williams@example.com', '(403) 555-9012', 'follow_up', '2023-11-17 15:00:00', '2023-11-17 16:00:00', 'confirmed', 'Progress review of commercial project'),
('Texture Consultation - Patel Home', 'Anita Patel', 'anita.patel@example.com', '(403) 555-7531', 'consultation', '2023-11-20 14:00:00', '2023-11-20 15:00:00', 'pending', 'Customer interested in knockdown texture options for living room');

-- Insert testimonials
INSERT INTO public.testimonials (client_name, client_title, client_company, client_location, content, rating, status, service_type, display_on_homepage)
VALUES
('Karen Martinez', 'Homeowner', NULL, 'Calgary, AB', 'Seamless Edge completely transformed our basement. Their attention to detail and professional approach made all the difference. The walls are perfectly smooth!', 5, 'approved', 'full_service', true),
('Mike Peterson', 'Project Manager', 'Peterson Homes', 'Calgary, AB', 'We''ve worked with many drywall contractors over the years, but Seamless Edge consistently delivers the highest quality. They''re our go-to team for all projects.', 5, 'approved', 'new_construction', true),
('Lisa Chung', 'Interior Designer', 'Chung Design Associates', 'Calgary, AB', 'As an interior designer, I need perfect walls to showcase my work. Seamless Edge provides flawless finishes that make my designs shine. Highly recommended!', 5, 'approved', 'custom_finish', true),
('James Wilson', 'Homeowner', NULL, 'Airdrie, AB', 'After a water leak damaged our ceiling, Seamless Edge provided quick, professional repairs. You can''t even tell where the damage was. Great service!', 4, 'approved', 'repair', false),
('Sarah Thompson', 'Property Manager', 'Thompson Properties', 'Calgary, AB', 'We manage multiple commercial properties and rely on Seamless Edge for all our drywall needs. Their team is reliable, professional, and delivers quality work every time.', 5, 'approved', 'commercial', true);

-- Insert blog posts
INSERT INTO public.blog_posts (title, slug, content, excerpt, category, tags, status, published_at)
VALUES
('5 Essential Tips for Perfect Drywall Finishes', '5-essential-tips-perfect-drywall-finishes', 'Content about achieving perfect drywall finishes including proper mud mixing, using the right tools, sanding techniques, and patience...', 'Learn the professional secrets to achieving flawless drywall finishes that will make your walls look perfect.', 'Drywall Tips', '["finishing", "diy", "professional tips"]', 'published', '2023-09-15 09:00:00'),
('How Calgary''s Climate Affects Your Drywall', 'calgary-climate-drywall-effects', 'Content about Calgary''s unique climate challenges including dry winters, humidity fluctuations, and how to prepare and maintain drywall...', 'Calgary''s unique climate presents special challenges for drywall. Learn how to protect your investment.', 'Calgary Homes', '["calgary", "climate", "maintenance"]', 'published', '2023-08-20 10:30:00'),
('The Environmental Benefits of Modern Drywall Products', 'environmental-benefits-modern-drywall', 'Content about eco-friendly drywall options, recycled content, low VOC compounds, and sustainability initiatives...', 'Modern drywall products are more environmentally friendly than ever. Discover the green options available for your next project.', 'Industry News', '["eco-friendly", "sustainability", "innovation"]', 'published', '2023-07-05 11:15:00'),
('Before & After: Amazing Drywall Transformations in Calgary Homes', 'before-after-calgary-home-transformations', 'Content featuring impressive renovation projects, with before and after photos and descriptions of the process...', 'See the dramatic difference professional drywall services can make with these stunning Calgary home transformations.', 'Project Showcase', '["renovations", "transformations", "before-after"]', 'published', '2023-10-10 13:45:00'),
('How to Choose the Right Texture for Your Walls', 'choose-right-wall-texture-guide', 'Content explaining different texture options like knockdown, orange peel, popcorn, and smooth finishes with pros and cons...', 'Wall textures can dramatically change the look of your space. Learn how to choose the perfect texture for your home.', 'Drywall Tips', '["textures", "design", "home improvement"]', 'draft', NULL);

-- Insert messages
INSERT INTO public.messages (name, email, phone, message, source, status, archived)
VALUES
('Tanya Rodriguez', 'tanya.r@example.com', '(403) 555-3698', 'I''m renovating my kitchen and need drywall installation and finishing. Can you provide an estimate for approximately 500 square feet?', 'contact_form', 'new', false),
('Jason Park', 'jason.park@example.com', '(403) 555-1478', 'We''re building a new home in Cranston and looking for quotes from drywall contractors. Our build is approximately 2,800 sq ft. Would like to discuss your availability for January.', 'contact_form', 'in_progress', false),
('Melissa Knight', 'melissa.k@example.com', '(403) 555-9632', 'I have water damage in my basement ceiling and need repair services ASAP. How soon can someone come take a look?', 'contact_form', 'completed', true),
('Adam Singh', 'adam.singh@example.com', '(403) 555-2587', 'Interested in your custom texture services. Do you offer free consultations to discuss options? I''d like to update the look of my living room.', 'contact_form', 'new', false),
('Laura Evans', 'laura.evans@example.com', '(403) 555-7415', 'Our company is renovating our office space downtown (approximately 3,000 sq ft) and we need a reliable drywall contractor. Please call me to discuss our project timeline and your availability.', 'website_chat', 'new', false); 