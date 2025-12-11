"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconMusic,
  IconMessage,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import "./AdminSidebar.css";

const navItems = [
  { href: "/admin", label: "仪表盘", icon: IconDashboard },
  { href: "/admin/music", label: "音乐管理", icon: IconMusic },
  { href: "/admin/community", label: "社区管理", icon: IconMessage },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
      </button>

      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <IconMusic size={28} />
          <span>后台管理</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
