# MCP 使用指南

## 什么是 MCP？

MCP（Model Context Protocol）是一个协议，允许 Kiro IDE 访问外部组件库和资源。你已经添加了两个 MCP 注册表：

- **@cult-ui**: https://cult-ui.com/r/{name}.json
- **@react-bits**: https://reactbits.dev/r/{name}.json

## 如何使用 MCP

### 1. 在 Kiro 中访问 MCP

在 Kiro IDE 中，你可以通过以下方式使用 MCP：

- 打开命令面板（Ctrl+Shift+P 或 Cmd+Shift+P）
- 搜索 "MCP" 相关命令
- 查看 MCP Server 视图（在 Kiro 功能面板中）

### 2. 使用 @react-bits 组件

@react-bits 提供了许多现成的 React 组件，例如：

#### CurvedLoop 组件（已在社区页面使用）

```tsx
import CurvedLoop from '@react-bits/curved-loop';

// 基础用法
<CurvedLoop marqueeText="Welcome to React Bits ✦" />

// 自定义属性
<CurvedLoop
  marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
  speed={3}
  curveAmount={500}
  direction="right"
  interactive={true}
  className="custom-text-style"
/>

// 非交互式，速度较慢
<CurvedLoop
  marqueeText="Smooth Curved Animation"
  speed={1}
  curveAmount={300}
  interactive={false}
/>
```

### 3. 使用 @cult-ui 组件

@cult-ui 提供了高质量的 UI 组件库。你可以通过 MCP 浏览和使用这些组件。

## CurvedLoop 组件属性

| 属性          | 类型              | 默认值 | 说明               |
| ------------- | ----------------- | ------ | ------------------ |
| `marqueeText` | string            | ''     | 要显示的文本       |
| `speed`       | number            | 2      | 动画速度（1-5）    |
| `curveAmount` | number            | 400    | 曲线弧度（0-1000） |
| `direction`   | 'left' \| 'right' | 'left' | 文本滚动方向       |
| `interactive` | boolean           | true   | 是否可交互（拖拽） |
| `className`   | string            | -      | 自定义 CSS 类名    |

## 在社区页面中的实现

社区页面已集成 CurvedLoop 作为背景装饰：

```tsx
<CurvedLoop
  marqueeText="Welcome to Community ✦ Share ✦ Create ✦ Connect ✦"
  speed={1.5}
  curveAmount={300}
  interactive={false}
  className="community-curved-text"
/>
```

**特点**：

- ✅ 固定在背景（z-index: 0）
- ✅ 不会遮挡社区内容（z-index: 10）
- ✅ 透明度 30%（opacity: 0.3）
- ✅ 非交互式（interactive: false）
- ✅ 响应式设计（移动设备自动缩放）

## 配置 MCP

MCP 配置文件位置：`~/.kiro/settings/mcp.json`

当前配置：

```json
{
  "registries": {
    "@cult-ui": "https://cult-ui.com/r/{name}.json",
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

### 添加更多 MCP

如需添加更多 MCP 注册表，编辑配置文件并添加新的注册表：

```json
{
  "registries": {
    "@cult-ui": "https://cult-ui.com/r/{name}.json",
    "@react-bits": "https://reactbits.dev/r/{name}.json",
    "@your-registry": "https://your-registry.com/r/{name}.json"
  }
}
```

然后在 Kiro 中重新连接 MCP 服务器。

## 常见问题

### Q: MCP 组件和本地组件有什么区别？

A: MCP 组件是从外部注册表动态加载的，而本地组件是项目中的文件。对于 CurvedLoop，我们创建了本地版本以确保完全控制和离线可用性。

### Q: 如何在其他页面使用 CurvedLoop？

A: 导入组件并使用：

```tsx
import CurvedLoop from "@/components/CurvedLoop/CurvedLoop";

<CurvedLoop marqueeText="Your text here" />;
```

### Q: 如何禁用 CurvedLoop 背景？

A: 在社区页面中注释掉 CurvedLoop 组件即可。

## 更多资源

- @react-bits 官网: https://reactbits.dev
- @cult-ui 官网: https://cult-ui.com
- Kiro MCP 文档: 在 Kiro 中搜索 "MCP" 获取更多信息
