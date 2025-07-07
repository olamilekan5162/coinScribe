import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Coins,
  PenTool,
  Globe,
  Shield,
  Loader2,
  Triangle,
} from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import FeaturedCarousel from "../../components/FeaturedCarousel/FeaturedCarousel";
import PostCard from "../../components/PostCard/PostCard";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import styles from "./Home.module.css";
import { supabase } from "../../lib/supabase";

interface Creator {
  name: string;
  avatar: string;
  followers: number;
  totalEarnings: number;
  postsCount: number;
}

interface User {
  id: string;
  full_name: string;
  profile_image: string;
  followers_count: number;
  total_earnings: number;
  posts_count: number;
}

interface PlatformStat {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}

const Home: React.FC = () => {
  const { isLoading, error, posts } = usePosts();
  const [users, setUsers] = useState<User[] | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Loading skeleton components
  const PostSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 mb-4 rounded"></div>
      <div className="bg-gray-300 h-32 w-full rounded"></div>
    </div>
  );

  const CreatorSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4 text-center">
      <div className="bg-gray-300 h-16 w-16 rounded-full mx-auto mb-4"></div>
      <div className="bg-gray-300 h-4 w-3/4 mx-auto mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 mx-auto mb-4 rounded"></div>
      <div className="bg-gray-300 h-8 w-full rounded"></div>
    </div>
  );

  const HeroVisualSkeleton = () => (
    <div className="animate-pulse">
      <div className="rounded-lg bg-gray-200 p-4 max-w-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-1">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-5 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-3 w-16 bg-gray-300 rounded"></div>
          <div className="h-3 w-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="animate-spin mr-2" size={24} />
      <span>{text}</span>
    </div>
  );

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        setUsersError(error.message);
        console.log(error);
      } else {
        setUsers(data);
      }
    } catch (e) {
      setUsersError("Failed to fetch users");
      console.log(e);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const heroArtist = posts.filter(
    (artist) => artist?.address === "0xb3f7f286aff07324036a7d6792644590c0f5ded6"
  );

  const platformStats: PlatformStat[] = [
    { icon: Users, label: "Active Writers", value: "12,500+" },
    { icon: PenTool, label: "Stories Published", value: "45,000+" },
    { icon: Coins, label: "Total Earnings", value: "$2.3M+" },
    { icon: Globe, label: "Global Readers", value: "250K+" },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Where Stories Create
                <span className={styles.gradientText}> Value</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Join the decentralized publishing revolution. Write, share, and
                monetize your content while building a community of supporters
                who believe in your work.
              </p>
              <div className={styles.heroActions}>
                <Link to="/create" className={`${styles.primaryButton} glow`}>
                  <PenTool size={20} />
                  <span>Start Writing</span>
                </Link>
                <Link to="/explore" className={styles.secondaryButton}>
                  <span>Explore Stories</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className={styles.platformStats}>
                {platformStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={styles.statItem}>
                      <Icon size={16} />
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.floatingCard}>
                {isLoading ? (
                  <HeroVisualSkeleton />
                ) : (
                  <>
                    <div className={styles.cardHeader}>
                      <UserAvatar
                        src={
                          heroArtist?.[0]?.creatorProfile?.avatar?.previewImage
                            ?.medium
                        }
                        size="sm"
                      />
                      <div className={styles.cardMeta}>
                        <span>Opeyemi Olalekan</span>
                        <span>10 hours ago</span>
                      </div>
                    </div>
                    <h3>{heroArtist?.[0]?.name}</h3>
                    <div className={styles.cardStats}>
                      <div className={styles.coinPrice}>
                        <Coins size={14} />
                        <span>&{Number(heroArtist?.[0]?.marketCap)}</span>
                        <span
                          className={
                            heroArtist?.[0]?.marketCapDelta24h >= 0
                              ? styles.priceUp
                              : styles.priceDown
                          }
                        >
                          <Triangle size={12} />$
                          {parseFloat(
                            heroArtist?.[0]?.marketCapDelta24h
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Stories</h2>
            <p className={styles.sectionSubtitle}>
              Handpicked stories from our community's most talented creators
            </p>
          </div>
          {isLoading ? (
            <LoadingSpinner text="Loading featured stories..." />
          ) : (
            <FeaturedCarousel posts={posts.slice(0, 2)} />
          )}
        </div>
      </section>

      {/* Trending Posts */}
      <section className={styles.trending}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.trendingHeader}>
              <TrendingUp size={24} />
              <h2 className={styles.sectionTitle}>Trending Now</h2>
            </div>
            <Link to="/explore" className={styles.sectionLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.trendingGrid}>
            {isLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : (
              posts
                .slice(0, 3)
                .map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section className={styles.creators}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.creatorsHeader}>
              <Star size={24} />
              <h2 className={styles.sectionTitle}>Top Creators</h2>
            </div>
            <p className={styles.sectionSubtitle}>
              Meet the writers who are shaping the future of decentralized
              content
            </p>
          </div>
          <div className={styles.creatorsGrid}>
            {usersLoading ? (
              <>
                <CreatorSkeleton />
                <CreatorSkeleton />
                <CreatorSkeleton />
              </>
            ) : usersError ? (
              <div className="text-red-500 text-center py-8">
                Error loading creators: {usersError}
              </div>
            ) : (
              users?.reverse().map((creator: User, index: number) => (
                <div key={creator.id} className={`${styles.creatorCard} glass`}>
                  <div className={styles.creatorRank}>#{index + 1}</div>
                  <UserAvatar
                    src={creator.profile_image}
                    alt={creator.full_name}
                    size="lg"
                    showBorder
                  />
                  <h3 className={styles.creatorName}>{creator.full_name}</h3>
                  <div className={styles.creatorStats}>
                    <div className={styles.creatorStat}>
                      <span className={styles.creatorStatValue}>
                        {creator.followers_count?.toLocaleString() || 0}
                      </span>
                      <span className={styles.creatorStatLabel}>Followers</span>
                    </div>
                    <div className={styles.creatorStat}>
                      <span className={styles.creatorStatValue}>
                        ${creator.total_earnings?.toLocaleString() || 0}
                      </span>
                      <span className={styles.creatorStatLabel}>Earned</span>
                    </div>
                    <div className={styles.creatorStat}>
                      <span className={styles.creatorStatValue}>
                        {creator.posts_count || 0}
                      </span>
                      <span className={styles.creatorStatLabel}>Stories</span>
                    </div>
                  </div>
                  <button className={styles.followButton}>Follow</button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Choose CoinScribe?</h2>
            <p className={styles.sectionSubtitle}>
              Built for creators who believe in the power of decentralized
              publishing
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.featureTitle}>Censorship Resistant</h3>
              <p className={styles.featureDescription}>
                Your content lives on the blockchain, protected from censorship
                and takedowns.
              </p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Coins size={32} />
              </div>
              <h3 className={styles.featureTitle}>Creator Economy</h3>
              <p className={styles.featureDescription}>
                Monetize your content with social tokens and direct reader
                support.
              </p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Users size={32} />
              </div>
              <h3 className={styles.featureTitle}>Community Driven</h3>
              <p className={styles.featureDescription}>
                Build lasting relationships with readers who truly value your
                work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
