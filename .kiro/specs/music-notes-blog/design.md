# 设计文档

## 概述

本设计文档详细说明了将 woowonjae.top 从音乐作品展示页面重构为极简风格音乐笔记博客的技术架构和设计决策。系统将基于现有的 Next.js 技术栈，采用静态站点生成（SSG）方式，确保快速加载和优秀的 SEO 表现。

## 架构

### 技术选型

**前端框架**: Next.js 14 (App Router)

- 理由：已有技术栈，支持 SSG/SSR，优秀的性能和 SEO
- 使用 App Router 获得更好的路由管理和布局系统

**样式系统**: Tailwind CSS + CSS 变量

- 理由：已有配置，快速开发，易于维护一致的设计系统
- 扩展现有的设计令牌以支持极简设计原则

**内容管理**: 基于文件系统的 Markdown

- 理由：简单、版本控制友好、无需数据库
- 使用 gray-matter 解析 frontmatter，remark/rehype 处理 Markdown

**部署方式**: 静态站点生成 (SSG)

- 理由：最佳性能、SEO 友好、易于部署到各种平台
- 支持增量静态再生成 (ISR) 以便内容更新

### 系统架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Markdown      │    │   Next.js       │    │   Static Site   │
│   Content       │───▶│   Build Process │───▶│   Output        │
│   Files         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   RSS/Sitemap   │
                       │   Generation    │
                       └─────────────────┘
```

## 组件和接口

### 核心组件架构

```
src/
├── app/                    # Next.js App Router
│   ├── (blog)/            # 博客相关页面组
│   │   ├── page.tsx       # 首页
│   │   ├── notes/         # 笔记列表和详情
│   │   ├── topics/        # 主题聚合页
│   │   └── music/         # 音乐作品页
│   ├── globals.css        # 全局样式
│   └── layout.tsx         # 根布局
├── components/
│   ├── layout/            # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── blog/              # 博客相关组件
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── TopicChips.tsx
│   │   └── Pagination.tsx
│   └── ui/                # 基础 UI 组件
├── lib/
│   ├── content.ts         # 内容处理逻辑
│   ├── markdown.ts        # Markdown 解析
│   └── utils.ts           # 工具函数
└── content/               # Markdown 内容文件
    ├── posts/             # 博客文章
    └── pages/             # 静态页面
```

### 关键接口定义

```typescript
// 文章数据结构
interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  topics: string[];
  content: string;
  musicEmbed?: string;
  readingTime: number;
}

// 主题数据结构
interface Topic {
  name: string;
  slug: string;
  description: string;
  count: number;
}

// 分页数据结构
interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}
```

## 数据模型

### 内容组织结构

```
content/
├── posts/
│   ├── 2024-01-15-harmony-basics.md
│   ├── 2024-01-20-listening-notes-sza.md
│   └── 2024-01-25-production-tips.md
├── pages/
│   ├── about.md
│   └── start-here.md
└── config/
    ├── site.json          # 站点配置
    └── topics.json        # 主题配置
