import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'AI 绘画工具 Midjourney V7 体验';
const date = '2024.05.01';
const author = 'woowonjae';
const prevArticle = { title: 'LlamaIndex 新增多语言支持', slug: 'llamaindex' };
const nextArticle = { title: 'AI 代码自动补全工具对比', slug: 'ai-code-completion' };
const content = `2024年5月1日，AI绘画工具Midjourney发布了V7版本，带来了一系列令人印象深刻的更新。经过数周的实际体验，V7版本在图像质量、细节表现和创作控制方面都有显著提升。新版本大幅改进了人物面部和手部的渲染准确度，这一直是AI绘画的难点。此外，Midjourney V7还增强了对中文提示词的理解能力，支持更复杂的场景描述和风格指定。值得一提的是，新版本的生成速度提高了约40%，同时保持了更高的输出质量。对于设计师和创意工作者来说，V7版本提供的精细控制功能（如构图指导和区域编辑）使AI辅助创作更加实用和专业。`;

export default function Page() {
  return (
    <div className="max-w-5xl min-h-[700px] mx-auto flex flex-col justify-center py-16 px-4 md:px-8 bg-white rounded-2xl shadow-lg text-center mt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#232323] leading-tight text-center">
        {title}
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center text-gray-500 text-base mb-10 gap-2 text-center">
        <span>作者：{author}</span>
        <span className="hidden md:inline">|</span>
        <span>发布日期：{date}</span>
      </div>
      <article
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 mx-auto text-left"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <ArticleNavigation
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        category="midjourney-v7"
      />
    </div>
  );
} 