import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFollow = (currentUserId?: string) => {
  const [followingList, setFollowingList] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFollowing = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUserId);

      if (error) throw error;

      setFollowingList(new Set(data.map(f => f.following_id)));
    } catch (err) {
      console.error('Failed to fetch following list:', err);
    }
  };

  const toggleFollow = async (targetUserId: string): Promise<boolean> => {
    if (!currentUserId || currentUserId === targetUserId) return false;

    try {
      setLoading(true);
      const isFollowing = followingList.has(targetUserId);

      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        // Update counts
        await Promise.all([
          supabase.rpc('decrement_user_following', { user_id: currentUserId }),
          supabase.rpc('decrement_user_followers', { user_id: targetUserId }),
        ]);

        setFollowingList(prev => {
          const newSet = new Set(prev);
          newSet.delete(targetUserId);
          return newSet;
        });

        return false;
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: targetUserId,
          });

        // Update counts
        await Promise.all([
          supabase.rpc('increment_user_following', { user_id: currentUserId }),
          supabase.rpc('increment_user_followers', { user_id: targetUserId }),
        ]);

        setFollowingList(prev => new Set([...prev, targetUserId]));

        return true;
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      throw new Error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = (userId: string): boolean => {
    return followingList.has(userId);
  };

  useEffect(() => {
    fetchFollowing();
  }, [currentUserId]);

  return {
    isFollowing,
    toggleFollow,
    loading,
  };
};