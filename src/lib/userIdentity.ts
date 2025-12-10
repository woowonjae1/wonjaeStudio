// 用户身份管理

export interface UserIdentity {
  id: string;
  username: string;
  createdAt: number;
}

const STORAGE_KEY = "community_user";

export function getUserIdentity(): UserIdentity | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setUserIdentity(username: string): UserIdentity {
  const user: UserIdentity = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    createdAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function updateUsername(newUsername: string): UserIdentity | null {
  const user = getUserIdentity();
  if (!user) return null;

  const updated: UserIdentity = {
    ...user,
    username: newUsername,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function hasUserIdentity(): boolean {
  return getUserIdentity() !== null;
}
