"use client";

import React, { useMemo, useCallback } from "react";
import { playNote } from "@/lib/musicAudio";
import { noteToMidi } from "@/lib/musicTheory";

interface PianoKeyboardProps {
  startOctave?: number;
  octaves?: number;
  highlightedNotes?: string[];
  highlightColor?: string;
  onKeyClick?: (note: string) => void;
  interactive?: boolean;
  showLabels?: boolean;
}

// 白键和黑键的定义
const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS = ["C#", "D#", null, "F#", "G#", "A#", null]; // null 表示没有黑键

// 黑键相对于白键的位置偏移
const BLACK_KEY_OFFSETS: Record<string, number> = {
  "C#": 0.6,
  "D#": 1.8,
  "F#": 3.6,
  "G#": 4.7,
  "A#": 5.8,
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  startOctave = 3,
  octaves = 2,
  highlightedNotes = [],
  highlightColor = "#3b82f6",
  onKeyClick,
  interactive = true,
  showLabels = true,
}) => {
  // 生成所有键的数据
  const keys = useMemo(() => {
    const allKeys: { note: string; isBlack: boolean; octave: number }[] = [];

    for (let oct = startOctave; oct < startOctave + octaves; oct++) {
      // 白键
      WHITE_KEYS.forEach((key) => {
        allKeys.push({ note: `${key}${oct}`, isBlack: false, octave: oct });
      });
      // 黑键
      BLACK_KEYS.forEach((key) => {
        if (key) {
          allKeys.push({ note: `${key}${oct}`, isBlack: true, octave: oct });
        }
      });
    }

    return allKeys;
  }, [startOctave, octaves]);

  // 分离白键和黑键
  const whiteKeys = useMemo(() => keys.filter((k) => !k.isBlack), [keys]);
  const blackKeys = useMemo(() => keys.filter((k) => k.isBlack), [keys]);

  // 检查音符是否高亮
  const isHighlighted = useCallback(
    (note: string) => {
      // 标准化音符名称进行比较
      const normalizedNote = note.replace("b", "#"); // 简单处理
      return highlightedNotes.some((hn) => {
        const normalizedHn = hn.replace("b", "#");
        return (
          normalizedHn === normalizedNote || noteToMidi(hn) === noteToMidi(note)
        );
      });
    },
    [highlightedNotes]
  );

  // 处理键点击
  const handleKeyClick = useCallback(
    async (note: string) => {
      if (!interactive) return;

      try {
        await playNote(note, 0.5);
      } catch (error) {
        console.error("Failed to play note:", error);
      }

      onKeyClick?.(note);
    },
    [interactive, onKeyClick]
  );

  // 计算白键宽度
  const whiteKeyWidth = 100 / (octaves * 7);
  const blackKeyWidth = whiteKeyWidth * 0.6;

  return (
    <div className="piano-keyboard-container">
      <div
        className="piano-keyboard"
        style={{
          position: "relative",
          height: "150px",
          backgroundColor: "#1a1a1a",
          borderRadius: "0 0 8px 8px",
          padding: "4px",
          userSelect: "none",
        }}
      >
        {/* 白键 */}
        <div style={{ display: "flex", height: "100%", position: "relative" }}>
          {whiteKeys.map((key) => {
            const highlighted = isHighlighted(key.note);
            return (
              <button
                key={key.note}
                onClick={() => handleKeyClick(key.note)}
                disabled={!interactive}
                aria-label={`Piano key ${key.note}`}
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: highlighted ? highlightColor : "#f8f8f8",
                  border: "1px solid #333",
                  borderRadius: "0 0 4px 4px",
                  cursor: interactive ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingBottom: "8px",
                  transition: "background-color 0.1s, transform 0.05s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                onMouseDown={(e) => {
                  if (interactive) {
                    (e.target as HTMLElement).style.transform =
                      "translateY(2px)";
                  }
                }}
                onMouseUp={(e) => {
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {showLabels && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: highlighted ? "#fff" : "#666",
                      fontWeight: highlighted ? "bold" : "normal",
                    }}
                  >
                    {key.note}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 黑键 */}
        {blackKeys.map((key) => {
          const highlighted = isHighlighted(key.note);
          const noteName = key.note.slice(0, -1); // 移除八度数字
          const octaveIndex = key.octave - startOctave;
          const offset = BLACK_KEY_OFFSETS[noteName];
          const leftPosition = (octaveIndex * 7 + offset) * whiteKeyWidth;

          return (
            <button
              key={key.note}
              onClick={() => handleKeyClick(key.note)}
              disabled={!interactive}
              aria-label={`Piano key ${key.note}`}
              style={{
                position: "absolute",
                left: `${leftPosition}%`,
                top: "4px",
                width: `${blackKeyWidth}%`,
                height: "60%",
                backgroundColor: highlighted ? highlightColor : "#1a1a1a",
                border: "1px solid #000",
                borderRadius: "0 0 3px 3px",
                cursor: interactive ? "pointer" : "default",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: "4px",
                transition: "background-color 0.1s, transform 0.05s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
              onMouseDown={(e) => {
                if (interactive) {
                  (e.target as HTMLElement).style.transform = "translateY(2px)";
                }
              }}
              onMouseUp={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {showLabels && (
                <span
                  style={{
                    fontSize: "8px",
                    color: highlighted ? "#fff" : "#888",
                    fontWeight: highlighted ? "bold" : "normal",
                  }}
                >
                  {key.note}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .piano-keyboard-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .piano-keyboard-container {
            overflow-x: auto;
          }
          .piano-keyboard {
            min-width: 500px;
          }
        }
      `}</style>
    </div>
  );
};

export default PianoKeyboard;
