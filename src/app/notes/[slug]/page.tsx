"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Tag as TagIcon, Trash2 } from "lucide-react";
import { getNoteById, deleteNote, Note } from "@/lib/notesStorage";

export default function NotePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const foundNote = getNoteById(params.slug);
    if (!foundNote) {
      router.push("/");
    } else {
      setNote(foundNote);
    }
  }, [params.slug, router]);

  const handleDelete = () => {
    if (confirm("确定要删除这篇文章吗？")) {
      deleteNote(params.slug);
      router.push("/");
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-gray-100 dark:border-gray-900">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-light">返回</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-light">删除</span>
          </button>
        </div>

        {/* 文章头部 */}
        <header className="mb-12">
          <h1 className="text-4xl font-light text-black dark:text-white mb-6">
            {note.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
            <time className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(note.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{note.content.replace(/\s/g, "").length} 字</span>
          </div>

          {/* 标签 */}
          {note.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-4 h-4 text-gray-400" />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <article className="prose prose-lg max-w-none">
          <div className="text-gray-700 dark:text-gray-300 text-lg font-light leading-relaxed whitespace-pre-wrap">
            {note.content}
          </div>
        </article>

        {/* 底部信息 */}
        <footer className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-900">
          <p className="text-xs text-gray-400 font-light">
            最后更新于{" "}
            {new Date(note.updatedAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </footer>
      </div>
    </div>
  );
}
