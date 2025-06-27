import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Eye } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
// import { usePosts } from "../../hooks/usePosts";
import { supabase } from "../../lib/supabase";
import PostEditor from "../../components/PostEditor/PostEditor";
import styles from "./CreatePost.module.css";
import { useWalletClient } from "wagmi";
import { PinataSDK } from "pinata";
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { baseSepolia } from "viem/chains";
import { createPublicClient, http, Address } from "viem";

interface PostData {
  title: string;
  content: string;
  imageLink: string;
  tags: string[];
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { data: walletClient } = useWalletClient();
  const { address, user, isConnected } = useAuth();
  // const { createPost } = usePosts();
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected || !user) {
      navigate("/");
    }
  }, [isConnected, user, navigate]);

  const handleSave = async (postData: PostData): Promise<void> => {
    console.log("Saving draft:", postData);
    const event = new CustomEvent("showToast", {
      detail: { message: "Draft saved successfully!", type: "success" },
    });
    window.dispatchEvent(event);
  };

  const fetchProfile = async (walletAddress: string) => {
    try {
      console.log("fetching profile");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("User not found");
        } else {
          throw error;
        }
        return;
      }

      return data;
    } catch (err) {
      console.log("Failed to load profile" + err.message);
    }
  };

  const handlePublish = async (postData: PostData): Promise<void> => {
    if (!user || !walletClient) {
      throw new Error("User and  walletclient not available");
    }
    setIsPublishing(true);

    try {
      const pinata = new PinataSDK({
        pinataJwt: import.meta.env.VITE_PINATA_JWT,
        pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
      });

      const creatorData = await fetchProfile(address);

      const imageUrl = await pinata.upload.public.url(postData.imageLink);
      console.log("image uploaded to pinata first");

      const upload = await pinata.upload.public.json({
        name: postData.title,
        description: postData.title,
        image: `https://black-far-coyote-812.mypinata.cloud/ipfs/${imageUrl.cid}`,
        animation_url: `https://black-far-coyote-812.mypinata.cloud/ipfs/${imageUrl.cid}`,
        content: {
          mime: "image/png",
          uri: `https://black-far-coyote-812.mypinata.cloud/ipfs/${imageUrl.cid}`,
        },
        properties: {
          category: "story",
        },
        storyContent: postData.content,
        creator: creatorData,
        created: Date.now(),
        tags: postData.tags,
      });

      console.log(upload);

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      // create coin Params
      const coinParams = {
        name: postData.title,
        symbol: postData.title.slice(0, 3).toUpperCase(),
        uri: `https://black-far-coyote-812.mypinata.cloud/ipfs/${upload.cid}`,
        chainId: baseSepolia.id,
        payoutRecipient: address as Address,
        platformReferrer:
          "0x4E998Ae5B55e492d0d2665CA854B03625f7aCf33" as Address,
        currency: DeployCurrency.ETH,
      };

      console.log("creating coin");

      const result = await createCoin(coinParams, walletClient, publicClient, {
        gasMultiplier: 120,
      });

      console.log(result);

      setPublishSuccess(true);
    } catch (error) {
      console.error("Publishing failed:", error);
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to publish post. Please try again.",
            type: "error",
          },
        })
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isConnected || !user) {
    return null; // Will redirect in useEffect
  }

  if (publishSuccess) {
    return (
      <div className={styles.createPost}>
        <div className="container">
          <div className={styles.successMessage}>
            <div className={`${styles.successCard} glass`}>
              <div className={styles.successIcon}>
                <Send size={48} />
              </div>
              <h2 className={styles.successTitle}>
                Post Published Successfully!
              </h2>
              <p className={styles.successText}>
                Your story is now live on the blockchain and available to
                readers worldwide.
              </p>
              <div className={styles.successActions}>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`${styles.successButton} glow`}
                >
                  View in Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.createPost}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className={styles.headerMeta}>
            <span className={styles.status}>Draft</span>
            <span className={styles.autoSave}>Auto-saving...</span>
          </div>
        </div>

        {/* Publishing Guidelines */}
        <div className={`${styles.guidelines} glass`}>
          <h3 className={styles.guidelinesTitle}>Publishing Guidelines</h3>
          <div className={styles.guidelinesList}>
            <div className={styles.guideline}>
              <Eye size={16} />
              <span>
                Your content will be permanently stored on the blockchain
              </span>
            </div>
            <div className={styles.guideline}>
              <Save size={16} />
              <span>Save drafts locally before publishing</span>
            </div>
            <div className={styles.guideline}>
              <Send size={16} />
              <span>Once published, content cannot be deleted or modified</span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className={styles.editorContainer}>
          <PostEditor
            onSave={handleSave}
            onPublish={handlePublish}
            isPublishing={isPublishing}
          />
        </div>

        {/* Publishing Tips */}
        <div className={`${styles.tips} glass`}>
          <h3 className={styles.tipsTitle}>💡 Pro Tips</h3>
          <ul className={styles.tipsList}>
            <li>Use engaging titles to attract more readers</li>
            <li>Add relevant tags to help readers discover your content</li>
            <li>Include images to make your posts more visually appealing</li>
            <li>Write compelling excerpts - they appear in post previews</li>
            <li>
              Engage with your readers through comments to build community
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
