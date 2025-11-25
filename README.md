# Woowonjae Studio

> 音乐创作者个人平台 - 专注音乐内容价值展示

## 🎵 关于项目

Woowonjae Studio 是一个现代化的音乐创作者平台，专注于展示音乐作品和创作理念。网站采用简洁专业的设计风格，为访客提供流畅的音乐欣赏体验。

**网站地址**: [woowonjae.top](https://woowonjae.top)

## ✨ 核心功能

- 🎼 **音乐作品展示** - 专辑和单曲的精美展示
- 🎨 **3D 专辑渲染** - 基于 Three.js 的交互式 3D 专辑封面
- 🎧 **在线音频播放** - 流畅的音乐播放体验
- 🌓 **Dark/Light 主题** - 自适应主题切换

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **3D渲染**: Three.js + React Three Fiber
- **动画**: Framer Motion
- **部署**: Vercel + Cloudflare

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
src/
├── app/              # Next.js 路由
│   ├── page.tsx      # 首页
│   ├── music/        # 音乐作品页
│   └── about/        # 关于页面
├── components/       # React 组件
│   ├── album/        # 专辑相关组件
│   ├── layout/       # 布局组件
│   └── ui/           # UI 组件库
└── styles/           # 全局样式
```

## 🎨 设计理念

- **极简主义**: 简洁、专业、现代
- **内容优先**: 让音乐作品成为焦点
- **流畅体验**: 平滑的动画和交互
- **性能优化**: 快速加载，流畅运行

## 📝 开发规范

- 遵循 TypeScript 严格模式
- 使用 ESLint + Prettier 格式化代码
- 组件采用函数式编程
- 样式使用 Tailwind CSS utility classes

## 📄 许可证

MIT License

---

**Developer**: WooWonJae  
**Contact**: [通过网站联系](https://woowonjae.top/about)
