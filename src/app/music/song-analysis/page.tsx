"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import { SONG_ANALYSES, Genre, SongAnalysis } from "@/lib/songAnalysis";

const ACCENT_COLOR = "#4488ff";

// Genre filter tabs
const genres: { id: Genre | "all"; labelZh: string; labelEn: string }[] = [
  { id: "all", labelZh: "全部", labelEn: "All" },
  { id: "rnb", labelZh: "R&B", labelEn: "R&B" },
  { id: "kpop", labelZh: "K-Pop", labelEn: "K-Pop" },
];

// Waveform SVG for song cards
function WaveformIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
          <stop offset="50%" stopColor={ACCENT_COLOR} stopOpacity="0.8" />
          <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[...Array(24)].map((_, i) => {
        const height =
          Math.sin((i / 24) * Math.PI * 2 + 1) * 15 + Math.random() * 10 + 10;
        return (
          <rect
            key={i}
            x={i * 5}
            y={30 - height / 2}
            width="3"
            height={height}
            rx="1.5"
            fill={isHovered ? "url(#waveGrad)" : "currentColor"}
            opacity={isHovered ? 1 : 0.4}
            className="transition-all duration-300"
            style={{
              transform: isHovered
                ? `scaleY(${1 + Math.sin(i * 0.5) * 0.2})`
                : "scaleY(1)",
              transformOrigin: "center",
            }}
          />
        );
      })}
    </svg>
  );
}

// Song Card Component
function SongCard({
  song,
  locale,
  index,
  onClick,
}: {
  song: SongAnalysis;
  locale: Locale;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const genreLabels: Record<Genre, { zh: string; en: string }> = {
    rnb: { zh: "R&B", en: "R&B" },
    kpop: { zh: "K-Pop", en: "K-Pop" },
    soul: { zh: "灵魂乐", en: "Soul" },
    pop: { zh: "流行", en: "Pop" },
    hiphop: { zh: "嘻哈", en: "Hip-Hop" },
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`
          relative p-6 rounded-2xl border-2 transition-all duration-500 ease-out
          ${
            isHovered
              ? "border-[#4488ff] shadow-[0_20px_60px_-15px_rgba(68,136,255,0.3)] scale-[1.02]"
              : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
          }
          bg-[var(--bg-card)]
        `}
      >
        <div className="flex gap-6">
          {/* Waveform Visualization */}
          <div
            className={`
              w-32 h-16 flex-shrink-0 text-[var(--text-muted)] transition-all duration-500
              ${isHovered ? "text-[#4488ff]" : ""}
            `}
          >
            <WaveformIcon isHovered={isHovered} />
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`
                  text-lg font-semibold truncate transition-colors duration-300
                  ${isHovered ? "text-[#4488ff]" : "text-[var(--text-primary)]"}
                `}
              >
                {song.title}
              </h3>
              <span
                className={`
                  px-2 py-0.5 text-xs rounded-full flex-shrink-0 transition-all duration-300
                  ${
                    isHovered
                      ? "bg-[#4488ff] text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  }
                `}
              >
                {locale === "zh"
                  ? genreLabels[song.genre].zh
                  : genreLabels[song.genre].en}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-2">
              {song.artist} • {song.year}
            </p>

            <p className="text-sm text-[var(--text-muted)] line-clamp-2">
              {locale === "zh" ? song.overviewCn : song.overview}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-3">
              <span
                className={`
                  text-xs px-2 py-1 rounded-lg transition-all duration-300
                  ${
                    isHovered
                      ? "bg-[#4488ff]/10 text-[#4488ff]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  }
                `}
              >
                {song.bpm} BPM
              </span>
              <span
                className={`
                  text-xs px-2 py-1 rounded-lg transition-all duration-300
                  ${
                    isHovered
                      ? "bg-[#4488ff]/10 text-[#4488ff]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  }
                `}
              >
                {locale === "zh" ? song.keyCn : song.key}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {song.structure.length} {locale === "zh" ? "段落" : "sections"}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div
            className={`
              flex items-center justify-center w-10 h-10 rounded-full self-center flex-shrink-0
              transition-all duration-300
              ${
                isHovered
                  ? "bg-[#4488ff] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              }
            `}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Hover Glow */}
        <div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(68,136,255,0.05) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

