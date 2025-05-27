import { NextRequest, NextResponse } from 'next/server'
import { generateMusic } from '@/services/musicService'

export async function POST(request: NextRequest) {
  try {
    // 直接处理请求，无需认证
    const body = await request.json();
    const result = await generateMusic(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: '音乐生成失败' },
      { status: 500 }
    );
  }
} 