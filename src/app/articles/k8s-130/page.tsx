import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Kubernetes 1.30 发布';
const date = '2024.05.20';
const author = 'woowonjae';
const prevArticle = { title: 'MySQL 9.0 性能优化实践', slug: 'mysql-90' };
const nextArticle = { title: 'Redis 8.0 新功能解读', slug: 'redis-8' };
const content = `2024年5月20日，Kubernetes社区正式发布了1.30版本。本次更新带来了多项备受期待的功能，其中最重要的包括稳定版的网关API、改进的自动扩缩容机制和强化的安全特性。Gateway API成为稳定特性意味着它可以作为企业级生产环境中处理入站网络流量的标准解决方案。此外，Kubernetes 1.30优化了集群资源分配的效率，通过引入细粒度的资源请求和限制，更精确地管理CPU和内存资源。在安全性方面，增强了Pod安全准入控制、支持更灵活的网络策略配置，并改进了与外部身份提供商的集成。Kubernetes 1.30还提供了简化的升级路径和更友好的故障排查工具，大幅降低了运维成本。各大云服务提供商已宣布将在近期支持此版本。`;

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
        category="k8s-130"
      />
    </div>
  );
} 