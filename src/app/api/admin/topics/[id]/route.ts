import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export async function DELETE(
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

    // Delete topic (replies will be cascade deleted due to foreign key)
    const { error } = await supabase
      .from("community_topics")
      .delete()
      .eq("id", topicId);

    if (error) {
      console.error("Delete topic error:", error);
      return NextResponse.json(
        { error: "Failed to delete topic" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
