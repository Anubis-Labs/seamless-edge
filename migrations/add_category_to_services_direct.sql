-- Add category column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT;

-- Set default value for existing services
UPDATE public.services SET category = 'General' WHERE category IS NULL;

-- Add index for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category); 