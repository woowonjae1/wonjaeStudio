'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      
      if (error) throw error;
      
      setMessage('邮箱验证成功！正在跳转到登录页面...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('请先登录');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) throw error;
      setMessage('验证邮件已重新发送，请查收');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            邮箱验证
          </h2>
        </div>
        
        {message && (
          <div className={`px-4 py-3 rounded relative ${
            message.includes('成功') ? 'bg-green-100 border border-green-400 text-green-700' : 
            'bg-red-100 border border-red-400 text-red-700'
          }`} role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={resendVerification}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C2C5B] hover:bg-[#98C5E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C2C5B]"
          >
            {loading ? '处理中...' : '重新发送验证邮件'}
          </button>
        </div>
      </div>
    </div>
  );
} 