"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import {
  loadProgress,
  getLearningStatistics,
  MusicLearningProgress,
} from "@/lib/musicProgress";
import { getTotalKnowledgePoints } from "@/lib/musicData";

// 主色调：蓝色
const ACCENT_COLOR = "#4488ff";

// SVG Icons for each module
const ModuleIcons = {
  theory: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="theoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.8" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Music Staff Lines */}
      <line
        x1="15"
        y1="30"
        x2="85"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="15"
        y1="40"
        x2="85"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="15"
        y1="50"
        x2="85"
        y2="50"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="15"
        y1="60"
        x2="85"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="15"
        y1="70"
        x2="85"
        y2="70"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Treble Clef simplified */}
      <path
        d="M25 70 Q20 50 30 35 Q35 25 30 40 Q25 55 35 65"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Notes */}
      <ellipse
        cx="50"
        cy="50"
        rx="8"
        ry="6"
        fill="url(#theoryGrad)"
        transform="rotate(-20 50 50)"
      />
      <line
        x1="57"
        y1="50"
        x2="57"
        y2="25"
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="70"
        cy="40"
        rx="8"
        ry="6"
        fill="currentColor"
        opacity="0.6"
        transform="rotate(-20 70 40)"
      />
      <line
        x1="77"
        y1="40"
        x2="77"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  chords: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="chordsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.9" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Piano Keys */}
      <rect
        x="15"
        y="40"
        width="12"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="29"
        y="40"
        width="12"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="43"
        y="40"
        width="12"
        height="40"
        rx="2"
        fill="url(#chordsGrad)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="57"
        y="40"
        width="12"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="71"
        y="40"
        width="12"
        height="40"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Black Keys */}
      <rect
        x="23"
        y="40"
        width="8"
        height="25"
        rx="1"
        fill="currentColor"
        opacity="0.8"
      />
      <rect
        x="37"
        y="40"
        width="8"
        height="25"
        rx="1"
        fill="currentColor"
        opacity="0.8"
      />
      <rect
        x="65"
        y="40"
        width="8"
        height="25"
        rx="1"
        fill="currentColor"
        opacity="0.8"
      />
      {/* Chord Symbol */}
      <text
        x="50"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fill="currentColor"
        fontWeight="bold"
      >
        Cmaj7
      </text>
    </svg>
  ),
  production: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="prodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.8" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Mixer Faders */}
      <rect
        x="20"
        y="25"
        width="10"
        height="50"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="20" y="45" width="10" height="12" rx="1" fill="url(#prodGrad)" />
      <rect
        x="38"
        y="25"
        width="10"
        height="50"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="38"
        y="35"
        width="10"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="56"
        y="25"
        width="10"
        height="50"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="56"
        y="55"
        width="10"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="74"
        y="25"
        width="10"
        height="50"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="74"
        y="40"
        width="10"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Knobs */}
      <circle
        cx="25"
        cy="85"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="43"
        cy="85"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="61"
        cy="85"
        r="6"
        fill="url(#prodGrad)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="79"
        cy="85"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  "ear-training": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.9" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Ear Shape */}
      <path
        d="M55 25 Q75 30 75 50 Q75 75 55 80 Q45 82 40 75 Q35 68 40 60 Q45 55 50 58 Q55 62 52 68"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Sound Waves */}
      <path
        d="M25 40 Q15 50 25 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M30 35 Q17 50 30 65"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M35 30 Q20 50 35 70"
        fill="none"
        stroke="url(#earGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Inner Ear Detail */}
      <circle cx="52" cy="50" r="5" fill="url(#earGrad)" />
    </svg>
  ),
  "song-analysis": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="analysisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.8" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Waveform */}
      <rect
        x="15"
        y="45"
        width="4"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="22"
        y="38"
        width="4"
        height="24"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="29"
        y="30"
        width="4"
        height="40"
        rx="1"
        fill="url(#analysisGrad)"
      />
      <rect
        x="36"
        y="35"
        width="4"
        height="30"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="43"
        y="42"
        width="4"
        height="16"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="50"
        y="32"
        width="4"
        height="36"
        rx="1"
        fill="url(#analysisGrad)"
      />
      <rect
        x="57"
        y="38"
        width="4"
        height="24"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="64"
        y="28"
        width="4"
        height="44"
        rx="1"
        fill="url(#analysisGrad)"
      />
      <rect
        x="71"
        y="40"
        width="4"
        height="20"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="78"
        y="45"
        width="4"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.4"
      />
      {/* Magnifying Glass */}
      <circle
        cx="75"
        cy="25"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="83"
        y1="33"
        x2="90"
        y2="40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M70 22 L75 27 L80 22"
        fill="none"
        stroke={ACCENT_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
  index: number;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  onClick: () => void;
  progress?: number;
}

