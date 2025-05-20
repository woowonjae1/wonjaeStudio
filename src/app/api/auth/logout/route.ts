import { NextResponse } from 'next/server'
import { removeTokenCookie } from '@/lib/auth'

export async function POST() {
  try {
    await removeTokenCookie()
    return NextResponse.json({ message: '登出成功' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '登出过程中发生错误' },
      { status: 500 }
    )
  }
} 