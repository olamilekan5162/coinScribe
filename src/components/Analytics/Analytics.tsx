import React, { useEffect } from "react";
import styles from "./Analytics.module.css";

const Analytics: React.FC<any> = ({ userHoldings }) => {
  useEffect(() => {
    if (userHoldings) {
      console.log(userHoldings);
    } else {
      console.log("fetching");
    }
  }, []);
  //   function formatMarketCap(cap) {
  //     return `$${(cap / 1e18).toFixed(2)}`;
  //   }

  //   function getTokensHeld(balance) {
  //     return (balance / 1e18).toFixed(2);
  //   }

  //   function getPricePerToken(marketCap, totalSupply) {
  //     return `$${(marketCap / totalSupply / 1e18).toFixed(4)}`;
  //   }

  //   function getHeldValue(balance, marketCap, totalSupply) {
  //     const price = marketCap / totalSupply;
  //     return `$${((balance * price) / 1e36).toFixed(2)}`;
  //   }

  //   function formatMarketCapChange(change) {
  //     const sign = change >= 0 ? "+" : "";
  //     return `${sign}${(change * 100).toFixed(2)}%`;
  //   }

  //   function getChangeColorClass(change) {
  //     return change >= 0 ? "positive" : "negative";
  //   }

  const handleTradeClick = () => {
    console.log("Trade");
  };

  return (
    <div className={styles.analyticsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Your Blog Post Holdings</h2>
        <p className={styles.sectionDescription}>
          See which posts you own tokens for and track your investments.
        </p>
      </div>

      {userHoldings?.length > 0 ? (
        <div className={styles.portfolioList}>
          {userHoldings
            //   .filter((item) => item.balance > 0)
            .map((item) => (
              <div key={item.id} className={styles.portfolioItem}>
                <div className={styles.portfolioHeader}>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className={styles.portfolioArtwork}
                  />
                  <div className={styles.portfolioInfo}>
                    <h3 className={styles.portfolioTitle}>{item.title}</h3>
                    <p className={styles.portfolioArtist}>{item.authorName}</p>
                    <div className={styles.portfolioMarketCap}>
                      <span className={styles.marketCapLabel}>Market Cap:</span>
                      <span className={styles.marketCapValue}>{0}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.portfolioStats}>
                  <div className={styles.portfolioStat}>
                    <span className={styles.portfolioLabel}>Your Coins</span>
                    <span className={styles.portfolioValue}>{0}</span>
                  </div>
                  <div className={styles.portfolioStat}>
                    <span className={styles.portfolioLabel}>Coin Price</span>
                    <span className={styles.portfolioValue}>{0}</span>
                  </div>
                  <div className={styles.portfolioStat}>
                    <span className={styles.portfolioLabel}>Total Value</span>
                    <span className={styles.portfolioValue}>{0}</span>
                  </div>
                  <div className={styles.portfolioStat}>
                    <span className={styles.portfolioLabel}>24h Change</span>
                    <span className={`${styles.portfolioValue} `}>{0}</span>
                  </div>
                </div>

                <div className={styles.portfolioActions}>
                  <button
                    className={`${styles.portfolioButton} ${styles.primary}`}
                    onClick={() => handleTradeClick()}
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No tokenized post holdings yet</h3>
          <p>
            When you buy tokens for posts, they’ll appear here for you to manage
            and trade.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
