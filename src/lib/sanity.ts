import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// 图片 URL 生成器
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Sanity 查询类型
export interface SanityPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  coverImage?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  content: any[]; // Portable Text
  category?: {
    title: string;
    slug: { current: string };
  };
  author?: {
    name: string;
    image?: any;
  };
  publishedAt?: string;
}

// GROQ 查询函数
export async function getPosts(limit = 10): Promise<SanityPost[]> {
  const query = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) [0...${limit}] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    coverImage,
    content,
    category->,
    author->,
    publishedAt
  }`;

  return sanityClient.fetch(query);
}

export async function getPostBySlug(slug: string): Promise<SanityPost> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    coverImage,
    content,
    category->,
    author->,
    publishedAt
  }`;

  return sanityClient.fetch(query, { slug });
}

export async function getPostsByCategory(
  categorySlug: string,
  limit = 10
): Promise<SanityPost[]> {
  const query = `*[_type == "post" && category->slug.current == $categorySlug && defined(publishedAt)] | order(publishedAt desc) [0...${limit}] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    coverImage,
    category->,
    author->,
    publishedAt
  }`;

  return sanityClient.fetch(query, { categorySlug });
}

export async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`;

  return sanityClient.fetch(query);
}

