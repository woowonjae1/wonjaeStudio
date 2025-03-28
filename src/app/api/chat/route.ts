import { NextResponse } from 'next/server';
import OpenAI from "openai";

// 使用OpenAI SDK调用DeepSeek API
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  try {
    // 使用OpenAI SDK创建聊天补全
    const completion = await openai.chat.completions.create({
      messages,
      model: "deepseek-chat",
      temperature: 0.7,
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error("AI API调用失败:", error);
    
    // 错误处理和备用响应
    const userMessage = messages[messages.length - 1].content;
    const responses = [
      `关于"${userMessage}"，作为音乐制作者，我建议你尝试...(API连接暂时不可用)`,
      `我理解你想了解"${userMessage}"。从经验来看，最好的方法是...(API连接暂时不可用)`,
      `"${userMessage}"是个好问题。在音乐制作中，通常我们会...(API连接暂时不可用)`,
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return NextResponse.json({ message: randomResponse });
  }
} 