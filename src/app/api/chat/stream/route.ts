import { NextRequest, NextResponse } from "next/server";

// API 配置 - 从环境变量读取，不使用硬编码的默认值
const WQ_API_KEY = process.env.WQ_API_KEY;
const WQ_API_ENDPOINT = process.env.WQ_API_ENDPOINT;
const WQ_MODEL_ID = process.env.WQ_MODEL_ID;

interface ContentBlock {
  type: "text" | "image_url" | "video_url";
  text?: string;
  image_url?: { url: string };
  video_url?: { url: string };
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string | ContentBlock[];
}

/**
 * POST /api/chat/stream - 流式对话
 * 实时推送数据到前端
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, modelId, multimodal } =
      await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "消息为必填项" }, { status: 400 });
    }

    // 验证所有必需的环境变量
    if (!WQ_API_KEY || !WQ_API_ENDPOINT || !WQ_MODEL_ID) {
      console.error("环境变量配置不完整:", {
        hasKey: !!WQ_API_KEY,
        hasEndpoint: !!WQ_API_ENDPOINT,
        hasModel: !!WQ_MODEL_ID,
      });
      return NextResponse.json(
        { error: "服务器配置错误：缺少必要的环境变量" },
        { status: 500 }
      );
    }

    // 构建用户消息内容（支持多模态）
    let userContent: string | ContentBlock[] = message;
    if (multimodal && Array.isArray(multimodal) && multimodal.length > 0) {
      const contentBlocks: ContentBlock[] = [];

      // 添加文本内容
      if (message) {
        contentBlocks.push({
          type: "text",
          text: message,
        });
      }

      // 添加多媒体内容
      for (const attachment of multimodal) {
        if (attachment.type === "image_url") {
          contentBlocks.push({
            type: "image_url",
            image_url: { url: attachment.url },
          });
        } else if (attachment.type === "video_url") {
          contentBlocks.push({
            type: "video_url",
            video_url: { url: attachment.url },
          });
        }
      }

      userContent = contentBlocks;
    }

    // 构建消息数组
    const messages: Message[] = [
      {
        role: "system",
        content: "你是一个专业的 AI 编程助手，擅长代码生成、调试和优化。",
      },
      ...(conversationHistory || []),
      { role: "user", content: userContent },
    ];

    // 使用提供的 modelId 或默认值
    const finalModelId = modelId || WQ_MODEL_ID;

    // 调用万擎 API（流式）
    console.log("调用万擎 API:", {
      endpoint: WQ_API_ENDPOINT,
      model: finalModelId,
      messageCount: messages.length,
      stream: true,
    });

    const response = await fetch(WQ_API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: finalModelId,
        stream: true, // 启用流式输出
        messages,
      }),
    });

    console.log(
      "万擎 API 响应状态:",
      response.status,
      response.statusText,
      response.headers.get("content-type")
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("万擎 API 错误详情:", {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      throw new Error(`API 错误 ${response.status}: ${error}`);
    }

    // 处理流式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const readable = response.body;
    let buffer = "";
    let finished = false;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    if (!readable) {
      throw new Error("无法获取响应流");
    }

    // 创建自定义的 TransformStream 来处理 SSE 格式
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        buffer = buffer.replace(/\r\n/g, "\n");

        let boundaryIndex = buffer.indexOf("\n\n");
        while (boundaryIndex !== -1) {
          const eventBlock = buffer.slice(0, boundaryIndex);
          buffer = buffer.slice(boundaryIndex + 2);
          processEventBlock(eventBlock, controller);
          boundaryIndex = buffer.indexOf("\n\n");
        }
      },
      flush(controller) {
        buffer = buffer.replace(/\r\n/g, "\n");
        // 处理剩余数据
        if (buffer.trim().length > 0) {
          processEventBlock(buffer, controller);
        }

        if (!finished) {
          // 最后发送 token 统计信息
          const tokenData = {
            type: "token_usage",
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            totalTokens: totalInputTokens + totalOutputTokens,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(tokenData)}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          finished = true;
        }
      },
    });

    function processEventBlock(
      eventBlock: string,
      controller: TransformStreamDefaultController<Uint8Array>
    ) {
      const lines = eventBlock.split("\n");

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) {
          continue;
        }

        const payload = line.slice(5).trim();
        if (!payload) {
          continue;
        }

        if (payload === "[DONE]") {
          if (!finished) {
            const tokenData = {
              type: "token_usage",
              inputTokens: totalInputTokens,
              outputTokens: totalOutputTokens,
              totalTokens: totalInputTokens + totalOutputTokens,
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(tokenData)}\n\n`)
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            finished = true;
          }
          continue;
        }

        try {
          const parsed = JSON.parse(payload);

          // 提取 token 使用信息
          if (parsed.usage) {
            totalInputTokens = parsed.usage.prompt_tokens || 0;
            totalOutputTokens = parsed.usage.completion_tokens || 0;
          }

          const deltaContent =
            parsed.choices?.[0]?.delta?.content ??
            parsed.choices?.[0]?.message?.content ??
            parsed.message?.content ??
            parsed.content ??
            "";

          if (deltaContent) {
            const sseData = `data: ${JSON.stringify({ content: deltaContent })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }
        } catch (err) {
          console.error("SSE 分片解析失败:", { err, payload });
        }
      }
    }

    const transformedStream = readable.pipeThrough(transformStream);

    return new NextResponse(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // 禁用 nginx 缓冲
      },
    });
  } catch (error) {
    console.error("Stream API 错误:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";

    return NextResponse.json(
      {
        error: "流式输出失败",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
