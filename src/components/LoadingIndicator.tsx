"use client";

import { Loader } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  searchEnabled?: boolean;
}

/**
 * 优化的加载指示器组件
 */
export default function LoadingIndicator({
  message = "正在思考...",
  searchEnabled = false,
}: LoadingIndicatorProps) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
        <Loader className="h-4 w-4 text-white animate-spinner" />
      </div>
      <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-2.5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{message}</span>
          </div>
          {searchEnabled && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600">
              <div className="flex gap-0.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span>搜索中...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