```

### Frontmatter 规范

```yaml
---
title: "和声基础学习笔记"
date: "2024-01-15"
summary: "记录学习基础和声理论的要点和实践心得"
tags: ["和声", "乐理", "学习笔记"]
topics: ["乐理"]
musicEmbed: "https://open.spotify.com/embed/track/..."
pinned: false
draft: false
---
```

### 站点配置

```json
{
  "site": {
    "title": "WOOWONJAE",
    "description": "音乐学习与聆听笔记",
    "author": "Woowonjae",
    "email": "contact@woowonjae.top",
    "url": "https://woowonjae.top",
    "social": {
      "spotify": "...",
      "youtube": "...",
      "netease": "..."
    }
  },
  "blog": {
    "postsPerPage": 10,
    "pinnedPost": "start-here"
  }
}
```

## 正确性属性

_属性是应该在系统的所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。_

### 属性 1：Markdown 内容解析一致性

_对于任何_ 有效的 Markdown 文章，解析后应该包含所有必需字段（标题、日期、摘要、标签、正文）且结构一致
**验证：需求 2.1, 2.3**

### 属性 2：响应式布局完整性

_对于任何_ 设备尺寸，页面应该保持单栏布局、可读的字符宽度（60-80字符）和最少视觉元素
**验证：需求 1.1, 1.5, 6.2**

### 属性 3：样式系统一致性

_对于任何_ 页面元素，应该使用统一的设计令牌（单一强调色、不超过2种字体、微妙悬停效果、充足留白）且符合极简设计原则
**验证：需求 1.2, 6.1, 6.3, 6.4, 6.5**

### 属性 4：内容分类和导航正确性

_对于任何_ 文章，其主题分类应该正确反映在主题聚合页面中，且导航菜单不超过4个主要项目
**验证：需求 1.4, 2.2, 3.3**

### 属性 5：分页和列表功能完整性

_对于任何_ 文章列表页面，分页功能应该正确显示所有文章且无重复或遗漏，首页显示8-12篇最新文章
**验证：需求 3.1, 3.2**

### 属性 6：搜索和导航功能准确性

_对于任何_ 搜索查询，返回的结果应该包含查询关键词且按相关性排序，文章详情页应包含上下篇导航
**验证：需求 3.4, 3.5**

### 属性 7：音乐内容嵌入正确性

_对于任何_ 包含音乐嵌入的文章，应该正确处理外部平台链接（Spotify、YouTube、网易云音乐）而不托管音频文件
**验证：需求 2.4, 4.2**

### 属性 8：SEO 和元数据完整性

_对于任何_ 页面，应该包含完整的 HTML 语义结构、meta 标签、Open Graph 标签和正确的规范 URL
**验证：需求 5.1, 5.4, 5.5**

### 属性 9：内容聚合同步性

_对于任何_ 新发布的文章，RSS 订阅和 XML 站点地图应该在构建时自动包含该文章
**验证：需求 5.2, 5.3**

### 属性 10：构建和部署稳定性

_对于任何_ 有效的内容更改，构建过程应该成功生成静态文件、处理域名重定向且优化性能
**验证：需求 7.1, 7.3, 7.4**

## 错误处理

### 内容错误处理

- **无效 Frontmatter**: 显示警告并使用默认值
- **缺失必需字段**: 构建时报错并提供清晰的错误信息
- **Markdown 解析错误**: 显示原始内容并记录错误

### 路由错误处理

- **404 页面**: 提供友好的 404 页面，包含导航回首页的链接
- **无效分页**: 重定向到第一页或最后一页
- **空搜索结果**: 显示友好的无结果页面和搜索建议

### 构建错误处理

- **内容验证**: 构建前验证所有 Markdown 文件的完整性
- **依赖错误**: 提供清晰的错误信息和解决方案
- **部署失败**: 回滚到上一个稳定版本

## 测试策略

### 单元测试

- **内容解析**: 测试 Markdown 解析和 frontmatter 提取
- **工具函数**: 测试日期格式化、阅读时间计算等工具函数
- **组件渲染**: 测试关键组件的正确渲染

### 属性测试

使用 **fast-check** 库进行属性测试，每个测试运行最少 100 次迭代：

- **属性 1**: 生成随机 Markdown 内容，验证渲染一致性
- **属性 2**: 生成不同页面配置，验证导航完整性
- **属性 3**: 生成不同屏幕尺寸，验证响应式布局
- **属性 4**: 生成随机文章和主题，验证分类正确性
- **属性 5**: 生成不同数量的文章，验证分页功能
- **属性 6**: 生成随机搜索查询，验证搜索准确性
- **属性 7**: 生成不同页面类型，验证 SEO 元数据
- **属性 8**: 生成新文章，验证 RSS 同步
- **属性 9**: 生成不同组件，验证样式一致性
- **属性 10**: 生成内容变更，验证构建稳定性

每个属性测试必须使用以下格式标记：

- `**Feature: music-notes-blog, Property 1: 内容渲染一致性**`

### 集成测试

- **端到端流程**: 测试从内容创建到页面生成的完整流程
- **SEO 验证**: 验证生成的 HTML 符合 SEO 最佳实践
- **性能测试**: 确保页面加载时间符合性能要求

### 视觉回归测试

- **页面截图**: 对关键页面进行截图对比
- **响应式测试**: 验证不同设备尺寸下的视觉表现
- **主题一致性**: 确保所有页面遵循统一的设计系统
