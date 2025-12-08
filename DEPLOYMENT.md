# 部署与使用指南

## ✅ 已完成的任务

1. ✅ 清理项目结构，删除冗余文件
2. ✅ 配置 ESLint + Prettier + Husky
3. ✅ 接入 next/image 优化图片
4. ✅ 搭建 Supabase 数据库和 Storage
5. ✅ 搭建用户认证系统
6. ✅ 添加评论和收藏功能
7. ✅ 接入 Sanity CMS 管理博客

## 🚀 现在你需要做的事情

### 1. 配置 Supabase（必需）

#### 步骤 1：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 创建新组织和项目
4. 等待项目初始化完成

#### 步骤 2：运行数据库迁移

1. 在 Supabase Dashboard 中，进入 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-setup.sql` 文件的全部内容
4. 粘贴并运行 SQL

#### 步骤 3：创建 Storage Buckets

在 Supabase Dashboard 的 Storage 中创建以下 buckets（全部设为 Public）：

- `albums-covers` - 专辑封面
- `audio-files` - 音频文件
- `blog-images` - 博客图片
- `user-avatars` - 用户头像

#### 步骤 4：配置环境变量

创建 `.env.local` 文件：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
SUPABASE_SERVICE_ROLE_KEY=你的service_role key

# OpenAI (可选)
OPENAI_API_KEY=你的OpenAI API key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

在 Supabase Dashboard 的 Settings > API 中找到这些密钥。

### 2. 配置 Sanity CMS（可选，用于博客）

如果你想使用 Sanity 管理博客内容：

#### 步骤 1：安装 Sanity CLI

```bash
npm install -g @sanity/cli
```

#### 步骤 2：创建 Sanity 项目

```bash
# 在项目根目录外创建
cd ..
sanity init

# 选择：
# - Create new project
# - 输入项目名称
# - 选择 dataset: production
# - 选择模板: Clean project
```

#### 步骤 3：配置 Schema

参考 `sanity-schema-example.md` 文件配置你的 schemas

#### 步骤 4：部署 Sanity Studio

```bash
cd sanity-studio
sanity deploy
```

#### 步骤 5：更新环境变量

在 `.env.local` 中添加：

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=你的项目ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=你的API token
```

### 3. 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🎯 登录系统使用指南

### 现在可以使用登录功能了！

#### 1. 注册新用户

- 访问 http://localhost:3000/auth/register
- 填写用户名、邮箱和密码
- 提交注册
- **重要**：查收邮箱中的确认邮件并点击确认链接

#### 2. 登录

- 访问 http://localhost:3000/auth/login
- 使用邮箱和密码登录
- 或点击 Google/GitHub 社交登录

#### 3. 用户功能

登录后你可以：

- ✅ 查看个人信息（/dashboard）
- ✅ 收藏专辑/文章（点击收藏按钮）
- ✅ 发表评论
- ✅ 查看播放历史
- ✅ 管理收藏列表

#### 4. 在页面中使用

在任何页面的右上角：

- 未登录：显示"登录"和"注册"按钮
- 已登录：显示用户邮箱，点击进入个人面板

### 社交登录配置（可选）

如需启用 Google/GitHub 登录：

1. 在 Supabase Dashboard > Authentication > Providers
2. 启用 Google/GitHub
3. 配置 OAuth 应用：
   - Google: https://console.cloud.google.com
   - GitHub: https://github.com/settings/developers
4. 填入 Client ID 和 Secret

## 📝 添加评论和收藏功能

### 在专辑页面使用

```tsx
import CommentSection from '@/components/social/CommentSection';
import FavoriteButton from '@/components/social/FavoriteButton';

// 在你的页面组件中
<FavoriteButton itemType="album" itemId={albumId} />
<CommentSection itemType="album" itemId={albumId} />
```

### 在博客文章页面使用

```tsx
<FavoriteButton itemType="post" itemId={postId} />
<CommentSection itemType="post" itemId={postId} />
```

## 🔧 常见问题

### Q: 登录后显示"Missing Supabase environment variables"

A: 检查 `.env.local` 文件是否正确配置，重启开发服务器

### Q: 注册后没收到确认邮件

A:

1. 检查垃圾邮件文件夹
2. 在 Supabase Dashboard > Authentication > Email Templates 查看邮件配置
3. 开发环境可以在 Supabase Dashboard > Authentication > Users 手动确认用户

### Q: 评论/收藏功能不工作

A: 确保：

1. 已运行 `supabase-setup.sql` 创建表
2. 用户已登录
3. RLS 策略正确配置

### Q: 图片无法显示

A: 检查 `next.config.js` 中的 `remotePatterns` 配置

## 📊 数据管理

### 查看数据

在 Supabase Dashboard > Table Editor 中可以查看和编辑：

- profiles - 用户资料
- albums - 专辑数据
- posts - 文章数据
- comments - 评论
- favorites - 收藏
- play_history - 播放历史

### 上传媒体文件

在 Supabase Dashboard > Storage 中上传：

- 专辑封面到 `albums-covers`
- 音频文件到 `audio-files`
- 博客图片到 `blog-images`

## 🚀 部署到生产环境

### Vercel 部署

1. 推送代码到 GitHub
2. 访问 [https://vercel.com](https://vercel.com)
3. Import 你的仓库
4. 配置环境变量（复制 `.env.local` 的内容）
5. 部署

### 更新 Supabase 配置

1. 在 Supabase Dashboard > Authentication > URL Configuration
2. 添加生产环境 URL：`https://your-domain.com`
3. 添加到 Redirect URLs

## 🎨 下一步建议

1. **迁移现有数据**：将 `src/utils/constants.ts` 中的专辑数据导入 Supabase
2. **创建管理后台**：用于上传音乐和管理内容
3. **完善用户体验**：添加加载状态、错误提示
4. **优化性能**：添加缓存、图片懒加载
5. **添加分析**：集成 Google Analytics 或 Vercel Analytics

## 📚 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Sanity 文档](https://www.sanity.io/docs)
- [项目配置详情](./SETUP.md)
