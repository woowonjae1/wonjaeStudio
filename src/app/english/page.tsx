"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getStats,
  getTodayReviewWords,
  LearningStats,
} from "@/lib/englishLearning";
import { Locale, getStoredLocale } from "@/lib/i18n";

// SVG Icons for each module
const ModuleIcons = {
  speaking: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="speakingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#44ffbb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="40"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M32 65 Q50 80 68 65"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="40"
        r="6"
        fill="url(#speakingGrad)"
        className="animate-pulse"
      />
      <path
        d="M25 45 Q15 50 25 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M75 45 Q85 50 75 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M20 40 Q8 50 20 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M80 40 Q92 50 80 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  ),
  pronunciation: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="pronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#44ffbb" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M20 50 Q35 30 50 50 Q65 70 80 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 50 Q35 70 50 50 Q65 30 80 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="50" cy="50" r="8" fill="url(#pronGrad)" />
      <circle cx="30" cy="50" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="70" cy="50" r="4" fill="currentColor" opacity="0.3" />
      <path
        d="M45 25 L55 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M45 75 L55 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  vocabulary: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="vocabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#44ffbb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect
        x="25"
        y="20"
        width="50"
        height="60"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="32"
        y1="35"
        x2="68"
        y2="35"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line
        x1="32"
        y1="45"
        x2="60"
        y2="45"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="32"
        y1="55"
        x2="65"
        y2="55"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line
        x1="32"
        y1="65"
        x2="55"
        y2="65"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <circle cx="68" cy="65" r="12" fill="url(#vocabGrad)" />
      <text
        x="68"
        y="70"
        textAnchor="middle"
        fontSize="14"
        fill="currentColor"
        fontWeight="bold"
      >
        A
      </text>
    </svg>
  ),
  flashcard: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="flashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#44ffbb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect
        x="20"
        y="30"
        width="45"
        height="35"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
        transform="rotate(-5 42.5 47.5)"
      />
      <rect
        x="25"
        y="35"
        width="45"
        height="35"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
        transform="rotate(0 47.5 52.5)"
      />
      <rect
        x="30"
        y="40"
        width="45"
        height="35"
        rx="4"
        fill="url(#flashGrad)"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(5 52.5 57.5)"
      />
      <circle
        cx="70"
        cy="30"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M65 30 L70 35 L78 25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  spelling: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="spellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44ffbb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#44ffbb" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect
        x="20"
        y="55"
        width="18"
        height="25"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="41"
        y="55"
        width="18"
        height="25"
        rx="3"
        fill="url(#spellGrad)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="62"
        y="55"
        width="18"
        height="25"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text x="29" y="72" textAnchor="middle" fontSize="12" fill="currentColor">
        A
      </text>
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        fontWeight="bold"
      >
        B
      </text>
      <text x="71" y="72" textAnchor="middle" fontSize="12" fill="currentColor">
        C
      </text>
      <path
        d="M40 35 Q50 20 60 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="40" r="3" fill="currentColor" />
    </svg>
  ),
};

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  stat: string;
  icon: React.ReactNode;
  index: number;
  onHover: (id: string | null) => void;
  isHovered: boolean;
  onClick: () => void;
}

