'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Email not confirmed') {
        setMessage('请先验证您的邮箱。我们已重新发送验证邮件。');
        // Resend verification email
        await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
      } else {
        setMessage('登录失败，请检查邮箱和密码');
      }
    } else {
      setMessage('登录成功，正在跳转...');
      login({
        id: data.user.id,
        username: "",
        email: data.user.email ?? "",
        role: ""
      });
      setTimeout(() => router.push('/profile'), 1000);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('请输入您的邮箱地址');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('密码重置链接已发送到您的邮箱');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或{' '}
            <Link href="/register" className="font-medium text-[#1C2C5B] hover:text-[#98C5E9]">
              注册新账户
            </Link>
          </p>
        </div>
        
        {message && (
          <div className={`px-4 py-3 rounded relative ${message.includes('成功') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">邮箱地址</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#1C2C5B] focus:border-[#1C2C5B] focus:z-10 sm:text-sm"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#1C2C5B] focus:border-[#1C2C5B] focus:z-10 sm:text-sm"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C2C5B] hover:bg-[#98C5E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C2C5B]"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="font-medium text-[#1C2C5B] hover:text-[#98C5E9]"
          >
            忘记密码？
          </button>
        </div>
      </div>
    </div>
  );
} 