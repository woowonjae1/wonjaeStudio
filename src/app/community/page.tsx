"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommunityLayout from "@/components/CommunityLayout";
import CommunityTopTabs from "@/components/CommunityLayout/CommunityTopTabs";
import { getPosts, Post, formatTime } from "@/lib/communityStorage";
import "./community.css";

export const dynamic = "force-dynamic";

const categories: Record<string, string> = {
  production: "编曲",
  mixing: "混音",
  plugins: "插件",
  showcase: "作品",
  help: "问答",
};

const POSTS_PER_PAGE = 20;

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "activity">(
    "latest"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy]);

  const loadPosts = async () => {
    setLoading(true);
    const category = selectedCategory === "all" ? undefined : selectedCategory;
    const posts = await getPosts(category, sortBy);
    setAllPosts(posts);
    setLoading(false);
  };

  const handleSortChange = async (
    newSort: "latest" | "popular" | "activity"
  ) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <CommunityLayout
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
    >
      <CommunityTopTabs
        activeTab={sortBy}
        onTabChange={(tab) =>
          handleSortChange(tab as "latest" | "popular" | "activity")
        }
      />

      {/* Topics Table - Discourse Style */}
      <div className="topics-table">
        <div className="table-header">
          <span className="col-topic">话题</span>
          <span className="col-replies">回复</span>
          <span className="col-views">浏览</span>
          <span className="col-activity">活动</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>加载中...</span>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>暂无话题</p>
            <span>成为第一个发起讨论的人</span>
            <Link href="/community/new" className="empty-state-btn">
              创建新话题
            </Link>
          </div>
        ) : (
          paginatedPosts.map((post) => (
            <Link
              href={`/community/post/${post.id}`}
              key={post.id}
              className={`topic-row ${post.pinned ? "pinned" : ""}`}
            >
              <div className="col-topic">
                <div className="topic-avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="topic-content">
                  <div className="topic-title-row">
                    {post.pinned && <span className="pinned-badge">置顶</span>}
                    <span className="topic-title">{post.title}</span>
                  </div>
                  <div className="topic-meta">
                    <span
                      className="category-pill"
                      data-category={post.category}
                    >
                      {categories[post.category] || post.category}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="topic-tags">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="topic-tag">
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="topic-author">{post.author}</span>
                  </div>
                </div>
              </div>
              <span className="col-replies">
                <span className="stat-value">{post.replies}</span>
              </span>
              <span className="col-views">
                <span className="stat-value">{post.views}</span>
              </span>
              <span className="col-activity">
                <span className="activity-time">
                  {formatTime(post.createdAt)}
                </span>
              </span>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`page-num ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Floating New Topic Button */}
      <Link href="/community/new" className="floating-new-topic-btn">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>新话题</span>
      </Link>
    </CommunityLayout>
  );
}
