# 社区 UI 重设计 (Discourse 风格)

## 设计概述

按照 Discourse 论坛风格重新设计了社区 UI，主要特点：

### 1. 固定顶部栏 (CommunityHeader)

- Logo/品牌名称
- 搜索框（居中）
- "新话题" 按钮（蓝色强调色）
- 通知图标
- 用户头像/下拉菜单

### 2. 三栏布局

- **左侧边栏**: 分类导航、快捷入口
- **主内容区**: 话题列表/详情
- **右侧边栏**: 社区统计、关于、热门标签

### 3. 话题列表 (Discourse 表格风格)

- 清晰的表头：话题、回复、浏览、活动
- 每行显示：用户头像、标题、分类标签、标签、作者
- 置顶帖子有蓝色左边框标识
- 悬停时标题变蓝色

### 4. 视觉风格

- **配色**: 深色背景 (#0f0f0f)，蓝色强调色 (#3b82f6)
- **分类颜色**:
  - 编曲: 橙色
  - 混音: 绿色
  - 插件: 紫色
  - 作品: 粉色
  - 问答: 蓝色
- **字体**: 系统字体，高可读性
- **间距**: 充足留白，清晰分隔

## 文件结构

```
src/components/CommunityLayout/
├── index.tsx              # 主布局组件
├── CommunityHeader.tsx    # 固定顶部栏
├── CommunityHeader.css    # 顶部栏样式
├── CommunityLeftSidebar.tsx   # 左侧边栏
├── CommunityRightSidebar.tsx  # 右侧边栏
├── CommunityTopTabs.tsx   # 排序标签
└── CommunityLayout.css    # 布局样式

src/app/community/
├── page.tsx               # 话题列表页
├── community.css          # 列表页样式
├── new/
│   ├── page.tsx           # 新话题页
│   └── new-post.css       # 新话题样式
└── post/[id]/
    ├── page.tsx           # 话题详情页
    └── post.css           # 详情页样式
```

## 响应式设计

- **桌面端 (>1024px)**: 三栏布局
- **平板端 (768-1024px)**: 隐藏右侧边栏
- **移动端 (<768px)**: 单栏布局，分类变为横向滚动标签
