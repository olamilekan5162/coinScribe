/*
  # Create posts table and related functionality

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `excerpt` (text, not null)
      - `author_id` (uuid, foreign key to users)
      - `pinata_cid` (text, not null)
      - `tags` (text array, default empty array)
      - `image_url` (text, nullable)
      - `read_time` (integer, default 1)
      - `views_count` (integer, default 0)
      - `likes_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `shares_count` (integer, default 0)
      - `coin_price` (numeric, default 0)
      - `price_change` (numeric, default 0)
      - `holders_count` (integer, default 0)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `posts` table
    - Add policies for reading published posts
    - Add policies for authors to manage their own posts
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pinata_cid text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  read_time integer DEFAULT 1,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  coin_price numeric DEFAULT 0,
  price_change numeric DEFAULT 0,
  holders_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authors can read their own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = author_id::text);

CREATE POLICY "Authors can insert their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Authors can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = author_id::text);

CREATE POLICY "Authors can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = author_id::text);

-- Create updated_at trigger
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);