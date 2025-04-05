-- Fix services and applications tables

-- Drop and recreate applications table properly
DROP TABLE IF EXISTS public.applications CASCADE;

CREATE TABLE public.applications (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key if jobs table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
    ALTER TABLE public.applications 
      ADD CONSTRAINT applications_job_id_fkey 
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS and add policies for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users full access to applications" ON public.applications;
  
  CREATE POLICY "Allow authenticated users full access to applications" 
    ON public.applications FOR ALL TO authenticated USING (true);
END $$;

-- Services policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users full access to services" ON public.services;
  DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
  
  CREATE POLICY "Allow authenticated users full access to services" 
    ON public.services FOR ALL TO authenticated USING (true);
    
  CREATE POLICY "Allow public read access to services" 
    ON public.services FOR SELECT TO anon USING (is_active = true);
END $$;

-- Grant permissions
GRANT ALL ON TABLE public.applications TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE applications_id_seq TO authenticated;

-- Add sample applications if jobs exist
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
END $$; 