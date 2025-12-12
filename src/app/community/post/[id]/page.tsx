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
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string>("");

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
      user.id,
      replyingTo || undefined
    );
    setReplies([...replies, newReply]);
    setReplyText("");
    setPastedImages([]);
    setReplyingTo(null);
    setReplyingToAuthor("");
    setSubmitting(false);
  };

  const handleReplyToComment = (replyId: number, authorName: string) => {
    setReplyingTo(replyId);
    setReplyingToAuthor(authorName);
    // 滚动到回复框
    const replyEditor = document.querySelector(".reply-editor-simple");
    if (replyEditor) {
      replyEditor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyingToAuthor("");
    setReplyText("");
  };

  const handleEmojiSelect = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
  };

  const uploadImage = async (file: File): Promise<string> => {
    // 创建一个简单的本地URL用于演示
    // 在实际应用中，你需要上传到云存储服务
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 处理图片粘贴
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setPastedImages((prev) => [...prev, imageUrl]);
      setReplyText((prev) => prev + `\n![图片](${imageUrl})\n`);
    } catch (error) {
      console.error("图片上传失败:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    for (const file of imageFiles) {
      await handleImageUpload(file);
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // 检查是否是图片链接
      const imageMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        return (
          <div key={i} className="content-image">
            <img src={imageMatch[1]} alt="用户上传的图片" />
          </div>
        );
      }

      // 检查是否是链接
      const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (linkMatch) {
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{
              __html: line.replace(
                linkMatch[0],
                `<a href="${linkMatch[0]}" target="_blank" rel="noopener noreferrer">${linkMatch[0]}</a>`
              ),
            }}
          />
        );
      }

      return line ? <p key={i}>{line}</p> : <br key={i} />;
    });
  };

  // 组织嵌套回复结构
  const organizeReplies = (replies: Reply[]) => {
    const topLevel = replies.filter((reply) => !reply.parentId);
    const nested = replies.filter((reply) => reply.parentId);

    return topLevel.map((reply) => ({
      ...reply,
      children: nested.filter((child) => child.parentId === reply.id),
    }));
  };

  const organizedReplies = organizeReplies(replies);

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
      {/* Simplified Header */}
      <div className="post-header-simple">
        <Link href="/community" className="back-link">
          ← 返回社区
        </Link>
        <div className="post-meta-simple">
          <span className="category-pill" data-category={post.category}>
            {categories[post.category] || post.category}
          </span>
          <span className="post-stats-simple">
            {post.views} 浏览 · {replies.length} 回复
          </span>
        </div>
      </div>

      <h1 className="post-title-simple">{post.title}</h1>

      {/* Simplified Main Post */}
      <article className="main-post-simple">
        <div className="post-author-info">
          <div className="author-avatar">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className="author-details">
            <span className="author-name">{post.author}</span>
            <span className="post-time">{formatTime(post.createdAt)}</span>
          </div>
        </div>

        <div className="post-content-simple">
          {post.imageUrl && (
            <div className="post-image">
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}

          {post.musicUrl && (
            <div className="post-audio">
              <div className="audio-title">{post.musicTitle || "音频文件"}</div>
              <audio controls>
                <source src={post.musicUrl} />
              </audio>
            </div>
          )}

          <div className="post-text">{renderContent(post.content)}</div>
        </div>

        <div className="post-actions-simple">
          <button className="action-btn-simple">👍 赞</button>
          <button className="action-btn-simple">💬 回复</button>
          <button className="action-btn-simple">📤 分享</button>
        </div>
      </article>

      {/* Simplified Replies */}
      <div className="replies-section">
        <h3 className="replies-title">
          {replies.length > 0 ? `${replies.length} 条回复` : "暂无回复"}
        </h3>

        {organizedReplies.map((reply, index) => (
          <div key={reply.id} className="reply-thread">
            {/* 主回复 */}
            <div className="reply-simple">
              <div className="reply-header">
                <div className="reply-avatar">
                  {reply.author.charAt(0).toUpperCase()}
                </div>
                <div className="reply-info">
                  <span className="reply-author">{reply.author}</span>
                  <span className="reply-time">
                    {formatTime(reply.createdAt)}
                  </span>
                  <span className="reply-number">#{index + 1}</span>
                </div>
              </div>

              <div className="reply-content">
                {renderContent(reply.content)}
              </div>

              <div className="reply-actions">
                <button className="reply-action-btn">👍</button>
                <button
                  className="reply-action-btn"
                  onClick={() => handleReplyToComment(reply.id, reply.author)}
                >
                  💬 回复
                </button>
              </div>
            </div>

            {/* 嵌套回复 */}
            {reply.children && reply.children.length > 0 && (
              <div className="nested-replies">
                {reply.children.map((childReply, childIndex) => (
                  <div key={childReply.id} className="reply-simple nested">
                    <div className="reply-header">
                      <div className="reply-avatar small">
                        {childReply.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="reply-info">
                        <span className="reply-author">
                          {childReply.author}
                        </span>
                        <span className="reply-time">
                          {formatTime(childReply.createdAt)}
                        </span>
                        <span className="reply-to">回复 @{reply.author}</span>
                      </div>
                    </div>

                    <div className="reply-content">
                      {renderContent(childReply.content)}
                    </div>

                    <div className="reply-actions">
                      <button className="reply-action-btn">👍</button>
                      <button
                        className="reply-action-btn"
                        onClick={() =>
                          handleReplyToComment(childReply.id, childReply.author)
                        }
                      >
                        💬 回复
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simplified Reply Editor */}
      <div className="reply-editor-simple">
        {replyingTo && (
          <div className="replying-to-info">
            <span>正在回复 @{replyingToAuthor}</span>
            <button className="cancel-reply-btn" onClick={cancelReply}>
              ✕
            </button>
          </div>
        )}

        {user && (
          <div className="editor-user-simple">
            <div className="user-avatar-simple">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>
              以 {user.username} 身份
              {replyingTo ? `回复 @${replyingToAuthor}` : "回复"}
            </span>
          </div>
        )}

        <div className="textarea-container">
          <textarea
            className={`reply-textarea-simple ${dragOver ? "drag-over" : ""}`}
            placeholder="写下你的回复... 支持粘贴图片和链接，也可以拖拽图片到这里"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onPaste={handlePaste}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            rows={4}
          />
          {uploading && (
            <div className="upload-indicator">
              <div className="upload-spinner" />
              <span>上传图片中...</span>
            </div>
          )}
        </div>

        {/* 预览粘贴的图片 */}
        {pastedImages.length > 0 && (
          <div className="pasted-images-preview">
            <div className="preview-title">已添加的图片:</div>
            <div className="images-grid">
              {pastedImages.map((imageUrl, index) => (
                <div key={index} className="preview-image">
                  <img src={imageUrl} alt={`预览图片 ${index + 1}`} />
                  <button
                    className="remove-image-btn"
                    onClick={() => {
                      setPastedImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setReplyText((prev) =>
                        prev.replace(`![图片](${imageUrl})`, "")
                      );
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="editor-hints">
          <span>
            💡 提示: 可以直接粘贴图片和链接 (Ctrl+V)，或拖拽图片到输入框
          </span>
        </div>

        <div className="reply-actions-simple">
          <button
            className="reply-submit-btn"
            disabled={!replyText.trim() || submitting}
            onClick={handleSubmitReply}
          >
            {submitting ? "发布中..." : "发布回复"}
          </button>
        </div>
      </div>

      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </CommunityLayout>
  );
}