function ModuleCard({
  id,
  title,
  description,
  path,
  index,
  onHover,
  isHovered,
  onClick,
  progress,
}: ModuleCardProps) {
  const icon = ModuleIcons[id as keyof typeof ModuleIcons];

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`
          relative p-6 rounded-2xl border-2 transition-all duration-500 ease-out
          ${
            isHovered
              ? "border-[#4488ff] shadow-[0_20px_60px_-15px_rgba(68,136,255,0.4)] scale-105 z-10"
              : "border-[var(--border-color)] shadow-lg hover:shadow-xl"
          }
          bg-[var(--bg-card)] backdrop-blur-sm
        `}
      >
        {/* SVG Icon Container */}
        <div
          className={`
            w-24 h-24 mx-auto mb-4 text-[var(--text-primary)] transition-all duration-500
            ${isHovered ? "scale-110 text-[#4488ff]" : ""}
          `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className={`
            text-lg font-semibold text-center mb-2 transition-colors duration-300
            ${isHovered ? "text-[#4488ff]" : "text-[var(--text-primary)]"}
          `}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-muted)] text-center mb-3 line-clamp-2">
          {description}
        </p>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isHovered ? "bg-[#4488ff]" : "bg-[var(--text-muted)]"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center mt-1">
              {progress}%
            </p>
          </div>
        )}

        {/* Hover Glow Effect */}
        <div
          className={`
            absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background:
              "radial-gradient(circle at center, rgba(68,136,255,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Tooltip on hover */}
        <div
          className={`
            absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg
            bg-[#0a0a0a] text-white text-xs whitespace-nowrap
            transition-all duration-300 pointer-events-none
            ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
        >
          Click to explore →
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0a0a0a] rotate-45" />
        </div>
      </div>
    </div>
  );
}

// Lightbox Modal Component
function Lightbox({
  isOpen,
  onClose,
  module,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  module: {
    id: string;
    title: string;
    description: string;
    path: string;
  } | null;
  onNavigate: (path: string) => void;
}) {
  if (!isOpen || !module) return null;

  const icon = ModuleIcons[module.id as keyof typeof ModuleIcons];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

      {/* Modal Content */}
      <div
        className="relative bg-[var(--bg-card)] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#4488ff]/20 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Large SVG Icon */}
        <div className="w-40 h-40 mx-auto mb-6 text-[#4488ff]">{icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-3">
          {module.title}
        </h2>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-center mb-6">
          {module.description}
        </p>

        {/* Action Button */}
        <button
          onClick={() => onNavigate(module.path)}
          className="block w-full py-3 rounded-xl bg-[#4488ff] text-white font-semibold text-center hover:bg-[#3377ee] transition-colors"
        >
          Start Learning →
        </button>
      </div>
    </div>
  );
}

// Custom Cursor Component
function CustomCursor({ isVisible }: { isVisible: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out"
      style={{
        left: position.x - 12,
        top: position.y - 12,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4488ff" fillOpacity="0.3" />
        <circle cx="12" cy="12" r="5" fill="#4488ff" />
      </svg>
    </div>
  );
}

// Mouse Follow Glow Effect
function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
      style={{
        left: position.x - 200,
        top: position.y - 200,
        background: "radial-gradient(circle, #4488ff 0%, transparent 70%)",
      }}
    />
  );
}

