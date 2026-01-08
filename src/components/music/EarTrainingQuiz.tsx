"use client";

import React, { useState, useCallback, useEffect } from "react";
import { playNote, playChord } from "@/lib/musicAudio";
import {
  getChordNotes,
  transposeNote,
  INTERVALS,
  IntervalName,
  ChordType,
} from "@/lib/musicTheory";

type QuestionType = "interval" | "chord";

interface EarTrainingQuizProps {
  type: QuestionType;
  locale?: "zh" | "en";
  onResult?: (correct: boolean, questionType: QuestionType) => void;
}

const INTERVAL_OPTIONS: {
  name: IntervalName;
  label: { en: string; zh: string };
}[] = [
  { name: "minor2nd", label: { en: "Minor 2nd", zh: "小二度" } },
  { name: "major2nd", label: { en: "Major 2nd", zh: "大二度" } },
  { name: "minor3rd", label: { en: "Minor 3rd", zh: "小三度" } },
  { name: "major3rd", label: { en: "Major 3rd", zh: "大三度" } },
  { name: "perfect4th", label: { en: "Perfect 4th", zh: "纯四度" } },
  { name: "perfect5th", label: { en: "Perfect 5th", zh: "纯五度" } },
  { name: "minor6th", label: { en: "Minor 6th", zh: "小六度" } },
  { name: "major6th", label: { en: "Major 6th", zh: "大六度" } },
  { name: "octave", label: { en: "Octave", zh: "八度" } },
];

const CHORD_OPTIONS: { type: ChordType; label: { en: string; zh: string } }[] =
  [
    { type: "major", label: { en: "Major", zh: "大三和弦" } },
    { type: "minor", label: { en: "Minor", zh: "小三和弦" } },
    { type: "diminished", label: { en: "Diminished", zh: "减三和弦" } },
    { type: "augmented", label: { en: "Augmented", zh: "增三和弦" } },
    { type: "major7", label: { en: "Major 7th", zh: "大七和弦" } },
    { type: "minor7", label: { en: "Minor 7th", zh: "小七和弦" } },
    { type: "dominant7", label: { en: "Dominant 7th", zh: "属七和弦" } },
  ];

const translations = {
  en: {
    playAgain: "Play Again",
    newQuestion: "New Question",
    correct: "Correct!",
    incorrect: "Incorrect",
    theAnswerWas: "The answer was",
    selectAnswer: "Select your answer",
    score: "Score",
  },
  zh: {
    playAgain: "再听一次",
    newQuestion: "下一题",
    correct: "正确！",
    incorrect: "错误",
    theAnswerWas: "正确答案是",
    selectAnswer: "选择你的答案",
    score: "得分",
  },
};

function getRandomRoot(): string {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const octaves = [3, 4];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const octave = octaves[Math.floor(Math.random() * octaves.length)];
  return `${note}${octave}`;
}

export const EarTrainingQuiz: React.FC<EarTrainingQuizProps> = ({
  type,
  locale = "zh",
  onResult,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<{
    root: string;
    answer: string;
    notes: string[];
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const t = translations[locale];

  const generateQuestion = useCallback(() => {
    const root = getRandomRoot();

    if (type === "interval") {
      const option =
        INTERVAL_OPTIONS[Math.floor(Math.random() * INTERVAL_OPTIONS.length)];
      const interval = INTERVALS[option.name];
      const secondNote = transposeNote(root, interval.semitones);

      setCurrentQuestion({
        root,
        answer: option.name,
        notes: [root, secondNote],
      });
    } else {
      const option =
        CHORD_OPTIONS[Math.floor(Math.random() * CHORD_OPTIONS.length)];
      const notes = getChordNotes(root, option.type);

      setCurrentQuestion({
        root,
        answer: option.type,
        notes,
      });
    }

    setSelectedAnswer(null);
    setShowResult(false);
  }, [type]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const playAudio = useCallback(async () => {
    if (!currentQuestion) return;

    try {
      if (type === "interval") {
        await playNote(currentQuestion.notes[0], 0.5);
        await new Promise((resolve) => setTimeout(resolve, 600));
        await playNote(currentQuestion.notes[1], 0.5);
      } else {
        await playChord(currentQuestion.notes, 1.5);
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }, [currentQuestion, type]);

  useEffect(() => {
    if (currentQuestion && !showResult) {
      const timer = setTimeout(playAudio, 300);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, showResult, playAudio]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !currentQuestion) return;

      setSelectedAnswer(answer);
      setShowResult(true);

      const isCorrect = answer === currentQuestion.answer;
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      onResult?.(isCorrect, type);
    },
    [showResult, currentQuestion, type, onResult]
  );

  const options = type === "interval" ? INTERVAL_OPTIONS : CHORD_OPTIONS;

  const getAnswerLabel = (answer: string) => {
    if (type === "interval") {
      const option = INTERVAL_OPTIONS.find((o) => o.name === answer);
      return option?.label[locale] || answer;
    } else {
      const option = CHORD_OPTIONS.find((o) => o.type === answer);
      return option?.label[locale] || answer;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="ear-training-quiz">
      {/* Score */}
      <div className="text-center mb-6">
        <span className="text-[var(--text-secondary)]">
          {t.score}: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="ml-2 text-sm text-[var(--text-muted)]">
              ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </span>
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={playAudio}
          className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl font-medium transition-opacity hover:opacity-90"
        >
          ▶ {t.playAgain}
        </button>
      </div>

      {/* Result */}
      {showResult && (
        <div
          className={`text-center mb-6 p-4 rounded-xl ${
            selectedAnswer === currentQuestion.answer
              ? "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
          }`}
        >
          <div className="font-medium mb-1">
            {selectedAnswer === currentQuestion.answer
              ? t.correct
              : t.incorrect}
          </div>
          {selectedAnswer !== currentQuestion.answer && (
            <div className="text-sm text-[var(--text-muted)]">
              {t.theAnswerWas}: {getAnswerLabel(currentQuestion.answer)}
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="mb-6">
        <p className="text-center text-[var(--text-muted)] mb-4 text-sm">
          {t.selectAnswer}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((option) => {
            const value =
              type === "interval"
                ? (option as (typeof INTERVAL_OPTIONS)[0]).name
                : (option as (typeof CHORD_OPTIONS)[0]).type;
            const label = option.label[locale];
            const isSelected = selectedAnswer === value;
            const isCorrect = currentQuestion.answer === value;

            let buttonClass =
              "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]";

            if (showResult) {
              if (isCorrect) {
                buttonClass =
                  "bg-[var(--text-primary)] text-[var(--bg-primary)] border border-transparent";
              } else if (isSelected) {
                buttonClass =
                  "bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] opacity-60";
              }
            } else if (isSelected) {
              buttonClass =
                "bg-[var(--text-primary)] text-[var(--bg-primary)] border border-transparent";
            }

            return (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                disabled={showResult}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${buttonClass}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Question */}
      {showResult && (
        <div className="text-center">
          <button
            onClick={generateQuestion}
            className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] rounded-lg text-sm font-medium transition-all"
          >
            {t.newQuestion}
          </button>
        </div>
      )}
    </div>
  );
};

export default EarTrainingQuiz;
