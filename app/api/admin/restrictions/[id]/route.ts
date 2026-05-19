import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { setRestrictionActive, deleteRestriction, getBlockedAttempts } from "@/lib/restriction-db";

export const dynamic = "force-dynamic";

// ─── PATCH /api/admin/restrictions/[id] — toggle active ──────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const { id } = await params;
    const body = await req.json();
    const { active } = body as { active: boolean };

    if (!id || typeof active !== "boolean") {
      return NextResponse.json({ error: "id and active are required" }, { status: 400 });
    }

    await setRestrictionActive(id, active);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/restrictions] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/restrictions/[id] — remove restriction + attempts ──────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await deleteRestriction(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/restrictions] DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/admin/restrictions/[id] — blocked attempts for one restriction ──

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const { id } = await params;
    const attempts = await getBlockedAttempts(id);
    return NextResponse.json({ attempts });
  } catch (err) {
    console.error("[admin/restrictions] GET[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