function ModuleCard({
  id,
  title,
  description,
  href,
  stat,
  icon,
  index,
  onHover,
  isHovered,
  onClick,
}: ModuleCardProps) {
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
              ? "border-[#44ffbb] shadow-[0_20px_60px_-15px_rgba(68,255,187,0.3)] scale-105 z-10"
              : "border-[var(--border-color)] shadow-lg hover:shadow-xl"
          }
          bg-[var(--bg-card)] backdrop-blur-sm
        `}
      >
        {/* SVG Icon Container */}
        <div
          className={`
            w-24 h-24 mx-auto mb-4 text-[var(--text-primary)] transition-all duration-500
            ${isHovered ? "scale-110 text-[#44ffbb]" : ""}
          `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className={`
            text-lg font-semibold text-center mb-2 transition-colors duration-300
            ${isHovered ? "text-[#44ffbb]" : "text-[var(--text-primary)]"}
          `}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-muted)] text-center mb-3 line-clamp-2">
          {description}
        </p>

        {/* Stat Badge */}
        <div className="flex justify-center">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
              ${
                isHovered
                  ? "bg-[#44ffbb] text-[#0a0a0a]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              }
            `}
          >
            {stat}
          </span>
        </div>

        {/* Hover Glow Effect */}
        <div
          className={`
            absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background:
              "radial-gradient(circle at center, rgba(68,255,187,0.1) 0%, transparent 70%)",
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
}: {
  isOpen: boolean;
  onClose: () => void;
  module: {
    id: string;
    title: string;
    description: string;
    href: string;
    stat: string;
  } | null;
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
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#44ffbb]/20 transition-all"
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
        <div className="w-40 h-40 mx-auto mb-6 text-[#44ffbb]">{icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-3">
          {module.title}
        </h2>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-center mb-6">
          {module.description}
        </p>

        {/* Stat */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-2 rounded-full bg-[#44ffbb]/20 text-[#44ffbb] font-medium">
            {module.stat}
          </span>
        </div>

        {/* Action Button */}
        <Link
          href={module.href}
          className="block w-full py-3 rounded-xl bg-[#44ffbb] text-[#0a0a0a] font-semibold text-center hover:bg-[#33eebb] transition-colors"
        >
          Start Learning →
        </Link>
      </div>
    </div>
  );
}

// Custom Cursor Component
function CustomCursor({ isVisible }: { isVisible: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
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
      ref={cursorRef}
      className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out"
      style={{
        left: position.x - 12,
        top: position.y - 12,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#44ffbb" fillOpacity="0.3" />
        <circle cx="12" cy="12" r="5" fill="#44ffbb" />
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
        background: "radial-gradient(circle, #44ffbb 0%, transparent 70%)",
      }}
    />
  );
}

export default function EnglishPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<{
    id: string;
    title: string;
    description: string;
    href: string;
    stat: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());
    setStats(getStats());

    const words = getTodayReviewWords();
    setReviewCount(words.length);

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

  if (!mounted || !stats) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  const modules = [
    {
      id: "speaking",
      title: locale === "zh" ? "口语练习" : "Speaking",
      description:
        locale === "zh"
          ? "日常对话 & 雅思口语话题"
          : "Daily conversation & IELTS topics",
      href: "/english/speaking",
      stat: locale === "zh" ? "核心" : "Core",
    },
    {
      id: "pronunciation",
      title: locale === "zh" ? "发音技巧" : "Pronunciation",
      description:
        locale === "zh"
          ? "连读、弱读、语调、重音"
          : "Linking, weak forms, intonation",
      href: "/english/pronunciation",
      stat: locale === "zh" ? "专项" : "Skills",
    },
    {
      id: "vocabulary",
      title: locale === "zh" ? "单词学习" : "Vocabulary",
      description:
        locale === "zh"
          ? "从基础到雅思核心词汇"
          : "From basic to IELTS vocabulary",
      href: "/english/vocabulary",
      stat: `${stats.totalWords} ${locale === "zh" ? "词" : "words"}`,
    },
    {
      id: "flashcard",
      title: locale === "zh" ? "闪卡复习" : "Flashcards",
      description:
        locale === "zh" ? "间隔重复记忆" : "Spaced repetition memory",
      href: "/english/flashcard",
      stat: `${reviewCount} ${locale === "zh" ? "待复习" : "to review"}`,
    },
    {
      id: "spelling",
      title: locale === "zh" ? "单词默写" : "Spelling",
      description:
        locale === "zh" ? "听音拼写，强化记忆" : "Listen and spell practice",
      href: "/english/spelling",
      stat: locale === "zh" ? "练习" : "Practice",
    },
  ];

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#44ffbb]/10 text-[#44ffbb] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#44ffbb] animate-pulse" />
            {locale === "zh" ? "目标：流利口语交流" : "Goal: Fluent Speaking"}
          </div>
          <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            {locale === "zh" ? "英语学习" : "English Learning"}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-lg mx-auto">
            {locale === "zh"
              ? "从零口语到自信交流，每天进步一点点"
              : "From zero speaking to confident communication"}
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            {
              value: stats.streak,
              label: locale === "zh" ? "连续天数" : "Day Streak",
            },
            {
              value: stats.masteredWords,
              label: locale === "zh" ? "已掌握" : "Mastered",
            },
            {
              value: stats.learningWords,
              label: locale === "zh" ? "学习中" : "Learning",
            },
            {
              value: stats.todayReviewed,
              label: locale === "zh" ? "今日复习" : "Today",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#44ffbb]/50 transition-all duration-300 group"
            >
              <p className="text-3xl font-bold text-[var(--text-primary)] group-hover:text-[#44ffbb] transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Module Gallery Grid */}
        <section className="mb-16">
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-widest uppercase mb-8 text-center">
            {locale === "zh" ? "学习模块" : "Learning Modules"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                {...module}
                icon={ModuleIcons[module.id as keyof typeof ModuleIcons]}
                index={index}
                onHover={setHoveredModule}
                isHovered={hoveredModule === module.id}
                onClick={() => setSelectedModule(module)}
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
              href="/english/speaking"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-[#44ffbb] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(68,255,187,0.4)] transition-all duration-300"
            >
              {locale === "zh" ? "开始口语练习" : "Start Speaking"}
            </Link>
            <Link
              href="/english/flashcard"
              className="px-6 py-3 rounded-full text-sm font-semibold border-2 border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#44ffbb] hover:text-[#44ffbb] transition-all duration-300"
            >
              {locale === "zh"
                ? `复习 ${reviewCount} 个单词`
                : `Review ${reviewCount} words`}
            </Link>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        module={selectedModule}
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
