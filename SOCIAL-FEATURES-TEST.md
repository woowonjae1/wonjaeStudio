# 社交功能测试指南

## 📍 访问测试页面

访问：`http://localhost:3000/test-social`

或从主页顶部导航点击 **"Test Social"** 链接（蓝色）

---

## ✨ 功能概览

### 1. **评论系统** (CommentSectionEnhanced)
- ✅ 发表评论
- ✅ 回复评论（嵌套评论）
- ✅ 删除自己的评论
- ✅ 实时更新
- ✅ 精美的渐变头像
- ✅ MagicCard 风格设计

### 2. **收藏功能** (FavoriteButtonEnhanced)
- ✅ 收藏/取消收藏
- ✅ 实时同步状态
- ✅ 渐变动画效果
- ✅ 显示收藏数量

---

## 🧪 测试流程

### Step 1: 登录
1. 点击右上角 **"Login"**
2. 使用邮箱登录或注册新账号
3. 登录成功后会显示你的头像

### Step 2: 访问测试页面
- 从导航栏点击 **"Test Social"**
- 或直接访问 `/test-social`

### Step 3: 选择测试项目
页面提供 3 个测试项目：
- **测试专辑 1** - Romantic Vibes (ID: test-album-001)
- **测试专辑 2** - Summer Beats (ID: test-album-002)
- **测试文章** - AI in Music Production (ID: test-post-001)

点击任意项目卡片进行切换

### Step 4: 测试收藏功能
1. 在左侧面板找到 **"Favorite Action"**
2. 点击收藏按钮（❤️）
3. 观察按钮状态变化和动画效果
4. 再次点击取消收藏
5. 切换到其他项目，每个项目的收藏状态独立

### Step 5: 测试评论功能
1. 在右侧评论区输入评论内容
2. 点击 **"Post Comment"** 发表评论
3. 可以对自己或他人的评论进行回复
4. 可以删除自己的评论（垃圾桶图标）
5. 切换项目，每个项目的评论独立

### Step 6: 查看 Dashboard
1. 点击右上角头像或 **"Dashboard"** 按钮
2. 在 Dashboard 的 **"Favorites"** 标签查看所有收藏
3. 每个收藏显示：
   - 类型（album/post）
   - Item ID
   - 收藏时间

---

## 📊 数据存储

所有数据存储在 Supabase：

### Comments 表
```sql
- id (UUID)
- user_id (UUID)
- item_id (VARCHAR)
- item_type (VARCHAR)
- content (TEXT)
- parent_id (UUID, nullable)
- created_at (TIMESTAMP)
```

### Favorites 表
```sql
- id (UUID)
- user_id (UUID)
- item_id (VARCHAR)
- item_type (VARCHAR)
- created_at (TIMESTAMP)
```

---

## 🎨 UI 特性

### 评论区特点
- **渐变 MagicCard** 设计
- **平滑动画**进入/退出
- **嵌套回复**视觉缩进
- **渐变头像**根据用户邮箱生成
- **响应式布局**

### 收藏按钮特点
- **渐变背景**动画
- **心跳动画**点击时
- **数量显示**动态更新
- **Hover 效果**

---

## 🔧 组件位置

### 评论组件
- `src/components/social/CommentSectionEnhanced.tsx`

### 收藏组件
- `src/components/social/FavoriteButtonEnhanced.tsx`

### 测试页面
- `src/app/test-social/page.tsx`

---

## 💡 使用建议

1. **多账号测试**：注册多个账号，测试不同用户之间的交互
2. **切换项目**：测试不同 item_id 的数据隔离
3. **嵌套回复**：测试多层评论回复
4. **并发测试**：打开多个浏览器标签，测试实时同步

---

## ⚠️ 注意事项

1. **需要登录**：评论和收藏功能需要先登录
2. **Supabase 配置**：确保 `.env.local` 配置正确
3. **RLS 策略**：数据库已配置 Row Level Security
4. **删除权限**：只能删除自己的评论

---

## 🚀 在生产环境集成

### 在专辑页面使用：
```tsx
import { CommentSectionEnhanced } from '@/components/social/CommentSectionEnhanced';
import { FavoriteButtonEnhanced } from '@/components/social/FavoriteButtonEnhanced';

// 在专辑详情页
<FavoriteButtonEnhanced itemId={album.id} itemType="album" />
<CommentSectionEnhanced itemId={album.id} itemType="album" />
```

### 在博客页面使用：
```tsx
// 在文章详情页
<FavoriteButtonEnhanced itemId={post.id} itemType="post" />
<CommentSectionEnhanced itemId={post.id} itemType="post" />
```

---

## 📝 待添加功能（可选）

- [ ] 评论点赞
- [ ] 评论编辑
- [ ] @提及用户
- [ ] 评论排序（时间/热度）
- [ ] 评论分页
- [ ] 图片上传
- [ ] Emoji 选择器
- [ ] 评论举报

---

## 🎉 完成！

现在你可以在测试页面完整体验评论和收藏功能了！

有任何问题请查看：
- `SETUP.md` - 项目配置
- `QUICKSTART.md` - Supabase 快速开始
- `test-auth.md` - 认证系统测试

