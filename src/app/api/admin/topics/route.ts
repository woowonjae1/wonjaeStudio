import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const user = await verifyAdminToken(request);
  if (!user) {
    return unauthorizedResponse();
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("community_topics")
      .select("*, replies_count:community_replies(count)", { count: "exact" });

    // Apply category filter
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    // Apply search filter
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Topics query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch topics" },
        { status: 500 }
      );
    }

    const topics = (data || []).map((topic: any) => ({
      ...topic,
      replies_count: topic.replies_count?.[0]?.count || 0,
    }));

    return NextResponse.json({
      topics,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
