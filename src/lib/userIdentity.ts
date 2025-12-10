// 简单的用户识别系统，基于 localStorage 存储随机生成的用户信息

const adjectives = [
  "Happy",
  "Cool",
  "Swift",
  "Bright",
  "Silent",
  "Wild",
  "Calm",
  "Bold",
  "Wise",
  "Free",
  "Lucky",
  "Brave",
  "Chill",
  "Fresh",
  "Sharp",
  "Smooth",
  "Quick",
  "Warm",
  "Deep",
  "Pure",
];

const nouns = [
  "Producer",
  "Mixer",
  "Artist",
  "Creator",
  "Maker",
  "Sound",
  "Beat",
  "Wave",
  "Tone",
  "Vibe",
  "Flow",
  "Rhythm",
  "Melody",
  "Bass",
  "Synth",
  "Loop",
  "Track",
  "Audio",
  "Music",
  "Note",
];

function generateUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

function generateAvatar(): string {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export interface UserIdentity {
  id: string;
  username: string;
  avatarColor: string;
  createdAt: number;
}

export function getUserIdentity(): UserIdentity {
  if (typeof window === "undefined") {
    return {
      id: "guest",
      username: "Guest",
      avatarColor: "#6b7280",
      createdAt: Date.now(),
    };
  }

  const stored = localStorage.getItem("user_identity");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // 如果解析失败，生成新的
    }
  }

  const newUser: UserIdentity = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: generateUsername(),
    avatarColor: generateAvatar(),
    createdAt: Date.now(),
  };

  localStorage.setItem("user_identity", JSON.stringify(newUser));
  return newUser;
}

export function resetUserIdentity(): UserIdentity {
  if (typeof window === "undefined") {
    return getUserIdentity();
  }
  localStorage.removeItem("user_identity");
  return getUserIdentity();
}
