"use client";

import { useCurvedLoop } from "@/contexts/CurvedLoopContext";
import CurvedLoop from "./CurvedLoop";

interface CurvedLoopWithConfigProps {
  className?: string;
}

export default function CurvedLoopWithConfig({
  className,
}: CurvedLoopWithConfigProps) {
  const { config } = useCurvedLoop();

  if (!config.enabled) {
    return null;
  }

  return (
    <CurvedLoop
      marqueeText={config.marqueeText}
      speed={config.speed}
      curveAmount={config.curveAmount}
      direction={config.direction}
      interactive={config.interactive}
      color={config.color}
      opacity={config.opacity}
      fontSize={config.fontSize}
      className={className}
    />
  );
}
