import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Coins,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import styles from "./StatsPanel.module.css";

// interface StatsPanelData {
//   views?: number;
//   likes?: number;
//   comments?: number;
//   shares?: number;
//   coinPrice?: number;
//   priceChange?: number;
//   holders?: number;
//   totalEarnings?: number;
//   publishedAt?: string;
//   readTime?: number;
// }

// interface StatsPanelProps {
//   variant?: "post" | "dashboard";
//   data?: StatsPanelData;
//   className?: string;
// }

const StatsPanel: React.FC<any> = ({
  variant = "post",
  data = {},
  className = "",
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  const formatDate = (date?: string): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (variant === "post") {
    return (
      <div
        className={`${styles.statsPanel} ${styles.postStats} glass ${className}`}
      >
        <div className={styles.statsHeader}>
          <h3 className={styles.statsTitle}>Post Statistics</h3>
          {data && (
            <div className={styles.publishInfo}>
              <Calendar size={14} />
              <span>{formatDate(data?.createdAt)}</span>
              <span>
                • {Math.floor(data?.description.length / 1000)} min read
              </span>
            </div>
          )}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Eye size={16} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(0)}</span>
              <span className={styles.statLabel}>Views</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Heart size={16} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(0)}</span>
              <span className={styles.statLabel}>Likes</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <MessageCircle size={16} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(0)}</span>
              <span className={styles.statLabel}>Comments</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Share2 size={16} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(0)}</span>
              <span className={styles.statLabel}>Shares</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={`${styles.statsPanel} glass`}>
        <div className={styles.statsHeader}>
          <h3 className={styles.statsTitle}>Earnings Overview</h3>
        </div>

        <div className={styles.earningsGrid}>
          <div className={styles.earningItem}>
            <div className={styles.earningIcon}>
              <DollarSign size={20} />
            </div>
            <div className={styles.earningInfo}>
              <span className={styles.earningValue}>
                {formatPrice(data?.totalEarnings)}
              </span>
              <span className={styles.earningLabel}>Total Earnings</span>
            </div>
          </div>

          <div className={styles.earningItem}>
            <div className={styles.earningIcon}>
              <Coins size={20} />
            </div>
            <div className={styles.earningInfo}>
              <span className={styles.earningValue}>
                {formatPrice(data.coinPrice)}
              </span>
              <span className={styles.earningLabel}>Avg. Coin Price</span>
            </div>
          </div>

          <div className={styles.earningItem}>
            <div className={styles.earningIcon}>
              <Users size={20} />
            </div>
            <div className={styles.earningInfo}>
              <span className={styles.earningValue}>
                {formatNumber(data.holders)}
              </span>
              <span className={styles.earningLabel}>Total Holding</span>
            </div>
          </div>

          <div className={styles.earningItem}>
            <div className={styles.earningIcon}>
              <Eye size={20} />
            </div>
            <div className={styles.earningInfo}>
              <span className={styles.earningValue}>
                {formatNumber(data.views)}
              </span>
              <span className={styles.earningLabel}>Total Views</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatsPanel;
