-- First, check if messages table exists; if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
        CREATE TABLE messages (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            status TEXT DEFAULT 'unread',
            phone TEXT
        );
    END IF;
END
$$;

-- Migrate message data from services table to messages table
-- Only copy rows that look like messages (having email field)
INSERT INTO messages (name, email, subject, message, created_at, phone)
SELECT 
    name, 
    email, 
    COALESCE(subject, 'No Subject'), 
    description, 
    created_at,
    phone
FROM services
WHERE email IS NOT NULL AND email != '';

-- Create backup of services table before cleanup
CREATE TABLE services_backup AS
SELECT * FROM services;

-- Delete migrated messages from services table
DELETE FROM services
WHERE email IS NOT NULL AND email != '';

-- If the services table is completely empty, add sample service
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
        INSERT INTO services (name, description, price, image_url)
        VALUES 
            ('Window Cleaning', 'Professional window cleaning service for residential and commercial properties', 150.00, '/images/services/window-cleaning.jpg'),
            ('Pressure Washing', 'High-pressure cleaning for exterior surfaces', 200.00, '/images/services/pressure-washing.jpg'),
            ('Gutter Cleaning', 'Complete gutter cleaning and maintenance', 125.00, '/images/services/gutter-cleaning.jpg');
    END IF;
END
$$; 