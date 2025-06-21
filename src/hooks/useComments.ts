import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    full_name: string;
    profile_image: string | null;
  };
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:users(id, full_name, profile_image)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, authorId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: authorId,
          content: content.trim(),
        })
        .select(`
          *,
          author:users(id, full_name, profile_image)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);

      // Increment comment count on post
      await supabase.rpc('increment_post_comments', { post_id: postId });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const likeComment = async (commentId: string, userId: string): Promise<boolean> => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);

        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
        
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes_count: comment.likes_count - 1 }
              : comment
          )
        );
        
        return false;
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: userId });

        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
        
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes_count: comment.likes_count + 1 }
              : comment
          )
        );
        
        return true;
      }
    } catch (err) {
      throw new Error('Failed to toggle comment like');
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();

      // Subscribe to real-time comments
      const subscription = supabase
        .channel(`comments:${postId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`,
          },
          async (payload) => {
            // Fetch the new comment with author data
            const { data } = await supabase
              .from('comments')
              .select(`
                *,
                author:users(id, full_name, profile_image)
              `)
              .eq('id', payload.new.id)
              .single();

            if (data) {
              setComments(prev => [...prev, data]);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [postId]);

  return {
    comments,
    loading,
    error,
    addComment,
    likeComment,
    refetch: fetchComments,
  };
};