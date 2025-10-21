import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
  getOffset,
  formatPaginatedResponse,
  ApiError,
} from "@/lib/api-utils";
import { Logger } from "@/lib/logger";

/**
 * GET /api/search
 * 搜索内容（专辑、博文、用户等）
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    const type = request.nextUrl.searchParams.get("type") || "all";

    if (!query || query.length < 1) {
      throw new ApiError("MISSING_QUERY", "Search query is required", 400);
    }

    if (query.length > 100) {
      throw new ApiError("QUERY_TOO_LONG", "Search query too long", 400);
    }

    Logger.info("Searching", { query, type });

    const { page = 1, limit = 10 } = getPaginationParams(request);
    const offset = getOffset(page, limit);

    const results: any = {
      albums: [],
      posts: [],
      users: [],
    };

    // 搜索专辑
    if (type === "all" || type === "album") {
      const { data: albums, count: albumCount } = await supabase
        .from("albums")
        .select("id, title, artist, cover_url, description", { count: "exact" })
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
        .range(offset, offset + limit - 1);

      if (albums) {
        results.albums = albums;
        results.albumTotal = albumCount;
      }
    }

    // 搜索博文
    if (type === "all" || type === "post") {
      const { data: posts, count: postCount } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, category", { count: "exact" })
        .eq("is_published", true)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .range(offset, offset + limit - 1);

      if (posts) {
        results.posts = posts;
        results.postTotal = postCount;
      }
    }

    // 搜索用户
    if (type === "all" || type === "user") {
      const { data: users, count: userCount } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url", { count: "exact" })
        .ilike("display_name", `%${query}%`)
        .range(offset, offset + limit - 1);

      if (users) {
        results.users = users;
        results.userTotal = userCount;
      }
    }

    Logger.info("Search completed", {
      query,
      resultsCount: Object.values(results).length,
    });

    return successResponse({
      query,
      results,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    Logger.error("GET /api/search error", error as Error);
    return errorResponse(error);
  }
}
