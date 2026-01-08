"use client";

import React, { useState } from "react";
import { ChordProgressionData } from "@/lib/musicData";
import { getChordNotes, createChord } from "@/lib/musicTheory";
import PianoKeyboard from "./PianoKeyboard";
import AudioPlayer from "./AudioPlayer";

interface ChordProgressionCardProps {
  progression: ChordProgressionData;
  locale?: "zh" | "en";
  tempo?: number;
}

export const ChordProgressionCard: React.FC<ChordProgressionCardProps> = ({
  progression,
  locale = "zh",
  tempo = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState<number | null>(null);

  const name = locale === "zh" ? progression.nameCn : progression.name;
  const description =
    locale === "zh" ? progression.descriptionCn : progression.description;

  const getHighlightedNotes = (): string[] => {
    if (activeChordIndex !== null && progression.chords[activeChordIndex]) {
      const chord = progression.chords[activeChordIndex];
      return getChordNotes(chord.root, chord.type);
    }
    return [];
  };

  const getChordSymbol = (chord: {
    root: string;
    type: string;
    romanNumeral: string;
  }) => {
    const chordObj = createChord(
      chord.root,
      chord.type as any,
      chord.romanNumeral
    );
    return chordObj.symbol;
  };

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {/* Header */}
      <button
        className="w-full p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              {name}
            </h3>

            {/* Chord Symbols */}
            <div className="flex flex-wrap gap-2 mb-2">
              {progression.chords.map((chord, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-sm font-mono transition-colors cursor-pointer ${
                    activeChordIndex === index
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  onMouseEnter={() => setActiveChordIndex(index)}
                  onMouseLeave={() => setActiveChordIndex(null)}
                >
                  {getChordSymbol(chord)}
                </span>
              ))}
            </div>

            {/* Roman Numerals */}
            <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              {progression.chords.map((chord, index) => (
                <span key={index} className="font-mono">
                  {chord.romanNumeral}
                </span>
              ))}
            </div>
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
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--text-muted)]">
              {locale === "zh"
                ? "和弦可视化（悬停查看）"
                : "Chord Visualization (hover to see)"}
            </h4>
            <PianoKeyboard
              startOctave={3}
              octaves={2}
              highlightedNotes={getHighlightedNotes()}
              interactive={true}
              showLabels={true}
            />
          </div>

          {/* Audio Player */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-muted)]">
              {locale === "zh" ? "播放进行：" : "Play Progression:"}
            </span>
            <AudioPlayer
              progression={{
                chords: progression.chords.map((c) => ({
                  root: c.root,
                  type: c.type as any,
                })),
                beatsPerChord: 2,
              }}
              tempo={tempo}
              size="md"
            />
          </div>

          {/* Example Songs */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--text-muted)]">
              {locale === "zh" ? "示例歌曲" : "Example Songs"}
            </h4>
            <ul className="space-y-1">
              {progression.exampleSongs.map((song, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--text-muted)]">•</span>
                  <span>{song}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chord Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--text-muted)]">
              {locale === "zh" ? "和弦详情" : "Chord Details"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {progression.chords.map((chord, index) => {
                const notes = getChordNotes(chord.root, chord.type as any);
                return (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-[var(--bg-secondary)]"
                  >
                    <div className="font-mono font-medium text-[var(--text-primary)]">
                      {getChordSymbol(chord)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {chord.romanNumeral}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {notes.join(" - ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordProgressionCard;
