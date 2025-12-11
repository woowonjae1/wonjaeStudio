"use client";

import { useRouter } from "next/navigation";
import { IconLogout, IconUser } from "@tabler/icons-react";
import "./AdminHeader.css";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="admin-header">
      <h1 className="header-title">{title}</h1>

      <div className="header-actions">
        <div className="user-info">
          <IconUser size={18} />
          <span>管理员</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <IconLogout size={18} />
          <span>退出</span>
        </button>
      </div>
    </header>
  );
}
