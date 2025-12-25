"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Maximize2, Minimize2, Link2, Tag, Clock } from "lucide-react";
import {
  Note,
  updateNote,
  saveNote,
  getAllNotes,
  NOTE_TEMPLATES,
  NoteTemplate,
  NoteType,
} from "@/lib/notesStorage";

interface FocusEditorProps {
  note?: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (note: Note) => void;
}

export function FocusEditor({
  note,
  isOpen,
  onClose,
  onSave,
}: FocusEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [noteType, setNoteType] = useState<NoteType>("fleeting");
  const [template, setTemplate] = useState<NoteTemplate>("blank");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [availableNotes, setAvailableNotes] = useState<Note[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setLinks(note.links);
      setNoteType(note.type);
      setTemplate(note.template);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setLinks([]);
      setNoteType("fleeting");
      setTemplate("blank");
    }
  }, [note]);

  useEffect(() => {
    setAvailableNotes(getAllNotes().filter((n) => n.id !== note?.id));
  }, [note]);

  useEffect(() => {
    // 计算字数
    const count = content.replace(/\s/g, "").length;
    setWordCount(count);
  }, [content]);

  // 键盘快捷键
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S 保存
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Escape 退出全屏或关闭
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      // Cmd/Ctrl + Shift + F 切换全屏
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, content, title]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const noteData = {
      title: title || `笔记 ${new Date().toLocaleString("zh-CN")}`,
      content,
      type: noteType,
      template,
      tags,
      links,
      isArchived: false,
    };

    let savedNote: Note;
    if (note) {
      savedNote = updateNote(note.id, noteData) as Note;
    } else {
      savedNote = saveNote(noteData);
    }

    onSave?.(savedNote);
    onClose();
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

  const handleAddLink = (noteId: string) => {
    if (!links.includes(noteId)) {
      setLinks([...links, noteId]);
    }
    setShowLinkPicker(false);
  };

  const handleRemoveLink = (noteId: string) => {
    setLinks(links.filter((l) => l !== noteId));
  };

  const handleTemplateChange = (newTemplate: NoteTemplate) => {
    setTemplate(newTemplate);
    if (!content.trim()) {
      setContent(NOTE_TEMPLATES[newTemplate].content);
      setTags(NOTE_TEMPLATES[newTemplate].tags);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 ${isFullscreen ? "" : "p-4 md:p-8"}`}
    >
      <div
        className={`h-full flex flex-col ${isFullscreen ? "" : "max-w-4xl mx-auto"}`}
      >
        {/* 工具栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {/* 笔记类型选择 */}
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as NoteType)}
              className="text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            >
              <option value="fleeting">临时笔记</option>
              <option value="literature">工作笔记</option>
              <option value="permanent">永久笔记</option>
            </select>

            {/* 模板选择 */}
            <select
              value={template}
              onChange={(e) =>
                handleTemplateChange(e.target.value as NoteTemplate)
              }
              className="text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            >
              {Object.entries(NOTE_TEMPLATES).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              <Clock className="w-3 h-3 inline mr-1" />
              {wordCount} 字
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? "退出全屏 (Esc)" : "全屏模式 (⌘⇧F)"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 编辑区 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-400 text-gray-900 dark:text-white mb-4"
          />

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写作..."
            className="w-full h-[calc(100%-200px)] min-h-[300px] bg-transparent border-none outline-none resize-none placeholder-gray-400 text-gray-700 dark:text-gray-300 font-mono text-base leading-relaxed"
          />
        </div>

        {/* 底部元信息 */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          {/* 标签 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="添加标签..."
              className="text-xs bg-transparent border-none outline-none placeholder-gray-400 w-24"
            />
          </div>

          {/* 链接 */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link2 className="w-4 h-4 text-gray-400" />
            {links.map((linkId) => {
              const linkedNote = availableNotes.find((n) => n.id === linkId);
              return linkedNote ? (
                <span
                  key={linkId}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                >
                  {linkedNote.title}
                  <button
                    onClick={() => handleRemoveLink(linkId)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
            <div className="relative">
              <button
                onClick={() => setShowLinkPicker(!showLinkPicker)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                + 添加链接
              </button>
              {showLinkPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-64 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  {availableNotes
                    .filter((n) => !links.includes(n.id))
                    .slice(0, 10)
                    .map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleAddLink(n.id)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
                      >
                        {n.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              ⌘S 保存 • ⌘⇧F 全屏 • Esc 关闭
            </span>
            <button
              onClick={handleSave}
              disabled={!title.trim() && !content.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
