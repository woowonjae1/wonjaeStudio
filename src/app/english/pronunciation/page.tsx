"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSkills,
  getSkillsByCategory,
  SKILL_CATEGORIES,
  SkillCategory,
  PronunciationSkill,
} from "@/lib/pronunciationData";
import {
  speak,
  speakSlow,
  preloadVoices,
  AccentType,
  getStoredAccent,
  setStoredAccent,
} from "@/lib/tts";
import { Locale, getStoredLocale } from "@/lib/i18n";

type ViewMode = "categories" | "skill";

export default function PronunciationPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<PronunciationSkill | null>(
    null
  );
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [accent, setAccent] = useState<AccentType>("us");
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setAccent(getStoredAccent());
    preloadVoices();

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };
    const handleAccentChange = (e: CustomEvent<AccentType>) => {
      setAccent(e.detail);
    };
    window.addEventListener(
      "localeChange",
      handleLocaleChange as EventListener
    );
    window.addEventListener(
      "accentChange",
      handleAccentChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "localeChange",
        handleLocaleChange as EventListener
      );
      window.removeEventListener(
        "accentChange",
        handleAccentChange as EventListener
      );
    };
  }, []);

  const handleCategoryClick = (category: SkillCategory) => {
    setSelectedCategory(category);
    setSelectedSkill(null);
    setViewMode("categories");
  };

  const handleSkillClick = (skill: PronunciationSkill) => {
    setSelectedSkill(skill);
    setPracticeIndex(0);
    setShowPhonetic(false);
    setViewMode("skill");
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSpeak = (text: string, slow: boolean = false) => {
    // 清理文本中的音标和符号
    const cleanText = text
      .replace(/[↗↘]/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();
    if (slow) {
      speakSlow(cleanText, accent);
    } else {
      speak(cleanText, accent);
    }
  };

  const handleAccentToggle = () => {
    const newAccent = accent === "us" ? "uk" : "us";
    setAccent(newAccent);
    setStoredAccent(newAccent);
  };

  const currentSkills = selectedCategory
    ? getSkillsByCategory(selectedCategory)
    : getAllSkills();

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/english")}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
            >
              ← {locale === "zh" ? "返回英语学习" : "Back to English"}
            </button>
            {/* Accent Toggle */}
            <button
              onClick={handleAccentToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm font-medium hover:border-[var(--text-muted)] transition-all"
            >
              <span
                className={
                  accent === "us"
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }
              >
                🇺🇸 US
              </span>
              <span className="text-[var(--text-muted)]">/</span>
              <span
                className={
                  accent === "uk"
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }
              >
                🇬🇧 UK
              </span>
            </button>
          </div>
          <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2">
            {locale === "zh" ? "发音技巧" : "Pronunciation Skills"}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {locale === "zh"
              ? "掌握连读、弱读、语调等核心发音技巧"
              : "Master linking, weak forms, intonation and more"}
          </p>
        </header>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSkill(null);
              setViewMode("categories");
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
            }`}
          >
            {locale === "zh" ? "全部" : "All"}
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
              }`}
            >
              {locale === "zh" ? cat.titleCn : cat.title}
            </button>
          ))}
        </div>

        {/* Skills List */}
        {viewMode === "categories" && (
          <div className="space-y-3 mb-8">
            {currentSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSkill?.id === skill.id
                    ? "border-[var(--text-primary)] bg-[var(--bg-card)]"
                    : "border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-card)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">
                      {locale === "zh" ? skill.titleCn : skill.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      {locale === "zh"
                        ? skill.descriptionCn.slice(0, 50) + "..."
                        : skill.description.slice(0, 60) + "..."}
                    </p>
                  </div>
                  <span className="text-[var(--text-muted)]">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Skill Detail */}
        {selectedSkill && viewMode === "skill" && (
          <div ref={detailRef} className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setViewMode("categories")}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
            >
              ← {locale === "zh" ? "返回列表" : "Back to list"}
            </button>

            {/* Skill Header */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <h2 className="text-xl font-medium text-[var(--text-primary)] mb-2">
                {locale === "zh" ? selectedSkill.titleCn : selectedSkill.title}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {locale === "zh"
                  ? selectedSkill.descriptionCn
                  : selectedSkill.description}
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                {locale === "zh" ? "规则讲解" : "Rules"}
              </h3>
              {selectedSkill.rules.map((rule, ruleIndex) => (
                <div
                  key={ruleIndex}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]"
                >
                  <p className="font-medium text-[var(--text-primary)] mb-3">
                    {locale === "zh" ? rule.ruleCn : rule.rule}
                  </p>
                  <div className="space-y-2">
                    {rule.examples.map((ex, exIndex) => (
                      <div
                        key={exIndex}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]"
                      >
                        <button
                          onClick={() => handleSpeak(ex.text)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center hover:border-[var(--text-muted)] transition-colors"
                          title={locale === "zh" ? "播放发音" : "Play"}
                        >
                          🔊
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)]">
                            {ex.text}
                          </p>
                          <p className="text-sm text-[var(--accent-highlight)] font-mono mt-1">
                            {ex.phonetic}
                          </p>
                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            {locale === "zh"
                              ? ex.explanationCn
                              : ex.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Practice Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                {locale === "zh" ? "跟读练习" : "Practice"}
              </h3>
              <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                {selectedSkill.practiceExamples.length > 0 && (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-2xl font-medium text-[var(--text-primary)] mb-2">
                        {selectedSkill.practiceExamples[practiceIndex].text}
                      </p>
                      {showPhonetic && (
                        <>
                          <p className="text-lg text-[var(--accent-highlight)] font-mono">
                            {
                              selectedSkill.practiceExamples[practiceIndex]
                                .phonetic
                            }
                          </p>
                          <p className="text-sm text-[var(--text-muted)] mt-2">
                            {locale === "zh"
                              ? selectedSkill.practiceExamples[practiceIndex]
                                  .explanationCn
                              : selectedSkill.practiceExamples[practiceIndex]
                                  .explanation}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                      <button
                        onClick={() =>
                          handleSpeak(
                            selectedSkill.practiceExamples[practiceIndex].text
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
                      >
                        🔊 {locale === "zh" ? "正常" : "Normal"}
                      </button>
                      <button
                        onClick={() =>
                          handleSpeak(
                            selectedSkill.practiceExamples[practiceIndex].text,
                            true
                          )
                        }
                        className="px-4 py-2 rounded-lg border border-[var(--text-primary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-all"
                      >
                        🐢 {locale === "zh" ? "慢速" : "Slow"}
                      </button>
                      <button
                        onClick={() => setShowPhonetic(!showPhonetic)}
                        className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
                      >
                        {showPhonetic
                          ? locale === "zh"
                            ? "隐藏提示"
                            : "Hide Hint"
                          : locale === "zh"
                            ? "显示提示"
                            : "Show Hint"}
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setPracticeIndex(Math.max(0, practiceIndex - 1))
                        }
                        disabled={practiceIndex === 0}
                        className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        {locale === "zh" ? "上一个" : "Previous"}
                      </button>
                      <span className="text-sm text-[var(--text-muted)]">
                        {practiceIndex + 1} /{" "}
                        {selectedSkill.practiceExamples.length}
                      </span>
                      <button
                        onClick={() =>
                          setPracticeIndex(
                            Math.min(
                              selectedSkill.practiceExamples.length - 1,
                              practiceIndex + 1
                            )
                          )
                        }
                        disabled={
                          practiceIndex ===
                          selectedSkill.practiceExamples.length - 1
                        }
                        className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        {locale === "zh" ? "下一个" : "Next"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Practice All */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                {locale === "zh" ? "快速练习全部例句" : "Quick Practice All"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkill.practiceExamples.map((ex, index) => (
                  <button
                    key={index}
                    onClick={() => handleSpeak(ex.text)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      index === practiceIndex
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
                    }`}
                  >
                    {index + 1}. {ex.text.slice(0, 15)}
                    {ex.text.length > 15 ? "..." : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Overview (when no skill selected) */}
        {!selectedSkill && viewMode === "categories" && (
          <div className="mt-8 p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <h3 className="font-medium text-[var(--text-primary)] mb-4">
              {locale === "zh" ? "学习建议" : "Learning Tips"}
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                •{" "}
                {locale === "zh"
                  ? "每天练习 15-20 分钟，比长时间突击更有效"
                  : "Practice 15-20 minutes daily for best results"}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? "先听原音，再跟读，最后对比"
                  : "Listen first, then repeat, then compare"}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? "录制自己的发音，回放检查"
                  : "Record yourself and listen back"}
              </li>
              <li>
                •{" "}
                {locale === "zh"
                  ? "从连读开始，这是最常用的技巧"
                  : "Start with linking - it's the most common technique"}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
