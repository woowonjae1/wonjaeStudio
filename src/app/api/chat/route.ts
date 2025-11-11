import { NextRequest, NextResponse } from 'next/server';

// API 配置 - 从环境变量读取
const WQ_API_KEY = process.env.WQ_API_KEY;
const WQ_API_ENDPOINT = process.env.WQ_API_ENDPOINT;
const DEFAULT_MODEL_ID = process.env.WQ_MODEL_ID;
const KAT_CODER_MODEL_ID = process.env.KAT_CODER_MODEL_ID;
const QWEN_VL_MODEL_ID = process.env.QWEN_VL_MODEL_ID;

interface ContentBlock {
  type: 'text' | 'image_url' | 'video_url';
  text?: string;
  image_url?: { url: string };
  video_url?: { url: string };
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentBlock[];
}

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: string;
}

/**
 * 执行网络搜索
 */
async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch('http://localhost:3000/api/chat/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('搜索 API 调用失败:', response.status);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('网络搜索错误:', error);
    return [];
  }
}

/**
 * 非流式 API 调用 - 返回完整响应和 token 信息
 */
async function callWanqingAPI(
  messages: Message[], 
  modelId?: string
): Promise<{ reply: string; tokens: { prompt: number; completion: number } }> {
  if (!WQ_API_KEY || !WQ_API_ENDPOINT) {
    throw new Error('API 配置缺失');
  }

  const finalModelId = modelId || DEFAULT_MODEL_ID;

  try {
    console.log('调用万擎 API (非流式):', {
      endpoint: WQ_API_ENDPOINT,
      model: finalModelId,
      messageCount: messages.length,
      stream: false,
    });

    const requestBody = {
      model: finalModelId,
      stream: false,
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    };

    console.log('请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(WQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('万擎 API 响应状态:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('万擎 API 错误详情:', {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      throw new Error(`API 错误 ${response.status}: ${error}`);
    }

    const data = await response.json();
    console.log('万擎 API 响应数据:', JSON.stringify(data, null, 2));
    
    const content = data.choices?.[0]?.message?.content || '无法获取回复';
    const tokens = {
      prompt: data.usage?.prompt_tokens || 0,
      completion: data.usage?.completion_tokens || 0,
    };
    
    console.log('Token 使用:', tokens);
    
    return { reply: content, tokens };
  } catch (error) {
    console.error('万擎 API 调用错误:', error);
    throw error;
  }
}

/**
 * 流式 API 调用 - 返回 ReadableStream
 */
async function callWanqingAPIStream(
  messages: Message[], 
  modelId?: string
): Promise<ReadableStream<Uint8Array>> {
  if (!WQ_API_KEY || !WQ_API_ENDPOINT) {
    throw new Error('API 配置缺失');
  }

  const finalModelId = modelId || DEFAULT_MODEL_ID;

  const response = await fetch(WQ_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: finalModelId,
      stream: true, // 启用流式输出
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`API 错误: ${response.statusText}`);
  }

  return response.body as ReadableStream<Uint8Array>;
}

/**
 * POST /api/chat - 普通（非流式）对话
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, model, modelId, multimodal, enableSearch, searchResults } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息为必填项且必须是字符串' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: '消息过长，请限制在 5000 字以内' },
        { status: 400 }
      );
    }

    // 验证 API KEY
    if (!WQ_API_KEY || !WQ_API_ENDPOINT || !DEFAULT_MODEL_ID) {
      console.error('环境变量配置不完整:', {
        hasKey: !!WQ_API_KEY,
        hasEndpoint: !!WQ_API_ENDPOINT,
        hasDefaultModel: !!DEFAULT_MODEL_ID,
      });
      return NextResponse.json(
        { error: '服务器配置错误：缺少必要的环境变量' },
        { status: 500 }
      );
    }

    // 确定使用哪个模型
    const finalModelId = modelId || DEFAULT_MODEL_ID;

    // 验证多媒体支持 - 仅 Qwen 模型支持多媒体
    if (multimodal && Array.isArray(multimodal) && multimodal.length > 0) {
      if (finalModelId !== QWEN_VL_MODEL_ID) {
        return NextResponse.json(
          { 
            error: `❌ 当前模型 (${finalModelId}) 不支持图像/视频识别。\n\n仅有 Qwen3-VL-235B-A22B-Instruct 模型支持多媒体上传。\n\n请切换到 Qwen 模型重试。` 
          },
          { status: 400 }
        );
      }
    }

    // 构建用户消息内容（支持多模态）
    let userContent: string | Array<{ type: string; text?: string; image_url?: { url: string }; video_url?: { url: string } }> = message;
    if (multimodal && Array.isArray(multimodal) && multimodal.length > 0) {
      const contentBlocks: Array<{ type: string; text?: string; image_url?: { url: string }; video_url?: { url: string } }> = [];
      
      // 添加文本内容
      if (message) {
        contentBlocks.push({
          type: 'text',
          text: message,
        });
      }
      
      // 添加多媒体内容
      for (const attachment of multimodal) {
        if (attachment.type === 'image_url') {
          contentBlocks.push({
            type: 'image_url',
            image_url: { url: attachment.url },
          });
        } else if (attachment.type === 'video_url') {
          contentBlocks.push({
            type: 'video_url',
            video_url: { url: attachment.url },
          });
        }
      }
      
      userContent = contentBlocks;
    }

    // 构建消息数组
    const messages: Message[] = [
      {
        role: 'system',
        content: '你是一个专业的 AI 编程助手，擅长代码生成、调试和优化。',
      },
      ...(conversationHistory || []),
      { role: 'user', content: userContent },
    ];

    // 处理搜索结果上下文
    let searchContext = '';
    const effectiveSearchResults = searchResults || [];
    
    if (enableSearch && effectiveSearchResults.length > 0) {
      searchContext = `\n\n【最新网络搜索结果】\n`;
      effectiveSearchResults.forEach((result: any, index: number) => {
        searchContext += `${index + 1}. ${result.title}\n   来源: ${result.url}\n   ${result.description}\n`;
      });
      
      // 将搜索结果添加到系统消息中
      if (messages[0].content && typeof messages[0].content === 'string') {
        messages[0].content += searchContext;
      }
      
      console.log(`[Chat API] 已包含 ${effectiveSearchResults.length} 个搜索结果在系统提示中`);
    }

    // 调用万擎 API（使用提供的 modelId 或默认值）
    const { reply, tokens } = await callWanqingAPI(messages, modelId);

    // 计算总 token 数
    const totalTokens = tokens.prompt + tokens.completion;
    
    // 获取当前对话中的消息统计
    const historyStats = {
      totalMessages: conversationHistory?.length || 0,
      userMessages: conversationHistory?.filter((m: any) => m.role === 'user').length || 0,
      assistantMessages: conversationHistory?.filter((m: any) => m.role === 'assistant').length || 0,
    };

    return NextResponse.json({
      reply,
      tokens: {
        prompt: tokens.prompt,
        completion: tokens.completion,
        total: totalTokens,
      },
      model: {
        id: finalModelId,
        name: '万擎 AI',
        provider: 'Wanqing',
        version: '1.0',
      },
      conversation: {
        currentTurn: (conversationHistory?.length || 0) + 1,
        ...historyStats,
      },
      search: enableSearch ? {
        enabled: true,
        resultsCount: effectiveSearchResults.length,
        resultsSources: effectiveSearchResults.map((r: any) => r.source || 'Unknown'),
      } : {
        enabled: false,
        resultsCount: 0,
      },
      timestamp: new Date().toISOString(),
      success: true,
      mode: 'non-stream',
      searchResults: enableSearch && effectiveSearchResults.length > 0 ? effectiveSearchResults : undefined,
    });
  } catch (error) {
    console.error('Chat API 错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';

    // 返回详细的错误信息用于调试
    return NextResponse.json(
      {
        error: '服务器内部错误，请稍后重试。',
        details: process.env.NODE_ENV === 'development' ? {
          message: errorMessage,
          type: error instanceof Error ? error.name : 'UnknownError',
          config: {
            hasApiKey: !!WQ_API_KEY,
            hasEndpoint: !!WQ_API_ENDPOINT,
            hasDefaultModel: !!DEFAULT_MODEL_ID,
            defaultModelId: DEFAULT_MODEL_ID,
            endpoint: WQ_API_ENDPOINT,
          }
        } : undefined,
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * 流式对话函数（内部使用）
 * 使用 Server-Sent Events 实时推送数据
 */
async function handleStreamMessage(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息为必填项' },
        { status: 400 }
      );
    }

    if (!WQ_API_KEY) {
      return NextResponse.json(
        { error: '未配置 API KEY' },
        { status: 500 }
      );
    }

    // 构建消息数组
    const messages: Message[] = [
      {
        role: 'system',
        content: '你是一个专业的 AI 编程助手，擅长代码生成、调试和优化。',
      },
      ...(conversationHistory || []),
      { role: 'user', content: message },
    ];

    // 获取流式响应
    const stream = await callWanqingAPIStream(messages);

    // 返回流式响应
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // 禁用 nginx 缓冲
      },
    });
  } catch (error) {
    console.error('Stream API 错误:', error);
    return NextResponse.json(
      { error: '流式输出失败' },
      { status: 500 }
    );
  }
}


