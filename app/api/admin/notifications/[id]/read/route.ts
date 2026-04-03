import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// PATCH /api/admin/notifications/[id]/read
// Marks a single notification as read.

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  try {
    await db.adminNotification.update({
      where: { id: params.id },
      data:  { isRead: true },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
