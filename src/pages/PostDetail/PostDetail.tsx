import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Calendar,
  Clock,
  TrendingUp,
  Coins,
  Users,
} from "lucide-react";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import StatsPanel from "../../components/StatsPanel/StatsPanel";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostDetail.module.css";
import { getCoin } from "@zoralabs/coins-sdk";
import { baseSepolia } from "viem/chains";

interface Author {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  coinPrice: number;
  priceChange: number;
  holders: number;
  totalEarnings: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  image?: string;
  tags: string[];
  stats: PostStats;
}

interface RelatedPost {
  id: number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  image?: string;
  tags: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface PostData {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  content: {
    mime: string;
    uri: string;
  };
  created: string;
  creator: {
    id: string;
    bio: string;
    wallet_address: string;
    full_name: string;
    email: string;
    profile_image: string;
  };
  properties: {
    category: string;
  };
  storyContent: string;
  tags: string[];
}

const PostDetail: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(2340);
  const [postData, setPostData] = useState<PostData | null>(null);

  // const pinata = new PinataSDK({
  //   pinataJwt: import.meta.env.VITE_PINATA_JWT,
  //   pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
  // });

  const fetchSingleCoin = async () => {
    const response = await getCoin({
      address: "0xDECBAcd31b57452fC2CfAE8f4aEbB8D8d1757357",
      chain: baseSepolia.id,
    });
    return response.data?.zora20Token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const coin = await fetchSingleCoin();
      try {
        const response = await fetch(`${coin?.tokenUri}`);
        if (!response) {
          throw new Error("unable to fetch");
        }
        const data: PostData = await response.json();
        console.log(data);
        setPostData(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  // Mock post data - in a real app, this would come from an API/blockchain
  const post: Post = {
    id: 1,
    title: "The Future of Decentralized Content: Why Web3 Publishing Matters",
    content: `
      <p>The landscape of digital publishing is undergoing a revolutionary transformation. As we stand at the crossroads of technological innovation and creative expression, decentralized publishing platforms are emerging as the next evolution of how we create, share, and monetize content.</p>
      
      <h2>The Problem with Traditional Publishing</h2>
      <p>Traditional publishing platforms have long held the keys to content distribution, wielding unprecedented power over creators and their audiences. From arbitrary content moderation to unfair revenue sharing, creators have been at the mercy of centralized authorities who can change the rules overnight.</p>
      
      <blockquote>
        "The future belongs to platforms that empower creators, not exploit them." - Decentralized Creator Manifesto
      </blockquote>
      
      <p>Consider the countless stories of creators who built massive followings on traditional platforms, only to lose everything due to algorithm changes, account suspensions, or platform shutdowns. This isn't just about individual creators—it's about the preservation of human knowledge and creative expression.</p>
      
      <h2>Enter Blockchain-Based Publishing</h2>
      <p>Blockchain technology offers a compelling alternative: true ownership of content, transparent monetization, and censorship resistance. When you publish on a decentralized platform, your content lives on the blockchain forever, protected from the whims of corporate decision-makers.</p>
      
      <p>But it's not just about storage. Smart contracts enable new economic models that were previously impossible:</p>
      
      <ul>
        <li><strong>Direct creator-to-reader payments:</strong> No middlemen taking substantial cuts</li>
        <li><strong>Community ownership:</strong> Readers can become stakeholders in the content they love</li>
        <li><strong>Programmable royalties:</strong> Creators earn from every interaction with their work</li>
        <li><strong>Transparent metrics:</strong> All engagement data is publicly verifiable</li>
      </ul>
      
      <h2>The Social Token Revolution</h2>
      <p>Perhaps the most exciting development is the emergence of social tokens—cryptocurrencies tied to individual creators or communities. These tokens create a new paradigm where success is shared between creators and their most dedicated supporters.</p>
      
      <p>Imagine buying tokens from your favorite writer when they're just starting out, then watching those tokens appreciate as their work gains recognition. It's like having equity in a creator's success, creating aligned incentives that traditional platforms could never offer.</p>
      
      <h2>Challenges and Solutions</h2>
      <p>Of course, decentralized publishing isn't without its challenges. User experience, scalability, and mainstream adoption remain significant hurdles. However, innovative solutions are emerging:</p>
      
      <p><strong>Layer 2 Solutions:</strong> Technologies like Polygon and Optimism are making blockchain interactions faster and cheaper, removing barriers to entry for average users.</p>
      
      <p><strong>Improved UX:</strong> New platforms are abstracting away the complexity of blockchain interactions, making Web3 publishing as simple as traditional platforms.</p>
      
      <p><strong>Cross-Platform Integration:</strong> Bridges between Web2 and Web3 are enabling creators to maintain their existing audiences while building on decentralized infrastructure.</p>
      
      <h2>The Future is Decentralized</h2>
      <p>We're witnessing the early stages of a fundamental shift in how content is created, distributed, and monetized. The creators who embrace these new tools today will be the ones who shape the future of digital publishing.</p>
      
      <p>The question isn't whether decentralized publishing will succeed—it's whether you'll be part of building that future or watching from the sidelines.</p>
      
      <p>What are your thoughts on the future of content creation? How do you see blockchain technology changing the relationship between creators and their audiences?</p>
    `,
    author: {
      name: "Alex Chen",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      bio: "Web3 researcher and content creator passionate about decentralized technologies and their impact on creative industries.",
      followers: 12500,
      following: 340,
      posts: 24,
    },
    publishedAt: "2025-01-20T10:00:00Z",
    readTime: 12,
    image:
      "https://images.pexels.com/photos/7433829/pexels-photo-7433829.jpeg?auto=compress&cs=tinysrgb&w=1200",
    tags: [
      "Web3",
      "Publishing",
      "Blockchain",
      "Creator Economy",
      "Decentralization",
    ],
    stats: {
      views: 15420,
      likes: 2340,
      comments: 89,
      shares: 156,
      coinPrice: 45.67,
      priceChange: 12.5,
      holders: 1250,
      totalEarnings: 3420,
    },
  };

  const relatedPosts: RelatedPost[] = [
    {
      id: 2,
      title: "Building Community Through Tokenized Stories",
      excerpt:
        "How creators are using social tokens to build deeper connections with their audience.",
      author: {
        name: "Sarah Martinez",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-19",
      readTime: 8,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Community", "Tokens"],
      stats: { likes: 1890, comments: 67, shares: 123 },
    },
    {
      id: 3,
      title: "Smart Contracts for Content Creators",
      excerpt:
        "A practical guide to using smart contracts for automated royalties and rights management.",
      author: {
        name: "Michael Kim",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      },
      publishedAt: "2025-01-18",
      readTime: 10,
      image:
        "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600",
      tags: ["Smart Contracts", "Development"],
      stats: { likes: 1560, comments: 45, shares: 89 },
    },
  ];

  const handleLike = (): void => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
      const event = new CustomEvent("showToast", {
        detail: { message: "Link copied to clipboard!", type: "success" },
      });
      window.dispatchEvent(event);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.postDetail}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {postData?.image && (
        <div className={styles.heroImage}>
          <img src={postData?.image} alt={postData?.name} />
          <div className={styles.heroOverlay}>
            <div className="container">
              <div className={styles.heroContent}>
                <div className={styles.postMeta}>
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{formatDate(postData?.created)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>
                      {Math.floor(postData?.storyContent.length / 200)} min read
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <TrendingUp size={16} />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className={styles.contentLayout}>
          {/* Main Content */}
          <main className={styles.mainContent}>
            <article className={`${styles.article} glass`}>
              {/* Article Header */}
              <header className={styles.articleHeader}>
                <h1 className={styles.title}>{postData?.name}</h1>

                <div className={styles.authorSection}>
                  <Link
                    to={`/profile/${post.author.name}`}
                    className={styles.authorInfo}
                  >
                    <UserAvatar
                      src={postData?.creator?.profile_image}
                      alt={postData?.creator.full_name}
                      size="lg"
                      showBorder
                    />
                    <div className={styles.authorMeta}>
                      <h3 className={styles.authorName}>
                        {postData?.creator.full_name}
                      </h3>
                      <p className={styles.authorBio}>
                        {postData?.creator.bio}
                      </p>
                      <div className={styles.authorStats}>
                        <span>
                          {post.author.followers.toLocaleString()} followers
                        </span>
                        <span>•</span>
                        <span>{post.author.posts} posts</span>
                      </div>
                    </div>
                  </Link>
                  <button className={styles.followButton}>Follow</button>
                </div>

                {/* Tags */}
                <div className={styles.tags}>
                  {postData?.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/explore?tag=${tag}`}
                      className={styles.tag}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </header>

              {/* Article Content */}
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: postData?.storyContent }}
              />

              {/* Article Footer */}
              <footer className={styles.articleFooter}>
                <div className={styles.engagement}>
                  <button
                    onClick={handleLike}
                    className={`${styles.engagementButton} ${
                      isLiked ? styles.liked : ""
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    <span>{likeCount.toLocaleString()}</span>
                  </button>
                  <button className={styles.engagementButton}>
                    <MessageCircle size={20} />
                    <span>{post.stats.comments}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className={styles.engagementButton}
                  >
                    <Share2 size={20} />
                    <span>{post.stats.shares}</span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`${styles.engagementButton} ${
                      isBookmarked ? styles.bookmarked : ""
                    }`}
                  >
                    <Bookmark
                      size={20}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <button className={styles.moreButton}>
                  <MoreHorizontal size={20} />
                </button>
              </footer>
            </article>

            {/* Comments Section */}
            <section className={`${styles.comments} glass`}>
              <h2 className={styles.commentsTitle}>
                Discussion ({post.stats.comments})
              </h2>
              <div className={styles.commentForm}>
                <UserAvatar
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
                  size="md"
                />
                <div className={styles.commentInput}>
                  <textarea
                    placeholder="Share your thoughts..."
                    className={styles.commentTextarea}
                  />
                  <div className={styles.commentActions}>
                    <button className={styles.commentButton}>Comment</button>
                  </div>
                </div>
              </div>
              <div className={styles.commentsPlaceholder}>
                <p>
                  Comments will be displayed here once the backend is connected.
                </p>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Stats Panel */}
            <StatsPanel
              variant="post"
              data={{
                views: post.stats.views,
                likes: post.stats.likes,
                comments: post.stats.comments,
                shares: post.stats.shares,
                coinPrice: post.stats.coinPrice,
                priceChange: post.stats.priceChange,
                holders: post.stats.holders,
                publishedAt: post.publishedAt,
                readTime: post.readTime,
              }}
            />

            {/* Coin Info */}
            <div className={`${styles.coinInfo} glass`}>
              <h3 className={styles.sidebarTitle}>Story Token</h3>
              <div className={styles.coinDetails}>
                <div className={styles.coinPrice}>
                  <Coins size={20} />
                  <div className={styles.priceInfo}>
                    <span className={styles.price}>
                      ${post.stats.coinPrice}
                    </span>
                    <span className={styles.priceChange}>
                      +{post.stats.priceChange}%
                    </span>
                  </div>
                </div>
                <div className={styles.coinStats}>
                  <div className={styles.coinStat}>
                    <Users size={16} />
                    <span>{post.stats.holders} holders</span>
                  </div>
                  <div className={styles.coinStat}>
                    <TrendingUp size={16} />
                    <span>Trending #12</span>
                  </div>
                </div>
                <button className={`${styles.buyButton} glow`}>
                  Buy Tokens
                </button>
              </div>
            </div>

            {/* Author Info */}
            <div className={`${styles.authorCard} glass`}>
              <h3 className={styles.sidebarTitle}>About the Author</h3>
              <div className={styles.authorDetails}>
                <UserAvatar
                  src={post.author.avatar}
                  alt={post.author.name}
                  size="xl"
                />
                <h4 className={styles.authorCardName}>{post.author.name}</h4>
                <p className={styles.authorCardBio}>{post.author.bio}</p>
                <div className={styles.authorCardStats}>
                  <div className={styles.authorCardStat}>
                    <span className={styles.statValue}>
                      {post.author.followers.toLocaleString()}
                    </span>
                    <span className={styles.statLabel}>Followers</span>
                  </div>
                  <div className={styles.authorCardStat}>
                    <span className={styles.statValue}>
                      {post.author.posts}
                    </span>
                    <span className={styles.statLabel}>Posts</span>
                  </div>
                </div>
                <button className={styles.followButtonCard}>Follow</button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <section className={styles.relatedPosts}>
          <h2 className={styles.relatedTitle}>Related Stories</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <PostCard
                key={relatedPost.id}
                post={{
                  ...relatedPost,
                  stats: relatedPost.stats,
                }}
                showStats={false}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