export default function MusicPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<MusicLearningProgress | null>(null);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<{
    id: string;
    title: string;
    description: string;
    path: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setProgress(loadProgress());

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

  const t = translations[locale].music;
  const stats = progress
    ? getLearningStatistics(progress, getTotalKnowledgePoints())
    : null;

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  const modules = [
    {
      id: "theory",
      path: "/music/theory",
      title: t.theory,
      description:
        locale === "zh"
          ? "学习音程、和弦、音阶和节奏基础"
          : "Learn intervals, chords, scales, and rhythm",
    },
    {
      id: "chords",
      path: "/music/chords",
      title: t.chords,
      description:
        locale === "zh"
          ? "探索流行、R&B和爵士中的常用和弦进行"
          : "Explore progressions in Pop, R&B, and Jazz",
    },
    {
      id: "production",
      path: "/music/production",
      title: t.production,
      description:
        locale === "zh"
          ? "学习编曲、混音和音色设计"
          : "Learn arrangement, mixing, and sound design",
    },
    {
      id: "ear-training",
      path: "/music/ear-training",
      title: t.earTraining,
      description:
        locale === "zh"
          ? "训练你的耳朵识别音程和和弦"
          : "Train your ear to identify intervals and chords",
    },
    {
      id: "song-analysis",
      path: "/music/song-analysis",
      title: t.songAnalysis,
      description:
        locale === "zh"
          ? "深度分析经典曲目的编曲与混音"
          : "Deep analysis of arrangement and mixing",
    },
  ];

  const handleNavigate = (path: string) => {
    setSelectedModule(null);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Mouse Follow Glow */}
      <MouseGlow />

      {/* Custom Cursor */}
      <CustomCursor isVisible={hoveredModule !== null} />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-muted) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4488ff]/10 text-[#4488ff] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4488ff] animate-pulse" />
            {locale === "zh"
              ? "你的音乐进阶之旅"
              : "Your journey to musical mastery"}
          </div>
          <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-lg mx-auto">
            {locale === "zh"
              ? "从乐理基础到制作技巧，系统学习音乐"
              : "From music theory to production, learn systematically"}
          </p>
        </header>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { value: stats.totalCompleted.toString(), label: t.completed },
              { value: `${stats.streak}`, label: t.streak },
              { value: `${stats.overallProgress}%`, label: t.progress },
              { value: `${stats.earTrainingAccuracy}%`, label: t.accuracy },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#4488ff]/50 transition-all duration-300 group"
              >
                <p className="text-3xl font-bold text-[var(--text-primary)] group-hover:text-[#4488ff] transition-colors">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Module Gallery Grid */}
        <section className="mb-16">
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-8 text-center">
            {locale === "zh" ? "学习模块" : "Learning Modules"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                path={module.path}
                index={index}
                onHover={setHoveredModule}
                isHovered={hoveredModule === module.id}
                onClick={() => setSelectedModule(module)}
                progress={
                  progress?.moduleProgress[
                    module.id as keyof typeof progress.moduleProgress
                  ]
                }
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="text-center">
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-6">
            {locale === "zh" ? "快速开始" : "Quick Start"}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/music/theory"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-[#4488ff] text-white hover:shadow-[0_0_30px_rgba(68,136,255,0.4)] transition-all duration-300"
            >
              {locale === "zh" ? "开始学习乐理" : "Start Music Theory"}
            </Link>
            <Link
              href="/music/ear-training"
              className="px-6 py-3 rounded-full text-sm font-semibold border-2 border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#4488ff] hover:text-[#4488ff] transition-all duration-300"
            >
              {locale === "zh" ? "听感训练" : "Ear Training"}
            </Link>
            <Link
              href="/music/song-analysis"
              className="px-6 py-3 rounded-full text-sm font-semibold border-2 border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#4488ff] hover:text-[#4488ff] transition-all duration-300"
            >
              {locale === "zh" ? "歌曲分析" : "Song Analysis"}
            </Link>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        module={selectedModule}
        onNavigate={handleNavigate}
      />

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
