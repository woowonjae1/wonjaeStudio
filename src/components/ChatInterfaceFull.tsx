'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Copy, Home, Loader, Send, Sparkles, CheckCircle2, Plus, X, ChevronDown, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  tokensUsed?: number;
  model?: string;
}

interface ConversationHistory {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  reply: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  model?: {
    id: string;
    name: string;
    provider: string;
    version: string;
  };
  conversation?: {
    currentTurn: number;
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
  };
  search?: {
    enabled: boolean;
    resultsCount: number;
    resultsSources?: string[];
  };
}

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
}

// 可用模型列表
const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'ep-dvjgwv-1761292043674809878',
    name: '万擎 AI (默认)',
    provider: 'Wanqing',
    description: '专业 AI 编程助手',
  },
  // 可以在这里添加更多模型
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [conversationStats, setConversationStats] = useState<any>(null);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(AVAILABLE_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [conversations, setConversations] = useState<Array<{ id: string; title: string; date: string; messageCount: number }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 首次加载时显示欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `欢迎来到 Wanqing AI 助手！👋

我是你的 AI 编程助手,支持以下功能:
• 代码生成和调试
• 技术问题解答
• 实时网络搜索
• 多模型支持

💡 小贴士:
- 启用"网络搜索"以获取最新信息
- 支持代码高亮和格式化
- 可以切换不同的 AI 模型
- 查看对话历史和 Token 使用统计

请告诉我你需要什么帮助！`,
        timestamp: new Date(),
        isStreaming: false,
        model: selectedModel.name,
      };
      
      setMessages([welcomeMessage]);
      setConversationHistory([{
        role: 'assistant',
        content: welcomeMessage.content,
      }]);
    }
  }, []);

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setSearchError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      model: selectedModel.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    const newHistory: ConversationHistory[] = [
      ...conversationHistory,
      { role: 'user', content: input },
    ];

    setInput('');
    setLoading(true);
    setConversationHistory(newHistory);

    abortControllerRef.current = new AbortController();

    try {
      // 如果启用搜索，先进行网络搜索
      if (enableSearch) {
        setSearching(true);
        try {
          // 获取当前日期作为上下文
          const today = new Date();
          const dateContext = today.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          });
          
          // 为包含日期关键词的查询添加日期上下文
          let enhancedQuery = input;
          const hasDateKeywords = /今天|昨天|明天|日期|最新|实时|今日|号|刚刚|刚才|今年|本月|本周/i.test(input);
          if (hasDateKeywords) {
            // 如果查询包含日期关键词但没有具体日期，添加当前日期
            if (!/\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}月\d{1,2}号|\d{1,2}-\d{1,2}/.test(input)) {
              enhancedQuery = `${input} ${dateContext}`;
              console.log(`[前端] 查询增强: "${input}" -> "${enhancedQuery}"`);
            }
          }
          
          const searchResponse = await fetch('/api/chat/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: enhancedQuery,
              timestamp: new Date().toISOString(),
              dateContext: dateContext,
            }),
            signal: AbortSignal.timeout(15000),
          });

          if (!searchResponse.ok) {
            console.warn(`搜索返回状态码: ${searchResponse.status}`);
            setSearchError('搜索失败，将使用本地知识回答');
          } else {
            const searchData = await searchResponse.json();
            console.log(`搜索成功: 找到 ${searchData.results?.length || 0} 个结果`);
            if (searchData.results?.length === 0) {
              setSearchError('搜索未找到相关结果');
            }
          }
        } catch (searchError: any) {
          if (searchError.name !== 'AbortError') {
            console.warn('搜索异常:', searchError.message);
            setSearchError(`搜索失败: ${searchError.message || '网络错误'}`);
          }
        } finally {
          setSearching(false);
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: newHistory,
          enableSearch: enableSearch,
          modelId: selectedModel.id,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API 错误: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || '抱歉，我无法处理你的请求。',
        timestamp: new Date(),
        tokensUsed: data.tokens?.completion || 0,
        model: data.model?.name || selectedModel.name,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'assistant', content: assistantMessage.content },
      ]);

      // 更新模型信息
      if (data.model) {
        setModelInfo(data.model);
      }

      // 更新对话统计信息
      if (data.conversation) {
        setConversationStats(data.conversation);
      }

      // 更新总 token 使用
      if (data.tokens) {
        setTotalTokensUsed((prev) => prev + data.tokens!.total);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('API 错误:', error);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `❌ 错误: ${error.message || '连接失败，请检查网络和 API 配置。'}`,
          timestamp: new Date(),
          model: selectedModel.name,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
      setSearching(false);
      abortControllerRef.current = null;
    }
  };

  const handleNewChat = () => {
    // 保存当前对话到历史
    if (messages.length > 1) {
      const title = messages[1]?.content?.substring(0, 30) || '新对话';
      const newConversation = {
        id: Date.now().toString(),
        title: title,
        date: new Date().toLocaleDateString('zh-CN'),
        messageCount: messages.length,
      };
      setConversations((prev) => [newConversation, ...prev]);
    }

    // 重置所有状态
    setMessages([]);
    setConversationHistory([]);
    setInput('');
    setModelInfo(null);
    setConversationStats(null);
    setTotalTokensUsed(0);
    setSearchError(null);

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '欢迎开启新对话！请输入你的问题。',
      timestamp: new Date(),
      isStreaming: false,
      model: selectedModel.name,
    };
    
    setMessages([welcomeMessage]);
    setConversationHistory([{
      role: 'assistant',
      content: welcomeMessage.content,
    }]);
  };

  const handleModelChange = (model: ModelConfig) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
    // 显示模型切换消息
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `已切换到模型：${model.name}\n\n提供商：${model.provider}\n描述：${model.description}`,
      timestamp: new Date(),
      model: model.name,
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleLoadConversation = (conv: typeof conversations[0]) => {
    // 这里可以实现加载之前的对话记录
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `加载了之前的对话：${conv.title}\n包含 ${conv.messageCount} 条消息`,
      timestamp: new Date(),
      model: selectedModel.name,
    };
    setMessages([message]);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="flex h-14 items-center border-b border-gray-200 bg-white px-6 shadow-sm">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-gray-900">Wanqing AI</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* 模型选择器 */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex h-8 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 transition hover:bg-gray-50"
              >
                <span className="text-xs">🤖 {selectedModel.name}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                  <div className="p-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model)}
                        className={`w-full text-left rounded px-3 py-2 text-xs transition ${
                          selectedModel.id === model.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold">{model.name}</div>
                        <div className="text-xs text-gray-600">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/home"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 transition hover:bg-gray-50"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">返回</span>
            </Link>
            
            <button
              onClick={handleNewChat}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs text-white transition hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">新对话</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversation History */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-xs font-semibold text-gray-600 uppercase">对话历史</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-8">
                <p>暂无历史对话</p>
                <p className="mt-2 text-xs">开始新对话后会显示在这里</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleLoadConversation(conv)}
                  className="w-full text-left rounded-lg border border-gray-200 bg-gray-50 p-2 hover:bg-blue-50 transition text-xs"
                >
                  <div className="font-semibold text-gray-900 truncate">{conv.title}</div>
                  <div className="text-xs text-gray-600">{conv.date}</div>
                  <div className="text-xs text-gray-500 mt-1">{conv.messageCount} 条消息</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-lg px-4 py-2.5 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : 'border border-gray-200 bg-white text-gray-900'
                  }`}
                >
                  {message.model && message.role === 'assistant' && (
                    <div className="text-xs text-gray-500 mb-1">
                      📦 {message.model}
                    </div>
                  )}
                  
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>

                  {message.tokensUsed && message.role === 'assistant' && (
                    <div className="text-xs text-gray-500 mt-1">
                      ⚡ {message.tokensUsed} tokens
                    </div>
                  )}

                  {message.role === 'assistant' && !message.isStreaming && (
                    <button
                      onClick={() => copyToClipboard(message.id, message.content)}
                      className="mt-2 rounded p-1 transition hover:bg-gray-200"
                      title="复制"
                    >
                      {copiedId === message.id ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <Loader className="h-4 w-4 text-white animate-spin" />
                </div>
                <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>正在思考...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            {/* 搜索开关 */}
            <div className="mb-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="enableSearch"
                checked={enableSearch}
                onChange={(e) => setEnableSearch(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="enableSearch" className="text-sm text-gray-700">
                🔍 启用网络搜索
              </label>
            </div>

            {/* 搜索状态和错误信息 */}
            {searching && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                <Loader className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">正在搜索网络信息...</span>
              </div>
            )}

            {searchError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">{searchError}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
              />
              {loading ? (
                <button
                  type="button"
                  onClick={() => abortControllerRef.current?.abort()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700"
                  title="停止输出"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Sidebar - Stats */}
        <div className="w-64 border-l border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-xs font-semibold text-gray-600 uppercase">对话信息</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 模型信息 */}
            {modelInfo && (
              <div className="rounded-lg bg-purple-50 p-3">
                <div className="text-xs font-semibold text-purple-900 mb-2">🤖 模型信息</div>
                <div className="space-y-1 text-xs text-purple-700">
                  <div className="flex justify-between">
                    <span>模型:</span>
                    <span className="font-medium">{modelInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>提供商:</span>
                    <span className="font-medium">{modelInfo.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>版本:</span>
                    <span className="font-medium">{modelInfo.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{modelInfo.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>
            )}

            {/* 对话统计 */}
            {conversationStats && (
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="text-xs font-semibold text-blue-900 mb-2">📊 对话统计</div>
                <div className="space-y-1 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>当前轮次:</span>
                    <span className="font-medium">{conversationStats.currentTurn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>总消息数:</span>
                    <span className="font-medium">{conversationStats.totalMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>用户消息:</span>
                    <span className="font-medium">{conversationStats.userMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI 回复:</span>
                    <span className="font-medium">{conversationStats.assistantMessages}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Token 使用统计 */}
            <div className="rounded-lg bg-orange-50 p-3">
              <div className="text-xs font-semibold text-orange-900 mb-2">⚡ Token 统计</div>
              <div className="space-y-1 text-xs text-orange-700">
                <div className="flex justify-between">
                  <span>本次使用:</span>
                  <span className="font-medium">
                    {messages.length > 0 && messages[messages.length - 1].tokensUsed
                      ? messages[messages.length - 1].tokensUsed
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>总使用:</span>
                  <span className="font-medium">{totalTokensUsed}</span>
                </div>
                <div className="w-full bg-orange-200 rounded h-1.5 mt-2">
                  <div 
                    className="bg-orange-600 h-1.5 rounded transition-all"
                    style={{
                      width: `${Math.min((totalTokensUsed / 1000) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  {Math.round((totalTokensUsed / 1000) * 100)}% (预计 1000 tokens)
                </div>
              </div>
            </div>

            {/* 功能状态 */}
            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-xs font-semibold text-green-900 mb-2">✨ 功能</div>
              <ul className="space-y-1 text-xs text-green-700">
                <li>✓ 实时对话</li>
                <li>
                  {enableSearch ? '✓' : '✗'} 网络搜索
                </li>
                <li>✓ 代码分析</li>
                <li>✓ 模型切换</li>
              </ul>
            </div>

            {/* 当前模型 */}
            <div className="rounded-lg bg-indigo-50 p-3">
              <div className="text-xs font-semibold text-indigo-900 mb-2">🎯 当前模型</div>
              <div className="space-y-1 text-xs text-indigo-700">
                <div className="font-medium">{selectedModel.name}</div>
                <div className="text-xs">{selectedModel.description}</div>
                <div className="text-xs text-indigo-600 mt-2 font-mono">
                  {selectedModel.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
