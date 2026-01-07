"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getRandomWordsForSpelling,
  updateWordProgress,
  Word,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";
import { speak, preloadVoices } from "@/lib/tts";

export default function SpellingPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [wordCount, setWordCount] = useState(100);

  const loadWords = useCallback((count: number) => {
    const wordList = getRandomWordsForSpelling(count);
    setWords(wordList);
    setCurrentIndex(0);
    setUserInput("");
    setShowAnswer(false);
    setIsCorrect(null);
    setCompleted(false);
    setStats({ correct: 0, incorrect: 0 });
  }, []);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    loadWords(100);
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

  useEffect(() => {
    if (mounted && inputRef.current && !showAnswer) {
      inputRef.current.focus();
    }
  }, [currentIndex, showAnswer, mounted]);

  const currentWord = words[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || showAnswer) return;

    const correct =
      userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowAnswer(true);
    updateWordProgress(currentWord.id, correct);
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setShowAnswer(false);
      setIsCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = (count: number) => {
    setWordCount(count);
    loadWords(count);
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
          <div className="text-6xl mb-6">
            {accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : "💪"}
          </div>
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-2">
            {locale === "zh" ? "默写完成！" : "Spelling Complete!"}
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {locale === "zh"
              ? `你完成了 ${total} 个单词的默写`
              : `You spelled ${total} words`}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <p className="text-2xl font-medium text-green-500">
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
                {locale === "zh" ? "错误" : "Wrong"}
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
              onClick={() => handleRestart(wordCount)}
              className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
            >
              {locale === "zh" ? "再来一组" : "Try Again"}
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

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">
          {locale === "zh" ? "加载中..." : "Loading..."}
        </p>
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
            {[100, 200].map((count) => (
              <button
                key={count}
                onClick={() => handleRestart(count)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  wordCount === count
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                }`}
              >
                {count} {locale === "zh" ? "词" : "words"}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>
              {currentIndex + 1} / {words.length}
            </span>
            <span>
              {locale === "zh" ? "正确" : "Correct"}: {stats.correct} |{" "}
              {locale === "zh" ? "错误" : "Wrong"}: {stats.incorrect}
            </span>
          </div>
          <div className="h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Word Card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 mb-6">
          {/* Meaning */}
          <div className="text-center mb-8">
            <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              {locale === "zh" ? "中文释义" : "Meaning"}
            </p>
            <p className="text-2xl font-medium text-[var(--text-primary)]">
              {currentWord.meaning}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              {currentWord.partOfSpeech}
            </p>
            {/* TTS Button */}
            <button
              onClick={() => speak(currentWord.word)}
              className="mt-4 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              title={locale === "zh" ? "听发音提示" : "Listen to pronunciation"}
            >
              🔊
            </button>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {locale === "zh" ? "点击听发音" : "Click to hear"}
            </p>
          </div>

          {/* Example (hint) */}
          <div className="text-center mb-8 p-4 rounded-xl bg-[var(--bg-secondary)]">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              {locale === "zh" ? "例句提示" : "Example Hint"}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {currentWord.example.replace(
                new RegExp(currentWord.word, "gi"),
                "______"
              )}
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={showAnswer}
                placeholder={
                  locale === "zh" ? "输入单词..." : "Type the word..."
                }
                className={`w-full px-4 py-4 text-center text-xl font-medium rounded-xl border-2 transition-all ${
                  showAnswer
                    ? isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-[var(--border-color)] bg-[var(--bg-primary)] focus:border-[var(--accent-primary)]"
                } text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none`}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            {!showAnswer && (
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="w-full mt-4 py-3 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {locale === "zh" ? "确认" : "Check"}
              </button>
            )}
          </form>

          {/* Answer Feedback */}
          {showAnswer && (
            <div className="mt-6 text-center">
              <div
                className={`text-lg font-medium mb-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}
              >
                {isCorrect
                  ? locale === "zh"
                    ? "✓ 正确！"
                    : "✓ Correct!"
                  : locale === "zh"
                    ? "✗ 错误"
                    : "✗ Wrong"}
              </div>
              {!isCorrect && (
                <div className="mb-4">
                  <p className="text-sm text-[var(--text-muted)]">
                    {locale === "zh" ? "正确答案" : "Correct answer"}:
                  </p>
                  <p className="text-xl font-medium text-[var(--text-primary)]">
                    {currentWord.word}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {currentWord.phonetic}
                  </p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                {currentIndex < words.length - 1
                  ? locale === "zh"
                    ? "下一个"
                    : "Next"
                  : locale === "zh"
                    ? "查看结果"
                    : "See Results"}
              </button>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs text-[var(--text-muted)]">
          {locale === "zh" ? "按 Enter 键确认答案" : "Press Enter to check"}
        </p>
      </div>
    </div>
  );
}
