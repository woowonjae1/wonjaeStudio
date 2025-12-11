# Design Document

## Overview

后台管理系统是一个基于 Next.js App Router 的管理界面，部署在 Vercel 上，使用 Supabase 作为数据库和文件存储。系统提供社区内容管理（话题、回复）、音乐内容管理（曲目、封面、音频）和数据统计功能。

UI 设计采用 shadcn/ui 组件库，参照 shadcn-dashboard 的简洁风格，包含侧边栏导航、数据卡片、数据表格等核心组件。

## Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js App Router)"
        AdminLayout[Admin Layout]
        DashboardPage[Dashboard Page]
        MusicPage[Music Management]
        TopicsPage[Topics Management]
        RepliesPage[Replies Management]
        LoginPage[Login Page]
    end

    subgraph "API Routes"
        AuthAPI[/api/admin/auth]
        MusicAPI[/api/admin/music]
        TopicsAPI[/api/admin/topics]
        RepliesAPI[/api/admin/replies]
        StatsAPI[/api/admin/stats]
    end

    subgraph "Supabase"
        SupabaseDB[(Database)]
        SupabaseStorage[(Storage)]
    end

    AdminLayout --> DashboardPage
    AdminLayout --> MusicPage
    AdminLayout --> TopicsPage
    AdminLayout --> RepliesPage

    DashboardPage --> StatsAPI
    MusicPage --> MusicAPI
    TopicsPage --> TopicsAPI
    RepliesPage --> RepliesAPI
    LoginPage --> AuthAPI

    MusicAPI --> SupabaseDB
    MusicAPI --> SupabaseStorage
    TopicsAPI --> SupabaseDB
    RepliesAPI --> SupabaseDB
    StatsAPI --> SupabaseDB
```

## Components and Interfaces

### Page Structure

```
src/app/admin/
├── layout.tsx          # Admin layout with sidebar
├── page.tsx            # Dashboard home (stats)
├── login/
│   └── page.tsx        # Login page
├── music/
│   └── page.tsx        # Music management
├── topics/
│   └── page.tsx        # Topics management
└── replies/
    └── page.tsx        # Replies management
```

### Core Components

| Component    | Description                                             | Location                                |
| ------------ | ------------------------------------------------------- | --------------------------------------- |
| AdminSidebar | 侧边栏导航，包含 Dashboard、Music、Topics、Replies 链接 | `src/components/admin/AdminSidebar.tsx` |
| AdminHeader  | 顶部栏，显示当前页面标题和用户信息                      | `src/components/admin/AdminHeader.tsx`  |
| StatsCards   | 统计卡片组，显示关键指标                                | `src/components/admin/StatsCards.tsx`   |
| DataTable    | 通用数据表格，支持分页、排序、筛选                      | `src/components/admin/DataTable.tsx`    |
| MusicForm    | 音乐曲目表单，支持文件上传                              | `src/components/admin/MusicForm.tsx`    |
| FileUpload   | 文件上传组件，支持图片和音频                            | `src/components/admin/FileUpload.tsx`   |

### API Interfaces

#### Authentication API

```typescript
// POST /api/admin/auth/login
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

// POST /api/admin/auth/logout
interface LogoutResponse {
  success: boolean;
}
```

#### Music API

```typescript
// GET /api/admin/music
interface MusicTrack {
  id: number;
  title: string;
  description: string;
  image_url: string;
  audio_url: string | null;
  display_order: number;
  play_count: number;
  created_at: string;
  updated_at: string;
}

// POST /api/admin/music
interface CreateMusicRequest {
  title: string;
  description: string;
  image_file: File;
  audio_file?: File;
  display_order?: number;
}

// PUT /api/admin/music/[id]
interface UpdateMusicRequest {
  title?: string;
  description?: string;
  image_file?: File;
  audio_file?: File;
  display_order?: number;
}

// DELETE /api/admin/music/[id]
// No request body

// PUT /api/admin/music/reorder
interface ReorderRequest {
  tracks: { id: number; display_order: number }[];
}
```

#### Topics API

```typescript
// GET /api/admin/topics?page=1&limit=20&category=all&search=
interface TopicsResponse {
  topics: Topic[];
  total: number;
  page: number;
  totalPages: number;
}

// DELETE /api/admin/topics/[id]
// No request body

// PUT /api/admin/topics/[id]/pin
interface PinResponse {
  success: boolean;
  pinned: boolean;
}
```

#### Replies API

```typescript
// GET /api/admin/replies?page=1&limit=20
interface RepliesResponse {
  replies: ReplyWithTopic[];
  total: number;
  page: number;
  totalPages: number;
}

interface ReplyWithTopic {
  id: number;
  content: string;
  author_name: string;
  created_at: string;
  topic_id: number;
  topic_title: string;
}

