"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Zap,
  FileText,
  Music,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import {
  NOTE_TEMPLATES,
  NoteTemplate,
  saveNote,
  saveDraft,
  getDraft,
} from "@/lib/notesStorage";

interface QuickCaptureProps {
  onNoteCreated?: () => void;
}

export function QuickCapture({ onNoteCreated }: QuickCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<NoteTemplate>("blank");
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 加载草稿
  useEffect(() => {
    const draft = getDraft();
    if (draft && draft.content) {
      setContent(draft.content);
      setTitle(draft.title);
    }
  }, []);

  // 自动保存草稿
  useEffect(() => {
    if (content || title) {
      const timer = setTimeout(() => {
        saveDraft(content, title);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, title]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N 打开快速捕捉
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
      // Escape 关闭
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      // Cmd/Ctrl + Enter 保存
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isOpen) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, content, title]);

  const handleTemplateSelect = (template: NoteTemplate) => {
    setSelectedTemplate(template);
    const templateData = NOTE_TEMPLATES[template];
    if (templateData.content) {
      setContent(templateData.content);
    }
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleSave = () => {
    if (!content.trim() && !title.trim()) return;

    const templateData = NOTE_TEMPLATES[selectedTemplate];
    saveNote({
      title: title || `快速笔记 ${new Date().toLocaleString("zh-CN")}`,
      content,
      type: "fleeting",
      template: selectedTemplate,
      tags: [...templateData.tags],
      links: [],
      isArchived: false,
    });

    // 清空并关闭
    setContent("");
    setTitle("");
    setSelectedTemplate("blank");
    setIsOpen(false);
    saveDraft("", "");
    onNoteCreated?.();
  };

  const templateIcons: Record<NoteTemplate, React.ReactNode> = {
    blank: <FileText className="w-4 h-4" />,
    "song-analysis": <Music className="w-4 h-4" />,
    "music-theory": <BookOpen className="w-4 h-4" />,
    "listening-notes": <Zap className="w-4 h-4" />,
    "practice-log": <Dumbbell className="w-4 h-4" />,
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => textareaRef.current?.focus(), 100);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="快速新建笔记 (⌘N)"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">快速记录</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              快速捕捉
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              ⌘N
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 模板选择 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">模板:</span>
            {Object.entries(NOTE_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(key as NoteTemplate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedTemplate === key
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {templateIcons[key as NoteTemplate]}
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题（可选）"
            className="w-full px-0 py-2 text-xl font-semibold bg-transparent border-none outline-none placeholder-gray-400 text-gray-900 dark:text-white"
          />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记录你的想法..."
            className="w-full h-64 px-0 py-2 bg-transparent border-none outline-none resize-none placeholder-gray-400 text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed"
          />
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>自动保存草稿</span>
            <span>•</span>
            <span>⌘Enter 保存</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim() && !title.trim()}
              className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存笔记
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
