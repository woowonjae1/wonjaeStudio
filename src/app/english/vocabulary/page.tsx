"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllWords,
  getProgress,
  Word,
  WordProgress,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";
import { speak, preloadVoices } from "@/lib/tts";

type FilterLevel = "all" | "cet4" | "cet6" | "ielts-basic" | "ielts-advanced";
type FilterStatus = "all" | "new" | "learning" | "mastered";

export default function VocabularyPage() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<Record<string, WordProgress>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setWords(getAllWords());
    setProgress(getProgress());
    preloadVoices();

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

  const getWordStatus = (wordId: string): FilterStatus => {
    const p = progress[wordId];
    if (!p) return "new";
    if (p.familiarity >= 4) return "mastered";
    return "learning";
  };

  const filteredWords = words.filter((word) => {
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !word.word.toLowerCase().includes(query) &&
        !word.meaning.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    // 等级筛选
    if (levelFilter !== "all" && word.level !== levelFilter) {
      return false;
    }
    // 状态筛选
    if (statusFilter !== "all" && getWordStatus(word.id) !== statusFilter) {
      return false;
    }
    return true;
  });

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      cet4: "CET-4",
      cet6: "CET-6",
      "ielts-basic": locale === "zh" ? "雅思基础" : "IELTS Basic",
      "ielts-advanced": locale === "zh" ? "雅思进阶" : "IELTS Advanced",
    };
    return labels[level] || level;
  };

  const getStatusLabel = (status: FilterStatus) => {
    const labels: Record<FilterStatus, string> = {
      all: locale === "zh" ? "全部" : "All",
      new: locale === "zh" ? "未学习" : "New",
      learning: locale === "zh" ? "学习中" : "Learning",
      mastered: locale === "zh" ? "已掌握" : "Mastered",
    };
    return labels[status];
  };

  const getFamiliarityBar = (wordId: string) => {
    const p = progress[wordId];
    const level = p?.familiarity || 0;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= level
                ? "bg-[var(--accent-success)]"
                : "bg-[var(--border-color)]"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/english")}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            ← {locale === "zh" ? "返回" : "Back"}
          </button>
          <button
            onClick={() => router.push("/english/flashcard")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
          >
            {locale === "zh" ? "开始复习" : "Start Review"}
          </button>
        </div>

        <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2 tracking-tight">
          {locale === "zh" ? "单词列表" : "Vocabulary List"}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          {filteredWords.length} {locale === "zh" ? "个单词" : "words"}
        </p>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "zh" ? "搜索单词或释义..." : "Search words..."
            }
            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--text-muted)] transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Level Filter */}
            {(
              [
                "all",
                "cet4",
                "cet6",
                "ielts-basic",
                "ielts-advanced",
              ] as FilterLevel[]
            ).map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  levelFilter === level
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {level === "all"
                  ? locale === "zh"
                    ? "全部等级"
                    : "All Levels"
                  : getLevelLabel(level)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            {(["all", "new", "learning", "mastered"] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === status
                      ? "bg-[var(--tag-english-bg)] text-[var(--tag-english-text)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Word List */}
        <div className="space-y-2">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-muted)] transition-all cursor-pointer"
              onClick={() =>
                setExpandedWord(expandedWord === word.id ? null : word.id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(word.word);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      title={
                        locale === "zh" ? "播放发音" : "Play pronunciation"
                      }
                    >
                      🔊
                    </button>
                    <span className="text-lg font-medium text-[var(--text-primary)]">
                      {word.word}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">
                      {word.phonetic}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
                      {word.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {word.meaning}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getFamiliarityBar(word.id)}
                  <span className="text-[var(--text-muted)] text-sm">
                    {expandedWord === word.id ? "−" : "+"}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedWord === word.id && (
                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">
                        {locale === "zh" ? "例句" : "Example"}
                      </p>
                      <p className="text-sm text-[var(--text-primary)]">
                        {word.example}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {word.exampleCn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">
                        {locale === "zh" ? "等级" : "Level"}:
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                        {getLevelLabel(word.level)}
                      </span>
                      {word.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-[var(--tag-english-bg)] text-[var(--tag-english-text)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredWords.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[var(--text-muted)]">
                {locale === "zh" ? "没有找到匹配的单词" : "No words found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
