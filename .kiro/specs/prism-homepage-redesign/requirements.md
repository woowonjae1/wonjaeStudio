# Requirements Document

## Introduction

本功能旨在完全重构网站首页 UI，将其简化为一个以 Prism WebGL 动画为核心的极简设计。移除所有冗余的页面跳转、复杂组件和不必要的代码，创建一个纯粹、沉浸式的视觉体验。

## Glossary

- **Prism**: 基于 OGL 库的 WebGL 3D 棱镜动画组件，使用 GLSL 着色器渲染
- **Homepage**: 网站首页 (src/app/page.tsx)
- **OGL**: 一个轻量级的 WebGL 库，用于创建 3D 图形
- **WebGL**: 浏览器中的 3D 图形渲染 API

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to see a full-screen immersive Prism animation when I visit the homepage, so that I can experience a visually stunning and unique landing page.

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the System SHALL display a full-screen Prism WebGL animation covering 100% viewport height and width
2. WHEN the Prism animation loads THEN the System SHALL use the following parameters: animationType="rotate", timeScale=0.5, height=3.5, baseWidth=5.5, scale=3.6, hueShift=0, colorFrequency=1, noise=0.5, glow=1
3. WHEN the page renders THEN the System SHALL display the Prism animation as the primary visual element without any overlapping content sections

### Requirement 2

**User Story:** As a developer, I want to create a reusable Prism component using OGL, so that the WebGL animation can be easily integrated and maintained.

#### Acceptance Criteria

1. WHEN the Prism component mounts THEN the System SHALL initialize an OGL Renderer with device pixel ratio capped at 2
2. WHEN the container resizes THEN the System SHALL update the renderer size and shader uniforms accordingly using ResizeObserver
3. WHEN the component unmounts THEN the System SHALL clean up all WebGL resources, event listeners, and animation frames
4. WHEN animationType is "rotate" THEN the System SHALL apply a continuous wobble transformation to the prism shape

### Requirement 3

**User Story:** As a developer, I want to remove all unnecessary pages and components, so that the codebase is clean and focused on the core experience.

#### Acceptance Criteria

1. WHEN the homepage is refactored THEN the System SHALL remove all navigation links to other pages (about, music, articles, etc.)
2. WHEN the layout is simplified THEN the System SHALL remove the MainLayout wrapper, NavBar, and Footer components from the homepage
3. WHEN cleaning up THEN the System SHALL keep only essential files required for the Prism homepage to function

### Requirement 4

**User Story:** As a visitor, I want the page to have a dark background that complements the Prism animation, so that the visual effect is maximized.

#### Acceptance Criteria

1. WHEN the homepage renders THEN the System SHALL set the background color to pure black (#000000)
2. WHEN the Prism animation displays THEN the System SHALL ensure the canvas has transparent alpha blending enabled
3. WHEN styling the page THEN the System SHALL remove all padding, margins, and scrollbars from the body and html elements
