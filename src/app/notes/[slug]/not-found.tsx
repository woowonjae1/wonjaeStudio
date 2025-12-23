import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">404</h1>
          <h2 className="text-2xl font-medium mb-4">文章未找到</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            抱歉，您访问的文章不存在或已被删除。
          </p>
          <div className="space-x-4">
            <Link href="/notes" className="btn btn-primary">
              浏览所有笔记
            </Link>
            <Link href="/" className="btn btn-secondary">
              返回首页
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
