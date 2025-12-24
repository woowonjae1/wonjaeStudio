import React from "react";
import { Container } from "@/components/ui";
import { EditorDottedSurface } from "@/components/ui/dotted-surface-variants";
import { NoteEditor } from "@/components/blog/NoteEditor";
import { Metadata } from "next";
import "./new-note.css";

export const metadata: Metadata = {
  title: "写新笔记",
  description: "记录你的音乐学习和聆听感受",
};

export default function NewNotePage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* 编辑页面专用背景 */}
      <EditorDottedSurface />

      <div className="relative z-10 py-8">
        <Container>
          <div className="note-editor">
            {/* 页面标题 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                ✏️ 写新笔记
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                记录你的音乐学习心得、聆听感受或任何想法
              </p>
            </div>

            {/* 编辑器 */}
            <NoteEditor />
          </div>
        </Container>
      </div>
    </div>
  );
}
