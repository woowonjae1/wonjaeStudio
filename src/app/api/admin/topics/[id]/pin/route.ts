import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const topicId = parseInt(id);

    if (isNaN(topicId)) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    // Get current pinned status
    const { data: topic, error: fetchError } = await supabase
      .from("community_topics")
      .select("pinned")
      .eq("id", topicId)
      .single();

    if (fetchError || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Toggle pinned status
    const newPinned = !topic.pinned;
    const { error: updateError } = await supabase
      .from("community_topics")
      .update({ pinned: newPinned })
      .eq("id", topicId);

    if (updateError) {
      console.error("Pin topic error:", updateError);
      return NextResponse.json(
        { error: "Failed to update topic" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, pinned: newPinned });
  } catch (error) {
    console.error("Pin topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
