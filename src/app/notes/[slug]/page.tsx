"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Tag as TagIcon, Trash2 } from "lucide-react";
import { getNoteById, deleteNote, Note } from "@/lib/notesStorage";
import { Locale, getStoredLocale } from "@/lib/i18n";

export default function NotePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    const foundNote = getNoteById(params.slug);
    if (!foundNote) {
      router.push("/");
    } else {
      setNote(foundNote);
    }

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
  }, [params.slug, router]);

  const handleDelete = () => {
    const confirmMsg =
      locale === "zh"
        ? "确定要删除这篇文章吗？"
        : "Are you sure you want to delete this note?";
    if (confirm(confirmMsg)) {
      deleteNote(params.slug);
      router.push("/");
    }
  };

  const getNoteCategory = () => {
    if (!note) return "music";
    const tags = note.tags.map((t) => t.toLowerCase());
    const englishKeywords = [
      "english",
      "英语",
      "vocabulary",
      "grammar",
      "单词",
      "语法",
    ];
    return englishKeywords.some((kw) => tags.some((tag) => tag.includes(kw)))
      ? "english"
      : "music";
  };

  if (!mounted || !note) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">
          {locale === "zh" ? "加载中..." : "Loading..."}
        </p>
      </div>
    );
  }

  const category = getNoteCategory();

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
            onClick={handleDelete}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">
              {locale === "zh" ? "删除" : "Delete"}
            </span>
          </button>
        </div>

        {/* 文章头部 */}
        <header className="mb-12">
          {/* 分类标签 */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                category === "english"
                  ? "bg-[var(--tag-english-bg)] text-[var(--tag-english-text)]"
                  : "bg-[var(--tag-music-bg)] text-[var(--tag-music-text)]"
              }`}
            >
              {category === "english"
                ? locale === "zh"
                  ? "英语"
                  : "English"
                : locale === "zh"
                  ? "音乐"
                  : "Music"}
            </span>
          </div>

          <h1 className="text-4xl font-medium text-[var(--text-primary)] mb-6 tracking-tight">
            {note.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)] mb-6">
            <time className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(note.createdAt).toLocaleDateString(
                locale === "zh" ? "zh-CN" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </time>
            <span>
              {note.content.replace(/\s/g, "").length}{" "}
              {locale === "zh" ? "字" : "chars"}
            </span>
          </div>

          {/* 标签 */}
          {note.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-4 h-4 text-[var(--text-muted)]" />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <article>
          <div className="text-[var(--text-primary)] text-lg leading-relaxed whitespace-pre-wrap">
            {note.content}
          </div>
        </article>

        {/* 底部信息 */}
        <footer className="mt-16 pt-8 border-t border-[var(--border-light)]">
          <p className="text-xs text-[var(--text-muted)]">
            {locale === "zh" ? "最后更新于" : "Last updated"}{" "}
            {new Date(note.updatedAt).toLocaleDateString(
              locale === "zh" ? "zh-CN" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}
