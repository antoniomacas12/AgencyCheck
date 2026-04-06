import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// GET /api/admin/recent-comments
// Returns the 20 most recent review comments with agency slug for deep-linking.

export async function GET() {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  try {
    const comments = await db.reviewComment.findMany({
      orderBy: { createdAt: "desc" },
      take:    20,
      select: {
        id:         true,
        agencyName: true,
        city:       true,
        body:       true,
        createdAt:  true,
        review: {
          select: {
            id:     true,
            agency: { select: { slug: true, name: true } },
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaped = comments.map((c: any) => ({
      id:          c.id,
      agencyName:  c.agencyName,
      city:        c.city,
      preview:     c.body.length > 140 ? c.body.slice(0, 140) + "…" : c.body,
      createdAt:   c.createdAt,
      reviewId:    c.review?.id ?? null,
      agencySlug:  c.review?.agency?.slug ?? null,
      agencyDbName: c.review?.agency?.name ?? null,
    }));

    return NextResponse.json({ comments: shaped });
  } catch {
    return NextResponse.json({ error: "Failed to fetch recent comments" }, { status: 500 });
  }
}

// DELETE /api/admin/recent-comments?id=<commentId>
export async function DELETE(request: Request) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await db.reviewComment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
