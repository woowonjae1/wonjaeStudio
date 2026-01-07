"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Clock } from "lucide-react";
import { getAllNotes, Note } from "@/lib/notesStorage";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const allNotes = getAllNotes();
    setNotes(allNotes.filter((n) => !n.isArchived));
  }, []);

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* 头部 */}
        <header className="mb-20">
          <h1 className="text-5xl font-light text-black dark:text-white mb-4 tracking-tight">
            WOOWONJAE
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-light">
            音乐制作人的笔记本
          </p>
        </header>

        {/* 搜索框 */}
        <div className="mb-16">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-200 dark:border-gray-800 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-12">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block group"
              >
                <article className="border-b border-gray-100 dark:border-gray-900 pb-12 transition-all">
                  <h2 className="text-2xl font-light text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-light">
                    {note.content.slice(0, 200)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <time className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(note.createdAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {note.tags.length > 0 && (
                      <div className="flex gap-2">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-gray-400 dark:text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg font-light">
                {searchQuery ? "未找到相关文章" : "暂无文章"}
              </p>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="mt-32 pt-8 border-t border-gray-100 dark:border-gray-900">
          <p className="text-center text-sm text-gray-400 font-light">
            © {new Date().getFullYear()} WOOWONJAE
          </p>
        </footer>
      </div>
    </div>
  );
}
