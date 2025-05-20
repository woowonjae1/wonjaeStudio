import { NextRequest, NextResponse } from 'next/server'
import { generateMusic } from '@/services/musicService'
import { getTokenFromCookies, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const token = await getTokenFromCookies()
    if (!token) {
      return NextResponse.json(
        { error: '未认证' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      )
    }

    const { prompt, duration, style, mood } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: '提示词不能为空' },
        { status: 400 }
      )
    }

    const music = await generateMusic({
      prompt,
      duration,
      style,
      mood,
    })

    return NextResponse.json(music)
  } catch (error) {
    console.error('Music generation error:', error)
    return NextResponse.json(
      { error: '音乐生成失败' },
      { status: 500 }
    )
  }
} 