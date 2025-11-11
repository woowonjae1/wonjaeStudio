"use client";

import { Zap, Users, Brain } from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  rpm: number;
  tpm: number;
  description: string;
  capabilities: string[];
  type: "coding" | "general" | "vision" | "fast";
}

interface ModelStatsProps {
  modelConfig: ModelConfig;
  tokenStats: {
    totalUsed: number;
    dailyUsed: number;
    dailyLimit: number;
  };
  messageCount: number;
  userMessageCount: number;
  aiMessageCount: number;
  currentTokensUsed: number;
}

/**
 * 模型统计信息面板
 */
export default function ModelStats({
  modelConfig,
  tokenStats,
  messageCount,
  userMessageCount,
  aiMessageCount,
  currentTokensUsed,
}: ModelStatsProps) {
  const dailyUsagePercent =
    (tokenStats.dailyUsed / tokenStats.dailyLimit) * 100;
  const usageColor =
    dailyUsagePercent > 80
      ? "red"
      : dailyUsagePercent > 50
        ? "yellow"
        : "green";

  return (
    <div className="space-y-4">
      {/* 模型信息卡片 */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-2">
          <Brain className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-blue-900 truncate">
              {modelConfig.name}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{modelConfig.provider}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {modelConfig.capabilities.slice(0, 2).map((cap) => (
                <span
                  key={cap}
                  className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                >
                  {cap}
                </span>
              ))}
              {modelConfig.capabilities.length > 2 && (
                <span className="inline-block text-xs text-gray-500">
                  +{modelConfig.capabilities.length - 2} 更多
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Token 使用情况 */}
      <div className="space-y-2 rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              Token 使用
            </span>
          </div>
          <span className="text-xs font-medium text-gray-600">
            {dailyUsagePercent.toFixed(0)}%
          </span>
        </div>

        <div className="space-y-1.5">
          <div>
            <div className="text-xs text-gray-600 mb-1">今日使用</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  usageColor === "red"
                    ? "bg-red-500"
                    : usageColor === "yellow"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {tokenStats.dailyUsed.toLocaleString()} /{" "}
              {tokenStats.dailyLimit.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">累计使用</div>
            <span className="text-sm font-semibold text-gray-900">
              {tokenStats.totalUsed.toLocaleString()} tokens
            </span>
          </div>

          {currentTokensUsed > 0 && (
            <div>
              <div className="text-xs text-gray-600 mb-1">本轮使用</div>
              <span className="text-sm font-semibold text-blue-600">
                {currentTokensUsed.toLocaleString()} tokens
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 对话统计 */}
      {messageCount > 0 && (
        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">
              对话统计
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">总消息</span>
              <span className="font-medium text-gray-900">{messageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">用户消息</span>
              <span className="font-medium text-gray-900">
                {userMessageCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AI 消息</span>
              <span className="font-medium text-gray-900">
                {aiMessageCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 模型规格 */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          模型规格
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">上下文</span>
            <span className="font-medium text-gray-900">
              {(modelConfig.contextWindow / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">输出</span>
            <span className="font-medium text-gray-900">
              {(modelConfig.maxOutputTokens / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">速率限制</span>
            <span className="font-medium text-gray-900">
              {modelConfig.rpm} RPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
