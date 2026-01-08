"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  playNote,
  playChord,
  playProgression,
  ChordProgressionAudio,
} from "@/lib/musicAudio";
import { getChordNotes, ChordType } from "@/lib/musicTheory";

interface AudioPlayerProps {
  // 单音符模式
  note?: string;
  // 和弦模式
  chord?: { root: string; type: ChordType };
  // 和弦进行模式
  progression?: {
    chords: { root: string; type: ChordType }[];
    beatsPerChord?: number;
  };
  // 配置
  tempo?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  note,
  chord,
  progression,
  tempo = 120,
  autoPlay = false,
  showControls = true,
  size = "md",
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const stopRef = useRef<(() => void) | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理函数
  const cleanup = useCallback(() => {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // 播放函数
  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      cleanup();
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    try {
      if (note) {
        // 播放单音符
        await playNote(note, 0.5);
        setTimeout(() => {
          setIsPlaying(false);
          setProgress(0);
        }, 500);
      } else if (chord) {
        // 播放和弦
        const notes = getChordNotes(chord.root, chord.type);
        await playChord(notes, 1);
        setTimeout(() => {
          setIsPlaying(false);
          setProgress(0);
        }, 1000);
      } else if (progression) {
        // 播放和弦进行
        const chordNotes = progression.chords.map((c) =>
          getChordNotes(c.root, c.type)
        );
        const progressionData: ChordProgressionAudio = {
          chords: chordNotes,
          beatsPerChord: progression.beatsPerChord || 2,
        };

        const result = await playProgression(progressionData, tempo);
        stopRef.current = result.stop;

        // 更新进度条
        const startTime = Date.now();
        const duration = result.duration * 1000;
        progressIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          setProgress(newProgress);

          if (elapsed >= duration) {
            cleanup();
          }
        }, 50);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      cleanup();
    }
  }, [isPlaying, note, chord, progression, tempo, cleanup]);

  // 停止函数
  const handleStop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // 自动播放
  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
  }, [autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  // 尺寸样式
  const sizeStyles = {
    sm: { button: "w-8 h-8", icon: "w-4 h-4", text: "text-xs" },
    md: { button: "w-10 h-10", icon: "w-5 h-5", text: "text-sm" },
    lg: { button: "w-12 h-12", icon: "w-6 h-6", text: "text-base" },
  };

  const styles = sizeStyles[size];

  if (!showControls) {
    return null;
  }

  return (
    <div className="audio-player flex items-center gap-2">
      {/* 播放/暂停按钮 */}
      <button
        onClick={handlePlay}
        className={`${styles.button} rounded-full flex items-center justify-center transition-colors
          ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        aria-label={isPlaying ? "Stop" : "Play"}
      >
        {isPlaying ? (
          <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* 停止按钮 */}
      {isPlaying && (
        <button
          onClick={handleStop}
          className={`${styles.button} rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white transition-colors`}
          aria-label="Stop"
        >
          <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>
      )}

      {/* 标签 */}
      {label && (
        <span className={`${styles.text} text-gray-600 dark:text-gray-400`}>
          {label}
        </span>
      )}

      {/* 进度条（仅用于和弦进行） */}
      {progression && isPlaying && (
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
