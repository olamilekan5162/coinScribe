import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Twitter, Github, Disc as Discord, Send } from 'lucide-react';
import styles from './Footer.module.css';

interface FooterLink {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
}

interface FooterLinks {
  platform: FooterLink[];
  community: FooterLink[];
  legal: FooterLink[];
}

const Footer: React.FC = () => {
  const footerLinks: FooterLinks = {
    platform: [
      { name: 'Home', href: '/' },
      { name: 'Explore', href: '/explore' },
      { name: 'Create', href: '/create' },
      { name: 'Dashboard', href: '/dashboard' }
    ],
    community: [
      { name: 'Discord', href: '#', icon: Discord },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'GitHub', href: '#', icon: Github }
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Cookie Policy', href: '#' }
    ]
  };

  return (
    <footer className={`${styles.footer} glass`}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link to="/" className={styles.logo}>
              <PenTool size={24} />
              <span>CoinScribe</span>
            </Link>
            <p className={styles.tagline}>
              Decentralized publishing platform where words create value and stories build communities.
            </p>
            <div className={styles.socialLinks}>
              {footerLinks.community.map((link) => {
                const Icon = link.icon!;
                return (
                  <a key={link.name} href={link.href} className={styles.socialLink}>
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.linksGrid}>
            <div className={styles.linkSection}>
              <h3 className={styles.linkTitle}>Platform</h3>
              <ul className={styles.linkList}>
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className={styles.link}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkSection}>
              <h3 className={styles.linkTitle}>Legal</h3>
              <ul className={styles.linkList}>
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={styles.link}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className={styles.newsletterSection}>
              <h3 className={styles.linkTitle}>Stay Updated</h3>
              <p className={styles.newsletterText}>
                Get notified about new features and platform updates.
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterButton}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2025 CoinScribe. Built on the decentralized web.
          </p>
          <div className={styles.poweredBy}>
            <span>Powered by</span>
            <span className={styles.web3Badge}>Web3</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;