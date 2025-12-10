"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
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
import "../../community.css";
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
  const [submitting, setSubmitting] = useState(false);

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

  if (!post) {
    return (
      <div className="community-page">
        <Navbar />
        <div className="post-layout">
          <div className="post-container">
            <p style={{ color: "rgba(255,255,255,0.5)" }}>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <Navbar />

      <div className="post-layout">
        <div className="post-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <button onClick={() => router.push("/community")}>
              ← 返回话题列表
            </button>
          </div>

          {/* Post */}
          <article className="post-article">
            <header className="post-header">
              <h1>{post.title}</h1>
              <div className="post-meta">
                <span className="meta-category">
                  {categories[post.category] || post.category}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="meta-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="meta-tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </>
                )}
                <span>·</span>
                <span>{post.author}</span>
                <span>·</span>
                <span>{formatTime(post.createdAt)}</span>
                <span>·</span>
                <span>{post.views} 浏览</span>
              </div>
            </header>

            <div className="post-body">
              {post.content
                .split("\n")
                .map((line, i) =>
                  line ? <p key={i}>{line}</p> : <br key={i} />
                )}
            </div>
          </article>

          {/* Replies */}
          <section className="replies-section">
            <h2>{replies.length} 条回复</h2>

            {replies.map((reply, index) => (
              <div key={reply.id} className="reply-item">
                <div className="reply-header">
                  <span className="reply-author">{reply.author}</span>
                  <span className="reply-meta">
                    #{index + 1} · {formatTime(reply.createdAt)}
                  </span>
                </div>
                <div className="reply-body">
                  {reply.content
                    .split("\n")
                    .map((line, i) =>
                      line ? <p key={i}>{line}</p> : <br key={i} />
                    )}
                </div>
              </div>
            ))}

            {replies.length === 0 && (
              <p className="no-replies">暂无回复，来发表第一条吧</p>
            )}
          </section>

          {/* Reply Form */}
          <section className="reply-form">
            {user && (
              <div className="form-user">
                以 <strong>{user.username}</strong> 身份回复
              </div>
            )}
            <textarea
              placeholder="输入回复内容..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
            <div className="form-actions">
              <button
                className="submit-btn"
                disabled={!replyText.trim() || submitting}
                onClick={handleSubmitReply}
              >
                {submitting ? "发布中..." : "发布回复"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
