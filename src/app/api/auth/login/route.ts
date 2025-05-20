import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateToken, setTokenCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = await generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    })

    await setTokenCookie(token)

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录过程中发生错误' },
      { status: 500 }
    )
  }
} 