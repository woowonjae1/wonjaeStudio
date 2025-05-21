import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'LangChain 生态持续壮大';
const date = '2024.05.05';
const author = 'woowonjae';
const prevArticle = undefined;
const nextArticle = { title: 'Hugging Face Spaces 热门项目推荐', slug: 'hf-spaces' };
const content = `2024年5月5日，LangChain 生态系统迎来快速发展。作为连接大语言模型与实际应用的桥梁，LangChain 不断扩展其插件和集成能力，支持多种数据源、工具链和云服务。社区贡献者积极开发各类模块，推动了知识库问答、智能助手、自动化办公等场景的落地。业内专家认为，LangChain 的生态繁荣将加速 AI 应用创新，降低企业智能化门槛。`;

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
        category="langchain"
      />
    </div>
  );
} 