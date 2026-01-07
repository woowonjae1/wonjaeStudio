"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { saveNote } from "@/lib/notesStorage";
import { Locale, getStoredLocale } from "@/lib/i18n";

type NoteCategory = "music" | "english";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState<NoteCategory>("music");
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };
    window.addEventListener(
      "localeChange",
      handleLocaleChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "localeChange",
        handleLocaleChange as EventListener
      );
    };
  }, []);

  // 自动保存草稿
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem(
          "draft",
          JSON.stringify({ title, content, tags, category })
        );
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, tags, category]);

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      const parsed = JSON.parse(draft);
      setTitle(parsed.title || "");
      setContent(parsed.content || "");
      setTags(parsed.tags || []);
      setCategory(parsed.category || "music");
    }
  }, []);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    // 根据分类添加默认标签
    const categoryTag = category === "english" ? "英语" : "音乐";
    const finalTags = tags.includes(categoryTag)
      ? tags
      : [categoryTag, ...tags];

    saveNote({
      title:
        title ||
        `${locale === "zh" ? "无标题" : "Untitled"} ${new Date().toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}`,
      content,
      type: "literature",
      template: "blank",
      tags: finalTags,
      links: [],
      isArchived: false,
    });

    localStorage.removeItem("draft");
    router.push("/");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--border-light)]">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{locale === "zh" ? "返回" : "Back"}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {locale === "zh" ? "发布" : "Publish"}
          </button>
        </div>

        {/* 分类选择 */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setCategory("music")}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "music"
                ? "bg-[var(--tag-music-bg)] text-[var(--tag-music-text)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {locale === "zh" ? "音乐笔记" : "Music"}
          </button>
          <button
            onClick={() => setCategory("english")}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "english"
                ? "bg-[var(--tag-english-bg)] text-[var(--tag-english-text)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {locale === "zh" ? "英语笔记" : "English"}
          </button>
        </div>

        {/* 标题输入 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={locale === "zh" ? "标题" : "Title"}
          className="w-full text-4xl font-medium bg-transparent border-none outline-none placeholder-[var(--text-muted)] text-[var(--text-primary)] mb-8 tracking-tight"
          autoFocus
        />

        {/* 标签 */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder={locale === "zh" ? "添加标签..." : "Add tag..."}
            className="text-sm bg-transparent border-none outline-none placeholder-[var(--text-muted)] text-[var(--text-secondary)] w-32"
          />
        </div>

        {/* 内容编辑器 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={locale === "zh" ? "开始写作..." : "Start writing..."}
          className="w-full min-h-[500px] bg-transparent border-none outline-none resize-none placeholder-[var(--text-muted)] text-[var(--text-primary)] text-lg leading-relaxed"
        />

        {/* 底部提示 */}
        <div className="mt-8 pt-4 border-t border-[var(--border-light)]">
          <p className="text-xs text-[var(--text-muted)]">
            {locale === "zh" ? "自动保存草稿" : "Auto-saving draft"} •{" "}
            {content.replace(/\s/g, "").length}{" "}
            {locale === "zh" ? "字" : "chars"}
          </p>
        </div>
      </div>
    </div>
  );
}
