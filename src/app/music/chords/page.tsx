"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  getChordProgressionsByStyle,
  ProgressionStyle,
  ChordProgressionData,
} from "@/lib/musicData";
import { ChordProgressionCard } from "@/components/music";

const styles: { id: ProgressionStyle; labelZh: string; labelEn: string }[] = [
  { id: "pop", labelZh: "流行", labelEn: "Pop" },
  { id: "rnb", labelZh: "R&B / 新灵魂", labelEn: "R&B / Neo-Soul" },
  { id: "jazz", labelZh: "爵士", labelEn: "Jazz" },
];

export default function ChordsPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [activeStyle, setActiveStyle] = useState<ProgressionStyle>("pop");
  const [progressions, setProgressions] = useState<ChordProgressionData[]>([]);
  const [tempo, setTempo] = useState(100);

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
    setProgressions(getChordProgressionsByStyle(activeStyle));
  }, [activeStyle]);

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
            {t.chords}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {locale === "zh"
              ? "学习不同风格的常用和弦进行"
              : "Learn common progressions in different styles"}
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Style Tabs */}
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => {
              const isActive = activeStyle === style.id;
              const count = getChordProgressionsByStyle(style.id).length;

              return (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
                  }`}
                >
                  {locale === "zh" ? style.labelZh : style.labelEn}
                  <span className="ml-2 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Tempo Control */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "速度" : "Tempo"}:
            </span>
            <input
              type="range"
              min="60"
              max="160"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm font-mono text-[var(--text-secondary)] w-16">
              {tempo} BPM
            </span>
          </div>
        </div>

        {/* Progressions List */}
        <div className="space-y-4">
          {progressions.map((progression) => (
            <ChordProgressionCard
              key={progression.id}
              progression={progression}
              locale={locale}
              tempo={tempo}
            />
          ))}
        </div>

        {progressions.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            {locale === "zh" ? "暂无内容" : "No content available"}
          </div>
        )}
      </div>
    </div>
  );
}
