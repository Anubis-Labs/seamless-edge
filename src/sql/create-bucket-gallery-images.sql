-- Create a storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Add security policies for the bucket
-- Public read access
CREATE POLICY "Gallery Images Public Read Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Authenticated users can upload images
CREATE POLICY "Authenticated Users Can Upload Gallery Images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users can update and delete their uploaded images
CREATE POLICY "Authenticated Users Can Update Gallery Images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated Users Can Delete Gallery Images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images'); 