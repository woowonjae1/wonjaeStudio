"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsChecking(false);
        }
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router, isLoginPage]);

  // Login page doesn't need the admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
