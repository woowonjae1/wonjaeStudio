"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DynamicIslandProvider } from "@/components/ui/dynamic-island"
import { DynamicAction } from "./DynamicAction"

interface LoadingTransitionProps {
  onComplete?: () => void;
}

export function LoadingTransition({ onComplete }: LoadingTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 动画序列完成后跳转
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 3000); // 3秒后完成动画

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[400px] h-[200px]">
        <DynamicIslandProvider initialSize="compact">
          <DynamicAction />
        </DynamicIslandProvider>
      </div>
    </div>
  );
} 