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

interface PlatformStat {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}

const Home: React.FC = () => {
  const { isLoading, error, posts } = usePosts();
  const [users, setUsers] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.log(error);
      }
      console.log(data);
      setUsers(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const topCreators: Creator[] = [
    {
      name: "Alex Chen",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      followers: 12500,
      totalEarnings: 45600,
      postsCount: 24,
    },
    {
      name: "Sarah Martinez",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      followers: 9800,
      totalEarnings: 34200,
      postsCount: 18,
    },
    {
      name: "Michael Kim",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      followers: 8900,
      totalEarnings: 28900,
      postsCount: 15,
    },
  ];

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
                <div className={styles.cardHeader}>
                  <UserAvatar
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                    size="sm"
                  />
                  <div className={styles.cardMeta}>
                    <span>Alex Chen</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <h3>The Future of Web3 Publishing</h3>
                <div className={styles.cardStats}>
                  <div className={styles.coinPrice}>
                    <Coins size={14} />
                    <span>$45.67</span>
                    <span className={styles.priceUp}>+12.5%</span>
                  </div>
                </div>
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
          <FeaturedCarousel posts={posts.slice(0, 2)} />
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
            {posts.slice(0.3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
            {users &&
              users.reverse().map((creator: any, index: number) => (
                <div key={index} className={`${styles.creatorCard} glass`}>
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
                        {creator.followers_count.toLocaleString()}
                      </span>
                      <span className={styles.creatorStatLabel}>Followers</span>
                    </div>
                    <div className={styles.creatorStat}>
                      <span className={styles.creatorStatValue}>
                        ${creator.total_earnings.toLocaleString()}
                      </span>
                      <span className={styles.creatorStatLabel}>Earned</span>
                    </div>
                    <div className={styles.creatorStat}>
                      <span className={styles.creatorStatValue}>
                        {creator.posts_count}
                      </span>
                      <span className={styles.creatorStatLabel}>Stories</span>
                    </div>
                  </div>
                  <button className={styles.followButton}>Follow</button>
                </div>
              ))}
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
