import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// GET /api/admin/notifications
// Returns the 50 most recent notifications with unread count.

export async function GET() {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  try {
    const [notifications, unreadCount] = await Promise.all([
      db.adminNotification.findMany({
        orderBy: { createdAt: "desc" },
        take:    50,
        select: {
          id:        true,
          type:      true,
          title:     true,
          metadata:  true,
          isRead:    true,
          createdAt: true,
        },
      }),
      db.adminNotification.count({ where: { isRead: false } }),
    ]);

    // Parse metadata JSON for each notification
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = notifications.map((n: any) => ({
      ...n,
      metadata: (() => {
        try { return JSON.parse(n.metadata); } catch { return {}; }
      })(),
    }));

    return NextResponse.json({ notifications: parsed, unreadCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
