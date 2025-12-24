"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./FloatingNoteButton.css";

export function FloatingNoteButton() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // 在笔记编辑页面和首页不显示
  if (pathname === "/notes/new" || pathname === "/") {
    return null;
  }

  return (
    <div className="floating-note-button-container">
      <Link
        href="/notes/new"
        className="floating-note-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="写新笔记"
      >
        <span className="button-icon">✏️</span>
        <span className={`button-text ${isHovered ? "visible" : ""}`}>
          写笔记
        </span>
      </Link>
    </div>
  );
}
