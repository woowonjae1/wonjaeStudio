'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查环境变量是否已设置
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('环境变量未设置: 请配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户类型定义
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  nickname?: string;
}

// AuthContext 类型定义
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  clearSession: () => Promise<void>;
}

// 创建上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => ({ success: false }),
  uploadAvatar: async () => ({ success: false }),
  clearSession: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 清除会话
  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('清除会话失败:', error);
    }
  };

  // 初始化时检查用户会话
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('检查用户会话状态...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('找到有效会话');
          // 获取用户资料
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('获取资料失败:', profileError);
            // 如果没有找到资料，则创建一个
            if (profileError.code === 'PGRST116') {
              console.log('未找到用户资料，正在创建新资料...');
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([{
                  id: session.user.id,
                  email: session.user.email,
                  username: session.user.email?.split('@')[0] || '',
                  role: 'user',
                  created_at: new Date().toISOString(),
                }]);
              
              if (insertError) {
                console.error('创建资料失败:', insertError);
                return;
              }
            } else {
              return;
            }
          }

          // 获取头像 URL
          let avatarUrl = profileData?.avatar_url || '';
          if (avatarUrl && !avatarUrl.includes('http')) {
            try {
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(avatarUrl);
              avatarUrl = data.publicUrl;
            } catch (e) {
              console.error('获取头像URL失败:', e);
              avatarUrl = '';
            }
          }

          // 设置用户状态
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profileData?.username || session.user.email?.split('@')[0] || '',
            role: profileData?.role || 'user',
            avatar_url: avatarUrl,
            nickname: profileData?.nickname || '',
          });
          setIsAuthenticated(true);
        } else {
          console.log('未找到有效会话');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('验证检查失败:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // 获取用户资料
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // 获取头像 URL
          let avatarUrl = profileData?.avatar_url || '';
          if (avatarUrl && !avatarUrl.includes('http')) {
            const { data } = supabase.storage
              .from('avatars')
              .getPublicUrl(avatarUrl);
            avatarUrl = data.publicUrl;
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profileData?.username || session.user.email?.split('@')[0] || '',
            role: profileData?.role || 'user',
            avatar_url: avatarUrl,
            nickname: profileData?.nickname || '',
          });
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 登录函数
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('登录错误:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // 获取用户资料
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // 获取头像 URL
        let avatarUrl = profileData?.avatar_url || '';
        if (avatarUrl && !avatarUrl.includes('http')) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(avatarUrl);
          avatarUrl = urlData.publicUrl;
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          username: profileData?.username || data.user.email?.split('@')[0] || '',
          role: profileData?.role || 'user',
          avatar_url: avatarUrl,
          nickname: profileData?.nickname || '',
        });
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: '登录失败，请稍后再试' };
    } catch (error) {
      console.error('登录异常:', error);
      return { success: false, error: '登录时发生错误，请稍后再试' };
    }
  };

  // 注册函数
  const register = async (email: string, password: string, username: string) => {
    try {
      // 创建新用户
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('注册错误:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // 创建用户资料
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username,
              email,
              role: 'user',
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('资料创建错误:', profileError.message);
          return { success: false, error: profileError.message };
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          username,
          role: 'user',
          avatar_url: '',
        });
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: '注册失败，请稍后再试' };
    } catch (error) {
      console.error('注册异常:', error);
      return { success: false, error: '注册时发生错误，请稍后再试' };
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await clearSession();
    } catch (error) {
      console.error('登出错误:', error);
    }
  };

  // 上传头像
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      console.log('开始上传头像...');
      // 验证文件类型
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')) {
        return { success: false, error: '只支持图片文件 (JPG, PNG, GIF, WEBP)' };
      }

      // 验证文件大小 (最大2MB)
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: '图片大小不能超过2MB' };
      }

      // 生成唯一文件名
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(`上传路径: ${filePath}`);

      // 上传文件
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('头像上传错误:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // 获取公共 URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;
      console.log(`头像URL: ${avatarUrl}`);

      // 更新用户资料
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) {
        console.error('资料更新错误:', updateError);
        return { success: false, error: updateError.message };
      }

      // 更新本地用户状态
      setUser({ ...user, avatar_url: avatarUrl });
      console.log('头像上传成功');

      return { success: true, url: avatarUrl };
    } catch (error) {
      console.error('头像上传异常:', error);
      return { success: false, error: '上传头像时发生错误，请稍后再试' };
    }
  };

  // 更新用户资料
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        console.error('资料更新错误:', error);
        return { success: false, error: error.message };
      }

      setUser({ ...user, ...profileData });
      return { success: true };
    } catch (error) {
      console.error('资料更新异常:', error);
      return { success: false, error: '更新资料时发生错误，请稍后再试' };
    }
  };

  // 提供上下文值
  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    clearSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 导出 useAuth 钩子
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
} 