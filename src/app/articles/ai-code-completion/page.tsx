import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'AI 代码自动补全工具对比';
const date = '2024.04.28';
const author = 'woowonjae';
const prevArticle = { title: 'AI 绘画工具 Midjourney V7 体验', slug: 'midjourney-v7' };
const nextArticle = { title: 'AI 语音合成新突破', slug: 'ai-tts' };
const content = `2024年4月28日，我们对目前市场上主流的AI代码补全工具进行了全面测试和对比。测试涵盖了GitHub Copilot、TabNine、Codeium、Amazon CodeWhisperer等10款主流工具，从补全准确率、响应速度、多语言支持、代码安全性等多维度进行了评估。测试结果显示，GitHub Copilot在整体表现上依然领先，但其他工具在特定领域也展现出各自优势：TabNine在本地代码理解方面表现优异，Codeium在免费功能上更为丰富，CodeWhisperer则在与AWS服务集成的场景中更具优势。值得注意的是，开源模型驱动的工具在过去一年中进步显著，在某些特定语言的补全任务中已接近或超过了商业解决方案。对于不同开发者群体，推荐根据主要编程语言和项目规模选择合适的工具。`;

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
        category="ai-code-completion"
      />
    </div>
  );
} 