import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const user = await verifyAdminToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
