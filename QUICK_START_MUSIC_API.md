# 音乐 API 快速开始指南

## 概述

音乐数据现在由后台管理系统管理，前端通过 API 动态获取。

## 初始化数据库

### 方法 1：使用 SQL 脚本（推荐）

1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 复制 `seed-music.sql` 文件中的内容
4. 执行 SQL 语句

这将添加 8 首初始音乐到数据库。

### 方法 2：通过后台管理系统

1. 访问 `http://localhost:3000/admin/login`
2. 登录（用户名: admin, 密码: admin123）
3. 进入音乐管理页面
4. 点击"添加曲目"按钮逐个添加音乐

## API 端点

### 获取所有音乐

```
GET /api/music
```

**响应示例：**

```json
{
  "tracks": [
    {
      "title": "Crush",
      "description": "Heart breaking emotions in every beat",
      "imageSrc": "/image/HeartBreaking.jpg",
      "audioSrc": "/audio/禹元宰 - Crush.mp3"
    },
    ...
  ]
}
```

### 后台管理 API（需要认证）

#### 获取音乐列表

```
GET /api/admin/music
```

#### 创建音乐

```
POST /api/admin/music
Content-Type: multipart/form-data

- title: 曲目标题
- description: 曲目描述
- image: 封面图片文件
- audio: 音频文件（可选）
```

#### 更新音乐

```
PUT /api/admin/music/{id}
Content-Type: multipart/form-data

- title: 曲目标题
- description: 曲目描述
- image: 封面图片文件（可选）
- audio: 音频文件（可选）
```

#### 删除音乐

```
DELETE /api/admin/music/{id}
```

#### 重新排序

```
PUT /api/admin/music/reorder
Content-Type: application/json

{
  "tracks": [
    { "id": 1, "display_order": 0 },
    { "id": 2, "display_order": 1 },
    ...
  ]
}
```

## 前端集成

### 首页音乐卡片

首页会自动从 `/api/music` 获取音乐数据并显示。

```typescript
// 自动处理，无需手动调用
const { data } = await fetch("/api/music").then((r) => r.json());
```

## 数据库表结构

```sql
CREATE TABLE public.music_tracks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  display_order INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 常见问题

### Q: 如何添加新音乐？

A: 有两种方式：

1. 通过后台管理系统 (`/admin/music`)
2. 通过 API 直接调用 `POST /api/admin/music`

### Q: 音乐文件存储在哪里？

A: 存储在 Supabase Storage 的两个 bucket 中：

- `music-covers` - 音乐封面图片
- `music-audio` - 音频文件

### Q: 如何修改已有的音乐？

A: 在后台管理系统中点击编辑按钮，或通过 API 调用 `PUT /api/admin/music/{id}`

### Q: 如何删除音乐？

A: 在后台管理系统中点击删除按钮，或通过 API 调用 `DELETE /api/admin/music/{id}`

### Q: 如何改变音乐的显示顺序？

A: 在后台管理系统中拖拽音乐卡片，或通过 API 调用 `PUT /api/admin/music/reorder`

## 故障排除

### 前端无法获取音乐

1. 检查 `/api/music` 是否返回正确的数据
2. 检查浏览器控制台是否有错误
3. 确保 Supabase 连接正常

### 后台无法上传文件

1. 检查 Storage bucket 是否存在
2. 检查 Storage 策略是否配置正确
3. 检查文件大小是否超过限制

### 登录失败

1. 确保 JWT_SECRET 环境变量已设置
2. 确保数据库中有 admin 用户
3. 检查密码是否正确

## 环境变量

确保 `.env.local` 中包含以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```
