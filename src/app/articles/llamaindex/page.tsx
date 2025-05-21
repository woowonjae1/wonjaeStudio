import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'LlamaIndex 新增多语言支持';
const date = '2024.05.05';
const author = 'woowonjae';
const prevArticle = { title: 'AI Agent 生态系统盘点', slug: 'ai-agents' };
const nextArticle = { title: 'AI 绘画工具 Midjourney V7 体验', slug: 'midjourney-v7' };
const content = `2024年5月5日，大型语言模型应用框架LlamaIndex宣布新增全面的多语言支持功能。此次更新增加了对中文、日语、韩语、俄语等多种语言的原生支持，大幅提升了非英语文档的索引和检索效果。LlamaIndex团队表示，新版本在多语言语义理解、跨语言查询和文档处理方面进行了深度优化，使开发者能够更便捷地构建多语言知识库和问答系统。此外，此次更新还改进了中文分词器和向量化模型，更好地保留了中文语义信息。开发者可以通过简单配置，轻松构建适用于不同语言场景的AI应用，这将显著降低多语言AI系统的开发门槛。`;

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
        category="llamaindex"
      />
    </div>
  );
} 