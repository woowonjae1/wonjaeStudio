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
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Get replies with topic title
    const { data, error, count } = await supabase
      .from("community_replies")
      .select(
        `
        *,
        topic:community_topics(id, title)
      `,
        { count: "exact" }
      )
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Replies query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch replies" },
        { status: 500 }
      );
    }

    const replies = (data || []).map((reply: any) => ({
      id: reply.id,
      content: reply.content,
      author_name: reply.author_name,
      created_at: reply.created_at,
      topic_id: reply.topic?.id || reply.topic_id,
      topic_title: reply.topic?.title || "未知话题",
    }));

    return NextResponse.json({
      replies,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Replies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
