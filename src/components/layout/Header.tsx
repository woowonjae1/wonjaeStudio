"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchButton } from "@/components/search";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 站点标题 */}
          <Link
            href="/"
            className="text-xl font-semibold text-foreground hover:text-foreground/80 transition-colors border-none hover:bg-transparent"
          >
            WOOWONJAE
          </Link>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              Home
            </Link>
            <Link
              href="/notes"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              Notes
            </Link>
            <Link
              href="/topics"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              Topics
            </Link>
            <Link
              href="/music"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
            >
              Music
            </Link>
            <SearchButton />
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/notes"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Notes
              </Link>
              <Link
                href="/topics"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Topics
              </Link>
              <Link
                href="/music"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border-none hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Music
              </Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};
