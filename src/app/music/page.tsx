"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  loadProgress,
  getLearningStatistics,
  MusicLearningProgress,
} from "@/lib/musicProgress";
import { getTotalKnowledgePoints } from "@/lib/musicData";

const modules = [
  {
    id: "theory",
    path: "/music/theory",
    titleKey: "theory" as const,
    descriptionZh: "学习音程、和弦、音阶和节奏基础",
    descriptionEn: "Learn intervals, chords, scales, and rhythm fundamentals",
  },
  {
    id: "chords",
    path: "/music/chords",
    titleKey: "chords" as const,
    descriptionZh: "探索流行、R&B和爵士中的常用和弦进行",
    descriptionEn: "Explore common progressions in Pop, R&B, and Jazz",
  },
  {
    id: "production",
    path: "/music/production",
    titleKey: "production" as const,
    descriptionZh: "学习编曲、混音和音色设计",
    descriptionEn: "Learn arrangement, mixing, and sound design",
  },
  {
    id: "ear-training",
    path: "/music/ear-training",
    titleKey: "earTraining" as const,
    descriptionZh: "训练你的耳朵识别音程和和弦",
    descriptionEn: "Train your ear to identify intervals and chords",
  },
];

export default function MusicPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<MusicLearningProgress | null>(null);

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

  const t = translations[locale].music;
  const stats = progress
    ? getLearningStatistics(progress, getTotalKnowledgePoints())
    : null;

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2">
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)]">{t.subtitle}</p>
        </header>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard
              label={t.completed}
              value={stats.totalCompleted.toString()}
            />
            <StatCard label={t.streak} value={`${stats.streak}`} />
            <StatCard label={t.progress} value={`${stats.overallProgress}%`} />
            <StatCard
              label={t.accuracy}
              value={`${stats.earTrainingAccuracy}%`}
            />
          </div>
        )}

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => router.push(module.path)}
              className="w-full text-left p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-[var(--text-primary)] mb-1">
                    {t[module.titleKey]}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {locale === "zh"
                      ? module.descriptionZh
                      : module.descriptionEn}
                  </p>
                  {/* Progress Bar */}
                  {progress?.moduleProgress[
                    module.id as keyof typeof progress.moduleProgress
                  ] !== undefined && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--text-primary)] transition-all duration-300"
                          style={{
                            width: `${progress.moduleProgress[module.id as keyof typeof progress.moduleProgress]}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[var(--text-muted)] ml-4">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
      <div className="text-xl font-medium text-[var(--text-primary)]">
        {value}
      </div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}
