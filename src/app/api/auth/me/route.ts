import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, verifyToken } from '@/lib/auth'

// 模拟用户数据
const MOCK_USER = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin'
}

export async function GET(request: NextRequest) {
  try {
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

    // 直接返回模拟用户数据
    return NextResponse.json({
      id: MOCK_USER.id,
      username: MOCK_USER.username,
      email: MOCK_USER.email,
      role: MOCK_USER.role
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: '获取用户信息时发生错误' },
      { status: 500 }
    )
  }
} 