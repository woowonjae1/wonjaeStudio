"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUserIdentity, UserIdentity } from "@/lib/userIdentity";
import { getPosts, Post, formatTime } from "@/lib/communityStorage";
import "./community.css";

export const dynamic = "force-dynamic";

const categories = [
  { id: "all", name: "全部" },
  { id: "production", name: "编曲" },
  { id: "mixing", name: "混音" },
  { id: "plugins", name: "插件" },
  { id: "showcase", name: "作品" },
  { id: "help", name: "问答" },
];

export default function CommunityPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setUser(getUserIdentity());
    getPosts().then(setPosts);
  }, []);

  const filteredPosts = posts.filter(
    (post) => selectedCategory === "all" || post.category === selectedCategory
  );

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const getCategoryCount = (id: string) => {
    if (id === "all") return posts.length;
    return posts.filter((p) => p.category === id).length;
  };

  return (
    <div className="community-page">
      <Navbar />

      <div className="community-layout">
        {/* Sidebar */}
        <aside className="community-sidebar">
          <button className="back-btn" onClick={() => router.push("/")}>
            ← 返回首页
          </button>

          <div className="sidebar-block">
            <Link href="/community/new" className="new-topic-btn">
              + 新话题
            </Link>
          </div>

          <nav className="sidebar-nav">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`nav-item ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="nav-name">{cat.name}</span>
                <span className="nav-count">{getCategoryCount(cat.id)}</span>
              </button>
            ))}
          </nav>

          {user && (
            <div className="sidebar-user">
              <span className="user-initial">{user.username[0]}</span>
              <span className="user-name">{user.username}</span>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="community-main">
          <header className="main-header">
            <h1>话题</h1>
            <div className="header-tabs">
              <button className="tab active">最新</button>
              <button className="tab">热门</button>
            </div>
          </header>

          <div className="topics-table">
            <div className="table-header">
              <span className="col-topic">话题</span>
              <span className="col-replies">回复</span>
              <span className="col-views">浏览</span>
              <span className="col-activity">活动</span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="empty-state">暂无话题</div>
            ) : (
              filteredPosts.map((post) => (
                <Link
                  href={`/community/post/${post.id}`}
                  key={post.id}
                  className="topic-row"
                >
                  <div className="col-topic">
                    {post.pinned && <span className="pinned-icon">📌</span>}
                    <div className="topic-content">
                      <span className="topic-title">{post.title}</span>
                      <span className="topic-meta">
                        <span className="topic-category">
                          {getCategoryName(post.category)}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <span className="topic-tags">
                            {post.tags.map((tag) => (
                              <span key={tag} className="topic-tag">
                                {tag}
                              </span>
                            ))}
                          </span>
                        )}
                        <span className="topic-author">{post.author}</span>
                      </span>
                    </div>
                  </div>
                  <span className="col-replies">{post.replies}</span>
                  <span className="col-views">{post.views}</span>
                  <span className="col-activity">
                    {formatTime(post.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
