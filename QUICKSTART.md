# 🚀 快速启动指南

## 现在项目可以运行了！

我已经配置了临时环境变量，你的项目现在可以启动了。

### 1️⃣ 立即启动项目

```bash
npm run dev
```

访问：http://localhost:3000

### 2️⃣ 当前状态

✅ **可以正常访问的功能：**
- 首页和所有页面正常显示
- UI 组件正常工作
- 主题切换正常
- 音乐播放器正常

⚠️ **暂时不可用的功能（需要配置 Supabase）：**
- 用户注册/登录
- 评论功能
- 收藏功能
- 数据持久化

### 3️⃣ 两个选择

#### 选择 A：继续使用临时配置（推荐先这样）
- 现在就可以看到完整的 UI
- 可以体验所有前端功能
- 适合先熟悉项目

#### 选择 B：配置真实的 Supabase（需要 5-10 分钟）
如果你想要完整功能（登录、评论、收藏等），按以下步骤：

## 📋 配置 Supabase（可选）

### 步骤 1：创建 Supabase 账号
1. 访问 https://supabase.com
2. 点击 "Start your project"（或 "Sign in" 如果已有账号）
3. 使用 GitHub 登录（推荐）

### 步骤 2：创建新项目
1. 点击 "New project"
2. 选择组织（或创建新组织）
3. 填写项目信息：
   - Project name: `wonjae-studio`（随意命名）
   - Database Password: 输入一个强密码（保存好！）
   - Region: 选择离你最近的（如 Northeast Asia (Seoul)）
4. 点击 "Create new project"
5. 等待 1-2 分钟初始化完成

### 步骤 3：获取 API 密钥
1. 项目创建好后，点击左侧 "Settings" ⚙️
2. 点击 "API"
3. 找到以下信息：
   - **Project URL**（形如：https://xxxxx.supabase.co）
   - **anon public key**（很长的字符串）
   - **service_role key**（点击眼睛图标显示）

### 步骤 4：配置环境变量
打开项目根目录的 `.env.local` 文件，替换为真实值：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key

# OpenAI（暂时可以不配置）
OPENAI_API_KEY=your-openai-api-key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 步骤 5：初始化数据库
1. 在 Supabase Dashboard，点击左侧 "SQL Editor" 📝
2. 点击 "New query"
3. 打开项目中的 `supabase-setup.sql` 文件
4. 复制全部内容，粘贴到 SQL Editor
5. 点击右下角 "Run" 按钮
6. 看到 "Success. No rows returned" 表示成功！

### 步骤 6：创建 Storage Buckets
1. 点击左侧 "Storage" 📦
2. 点击 "New bucket"
3. 创建以下 4 个 buckets（全部设为 Public）：
   - `albums-covers`
   - `audio-files`
   - `blog-images`
   - `user-avatars`

### 步骤 7：重启开发服务器
```bash
# 按 Ctrl+C 停止当前服务器
# 然后重新启动
npm run dev
```

## ✅ 验证配置

### 测试登录功能：
1. 访问：http://localhost:3000/auth/register
2. 注册一个测试账号
3. 如果成功跳转到确认页面，说明配置正确！

### 确认用户：
1. 打开 Supabase Dashboard
2. 点击 "Authentication" 🔐
3. 点击 "Users"
4. 找到你的用户，点击右侧三点 "..."
5. 选择 "Confirm user"
6. 现在可以登录了！

## 🎉 完成！

配置完成后，所有功能都可以使用：
- ✅ 用户注册/登录
- ✅ 个人面板
- ✅ 收藏专辑
- ✅ 发表评论
- ✅ 播放历史

## 💡 提示

### 如果遇到问题：
1. 检查 `.env.local` 文件是否正确保存
2. 确保重启了开发服务器
3. 检查浏览器控制台的错误信息
4. 查看 `DEPLOYMENT.md` 获取更详细的说明

### 暂时不想配置？
- 没关系！项目的 UI 和前端功能都能正常使用
- 只是登录、评论等需要数据库的功能暂时不可用
- 随时可以回来配置

## 📚 更多文档

- `DEPLOYMENT.md` - 完整部署指南
- `test-auth.md` - 认证测试指南
- `SETUP.md` - 详细配置说明

---

**现在就运行 `npm run dev` 开始吧！** 🚀

