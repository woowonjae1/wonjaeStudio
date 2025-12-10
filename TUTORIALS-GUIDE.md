# 插件教程系统使用指南

## ✅ 已创建的功能

### 1. 教程列表页 (`/tutorials`)

- 展示所有教程
- 分类筛选（编曲、混音、效果器、母带）
- 搜索功能
- 响应式卡片布局

### 2. 教程详情页 (`/tutorials/[id]`)

- 图文并茂的教程内容
- 支持多种内容类型：
  - 标题
  - 正文
  - 列表
  - 图片（带说明）
- 标签系统
- 分享功能

### 3. 导航集成

- 导航栏添加了 "Tutorials" 链接
- 可以从任何页面访问

## 📝 如何添加新教程

### 步骤 1：在列表页添加教程信息

编辑 `src/app/tutorials/page.tsx`，在 `tutorials` 数组中添加：

```typescript
{
  id: "your-tutorial-id",  // 唯一标识符
  title: "你的教程标题",
  category: "混音",  // 编曲/混音/效果器/母带
  description: "简短描述",
  image: "/tutorials/your-image.jpg",  // 图片路径
  date: "2025-01-20",
  readTime: "10 分钟",
}
```

### 步骤 2：添加教程详细内容

编辑 `src/app/tutorials/[id]/page.tsx`，在 `tutorialData` 对象中添加：

```typescript
"your-tutorial-id": {
  id: "your-tutorial-id",
  title: "你的教程标题",
  category: "混音",
  date: "2025-01-20",
  readTime: "10 分钟",
  content: [
    {
      type: "heading",
      content: "第一部分标题",
    },
    {
      type: "text",
      content: "这里是正文内容...",
    },
    {
      type: "list",
      content: [
        "列表项 1",
        "列表项 2",
        "列表项 3",
      ],
    },
    {
      type: "image",
      content: "/tutorials/screenshot.jpg",
      caption: "图片说明文字",
    },
  ],
}
```

## 🎨 内容类型说明

### 1. 标题 (heading)

```typescript
{
  type: "heading",
  content: "你的标题",
}
```

### 2. 正文 (text)

```typescript
{
  type: "text",
  content: "你的正文内容，可以很长...",
}
```

### 3. 列表 (list)

```typescript
{
  type: "list",
  content: [
    "第一点",
    "第二点",
    "第三点",
  ],
}
```

### 4. 图片 (image)

```typescript
{
  type: "image",
  content: "/path/to/image.jpg",
  caption: "图片说明（可选）",
}
```

## 📸 添加图片

### 方法 1：使用本地图片

1. 将图片放在 `public/tutorials/` 文件夹
2. 在教程中引用：`/tutorials/your-image.jpg`

### 方法 2：使用外部链接

直接使用完整 URL：`https://example.com/image.jpg`

## 💡 教程编写建议

### 结构建议

```
1. 简介
   - 什么是这个插件
   - 为什么要使用它

2. 界面介绍
   - 主要参数说明
   - 配图展示

3. 基础使用
   - 步骤说明
   - 实用技巧

4. 进阶技巧
   - 高级用法
   - 常见问题

5. 总结
   - 要点回顾
   - 推荐设置
```

### 写作技巧

- ✅ 使用简洁的语言
- ✅ 配合截图说明
- ✅ 提供具体参数值
- ✅ 分享实战经验
- ✅ 添加注意事项

## 🎯 示例教程模板

```typescript
"compressor-guide": {
  id: "compressor-guide",
  title: "压缩器完全指南",
  category: "混音",
  date: "2025-01-20",
  readTime: "15 分钟",
  content: [
    {
      type: "heading",
      content: "什么是压缩器？",
    },
    {
      type: "text",
      content: "压缩器是一种动态处理工具，用于控制音频信号的动态范围...",
    },
    {
      type: "image",
      content: "/tutorials/compressor-interface.jpg",
      caption: "典型的压缩器界面",
    },
    {
      type: "heading",
      content: "核心参数详解",
    },
    {
      type: "list",
      content: [
        "Threshold（阈值）：压缩开始工作的音量点",
        "Ratio（比率）：压缩的强度，如 4:1",
        "Attack（启动时间）：压缩器响应的速度",
        "Release（释放时间）：压缩器停止工作的速度",
        "Makeup Gain（补偿增益）：补偿压缩后的音量损失",
      ],
    },
    {
      type: "heading",
      content: "实用技巧",
    },
    {
      type: "text",
      content: "1. **人声压缩**：Ratio 3:1-4:1，Attack 5-10ms，Release 50-100ms",
    },
    {
      type: "text",
      content: "2. **鼓组压缩**：Ratio 4:1-6:1，Attack 1-5ms，Release 100-200ms",
    },
  ],
}
```

## 🚀 扩展功能建议

### 可以添加的功能

1. **评论系统** - 让用户留言讨论
2. **点赞收藏** - 用户互动
3. **相关推荐** - 推荐类似教程
4. **视频嵌入** - 添加视频教程
5. **代码高亮** - 如果涉及编程
6. **下载资源** - 提供示例工程文件

### 内容扩展方向

1. **插件评测** - 对比不同插件
2. **工作流程** - 完整制作流程
3. **案例分析** - 实际项目讲解
4. **问题解答** - FAQ 形式
5. **资源推荐** - 插件、素材推荐

## 📊 SEO 优化建议

### 标题优化

- 包含关键词：插件名称、功能
- 清晰明确：让用户知道能学到什么
- 示例：`Fabfilter Pro-Q3 EQ 完全指南 - 从入门到精通`

### 描述优化

- 简洁有力
- 包含核心内容
- 吸引点击

### 标签使用

- 插件名称
- 功能类别
- 难度等级
- DAW 软件

## 🎨 样式自定义

### 修改颜色主题

编辑 CSS 文件中的颜色变量

### 调整布局

- 卡片大小：修改 `grid-template-columns`
- 间距：调整 `gap` 值
- 字体大小：修改 `font-size`

## 📱 移动端优化

已实现：

- ✅ 响应式布局
- ✅ 触摸友好
- ✅ 字体自适应
- ✅ 图片自适应

## 🔗 访问教程

- 教程列表：`http://localhost:3000/tutorials`
- 示例教程：`http://localhost:3000/tutorials/eq-basics`

开始创建你的第一篇插件教程吧！🎵
