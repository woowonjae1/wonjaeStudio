"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchButton } from "@/components/search";
import { ThemeToggle } from "@/components/theme";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-nav">
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* 站点标题 - 纯文字 */}
          <Link href="/" className="header-logo">
            WOOWONJAE
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="nav-link">
              首页
            </Link>
            <Link href="/notes" className="nav-link">
              笔记
            </Link>
            <Link href="/topics" className="nav-link">
              主题
            </Link>
            <Link href="/music" className="nav-link">
              音乐
            </Link>

            <span className="nav-divider" />

            <SearchButton />
            <ThemeToggle />
          </nav>

          {/* 移动端菜单按钮 - 文字 */}
          <button
            className="md:hidden nav-link"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="菜单"
          >
            {isMenuOpen ? "关闭" : "菜单"}
          </button>
        </div>

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <nav className="md:hidden mobile-nav">
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/notes"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              笔记
            </Link>
            <Link
              href="/topics"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              主题
            </Link>
            <Link
              href="/music"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              音乐
            </Link>
            <div className="mobile-nav-footer">
              <SearchButton />
              <ThemeToggle />
            </div>
          </nav>
        )}
      </Container>

      <style jsx>{`
        .header-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(8px);
        }

        .header-logo {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .header-logo:hover {
          text-decoration: none;
          opacity: 0.8;
        }

        .nav-link {
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 6px;
          transition:
            color 0.2s,
            background 0.2s;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
          text-decoration: none;
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: var(--border-color);
          margin: 0 8px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 16px 0;
          border-top: 1px solid var(--border-color);
        }

        .mobile-nav-link {
          padding: 12px 0;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
        }

        .mobile-nav-link:hover {
          text-decoration: none;
        }

        .mobile-nav-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          margin-top: 8px;
        }
      `}</style>
    </header>
  );
};
