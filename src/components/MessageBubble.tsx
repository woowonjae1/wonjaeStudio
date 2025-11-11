"use client";

import { Copy, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string | React.ReactNode;
  timestamp: Date;
  isStreaming?: boolean;
  tokensUsed?: number;
  onCopy?: () => void;
  isCopied?: boolean;
}

/**
 * 优化的消息气泡组件
 * 提供更好的视觉效果和交互
 */
export default function MessageBubble({
  role,
  content,
  timestamp,
  isStreaming = false,
  tokensUsed = 0,
  onCopy,
  isCopied = false,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-2xl rounded-lg px-4 py-2.5 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
            : "border border-gray-200 bg-white text-gray-900"
        }`}
      >
        <div className="text-sm leading-relaxed">{content}</div>

        <div
          className={`mt-1.5 flex items-center justify-between gap-2 text-xs ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span className="opacity-75">
            {timestamp.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {!isUser && (
            <div className="flex items-center gap-1.5">
              {tokensUsed > 0 && (
                <span className="inline-block px-1.5 py-0.5 rounded bg-opacity-20 text-xs font-medium">
                  {tokensUsed} tokens
                </span>
              )}
              {isStreaming ? (
                <span className="inline-block h-2 w-0.5 animate-pulse bg-current" />
              ) : (
                onCopy && (
                  <button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded"
                    title="复制"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-300 to-gray-400">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