// Header with animated background
function PageHeader({
  locale,
  onBack,
}: {
  locale: Locale;
  onBack: () => void;
}) {
  const t = translations[locale].music;

  return (
    <header className="relative mb-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-[var(--text-muted)] hover:text-[#4488ff] transition-colors mb-6"
      >
        <span className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center group-hover:border-[#4488ff] group-hover:bg-[#4488ff]/10 transition-all">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 3L4 7L9 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm font-medium">{t.back}</span>
      </button>

      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#4488ff]/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="2" height="8" rx="1" fill="#4488ff" />
                <rect x="7" y="5" width="2" height="14" rx="1" fill="#4488ff" />
                <rect
                  x="11"
                  y="3"
                  width="2"
                  height="18"
                  rx="1"
                  fill="#4488ff"
                />
                <rect
                  x="15"
                  y="6"
                  width="2"
                  height="12"
                  rx="1"
                  fill="#4488ff"
                />
                <rect x="19" y="9" width="2" height="6" rx="1" fill="#4488ff" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {t.songAnalysis}
              </h1>
              <p className="text-[var(--text-muted)] text-sm">
                {SONG_ANALYSES.length} {locale === "zh" ? "首歌曲" : "songs"}
              </p>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] max-w-lg">
            {locale === "zh"
              ? "深度分析经典曲目的编曲、作曲、混音与音色设计"
              : "Deep analysis of arrangement, composition, mixing and sound design"}
          </p>
        </div>
      </div>
    </header>
  );
}

// Filter & Search Bar
function FilterBar({
  locale,
  activeGenre,
  setActiveGenre,
  searchQuery,
  setSearchQuery,
}: {
  locale: Locale;
  activeGenre: Genre | "all";
  setActiveGenre: (genre: Genre | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path
            d="M13.5 13.5L17 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder={
            locale === "zh" ? "搜索歌曲或艺人..." : "Search songs or artists..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#4488ff] transition-colors"
        />
      </div>

      {/* Genre Filters */}
      <div className="flex gap-2">
        {genres.map((genre) => {
          const isActive = activeGenre === genre.id;
          const count =
            genre.id === "all"
              ? SONG_ANALYSES.length
              : SONG_ANALYSES.filter((s) => s.genre === genre.id).length;

          return (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-[#4488ff] text-white shadow-[0_4px_20px_rgba(68,136,255,0.3)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[#4488ff] hover:text-[#4488ff]"
                }
              `}
            >
              {locale === "zh" ? genre.labelZh : genre.labelEn}
              <span
                className={`ml-2 ${isActive ? "opacity-80" : "opacity-50"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Progress indicator at top
function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--bg-secondary)] z-50">
      <div
        className="h-full bg-[#4488ff] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Mouse Glow Effect
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
      className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl transition-all duration-500 ease-out"
      style={{
        left: position.x - 250,
        top: position.y - 250,
        background: "radial-gradient(circle, #4488ff 0%, transparent 70%)",
      }}
    />
  );
}

export default function SongAnalysisPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [activeGenre, setActiveGenre] = useState<Genre | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };
    window.addEventListener(
      "localeChange",
      handleLocaleChange as EventListener
    );

    // Scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "localeChange",
        handleLocaleChange as EventListener
      );
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredSongs = SONG_ANALYSES.filter((song) => {
    const matchesGenre = activeGenre === "all" || song.genre === activeGenre;
    const matchesSearch =
      searchQuery === "" ||
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Progress Bar */}
      <ProgressBar current={scrollProgress} total={100} />

      {/* Mouse Glow */}
      <MouseGlow />

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-muted) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <PageHeader locale={locale} onBack={() => router.push("/music")} />

        <FilterBar
          locale={locale}
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Song List */}
        <div className="space-y-4">
          {filteredSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              locale={locale}
              index={index}
              onClick={() => router.push(`/music/song-analysis/${song.id}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSongs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle
                  cx="14"
                  cy="14"
                  r="10"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                />
                <path
                  d="M21 21L28 28"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-[var(--text-muted)] text-lg">
              {locale === "zh"
                ? "没有找到匹配的歌曲"
                : "No matching songs found"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveGenre("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm text-[#4488ff] hover:bg-[#4488ff]/10 transition-colors"
            >
              {locale === "zh" ? "清除筛选" : "Clear filters"}
            </button>
          </div>
        )}

        {/* Results Count */}
        {filteredSongs.length > 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            {locale === "zh"
              ? `显示 ${filteredSongs.length} 首歌曲`
              : `Showing ${filteredSongs.length} songs`}
          </div>
        )}
      </div>
    </div>
  );
}
