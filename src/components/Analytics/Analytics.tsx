import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import TradeModal from "../TradeModal/TradeModal";
// import TradeModal from "../TradeModal/TradeModal";

const Analytics: React.FC<any> = ({ holding }) => {
  const [showTradeModal, setShowTradeModal] = useState(false);
  useEffect(() => {
    if (holding) {
      console.log(holding);
    } else {
      console.log("fetching");
    }
  }, []);

  return (
    <>
      <div className={styles.portfolioItem}>
        <div className={styles.portfolioHeader}>
          <img
            src={holding?.node?.coin?.mediaContent?.originalUri}
            alt={holding?.node?.coin?.name}
            className={styles.portfolioArtwork}
          />
          <div className={styles.portfolioInfo}>
            <h3 className={styles.portfolioTitle}>
              {holding?.node?.coin?.name}
            </h3>
            {/* <p className={styles.portfolioArtist}>
              {holding?.node?.coin?.name.slice(0, 10)}
            </p> */}
            <div className={styles.portfolioMarketCap}>
              <span className={styles.marketCapLabel}>Token:</span>
              <span className={styles.marketCapValue}>
                ${holding?.node?.coin?.symbol}
              </span>
            </div>
            <div className={styles.portfolioMarketCap}>
              <span className={styles.marketCapLabel}>Market Cap:</span>
              <span className={styles.marketCapValue}>
                ${holding?.node?.coin?.marketCap}
              </span>
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
            onClick={() => setShowTradeModal(true)}
          >
            Trade
          </button>
        </div>
      </div>
      {showTradeModal && (
        <TradeModal
          onClose={() => setShowTradeModal(false)}
          userTokens={holding}
        />
      )}
    </>
  );
};

export default Analytics;
