"use client";

import React, { useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export default function MusicPlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    togglePlay,
    next,
    previous,
    setCurrentTime,
    setVolume,
  } = usePlayerStore();

  // 处理音频播放/暂停
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // 更新音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 更新当前时间
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 处理时间跳转
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 处理音频结束
  const handleEnded = () => {
    next();
  };

  if (!currentTrack) {
    return null; // 不显示播放器
  }

  const duration = audioRef.current?.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-elevated-base)] border-t border-[var(--decorative-subdued)]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 左侧：当前播放信息 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentTrack.albumCover}
                alt={currentTrack.title}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-[var(--text-base)]">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[var(--text-subdued)] truncate">
                  {currentTrack.artist}
                </p>
              </div>

              {/* 收藏按钮 */}
              <button
                className="p-2 hover:text-[var(--spotify-green)] transition-colors text-[var(--text-subdued)]"
                aria-label="收藏"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5L10.5 6.5L16 7.5L12 11.5L13 16.5L8 14L3 16.5L4 11.5L0 7.5L5.5 6.5L8 1.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>

            {/* 中间：播放控制 */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
              <div className="flex items-center gap-4">
                {/* 上一首 */}
                <button
                  onClick={previous}
                  className="p-2 hover:text-[var(--text-base)] text-[var(--text-subdued)] transition-colors"
                  aria-label="上一首"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
                  </svg>
                </button>

                {/* 播放/暂停 */}
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform"
                  aria-label={isPlaying ? "暂停" : "播放"}
                >
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#000">
                      <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#000">
                      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                    </svg>
                  )}
                </button>

                {/* 下一首 */}
                <button
                  onClick={next}
                  className="p-2 hover:text-[var(--text-base)] text-[var(--text-subdued)] transition-colors"
                  aria-label="下一首"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
                  </svg>
                </button>
              </div>

              {/* 进度条 */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-[var(--text-subdued)] font-mono min-w-[40px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="progress-bar flex-1 group" onClick={handleSeek}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-subdued)] font-mono min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* 右侧：音量控制 */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button className="p-2 text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M9.741.85a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75V1.6a.75.75 0 0 1 .75-.75h.799zm-4.852 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75h.799zm9.713-1a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75h.799z" />
                </svg>
              </button>

              <button
                className="p-2 text-[var(--text-subdued)] hover:text-[var(--text-base)] transition-colors"
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              >
                {volume > 0.5 ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M9.741.85a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75V1.6a.75.75 0 0 1 .75-.75h.799zm-6.924 5.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 .75-.75h.799zm4.912-1.5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75v-5a.75.75 0 0 1 .75-.75h.799z" />
                  </svg>
                ) : volume > 0 ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M9.741.85a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75V1.6a.75.75 0 0 1 .75-.75h.799zm-6.924 5.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.75.75h-.799a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 .75-.75h.799z" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" />
                    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-[var(--bg-elevated-highlight)] rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--spotify-green) 0%, var(--spotify-green) ${volume * 100}%, var(--bg-elevated-highlight) ${volume * 100}%, var(--bg-elevated-highlight) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
