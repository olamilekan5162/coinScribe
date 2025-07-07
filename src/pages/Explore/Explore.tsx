import React, { useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Tag,
  SlidersHorizontal,
  Loader2,
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

  // Loading skeleton components
  const PostSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 mb-4 rounded"></div>
      <div className="bg-gray-300 h-32 w-full rounded"></div>
    </div>
  );

  const FilterSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="bg-gray-300 h-4 w-1/4 mb-4 rounded"></div>
      <div className="space-y-2">
        <div className="bg-gray-300 h-8 w-full rounded"></div>
        <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
        <div className="bg-gray-300 h-8 w-1/2 rounded"></div>
      </div>
    </div>
  );

  const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="animate-spin mr-2" size={24} />
      <span>{text}</span>
    </div>
  );

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
    // { id: "popular", label: "Most Popular", icon: Star },
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
    "Zora",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.data.creator.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.data.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.data.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" ||
      post.data.tags.some((tag) =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return (b.uniqueHolders || 0) - (a.uniqueHolders || 0);
      case "recent":
        return (
          new Date(b.data.created).getTime() -
          new Date(a.data.created).getTime()
        );
      // case "popular":
      //   return b.stats.likes - a.stats.likes;
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
            {isLoading ? (
              <>
                <FilterSkeleton />
                <FilterSkeleton />
                <FilterSkeleton />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {isLoading ? (
            <LoadingSpinner text="Loading stories..." />
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error loading stories: {error}
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                  {sortedPosts.length}{" "}
                  {sortedPosts.length === 1 ? "Story" : "Stories"}
                  {searchQuery && (
                    <span className={styles.searchQuery}>
                      {" "}
                      for "{searchQuery}"
                    </span>
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
              {sortedPosts.length > 0 ? (
                <div className={styles.postsGrid}>
                  {sortedPosts.map((post) => (
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
                    Try adjusting your search terms or filters to find what
                    you're looking for.
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

              {/* Load More */}
              {sortedPosts.length > 0 && (
                <div className={styles.loadMore}>
                  <button className={`${styles.loadMoreButton} glass`}>
                    Load More Stories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
