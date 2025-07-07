import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "../PostCard/PostCard";
import styles from "./FeaturedCarousel.module.css";

interface FeaturedCarouselProps {
  posts: any[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, posts.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (posts.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContainer}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 152}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className={styles.carouselSlide}>
              <PostCard post={post} variant="featured" />
            </div>
          ))}
        </div>

        {posts.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`${styles.carouselButton} ${styles.prevButton}`}
              aria-label="Previous post"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className={`${styles.carouselButton} ${styles.nextButton}`}
              aria-label="Next post"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {posts.length > 1 && (
        <div className={styles.indicators}>
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.indicator} ${
                index === currentIndex ? styles.indicatorActive : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;
