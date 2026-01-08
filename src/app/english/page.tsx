"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStats,
  getTodayReviewWords,
  LearningStats,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";

export default function EnglishPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setStats(getStats());

    // 异步加载待复习单词数量
    getTodayReviewWords().then((words) => {
      setReviewCount(words.length);
      setLoading(false);
    });

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

  if (!mounted || !stats) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  const modules = [
    {
      id: "speaking",
      title: locale === "zh" ? "口语练习" : "Speaking",
      description:
        locale === "zh"
          ? "日常对话 & 雅思口语话题"
          : "Daily conversation & IELTS topics",
      href: "/english/speaking",
      stat: locale === "zh" ? "核心" : "Core",
      accent: "var(--tag-production-bg)",
      accentText: "var(--tag-production-text)",
    },
    {
      id: "vocabulary",
      title: locale === "zh" ? "单词学习" : "Vocabulary",
      description:
        locale === "zh"
          ? "从基础到雅思核心词汇"
          : "From basic to IELTS core vocabulary",
      href: "/english/vocabulary",
      stat: `${stats.totalWords} ${locale === "zh" ? "词" : "words"}`,
      accent: "var(--tag-english-bg)",
      accentText: "var(--tag-english-text)",
    },
    {
      id: "flashcard",
      title: locale === "zh" ? "闪卡复习" : "Flashcards",
      description: locale === "zh" ? "间隔重复记忆" : "Spaced repetition",
      href: "/english/flashcard",
      stat: `${reviewCount} ${locale === "zh" ? "待复习" : "to review"}`,
      accent: "var(--tag-music-bg)",
      accentText: "var(--tag-music-text)",
    },
    {
      id: "spelling",
      title: locale === "zh" ? "单词默写" : "Spelling",
      description: locale === "zh" ? "听音拼写，强化记忆" : "Listen and spell",
      href: "/english/spelling",
      stat: locale === "zh" ? "练习" : "Practice",
      accent: "var(--tag-listening-bg)",
      accentText: "var(--tag-listening-text)",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-12">
          <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide mb-4">
            {locale === "zh" ? "目标：流利口语交流" : "Goal: Fluent Speaking"}
          </p>
          <h1 className="text-4xl font-medium text-[var(--text-primary)] mb-4 tracking-tight">
            {locale === "zh" ? "英语学习" : "English Learning"}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {locale === "zh"
              ? "从零口语到自信交流，每天进步一点点"
              : "From zero speaking to confident communication"}
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-2xl font-medium text-[var(--text-primary)]">
              {stats.streak}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "连续天数" : "Day Streak"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-2xl font-medium text-[var(--text-primary)]">
              {stats.masteredWords}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "已掌握" : "Mastered"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-2xl font-medium text-[var(--text-primary)]">
              {stats.learningWords}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "学习中" : "Learning"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-2xl font-medium text-[var(--text-primary)]">
              {stats.todayReviewed}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "今日复习" : "Today"}
            </p>
          </div>
        </div>

        {/* Learning Modules */}
        <section>
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-6">
            {locale === "zh" ? "学习模块" : "Learning Modules"}
          </p>

          <div className="space-y-4">
            {modules.map((module) => (
              <Link
                key={module.id}
                href={module.href}
                className="group block p-6 rounded-xl border border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-card)] transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-highlight)] transition-colors">
                        {module.title}
                      </h2>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: module.accent,
                          color: module.accentText,
                        }}
                      >
                        {module.stat}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {module.description}
                    </p>
                  </div>
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-6">
            {locale === "zh" ? "快速开始" : "Quick Start"}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/english/speaking"
              className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
            >
              {locale === "zh" ? "开始口语练习" : "Start Speaking"}
            </Link>
            <Link
              href="/english/flashcard"
              className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
            >
              {locale === "zh"
                ? `复习 ${reviewCount} 个单词`
                : `Review ${reviewCount} words`}
            </Link>
            <Link
              href="/english/spelling"
              className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
            >
              {locale === "zh" ? "默写练习" : "Spelling"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
