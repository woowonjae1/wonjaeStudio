# 音乐专辑功能快速测试指南

## 🎵 新功能概览

你的音乐专辑现在拥有简约优雅的点赞和收藏功能！

### 功能特点
- ❤️ **点赞**: 红色爱心图标
- ⭐ **收藏**: 黄色星星图标
- 🎨 **简约设计**: 仅在悬停时显示
- ✨ **流畅动画**: 平滑的过渡效果

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问音乐页面

在浏览器中打开:
```
http://localhost:3000/music
```

### 3. 测试交互

1. **悬停在专辑封面上**
   - 你会在右上角看到两个按钮淡入
   - 左边是❤️点赞按钮
   - 右边是⭐收藏按钮

2. **点击点赞按钮**
   - 按钮变为红色背景
   - 爱心填充为白色
   - 按钮轻微放大

3. **点击收藏按钮**
   - 按钮变为黄色背景
   - 星星填充为白色
   - 按钮轻微放大

4. **移开鼠标**
   - 按钮优雅地淡出
   - 状态保持不变

5. **再次点击取消**
   - 再次点击已激活的按钮可取消
   - 按钮恢复为默认样式

## 🎨 视觉效果

### 默认状态（悬停时）
```
┌─────────────────┐
│   专辑封面      │
│                 │   ❤️ ⭐
│     [旋转]      │
│                 │
└─────────────────┘
```

### 点赞后
```
┌─────────────────┐
│   专辑封面      │
│                 │   ❤️ ⭐
│     [旋转]      │  (红色)
│                 │
└─────────────────┘
```

### 收藏后
```
┌─────────────────┐
│   专辑封面      │
│                 │   ❤️ ⭐
│     [旋转]      │    (黄色)
│                 │
└─────────────────┘
```

## 🎯 专辑列表

当前有4张专辑可供测试：

1. **午夜电台** (2023 · 电子)
   - 4首曲目
   - 专辑ID: 1

2. **记忆碎片** (2022 · 流行)
   - 4首曲目
   - 专辑ID: 2

3. **城市之声** (2021 · 嘻哈)
   - 4首曲目
   - 专辑ID: 3

4. **冬日故事** (2020 · 民谣)
   - 4首曲目
   - 专辑ID: 4

## 🔧 自定义选项

### 修改按钮颜色

在 `ThreeJSAlbumRenderer.tsx` 中修改：

```tsx
// 点赞按钮颜色
className={`... ${
  isLiked 
    ? 'bg-red-500/80'      // 改为你喜欢的颜色
    : 'bg-white/60'
}`}

// 收藏按钮颜色
className={`... ${
  isFavorited 
    ? 'bg-yellow-500/80'   // 改为你喜欢的颜色
    : 'bg-white/60'
}`}
```

### 修改按钮位置

```tsx
// 当前位置: 右上角
<div className="absolute top-2 right-2 ...">

// 改为左上角
<div className="absolute top-2 left-2 ...">

// 改为底部中央
<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 ...">
```

### 始终显示按钮（不需要悬停）

```tsx
// 移除 opacity-0 和 group-hover:opacity-100
<div className="absolute top-2 right-2 flex gap-2 transition-opacity duration-300">
```

### 修改动画速度

```tsx
// 淡入淡出速度
className="... transition-opacity duration-300"  // 改为 duration-500 更慢

// 缩放速度
className="... transition-all duration-300"      // 改为 duration-200 更快
```

## 📱 响应式测试

测试不同设备：

1. **桌面** (1920x1080)
   - 4列网格布局
   - 完整悬停效果

2. **平板** (768px)
   - 2列网格布局
   - 触摸激活按钮

3. **手机** (375px)
   - 1列网格布局
   - 轻触显示按钮

## 🐛 已知限制

⚠️ **当前版本**:
- 状态仅保存在客户端（刷新后重置）
- 未连接后端API
- 无点赞/收藏数量统计

## 🔜 后续开发建议

1. **后端集成**
   ```typescript
   // 在 handleLike 中添加
   await fetch('/api/albums/like', {
     method: 'POST',
     body: JSON.stringify({ albumId: _albumId, liked: !isLiked })
   });
   ```

2. **数量显示**
   ```tsx
   <span className="text-xs">{likeCount}</span>
   ```

3. **加载状态**
   ```tsx
   const [isLoading, setIsLoading] = useState(false);
   ```

4. **错误处理**
   ```tsx
   try {
     // API call
   } catch (error) {
     // 显示错误提示
     toast.error('操作失败，请重试');
   }
   ```

## 📊 性能优化建议

1. **防抖处理**: 避免快速点击
2. **懒加载**: 延迟加载专辑图片
3. **虚拟化**: 大量专辑时使用虚拟滚动

## 🎓 学习资源

- [React Three Fiber 文档](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Next.js 文档](https://nextjs.org/docs)

---

**祝你测试愉快！** 🎉

如有问题，请查看控制台日志或联系开发团队。
