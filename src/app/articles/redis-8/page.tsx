import React from 'react';
import ArticleNavigation from '@/components/ArticleNavigation';

const title = 'Redis 8.0 新功能解读';
const date = '2024.05.15';
const author = 'woowonjae';
const prevArticle = { title: 'Kubernetes 1.30 发布', slug: 'k8s-130' };
const nextArticle = { title: '云原生微服务架构最佳实践', slug: 'cloud-native-microservices' };
const content = `2024年5月15日，Redis官方发布了期待已久的8.0版本，带来了多项重要功能更新和性能优化。本文将深入解析Redis 8.0的亮点特性。首先，Redis 8.0新增了Function功能，支持在服务端执行Lua之外的JavaScript脚本，并提供了更完善的函数管理机制。其次，引入了新的向量搜索引擎（Vector Search Engine），原生支持向量相似度搜索，为AI应用提供了关键基础设施。此外，Redis 8.0还优化了内存使用效率，通过改进的数据结构压缩算法，平均节省15%-20%的内存占用。在安全性方面，增强了访问控制列表（ACL）系统，支持更细粒度的权限管理。性能测试显示，Redis 8.0在高并发场景下吞吐量提升约25%，响应延迟降低约15%。对于大规模部署Redis集群的企业用户，8.0版本还提供了更强大的集群管理工具和监控接口。`;

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
        category="redis-8"
      />
    </div>
  );
} 