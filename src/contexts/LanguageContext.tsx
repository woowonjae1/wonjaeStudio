"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    "header.currentMode": "Current Mode",
    "header.backHome": "← Back Home",

    // Sidebar
    "sidebar.title": "AI Coder Studio",
    "sidebar.subtitle": "Wanqing",
    "sidebar.description":
      "Real-time coding assistant powered by Kuaishou Wanqing, supporting streaming output and context tracking to help you complete code creation quickly.",
    "sidebar.responseMode": "Response Mode",
    "sidebar.streaming": "Streaming",
    "sidebar.standard": "Standard",
    "sidebar.streamingLabel": "Real-time generation • Recommended",
    "sidebar.standardLabel": "Complete reply • Stable",
    "sidebar.streamingInfo":
      "Streaming mode continuously updates content during generation; Standard mode displays the result all at once after completion.",
    "sidebar.conversationStatus": "Conversation Status",
    "sidebar.noHistory":
      "No conversation history yet, send your first message to get started.",
    "sidebar.historyCount":
      "Recorded {{count}} context messages, will affect subsequent responses.",
    "sidebar.newChat": "New Chat",
    "sidebar.clearChat": "Clear Chat",

    // Mode Display
    "mode.streamingTitle": "🚀 Real-time Streaming",
    "mode.standardTitle": "💬 Standard Mode",
    "mode.streamingDesc": "Token-by-token delivery, suitable for quick preview",
    "mode.standardDesc": "Output complete content after processing",

    // Welcome Screen
    "welcome.title": "Welcome to AI Coder Studio",
    "welcome.description":
      "Use Kuaishou Wanqing model for professional code generation, debugging, and explanation. Select a quick question below to get started, or enter your own request.",
    "welcome.prompt1": "💡 Write a quick sort algorithm for me",
    "welcome.prompt2": "⚡ How to optimize React performance?",
    "welcome.prompt3": "🔍 Explain the concept of closures",
    "welcome.prompt4": "🏗️ Give me an API design example",
    "welcome.category1": "Algorithm",
    "welcome.category2": "Frontend",
    "welcome.category3": "JavaScript",
    "welcome.category4": "Architecture",

    // Input
    "input.placeholder": "Enter your question or code request...",
    "input.send": "Send",
    "input.generating": "Generating...",

    // Messages
    "message.thinking": "AI thinking...",
    "message.copy": "Copy content",

    // Footer
    "footer.streamingInfo":
      "🚀 Streaming mode: See AI output in real-time, suitable for quick iteration and debugging.",
    "footer.standardInfo":
      "💬 Standard mode: Wait for complete reply, suitable for getting complete answers at once.",

    // Alerts
    "alert.clearConfirm": "Are you sure you want to clear all messages?",

    // Errors
    "error.apiError": "API Error",
    "error.connectionFailed":
      "Connection failed, please check network and API configuration",
    "error.cannotProcess": "Sorry, I cannot process your request.",
  },
  zh: {
    // Header
    "header.currentMode": "当前模式",
    "header.backHome": "← 返回主页",

    // Sidebar
    "sidebar.title": "AI 编程助手",
    "sidebar.subtitle": "万擎",
    "sidebar.description":
      "快手万擎驱动的实时编程助手，支持流式输出与上下文追踪，帮你快速完成代码创作。",
    "sidebar.responseMode": "响应模式",
    "sidebar.streaming": "流式",
    "sidebar.standard": "标准",
    "sidebar.streamingLabel": "实时生成 • 推荐",
    "sidebar.standardLabel": "完整回复 • 稳定",
    "sidebar.streamingInfo":
      "流式模式会在生成过程中持续更新内容；普通模式会在消息完成后一次性显示结果。",
    "sidebar.conversationStatus": "会话状态",
    "sidebar.noHistory": "当前没有历史对话，发送第一条消息开始体验。",
    "sidebar.historyCount": "已记录 {{count}} 条上下文，将影响后续回答。",
    "sidebar.newChat": "开启新对话",
    "sidebar.clearChat": "清空会话",

    // Mode Display
    "mode.streamingTitle": "🚀 实时流式生成",
    "mode.standardTitle": "💬 完整回复模式",
    "mode.streamingDesc": "逐 token 推送，适合快速预览答案",
    "mode.standardDesc": "等待处理完成后输出整段内容",

    // Welcome Screen
    "welcome.title": "欢迎来到 AI Coder Studio",
    "welcome.description":
      "使用快手万擎模型进行专业的代码生成、调试与解释。选择下方快捷问题快速开始，或直接输入你的需求。",
    "welcome.prompt1": "💡 帮我写一个快速排序算法",
    "welcome.prompt2": "⚡ 怎样优化 React 性能？",
    "welcome.prompt3": "🔍 解释一下闭包概念",
    "welcome.prompt4": "🏗️ 给我一个 API 设计例子",
    "welcome.category1": "算法",
    "welcome.category2": "前端",
    "welcome.category3": "JavaScript",
    "welcome.category4": "架构",

    // Input
    "input.placeholder": "输入你的问题或代码需求...",
    "input.send": "发送",
    "input.generating": "生成中...",

    // Messages
    "message.thinking": "AI 思考中...",
    "message.copy": "复制内容",

    // Footer
    "footer.streamingInfo":
      "🚀 流式模式：实时看到 AI 输出结果，适合快速迭代与调试。",
    "footer.standardInfo":
      "💬 普通模式：等待完整回复，适合一次性获取完整答案。",

    // Alerts
    "alert.clearConfirm": "确定要清空所有消息吗？",

    // Errors
    "error.apiError": "API 错误",
    "error.connectionFailed": "连接失败，请检查网络和 API 配置",
    "error.cannotProcess": "抱歉，我无法处理你的请求。",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "zh")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: Record<string, unknown> | string | undefined =
      translations[language];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = (value as Record<string, unknown>)[k] as
          | Record<string, unknown>
          | string
          | undefined;
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
