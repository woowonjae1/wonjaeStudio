import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET))
  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return payload
  } catch (error) {
    return null
  }
}

export async function getTokenFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get('token')?.value
}

export async function setTokenCookie(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function removeTokenCookie() {
  cookies().delete('token')
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  avatarUrl: string,
  selectedHobbies: string[]
) {
  try {
    // 1. 创建 Auth 用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user data returned from signup');
    }

    // 2. 创建 Profile 记录
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,  // 使用新创建的用户ID
        username: username,
        avatar_url: avatarUrl,
        hobbies: selectedHobbies,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
} 