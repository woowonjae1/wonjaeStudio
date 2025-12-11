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
    const replyId = parseInt(id);

    if (isNaN(replyId)) {
      return NextResponse.json({ error: "Invalid reply ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("community_replies")
      .delete()
      .eq("id", replyId);

    if (error) {
      console.error("Delete reply error:", error);
      return NextResponse.json(
        { error: "Failed to delete reply" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
