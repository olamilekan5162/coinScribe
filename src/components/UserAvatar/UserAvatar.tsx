import React from 'react';
import { User } from 'lucide-react';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt = 'User Avatar', 
  size = 'md', 
  showBorder = false, 
  onClick 
}) => {
  const sizeClass = styles[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}`];
  const borderClass = showBorder ? styles.avatarBorder : '';

  return (
    <div 
      className={`${styles.avatar} ${sizeClass} ${borderClass}`}
      onClick={onClick}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className={styles.avatarImage}
        />
      ) : (
        <User className={styles.avatarIcon} />
      )}
    </div>
  );
};

export default UserAvatar;