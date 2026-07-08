/*
# Create reviews table for wellness center transformations

1. New Tables
- `reviews` - stores client transformation reviews and testimonials
  - `id` (uuid, primary key)
  - `full_name` (text, required) - client's full name
  - `mobile` (text, required) - contact number
  - `email` (text, required) - email address
  - `service` (text, required) - service type (Weight Loss, Skin Care, etc.)
  - `rating` (integer, 1-5) - star rating
  - `review_text` (text, required) - testimonial content
  - `before_image_url` (text, optional) - URL to before transformation image
  - `after_image_url` (text, optional) - URL to after transformation image
  - `duration` (text, optional) - program duration (e.g., "12 weeks")
  - `is_approved` (boolean, default false) - admin approval status
  - `created_at` (timestamptz) - submission timestamp

2. Security
- Enable RLS on `reviews`.
- Allow public read of approved reviews only.
- Allow anyone to insert reviews (public submission).
- Update and delete restricted to authenticated users (admin).

3. Notes
- Reviews are public and shared (no user_id, no auth required).
- Images stored as URLs (can be Supabase storage or external).
- Reviews require admin approval before display.
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  before_image_url text,
  after_image_url text,
  duration text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for approved reviews queries
CREATE INDEX IF NOT EXISTS idx_reviews_approved_created ON reviews(is_approved, created_at DESC);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can view approved reviews only
DROP POLICY IF EXISTS "public_view_approved_reviews" ON reviews;
CREATE POLICY "public_view_approved_reviews" ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Anyone can submit reviews (public submission)
DROP POLICY IF EXISTS "public_submit_reviews" ON reviews;
CREATE POLICY "public_submit_reviews" ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admins) can update reviews
DROP POLICY IF EXISTS "admin_update_reviews" ON reviews;
CREATE POLICY "admin_update_reviews" ON reviews FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Only authenticated users (admins) can delete reviews
DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE
  TO authenticated
  USING (true);