"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  loadProgress,
  saveProgress,
  markKnowledgePointComplete,
  updateModuleProgress,
  isKnowledgePointCompleted,
  MusicLearningProgress,
} from "@/lib/musicProgress";
import {
  getKnowledgePointsByCategory,
  KnowledgeCategory,
  KnowledgePoint,
  KNOWLEDGE_POINTS,
} from "@/lib/musicData";
import { KnowledgePointCard } from "@/components/music";

const categories: {
  id: KnowledgeCategory;
  labelZh: string;
  labelEn: string;
}[] = [
  { id: "intervals", labelZh: "音程", labelEn: "Intervals" },
  { id: "chords", labelZh: "和弦", labelEn: "Chords" },
  { id: "scales", labelZh: "音阶", labelEn: "Scales" },
  { id: "rhythm", labelZh: "节奏", labelEn: "Rhythm" },
];

export default function TheoryPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<MusicLearningProgress | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<KnowledgeCategory>("intervals");
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setProgress(loadProgress());

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
    setKnowledgePoints(getKnowledgePointsByCategory(activeCategory));
  }, [activeCategory]);

  const handleComplete = useCallback(
    (id: string) => {
      if (!progress) return;

      let newProgress = markKnowledgePointComplete(progress, id);

      const theoryPoints = KNOWLEDGE_POINTS.filter((kp) =>
        ["intervals", "chords", "scales", "rhythm"].includes(kp.category)
      );
      const completedCount = newProgress.completedKnowledgePoints.filter(
        (cpId) => theoryPoints.some((kp) => kp.id === cpId)
      ).length;

      newProgress = updateModuleProgress(
        newProgress,
        "theory",
        completedCount,
        theoryPoints.length
      );

      saveProgress(newProgress);
      setProgress(newProgress);
    },
    [progress]
  );

  const t = translations[locale].music;

  const getCategoryProgress = (category: KnowledgeCategory) => {
    if (!progress) return { completed: 0, total: 0 };
    const categoryPoints = getKnowledgePointsByCategory(category);
    const completed = categoryPoints.filter((kp) =>
      isKnowledgePointCompleted(progress, kp.id)
    ).length;
    return { completed, total: categoryPoints.length };
  };

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
            {t.theory}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {locale === "zh"
              ? "掌握音乐的基本原理"
              : "Master the fundamentals of music"}
          </p>
        </header>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const { completed, total } = getCategoryProgress(category.id);
            const isActive = activeCategory === category.id;

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
                <span className="ml-2 opacity-60">
                  {completed}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Knowledge Points List */}
        <div className="space-y-4">
          {knowledgePoints.map((kp) => (
            <KnowledgePointCard
              key={kp.id}
              knowledgePoint={kp}
              locale={locale}
              isCompleted={
                progress ? isKnowledgePointCompleted(progress, kp.id) : false
              }
              onComplete={handleComplete}
            />
          ))}
        </div>

        {knowledgePoints.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            {locale === "zh" ? "暂无内容" : "No content available"}
          </div>
        )}
      </div>
    </div>
  );
}
