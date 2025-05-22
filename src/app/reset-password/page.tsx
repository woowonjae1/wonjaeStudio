'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('无效的密码重置链接');
      return;
    }
  }, [token]);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('两次输入的密码不一致');
      return;
    }

    if (passwordStrength < 3) {
      setMessage('密码强度不够，请包含大小写字母、数字和特殊字符');
      return;
    }

    setLoading(true);
    try {
      // 验证重置令牌
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token!,
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      // 更新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // 强制登出所有设备
      await supabase.auth.signOut();

      setMessage('密码重置成功！请使用新密码登录');
      setTimeout(() => router.push('/login'), 2000);
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
            重置密码
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

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">新密码</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#1C2C5B] focus:border-[#1C2C5B] focus:z-10 sm:text-sm"
                placeholder="新密码"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">确认密码</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#1C2C5B] focus:border-[#1C2C5B] focus:z-10 sm:text-sm"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      passwordStrength >= 3 ? 'bg-green-500' :
                      passwordStrength >= 2 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {passwordStrength >= 3 ? '强' :
                   passwordStrength >= 2 ? '中' :
                   '弱'}
                </span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C2C5B] hover:bg-[#98C5E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C2C5B]"
            >
              {loading ? '处理中...' : '重置密码'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 