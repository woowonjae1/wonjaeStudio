"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  loadProgress,
  saveProgress,
  addEarTrainingResult,
  calculateAccuracy,
  MusicLearningProgress,
} from "@/lib/musicProgress";
import { EarTrainingQuiz } from "@/components/music";

type TrainingType = "interval" | "chord";

const trainingTypes: {
  id: TrainingType;
  labelZh: string;
  labelEn: string;
  descZh: string;
  descEn: string;
}[] = [
  {
    id: "interval",
    labelZh: "音程",
    labelEn: "Intervals",
    descZh: "识别两个音符之间的音程",
    descEn: "Identify the interval between two notes",
  },
  {
    id: "chord",
    labelZh: "和弦",
    labelEn: "Chords",
    descZh: "识别正在播放的和弦类型",
    descEn: "Identify the type of chord being played",
  },
];

export default function EarTrainingPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<MusicLearningProgress | null>(null);
  const [activeType, setActiveType] = useState<TrainingType | null>(null);

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

  const handleResult = useCallback(
    (correct: boolean, questionType: TrainingType) => {
      if (!progress) return;

      const newProgress = addEarTrainingResult(progress, {
        questionType,
        correct,
      });

      saveProgress(newProgress);
      setProgress(newProgress);
    },
    [progress]
  );

  const t = translations[locale].music;

  const getStats = () => {
    if (!progress) return { interval: 0, chord: 0, total: 0 };

    return {
      interval: calculateAccuracy(progress.earTrainingResults, "interval"),
      chord: calculateAccuracy(progress.earTrainingResults, "chord"),
      total: progress.earTrainingResults.length,
    };
  };

  const stats = getStats();

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
            {t.earTraining}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {locale === "zh"
              ? "训练你的耳朵识别音程和和弦"
              : "Train your ear to identify intervals and chords"}
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-xl font-medium text-[var(--text-primary)]">
              {stats.interval}%
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "音程准确率" : "Interval Accuracy"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-xl font-medium text-[var(--text-primary)]">
              {stats.chord}%
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "和弦准确率" : "Chord Accuracy"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-xl font-medium text-[var(--text-primary)]">
              {stats.total}
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "总尝试次数" : "Total Attempts"}
            </div>
          </div>
        </div>

        {/* Training Type Selection or Quiz */}
        {!activeType ? (
          <div className="space-y-3">
            {trainingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className="w-full text-left p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">
                      {locale === "zh" ? type.labelZh : type.labelEn}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {locale === "zh" ? type.descZh : type.descEn}
                    </p>
                  </div>
                  <span className="text-[var(--text-muted)]">→</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {/* Back to selection */}
            <button
              onClick={() => setActiveType(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm mb-6"
            >
              ← {locale === "zh" ? "选择训练类型" : "Select Training Type"}
            </button>

            {/* Quiz */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <h2 className="text-xl font-medium text-[var(--text-primary)] mb-6">
                {locale === "zh"
                  ? trainingTypes.find((t) => t.id === activeType)?.labelZh
                  : trainingTypes.find((t) => t.id === activeType)?.labelEn}
              </h2>

              <EarTrainingQuiz
                type={activeType}
                locale={locale}
                onResult={handleResult}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
