import React, { useState } from "react";
import { Loader2, X, ArrowUpDown, Wallet, CheckCircle } from "lucide-react";
import { Address, createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./TradeModal.module.css";

const TradeModal: React.FC<any> = ({ onClose, userTokens }) => {
  const [tradeType, setTradeType] = useState("buy");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAuth();
  const navigate = useNavigate();

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const handleBuy = async () => {
    if (!amount) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!walletClient) {
      setError("No wallet client or account found");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: userTokens?.node?.coin?.address, // Creator coin address
        },
        amountIn: parseEther(amount), // 0.001 ETH
        slippage: 0.05, // 5% slippage tolerance
        sender: address as Address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient?.account,
        publicClient,
      });

      console.log(receipt);
      setSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = () => {
    console.log("sell");
  };

  const marketCapChange = Number(
    (userTokens?.node?.coin?.marketCapDelta24h /
      (userTokens?.node?.coin?.marketCap -
        userTokens?.node?.coin?.marketCapDelta24h)) *
      100
  );

  if (success) {
    return (
      <div className={styles.modalOverlay}>
        {/* <div className={styles.tradeModal}> */}
        <div className={styles.successContainer}>
          <CheckCircle size={48} className={styles.successIcon} />
          <h3 className={styles.successTitle}>
            {tradeType === "buy" ? "Purchase Successful!" : "Sales Successful!"}
          </h3>
          <p className={styles.successMessage}>
            {tradeType === "buy"
              ? `You now own shares in $${userTokens?.node?.coin?.symbol}. Thank you for supporting the creator!`
              : `You have successfully sold out of your shares in $${userTokens?.node?.coin?.symbol}. Thank you for supporting the creator!`}
          </p>
          <button
            onClick={() => navigate("/")}
            className={`${styles.submitButton} glow`}
          >
            Done
          </button>
        </div>
      </div>
      //   </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.tradeModal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <ArrowUpDown size={20} />
            Trade Tokens
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.modalContent}>
          {/* Trade Type Selector */}
          <div className={styles.tradeTypeSelector}>
            <button
              onClick={() => setTradeType("buy")}
              className={`${styles.tradeTypeButton} ${
                tradeType === "buy" ? styles.active : ""
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType("sell")}
              className={`${styles.tradeTypeButton} ${
                tradeType === "sell" ? styles.active : ""
              }`}
            >
              Sell
            </button>
          </div>

          {/* Token Selection */}
          <div className={styles.tokenSelection}>
            <label className={styles.inputLabel}>Select Token</label>
            <select
              value={selectedToken}
              onChange={(e) => {
                setSelectedToken(e.target.value);
              }}
              className={styles.tokenSelect}
            >
              <option value={"ETH"}>ETH</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className={styles.amountInput}>
            <label className={styles.inputLabel}>
              Amount{" "}
              {tradeType === "buy"
                ? "(ETH)"
                : `$${userTokens?.node?.coin?.symbol}`}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={tradeType === "buy" ? "0.00" : "0"}
              className={styles.amountField}
            />
          </div>

          {/* Token Info */}

          <div className={styles.tokenInfo}>
            <div className={styles.tokenInfoRow}>
              <span>Price per coin:</span>
              <span>
                $
                {userTokens?.node?.coin?.marketCap /
                  userTokens?.node?.coin?.totalSupply}
              </span>
            </div>
            <div className={styles.tokenInfoRow}>
              <span>24h Change:</span>
              <span
                className={
                  marketCapChange >= 0 ? styles.positive : styles.negative
                }
              >
                {marketCapChange >= 0 ? "+" : ""}
                {marketCapChange.toFixed(2)}%
              </span>
            </div>
            <div className={styles.tokenInfoRow}>
              <span>Your Holdings:</span>
              <span>
                {Number(userTokens?.node?.balance).toFixed(10)} tokens
              </span>
            </div>
          </div>

          {/* Trade Summary */}
          {amount && selectedToken && (
            <div className={styles.tradeSummary}>
              <div className={styles.summaryRow}>
                <span>You {tradeType}:</span>
                <span>
                  {tradeType === "buy"
                    ? `${amount} ${selectedToken}`
                    : `${amount} $${userTokens?.node?.coin?.symbol}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total Cost:</span>
                <span>
                  {tradeType === "buy"
                    ? `${amount} ${selectedToken}`
                    : `${amount} $${userTokens?.node?.coin?.symbol}`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={tradeType === "buy" ? handleBuy : handleSell}
            disabled={!amount || !selectedToken || isLoading}
            className={`${styles.tradeButton} ${
              tradeType === "buy" ? styles.buyButton : styles.sellButton
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              <>
                <Wallet size={16} />
                {tradeType === "buy" ? "Buy Tokens" : "Sell Tokens"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default TradeModal;
