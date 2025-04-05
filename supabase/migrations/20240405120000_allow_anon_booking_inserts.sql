-- Migration: Allow anonymous inserts into bookings

-- Allow anonymous users (and by extension, authenticated users)
-- to insert into the bookings table.
-- Assumes RLS is already enabled on the table.
CREATE POLICY "Allow public anonymous inserts into bookings" ON public.bookings
  FOR INSERT
  TO anon -- Granting to anon implicitly grants to authenticated as well
  WITH CHECK (true); -- No specific check needed for anonymous insert

-- Note: The existing admin policy "Allow admin full access to bookings"
-- still grants admins full control (SELECT, UPDATE, DELETE). 