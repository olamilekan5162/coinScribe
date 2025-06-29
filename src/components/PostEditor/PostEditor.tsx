import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  EyeOff,
  Save,
  Send,
} from "lucide-react";
import styles from "./PostEditor.module.css";

interface PostData {
  title: string;
  content: string;
  imageLink: string;
  tags: string[];
}

interface ToolbarAction {
  icon: React.ComponentType<{ size?: number }>;
  action: string;
  tooltip: string;
  value?: string;
}

interface PostEditorProps {
  onPublish?: (data: PostData) => void;
  initialContent?: string;
  initialTitle?: string;
  isPublishing?: boolean;
}

const PostEditor: React.FC<PostEditorProps> = ({
  onPublish,
  initialContent = "",
  initialTitle = "",
  isPublishing = false,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [imageLink, setImageLink] = useState<string>("");
  const [currentTag, setCurrentTag] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const toolbarActions: ToolbarAction[] = [
    { icon: Bold, action: "bold", tooltip: "Bold" },
    { icon: Italic, action: "italic", tooltip: "Italic" },
    { icon: Underline, action: "underline", tooltip: "Underline" },
    { icon: Link, action: "createLink", tooltip: "Link" },
    { icon: Image, action: "insertImage", tooltip: "Image" },
    { icon: List, action: "insertUnorderedList", tooltip: "Bullet List" },
    {
      icon: ListOrdered,
      action: "insertOrderedList",
      tooltip: "Numbered List",
    },
    {
      icon: Quote,
      action: "formatBlock",
      tooltip: "Quote",
      value: "blockquote",
    },
    { icon: Code, action: "formatBlock", tooltip: "Code Block", value: "pre" },
  ];

  const handleToolbarAction = (
    action: string,
    value: string | null = null
  ): void => {
    if (action === "createLink") {
      const url = prompt("Enter URL:");
      if (url) {
        document.execCommand(action, false, url);
        setImageLink(url);
      }
    } else if (action === "insertImage") {
      const url = prompt("Enter image URL:");
      if (url) {
        document.execCommand(action, false, url);
        setImageLink(url);
      }
    } else {
      document.execCommand(action, false, value);
    }
    editorRef.current?.focus();
  };

  const handleContentChange = (): void => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const addTag = (): void => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = (): void => {
    console.log("saving");
  };

  const handlePublish = (): void => {
    onPublish?.({ title, content, tags, imageLink });
    console.log({ title, content, tags });
  };

  return (
    <div className={`${styles.editor} glass`}>
      {/* Header */}
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Enter your post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />
        <div className={styles.headerActions}>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={styles.previewButton}
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isPreview ? "Edit" : "Preview"}</span>
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            <Save size={16} />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handlePublish}
            className={`${styles.publishButton} glow`}
            disabled={isPublishing}
          >
            <Send size={16} />
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className={styles.toolbar}>
          {toolbarActions.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={index}
                onClick={() => handleToolbarAction(tool.action, tool.value)}
                className={styles.toolButton}
                title={tool.tooltip}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      )}

      {/* Content Area */}
      <div className={styles.contentArea}>
        {isPreview ? (
          <div className={styles.preview}>
            <h1 className={styles.previewTitle}>{title || "Untitled Post"}</h1>
            <div
              className={styles.previewContent}
              dangerouslySetInnerHTML={{
                __html: content || "<p>Start writing your post...</p>",
              }}
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            className={styles.contentEditor}
            data-placeholder="Start writing your post..."
          />
        )}
      </div>

      {/* Tags Section */}
      <div className={styles.tagsSection}>
        <label className={styles.tagsLabel}>Tags (Press Enter to add)</label>
        <div className={styles.tagsContainer}>
          <div className={styles.tagsList}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className={styles.tagRemove}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a tag..."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.tagInput}
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
