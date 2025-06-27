import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./lib/wagmi";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import UserSetupModal from "./components/UserSetupModal/UserSetupModal";
import Home from "./pages/Home/Home";
import CreatePost from "./pages/CreatePost/CreatePost";
import PostDetail from "./pages/PostDetail/PostDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Explore from "./pages/Explore/Explore";
import Profile from "./pages/Profile/Profile";
import { useAuth } from "./contexts/AuthContext";
import "./index.css";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { showUserSetupModal, setShowUserSetupModal } = useAuth();

  return (
    <div className="min-h-screen bg-primary-900 w-full mx-auto">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:address" element={<Profile />} />
        </Routes>
      </main>
      <Footer />

      <UserSetupModal
        isOpen={showUserSetupModal}
        onClose={() => setShowUserSetupModal(false)}
      />
    </div>
  );
};

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
