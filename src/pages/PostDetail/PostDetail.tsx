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
  TrendingDown,
} from "lucide-react";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import StatsPanel from "../../components/StatsPanel/StatsPanel";
import PostCard from "../../components/PostCard/PostCard";
import styles from "./PostDetail.module.css";
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import { usePosts } from "../../hooks/usePosts";
import { useComments } from "../../hooks/useComments";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import BuyModal from "../../components/BuyModal/BuyModal";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(2340);
  const [commentInput, setCommentInput] = useState<string>("");
  const { user } = useAuth();

  const [postData, setPostData] = useState<any | null>(null);
  const [postId, setPostId] = useState<any>("");
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const { comments, addComment } = useComments(postId);
  const { posts } = usePosts();
  const otherPosts = posts.filter(
    (post) =>
      post.creatorAddress === postData.creatorAddress &&
      post.address !== postData.address
  );

  useEffect(() => {
    const fetchPostId = async () => {
      const { data: postId, error } = await supabase
        .from("posts")
        .select("id")
        .ilike("coin_address", `${id}`)
        .single();
      if (error) {
        console.log(error);
        return;
      }
      setPostId(postId.id);
    };
    fetchPostId();
  }, [id]);

  const fetchSingleCoin = async () => {
    const response = await getCoin({
      address: `${id}`,
      chain: base.id,
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
        const data: any = await response.json();
        console.log({ ...coin, data });
        setPostData({ ...coin, data });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const handleLike = (): void => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: postData?.name,
        text: postData?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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

  const marketChange = Number(
    (postData?.marketCapDelta24h /
      (postData?.marketCap - postData?.marketCapDelta24h)) *
      100
  );

  return (
    <div className={styles.postDetail}>
      <div className={styles.header}>
        <div className="container">
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {postData?.mediaContent?.originalUri && (
        <div className={styles.heroImage}>
          <img src={postData?.mediaContent?.originalUri} alt={postData?.name} />
          <div className={styles.heroOverlay}>
            <div className="container">
              <div className={styles.heroContent}>
                <div className={styles.postMeta}>
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{formatDate(postData?.createdAt)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>
                      {Math.floor(postData?.description.length / 1000)} min read
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
                    to={`/profile/${postData?.creatorAddress}`}
                    className={styles.authorInfo}
                  >
                    <UserAvatar
                      src={postData?.data?.creator?.profile_image}
                      alt={postData?.data?.creator.full_name}
                      size="lg"
                      showBorder
                    />
                    <div className={styles.authorMeta}>
                      <h3 className={styles.authorName}>
                        {postData?.data?.creator.full_name}
                      </h3>
                      <p className={styles.authorBio}>
                        {postData?.data?.creator.bio}
                      </p>
                      <div className={styles.authorStats}>
                        <span>
                          {postData?.data?.creator?.followers_count} followers
                        </span>
                        <span>•</span>
                        <span>{otherPosts.length + 1} posts</span>
                      </div>
                    </div>
                  </Link>
                  <button className={styles.followButton}>Follow</button>
                </div>

                {/* Tags */}
                <div className={styles.tags}>
                  {postData?.data.tags.map((tag: any, index: number) => (
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
                dangerouslySetInnerHTML={{ __html: postData?.description }}
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
                    <span>{comments.length}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className={styles.engagementButton}
                  >
                    <Share2 size={20} />
                    <span>{1}</span>
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
                Discussion ({comments.length || 0})
              </h2>
              <div className={styles.commentForm}>
                <UserAvatar src={user?.profile_image} size="md" />
                <div className={styles.commentInput}>
                  <textarea
                    placeholder="Share your thoughts..."
                    className={styles.commentTextarea}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <div className={styles.commentActions}>
                    <button
                      className={styles.commentButton}
                      onClick={() => {
                        addComment(commentInput, user?.id);
                        setCommentInput("");
                      }}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
              {comments.length > 0 ? (
                <div className={styles.commentsList}>
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <UserAvatar
                        src={comment?.author.profile_image}
                        size="md"
                      />
                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>
                            {comment.author.full_name}
                          </span>
                          <span className={styles.commentTimestamp}>
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className={styles.commentText}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.commentsPlaceholder}>
                  <p>
                    Comments will be displayed here once the backend is
                    connected.
                  </p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Stats Panel */}
            <StatsPanel variant="post" data={postData} />

            {/* Coin Info */}
            <div className={`${styles.coinInfo} glass`}>
              <h3 className={styles.sidebarTitle}>Story Token</h3>
              <div className={styles.coinDetails}>
                <div className={styles.coinPrice}>
                  <div className={styles.coinIcon}>
                    <Coins size={16} />
                  </div>
                  <div className={styles.priceInfo}>
                    <span className={styles.price}>${postData?.marketCap}</span>

                    <div className={styles.coinChange}>
                      {marketChange >= 0 ? (
                        <TrendingUp size={12} className={styles.trendUp} />
                      ) : (
                        <TrendingDown size={12} className={styles.trendDown} />
                      )}
                      <span
                        className={
                          marketChange >= 0
                            ? styles.changeUp
                            : styles.changeDown
                        }
                      >
                        {marketChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.coinStats}>
                  <div className={styles.coinStat}>
                    <Users size={16} />
                    <span>{postData?.uniqueHolders} holders</span>
                  </div>
                  <div className={styles.coinStat}>
                    <TrendingUp size={16} />
                    <span>Trending #12</span>
                  </div>
                </div>
                <button
                  className={`${styles.buyButton} glow`}
                  onClick={() => setBuyModalOpen(true)}
                >
                  Hold Tokens
                </button>
              </div>
            </div>

            {/* Author Info */}
            <div className={`${styles.authorCard} glass`}>
              <h3 className={styles.sidebarTitle}>About the Author</h3>
              <div className={styles.authorDetails}>
                <div className={styles.authorAvatar}>
                  <UserAvatar
                    src={postData?.data?.creator.profile_image}
                    alt={postData?.data?.creator.full_name}
                    size="xl"
                  />
                </div>
                <h4 className={styles.authorCardName}>
                  {postData?.data?.creator.full_name}
                </h4>
                <p className={styles.authorCardBio}>
                  {postData?.data?.creator.bio}
                </p>
                <div className={styles.authorCardStats}>
                  <div className={styles.authorCardStat}>
                    <span className={styles.statValue}>
                      {postData?.data?.creator.followers_count}
                    </span>
                    <span className={styles.statLabel}>Followers</span>
                  </div>
                  <div className={styles.authorCardStat}>
                    <span className={styles.statValue}>
                      {otherPosts.length + 1}
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
          {otherPosts.length > 0 ? (
            <>
              <h2 className={styles.relatedTitle}>Other posts from Author</h2>
              <div className={styles.relatedGrid}>
                {otherPosts.slice(0, 2)?.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <h2 className={styles.relatedTitle}>No new post from Author</h2>
          )}
        </section>
      </div>
      <BuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        coinAddress={postData?.address}
      />
    </div>
  );
};

export default PostDetail;
