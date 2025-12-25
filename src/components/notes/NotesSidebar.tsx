"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Shuffle,
  Calendar,
  Clock,
  Tag,
  Zap,
  BookOpen,
  Archive,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  getAllNotes,
  getNotesByType,
  getRandomNote,
  getTodayNotes,
  searchNotes,
  Note,
  NoteType,
} from "@/lib/notesStorage";

interface NotesSidebarProps {
  onNoteSelect?: (note: Note) => void;
  className?: string;
}

export function NotesSidebar({
  onNoteSelect,
  className = "",
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [fleetingNotes, setFleetingNotes] = useState<Note[]>([]);
  const [todayNotes, setTodayNotes] = useState<Note[]>([]);
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    fleeting: true,
    today: true,
    random: false,
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    setFleetingNotes(getNotesByType("fleeting"));
    setTodayNotes(getTodayNotes());
    setRandomNote(getRandomNote());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchNotes(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleRandomNote = () => {
    const note = getRandomNote();
    setRandomNote(note);
    if (note && onNoteSelect) {
      onNoteSelect(note);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const noteTypeIcons: Record<NoteType, React.ReactNode> = {
    fleeting: <Zap className="w-4 h-4 text-amber-500" />,
    literature: <BookOpen className="w-4 h-4 text-blue-500" />,
    permanent: <Archive className="w-4 h-4 text-green-500" />,
  };

  const noteTypeLabels: Record<NoteType, string> = {
    fleeting: "临时笔记",
    literature: "工作笔记",
    permanent: "永久笔记",
  };

  return (
    <aside
      className={`w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto ${className}`}
    >
      {/* 搜索框 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索笔记... (⌘K)"
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
        </div>
      </div>

      {/* 搜索结果 */}
      {searchQuery && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
            搜索结果 ({searchResults.length})
          </h3>
          {searchResults.length > 0 ? (
            <ul className="space-y-1">
              {searchResults.slice(0, 5).map((note) => (
                <li key={note.id}>
                  <button
                    onClick={() => onNoteSelect?.(note)}
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg truncate"
                  >
                    {note.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">未找到相关笔记</p>
          )}
        </div>
      )}

      {/* 快捷操作 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRandomNote}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            随机笔记
          </button>
          <Link
            href="/notes/review"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            每日回顾
          </Link>
        </div>
      </div>

      {/* 临时笔记 (Fleeting Notes) */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => toggleSection("fleeting")}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">临时笔记</span>
            <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {fleetingNotes.length}
            </span>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.fleeting ? "rotate-90" : ""}`}
          />
        </button>
        {expandedSections.fleeting && fleetingNotes.length > 0 && (
          <ul className="px-4 pb-4 space-y-1">
            {fleetingNotes.slice(0, 5).map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => onNoteSelect?.(note)}
                  className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg truncate"
                >
                  {note.title}
                </button>
              </li>
            ))}
            {fleetingNotes.length > 5 && (
              <li>
                <Link
                  href="/notes?type=fleeting"
                  className="block px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  查看全部 ({fleetingNotes.length})
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* 今日笔记 */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => toggleSection("today")}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">今日笔记</span>
            <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {todayNotes.length}
            </span>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.today ? "rotate-90" : ""}`}
          />
        </button>
        {expandedSections.today && (
          <div className="px-4 pb-4">
            {todayNotes.length > 0 ? (
              <ul className="space-y-1">
                {todayNotes.map((note) => (
                  <li key={note.id}>
                    <button
                      onClick={() => onNoteSelect?.(note)}
                      className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg truncate"
                    >
                      {note.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 px-2">今天还没有写笔记</p>
            )}
          </div>
        )}
      </div>

      {/* 随机笔记预览 */}
      {randomNote && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              随机回顾
            </span>
            <button
              onClick={handleRandomNote}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              换一个
            </button>
          </div>
          <button
            onClick={() => onNoteSelect?.(randomNote)}
            className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
              {randomNote.title}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2">
              {randomNote.content.slice(0, 100)}...
            </p>
          </button>
        </div>
      )}
    </aside>
  );
}
