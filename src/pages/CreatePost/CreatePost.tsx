import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/usePosts';
import PostEditor from '../../components/PostEditor/PostEditor';
import styles from './CreatePost.module.css';

interface PostData {
  title: string;
  content: string;
  tags: string[];
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user, isConnected } = useAuth();
  const { createPost } = usePosts();
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Redirect if not connected
  React.useEffect(() => {
    if (!isConnected || !user) {
      navigate('/');
    }
  }, [isConnected, user, navigate]);

  const handleSave = async (postData: PostData): Promise<void> => {
    console.log('Saving draft:', postData);
    // Here you would typically save to your backend/blockchain
    
    // Show success feedback
    const event = new CustomEvent('showToast', {
      detail: { message: 'Draft saved successfully!', type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const handlePublish = async (postData: PostData): Promise<void> => {
    if (!user) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please connect your wallet to publish', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }

    if (!postData.title.trim()) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please enter a title for your post', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }

    if (!postData.content.trim()) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please write some content for your post', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }

    setIsPublishing(true);
    
    try {
      const postId = await createPost({
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
      }, user.id);
      
      console.log('Published post with ID:', postId);
      setPublishSuccess(true);
      
      // Show success and redirect
      setTimeout(() => {
        navigate(`/post/${postId}`);
      }, 1500);
      
    } catch (error) {
      console.error('Publishing failed:', error);
      const event = new CustomEvent('showToast', {
        detail: { 
          message: error instanceof Error ? error.message : 'Failed to publish post. Please try again.', 
          type: 'error' 
        }
      });
      window.dispatchEvent(event);
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
              <h2 className={styles.successTitle}>Post Published Successfully!</h2>
              <p className={styles.successText}>
                Your story is now live on the blockchain and available to readers worldwide.
              </p>
              <div className={styles.successActions}>
                <button 
                  onClick={() => navigate('/dashboard')}
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
          <button 
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
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
              <span>Your content will be permanently stored on the blockchain</span>
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
            <li>Engage with your readers through comments to build community</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;