import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  wallet_address: string;
  full_name: string;
  email: string | null;
  profile_image: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  total_earnings: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isConnected: boolean;
  address: string | undefined;
  login: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  showUserSetupModal: boolean;
  setShowUserSetupModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserSetupModal, setShowUserSetupModal] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log(address);
    if (isConnected && address) {
      checkUserExists(address);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const checkUserExists = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error);
        return;
      }

      if (data) {
        setUser(data);
      } else {
        // User doesn't exist, show setup modal
        setShowUserSetupModal(true);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: {
    full_name: string;
    email?: string;
    bio: string;
    profile_image?: string;
  }) => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .insert({
          wallet_address: address.toLowerCase(),
          full_name: userData.full_name,
          bio: userData.bio,
          email: userData.email || null,
          profile_image: userData.profile_image || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      setShowUserSetupModal(false);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const login = () => {
    // This will trigger the Web3Modal
    // The actual connection is handled by wagmi
  };

  const logout = () => {
    disconnect();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isConnected,
    address,
    login,
    logout,
    updateUser,
    showUserSetupModal,
    setShowUserSetupModal,
  };

  // Expose createUser for the setup modal
  (value as any).createUser = createUser;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
