"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import "./SearchModal.css";

interface SearchResult {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  type: "title" | "content" | "tag";
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 搜索逻辑
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = `/notes/${results[selectedIndex].slug}`;
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 滚动到选中项
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, results.length]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* 搜索输入 */}
        <div className="search-input-wrapper">
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="search-input"
          />
          <kbd className="search-shortcut">ESC</kbd>
        </div>

        {/* 搜索结果 */}
        <div className="search-results" ref={resultsRef}>
          {isLoading ? (
            <div className="search-loading">
              <div className="search-spinner" />
              <span>搜索中...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <Link
                key={result.slug}
                href={`/notes/${result.slug}`}
                className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                onClick={onClose}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="search-result-content">
                  <h3 className="search-result-title">{result.title}</h3>
                  <p className="search-result-summary">{result.summary}</p>
                  <div className="search-result-meta">
                    <span className="search-result-date">{result.date}</span>
                    {result.tags.length > 0 && (
                      <div className="search-result-tags">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="search-result-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="search-result-arrow">→</span>
              </Link>
            ))
          ) : query.trim() ? (
            <div className="search-empty">
              <span className="search-empty-icon">🔍</span>
              <p>未找到相关笔记</p>
              <p className="search-empty-hint">尝试其他关键词</p>
            </div>
          ) : (
            <div className="search-hints">
              <p className="search-hints-title">搜索提示</p>
              <ul className="search-hints-list">
                <li>输入关键词搜索标题和内容</li>
                <li>使用 ↑↓ 键选择结果</li>
                <li>按 Enter 打开笔记</li>
              </ul>
            </div>
          )}
        </div>

        {/* 底部快捷键提示 */}
        <div className="search-footer">
          <div className="search-footer-item">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>导航</span>
          </div>
          <div className="search-footer-item">
            <kbd>Enter</kbd>
            <span>打开</span>
          </div>
          <div className="search-footer-item">
            <kbd>ESC</kbd>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
