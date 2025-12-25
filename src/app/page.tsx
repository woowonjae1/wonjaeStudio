"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Shuffle,
  Calendar,
  Zap,
  BookOpen,
  Archive,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Container } from "@/components/ui";
import { HomeDottedSurface } from "@/components/ui/dotted-surface-variants";
import { QuickCapture } from "@/components/notes/QuickCapture";
import { FocusEditor } from "@/components/notes/FocusEditor";
import {
  getAllNotes,
  getNotesByType,
  getRandomNote,
  getTodayNotes,
  getWeekNotes,
  Note,
  NoteType,
} from "@/lib/notesStorage";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [fleetingNotes, setFleetingNotes] = useState<Note[]>([]);
  const [todayNotes, setTodayNotes] = useState<Note[]>([]);
  const [weekNotes, setWeekNotes] = useState<Note[]>([]);
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const allNotes = getAllNotes();
    setNotes(allNotes);
    setFleetingNotes(getNotesByType("fleeting"));
    setTodayNotes(getTodayNotes());
    setWeekNotes(getWeekNotes());
    setRandomNote(getRandomNote());
  };

  const handleNoteCreated = () => {
    loadNotes();
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedNote(null);
    loadNotes();
  };

  const handleRandomNote = () => {
    const note = getRandomNote();
    setRandomNote(note);
    if (note) {
      handleNoteSelect(note);
    }
  };

  const filteredNotes = searchQuery
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : notes;

  const noteTypeConfig: Record<
    NoteType,
    { icon: React.ReactNode; label: string; color: string }
  > = {
    fleeting: {
      icon: <Zap className="w-4 h-4" />,
      label: "临时",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    },
    literature: {
      icon: <BookOpen className="w-4 h-4" />,
      label: "工作",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    },
    permanent: {
      icon: <Archive className="w-4 h-4" />,
      label: "永久",
      color: "text-green-500 bg-green-50 dark:bg-green-900/20",
    },
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <HomeDottedSurface />

      <Container className="relative z-10">
        <div className="py-8">
          {/* 头部 */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xl font-bold mb-6">
              WJ
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              WOOWONJAE
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              音乐制作人的知识管理系统
            </p>

            {/* 快捷操作栏 */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setIsEditorOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                新建笔记
              </button>
              <button
                onClick={handleRandomNote}
                className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                随机回顾
              </button>
              <Link
                href="/notes/review"
                className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                每日回顾
              </Link>
            </div>
          </header>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索笔记标题、内容、标签... (⌘K)"
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white shadow-sm"
              />
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {notes.length}
              </div>
              <div className="text-sm text-gray-500">全部笔记</div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="text-3xl font-bold text-amber-600">
                {fleetingNotes.length}
              </div>
              <div className="text-sm text-amber-600/70">临时笔记</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">
                {todayNotes.length}
              </div>
              <div className="text-sm text-blue-600/70">今日新增</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="text-3xl font-bold text-green-600">
                {weekNotes.length}
              </div>
              <div className="text-sm text-green-600/70">本周笔记</div>
            </div>
          </div>

          {/* 临时笔记区 (Fleeting Notes) */}
          {fleetingNotes.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    临时笔记
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    待整理
                  </span>
                </div>
                <Link
                  href="/notes?type=fleeting"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                >
                  查看全部 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fleetingNotes.slice(0, 6).map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleNoteSelect(note)}
                    className="text-left p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {note.content.slice(0, 100)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 所有笔记 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {searchQuery
                  ? `搜索结果 (${filteredNotes.length})`
                  : "所有笔记"}
              </h2>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.slice(0, 12).map((note) => {
                  const typeConfig = noteTypeConfig[note.type];
                  return (
                    <button
                      key={note.id}
                      onClick={() => handleNoteSelect(note)}
                      className="text-left p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${typeConfig.color}`}
                        >
                          {typeConfig.icon}
                          {typeConfig.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {note.content.slice(0, 150)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(note.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">📝</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {searchQuery ? "未找到相关笔记" : "开始记录你的音乐之旅"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "尝试其他关键词"
                    : "点击上方按钮创建你的第一篇笔记"}
                </p>
              </div>
            )}
          </section>

          {/* 页脚 */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Made by{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                WOOWONJAE
              </span>{" "}
              © {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </Container>

      {/* 快速捕捉按钮 */}
      <QuickCapture onNoteCreated={handleNoteCreated} />

      {/* 专注编辑器 */}
      <FocusEditor
        note={selectedNote}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleNoteCreated}
      />
    </div>
  );
}
