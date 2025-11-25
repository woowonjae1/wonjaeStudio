"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 导航项组件 - 使用 React.memo 优化
const NavItem = React.memo(
  ({
    name,
    path,
    isActive,
  }: {
    name: string;
    path: string;
    isActive: boolean;
  }) => (
    <Link
      href={path}
      className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
        isActive
          ? "bg-[var(--bg-elevated-highlight)] text-[var(--text-base)]"
          : "text-[var(--text-subdued)] hover:text-[var(--text-base)] hover:bg-[var(--bg-elevated)]"
      }`}
    >
      {name}
    </Link>
  )
);

NavItem.displayName = "NavItem";

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // 优化滚动监听 - 使用 useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navItems = [
    { name: "首页", path: "/" },
    { name: "音乐", path: "/music" },
    { name: "关于", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--bg-base)] bg-opacity-95 backdrop-blur-md border-b border-[var(--decorative-subdued)] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-[var(--spotify-green)] transition-colors"
          >
            WOOWONJAE
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                name={item.name}
                path={item.path}
                isActive={pathname === item.path}
              />
            ))}
          </div>

          {/* Right side - 可以添加搜索或用户菜单 */}
          <div className="w-32" />
        </div>
      </div>
    </nav>
  );
}
