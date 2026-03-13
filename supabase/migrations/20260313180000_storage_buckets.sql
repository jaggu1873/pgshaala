-- Create public bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allows anyone to view property images (public bucket)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'property_images');

-- Allows authenticated staff to insert/upload images
CREATE POLICY "Staff Uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'property_images');

-- Allows authenticated staff to update/delete images
CREATE POLICY "Staff Updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property_images');

CREATE POLICY "Staff Deletions"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property_images');
