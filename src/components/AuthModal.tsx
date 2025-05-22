import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
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

const HOBBIES = [
  { value: 'Music Production', label: '音乐制作 / Music Production' },
  { value: 'Code', label: '编程 / Code' },
  { value: 'NingNing', label: 'NingNing' },
  { value: 'FootBall', label: '足球 / FootBall' },
];
const MUSIC_ROLES = [
  { value: 'Mix', label: 'Mix' },
  { value: 'Vocal', label: 'Vocal' },
  { value: 'BeatMaker', label: 'BeatMaker' },
];
const CODE_ROLES = [
  { value: 'frontend', label: '前端 / Frontend' },
  { value: 'backend', label: '后端 / Backend' },
  { value: 'fullstack', label: '全栈 / Fullstack' },
];

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hobby, setHobby] = useState('');
  const [team, setTeam] = useState('');
  const [musicRole, setMusicRole] = useState('');
  const [codeRole, setCodeRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || '发生错误 / An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. 注册 Supabase Auth 用户
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      const user = data.user;
      let avatar_url = '';
      // 2. 上传头像到 Supabase Storage
      if (avatarFile && user) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `avatars/${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatar_url = urlData.publicUrl;
      }
      // 3. 写入 profiles 表
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user?.id,
        email,
        nickname,
        avatar_url,
        hobby,
        team: hobby === 'FootBall' ? team : null,
        music_role: hobby === 'Music Production' ? musicRole : null,
        code_role: hobby === 'Code' ? codeRole : null,
      });
      if (profileError) throw profileError;
      alert('注册成功，请查收邮箱激活账号！/ Registration successful, please check your email to activate your account!');
      setTab('login');
    } catch (err: any) {
      setError(err.message || '发生错误 / An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 切换Tab时清空错误和输入
  const handleTabChange = (newTab: 'login' | 'register') => {
    setTab(newTab);
    setError(null);
    setEmail('');
    setPassword('');
    setNickname('');
    setAvatarFile(null);
    setAvatarPreview(null);
    setHobby('');
    setTeam('');
    setMusicRole('');
    setCodeRole('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-0 min-w-[350px] relative" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={e => { e.stopPropagation(); onClose(); }}
        >
          ×
        </button>
        <Card className="relative w-[380px] overflow-hidden border-none shadow-none">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-center font-semibold transition-colors ${tab === 'login' ? 'text-[#1C2C5B] border-b-2 border-[#1C2C5B] bg-gray-50' : 'text-gray-500 bg-white'}`}
              onClick={() => handleTabChange('login')}
              type="button"
            >
              登录 / Login
            </button>
            <button
              className={`flex-1 py-2 text-center font-semibold transition-colors ${tab === 'register' ? 'text-[#1C2C5B] border-b-2 border-[#1C2C5B] bg-gray-50' : 'text-gray-500 bg-white'}`}
              onClick={() => handleTabChange('register')}
              type="button"
            >
              注册 / Register
            </button>
          </div>
          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>登录 / Login</CardTitle>
                <CardDescription>输入邮箱和密码登录 / Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="login-email">邮箱 / Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="请输入邮箱 / Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex flex-col space-y-1.5 mt-4">
                  <Label htmlFor="login-password">密码 / Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="请输入密码 / Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  登录 / Login
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle>注册 / Register</CardTitle>
                <CardDescription>请填写所有必填项 / Please fill in all required fields.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5 mb-2">
                  <Label htmlFor="register-nickname">昵称 / Nickname</Label>
                  <Input
                    id="register-nickname"
                    type="text"
                    placeholder="请输入昵称 / Enter your nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 mb-2">
                  <Label htmlFor="register-avatar">头像 / Avatar</Label>
                  <input
                    id="register-avatar"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="mb-2"
                  />
                  {avatarPreview && (
                    <img src={avatarPreview} alt="avatar preview" className="w-16 h-16 rounded-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col space-y-1.5 mb-2">
                  <Label htmlFor="register-email">邮箱 / Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="请输入邮箱 / Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5 mb-2">
                  <Label htmlFor="register-password">密码 / Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="请输入密码 / Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5 mb-2">
                  <Label htmlFor="register-hobby">爱好 / Hobby</Label>
                  <select
                    id="register-hobby"
                    className="border rounded px-2 py-1"
                    value={hobby}
                    onChange={e => setHobby(e.target.value)}
                    required
                  >
                    <option value="">请选择 / Please select</option>
                    {HOBBIES.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
                {/* 动态字段 */}
                {hobby === 'FootBall' && (
                  <div className="flex flex-col space-y-1.5 mb-2">
                    <Label htmlFor="register-team">主队 / Your Team</Label>
                    <Input
                      id="register-team"
                      type="text"
                      placeholder="请输入主队 / Enter your team"
                      value={team}
                      onChange={e => setTeam(e.target.value)}
                    />
                  </div>
                )}
                {hobby === 'Music Production' && (
                  <div className="flex flex-col space-y-1.5 mb-2">
                    <Label htmlFor="register-music-role">音乐类型 / Music Role</Label>
                    <select
                      id="register-music-role"
                      className="border rounded px-2 py-1"
                      value={musicRole}
                      onChange={e => setMusicRole(e.target.value)}
                      required
                    >
                      <option value="">请选择 / Please select</option>
                      {MUSIC_ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                {hobby === 'Code' && (
                  <div className="flex flex-col space-y-1.5 mb-2">
                    <Label htmlFor="register-code-role">编程方向 / Code Role</Label>
                    <select
                      id="register-code-role"
                      className="border rounded px-2 py-1"
                      value={codeRole}
                      onChange={e => setCodeRole(e.target.value)}
                      required
                    >
                      <option value="">请选择 / Please select</option>
                      {CODE_ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  注册 / Register
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
} 