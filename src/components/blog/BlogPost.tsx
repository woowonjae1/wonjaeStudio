'use client';

import Image from 'next/image';
import { SanityPost, urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

interface BlogPostProps {
  post: SanityPost;
}

// Portable Text 组件配置
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ' '}
            width={800}
            height={450}
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>,
    normal: ({ children }: any) => <p className="text-lg leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  },
};

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* 文章头部 */}
      <header className="mb-8">
        {post.category && (
          <div className="text-blue-600 font-semibold mb-2">{post.category.title}</div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {post.author && (
            <div className="flex items-center space-x-2">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <time>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
          )}
        </div>
      </header>

      {/* 封面图 */}
      {post.coverImage && (
        <div className="mb-8">
          <Image
            src={urlFor(post.coverImage).width(1200).height(600).url()}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg w-full"
            priority
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none">
        <PortableText value={post.content} components={portableTextComponents} />
      </div>
    </article>
  );
}

