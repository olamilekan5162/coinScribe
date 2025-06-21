/*
  # Create utility functions for counters and operations

  1. Functions
    - Increment/decrement functions for various counters
    - Helper functions for common operations

  2. Security
    - Functions are security definer to bypass RLS when needed
*/

-- Function to increment post likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes_count = likes_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement post likes
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes_count = GREATEST(0, likes_count - 1) 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET views_count = views_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post comments
CREATE OR REPLACE FUNCTION increment_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET comments_count = comments_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement post comments
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET comments_count = GREATEST(0, comments_count - 1) 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments 
  SET likes_count = likes_count + 1 
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement comment likes
CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments 
  SET likes_count = GREATEST(0, likes_count - 1) 
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user posts
CREATE OR REPLACE FUNCTION increment_user_posts(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET posts_count = posts_count + 1 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement user posts
CREATE OR REPLACE FUNCTION decrement_user_posts(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET posts_count = GREATEST(0, posts_count - 1) 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user followers
CREATE OR REPLACE FUNCTION increment_user_followers(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET followers_count = followers_count + 1 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement user followers
CREATE OR REPLACE FUNCTION decrement_user_followers(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET followers_count = GREATEST(0, followers_count - 1) 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user following
CREATE OR REPLACE FUNCTION increment_user_following(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET following_count = following_count + 1 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement user following
CREATE OR REPLACE FUNCTION decrement_user_following(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET following_count = GREATEST(0, following_count - 1)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;