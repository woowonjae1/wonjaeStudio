"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import CommunityLayout from "@/components/CommunityLayout";
import EmojiPicker from "@/components/EmojiPicker";
import { getUserIdentity, UserIdentity } from "@/lib/userIdentity";
import {
  getPost,
  getReplies,
  addReply,
  incrementViews,
  Post,
  Reply,
  formatTime,
} from "@/lib/communityStorage";
import "./post.css";

const categories: Record<string, string> = {
  production: "编曲",
  mixing: "混音",
  plugins: "插件",
  showcase: "作品",
  help: "问答",
};

export default function PostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [user, setUser] = useState<UserIdentity | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setUser(getUserIdentity());

    const loadData = async () => {
      const postData = await getPost(postId);
      if (postData) {
        setPost(postData);
        const repliesData = await getReplies(postId);
        setReplies(repliesData);
        incrementViews(postId);
      }
    };

    loadData();
  }, [postId]);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !user) return;

    setSubmitting(true);
    const newReply = await addReply(
      postId,
      user.username,
      replyText.trim(),
      user.id
    );
    setReplies([...replies, newReply]);
    setReplyText("");
    setSubmitting(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
  };

  if (!post) {
    return (
      <CommunityLayout showSidebars={false}>
        <div className="post-loading">
          <div className="loading-spinner" />
          <span>加载中...</span>
        </div>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout showSidebars={false}>
      {/* Progress Bar */}
      <div className="thread-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "20%" }} />
        </div>
        <span className="progress-text">1 / {replies.length + 1}</span>
      </div>

      {/* Breadcrumb */}
      <nav className="post-breadcrumb">
        <Link href="/" className="breadcrumb-link">
          首页
        </Link>
        <span className="breadcrumb-sep">/</span>
        <Link href="/community" className="breadcrumb-link">
          社区
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{post.title}</span>
      </nav>

      {/* Post Header */}
      <header className="post-page-header">
        <h1 className="post-page-title">{post.title}</h1>
        <div className="post-page-meta">
          <span className="category-pill" data-category={post.category}>
            {categories[post.category] || post.category}
          </span>
          {post.tags && post.tags.length > 0 && (
            <span className="meta-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="meta-tag">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>

      {/* Thread Container */}
      <div className="thread-container">
        {/* Original Post */}
        <article className="thread-post original-post">
          <div className="post-sidebar">
            <div className="post-avatar">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div className="post-meta-sidebar">
              <div className="post-author">{post.author}</div>
              <div className="post-time">{formatTime(post.createdAt)}</div>
              <div className="post-stats">
                <span>{post.views} 浏览</span>
              </div>
            </div>
          </div>

          <div className="post-content-area">
            {post.imageUrl && (
              <div className="post-media">
                <img src={post.imageUrl} alt={post.title} />
              </div>
            )}

            {post.musicUrl && (
              <div className="post-music-player">
                <div className="music-info">
                  <span className="music-name">
                    {post.musicTitle || "音频文件"}
                  </span>
                </div>
                <audio controls>
                  <source src={post.musicUrl} />
                </audio>
              </div>
            )}

            <div className="post-content">
              {post.content
                .split("\n")
                .map((line, i) =>
                  line ? <p key={i}>{line}</p> : <br key={i} />
                )}
            </div>

            <div className="post-actions">
              <button className="action-btn like-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 10v12l5-3 5 3V10" />
                  <path d="M12 2L9.09 8.26l-6.91 1L7 14l-1.27 6.74L12 17.77l6.27 3.23L17 14l4.82-4.74-6.91-1L12 2z" />
                </svg>
                <span>赞</span>
              </button>
              <button className="action-btn reply-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>回复</span>
              </button>
              <button className="action-btn share-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>分享</span>
              </button>
            </div>
          </div>
        </article>

        {/* Replies */}
        {replies.map((reply, index) => (
          <article key={reply.id} className="thread-post reply-post">
            <div className="post-sidebar">
              <div className="post-avatar small">
                {reply.author.charAt(0).toUpperCase()}
              </div>
              <div className="post-meta-sidebar">
                <div className="post-author">{reply.author}</div>
                <div className="post-time">{formatTime(reply.createdAt)}</div>
                <div className="post-number">#{index + 1}</div>
              </div>
            </div>

            <div className="post-content-area">
              <div className="post-content">
                {reply.content
                  .split("\n")
                  .map((line, i) =>
                    line ? <p key={i}>{line}</p> : <br key={i} />
                  )}
              </div>

              <div className="post-actions">
                <button className="action-btn like-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 10v12l5-3 5 3V10" />
                  </svg>
                  <span>赞</span>
                </button>
                <button className="action-btn reply-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>回复</span>
                </button>
              </div>
            </div>
          </article>
        ))}

        {replies.length === 0 && (
          <div className="no-replies">
            <p>暂无回复，来发表第一条吧</p>
          </div>
        )}
      </div>

      {/* Modern Reply Editor */}
      <section className="modern-reply-editor">
        <div className="editor-header">
          {user && (
            <div className="editor-user-info">
              <div className="editor-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span>
                以 <strong>{user.username}</strong> 身份回复
              </span>
            </div>
          )}
          <div className="editor-mode-toggle">
            <button
              className={`mode-btn ${!previewMode ? "active" : ""}`}
              onClick={() => setPreviewMode(false)}
            >
              编辑
            </button>
            <button
              className={`mode-btn ${previewMode ? "active" : ""}`}
              onClick={() => setPreviewMode(true)}
            >
              预览
            </button>
          </div>
        </div>

        <div className="editor-container">
          <div className="editor-toolbar">
            <button className="toolbar-btn" title="粗体">
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
            <button className="toolbar-btn" title="斜体">
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
            <button className="toolbar-btn" title="代码">
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
            <button className="toolbar-btn" title="上传文件">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button
              className="toolbar-btn emoji-trigger"
              onClick={() => setShowEmojiPicker(true)}
              title="表情"
            >
              😊
            </button>
          </div>

          <div className="editor-content">
            {!previewMode ? (
              <textarea
                className="editor-textarea"
                placeholder="写下你的回复... 支持 Markdown 格式"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
              />
            ) : (
              <div className="editor-preview">
                {replyText ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(replyText),
                    }}
                  />
                ) : (
                  <p className="preview-placeholder">预览将在这里显示...</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="editor-footer">
          <div className="editor-hints">
            <span>支持 **粗体** *斜体* `代码` 格式</span>
          </div>
          <div className="editor-actions">
            <button
              className="cancel-reply-btn"
              onClick={() => setReplyText("")}
            >
              取消
            </button>
            <button
              className="submit-reply-btn"
              disabled={!replyText.trim() || submitting}
              onClick={handleSubmitReply}
            >
              {submitting ? "发布中..." : "发布回复"}
            </button>
          </div>
        </div>
      </section>

      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </CommunityLayout>
  );
}
