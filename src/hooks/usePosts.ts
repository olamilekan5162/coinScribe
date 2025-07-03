import { useState, useEffect } from "react";
import { baseSepolia } from "viem/chains";
import { getCoins } from "@zoralabs/coins-sdk";
import { supabase } from "../lib/supabase";

export const usePosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  const fetchPostsAddress = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      const postAddress = data.map((item) => ({
        chainId: +baseSepolia.id,
        collectionAddress: item.coin_address.toString().toLowerCase() || "",
      }));
      return postAddress;
      // console.log(postAddress);
    } catch (err) {
      console.log("Failed to load profile" + err);
      setError(err);
    }
  };

  const fetchMultipleCoins = async () => {
    const collectionAddresses = await fetchPostsAddress();
    const response = await getCoins({
      coins: collectionAddresses || [],
    });
    return response.data?.zora20Tokens;
  };

  const fetchData = async () => {
    try {
      const coins = await fetchMultipleCoins();

      if (!coins) {
        console.log("No coins found");
        return;
      }

      const coinDataArray = await Promise.all(
        coins.map(async (coin) => {
          const response = await fetch(`${coin.tokenUri}`);
          if (!response.ok) {
            throw new Error("Unable to fetch tokenUri");
          }
          const data = await response.json();
          return { ...coin, data };
        })
      );
      setPosts(coinDataArray);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    posts,
    isLoading,
    error,
  };
};
