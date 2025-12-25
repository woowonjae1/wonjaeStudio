"use client";

import React, { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import "./SearchButton.css";

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  // 全局快捷键 ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="search-button"
        aria-label="搜索"
      >
        <svg
          className="search-button-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="search-button-text">搜索</span>
        <kbd className="search-button-shortcut">
          <span className="search-button-shortcut-key">⌘</span>
          <span className="search-button-shortcut-key">K</span>
        </kbd>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
