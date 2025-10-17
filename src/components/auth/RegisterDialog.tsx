'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { signUpWithEmail } from '@/hooks/useAuth';
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

interface RegisterDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function RegisterDialog({ trigger, onSuccess }: RegisterDialogProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail(email, password, displayName);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-blue-600 hover:bg-blue-700">注册</Button>
          )}
        </DialogTrigger>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-sm">
          <Card className="w-full border-none p-0 shadow-none">
            <MagicCard
              gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
              className="p-0"
            >
              <CardHeader className="p-6">
                <CardTitle className="text-2xl text-green-600">注册成功！</CardTitle>
                <CardDescription>
                  请查收您的邮箱，点击确认链接完成注册。
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-6">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  关闭
                </Button>
              </CardFooter>
            </MagicCard>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">注册</Button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-sm">
        <Card className="w-full border-none p-0 shadow-none">
          <MagicCard
            gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
            className="p-0"
          >
            <CardHeader className="border-border border-b p-6">
              <CardTitle className="text-2xl">注册</CardTitle>
              <CardDescription>创建一个新账户开始使用</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleRegister}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">用户名</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="输入用户名"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reg-email">邮箱</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reg-password">密码</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="至少6个字符"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? '注册中...' : '注册'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-border border-t p-6">
              <p className="text-sm text-center w-full text-gray-600">
                已有账号？{' '}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  立即登录
                </button>
              </p>
            </CardFooter>
          </MagicCard>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

