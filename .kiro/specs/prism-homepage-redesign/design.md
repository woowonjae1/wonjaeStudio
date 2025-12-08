# Design Document: Prism Homepage Redesign

## Overview

本设计将网站首页重构为一个以 Prism WebGL 动画为核心的极简页面。使用 OGL 库创建 3D 棱镜效果，通过 GLSL 着色器实现光线追踪和颜色渲染。

## Architecture

```
src/
├── app/
│   ├── page.tsx          # 简化的首页，仅包含 Prism 组件
│   ├── layout.tsx        # 简化的布局
│   └── globals.css       # 全局样式（极简）
└── components/
    └── Prism/
        ├── index.tsx     # Prism WebGL 组件
        └── Prism.css     # Prism 样式
```

## Components and Interfaces

### Prism Component

```typescript
interface PrismProps {
  height?: number; // 棱镜高度 (default: 3.5)
  baseWidth?: number; // 棱镜底部宽度 (default: 5.5)
  animationType?: "rotate" | "hover" | "3drotate"; // 动画类型 (default: 'rotate')
  glow?: number; // 发光强度 (default: 1)
  offset?: { x: number; y: number }; // 偏移量
  noise?: number; // 噪点强度 (default: 0.5)
  transparent?: boolean; // 透明背景 (default: true)
  scale?: number; // 缩放比例 (default: 3.6)
  hueShift?: number; // 色相偏移 (default: 0)
  colorFrequency?: number; // 颜色频率 (default: 1)
  hoverStrength?: number; // 悬停响应强度 (default: 2)
  inertia?: number; // 惯性 (default: 0.05)
  bloom?: number; // 泛光效果 (default: 1)
  suspendWhenOffscreen?: boolean; // 离屏暂停 (default: false)
  timeScale?: number; // 时间缩放 (default: 0.5)
}
```

### Homepage Structure

```typescript
// src/app/page.tsx
export default function HomePage() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0.5}
        glow={1}
      />
    </div>
  );
}
```

## Data Models

### Shader Uniforms

```typescript
interface ShaderUniforms {
  iResolution: Float32Array; // 画布分辨率 [width, height]
  iTime: number; // 动画时间
  uHeight: number; // 棱镜高度
  uBaseHalf: number; // 底部半宽
  uUseBaseWobble: number; // 是否使用摆动效果 (0 或 1)
  uRot: Float32Array; // 3x3 旋转矩阵
  uGlow: number; // 发光强度
  uOffsetPx: Float32Array; // 像素偏移 [x, y]
  uNoise: number; // 噪点强度
  uSaturation: number; // 饱和度
  uScale: number; // 缩放
  uHueShift: number; // 色相偏移
  uColorFreq: number; // 颜色频率
  uBloom: number; // 泛光
  uCenterShift: number; // 中心偏移
  uInvBaseHalf: number; // 底部半宽倒数
  uInvHeight: number; // 高度倒数
  uMinAxis: number; // 最小轴
  uPxScale: number; // 像素缩放
  uTimeScale: number; // 时间缩放
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Based on the prework analysis, only one acceptance criterion qualifies as a property-based test:

### Property 1: Resize Consistency

_For any_ container size change, the renderer size and shader uniforms SHALL be updated to match the new container dimensions.

**Validates: Requirements 2.2**

This property ensures that:

- `renderer.setSize(w, h)` is called with the new dimensions
- `iResolution` uniform is updated to `[gl.drawingBufferWidth, gl.drawingBufferHeight]`
- `uPxScale` uniform is recalculated based on the new height

## Error Handling

| Error Scenario               | Handling Strategy                   |
| ---------------------------- | ----------------------------------- |
| WebGL not supported          | 显示静态黑色背景，不阻塞页面        |
| Container ref is null        | 提前返回，不初始化渲染器            |
| ResizeObserver not supported | 使用 window resize 事件作为降级方案 |
| Animation frame cleanup      | 在 unmount 时取消所有 RAF           |

## Testing Strategy

### Unit Tests

由于这是一个视觉组件，单元测试将聚焦于：

- 组件是否正确渲染容器 div
- Props 是否正确传递
- 清理函数是否被调用

### Property-Based Tests

使用 `fast-check` 库进行属性测试：

1. **Resize Property Test**: 生成随机的容器尺寸，验证 resize 回调正确更新所有相关值

```typescript
// 测试框架: Jest + fast-check
// 标注格式: **Feature: prism-homepage-redesign, Property 1: Resize Consistency**
```

### Integration Tests

- 验证首页只包含 Prism 组件
- 验证没有导航链接
- 验证背景为纯黑色
