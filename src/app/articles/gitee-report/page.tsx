import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Gitee 开源社区年度报告发布';
const date = '2024.05.28';
const author = 'woowonjae';
const category = 'gitee-report';
const prevArticle = undefined;
const nextArticle = { title: '开源大模型 Llama 3 开放下载', slug: 'llama3' };
const content = `2024年5月28日，Gitee发布了最新的开源社区年度报告。报告显示，过去一年Gitee平台项目数量和活跃开发者持续增长，国产开源项目影响力显著提升。报告详细分析了各类热门项目的技术趋势、社区贡献分布以及企业参与度。值得关注的是，Gitee在代码安全、合规治理和社区生态建设方面取得了突破，推动了中国开源生态的健康发展。报告还对未来开源趋势进行了展望，强调了AI、云原生等领域的创新机遇。`;

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
        category={category}
      />
    </div>
  );
} 