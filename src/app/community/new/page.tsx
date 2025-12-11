"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommunityLayout from "@/components/CommunityLayout";
import { getUserIdentity, UserIdentity } from "@/lib/userIdentity";
import { addPost } from "@/lib/communityStorage";
import "./new-post.css";

const categories = [
  { id: "production", name: "编曲", desc: "音乐制作和编曲技巧" },
  { id: "mixing", name: "混音", desc: "混音技术和后期处理" },
  { id: "plugins", name: "插件", desc: "音频插件和软件工具" },
  { id: "showcase", name: "作品", desc: "展示你的音乐作品" },
  { id: "help", name: "问答", desc: "寻求帮助和技术支持" },
];

const availableTags = [
  "EQ",
  "压缩",
  "混响",
  "人声",
  "鼓组",
  "贝斯",
  "母带",
  "合成器",
  "采样",
  "新手",
  "进阶",
  "教程",
];

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUser(getUserIdentity());
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setMusicUrl(result);
        if (!musicTitle) {
          setMusicTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    }
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !category || !content.trim()) return;

    setSubmitting(true);

    const newPost = await addPost({
      title: title.trim(),
      category,
      tags,
      author: user.username,
      content: content.trim(),
      time: "刚刚",
      authorId: user.id,
      imageUrl: imageUrl || undefined,
      musicUrl: musicUrl || undefined,
      musicTitle: musicTitle || undefined,
    });

    router.push(`/community/post/${newPost.id}`);
  };

  const isValid = title.trim() && category && content.trim();

  return (
    <CommunityLayout showSidebars={false}>
      {/* Breadcrumb */}
      <nav className="new-post-breadcrumb">
        <Link href="/" className="breadcrumb-link">
          首页
        </Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/community" className="breadcrumb-link">
          社区
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">新话题</span>
      </nav>

      <div className="modern-post-editor">
        {/* Header */}
        <header className="editor-page-header">
          <h1>创建新话题</h1>
          {user && (
            <div className="author-info">
              <div className="author-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span>
                以 <strong>{user.username}</strong> 身份发布
              </span>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="editor-form">
          {/* Title Field */}
          <div className="form-section">
            <label className="form-label">话题标题</label>
            <input
              type="text"
              placeholder="输入一个清晰、描述性的标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="title-input"
            />
            <div className="field-hint">{title.length}/100 字符</div>
          </div>

          {/* Category Selection */}
          <div className="form-section">
            <label className="form-label">选择分类</label>
            <div className="category-selector">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-card ${category === cat.id ? "selected" : ""}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <div className="category-icon"></div>
                  <div className="category-info">
                    <div className="category-name">{cat.name}</div>
                    <div className="category-desc">{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Selection */}
          <div className="form-section">
            <label className="form-label">
              添加标签 <span className="label-note">最多 3 个</span>
            </label>
            <div className="tags-selector">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip ${tags.includes(tag) ? "selected" : ""}`}
                  onClick={() => toggleTag(tag)}
                  disabled={!tags.includes(tag) && tags.length >= 3}
                >
                  {tag}
                </button>
              ))}
            </div>
            {tags.length > 0 && (
              <div className="selected-tags">已选择: {tags.join(", ")}</div>
            )}
          </div>

          {/* Content Editor */}
          <div className="form-section">
            <div className="editor-header-row">
              <label className="form-label">内容</label>
              <div className="editor-mode-switcher">
                <button
                  type="button"
                  className={`mode-btn ${!previewMode ? "active" : ""}`}
                  onClick={() => setPreviewMode(false)}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className={`mode-btn ${previewMode ? "active" : ""}`}
                  onClick={() => setPreviewMode(true)}
                >
                  预览
                </button>
              </div>
            </div>

            <div className="content-editor">
              <div className="editor-toolbar">
                <button type="button" className="toolbar-btn" title="粗体">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                  </svg>
                </button>
                <button type="button" className="toolbar-btn" title="斜体">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="19" y1="4" x2="10" y2="4" />
                    <line x1="14" y1="20" x2="5" y2="20" />
                    <line x1="15" y1="4" x2="9" y2="20" />
                  </svg>
                </button>
                <button type="button" className="toolbar-btn" title="代码">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </button>
                <div className="toolbar-divider" />
                <button type="button" className="toolbar-btn" title="链接">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </button>
                <button type="button" className="toolbar-btn" title="列表">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="editor-content-area">
                {!previewMode ? (
                  <textarea
                    className="content-textarea"
                    placeholder="写下你的内容... 支持 Markdown 格式

**粗体文本**
*斜体文本*
`代码`

- 列表项 1
- 列表项 2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={16}
                  />
                ) : (
                  <div className="content-preview">
                    {content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(content),
                        }}
                      />
                    ) : (
                      <p className="preview-placeholder">预览将在这里显示...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Attachments */}
          <div className="form-section">
            <label className="form-label">
              附件 <span className="label-note">可选</span>
            </label>
            <div className="media-attachments">
              <div className="attachment-row">
                <div className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>上传图片</span>
                  </label>
                </div>

                <div className="upload-area">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicChange}
                    id="music-upload"
                    className="file-input"
                  />
                  <label htmlFor="music-upload" className="upload-btn">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    <span>上传音频</span>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="attachment-preview">
                  <div className="preview-header">
                    <span>图片预览</span>
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={() => {
                        setImagePreview("");
                        setImageUrl("");
                      }}
                    >
                      移除
                    </button>
                  </div>
                  <img
                    src={imagePreview}
                    alt="预览"
                    className="image-preview"
                  />
                </div>
              )}

              {/* Music Preview */}
              {musicUrl && (
                <div className="attachment-preview">
                  <div className="preview-header">
                    <span>音频预览</span>
                    <button
                      type="button"
                      className="remove-attachment"
                      onClick={() => {
                        setMusicUrl("");
                        setMusicTitle("");
                      }}
                    >
                      移除
                    </button>
                  </div>
                  <div className="music-preview-content">
                    <input
                      type="text"
                      placeholder="音频标题"
                      value={musicTitle}
                      onChange={(e) => setMusicTitle(e.target.value)}
                      className="music-title-input"
                    />
                    <audio controls className="audio-preview">
                      <source src={musicUrl} />
                    </audio>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <div className="action-hints">
              <span>支持 Markdown 格式 • 图片和音频可选</span>
            </div>
            <div className="action-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => router.back()}
              >
                取消
              </button>
              <button
                type="submit"
                className="publish-btn"
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  <>
                    <div className="btn-spinner" />
                    发布中...
                  </>
                ) : (
                  "发布话题"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CommunityLayout>
  );
}
