"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserIdentity, UserIdentity } from "@/lib/userIdentity";

interface CommunityHeaderProps {
  user: UserIdentity | null;
  onEditProfile?: () => void;
}

export default function CommunityHeader({
  user,
  onEditProfile,
}: CommunityHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/community?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <header className="discourse-header">
      <div className="header-container">
        {/* Logo / Brand */}
        <Link href="/community" className="header-brand">
          <span className="brand-text">音乐社区</span>
        </Link>

        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="搜索话题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="header-actions">
          {/* New Topic Button */}
          <button
            className="new-topic-btn"
            onClick={() => router.push("/community/new")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>新话题</span>
          </button>

          {/* Notifications */}
          <button className="header-icon-btn" title="通知">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* User Menu */}
          <div className="user-menu-wrapper">
            <button
              className="header-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user ? (
                <span className="avatar-letter">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <span className="dropdown-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                      <div className="dropdown-user-info">
                        <span className="dropdown-username">
                          {user.username}
                        </span>
                        <span className="dropdown-badge">成员</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={onEditProfile}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      编辑资料
                    </button>
                    <Link href="/" className="dropdown-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      返回首页
                    </Link>
                  </>
                ) : (
                  <div className="dropdown-item">请先设置昵称</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
