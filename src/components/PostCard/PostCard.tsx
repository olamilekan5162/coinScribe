import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, TrendingUp, Coins } from "lucide-react";
import UserAvatar from "../UserAvatar/UserAvatar";
import styles from "./PostCard.module.css";

// interface Author {
//   name: string;
//   avatar: string;
// }

// interface Stats {
//   likes: number;
//   comments: number;
//   shares: number;
// }

// interface CoinData {
//   price: number;
//   change: number;
//   holders: number;
//   trending?: boolean;
// }

// interface Post {
//   id: number;
//   title: string;
//   excerpt: string;
//   author: Author;
//   publishedAt: string;
//   readTime: number;
//   image?: string;
//   tags?: string[];
//   stats: Stats;
//   coinData?: CoinData;
// }

interface PostCardProps {
  post: any;
  variant?: "default" | "featured";
  showStats?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  variant = "default",
  showStats = true,
}) => {
  // const {
  //   id,
  //   title,
  //   excerpt,
  //   author,
  //   publishedAt,
  //   readTime,
  //   image,
  //   tags,
  //   stats,
  //   coinData
  // } = post;

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className={`${styles.card} ${styles[variant]} glass`}>
      {post && (
        <div className={styles.imageContainer}>
          <img
            src={post?.mediaContent?.originalUri}
            alt={post?.name}
            className={styles.image}
          />
          <div className={styles.imageOverlay}>
            {/* {coinData && (
              <div className={styles.coinPrice}>
                <Coins size={16} />
                <span>${coinData.price}</span>
                <span
                  className={
                    coinData.change >= 0 ? styles.priceUp : styles.priceDown
                  }
                >
                  {coinData.change >= 0 ? "+" : ""}
                  {coinData.change}%
                </span>
              </div>
            )} */}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <UserAvatar
              src={post?.data?.creator?.profile_image}
              alt={post?.data?.creator?.full_name}
              size="sm"
            />
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>
                {post?.data?.creator?.full_name}
              </span>
              <div className={styles.postMeta}>
                <span>{formatDate(post?.createdAt)}</span>
                <span>•</span>
                <span>
                  {Math.floor(post?.description?.length / 200)} min read
                </span>
              </div>
            </div>
          </div>
          {post?.uniqueHolders > 1 && (
            <div className={styles.trendingBadge}>
              <TrendingUp size={12} />
              <span>Trending</span>
            </div>
          )}
        </div>

        <Link to={`/post/${post?.address}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post?.name}</h2>
        </Link>

        <p className={styles.excerpt}>{post?.description?.slice(0, 100)}</p>

        {post?.data?.tags && (
          <div className={styles.tags}>
            {post?.data?.tags?.slice(0, 3).map((tag: any, index: number) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.engagement}>
            <button className={styles.statButton}>
              <Heart size={16} />
              <span>{12}</span>
            </button>
            <button className={styles.statButton}>
              <MessageCircle size={16} />
              <span>{6}</span>
            </button>
            <button className={styles.statButton}>
              <Share2 size={16} />
              <span>{3}</span>
            </button>
          </div>
          <div className={styles.coinStats}>
            <span className={styles.holders}>{44} holders</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
