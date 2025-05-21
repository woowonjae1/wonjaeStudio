import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Google Gemini 2.0 多模态AI模型发布';
const date = '2024.06.01';
const author = 'woowonjae';
const prevArticle = undefined;
const nextArticle = { title: 'Suno AI 推出音乐生成新功能', slug: 'suno-music' };
const content = `2024年6月1日，Google正式发布了Gemini 2.0多模态AI模型。这一最新版本在图像识别、视频理解、文本生成等方面均实现了显著突破。Gemini 2.0支持实时视觉推理和多步骤规划能力，能够同时理解和处理文本、图像、音频和视频输入。官方数据显示，在多个基准测试中，Gemini 2.0的表现超越了目前市场上的主流大型语言模型。Google表示，此次升级将为开发者提供更强大的API接口，并计划在未来几个月内开放更多的企业级功能。`;

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
        category="gemini-2"
      />
    </div>
  );
} 