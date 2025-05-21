import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = '云原生微服务架构最佳实践';
const date = '2024.05.10';
const author = 'woowonjae';
const prevArticle = { title: 'Redis 8.0 新功能解读', slug: 'redis-8' };
const nextArticle = { title: 'Go 1.22 新增泛型支持', slug: 'go-122' };
const content = `2024年5月10日，随着云原生技术的不断成熟，微服务架构实践也在持续演进。本文总结了2024年云原生微服务架构的最佳实践经验。首先，服务网格技术已成为微服务通信的标准解决方案，Istio、Linkerd等工具极大简化了服务间通信的治理。其次，API网关模式发展为多层次架构，包括边缘网关、内部网关和服务网关，更精细地管理流量。在可观测性方面，OpenTelemetry逐渐成为主流标准，统一了指标、日志和追踪三大支柱。容器编排方面，Kubernetes的多集群管理和GitOps工作流成为规模化部署的关键实践。此外，无服务器架构与微服务的融合部署模式正在兴起，适合事件驱动型场景。最后，DDD（领域驱动设计）与微服务边界划分的协同方法论得到了广泛认可。企业实践表明，采用这些最佳实践可有效提升系统弹性和开发效率。`;

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
        category="cloud-native-microservices"
      />
    </div>
  );
} 