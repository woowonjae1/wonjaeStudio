"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";

export function DotPatternDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="relative z-10 text-center">
        <h3 className="text-2xl font-bold mb-2">漂浮效果背景</h3>
        <p>带有视觉动态效果的点阵背景</p>
      </div>
    </div>
  );
} 