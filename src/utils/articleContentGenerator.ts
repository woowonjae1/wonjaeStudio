interface ArticleContent {
  summary: string;
  content: string;
}

export function generateArticleContent(title: string, date: string): ArticleContent {
  // 根据标题关键词生成不同类型的内容
  const isNews = title.includes('新闻') || title.includes('报告') || title.includes('盛典');
  const isTech = title.includes('技术') || title.includes('API') || title.includes('开发');
  const isReview = title.includes('测评') || title.includes('评测') || title.includes('体验');

  let summary = '';
  let content = '';

  if (isNews) {
    summary = `最新消息：${title}。本文为您带来详细报道和分析。`;
    content = `
      <h2>事件概述</h2>
      <p>${title}于${date}发布，引起了广泛关注。本文将为您深入解析这一重要事件。</p>
      
      <h2>详细报道</h2>
      <p>根据最新消息，该事件涉及多个重要方面：</p>
      <ul>
        <li>重要发展动态</li>
        <li>相关数据统计</li>
        <li>行业影响分析</li>
      </ul>

      <h2>专家观点</h2>
      <p>业内专家对此表示：</p>
      <blockquote>
        "这是一个重要的里程碑，将对行业发展产生深远影响。"
      </blockquote>
    `;
  } else if (isTech) {
    summary = `技术解析：${title}。深入探讨技术细节和实现方案。`;
    content = `
      <h2>技术背景</h2>
      <p>${title}是一个重要的技术话题，让我们深入了解其核心概念和实现原理。</p>
      
      <h2>技术详解</h2>
      <p>主要技术特点：</p>
      <ul>
        <li>核心技术原理</li>
        <li>实现方案</li>
        <li>最佳实践</li>
      </ul>

      <h2>代码示例</h2>
      <pre><code>
// 示例代码
function example() {
  // 实现细节
}
      </code></pre>
    `;
  } else if (isReview) {
    summary = `深度测评：${title}。为您带来全面的使用体验和评价。`;
    content = `
      <h2>产品概述</h2>
      <p>${title}是一个值得关注的产品，让我们从多个维度进行评测。</p>
      
      <h2>评测要点</h2>
      <ul>
        <li>外观设计</li>
        <li>功能特性</li>
        <li>使用体验</li>
        <li>性价比分析</li>
      </ul>

      <h2>总结评价</h2>
      <p>经过全面评测，我们认为：</p>
      <blockquote>
        "这是一款值得推荐的产品，具有显著的优势和特色。"
      </blockquote>
    `;
  } else {
    summary = `专题报道：${title}。为您带来深度分析和见解。`;
    content = `
      <h2>主题介绍</h2>
      <p>${title}是一个值得深入探讨的话题，让我们从多个角度进行分析。</p>
      
      <h2>核心内容</h2>
      <ul>
        <li>主要观点</li>
        <li>相关分析</li>
        <li>未来展望</li>
      </ul>

      <h2>总结</h2>
      <p>通过以上分析，我们可以得出以下结论：</p>
      <blockquote>
        "这是一个具有重要意义的主题，值得持续关注。"
      </blockquote>
    `;
  }

  return { summary, content };
} 