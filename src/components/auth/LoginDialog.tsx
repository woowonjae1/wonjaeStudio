'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { signInWithEmail, signInWithProvider } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicCard } from '@/components/ui/magic-card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface LoginDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function LoginDialog({ trigger, onSuccess }: LoginDialogProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      setOpen(false);
      if (onSuccess) onSuccess();
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await signInWithProvider(provider);
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            登录
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-sm">
        <Card className="w-full border-none p-0 shadow-none">
          <MagicCard
            gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
            className="p-0"
          >
            <CardHeader className="border-border border-b p-6">
              <CardTitle className="text-2xl">登录</CardTitle>
              <CardDescription>输入您的凭据以访问您的账户</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleEmailLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500">
                      或使用
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                  >
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-border border-t p-6">
              <p className="text-sm text-center w-full text-gray-600">
                还没有账号？{' '}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  立即注册
                </button>
              </p>
            </CardFooter>
          </MagicCard>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

