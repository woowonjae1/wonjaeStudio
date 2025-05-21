import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Node.js 22 LTS 发布';
const date = '2024.06.01';
const author = 'woowonjae';
const prevArticle = undefined;
const nextArticle = { title: 'Spring Boot 3.2 新特性', slug: 'springboot-32' };
const content = `2024年6月1日，Node.js发布了v22 LTS长期支持版本。这一版本带来了多项重要更新，包括性能优化、安全增强和新的JavaScript语言特性支持。Node.js 22使用了V8 JavaScript引擎的最新版本，支持ES2024标准，并改进了CommonJS和ES模块的互操作性。值得注意的是，这一版本通过引入持久化WebSocket API、优化垃圾回收器和增强诊断报告功能，显著提升了服务端应用的性能和可靠性。此外，Node.js 22还增加了内置的测试运行器、优化的fetch API和对Arm64架构的全面支持。官方表示，该LTS版本将获得至少3年的安全和性能更新支持，适合生产环境长期部署使用。`;

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
        category="nodejs-22"
      />
    </div>
  );
} 