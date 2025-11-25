"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "首页",
      href: "/",
      icon: (
        <svg
          className="sidebar-nav-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
        </svg>
      ),
    },
    {
      name: "搜索",
      href: "/search",
      icon: (
        <svg
          className="sidebar-nav-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" />
        </svg>
      ),
    },
    {
      name: "音乐库",
      href: "/music",
      icon: (
        <svg
          className="sidebar-nav-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
        </svg>
      ),
    },
  ];

  const playlists = [
    { name: "我喜欢的音乐", href: "#" },
    { name: "最近播放", href: "#" },
    { name: "R&B精选", href: "#" },
    { name: "深夜电台", href: "#" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <Link href="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "#000" }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <span className="sidebar-logo-text">WooWonJae</span>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${pathname === item.href ? "active" : ""}`}
          >
            {item.icon}
            <span className="sidebar-nav-text">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Playlists */}
      {!collapsed && (
        <div className="sidebar-playlists">
          <div className="sidebar-playlists-header">播放列表</div>
          {playlists.map((playlist, index) => (
            <Link
              key={index}
              href={playlist.href}
              className="sidebar-playlist-item"
            >
              <div className="sidebar-playlist-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  <path d="M2.5 3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v17a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-17zm6 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v17a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5v-17zm6.5-.5a.5.5 0 0 0-.5.5v6a2.5 2.5 0 1 0 4 0V3.5a.5.5 0 0 0-.5-.5h-3z" />
                </svg>
              </div>
              <span className="sidebar-playlist-text">{playlist.name}</span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
