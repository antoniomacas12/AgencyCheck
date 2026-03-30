/**
 * GET /api/agencies/search?q=<query>
 * Returns up to 8 agencies whose name contains the query (case-insensitive).
 * Used by the review form agency combobox.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: NextRequest) {
  try {
    const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 1) return NextResponse.json({ agencies: [] });

    const agencies = await db.agency.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
      take: 8,
    });

    return NextResponse.json({ agencies });
  } catch (error) {
    console.error("[GET /api/agencies/search]", error);
    return NextResponse.json({ agencies: [] });
  }
}
