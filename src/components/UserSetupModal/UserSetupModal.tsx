import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserSetupModal.module.css';

interface UserSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSetupModal: React.FC<UserSetupModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await (auth as any).createUser({
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        profile_image: profileImage.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      console.error('Profile creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      // For now, we'll use a placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Complete Your Profile</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* Profile Image */}
          <div className={styles.imageSection}>
            <div className={styles.imagePreview}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className={styles.previewImage} />
              ) : (
                <User size={48} className={styles.placeholderIcon} />
              )}
            </div>
            <label className={styles.imageUpload}>
              <Upload size={16} />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
            </label>
          </div>

          {/* Full Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email address"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            className={`${styles.submitButton} glow`}
          >
            {isLoading ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>

        <p className={styles.note}>
          Your wallet address will be linked to this profile. You can update these details later.
        </p>
      </div>
    </div>
  );
};

export default UserSetupModal;