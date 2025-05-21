import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'AI Agent 生态系统盘点';
const date = '2024.05.10';
const author = 'woowonjae';
const prevArticle = { title: 'Mistral AI 发布开源大模型', slug: 'mistral' };
const nextArticle = { title: 'LlamaIndex 新增多语言支持', slug: 'llamaindex' };
const content = `2024年5月10日，AI技术研究机构发布了最新的AI Agent生态系统报告。报告对当前市场上的多个AI Agent框架和平台进行了全面评估，包括AutoGPT、AgentGPT、BabyAGI等知名项目。这些智能代理系统在任务规划、工具使用和持续学习方面展现了惊人的发展速度。报告指出，新一代AI Agent逐渐突破了单一功能限制，实现了多模态感知、长程记忆和工具调用能力的有机结合。同时，报告也提到了当前AI Agent在安全性、可控性和效率方面的挑战。业内专家预测，随着技术的成熟，AI Agent将逐步应用于客户服务、个人助理、自动化运维等多个领域。`;

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
        category="ai-agents"
      />
    </div>
  );
} 