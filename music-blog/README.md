# Woowonjae Music Blog

一个基于 Next.js 的音乐博客网站。

## 项目结构

```
music-blog/
├── app/                    # Next.js 应用目录
│   ├── dashboard/         # 仪表板页面
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── public/               # 静态资源
│   └── image/           # 图片资源
├── src/                 # 源代码
│   ├── components/      # 组件
│   │   ├── ui/         # UI组件
│   │   │   ├── dot-pattern.tsx    # 背景点阵组件
│   │   │   └── floating-card.tsx  # 浮动卡片组件
│   │   └── AppHeader.tsx          # 应用头部
│   └── lib/            # 工具函数
└── .env.local          # 环境变量（需要手动创建）
```

## 功能特性

- 响应式设计
- 动画效果
- 音乐博客内容展示

## 开发设置

1. 安装依赖：
```bash
npm install
```

2. 创建 `.env.local` 文件并添加 Supabase 配置：
```
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

3. 启动开发服务器：
```bash
npm run dev
```

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- React

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
