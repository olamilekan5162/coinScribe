import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit3,
  LogOut,
  Share2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { usePosts } from "../../hooks/usePosts";
import { useFollow } from "../../hooks/useFollow";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import PostCard from "../../components/PostCard/PostCard";
import StatsPanel from "../../components/StatsPanel/StatsPanel";
import styles from "./Profile.module.css";
import { getProfileBalances } from "@zoralabs/coins-sdk";
import { formatEther, parseEther } from "viem";
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import { privateKeyToAccount } from "viem/accounts";
import Analytics from "../../components/Analytics/Analytics";

interface ProfileUser {
  id: string;
  wallet_address: string;
  full_name: string;
  email: string | null;
  profile_image: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  total_earnings: number;
  created_at: string;
}

const Profile: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const { user: currentUser } = useAuth();
  const { posts, isLoading: postsLoading } = usePosts();
  const userPosts = posts.filter(
    (mypost) => address?.toLocaleLowerCase() === mypost?.creatorAddress
  );
  const {
    isFollowing,
    toggleFollow,
    loading: followLoading,
  } = useFollow(currentUser?.id);

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [userHoldings, setUserHoldings] = useState(null);
  const [activeTab, setActiveTab] = useState<"posts" | "analytics">("posts");

  useEffect(() => {
    async function fetchUserBalances() {
      if (!address) {
        console.log("user address not found");
        return;
      }

      // const coin = formatEther(2950854219812984816808n);
      const response = await getProfileBalances({
        identifier: address,
      });
      const profile: any = response.data?.profile?.coinBalances?.edges;
      const filteredProfile = profile.filter(
        (res: any) =>
          res?.node?.coin?.platformReferrerAddress ===
          "0x4e998ae5b55e492d0d2665ca854b03625f7acf33"
      );

      setUserHoldings(filteredProfile);
    }
    fetchUserBalances();
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchProfileUser(address);
    }
  }, [address]);

  const fetchProfileUser = async (walletAddress: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setError("User not found");
        } else {
          throw error;
        }
        return;
      }
      setProfileUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileUser) return;

    try {
      await toggleFollow(profileUser.id);
      // Update local follower count
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followers_count: isFollowing(profileUser.id)
                ? prev.followers_count - 1
                : prev.followers_count + 1,
            }
          : null
      );
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const isOwnProfile =
    currentUser?.wallet_address.toLowerCase() === address?.toLowerCase();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // const formatNumber = (num: number): string => {
  //   if (num >= 1000000) {
  //     return (num / 1000000).toFixed(1) + "M";
  //   } else if (num >= 1000) {
  //     return (num / 1000).toFixed(1) + "K";
  //   }
  //   return num.toString();
  // };

  if (loading) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <div className={styles.loading}>
            <Loader2 className="animate-spin mr-2" size={24} />
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <div className={styles.error}>
            <h2>Profile Not Found</h2>
            <p>{error || "The requested profile could not be found."}</p>
            <Link to="/" className={styles.backHome}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className="container">
        {/* Profile Header */}
        <div className={`${styles.profileHeader} glass`}>
          <div className={styles.profileInfo}>
            <UserAvatar
              src={profileUser.profile_image || undefined}
              alt={profileUser.full_name}
              size="xl"
              showBorder
            />
            <div className={styles.profileMeta}>
              <div className={styles.profileName}>
                <h1>{profileUser.full_name}</h1>
                <p className={styles.walletAddress}>
                  {profileUser.wallet_address.slice(0, 6)}...
                  {profileUser.wallet_address.slice(-4)}
                </p>
              </div>

              {profileUser.bio && (
                <p className={styles.bio}>{profileUser.bio}</p>
              )}

              <div className={styles.profileDetails}>
                <div className={styles.joinDate}>
                  <Calendar size={16} />
                  <span>Joined {formatDate(profileUser.created_at)}</span>
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {profileUser.followers_count}
                  </span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {profileUser.following_count}
                  </span>
                  <span className={styles.statLabel}>Following</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{userPosts?.length}</span>
                  <span className={styles.statLabel}>Posts</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    ${profileUser.total_earnings}
                  </span>
                  <span className={styles.statLabel}>Earned</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            {isOwnProfile ? (
              <>
                <button className={styles.editButton} onClick={logout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
                <Link to="/create" className={`${styles.createButton} glow`}>
                  <Edit3 size={20} />
                  <span>Write</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`${styles.followButton} ${
                    isFollowing(profileUser.id) ? styles.following : ""
                  }`}
                >
                  {isFollowing(profileUser.id) ? "Following" : "Follow"}
                </button>
                <button className={styles.shareButton}>
                  <Share2 size={20} />
                </button>
                <button className={styles.moreButton}>
                  <MoreHorizontal size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.contentLayout}>
          <div className={styles.mainContent}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                onClick={() => setActiveTab("posts")}
                className={`${styles.tab} ${
                  activeTab === "posts" ? styles.tabActive : ""
                }`}
              >
                Posts ({userPosts.length})
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`${styles.tab} ${
                    activeTab === "analytics" ? styles.tabActive : ""
                  }`}
                >
                  Analytics
                </button>
              )}
            </div>

            {/* Posts Grid */}
            {activeTab === "posts" && (
              <div className={styles.postsSection}>
                {postsLoading ? (
                  <div className={styles.loading}>
                    <Loader2 className="animate-spin mr-2" size={24} />
                    Loading posts...
                  </div>
                ) : userPosts.length > 0 ? (
                  <div className={styles.postsGrid}>
                    {userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h3>No posts yet</h3>
                    <p>
                      {isOwnProfile
                        ? "Start writing your first story!"
                        : `${profileUser.full_name} hasn't published any posts yet.`}
                    </p>
                    {isOwnProfile && (
                      <Link to="/create" className={styles.createFirstPost}>
                        Write Your First Post
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === "analytics" && (
              <Analytics userHoldings={userHoldings} />
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <StatsPanel
              variant="dashboard"
              data={{
                totalEarnings: profileUser.total_earnings,
                coinPrice: 45.67, // Mock data
                holders: 1250, // Mock data
                views: 15420, // Mock data
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
