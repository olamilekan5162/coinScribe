/*
  # Create post views table and related functionality

  1. New Tables
    - `post_views`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to posts)
      - `user_id` (uuid, foreign key to users, nullable for anonymous views)
      - `ip_address` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `post_views` table
    - Add policies for reading view data
    - Add policies for creating view records
*/

-- Create post_views table
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read view counts"
  ON post_views
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create view records"
  ON post_views
  FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON post_views(created_at);