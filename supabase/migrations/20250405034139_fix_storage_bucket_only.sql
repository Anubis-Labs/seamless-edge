-- ENSURE STORAGE BUCKET EXISTS AND IS PROPERLY CONFIGURED
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  ('site-assets', 'Site Assets', TRUE, FALSE, 50000000, '{image/*}')
ON CONFLICT (id) DO UPDATE SET 
  public = TRUE, -- Make sure it's publicly accessible
  file_size_limit = 50000000,
  allowed_mime_types = '{image/*}';

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public access to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to select from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to insert into site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update in site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from site-assets" ON storage.objects;

-- Create public read access policy
CREATE POLICY "Allow public access to site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Create authenticated users policies for CRUD operations
CREATE POLICY "Allow authenticated users to insert into site-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update in site-assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete from site-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
