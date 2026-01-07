"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getSpeakingTopics,
  getRandomTopic,
  SpeakingTopic,
  SpeakingCategory,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";

type FilterType = "all" | SpeakingCategory;

export default function SpeakingPage() {
  const router = useRouter();
  const detailRef = useRef<HTMLDivElement>(null);
  const [topics, setTopics] = useState<SpeakingTopic[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic | null>(
    null
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setTopics(getSpeakingTopics());

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

  const filteredTopics =
    filter === "all" ? topics : topics.filter((t) => t.category === filter);

  const handleSelectTopic = (topic: SpeakingTopic) => {
    setSelectedTopic(topic);
    setShowAnswer(false);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleRandomTopic = () => {
    const topic =
      filter === "all"
        ? getRandomTopic()
        : getRandomTopic(filter as SpeakingCategory);
    if (topic) {
      handleSelectTopic(topic);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, { zh: string; en: string }> = {
      beginner: { zh: "入门", en: "Beginner" },
      intermediate: { zh: "中级", en: "Intermediate" },
      advanced: { zh: "高级", en: "Advanced" },
    };
    return labels[difficulty]?.[locale] || difficulty;
  };

  const getCategoryLabel = (category: SpeakingCategory) => {
    const labels: Record<SpeakingCategory, { zh: string; en: string }> = {
      daily: { zh: "日常", en: "Daily" },
      travel: { zh: "旅行", en: "Travel" },
      work: { zh: "工作", en: "Work" },
      social: { zh: "社交", en: "Social" },
      ielts: { zh: "雅思", en: "IELTS" },
    };
    return labels[category]?.[locale] || category;
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
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
          >
            ← {locale === "zh" ? "返回" : "Back"}
          </button>
          <button
            onClick={handleRandomTopic}
            className="px-4 py-2 rounded-lg text-sm bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90"
          >
            {locale === "zh" ? "随机" : "Random"}
          </button>
        </div>

        <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2 tracking-tight">
          {locale === "zh" ? "口语练习" : "Speaking"}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          {locale === "zh" ? "从日常对话到雅思口语" : "Daily to IELTS speaking"}
        </p>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(
            [
              "all",
              "daily",
              "social",
              "travel",
              "work",
              "ielts",
            ] as FilterType[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filter === cat
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat === "all"
                ? locale === "zh"
                  ? "全部"
                  : "All"
                : getCategoryLabel(cat as SpeakingCategory)}
            </button>
          ))}
        </div>

        {/* Detail Card - 显示在顶部 */}
        {selectedTopic && (
          <div
            ref={detailRef}
            className="mb-8 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {getCategoryLabel(selectedTopic.category)}
                  {selectedTopic.part && ` · Part ${selectedTopic.part}`}
                  {` · ${getDifficultyLabel(selectedTopic.difficulty)}`}
                </p>
                <h2 className="text-xl font-medium text-[var(--text-primary)]">
                  {selectedTopic.topic}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {selectedTopic.topicCn}
                </p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                {locale === "zh" ? "关闭" : "Close"}
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[var(--text-muted)] mb-2 uppercase">
                {locale === "zh" ? "问题" : "Questions"}
              </p>
              <ul className="space-y-2">
                {selectedTopic.questions.map((q, i) => (
                  <li
                    key={i}
                    className="text-[var(--text-primary)] text-sm pl-4 border-l-2 border-[var(--border-color)]"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {selectedTopic.usefulPhrases &&
              selectedTopic.usefulPhrases.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2 uppercase">
                    {locale === "zh" ? "实用表达" : "Phrases"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.usefulPhrases.map((phrase, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-sm rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {selectedTopic.sampleAnswer && (
              <div>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                >
                  {showAnswer
                    ? locale === "zh"
                      ? "隐藏答案"
                      : "Hide"
                    : locale === "zh"
                      ? "参考答案"
                      : "Answer"}
                </button>
                {showAnswer && (
                  <div className="mt-2 p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                      {selectedTopic.sampleAnswer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Topic List */}
        <div className="space-y-2">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTopic?.id === topic.id
                  ? "border-[var(--text-primary)] bg-[var(--bg-card)]"
                  : "border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-card)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-xs text-[var(--text-muted)]">
                <span>{getCategoryLabel(topic.category)}</span>
                {topic.part && <span>· Part {topic.part}</span>}
                <span>· {getDifficultyLabel(topic.difficulty)}</span>
              </div>
              <h3 className="text-[var(--text-primary)] font-medium">
                {topic.topic}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {topic.topicCn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
