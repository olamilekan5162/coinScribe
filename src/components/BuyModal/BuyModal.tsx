import React, { useEffect, useState } from "react";
import { X, DollarSign } from "lucide-react";
import styles from "./BuyModal.module.css";
import { createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { tradeCoin, TradeParameters } from "@zoralabs/coins-sdk";
import { useAuth } from "../../contexts/AuthContext";

const BuyModal: React.FC<any> = ({ isOpen, onClose, coinAddress }) => {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAuth();

  useEffect(() => {
    console.log(walletClient);
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const account = privateKeyToAccount(walletClient?.account);
      const tradeParameters: TradeParameters = {
        sell: { type: "eth" },
        buy: {
          type: "erc20",
          address: coinAddress, // Creator coin address
        },
        amountIn: parseEther(amount), // 0.001 ETH
        slippage: 0.05, // 5% slippage tolerance
        sender: account.address,
      };

      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account,
        publicClient,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        <div className={styles.closeButton}>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Buy Shares in This Post</h2>
        </div>

        <p className={styles.info}>
          This blog post is tokenized. By buying, you hold a percentage of its
          token—like owning a piece of the story. It’s similar to trading on
          Uniswap.
        </p>

        <form onSubmit={handleBuy} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Amount to Buy</label>
            <div className={styles.inputWrapper}>
              <DollarSign size={18} className={styles.inputIcon} />
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} glow`}
          >
            {isLoading ? "Processing..." : "Buy Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyModal;
