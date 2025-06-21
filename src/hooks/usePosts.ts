import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { pinataService } from '../lib/pinata';

interface Author {
  id: string;
  full_name: string;
  profile_image: string | null;
  wallet_address: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: Author;
  pinata_cid: string;
  tags: string[];
  image_url: string | null;
  read_time: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  coin_price: number;
  price_change: number;
  holders_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (filters?: {
    authorId?: string;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:users(id, full_name, profile_image, wallet_address)
        `)
        .order('created_at', { ascending: false });

      if (filters?.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostData, authorId: string): Promise<string> => {
    try {
      // Generate excerpt from content
      const excerpt = postData.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 200) + '...';

      // Calculate read time (average 200 words per minute)
      const wordCount = postData.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      // Pin to Pinata
      const metadata = {
        title: postData.title,
        content: postData.content,
        excerpt,
        tags: postData.tags,
        author: authorId,
        timestamp: new Date().toISOString(),
        imageUrl: postData.imageUrl,
      };

      const pinataCid = await pinataService.pinPostMetadata(metadata);

      // Save to Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          content: postData.content,
          excerpt,
          author_id: authorId,
          pinata_cid: pinataCid,
          tags: postData.tags,
          image_url: postData.imageUrl || null,
          read_time: readTime,
          is_published: true,
          coin_price: Math.random() * 100 + 10, // Mock initial price
          price_change: (Math.random() - 0.5) * 20, // Mock price change
          holders_count: Math.floor(Math.random() * 1000) + 100, // Mock holders
        })
        .select()
        .single();

      if (error) throw error;

      // Update user's post count
      await supabase.rpc('increment_user_posts', { user_id: authorId });

      return data.id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const likePost = async (postId: string, userId: string): Promise<boolean> => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        await supabase.rpc('decrement_post_likes', { post_id: postId });
        return false;
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });

        await supabase.rpc('increment_post_likes', { post_id: postId });
        return true;
      }
    } catch (err) {
      throw new Error('Failed to toggle like');
    }
  };

  const incrementViews = async (postId: string, userId?: string) => {
    try {
      // Add view record
      await supabase
        .from('post_views')
        .insert({
          post_id: postId,
          user_id: userId || null,
          ip_address: null, // Could be implemented with server-side tracking
        });

      // Increment view count
      await supabase.rpc('increment_post_views', { post_id: postId });
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost,
    incrementViews,
  };
};