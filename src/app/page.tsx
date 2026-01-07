"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getAllNotes, Note } from "@/lib/notesStorage";
import { translations, Locale, getStoredLocale } from "@/lib/i18n";

type Category = "all" | "music" | "english";

function HomeContent() {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  const t = translations[locale];

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    const allNotes = getAllNotes();
    setNotes(allNotes.filter((n) => !n.isArchived));

    // 从 URL 获取分类
    const urlCategory = searchParams.get("category");
    if (urlCategory === "music" || urlCategory === "english") {
      setCategory(urlCategory);
    }

    // 监听语言变化
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
  }, [searchParams]);

  const getCategoryForNote = useCallback((note: Note): Category => {
    const tags = note.tags.map((t) => t.toLowerCase());
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();

    // 英语相关关键词
    const englishKeywords = [
      "english",
      "英语",
      "vocabulary",
      "grammar",
      "单词",
      "语法",
      "阅读",
      "writing",
      "listening",
    ];
    // 音乐相关关键词
    const musicKeywords = [
      "music",
      "音乐",
      "乐理",
      "和声",
      "节奏",
      "制作",
      "歌曲",
      "专辑",
      "听歌",
      "r&b",
      "jazz",
      "hip-hop",
    ];

    const isEnglish = englishKeywords.some(
      (kw) =>
        tags.some((tag) => tag.includes(kw)) ||
        title.includes(kw) ||
        content.slice(0, 200).includes(kw)
    );

    const isMusic = musicKeywords.some(
      (kw) =>
        tags.some((tag) => tag.includes(kw)) ||
        title.includes(kw) ||
        content.slice(0, 200).includes(kw)
    );

    if (isEnglish && !isMusic) return "english";
    if (isMusic && !isEnglish) return "music";
    return "music"; // 默认归类为音乐
  }, []);

  const filteredNotes = notes.filter((note) => {
    // 分类筛选
    if (category !== "all") {
      const noteCategory = getCategoryForNote(note);
      if (noteCategory !== category) return false;
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "zh" ? "zh-CN" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getCategoryLabel = (noteCategory: Category) => {
    if (noteCategory === "english") return locale === "zh" ? "英语" : "English";
    return locale === "zh" ? "音乐" : "Music";
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <header className="mb-16">
          <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide mb-6">
            {t.home.subtitle}
          </p>
          <h1 className="text-4xl md:text-5xl font-medium text-[var(--text-primary)] mb-4 tracking-tight leading-[1.1]">
            {t.home.title1}
            <br />
            <span className="text-[var(--text-secondary)]">
              {t.home.title2}
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg">
            {t.home.description}
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setCategory("all")}
            className={`category-btn ${category === "all" ? "active" : ""}`}
          >
            {t.home.allNotes}
          </button>
          <button
            onClick={() => setCategory("music")}
            className={`category-btn ${category === "music" ? "active" : ""}`}
          >
            {t.home.musicNotes}
          </button>
          <button
            onClick={() => setCategory("english")}
            className={`category-btn ${category === "english" ? "active" : ""}`}
          >
            {t.home.englishNotes}
          </button>
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--text-muted)] transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base"
          />
        </div>

        {/* Articles */}
        <section>
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-6">
            {t.home.recentNotes}
          </p>

          <div className="space-y-2">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const noteCategory = getCategoryForNote(note);
                return (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="group block p-5 rounded-xl border border-transparent hover:border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-all duration-200"
                  >
                    <article className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              noteCategory === "english"
                                ? "bg-[var(--tag-english-bg)] text-[var(--tag-english-text)]"
                                : "bg-[var(--tag-music-bg)] text-[var(--tag-music-text)]"
                            }`}
                          >
                            {getCategoryLabel(noteCategory)}
                          </span>
                        </div>
                        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-highlight)] transition-colors">
                          {note.title}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
                          {note.content.slice(0, 150)}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <time className="text-xs text-[var(--text-muted)]">
                            {formatDate(note.createdAt)}
                          </time>
                          {note.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-highlight)] transition-all flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </article>
                  </Link>
                );
              })
            ) : (
              <div className="py-20 text-center">
                <p className="text-[var(--text-muted)]">
                  {searchQuery ? t.home.noResults : t.home.noNotes}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-[var(--border-light)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              {t.footer.copyright} {new Date().getFullYear()}
            </span>
            <span className="font-medium tracking-wider">woowonjaeQAQ</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function HomeLoading() {
  return <div className="min-h-screen bg-[var(--bg-primary)]" />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
