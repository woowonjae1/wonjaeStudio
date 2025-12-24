"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input, Textarea } from "@/components/ui";
import { useRouter } from "next/navigation";

interface NoteFormData {
  title: string;
  content: string;
  tags: string;
  musicEmbed?: string;
  summary: string;
}

export function NoteEditor() {
  const router = useRouter();
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    tags: "",
    musicEmbed: "",
    summary: "",
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // 计算字数
  useEffect(() => {
    const count = formData.content.length;
    setWordCount(count);
  }, [formData.content]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("请填写标题和内容");
      return;
    }

    setIsSaving(true);
    try {
      // 这里可以添加保存到本地存储或发送到API的逻辑
      const noteData = {
        ...formData,
        date: new Date().toISOString(),
        slug: formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      // 保存到本地存储作为临时方案
      const existingNotes = JSON.parse(
        localStorage.getItem("userNotes") || "[]"
      );
      existingNotes.push(noteData);
      localStorage.setItem("userNotes", JSON.stringify(existingNotes));

      alert("笔记保存成功！");
      router.push("/notes");
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (confirm("确定要放弃当前编辑的内容吗？")) {
        router.push("/notes");
      }
    } else {
      router.push("/notes");
    }
  };

  const insertTemplate = (template: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + (prev.content ? "\n\n" : "") + template,
    }));
  };

  return (
    <div className="space-y-6 fade-in">
      {/* 工具栏 */}
      <Card className="editor-toolbar p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={isPreview ? "outline" : "default"}
              size="sm"
              className="toolbar-button"
              onClick={() => setIsPreview(false)}
            >
              ✏️ 编辑
            </Button>
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              className="toolbar-button"
              onClick={() => setIsPreview(true)}
            >
              👁️ 预览
            </Button>

            <div className="auto-save-indicator">
              <span className="text-xs">字数: {wordCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cancel-button"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              size="sm"
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "💾 保存"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 编辑器内容 */}
      <div className="editor-content">
        {/* 主编辑区 */}
        <div className="editor-main">
          <Card className="p-6">
            {!isPreview ? (
              <div className="space-y-4">
                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    标题 *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="给你的笔记起个标题..."
                    className="text-lg"
                  />
                </div>

                {/* 摘要 */}
                <div>
                  <label className="block text-sm font-medium mb-2">摘要</label>
                  <Textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="简短描述这篇笔记的内容..."
                    rows={2}
                  />
                </div>

                {/* 内容 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    内容 * (支持 Markdown)
                  </label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="在这里写下你的想法...

你可以使用 Markdown 语法：
- **粗体文字**
- *斜体文字*
- [链接](https://example.com)
- `代码`

## 二级标题
### 三级标题

> 引用文字

- 列表项 1
- 列表项 2"
                    className="editor-textarea"
                  />
                  <div className="word-count">{wordCount} 字符</div>
                </div>
              </div>
            ) : (
              <div className="editor-preview">
                <h1>{formData.title || "未命名笔记"}</h1>
                {formData.summary && (
                  <p className="text-muted-foreground italic border-l-4 border-primary/30 pl-4 mb-6">
                    {formData.summary}
                  </p>
                )}
                <div className="whitespace-pre-wrap">
                  {formData.content || "暂无内容"}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="editor-sidebar">
          {/* 元信息 */}
          <Card className="sidebar-card">
            <h3>📋 笔记信息</h3>
            <div className="space-y-4">
              {/* 标签 */}
              <div>
                <label className="block text-sm font-medium mb-2">标签</label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="音乐, 学习, 感想"
                  className="tag-input"
                />
                <p className="help-text">用逗号分隔多个标签</p>
              </div>

              {/* 音乐链接 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  音乐链接 (可选)
                </label>
                <Input
                  name="musicEmbed"
                  value={formData.musicEmbed}
                  onChange={handleInputChange}
                  placeholder="https://music.163.com/..."
                  className="tag-input"
                />
                <p className="help-text">支持网易云音乐、QQ音乐等链接</p>
              </div>
            </div>
          </Card>

          {/* 写作提示 */}
          <Card className="sidebar-card">
            <h3>💡 写作提示</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 记录你的真实感受</p>
              <p>• 分享学习心得和技巧</p>
              <p>• 描述音乐带给你的情感</p>
              <p>• 记录练习过程和进步</p>
              <p>• 分析喜欢的音乐作品</p>
            </div>
          </Card>

          {/* 快捷操作 */}
          <Card className="sidebar-card">
            <h3>⚡ 快捷模板</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="template-button"
                onClick={() => {
                  const template = `## 今日练习记录

**练习时间**: ${new Date().toLocaleDateString()}
**练习内容**: 
**收获**: 
**需要改进**: `;
                  insertTemplate(template);
                }}
              >
                📝 练习记录模板
              </button>

              <button
                type="button"
                className="template-button"
                onClick={() => {
                  const template = `## 聆听感受

**音乐**: 
**艺术家**: 
**感受**: 
**技术分析**: `;
                  insertTemplate(template);
                }}
              >
                🎵 聆听感受模板
              </button>

              <button
                type="button"
                className="template-button"
                onClick={() => {
                  const template = `## 学习笔记

**学习内容**: 
**重点知识**: 
**实践应用**: 
**疑问**: `;
                  insertTemplate(template);
                }}
              >
                📚 学习笔记模板
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
