# 项目配置指南

## 1. 环境变量配置

复制 `.env.example` 为 `.env.local` 并填写实际值：

```bash
cp .env.example .env.local
```

### Supabase 配置

1. 访问 [https://supabase.com](https://supabase.com) 创建项目
2. 在项目设置中获取：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. 运行 `supabase-setup.sql` 脚本初始化数据库表

### OpenAI 配置

1. 访问 [https://platform.openai.com](https://platform.openai.com)
2. 创建 API Key
3. 设置 `OPENAI_API_KEY`

### Sanity CMS 配置

1. 安装 Sanity CLI：`npm install -g @sanity/cli`
2. 初始化 Sanity 项目：参考 `sanity-schema-example.md`
3. 配置环境变量：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`

## 2. 数据库初始化

### Supabase 数据库设置

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 复制 `supabase-setup.sql` 内容并执行
4. 创建 Storage Buckets：
   - `albums-covers` (公开)
   - `audio-files` (公开)
   - `blog-images` (公开)
   - `user-avatars` (公开)

### 迁移现有数据

如果需要迁移 `src/utils/constants.ts` 中的专辑数据到 Supabase：

```bash
npm run migrate-albums
```

## 3. 开发环境运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 打开浏览器
# http://localhost:3000
```

## 4. 代码质量检查

```bash
# Lint 检查
npm run lint

# Lint 并自动修复
npm run lint:fix

# 格式化代码
npm run format
```

## 5. Git Hooks 配置

Husky 已配置在提交前自动运行 lint-staged：
- 自动格式化代码
- 自动修复 ESLint 错误
- 只处理暂存的文件

## 6. 部署配置

### Vercel 部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（复制 .env.local 的内容）
4. 部署

### 环境变量设置

在 Vercel 项目设置中添加所有环境变量：
- Supabase 配置
- OpenAI API Key
- Sanity CMS 配置

## 7. 功能使用说明

### 用户认证

- 注册：`/auth/register`
- 登录：`/auth/login`
- 支持邮箱密码和社交登录（Google, GitHub）

### 内容管理

- 博客管理：通过 Sanity Studio
- 专辑管理：需要管理员权限，可通过 Supabase 直接操作或创建管理后台

### 社交功能

- 评论：登录后可在专辑、文章下评论
- 收藏：登录后可收藏专辑、文章
- 播放历史：自动记录播放记录

## 8. 常见问题

### Q: 如何成为管理员？

A: 在 Supabase Dashboard 的 `profiles` 表中，将用户的 `role` 字段改为 `admin`

### Q: 如何上传音频文件？

A: 
1. 使用 Supabase Storage 上传到 `audio-files` bucket
2. 获取公开 URL
3. 在 `albums` 表中创建记录并填写 `audio_url`

### Q: 图片优化建议

- 专辑封面：建议尺寸 600x600px
- 博客封面：建议尺寸 1200x630px
- 用户头像：建议尺寸 200x200px
- 格式：优先使用 WebP

### Q: 如何设置 Sanity Webhook？

参考 `sanity-schema-example.md` 中的 Webhook 配置章节

## 9. 性能优化建议

- 使用 `next/image` 组件优化图片
- 启用 ISR 实现静态页面增量更新
- 音频文件使用 CDN 加速
- 开启 Gzip/Brotli 压缩

## 10. 安全建议

- 定期更新依赖包
- 使用环境变量存储敏感信息
- 启用 Supabase RLS 策略
- API 路由添加速率限制
- 定期备份数据库

