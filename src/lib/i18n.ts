"use client";

export type Locale = "zh" | "en";

export const translations = {
  zh: {
    nav: {
      notes: "笔记",
      write: "写作",
      music: "音乐",
      english: "英语",
    },
    home: {
      subtitle: "音乐制作人",
      title1: "关于声音、",
      title2: "节奏与创作",
      description: "关于音乐制作、聆听体验和创作过程的个人记录。",
      searchPlaceholder: "搜索笔记...",
      recentNotes: "最近笔记",
      noResults: "没有找到结果",
      noNotes: "暂无笔记",
      musicNotes: "音乐笔记",
      englishNotes: "英语笔记",
      allNotes: "全部笔记",
    },
    footer: {
      copyright: "©",
    },
  },
  en: {
    nav: {
      notes: "Notes",
      write: "Write",
      music: "Music",
      english: "English",
    },
    home: {
      subtitle: "Music Producer",
      title1: "Notes on sound,",
      title2: "rhythm & craft",
      description:
        "Personal writings about music production, listening experiences, and creative process.",
      searchPlaceholder: "Search notes...",
      recentNotes: "Recent Notes",
      noResults: "No results found",
      noNotes: "No notes yet",
      musicNotes: "Music Notes",
      englishNotes: "English Notes",
      allNotes: "All Notes",
    },
    footer: {
      copyright: "©",
    },
  },
};

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  return (localStorage.getItem("locale") as Locale) || "zh";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("locale", locale);
}
