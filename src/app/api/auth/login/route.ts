import { NextRequest, NextResponse } from 'next/server'
import { generateToken, setTokenCookie } from '@/lib/auth'

// 模拟用户数据
const MOCK_USER = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123', // 实际项目中应该使用加密密码
  role: 'admin'
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 简单的用户名密码验证
    if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = await generateToken({
      id: MOCK_USER.id,
      username: MOCK_USER.username,
      role: MOCK_USER.role
    })

    await setTokenCookie(token)

    return NextResponse.json({
      id: MOCK_USER.id,
      username: MOCK_USER.username,
      email: MOCK_USER.email,
      role: MOCK_USER.role
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录过程中发生错误' },
      { status: 500 }
    )
  }
} 