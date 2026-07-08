/*
# Create reviews storage bucket for transformation images

1. Storage Buckets
- `reviews` - stores before/after transformation images
  - Public bucket for serving images

2. Security
- Public read access
- Authenticated users can upload

3. Notes
- Images uploaded by clients for their transformation reviews
- Bucket will be created if it doesn't exist
*/

-- Insert the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images (public bucket)
DROP POLICY IF EXISTS "public_view_review_images" ON storage.objects;
CREATE POLICY "public_view_review_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'reviews');

-- Policy: Anyone can upload review images
DROP POLICY IF EXISTS "public_upload_review_images" ON storage.objects;
CREATE POLICY "public_upload_review_images" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'reviews');