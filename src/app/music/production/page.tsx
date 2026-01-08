"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  getProductionLessonsByCategory,
  ProductionCategory,
  ProductionLesson,
} from "@/lib/musicData";

const categories: {
  id: ProductionCategory;
  labelZh: string;
  labelEn: string;
}[] = [
  { id: "arrangement", labelZh: "编曲", labelEn: "Arrangement" },
  { id: "mixing", labelZh: "混音", labelEn: "Mixing" },
  { id: "sound-design", labelZh: "音色设计", labelEn: "Sound Design" },
];

export default function ProductionPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<ProductionCategory>("arrangement");
  const [lessons, setLessons] = useState<ProductionLesson[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

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

  useEffect(() => {
    setLessons(getProductionLessonsByCategory(activeCategory));
    setExpandedLesson(null);
  }, [activeCategory]);

  const t = translations[locale].music;

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => router.push("/music")}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm mb-4"
          >
            ← {t.back}
          </button>
          <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2">
            {t.production}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {locale === "zh"
              ? "学习编曲、混音和音色设计"
              : "Learn arrangement, mixing, and sound design"}
          </p>
        </header>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const count = getProductionLessonsByCategory(category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
                }`}
              >
                {locale === "zh" ? category.labelZh : category.labelEn}
                <span className="ml-2 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isExpanded = expandedLesson === lesson.id;
            const title = locale === "zh" ? lesson.titleCn : lesson.title;
            const content = locale === "zh" ? lesson.contentCn : lesson.content;
            const tips = locale === "zh" ? lesson.tipsCn : lesson.tips;
            const mistakes =
              locale === "zh" ? lesson.commonMistakesCn : lesson.commonMistakes;

            return (
              <div
                key={lesson.id}
                className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]"
              >
                {/* Header */}
                <button
                  className="w-full p-4 text-left flex items-center justify-between"
                  onClick={() =>
                    setExpandedLesson(isExpanded ? null : lesson.id)
                  }
                >
                  <h3 className="font-medium text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <span
                    className={`text-[var(--text-muted)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    ↓
                  </span>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-color)] pt-4">
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {content}
                    </p>

                    {/* Tips */}
                    <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                      <h4 className="font-medium text-[var(--text-primary)] mb-2">
                        {locale === "zh" ? "技巧" : "Tips"}
                      </h4>
                      <ul className="space-y-1.5">
                        {tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                          >
                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                      <h4 className="font-medium text-[var(--text-primary)] mb-2">
                        {locale === "zh" ? "常见错误" : "Common Mistakes"}
                      </h4>
                      <ul className="space-y-1.5">
                        {mistakes.map((mistake, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                          >
                            <span className="text-[var(--text-muted)]">•</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            {locale === "zh" ? "暂无内容" : "No content available"}
          </div>
        )}
      </div>
    </div>
  );
}
