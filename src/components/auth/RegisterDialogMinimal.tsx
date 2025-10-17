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
import { ShineBorder } from '@/components/ui/shine-border';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RegisterDialogMinimalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function RegisterDialogMinimal({ trigger, onSuccess }: RegisterDialogMinimalProps) {
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
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || <Button>Sign up</Button>}
        </DialogTrigger>
        <DialogContent className="p-0 border-none shadow-none max-w-md">
          <Card className="relative overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950">
            <ShineBorder shineColor={theme === 'dark' ? 'white' : 'black'} />
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">Success!</CardTitle>
              <CardDescription>
                Please check your email to confirm your account
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Sign up</Button>}
      </DialogTrigger>
      <DialogContent className="p-0 border-none shadow-none max-w-md">
        <Card className="relative overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950">
          <ShineBorder shineColor={theme === 'dark' ? 'white' : 'black'} />
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reg-email">Email</Label>
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
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

