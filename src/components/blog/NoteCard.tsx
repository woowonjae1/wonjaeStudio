import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { MusicLink } from "./MusicEmbed";
import { formatDate } from "@/lib/markdown";
import { Post } from "@/lib/content";
import "./NoteCard.css";

interface NoteCardProps {
  post: Post;
  className?: string;
}

export function NoteCard({ post, className = "" }: NoteCardProps) {
  // 为笔记生成一个占位图片
  const getPlaceholderImage = (title: string) => {
    const images = [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", // 音乐相关
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80", // 音乐工作室
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", // 音乐设备
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80", // 音乐制作
    ];
    const index = title.length % images.length;
    return images[index];
  };

  return (
    <Card
      className={`note-card group grid grid-rows-[auto_auto_1fr_auto] overflow-hidden ${className}`}
    >
      {/* 图片区域 */}
      <div className="aspect-[16/9] w-full overflow-hidden">
        <Link
          href={`/notes/${post.slug}`}
          className="block transition-transform duration-300 hover:scale-105"
        >
          <img
            src={getPlaceholderImage(post.title)}
            alt={post.title}
            className="h-full w-full object-cover object-center"
          />
        </Link>
      </div>

      {/* 卡片头部 */}
      <CardHeader className="pb-3">
        {/* 置顶标识 */}
        {post.pinned && (
          <Badge variant="secondary" className="w-fit mb-2">
            📌 置顶
          </Badge>
        )}

        {/* 标题 */}
        <h3 className="text-lg font-semibold hover:underline md:text-xl line-clamp-2">
          <Link href={`/notes/${post.slug}`}>{post.title}</Link>
        </h3>
      </CardHeader>

      {/* 卡片内容 */}
      <CardContent className="pb-3">
        {/* 摘要 */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
          {post.summary}
        </p>

        {/* 音乐嵌入指示器 */}
        {post.musicEmbed && (
          <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-md mb-3">
            <span className="text-xs text-muted-foreground">🎵 包含音乐</span>
          </div>
        )}

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* 卡片底部 */}
      <CardFooter className="pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.readingTime}min</span>
        </div>

        <Link
          href={`/notes/${post.slug}`}
          className="flex items-center text-sm font-medium text-foreground hover:underline transition-colors"
        >
          阅读
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}

// 简化的个人签名组件
export function PersonalSignature() {
  return (
    <div className="flex items-center gap-3 p-4 mb-8 rounded-lg bg-secondary/20 border border-border">
      <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-sm font-bold">
        WJ
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 dark:text-white text-sm">
          WOOWONJAE
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          音乐制作人 · 记录者
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        {new Date().getFullYear()}
      </Badge>
    </div>
  );
}

// 卡片网格布局组件
interface NoteGridProps {
  posts: Post[];
  emptyMessage?: string;
  className?: string;
  showSignature?: boolean;
}

export function NoteGrid({
  posts,
  emptyMessage = "还没有写过笔记",
  className = "",
  showSignature = true,
}: NoteGridProps) {
  if (posts.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="max-w-sm mx-auto">
          <div className="text-6xl mb-4 opacity-30">📝</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            开始记录
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {emptyMessage}
          </p>
          <Link
            href="/notes/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
          >
            写第一篇笔记
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showSignature && <PersonalSignature />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {posts.map((post) => (
          <NoteCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

export default NoteCard;
