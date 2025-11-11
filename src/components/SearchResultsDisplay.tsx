"use client";

import { ExternalLink, Globe } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface SearchResultsDisplayProps {
  results: SearchResult[];
  compact?: boolean;
}

/**
 * 搜索结果展示组件
 * 用于在聊天界面中展示网络搜索结果
 */
export default function SearchResultsDisplay({
  results,
  compact = false,
}: SearchResultsDisplayProps) {
  if (!results || results.length === 0) {
    return null;
  }

  if (compact) {
    // 紧凑模式：显示为内联注释
    return (
      <div className="my-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
        <div className="flex items-start gap-2">
          <Globe className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-blue-900 mb-1">
              📌 基于 {results.length} 个搜索结果
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              {results.map((result, index) => (
                <div key={index} className="truncate">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {result.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 完整模式：详细展示每个结果
  return (
    <div className="my-4 space-y-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-sm text-blue-900">
          🔍 网络搜索结果 ({results.length})
        </h4>
      </div>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className="rounded-lg bg-white border border-blue-100 p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <h5 className="text-sm font-medium text-blue-700 group-hover:text-blue-900 underline break-words">
                    {result.title}
                  </h5>
                  <ExternalLink className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5 group-hover:text-blue-700" />
                </a>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {result.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500 truncate">
                    {new URL(result.url).hostname}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {result.source}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-100">
        <p className="text-xs text-gray-600 text-center">
          💡 这些搜索结果可以帮助 AI 提供更实时和准确的信息
        </p>
      </div>
    </div>
  );
}
