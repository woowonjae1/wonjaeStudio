"use client";

import React, { useState } from "react";
import { KnowledgePoint } from "@/lib/musicData";
import { getChordNotes, getScaleNotes, transposeNote } from "@/lib/musicTheory";
import PianoKeyboard from "./PianoKeyboard";
import AudioPlayer from "./AudioPlayer";

interface KnowledgePointCardProps {
  knowledgePoint: KnowledgePoint;
  locale?: "zh" | "en";
  isCompleted?: boolean;
  onComplete?: (id: string) => void;
  expanded?: boolean;
}

const difficultyLabels = {
  beginner: { en: "Beginner", zh: "入门" },
  intermediate: { en: "Intermediate", zh: "中级" },
  advanced: { en: "Advanced", zh: "高级" },
};

export const KnowledgePointCard: React.FC<KnowledgePointCardProps> = ({
  knowledgePoint,
  locale = "zh",
  isCompleted = false,
  onComplete,
  expanded: initialExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const kp = knowledgePoint;

  const title = locale === "zh" ? kp.titleCn : kp.title;
  const description = locale === "zh" ? kp.descriptionCn : kp.description;
  const tips = locale === "zh" ? kp.tipsCn : kp.tips;
  const difficultyLabel = difficultyLabels[kp.difficulty][locale];

  const getHighlightedNotes = (): string[] => {
    if (kp.visualExample?.highlightedNotes) {
      return kp.visualExample.highlightedNotes;
    }
    if (kp.audioExample?.notes) {
      return kp.audioExample.notes;
    }
    if (kp.audioExample?.chordType) {
      return getChordNotes("C4", kp.audioExample.chordType);
    }
    if (kp.audioExample?.scaleType) {
      return getScaleNotes("C4", kp.audioExample.scaleType);
    }
    if (kp.audioExample?.intervalName) {
      const intervals: Record<string, number> = {
        unison: 0,
        minor2nd: 1,
        major2nd: 2,
        minor3rd: 3,
        major3rd: 4,
        perfect4th: 5,
        tritone: 6,
        perfect5th: 7,
        minor6th: 8,
        major6th: 9,
        minor7th: 10,
        major7th: 11,
        octave: 12,
      };
      const semitones = intervals[kp.audioExample.intervalName] || 0;
      return ["C4", transposeNote("C4", semitones)];
    }
    return [];
  };

  const getAudioData = () => {
    if (kp.audioExample?.notes && kp.audioExample.notes.length === 1) {
      return { note: kp.audioExample.notes[0] };
    }
    if (kp.audioExample?.chordType) {
      return { chord: { root: "C4", type: kp.audioExample.chordType } };
    }
    if (kp.audioExample?.notes && kp.audioExample.notes.length > 1) {
      return {
        chord: { root: kp.audioExample.notes[0], type: "major" as const },
      };
    }
    return null;
  };

  const highlightedNotes = getHighlightedNotes();
  const audioData = getAudioData();

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCompleted
          ? "border-[var(--text-primary)] bg-[var(--bg-card)]"
          : "border-[var(--border-color)] bg-[var(--bg-card)]"
      }`}
    >
      {/* Header */}
      <button
        className="w-full p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-[var(--text-primary)]">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded text-xs text-[var(--text-muted)] border border-[var(--border-color)]">
                {difficultyLabel}
              </span>
              {isCompleted && (
                <span className="text-[var(--text-primary)]">✓</span>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)] line-clamp-2">
              {description}
            </p>
          </div>

          <span
            className={`text-[var(--text-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            ↓
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-color)] pt-4">
          <p className="text-[var(--text-secondary)]">{description}</p>

          {/* Piano Keyboard */}
          {highlightedNotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text-muted)]">
                {locale === "zh" ? "可视化" : "Visualization"}
              </h4>
              <PianoKeyboard
                startOctave={3}
                octaves={2}
                highlightedNotes={highlightedNotes}
                interactive={true}
                showLabels={true}
              />
            </div>
          )}

          {/* Audio Player */}
          {audioData && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">
                {locale === "zh" ? "听一听：" : "Listen:"}
              </span>
              <AudioPlayer {...audioData} size="sm" />
            </div>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text-muted)]">
                {locale === "zh" ? "提示" : "Tips"}
              </h4>
              <ul className="space-y-1">
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
          )}

          {/* Complete Button */}
          {!isCompleted && onComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(kp.id);
              }}
              className="w-full py-2 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg transition-opacity hover:opacity-90 text-sm font-medium"
            >
              {locale === "zh" ? "标记为已完成" : "Mark as Complete"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgePointCard;
