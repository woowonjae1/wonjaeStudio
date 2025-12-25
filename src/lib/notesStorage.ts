"use client";

// 笔记类型定义
export type NoteType = "fleeting" | "literature" | "permanent";
export type NoteTemplate =
  | "blank"
  | "song-analysis"
  | "music-theory"
  | "listening-notes"
  | "practice-log";

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  template: NoteTemplate;
  tags: string[];
  links: string[]; // 双向链接的笔记ID
  backlinks: string[]; // 被哪些笔记引用
  musicEmbed?: string;
  audioClip?: {
    url: string;
    startTime: number;
    endTime: number;
  };
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface NotesState {
  notes: Note[];
  lastUpdated: string;
}

const STORAGE_KEY = "woowonjae_notes";
const DRAFTS_KEY = "woowonjae_drafts";

// 获取所有笔记
export function getAllNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const state: NotesState = JSON.parse(data);
    return state.notes || [];
  } catch {
    return [];
  }
}

// 保存笔记
export function saveNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt" | "backlinks">
): Note {
  const notes = getAllNotes();
  const now = new Date().toISOString();

  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    backlinks: [],
  };

  // 更新双向链接
  newNote.links.forEach((linkedId) => {
    const linkedNote = notes.find((n) => n.id === linkedId);
    if (linkedNote && !linkedNote.backlinks.includes(newNote.id)) {
      linkedNote.backlinks.push(newNote.id);
    }
  });

  notes.push(newNote);
  saveAllNotes(notes);
  return newNote;
}

// 更新笔记
export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = getAllNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const oldNote = notes[index];
  const updatedNote = {
    ...oldNote,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // 处理链接变化
  const oldLinks = new Set(oldNote.links);
  const newLinks = new Set(updatedNote.links);

  // 移除旧的反向链接
  oldLinks.forEach((linkedId) => {
    if (!newLinks.has(linkedId)) {
      const linkedNote = notes.find((n) => n.id === linkedId);
      if (linkedNote) {
        linkedNote.backlinks = linkedNote.backlinks.filter((bl) => bl !== id);
      }
    }
  });

  // 添加新的反向链接
  newLinks.forEach((linkedId) => {
    if (!oldLinks.has(linkedId)) {
      const linkedNote = notes.find((n) => n.id === linkedId);
      if (linkedNote && !linkedNote.backlinks.includes(id)) {
        linkedNote.backlinks.push(id);
      }
    }
  });

  notes[index] = updatedNote;
  saveAllNotes(notes);
  return updatedNote;
}

// 删除笔记
export function deleteNote(id: string): boolean {
  const notes = getAllNotes();
  const noteToDelete = notes.find((n) => n.id === id);
  if (!noteToDelete) return false;

  // 移除所有反向链接
  noteToDelete.links.forEach((linkedId) => {
    const linkedNote = notes.find((n) => n.id === linkedId);
    if (linkedNote) {
      linkedNote.backlinks = linkedNote.backlinks.filter((bl) => bl !== id);
    }
  });

  const filtered = notes.filter((n) => n.id !== id);
  saveAllNotes(filtered);
  return true;
}

// 获取单个笔记
export function getNoteById(id: string): Note | null {
  const notes = getAllNotes();
  return notes.find((n) => n.id === id) || null;
}

// 搜索笔记
export function searchNotes(query: string): Note[] {
  const notes = getAllNotes();
  const lowerQuery = query.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// 按类型获取笔记
export function getNotesByType(type: NoteType): Note[] {
  return getAllNotes().filter((n) => n.type === type && !n.isArchived);
}

// 获取随机笔记
export function getRandomNote(): Note | null {
  const notes = getAllNotes().filter((n) => !n.isArchived);
  if (notes.length === 0) return null;
  return notes[Math.floor(Math.random() * notes.length)];
}

// 获取今日笔记
export function getTodayNotes(): Note[] {
  const today = new Date().toDateString();
  return getAllNotes().filter((n) => {
    const noteDate = new Date(n.createdAt).toDateString();
    return noteDate === today;
  });
}

// 获取本周笔记
export function getWeekNotes(): Note[] {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getAllNotes().filter((n) => new Date(n.createdAt) >= weekAgo);
}

// 草稿相关
export function saveDraft(content: string, title: string = ""): void {
  if (typeof window === "undefined") return;
  const draft = { content, title, savedAt: new Date().toISOString() };
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(draft));
}

export function getDraft(): {
  content: string;
  title: string;
  savedAt: string;
} | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(DRAFTS_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFTS_KEY);
}

// 获取知识图谱数据
export function getKnowledgeGraph(): { nodes: any[]; edges: any[] } {
  const notes = getAllNotes().filter((n) => !n.isArchived);

  const nodes = notes.map((note) => ({
    id: note.id,
    label: note.title,
    type: note.type,
    tags: note.tags,
  }));

  const edges: any[] = [];
  notes.forEach((note) => {
    note.links.forEach((linkedId) => {
      edges.push({
        source: note.id,
        target: linkedId,
      });
    });
  });

  return { nodes, edges };
}

// 辅助函数
function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function saveAllNotes(notes: Note[]): void {
  if (typeof window === "undefined") return;
  const state: NotesState = {
    notes,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 笔记模板
export const NOTE_TEMPLATES: Record<
  NoteTemplate,
  { name: string; content: string; tags: string[] }
> = {
  blank: {
    name: "空白笔记",
    content: "",
    tags: [],
  },
  "song-analysis": {
    name: "歌曲分析",
    content: `## 基本信息
- **歌曲名称**: 
- **艺术家**: 
- **专辑**: 
- **发行年份**: 

## 音乐分析
### 调性与和声
- **调性**: 
- **主要和弦进行**: 

### 曲式结构
- **前奏**: 
- **主歌**: 
- **副歌**: 
- **桥段**: 

### 编曲特点
- **主要乐器**: 
- **音色特点**: 

## 个人感受
`,
    tags: ["歌曲分析"],
  },
  "music-theory": {
    name: "乐理学习",
    content: `## 学习主题


## 核心概念


## 实例分析


## 练习要点


## 相关链接
`,
    tags: ["乐理"],
  },
  "listening-notes": {
    name: "听歌感想",
    content: `## 今日聆听


## 情绪感受


## 印象深刻的部分


## 联想与思考
`,
    tags: ["听歌感想"],
  },
  "practice-log": {
    name: "练习日志",
    content: `## 练习日期
${new Date().toLocaleDateString("zh-CN")}

## 练习内容


## 练习时长
分钟

## 今日收获


## 需要改进


## 明日计划
`,
    tags: ["练习日志"],
  },
};