// DELETE /api/admin/replies/[id]
// No request body
```

#### Stats API

```typescript
// GET /api/admin/stats
interface StatsResponse {
  totalTopics: number;
  totalReplies: number;
  totalViews: number;
  topicsLast7Days: number;
  totalTracks: number;
  recentTopics: {
    id: number;
    title: string;
    author_name: string;
    created_at: string;
  }[];
}
```

## Data Models

### Database Schema

```sql
-- 音乐曲目表（新增）
CREATE TABLE IF NOT EXISTS public.music_tracks (
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

-- 管理员表（新增）
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_music_tracks_order ON public.music_tracks(display_order);
```

### Supabase Storage Buckets

| Bucket         | Purpose      | Public |
| -------------- | ------------ | ------ |
| `music-covers` | 音乐封面图片 | Yes    |
| `music-audio`  | 音频文件     | Yes    |

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Based on the prework analysis, the following correctness properties have been identified:

### Property 1: Stats aggregation correctness

_For any_ database state with topics and replies, the stats API response SHALL return counts that exactly match the database aggregations: totalTopics equals COUNT of community_topics, totalReplies equals COUNT of community_replies, totalViews equals SUM of views from community_topics, and topicsLast7Days equals COUNT of topics with created_at within the last 7 days.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 2: Recent topics ordering and completeness

_For any_ set of topics in the database, the recentTopics array returned by stats API SHALL be ordered by created_at descending and each topic SHALL contain id, title, author_name, and created_at fields.

**Validates: Requirements 2.5**

### Property 3: Pagination correctness

_For any_ paginated list request with page P and limit L, the response SHALL return at most L items, and the items SHALL be the correct subset starting at offset (P-1)\*L from the full sorted list.

**Validates: Requirements 3.1, 4.1**

### Property 4: Topic delete cascades to replies

_For any_ topic with associated replies, when the topic is deleted, all replies with that topic_id SHALL also be removed from the database.

**Validates: Requirements 3.3**

### Property 5: Pin toggle idempotence

_For any_ topic, calling the pin toggle endpoint twice SHALL return the topic to its original pinned state.

**Validates: Requirements 3.4**

### Property 6: Filter and search correctness

_For any_ category filter value C, all returned topics SHALL have category equal to C. _For any_ search term S, all returned topics SHALL have title containing S (case-insensitive).

**Validates: Requirements 3.5, 3.6**

### Property 7: Reply delete removes only target

_For any_ reply deletion, only the specified reply SHALL be removed, and the parent topic and other replies SHALL remain unchanged.

**Validates: Requirements 4.3**

### Property 8: Music track create and delete consistency

_For any_ music track creation with valid data, the track SHALL be retrievable from the database with matching title, description, and valid storage URLs. _For any_ track deletion, the track record SHALL be removed and associated storage files SHALL no longer exist.

**Validates: Requirements 5.3, 5.5**

### Property 9: Track reorder preserves all tracks

_For any_ reorder operation, the total number of tracks SHALL remain unchanged, and each track's display_order SHALL match the requested order.

**Validates: Requirements 5.6**

### Property 10: Table sorting correctness

_For any_ sort request on column C with direction D, the returned data SHALL be ordered by column C in direction D (ascending or descending).

**Validates: Requirements 6.4**

### Property 11: Invalid credentials rejection

_For any_ login attempt with credentials not matching any admin_users record, the response SHALL indicate failure and no session token SHALL be issued.

**Validates: Requirements 1.3**

## Error Handling

| Error Scenario      | HTTP Status | Response                                         |
| ------------------- | ----------- | ------------------------------------------------ |
| Unauthorized access | 401         | `{ error: "Unauthorized" }`                      |
| Invalid credentials | 401         | `{ error: "Invalid credentials" }`               |
| Resource not found  | 404         | `{ error: "Not found" }`                         |
| Validation error    | 400         | `{ error: "Validation failed", details: [...] }` |
| File upload error   | 400         | `{ error: "File upload failed" }`                |
| Server error        | 500         | `{ error: "Internal server error" }`             |

### Authentication Middleware

所有 `/api/admin/*` 路由（除 `/api/admin/auth/login`）都需要验证 JWT token。Token 存储在 HTTP-only cookie 中，有效期 24 小时。

## Testing Strategy

### Property-Based Testing

使用 **fast-check** 库进行属性测试。每个属性测试运行至少 100 次迭代。

测试文件位置：`src/__tests__/admin/`

每个属性测试必须使用以下格式标注：

```typescript
// **Feature: admin-dashboard, Property {number}: {property_text}**
```

### Unit Testing

使用 **Jest** 进行单元测试，覆盖：

- API 路由处理逻辑
- 数据验证函数
- 文件上传处理

### Integration Testing

- 测试完整的 CRUD 流程
- 测试认证流程
- 测试文件上传到 Supabase Storage
