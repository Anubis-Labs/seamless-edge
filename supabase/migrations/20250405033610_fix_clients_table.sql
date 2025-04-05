-- Add zip column to clients table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clients' 
        AND column_name = 'zip'
    ) THEN
        ALTER TABLE public.clients ADD COLUMN zip TEXT;
    END IF;
END $$;

-- Make sure clients table has proper RLS policies
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select from clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to insert into clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to update clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to delete from clients" ON public.clients;

-- Create RLS policies for clients table
CREATE POLICY "Allow authenticated users to select from clients" 
  ON public.clients FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into clients" 
  ON public.clients FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update clients" 
  ON public.clients FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from clients" 
  ON public.clients FOR DELETE 
  USING (auth.role() = 'authenticated');
