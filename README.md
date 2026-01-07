# WOOWONJAE 博客

极简风格的个人博客，专注于写作和阅读体验。

## 特性

- ✨ 极简黑白灰设计
- 📝 简洁的写作体验
- 🔍 文章搜索功能
- 🌓 深色/浅色模式
- 📱 响应式设计
- 💾 本地存储（localStorage）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（文章列表）
│   ├── layout.tsx            # 全局布局
│   ├── globals.css           # 全局样式
│   └── notes/
│       ├── new/              # 写作页面
│       └── [slug]/           # 文章详情页
├── components/
│   ├── Navbar/               # 导航栏
│   ├── theme/                # 主题切换
│   └── ui/                   # 基础UI组件
└── lib/
    ├── notesStorage.ts       # 笔记存储逻辑
    ├── content.ts            # 内容管理
    ├── markdown.ts           # Markdown处理
    └── utils.ts              # 工具函数
```

## 开始使用

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 设计理念

- **极简主义**: 去除一切不必要的元素
- **高级感**: 精致的排版和留白
- **专注写作**: 无干扰的创作环境
- **阅读体验**: 舒适的字体和行距

## License

MIT
