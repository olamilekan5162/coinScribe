import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { 
  PenTool, 
  Search, 
  Bell, 
  Menu, 
  X,
  Home,
  Compass,
  BarChart3,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../UserAvatar/UserAvatar';
import styles from './Navbar.module.css';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { open } = useWeb3Modal();
  const { user, isConnected, address, logout } = useAuth();

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleWalletClick = () => {
    if (isConnected) {
      // Show wallet modal for connected users
      open();
    } else {
      // Open connection modal for non-connected users
      open();
    }
  };

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <PenTool size={24} />
            <span>CoinScribe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${styles.navLink} ${
                    isActiveRoute(item.href) ? styles.navLinkActive : ''
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.searchButton}>
              <Search size={20} />
            </button>
            
            <Link 
              to="/create" 
              className={`${styles.createButton} glow`}
            >
              <PenTool size={18} />
              <span>Write</span>
            </Link>

            {isConnected && user ? (
              <>
                <button className={styles.notificationButton}>
                  <Bell size={20} />
                  <span className={styles.notificationBadge}>3</span>
                </button>

                <Link to={`/profile/${address}`}>
                  <UserAvatar 
                    src={user.profile_image || undefined}
                    alt={user.full_name}
                    size="sm"
                    showBorder
                  />
                </Link>
              </>
            ) : (
              <button 
                onClick={handleWalletClick}
                className={`${styles.walletButton} glow`}
              >
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNav}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${styles.mobileNavLink} ${
                    isActiveRoute(item.href) ? styles.mobileNavLinkActive : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/create"
              className={styles.mobileCreateButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PenTool size={20} />
              <span>Write New Post</span>
            </Link>
            
            {!isConnected && (
              <button 
                onClick={() => {
                  handleWalletClick();
                  setIsMobileMenuOpen(false);
                }}
                className={styles.mobileWalletButton}
              >
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;