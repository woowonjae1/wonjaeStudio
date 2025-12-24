"use client";

import { DottedSurface } from "./dotted-surface";
import { cn } from "@/lib/utils";

interface DottedSurfaceVariantProps {
  className?: string;
}

// 主页背景 - 中等透明度
export function HomeDottedSurface({ className }: DottedSurfaceVariantProps) {
  return <DottedSurface className={cn("opacity-30", className)} />;
}

// 文章页面背景 - 较低透明度，不干扰阅读
export function ArticleDottedSurface({ className }: DottedSurfaceVariantProps) {
  return <DottedSurface className={cn("opacity-20", className)} />;
}

// 编辑页面背景 - 最低透明度，专注写作
export function EditorDottedSurface({ className }: DottedSurfaceVariantProps) {
  return <DottedSurface className={cn("opacity-15", className)} />;
}

// 社区页面背景 - 很低透明度，不干扰内容
export function CommunityDottedSurface({
  className,
}: DottedSurfaceVariantProps) {
  return <DottedSurface className={cn("opacity-10", className)} />;
}

// 教程页面背景 - 低透明度，保持专业感
export function TutorialDottedSurface({
  className,
}: DottedSurfaceVariantProps) {
  return <DottedSurface className={cn("opacity-15", className)} />;
}
