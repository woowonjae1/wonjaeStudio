"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Locale, getStoredLocale, translations } from "@/lib/i18n";
import { getSongById, SongAnalysis, Genre } from "@/lib/songAnalysis";

const ACCENT_COLOR = "#4488ff";

type AnalysisTab =
  | "structure"
  | "arrangement"
  | "composition"
  | "mixing"
  | "sound"
  | "plugins";

const tabs: {
  id: AnalysisTab;
  labelZh: string;
  labelEn: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "structure",
    labelZh: "结构",
    labelEn: "Structure",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="2"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="2"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: "arrangement",
    labelZh: "编曲",
    labelEn: "Arrangement",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="4"
          width="3"
          height="10"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="7.5"
          y="2"
          width="3"
          height="14"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="6"
          width="3"
          height="6"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: "composition",
    labelZh: "作曲",
    labelEn: "Composition",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 12V3L15 2V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "mixing",
    labelZh: "混音",
    labelEn: "Mixing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 5H16M2 9H11M7 13H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "sound",
    labelZh: "音色",
    labelEn: "Sound",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 7V11M6 5V13M9 3V15M12 5V13M15 7V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "plugins",
    labelZh: "插件",
    labelEn: "Plugins",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="5"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="6" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 3V5M13 3V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// Animated Waveform Background
function WaveformBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5">
      <svg
        viewBox="0 0 1200 200"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {[...Array(60)].map((_, i) => (
          <rect
            key={i}
            x={i * 20}
            y={100 - Math.sin(i * 0.3) * 40 - 20}
            width="8"
            height={Math.sin(i * 0.3) * 80 + 40}
            rx="4"
            fill={ACCENT_COLOR}
            className="animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </svg>
    </div>
  );
}

// Song Header Component
function SongHeader({
  song,
  locale,
  onBack,
}: {
  song: SongAnalysis;
  locale: Locale;
  onBack: () => void;
}) {
  const t = translations[locale].music;

  const genreLabels: Record<Genre, { zh: string; en: string }> = {
    rnb: { zh: "R&B", en: "R&B" },
    kpop: { zh: "K-Pop", en: "K-Pop" },
    soul: { zh: "灵魂乐", en: "Soul" },
    pop: { zh: "流行", en: "Pop" },
    hiphop: { zh: "嘻哈", en: "Hip-Hop" },
  };

  return (
    <header className="relative mb-8">
      <WaveformBackground />

      <div className="relative z-10">
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

        {/* Song Info Card */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Album Art Placeholder */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#4488ff]/20 to-[#4488ff]/5 flex items-center justify-center flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={ACCENT_COLOR}
                  strokeWidth="2"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="8"
                  stroke={ACCENT_COLOR}
                  strokeWidth="2"
                />
                <circle cx="24" cy="24" r="3" fill={ACCENT_COLOR} />
              </svg>
            </div>

            {/* Song Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                  {song.title}
                </h1>
                <span className="px-3 py-1 text-xs rounded-full bg-[#4488ff]/10 text-[#4488ff] font-medium">
                  {locale === "zh"
                    ? genreLabels[song.genre].zh
                    : genreLabels[song.genre].en}
                </span>
              </div>

              <p className="text-lg text-[var(--text-secondary)] mb-4">
                {song.artist} • {song.album} ({song.year})
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-sm text-[var(--text-muted)]">
                  🎵 {song.bpm} BPM
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-sm text-[var(--text-muted)]">
                  🎹 {locale === "zh" ? song.keyCn : song.key}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-sm text-[var(--text-muted)]">
                  📊 {song.structure.length}{" "}
                  {locale === "zh" ? "段落" : "sections"}
                </span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <p className="mt-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-6">
            {locale === "zh" ? song.overviewCn : song.overview}
          </p>
        </div>
      </div>
    </header>
  );
}

// Tab Navigation
function TabNavigation({
  activeTab,
  setActiveTab,
  locale,
}: {
  activeTab: AnalysisTab;
  setActiveTab: (tab: AnalysisTab) => void;
  locale: Locale;
}) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap
              transition-all duration-300
              ${
                isActive
                  ? "bg-[#4488ff] text-white shadow-[0_4px_20px_rgba(68,136,255,0.3)]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[#4488ff] hover:text-[#4488ff]"
              }
            `}
          >
            <span
              className={isActive ? "text-white" : "text-[var(--text-muted)]"}
            >
              {tab.icon}
            </span>
            {locale === "zh" ? tab.labelZh : tab.labelEn}
          </button>
        );
      })}
    </div>
  );
}

// Content Card Component
function ContentCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#4488ff]/30 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-[#4488ff]">{icon}</span>}
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// Structure Tab
function StructureTab({
  song,
  locale,
}: {
  song: SongAnalysis;
  locale: Locale;
}) {
  return (
    <div className="space-y-3">
      {song.structure.map((section, index) => (
        <div
          key={index}
          className="group p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#4488ff]/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#4488ff]/10 text-[#4488ff] flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-[#4488ff] transition-colors">
                {locale === "zh" ? section.nameCn : section.name}
              </h4>
            </div>
            <span className="text-sm text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded">
              {section.bars} {locale === "zh" ? "小节" : "bars"}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {locale === "zh" ? section.descriptionCn : section.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(locale === "zh"
              ? section.instrumentsCn
              : section.instruments
            ).map((instrument, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              >
                {instrument}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Arrangement Tab
function ArrangementTab({
  song,
  locale,
}: {
  song: SongAnalysis;
  locale: Locale;
}) {
  return (
    <div className="space-y-4">
      <ContentCard
        title={locale === "zh" ? "编曲概述" : "Overview"}
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2V16M2 9H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      >
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {locale === "zh"
            ? song.arrangement.summaryCn
            : song.arrangement.summary}
        </p>
      </ContentCard>

      <ContentCard
        title={locale === "zh" ? "编曲亮点" : "Highlights"}
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2L11 7H16L12 10.5L13.5 16L9 12.5L4.5 16L6 10.5L2 7H7L9 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        <ul className="space-y-2">
          {(locale === "zh"
            ? song.arrangement.highlightsCn
            : song.arrangement.highlights
          ).map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--text-secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4488ff] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ContentCard>
    </div>
  );
}

// Composition Tab
function CompositionTab({
  song,
  locale,
}: {
  song: SongAnalysis;
  locale: Locale;
}) {
  return (
    <div className="space-y-4">
      <ContentCard
        title={locale === "zh" ? "和弦进行" : "Chord Progression"}
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect
              x="2"
              y="8"
              width="4"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="7"
              y="5"
              width="4"
              height="11"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="12"
              y="2"
              width="4"
              height="14"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        }
      >
        <p className="text-xl font-mono text-[#4488ff] bg-[#4488ff]/5 p-4 rounded-lg">
          {locale === "zh"
            ? song.composition.chordProgressionCn
            : song.composition.chordProgression}
        </p>
      </ContentCard>

      <ContentCard title={locale === "zh" ? "旋律分析" : "Melody"}>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {locale === "zh"
            ? song.composition.melodyCn
            : song.composition.melody}
        </p>
      </ContentCard>

      <ContentCard title={locale === "zh" ? "和声分析" : "Harmony"}>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {locale === "zh"
            ? song.composition.harmonyCn
            : song.composition.harmony}
        </p>
      </ContentCard>
    </div>
  );
}

// Mixing Tab
function MixingTab({ song, locale }: { song: SongAnalysis; locale: Locale }) {
  return (
    <div className="space-y-4">
      <ContentCard title={locale === "zh" ? "混音概述" : "Overview"}>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {locale === "zh" ? song.mixing.summaryCn : song.mixing.summary}
        </p>
      </ContentCard>

      <ContentCard title={locale === "zh" ? "混音技巧" : "Techniques"}>
        <ul className="space-y-2">
          {(locale === "zh"
            ? song.mixing.techniquesCn
            : song.mixing.techniques
          ).map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--text-secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4488ff] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ContentCard>
    </div>
  );
}

// Sound Design Tab
function SoundDesignTab({
  song,
  locale,
}: {
  song: SongAnalysis;
  locale: Locale;
}) {
  return (
    <div className="space-y-4">
      <ContentCard title={locale === "zh" ? "音色设计概述" : "Overview"}>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {locale === "zh"
            ? song.soundDesign.summaryCn
            : song.soundDesign.summary}
        </p>
      </ContentCard>

      <ContentCard title={locale === "zh" ? "关键音色元素" : "Key Elements"}>
        <ul className="space-y-2">
          {(locale === "zh"
            ? song.soundDesign.keyElementsCn
            : song.soundDesign.keyElements
          ).map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--text-secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4488ff] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ContentCard>
    </div>
  );
}

// Plugins Tab
function PluginsTab({ song, locale }: { song: SongAnalysis; locale: Locale }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-muted)] mb-4">
        {locale === "zh"
          ? "以下插件可以帮助你实现类似的声音效果"
          : "These plugins can help achieve similar sounds"}
      </p>
      {song.plugins.map((plugin, index) => (
        <div
          key={index}
          className="group p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#4488ff]/50 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-[#4488ff] transition-colors">
              {plugin.name}
            </h4>
            <span className="px-2 py-1 text-xs rounded-full bg-[#4488ff]/10 text-[#4488ff]">
              {locale === "zh" ? plugin.typeCn : plugin.type}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {locale === "zh" ? plugin.usageCn : plugin.usage}
          </p>
        </div>
      ))}
    </div>
  );
}

// Takeaways Section
function TakeawaysSection({
  song,
  locale,
}: {
  song: SongAnalysis;
  locale: Locale;
}) {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#4488ff]/10 to-transparent border border-[#4488ff]/20">
      <h3 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L12.5 7.5H18L13.5 11.5L15.5 17L10 13.5L4.5 17L6.5 11.5L2 7.5H7.5L10 2Z"
            fill="#4488ff"
          />
        </svg>
        {locale === "zh" ? "学习要点" : "Key Takeaways"}
      </h3>
      <ul className="space-y-3">
        {(locale === "zh" ? song.takeawaysCn : song.takeaways).map(
          (item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--text-secondary)]"
            >
              <span className="w-6 h-6 rounded-full bg-[#4488ff]/20 text-[#4488ff] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function SongDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [locale, setLocale] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("structure");
  const [song, setSong] = useState<SongAnalysis | null>(null);

  useEffect(() => {
    setMounted(true);
    setLocale(getStoredLocale());

    const songId = params.id as string;
    const foundSong = getSongById(songId);
    setSong(foundSong || null);

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
  }, [params.id]);

  const t = translations[locale].music;

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--bg-primary)]" />;
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 8V16L22 22"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="var(--text-muted)"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-[var(--text-muted)] text-lg mb-4">
            {locale === "zh" ? "歌曲未找到" : "Song not found"}
          </p>
          <button
            onClick={() => router.push("/music/song-analysis")}
            className="px-4 py-2 rounded-lg bg-[#4488ff] text-white hover:bg-[#3377ee] transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <SongHeader
          song={song}
          locale={locale}
          onBack={() => router.push("/music/song-analysis")}
        />

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          locale={locale}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "structure" && (
            <StructureTab song={song} locale={locale} />
          )}
          {activeTab === "arrangement" && (
            <ArrangementTab song={song} locale={locale} />
          )}
          {activeTab === "composition" && (
            <CompositionTab song={song} locale={locale} />
          )}
          {activeTab === "mixing" && <MixingTab song={song} locale={locale} />}
          {activeTab === "sound" && (
            <SoundDesignTab song={song} locale={locale} />
          )}
          {activeTab === "plugins" && (
            <PluginsTab song={song} locale={locale} />
          )}
        </div>

        <TakeawaysSection song={song} locale={locale} />
      </div>
    </div>
  );
}
