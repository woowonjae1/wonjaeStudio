# MCP 快速开始

## 你已经添加的 MCP

✅ **@cult-ui** - 高质量 UI 组件库  
✅ **@react-bits** - React 动画和交互组件库

## 如何使用 MCP

### 方法 1: 在 Kiro 中浏览

1. 打开 Kiro IDE
2. 按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（Mac）
3. 搜索 "MCP"
4. 选择 "Open MCP Server View" 或相关选项
5. 浏览可用的组件

### 方法 2: 在代码中使用

```tsx
// 导入 @react-bits 组件
import CurvedLoop from "@react-bits/curved-loop";

// 使用组件
<CurvedLoop marqueeText="Your text here" speed={2} interactive={true} />;
```

## 社区页面中的实现

CurvedLoop 已作为背景装饰添加到社区页面：

```tsx
<CurvedLoop
  marqueeText="Welcome to Community ✦ Share ✦ Create ✦ Connect ✦"
  speed={1.5}
  curveAmount={300}
  interactive={false}
  className="community-curved-text"
/>
```

**效果**：

- 🎨 优雅的曲线文本动画
- 🎯 不遮挡社区功能
- 📱 响应式设计
- ✨ 30% 透明度背景

## 配置文件位置

`~/.kiro/settings/mcp.json`

```json
{
  "registries": {
    "@cult-ui": "https://cult-ui.com/r/{name}.json",
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

## 下一步

1. 在 Kiro 中打开 MCP Server 视图
2. 浏览 @react-bits 和 @cult-ui 的可用组件
3. 在项目中使用这些组件
4. 如需添加更多 MCP，编辑配置文件并重新连接

## 常用 @react-bits 组件

- **CurvedLoop** - 曲线滚动文本（已使用）
- **Marquee** - 跑马灯效果
- **Parallax** - 视差滚动
- **Reveal** - 文本显示动画
- 更多组件可在官网查看

## 需要帮助？

- 查看完整指南: `MCP-USAGE-GUIDE.md`
- 访问 @react-bits: https://reactbits.dev
- 访问 @cult-ui: https://cult-ui.com
