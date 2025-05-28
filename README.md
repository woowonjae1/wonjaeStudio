# Woowonjae Studio

A Next.js application with music production, football news, and personal blog features.

## Project Structure

This project follows the Next.js App Router structure:

```
src/
├── app/ - Main Next.js app directory (routes)
│   ├── page.tsx - Landing page (/)
│   ├── landing.tsx - Landing page component
│   ├── home/ - Home route (/home)
│   │   └── page.tsx - Home page component
│   └── not-found.tsx - Custom 404 page
├── components/ - Reusable components
│   └── HomeComponent.tsx - Main home page content
├── contexts/ - React contexts
│   └── ThemeContext.tsx - Theme provider
├── types/ - TypeScript type definitions
├── utils/ - Utility functions and constants
└── styles/ - Global styles
```

## Routing

The project uses Next.js App Router for routing. Each directory inside `src/app/` represents a route, with `page.tsx` files defining the route's content:

- `/` - Landing page
- `/home` - Home page
- `/debug-route` - Debugging tool for routes

## Fixing 404 Errors

If you encounter 404 errors, check the following:

1. **Make sure you're navigating to valid routes**:
   - The main routes are `/` and `/home`

2. **Check for routing conflicts**:
   - Ensure you don't have both `app/home.tsx` and `app/home/page.tsx`
   - Only one app directory should exist (in `src/app`, not a root-level `app/`)

3. **Verify imports**:
   - Make sure all dynamic imports use `{ ssr: false }` for client components with browser APIs

4. **Check the Next.js config**:
   - Ensure `next.config.js` is set up correctly

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

If you encounter a 404 error:

1. Check the URL in your browser's address bar
2. Visit the debug route at `/debug-route` to see available routes
3. Make sure the server is running (`npm run dev`)
4. Check the console for any errors

## 技术栈

- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Three.js
- Framer Motion (动画效果)
- React Three Fiber (Three.js React 渲染器)

## 功能特点

- 响应式设计
- 3D 专辑展示
- 音频播放器
- 博客文章展示
- 滚动动画效果
- SEO 优化

## 项目结构

项目采用模块化设计，主要分为以下几个部分：
- 布局组件 (Header, Footer, Navigation)
- 页面部分 (About, Blog, Music, Albums)
- 专辑展示 (3D 渲染, 播放控制)
- 音频播放器

## 开发指南

1. 安装依赖：