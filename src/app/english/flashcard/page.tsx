"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getTodayReviewWords,
  getNewWords,
  updateWordProgress,
  Word,
  getProgress,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";
import { speak, preloadVoices } from "@/lib/tts";

type CardState = "front" | "back";
type StudyMode = "review" | "new";

export default function FlashcardPage() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("front");
  const [studyMode, setStudyMode] = useState<StudyMode>("review");
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadWords = useCallback(async (mode: StudyMode) => {
    setLoading(true);
    const wordList =
      mode === "review" ? await getTodayReviewWords() : await getNewWords(10);
    setWords(wordList);
    setCurrentIndex(0);
    setCardState("front");
    setCompleted(false);
    setStats({ correct: 0, incorrect: 0 });
    setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    loadWords("review");
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
  }, [loadWords]);

  const currentWord = words[currentIndex];

  const handleFlip = () => {
    setCardState(cardState === "front" ? "back" : "front");
  };

  const handleAnswer = (correct: boolean) => {
    if (!currentWord) return;

    updateWordProgress(currentWord.id, correct);
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCardState("front");
    } else {
      setCompleted(true);
    }
  };

  const handleModeChange = (mode: StudyMode) => {
    setStudyMode(mode);
    loadWords(mode);
  };

  const handleRestart = () => {
    loadWords(studyMode);
  };

  const getFamiliarityLevel = (wordId: string) => {
    const progress = getProgress();
    return progress[wordId]?.familiarity || 0;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  // 完成界面
  if (completed) {
    const total = stats.correct + stats.incorrect;
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="max-w-md w-full mx-6 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-2">
            {locale === "zh" ? "学习完成！" : "Session Complete!"}
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {locale === "zh"
              ? `你复习了 ${total} 个单词`
              : `You reviewed ${total} words`}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <p className="text-2xl font-medium text-[var(--accent-success)]">
                {stats.correct}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {locale === "zh" ? "正确" : "Correct"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <p className="text-2xl font-medium text-red-500">
                {stats.incorrect}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {locale === "zh" ? "需复习" : "To Review"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <p className="text-2xl font-medium text-[var(--text-primary)]">
                {accuracy}%
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {locale === "zh" ? "正确率" : "Accuracy"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
            >
              {locale === "zh" ? "继续学习" : "Continue Learning"}
            </button>
            <button
              onClick={() => router.push("/english")}
              className="w-full py-3 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {locale === "zh" ? "返回首页" : "Back to Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 无单词界面
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="max-w-md w-full mx-6 text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-2">
            {studyMode === "review"
              ? locale === "zh"
                ? "今日复习完成！"
                : "All caught up!"
              : locale === "zh"
                ? "没有新单词了"
                : "No new words"}
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {studyMode === "review"
              ? locale === "zh"
                ? "你已经复习完所有待复习的单词"
                : "You've reviewed all words for today"
              : locale === "zh"
                ? "所有单词都已学习过"
                : "All words have been studied"}
          </p>

          <div className="flex flex-col gap-3">
            {studyMode === "review" && (
              <button
                onClick={() => handleModeChange("new")}
                className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                {locale === "zh" ? "学习新单词" : "Learn New Words"}
              </button>
            )}
            <button
              onClick={() => router.push("/english")}
              className="w-full py-3 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {locale === "zh" ? "返回首页" : "Back to Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/english")}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            ← {locale === "zh" ? "返回" : "Back"}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeChange("review")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                studyMode === "review"
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              }`}
            >
              {locale === "zh" ? "复习" : "Review"}
            </button>
            <button
              onClick={() => handleModeChange("new")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                studyMode === "new"
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              }`}
            >
              {locale === "zh" ? "新词" : "New"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>
              {currentIndex + 1} / {words.length}
            </span>
            <span>
              {locale === "zh" ? "熟悉度" : "Familiarity"}:{" "}
              {getFamiliarityLevel(currentWord.id)}/5
            </span>
          </div>
          <div className="h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div
          onClick={handleFlip}
          className="relative min-h-[320px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] cursor-pointer transition-all hover:border-[var(--text-muted)] mb-8"
        >
          {cardState === "front" ? (
            // Front - Show word
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <p className="text-xs text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                {locale === "zh" ? "点击翻转" : "Tap to flip"}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentWord.word);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-3"
                title={locale === "zh" ? "播放发音" : "Play pronunciation"}
              >
                🔊
              </button>
              <h2 className="text-4xl font-medium text-[var(--text-primary)] mb-3">
                {currentWord.word}
              </h2>
              <p className="text-lg text-[var(--text-muted)]">
                {currentWord.phonetic}
              </p>
              <span className="mt-4 text-sm text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                {currentWord.partOfSpeech}
              </span>
            </div>
          ) : (
            // Back - Show meaning and example
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <p className="text-xs text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                {locale === "zh" ? "释义" : "Meaning"}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentWord.word);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-3"
                title={locale === "zh" ? "播放发音" : "Play pronunciation"}
              >
                🔊
              </button>
              <h2 className="text-2xl font-medium text-[var(--text-primary)] mb-6 text-center">
                {currentWord.meaning}
              </h2>
              <div className="w-full max-w-sm space-y-2 text-center">
                <p className="text-sm text-[var(--text-primary)]">
                  {currentWord.example}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {currentWord.exampleCn}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Answer Buttons */}
        {cardState === "back" && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-4 rounded-xl text-sm font-medium border-2 border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 transition-all"
            >
              {locale === "zh" ? "😕 不认识" : "😕 Don't know"}
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-4 rounded-xl text-sm font-medium border-2 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-950 transition-all"
            >
              {locale === "zh" ? "😊 认识" : "😊 Got it"}
            </button>
          </div>
        )}

        {/* Hint */}
        {cardState === "front" && (
          <p className="text-center text-sm text-[var(--text-muted)]">
            {locale === "zh"
              ? "想一想这个单词的意思，然后点击卡片查看答案"
              : "Think about the meaning, then tap to reveal"}
          </p>
        )}
      </div>
    </div>
  );
}
