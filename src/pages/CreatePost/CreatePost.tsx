import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Eye, Check, X, Loader2, Info } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
// import { usePosts } from "../../hooks/usePosts";
import { supabase } from "../../lib/supabase";
import PostEditor from "../../components/PostEditor/PostEditor";
import styles from "./CreatePost.module.css";
import { useWalletClient } from "wagmi";
import { PinataSDK } from "pinata";
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { baseSepolia, mainnet } from "viem/chains";
import { createPublicClient, http, Address } from "viem";

interface PostData {
  title: string;
  content: string;
  imageLink: string;
  tags: string[];
}

// Toast types
type ToastType = 'success' | 'error' | 'loading' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Individual Toast Component
const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.type !== 'loading' && toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.type, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
      case 'loading':
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      case 'info':
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50/90 border-gray-200 text-gray-800`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">
          {toast.title}
        </div>
        {toast.message && (
          <div className="text-sm opacity-90 mt-1">
            {toast.message}
          </div>
        )}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>
      )}
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right-full duration-300"
        >
          <ToastComponent toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

// Hook for managing toasts
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  return {
    toasts,
    addToast,
    removeToast,
    updateToast
  };
};

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { data: walletClient } = useWalletClient();
  const { address, user, isConnected } = useAuth();
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const { toasts, addToast, removeToast } = useToast();

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected || !user) {
      navigate("/");
    }
  }, [isConnected, user, navigate]);

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL,
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
      console.log("Failed to load profile" + err);
    }
  };

  const handlePublish = async (postData: PostData): Promise<void> => {
    if (!user || !walletClient) {
      throw new Error("User and walletclient not available");
    }

    if (!postData) {
      addToast({
        type: 'error',
        title: 'Incomplete post details',
        message: 'Please fill in all required fields',
        duration: 5000
      });
      return;
    }

    setIsPublishing(true);

    // Show loading toast
    const loadingToastId = addToast({
      type: 'loading',
      title: 'Publishing post...',
      message: 'Your story is being uploaded to the blockchain',
      duration: 0 // Don't auto-remove loading toasts
    });

    try {
      const creatorData = await fetchProfile(`${address}`);

      const imageUrl = await pinata.upload.public.url(postData.imageLink);

      const upload = await pinata.upload.public.json({
        name: postData.title,
        description: postData.content,
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

      // create coin Params
      const coinParams = {
        name: postData.title,
        symbol: postData.title.slice(0, 3).toUpperCase(),
        uri: `https://black-far-coyote-812.mypinata.cloud/ipfs/${upload.cid}`,
        chainId: mainnet.id,
        payoutRecipient: address as Address,
        platformReferrer:
          "0x4E998Ae5B55e492d0d2665CA854B03625f7aCf33" as Address,
        currency: DeployCurrency.ZORA,
      };

      console.log("creating coin");

      const result = await createCoin(coinParams, walletClient, publicClient, {
        gasMultiplier: 120,
      });

      console.log(result);

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: postData.title,
            coin_address: result?.address,
            wallet_address: result?.deployment?.caller,
            author_id: creatorData.id,
          },
        ])
        .select();

      if (error) throw new Error("Coin not updated in supabase");

      console.log(data);

      // Remove loading toast
      removeToast(loadingToastId);

      // Show success toast
      addToast({
        type: 'success',
        title: 'Post published successfully!',
        message: 'Your story is now live on the blockchain',
        duration: 5000
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Publishing failed:", error);
      
      // Remove loading toast
      removeToast(loadingToastId);
      
      // Show error toast
      addToast({
        type: 'error',
        title: 'Publishing failed',
        message: error.message || 'There was an error publishing your post. Please try again.',
        duration: 6000
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isConnected || !user) {
    return null; // Will redirect in useEffect
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
          <PostEditor onPublish={handlePublish} isPublishing={isPublishing} />
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

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default CreatePost;