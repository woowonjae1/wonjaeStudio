import { z } from "zod";

/**
 * 用户相关 Schemas
 */
export const UserProfileSchema = z.object({
  email: z.string().email("Invalid email address"),
  display_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name too long"),
  avatar_url: z.string().url("Invalid URL").optional().nullable(),
});

export const UpdateUserProfileSchema = UserProfileSchema.partial();

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * 评论相关 Schemas
 */
export const CommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment too long"),
  item_type: z.enum(["album", "post", "track"], {
    errorMap: () => ({ message: "Invalid item type" }),
  }),
  item_id: z.string().uuid("Invalid item ID"),
  parent_id: z.string().uuid("Invalid parent ID").optional().nullable(),
});

export const UpdateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment too long"),
});

export type Comment = z.infer<typeof CommentSchema>;

/**
 * 社交相关 Schemas
 */
export const FollowSchema = z.object({
  following_id: z.string().uuid("Invalid user ID"),
});

export const LikeSchema = z.object({
  item_type: z.enum(["album", "post", "track", "comment"], {
    errorMap: () => ({ message: "Invalid item type" }),
  }),
  item_id: z.string().uuid("Invalid item ID"),
});

export type Follow = z.infer<typeof FollowSchema>;
export type Like = z.infer<typeof LikeSchema>;

/**
 * 搜索 Schemas
 */
export const SearchSchema = z.object({
  query: z.string().min(1, "Search query required").max(100, "Query too long"),
  type: z.enum(["all", "album", "post", "track", "user"]).default("all"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type SearchParams = z.infer<typeof SearchSchema>;

/**
 * 分页 Schemas
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * 音乐相关 Schemas
 */
export const AlbumFilterSchema = z.object({
  genre: z.string().optional(),
  artist: z.string().optional(),
  year: z.number().int().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type AlbumFilter = z.infer<typeof AlbumFilterSchema>;

/**
 * 博客相关 Schemas
 */
export const PostFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PostFilter = z.infer<typeof PostFilterSchema>;

/**
 * 验证辅助函数
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data: T; error: null } | { data: null; error: string } {
  try {
    const result = schema.parse(data);
    return { data: result, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return { data: null, error: message };
    }
    return { data: null, error: "Validation failed" };
  }
}
