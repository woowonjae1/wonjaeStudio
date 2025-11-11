"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderedContent = useMemo(() => {
    const elements: JSX.Element[] = [];
    let lastIndex = 0;

    // 匹配代码块 ```language\ncode```
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const start = match.index;
      const language = match[1] || "plaintext";
      const code = match[2].trim();

      // 添加代码块前的文本
      if (start > lastIndex) {
        const beforeText = content.slice(lastIndex, start).trim();
        if (beforeText) {
          elements.push(
            <div
              key={`text-${lastIndex}`}
              className="text-sm whitespace-pre-wrap mb-2"
            >
              {beforeText}
            </div>
          );
        }
      }

      // 添加代码块
      elements.push(
        <div
          key={`code-${start}`}
          className="my-3 rounded-lg bg-gray-900 text-gray-100 overflow-hidden border border-gray-700"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              {language}
            </span>
            <button
              onClick={() => handleCopyCode(code)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
              title="复制代码"
            >
              {copiedCode === code ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>复制</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed font-mono">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // 添加最后的文本
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex).trim();
      if (remainingText) {
        elements.push(
          <div key={`text-end`} className="text-sm whitespace-pre-wrap">
            {remainingText}
          </div>
        );
      }
    }

    // 如果没有代码块，直接返回原文本
    return elements.length === 0
      ? [
          <div key="plain" className="text-sm whitespace-pre-wrap">
            {content}
          </div>,
        ]
      : elements;
  }, [content, copiedCode]);

  return (
    <div className="text-sm leading-relaxed space-y-2">{renderedContent}</div>
  );
}
