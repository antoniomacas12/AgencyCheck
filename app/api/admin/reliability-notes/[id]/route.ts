import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { deleteReliabilityNote } from "@/lib/reliability-db";

export const dynamic = "force-dynamic";

// ─── DELETE /api/admin/reliability-notes/[id] ─────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await deleteReliabilityNote(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reliability-notes] DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
