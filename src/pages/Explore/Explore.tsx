import React, { useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./Explore.module.css";
import { usePosts } from "../../hooks/usePosts";

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

interface Category {
  id: string;
  label: string;
  count: number;
}

interface SortOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("trending");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { isLoading, posts, error } = usePosts();

  // Mock data for posts
  const allPosts: Post[] = [
    {
      id: 1,
      title: "The Future of Decentralized Content: Why Web3 Publishing Matters",
      excerpt:
        "Exploring how blockchain technology is revolutionizing the way we create, share, and monetize content. From censorship resistance to creator economics, discover the paradigm shift happening right now.",
      author: {
        name: "Alex Chen",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-20",
      readTime: 12,
      image:
        "https://images.pexels.com/photos/7433829/pexels-photo-7433829.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Web3", "Publishing", "Blockchain"],
      stats: { likes: 2340, comments: 89, shares: 156 },
      coinData: {
        price: 45.67,
        change: 12.5,
        holders: 1250,
        trending: true,
      },
    },
    {
      id: 2,
      title: "Building Community Through Tokenized Stories",
      excerpt:
        "How creators are using social tokens to build deeper connections with their audience and create sustainable revenue streams.",
      author: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-19",
      readTime: 8,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Community", "Tokens", "Creator Economy"],
      stats: { likes: 1890, comments: 67, shares: 123 },
      coinData: {
        price: 23.45,
        change: 8.2,
        holders: 890,
      },
    },
    {
      id: 3,
      title: "DeFi Yield Farming: A Beginner's Complete Guide",
      excerpt:
        "Everything you need to know about yield farming, from the basics to advanced strategies for maximizing returns.",
      author: {
        name: "Michael Kim",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-18",
      readTime: 15,
      image:
        "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["DeFi", "Yield Farming", "Guide"],
      stats: { likes: 3200, comments: 124, shares: 289 },
      coinData: {
        price: 78.9,
        change: 15.8,
        holders: 1890,
      },
    },
    {
      id: 4,
      title: "NFT Art: Where Creativity Meets Blockchain",
      excerpt:
        "Exploring the intersection of digital art and blockchain technology, and how NFTs are changing the art world forever.",
      author: {
        name: "Emma Thompson",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-17",
      readTime: 10,
      image:
        "https://images.pexels.com/photos/7567456/pexels-photo-7567456.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["NFT", "Art", "Digital Creativity"],
      stats: { likes: 2750, comments: 98, shares: 201 },
      coinData: {
        price: 34.2,
        change: -2.1,
        holders: 1120,
      },
    },
    {
      id: 5,
      title: "Smart Contracts Explained: Code as Law",
      excerpt:
        "Understanding how smart contracts work, their benefits, limitations, and real-world applications across industries.",
      author: {
        name: "David Rodriguez",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-16",
      readTime: 11,
      image:
        "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Smart Contracts", "Ethereum", "Development"],
      stats: { likes: 1980, comments: 76, shares: 134 },
      coinData: {
        price: 56.78,
        change: 7.4,
        holders: 756,
      },
    },
    {
      id: 6,
      title: "The Psychology of Crypto Trading",
      excerpt:
        "Understanding the mental aspects of cryptocurrency trading and how to develop a winning mindset.",
      author: {
        name: "Lisa Wang",
        avatar:
          "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-15",
      readTime: 14,
      image:
        "https://images.pexels.com/photos/7567521/pexels-photo-7567521.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Trading", "Psychology", "Cryptocurrency"],
      stats: { likes: 1650, comments: 92, shares: 178 },
      coinData: {
        price: 41.3,
        change: 9.7,
        holders: 623,
      },
    },
  ];

  const categories: Category[] = [
    { id: "all", label: "All Stories", count: posts.length },
    { id: "web3", label: "Web3", count: 12 },
    { id: "defi", label: "DeFi", count: 8 },
    { id: "nft", label: "NFTs", count: 15 },
    { id: "development", label: "Development", count: 6 },
    { id: "trading", label: "Trading", count: 9 },
    { id: "tutorials", label: "Tutorials", count: 11 },
  ];

  const sortOptions: SortOption[] = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Most Recent", icon: Clock },
    { id: "popular", label: "Most Popular", icon: Star },
  ];

  const popularTags: string[] = [
    "Web3",
    "DeFi",
    "NFT",
    "Smart Contracts",
    "Ethereum",
    "Bitcoin",
    "Trading",
    "Yield Farming",
    "DAO",
    "Metaverse",
  ];

  // Filter and sort posts
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return (b.coinData?.change || 0) - (a.coinData?.change || 0);
      case "recent":
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case "popular":
        return b.stats.likes - a.stats.likes;
      default:
        return 0;
    }
  });

  const handleTagClick = (tag: string): void => {
    setSearchQuery(tag);
  };

  return (
    <div className={styles.explore}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Explore Stories</h1>
            <p className={styles.subtitle}>
              Discover the latest insights from the Web3 community
            </p>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search stories, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${styles.filterToggle} ${
                showFilters ? styles.filterToggleActive : ""
              }`}
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`${styles.filters} ${
            showFilters ? styles.filtersVisible : ""
          }`}
        >
          <div className={`${styles.filtersContent} glass`}>
            {/* Categories */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Categories</h3>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${styles.category} ${
                      selectedCategory === category.id
                        ? styles.categoryActive
                        : ""
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className={styles.categoryCount}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Sort By</h3>
              <div className={styles.sortOptions}>
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`${styles.sortOption} ${
                        sortBy === option.id ? styles.sortOptionActive : ""
                      }`}
                    >
                      <Icon size={16} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popular Tags */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Popular Tags</h3>
              <div className={styles.tags}>
                {popularTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={styles.tag}
                  >
                    <Tag size={12} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {sortedPosts.length}{" "}
              {sortedPosts.length === 1 ? "Story" : "Stories"}
              {searchQuery && (
                <span className={styles.searchQuery}> for "{searchQuery}"</span>
              )}
            </h2>
            <div className={styles.resultsSort}>
              <Filter size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Search size={48} />
              </div>
              <h3 className={styles.emptyTitle}>No stories found</h3>
              <p className={styles.emptyText}>
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className={styles.clearFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {sortedPosts.length > 0 && (
          <div className={styles.loadMore}>
            <button className={`${styles.loadMoreButton} glass`}>
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
