# Sanity CMS Schema 配置指南

## 1. 安装 Sanity CLI

```bash
npm install -g @sanity/cli
```

## 2. 初始化 Sanity 项目

```bash
sanity init
```

选择：
- Create new project
- 输入项目名称
- 选择 dataset: production
- 选择模板: Clean project

## 3. Schema 定义

在 Sanity Studio 项目中创建以下 schemas：

### schemas/post.ts

```typescript
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          fields: [
            {
              type: 'text',
              name: 'alt',
              title: 'Alternative text',
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
};
```

### schemas/category.ts

```typescript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};
```

### schemas/author.ts

```typescript
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
    },
  ],
};
```

## 4. 部署 Sanity Studio

```bash
cd sanity-studio
sanity deploy
```

## 5. 配置 CORS

在 Sanity 项目设置中添加你的网站域名到 CORS Origins：
- http://localhost:3000
- https://your-domain.com

## 6. 获取 API Token

1. 登录 Sanity.io
2. 进入项目设置
3. API 标签页
4. 创建新 token（Editor 权限）
5. 将 token 添加到 .env.local

## 7. 环境变量配置

在项目根目录的 .env.local 文件中添加：

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## 8. 使用 Webhook 实现 ISR

在 Sanity Studio 中设置 Webhook：
- URL: https://your-domain.com/api/revalidate
- Trigger on: Create, Update, Delete
- Filter: _type == "post"

创建 API 路由 `app/api/revalidate/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证 webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // 重新验证相关路径
    if (body._type === 'post') {
      revalidatePath('/blog');
      revalidatePath(`/blog/${body.slug.current}`);
    }

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
```

