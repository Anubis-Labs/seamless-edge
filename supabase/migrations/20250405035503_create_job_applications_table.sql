-- Removed storage bucket and policies creation due to compatibility issues
-- We'll create those manually from the Supabase dashboard instead

-- Create the job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT,
    message TEXT,
    resume_url TEXT,
    job_id INTEGER REFERENCES public.jobs(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_applications_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the job_applications table
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION update_job_applications_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications
-- Admin users can view all job applications
CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
USING (auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin'));

-- Admin users can create job applications
CREATE POLICY "Admins can create job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin'));

-- Admin users can update job applications
CREATE POLICY "Admins can update job applications"
ON public.job_applications
FOR UPDATE
USING (auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin'));

-- Admin users can delete job applications
CREATE POLICY "Admins can delete job applications"
ON public.job_applications
FOR DELETE
USING (auth.uid() IN (SELECT auth.uid() FROM public.profiles WHERE role = 'admin'));

-- Any user can create a job application
CREATE POLICY "Any user can create a job application"
ON public.job_applications
FOR INSERT
WITH CHECK (true);
