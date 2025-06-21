import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  DollarSign,
  Coins,
  Users,
  Edit3,
  MoreHorizontal,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';
import PostCard from '../../components/PostCard/PostCard';
import StatsPanel from '../../components/StatsPanel/StatsPanel';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import styles from './Dashboard.module.css';

interface User {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  totalEarnings: number;
  totalPosts: number;
  avgCoinPrice: number;
  totalHolders: number;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: User;
  publishedAt: string;
  readTime: number;
  image?: string;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  coinData?: {
    price: number;
    change: number;
    holders: number;
    earnings: number;
  };
}

interface DraftPost {
  id: number;
  title: string;
  excerpt: string;
  author: User;
  lastEdited: string;
  tags: string[];
  isDraft: boolean;
}

interface Tab {
  id: string;
  label: string;
  count: number | null;
}

interface FilterOption {
  id: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('published');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Mock user data
  const userData: User = {
    name: "Alex Chen",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    bio: "Web3 researcher and content creator passionate about decentralized technologies.",
    followers: 12500,
    following: 340,
    totalEarnings: 45600,
    totalPosts: 24,
    avgCoinPrice: 52.34,
    totalHolders: 3420
  };

  // Mock posts data
  const publishedPosts: Post[] = [
    {
      id: 1,
      title: "The Future of Decentralized Content: Why Web3 Publishing Matters",
      excerpt: "Exploring how blockchain technology is revolutionizing the way we create, share, and monetize content.",
      author: userData,
      publishedAt: "2025-01-20",
      readTime: 12,
      image: "https://images.pexels.com/photos/7433829/pexels-photo-7433829.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Web3", "Publishing", "Blockchain"],
      stats: { 
        views: 15420,
        likes: 2340, 
        comments: 89, 
        shares: 156 
      },
      coinData: {
        price: 45.67,
        change: 12.5,
        holders: 1250,
        earnings: 3420
      }
    },
    {
      id: 2,
      title: "Building Community Through Tokenized Stories",
      excerpt: "How creators are using social tokens to build deeper connections with their audience.",
      author: userData,
      publishedAt: "2025-01-19",
      readTime: 8,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Community", "Tokens"],
      stats: { 
        views: 8900,
        likes: 1890, 
        comments: 67, 
        shares: 123 
      },
      coinData: {
        price: 23.45,
        change: 8.2,
        holders: 890,
        earnings: 1890
      }
    },
    {
      id: 3,
      title: "Smart Contracts for Content Creators",
      excerpt: "A practical guide to using smart contracts for automated royalties and rights management.",
      author: userData,
      publishedAt: "2025-01-18",
      readTime: 10,
      image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Smart Contracts", "Development"],
      stats: { 
        views: 6700,
        likes: 1560, 
        comments: 45, 
        shares: 89 
      },
      coinData: {
        price: 34.20,
        change: -2.1,
        holders: 670,
        earnings: 1120
      }
    }
  ];

  const draftPosts: DraftPost[] = [
    {
      id: 4,
      title: "The Economics of Creator Tokens",
      excerpt: "Understanding the tokenomics behind successful creator economies...",
      author: userData,
      lastEdited: "2025-01-21",
      tags: ["Economics", "Tokens"],
      isDraft: true
    },
    {
      id: 5,
      title: "NFTs Beyond Art: Utility and Function",
      excerpt: "Exploring the practical applications of NFTs in various industries...",
      author: userData,
      lastEdited: "2025-01-20",
      tags: ["NFT", "Utility"],
      isDraft: true
    }
  ];

  const overallStats = {
    totalEarnings: userData.totalEarnings,
    coinPrice: userData.avgCoinPrice,
    holders: userData.totalHolders,
    views: publishedPosts.reduce((sum, post) => sum + post.stats.views, 0)
  };

  const tabs: Tab[] = [
    { id: 'published', label: 'Published', count: publishedPosts.length },
    { id: 'drafts', label: 'Drafts', count: draftPosts.length },
    { id: 'analytics', label: 'Analytics', count: null }
  ];

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Posts' },
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' },
    { id: 'top-earning', label: 'Top Earning' }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.userInfo}>
              <UserAvatar 
                src={userData.avatar}
                alt={userData.name}
                size="xl"
                showBorder
              />
              <div className={styles.userMeta}>
                <h1 className={styles.userName}>{userData.name}</h1>
                <p className={styles.userBio}>{userData.bio}</p>
                <div className={styles.userStats}>
                  <div className={styles.userStat}>
                    <span className={styles.statValue}>{formatNumber(userData.followers)}</span>
                    <span className={styles.statLabel}>Followers</span>
                  </div>
                  <div className={styles.userStat}>
                    <span className={styles.statValue}>{userData.totalPosts}</span>
                    <span className={styles.statLabel}>Posts</span>
                  </div>
                  <div className={styles.userStat}>
                    <span className={styles.statValue}>{formatCurrency(userData.totalEarnings)}</span>
                    <span className={styles.statLabel}>Earned</span>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/create" className={`${styles.createButton} glow`}>
              <Plus size={20} />
              <span>New Post</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsOverview}>
          <StatsPanel 
            variant="dashboard"
            data={overallStats}
            className={styles.overviewPanel}
          />
          
          <div className={styles.quickStats}>
            <div className={`${styles.quickStat} glass`}>
              <div className={styles.quickStatIcon}>
                <Eye size={24} />
              </div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{formatNumber(overallStats.views)}</span>
                <span className={styles.quickStatLabel}>Total Views</span>
              </div>
            </div>
            
            <div className={`${styles.quickStat} glass`}>
              <div className={styles.quickStatIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>+24%</span>
                <span className={styles.quickStatLabel}>Growth Rate</span>
              </div>
            </div>
            
            <div className={`${styles.quickStat} glass`}>
              <div className={styles.quickStatIcon}>
                <Users size={24} />
              </div>
              <div className={styles.quickStatInfo}>
                <span className={styles.quickStatValue}>{formatNumber(userData.totalHolders)}</span>
                <span className={styles.quickStatLabel}>Token Holders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className={styles.contentSection}>
          {/* Tabs and Filters */}
          <div className={styles.contentHeader}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={styles.tabCount}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
            
            {activeTab !== 'analytics' && (
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <Filter size={16} />
                  <select 
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {filterOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={styles.contentArea}>
            {activeTab === 'published' && (
              <div className={styles.postsGrid}>
                {publishedPosts.map(post => (
                  <div key={post.id} className={styles.postItem}>
                    <PostCard post={post} />
                    <div className={styles.postActions}>
                      <Link to={`/post/${post.id}`} className={styles.postAction}>
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
                      <button className={styles.postAction}>
                        <BarChart3 size={16} />
                        <span>Analytics</span>
                      </button>
                      <button className={styles.postAction}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className={styles.draftsGrid}>
                {draftPosts.map(draft => (
                  <div key={draft.id} className={`${styles.draftCard} glass`}>
                    <div className={styles.draftHeader}>
                      <h3 className={styles.draftTitle}>{draft.title}</h3>
                      <button className={styles.draftMenu}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <p className={styles.draftExcerpt}>{draft.excerpt}</p>
                    <div className={styles.draftMeta}>
                      <div className={styles.draftTags}>
                        {draft.tags.map((tag, index) => (
                          <span key={index} className={styles.draftTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={styles.draftDate}>
                        <Calendar size={14} />
                        <span>Last edited {draft.lastEdited}</span>
                      </div>
                    </div>
                    <div className={styles.draftActions}>
                      <Link to={`/create?draft=${draft.id}`} className={styles.editButton}>
                        <Edit3 size={16} />
                        <span>Continue Writing</span>
                      </Link>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </div>
                ))}
                
                {draftPosts.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <Edit3 size={48} />
                    </div>
                    <h3 className={styles.emptyTitle}>No drafts yet</h3>
                    <p className={styles.emptyText}>
                      Start writing your next story and save it as a draft.
                    </p>
                    <Link to="/create" className={styles.emptyAction}>
                      Start Writing
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={styles.analytics}>
                <div className={`${styles.analyticsCard} glass`}>
                  <h3 className={styles.analyticsTitle}>Performance Overview</h3>
                  <div className={styles.analyticsGrid}>
                    <div className={styles.analyticsStat}>
                      <div className={styles.analyticsStatIcon}>
                        <Eye size={20} />
                      </div>
                      <div className={styles.analyticsStatInfo}>
                        <span className={styles.analyticsStatValue}>
                          {formatNumber(overallStats.views)}
                        </span>
                        <span className={styles.analyticsStatLabel}>Total Views</span>
                        <div className={styles.analyticsStatTrend}>
                          <TrendingUp size={12} />
                          <span>+15.2% from last month</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.analyticsStat}>
                      <div className={styles.analyticsStatIcon}>
                        <Heart size={20} />
                      </div>
                      <div className={styles.analyticsStatInfo}>
                        <span className={styles.analyticsStatValue}>
                          {formatNumber(publishedPosts.reduce((sum, post) => sum + post.stats.likes, 0))}
                        </span>
                        <span className={styles.analyticsStatLabel}>Total Likes</span>
                        <div className={styles.analyticsStatTrend}>
                          <TrendingUp size={12} />
                          <span>+8.7% from last month</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.analyticsStat}>
                      <div className={styles.analyticsStatIcon}>
                        <DollarSign size={20} />
                      </div>
                      <div className={styles.analyticsStatInfo}>
                        <span className={styles.analyticsStatValue}>
                          {formatCurrency(userData.totalEarnings)}
                        </span>
                        <span className={styles.analyticsStatLabel}>Total Earnings</span>
                        <div className={styles.analyticsStatTrend}>
                          <TrendingUp size={12} />
                          <span>+32.1% from last month</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.analyticsStat}>
                      <div className={styles.analyticsStatIcon}>
                        <Coins size={20} />
                      </div>
                      <div className={styles.analyticsStatInfo}>
                        <span className={styles.analyticsStatValue}>
                          {formatCurrency(userData.avgCoinPrice)}
                        </span>
                        <span className={styles.analyticsStatLabel}>Avg Token Price</span>
                        <div className={styles.analyticsStatTrend}>
                          <TrendingUp size={12} />
                          <span>+12.5% from last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.analyticsPlaceholder} glass`}>
                  <BarChart3 size={48} />
                  <h3>Detailed Analytics Coming Soon</h3>
                  <p>Advanced analytics and insights will be available once the backend is connected.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;