import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, TrendingUp, Coins } from 'lucide-react';
import UserAvatar from '../UserAvatar/UserAvatar';
import styles from './PostCard.module.css';

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
  tags?: string[];
  stats: Stats;
  coinData?: CoinData;
}

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured';
  showStats?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  variant = 'default',
  showStats = true 
}) => {
  const {
    id,
    title,
    excerpt,
    author,
    publishedAt,
    readTime,
    image,
    tags,
    stats,
    coinData
  } = post;

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article className={`${styles.card} ${styles[variant]} glass`}>
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          <div className={styles.imageOverlay}>
            {coinData && (
              <div className={styles.coinPrice}>
                <Coins size={16} />
                <span>${coinData.price}</span>
                <span className={coinData.change >= 0 ? styles.priceUp : styles.priceDown}>
                  {coinData.change >= 0 ? '+' : ''}{coinData.change}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <UserAvatar 
              src={author.avatar} 
              alt={author.name}
              size="sm"
            />
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{author.name}</span>
              <div className={styles.postMeta}>
                <span>{formatDate(publishedAt)}</span>
                <span>•</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          {coinData?.trending && (
            <div className={styles.trendingBadge}>
              <TrendingUp size={12} />
              <span>Trending</span>
            </div>
          )}
        </div>

        <Link to={`/post/${id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
        </Link>

        <p className={styles.excerpt}>{excerpt}</p>

        {tags && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {showStats && stats && (
          <div className={styles.stats}>
            <div className={styles.engagement}>
              <button className={styles.statButton}>
                <Heart size={16} />
                <span>{stats.likes}</span>
              </button>
              <button className={styles.statButton}>
                <MessageCircle size={16} />
                <span>{stats.comments}</span>
              </button>
              <button className={styles.statButton}>
                <Share2 size={16} />
                <span>{stats.shares}</span>
              </button>
            </div>
            {coinData && (
              <div className={styles.coinStats}>
                <span className={styles.holders}>
                  {coinData.holders} holders
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;