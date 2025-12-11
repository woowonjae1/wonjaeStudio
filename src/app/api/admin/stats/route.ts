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
    // Get total topics count
    const { count: totalTopics } = await supabase
      .from("community_topics")
      .select("*", { count: "exact", head: true });

    // Get total replies count
    const { count: totalReplies } = await supabase
      .from("community_replies")
      .select("*", { count: "exact", head: true });

    // Get total views
    const { data: viewsData } = await supabase
      .from("community_topics")
      .select("views");
    const totalViews =
      viewsData?.reduce((sum, topic) => sum + (topic.views || 0), 0) || 0;

    // Get topics created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: topicsLast7Days } = await supabase
      .from("community_topics")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    // Get total music tracks
    const { count: totalTracks } = await supabase
      .from("music_tracks")
      .select("*", { count: "exact", head: true });

    // Get recent topics
    const { data: recentTopics } = await supabase
      .from("community_topics")
      .select("id, title, author_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      totalTopics: totalTopics || 0,
      totalReplies: totalReplies || 0,
      totalViews,
      topicsLast7Days: topicsLast7Days || 0,
      totalTracks: totalTracks || 0,
      recentTopics: recentTopics || [],
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
