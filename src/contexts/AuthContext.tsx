'use client'

import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  nickname?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // 默认用户信息
  const defaultUser: User = {
    id: 'default',
    username: 'Guest',
    email: '',
    role: 'guest',
  };

  const value = {
    user: defaultUser,
    isAuthenticated: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 