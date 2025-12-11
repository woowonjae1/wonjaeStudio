"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CurvedLoopConfig {
  enabled: boolean;
  marqueeText: string;
  speed: number;
  curveAmount: number;
  direction: "left" | "right";
  interactive: boolean;
  color: string;
  opacity: number;
  fontSize: number;
}

const defaultConfig: CurvedLoopConfig = {
  enabled: true,
  marqueeText: "Welcome to Community ✦ Share ✦ Create ✦ Connect ✦",
  speed: 1.5,
  curveAmount: 300,
  direction: "left",
  interactive: false,
  color: "#ffffff",
  opacity: 1,
  fontSize: 6,
};

const STORAGE_KEY = "curvedloop_config";

interface CurvedLoopContextType {
  config: CurvedLoopConfig;
  updateConfig: (newConfig: Partial<CurvedLoopConfig>) => void;
  resetConfig: () => void;
}

const CurvedLoopContext = createContext<CurvedLoopContextType | null>(null);

export function CurvedLoopProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CurvedLoopConfig>(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...defaultConfig, ...parsed });
      } catch {
        setConfig(defaultConfig);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, loaded]);

  const updateConfig = (newConfig: Partial<CurvedLoopConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <CurvedLoopContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </CurvedLoopContext.Provider>
  );
}

export function useCurvedLoop() {
  const context = useContext(CurvedLoopContext);
  if (!context) {
    throw new Error("useCurvedLoop must be used within CurvedLoopProvider");
  }
  return context;
}

export { defaultConfig };
