import React from "react";
import Link from "next/link";
import { Card, Tag } from "@/components/ui";
import { MusicLink } from "./MusicEmbed";
import { formatDate } from "@/lib/markdown";
import { Post } from "@/lib/content";

interface ArticleCardProps {
  post: Post;
  variant?: "default" | "compact" | "featured";
  showTags?: boolean;
  showReadingTime?: boolean;
  className?: string;
}

export function ArticleCard({
  post,
  variant = "default",
  showTags = true,
  showReadingTime = true,
  className = "",
}: ArticleCardProps) {
  const baseClasses = "group transition-colors duration-200";
  const variantClasses = {
    default: "border-b border-border pb-6 last:border-b-0",
    compact: "p-4 border border-border rounded-lg hover:bg-secondary/20",
    featured: "p-6 border border-border rounded-lg hover:bg-secondary/20",
  };

  return (
    <article
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {/* 置顶标识 */}
      {post.pinned && variant === "featured" && (
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
            置顶
          </span>
        </div>
      )}

      {/* 标题 */}
      <h3
        className={`font-semibold mb-2 ${
          variant === "featured"
            ? "text-xl"
            : variant === "compact"
              ? "text-base"
              : "text-lg"
        }`}
      >
        <Link
          href={`/notes/${post.slug}`}
          className="hover:text-foreground/80 border-none hover:bg-transparent transition-colors"
        >
          {post.title}
        </Link>
      </h3>

      {/* 摘要 */}
      <p
        className={`text-muted-foreground mb-3 leading-relaxed ${
          variant === "compact" ? "text-sm line-clamp-2" : ""
        }`}
      >
        {post.summary}
      </p>

      {/* 音乐嵌入指示器 */}
      {post.musicEmbed && (
        <div className="flex items-center gap-2 mb-3">
          <MusicLink url={post.musicEmbed} />
        </div>
      )}

      {/* 元信息 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{formatDate(post.date)}</span>
          {showReadingTime && <span>{post.readingTime} 分钟阅读</span>}
        </div>

        {/* 标签 */}
        {showTags && post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.slice(0, variant === "compact" ? 1 : 2).map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
            {post.tags.length > (variant === "compact" ? 1 : 2) && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - (variant === "compact" ? 1 : 2)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// 文章列表组件
interface ArticleListProps {
  posts: Post[];
  variant?: "default" | "compact" | "grid";
  showTags?: boolean;
  showReadingTime?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ArticleList({
  posts,
  variant = "default",
  showTags = true,
  showReadingTime = true,
  emptyMessage = "暂无文章",
  className = "",
}: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground">敬请期待更多精彩内容</p>
      </div>
    );
  }

  const containerClasses = {
    default: "space-y-6",
    compact: "space-y-4",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {posts.map((post) => (
        <ArticleCard
          key={post.slug}
          post={post}
          variant={variant === "grid" ? "compact" : variant}
          showTags={showTags}
          showReadingTime={showReadingTime}
        />
      ))}
    </div>
  );
}

export default ArticleCard;
