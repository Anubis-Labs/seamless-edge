-- Fix bookings table RLS policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select from bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to insert into bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to delete from bookings" ON public.bookings;

-- Create RLS policies for bookings table
CREATE POLICY "Allow authenticated users to select from bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update bookings" 
  ON public.bookings FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from bookings" 
  ON public.bookings FOR DELETE 
  USING (auth.role() = 'authenticated');
