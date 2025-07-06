import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, TrendingUp, Coins } from "lucide-react";
import UserAvatar from "../UserAvatar/UserAvatar";
import styles from "./PostCard.module.css";

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
  const removeTags = (str: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.textContent;
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const marketChange = Number(
    (post?.marketCapDelta24h / (post?.marketCap - post?.marketCapDelta24h)) *
      100
  );

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
            {post && (
              <div className={styles.coinPrice}>
                <Coins size={16} />
                <span>${post?.marketCap}</span>
                <span
                  className={
                    marketChange >= 0 ? styles.priceUp : styles.priceDown
                  }
                >
                  {marketChange >= 0 ? "+" : ""}
                  {marketChange.toFixed(2)}%
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
          {post?.uniqueHolders > 2 && (
            <div className={styles.trendingBadge}>
              <TrendingUp size={12} />
              <span>Trending</span>
            </div>
          )}
        </div>

        <Link to={`/post/${post?.address}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post?.name}</h2>
        </Link>

        <p className={styles.excerpt}>
          {removeTags(post?.description?.slice(0, 1000))}
        </p>

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
            <span className={styles.holders}>
              {post?.uniqueHolders} holders
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
