"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { saveNote, NOTE_TEMPLATES } from "@/lib/notesStorage";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 自动保存草稿到 localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem("draft", JSON.stringify({ title, content, tags }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, tags]);

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      const { title, content, tags } = JSON.parse(draft);
      setTitle(title || "");
      setContent(content || "");
      setTags(tags || []);
    }
  }, []);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    saveNote({
      title: title || `无标题 ${new Date().toLocaleDateString("zh-CN")}`,
      content,
      type: "literature",
      template: "blank",
      tags,
      links: [],
      isArchived: false,
    });

    localStorage.removeItem("draft");
    router.push("/");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

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
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-light rounded-lg hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            发布
          </button>
        </div>

        {/* 标题输入 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          className="w-full text-4xl font-light bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-black dark:text-white mb-8"
          autoFocus
        />

        {/* 标签 */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-black dark:hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="添加标签..."
            className="text-sm bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-500 dark:text-gray-400 w-32"
          />
        </div>

        {/* 内容编辑器 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="开始写作..."
          className="w-full min-h-[500px] bg-transparent border-none outline-none resize-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-700 dark:text-gray-300 text-lg font-light leading-relaxed"
        />

        {/* 底部提示 */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-900">
          <p className="text-xs text-gray-400 font-light">
            自动保存草稿 • {content.replace(/\s/g, "").length} 字
          </p>
        </div>
      </div>
    </div>
  );
}
