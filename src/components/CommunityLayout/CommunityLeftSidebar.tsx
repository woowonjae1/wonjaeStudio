"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPosts } from "@/lib/communityStorage";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CommunityLeftSidebarContentProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

function CommunityLeftSidebarContent({
  selectedCategory = "all",
  onCategoryChange,
}: CommunityLeftSidebarContentProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "全部话题", icon: "", count: 0 },
    { id: "production", name: "编曲", icon: "", count: 0 },
    { id: "mixing", name: "混音", icon: "", count: 0 },
    { id: "plugins", name: "插件", icon: "", count: 0 },
    { id: "showcase", name: "作品", icon: "", count: 0 },
    { id: "help", name: "问答", icon: "", count: 0 },
  ]);

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      const posts = await getPosts();
      const counts: Record<string, number> = {};

      posts.forEach((post) => {
        counts[post.category] = (counts[post.category] || 0) + 1;
      });

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          count: cat.id === "all" ? posts.length : counts[cat.id] || 0,
        }))
      );
    } catch (error) {
      console.error("Failed to load category counts:", error);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange?.(categoryId);
  };

  return (
    <>
      <div className="sidebar-section">
        <h3 className="sidebar-title">分类</h3>
        <nav className="sidebar-nav">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`nav-item ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="nav-icon">{category.icon}</span>
              <span className="nav-label">{category.name}</span>
              <span className="nav-count">{category.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">快捷入口</h3>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => router.push("/")}>
            <span className="nav-icon"></span>
            <span className="nav-label">返回首页</span>
          </button>
          <button
            className="nav-item"
            onClick={() => router.push("/tutorials")}
          >
            <span className="nav-icon"></span>
            <span className="nav-label">教程中心</span>
          </button>
        </nav>
      </div>
    </>
  );
}

function SidebarFallback() {
  return (
    <>
      <div className="sidebar-section">
        <h3 className="sidebar-title">分类</h3>
        <nav className="sidebar-nav">
          <div className="nav-item">
            <span className="nav-label">加载中...</span>
          </div>
        </nav>
      </div>
    </>
  );
}

interface CommunityLeftSidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CommunityLeftSidebar({
  selectedCategory,
  onCategoryChange,
}: CommunityLeftSidebarProps) {
  return (
    <aside className="community-left-sidebar">
      <Suspense fallback={<SidebarFallback />}>
        <CommunityLeftSidebarContent
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </Suspense>
    </aside>
  );
}
