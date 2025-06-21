import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Star, 
  ArrowRight,
  Coins,
  PenTool,
  Globe,
  Shield
} from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import FeaturedCarousel from '../../components/FeaturedCarousel/FeaturedCarousel';
import PostCard from '../../components/PostCard/PostCard';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import styles from './Home.module.css';

interface Author {
  name: string;
  avatar: string;
}

interface Stats {
  likes: number;
  comments: number;
  shares: number;
}

interface CoinData {
  price: number;
  change: number;
  holders: number;
  trending?: boolean;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  image?: string;
  tags: string[];
  stats: Stats;
  coinData?: CoinData;
}

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
  const { posts } = usePosts();

  // Convert database posts to component format
  const convertPost = (dbPost: any): Post => ({
    id: parseInt(dbPost.id),
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    author: {
      name: dbPost.author.full_name,
      avatar: dbPost.author.profile_image || ''
    },
    publishedAt: dbPost.created_at,
    readTime: dbPost.read_time,
    image: dbPost.image_url || undefined,
    tags: dbPost.tags,
    stats: {
      likes: dbPost.likes_count,
      comments: dbPost.comments_count,
      shares: dbPost.shares_count
    },
    coinData: {
      price: dbPost.coin_price,
      change: dbPost.price_change,
      holders: dbPost.holders_count,
      trending: dbPost.price_change > 10
    }
  });

  // Mock data for featured posts (fallback if no posts from DB)
  const mockFeaturedPosts: Post[] = [
    {
      id: 1,
      title: "The Future of Decentralized Content: Why Web3 Publishing Matters",
      excerpt: "Exploring how blockchain technology is revolutionizing the way we create, share, and monetize content. From censorship resistance to creator economics, discover the paradigm shift happening right now.",
      author: {
        name: "Alex Chen",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
      },
      publishedAt: "2025-01-20",
      readTime: 12,
      image: "https://images.pexels.com/photos/7433829/pexels-photo-7433829.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Web3", "Publishing", "Blockchain"],
      stats: { likes: 2340, comments: 89, shares: 156 },
      coinData: {
        price: 45.67,
        change: 12.5,
        holders: 1250,
        trending: true
      }
    },
    {
      id: 2,
      title: "Building Community Through Tokenized Stories",
      excerpt: "How creators are using social tokens to build deeper connections with their audience and create sustainable revenue streams.",
      author: {
        name: "Sarah Martinez",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
      },
      publishedAt: "2025-01-19",
      readTime: 8,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: ["Community", "Tokens", "Creator Economy"],
      stats: { likes: 1890, comments: 67, shares: 123 },
      coinData: {
        price: 23.45,
        change: 8.2,
        holders: 890
      }
    }
  ];

  const trendingPosts: Post[] = [
    {
      id: 3,
      title: "DeFi Yield Farming: A Beginner's Complete Guide",
      excerpt: "Everything you need to know about yield farming, from the basics to advanced strategies for maximizing returns.",
      author: {
        name: "Michael Kim",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
      },
      publishedAt: "2025-01-18",
      readTime: 15,
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["DeFi", "Yield Farming", "Guide"],
      stats: { likes: 3200, comments: 124, shares: 289 },
      coinData: {
        price: 78.90,
        change: 15.8,
        holders: 1890
      }
    },
    {
      id: 4,
      title: "NFT Art: Where Creativity Meets Blockchain",
      excerpt: "Exploring the intersection of digital art and blockchain technology, and how NFTs are changing the art world forever.",
      author: {
        name: "Emma Thompson",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
      },
      publishedAt: "2025-01-17",
      readTime: 10,
      image: "https://images.pexels.com/photos/7567456/pexels-photo-7567456.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["NFT", "Art", "Digital Creativity"],
      stats: { likes: 2750, comments: 98, shares: 201 },
      coinData: {
        price: 34.20,
        change: -2.1,
        holders: 1120
      }
    },
    {
      id: 5,
      title: "Smart Contracts Explained: Code as Law",
      excerpt: "Understanding how smart contracts work, their benefits, limitations, and real-world applications across industries.",
      author: {
        name: "David Rodriguez",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
      },
      publishedAt: "2025-01-16",
      readTime: 11,
      image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Smart Contracts", "Ethereum", "Development"],
      stats: { likes: 1980, comments: 76, shares: 134 },
      coinData: {
        price: 56.78,
        change: 7.4,
        holders: 756
      }
    }
  ];

  const topCreators: Creator[] = [
    {
      name: "Alex Chen",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      followers: 12500,
      totalEarnings: 45600,
      postsCount: 24
    },
    {
      name: "Sarah Martinez", 
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      followers: 9800,
      totalEarnings: 34200,
      postsCount: 18
    },
    {
      name: "Michael Kim",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150", 
      followers: 8900,
      totalEarnings: 28900,
      postsCount: 15
    }
  ];

  const platformStats: PlatformStat[] = [
    { icon: Users, label: "Active Writers", value: "12,500+" },
    { icon: PenTool, label: "Stories Published", value: "45,000+" },
    { icon: Coins, label: "Total Earnings", value: "$2.3M+" },
    { icon: Globe, label: "Global Readers", value: "250K+" }
  ];

  // Use real posts if available, otherwise use mock data
  const featuredPosts = posts.length > 0 
    ? posts.slice(0, 3).map(convertPost)
    : mockFeaturedPosts;

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
                Join the decentralized publishing revolution. Write, share, and monetize your content 
                while building a community of supporters who believe in your work.
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
          <FeaturedCarousel posts={featuredPosts} />
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
            {trendingPosts.map((post) => (
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
              Meet the writers who are shaping the future of decentralized content
            </p>
          </div>
          <div className={styles.creatorsGrid}>
            {topCreators.map((creator, index) => (
              <div key={index} className={`${styles.creatorCard} glass`}>
                <div className={styles.creatorRank}>#{index + 1}</div>
                <UserAvatar 
                  src={creator.avatar} 
                  alt={creator.name}
                  size="lg"
                  showBorder
                />
                <h3 className={styles.creatorName}>{creator.name}</h3>
                <div className={styles.creatorStats}>
                  <div className={styles.creatorStat}>
                    <span className={styles.creatorStatValue}>
                      {creator.followers.toLocaleString()}
                    </span>
                    <span className={styles.creatorStatLabel}>Followers</span>
                  </div>
                  <div className={styles.creatorStat}>
                    <span className={styles.creatorStatValue}>
                      ${creator.totalEarnings.toLocaleString()}
                    </span>
                    <span className={styles.creatorStatLabel}>Earned</span>
                  </div>
                  <div className={styles.creatorStat}>
                    <span className={styles.creatorStatValue}>{creator.postsCount}</span>
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
              Built for creators who believe in the power of decentralized publishing
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.featureTitle}>Censorship Resistant</h3>
              <p className={styles.featureDescription}>
                Your content lives on the blockchain, protected from censorship and takedowns.
              </p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Coins size={32} />
              </div>
              <h3 className={styles.featureTitle}>Creator Economy</h3>
              <p className={styles.featureDescription}>
                Monetize your content with social tokens and direct reader support.
              </p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>
                <Users size={32} />
              </div>
              <h3 className={styles.featureTitle}>Community Driven</h3>
              <p className={styles.featureDescription}>
                Build lasting relationships with readers who truly value your work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;