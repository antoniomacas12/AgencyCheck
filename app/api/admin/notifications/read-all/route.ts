import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// POST /api/admin/notifications/read-all
// Marks all unread notifications as read.

export async function POST() {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  try {
    const { count } = await db.adminNotification.updateMany({
      where: { isRead: false },
      data:  { isRead: true },
    });
    return NextResponse.json({ marked: count });
  } catch {
    return NextResponse.json({ error: "Failed to mark read" }, { status: 500 });
  }
}
