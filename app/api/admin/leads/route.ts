/**
 * GET /api/admin/leads — paginated lead list with filters
 * Uses Prisma + PostgreSQL (Supabase) for persistent storage.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// tags and assignedAgencies are stored as JSON strings; parse before returning.
function safeParseArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseLead(lead: any): any {
  if (!lead) return lead;
  return { ...lead, tags: safeParseArray(lead.tags), assignedAgencies: safeParseArray(lead.assignedAgencies) };
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  try {
    const { searchParams } = new URL(req.url);
    const status        = searchParams.get("status")        ?? undefined;
    const sourceType    = searchParams.get("sourceType")    ?? undefined;
    const accommodation = searchParams.get("accommodation");
    const workType      = searchParams.get("workType")      ?? undefined;
    const q             = searchParams.get("q")             ?? undefined;
    const page          = Math.max(1, parseInt(searchParams.get("page")  ?? "1",  10));
    const limit         = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));

    // Build where clause — all fields are plain strings now (no enum types)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (status)                  where.status = status;
    if (sourceType)              where.sourceType = sourceType;
    if (accommodation === "yes") where.accommodationNeeded = true;
    if (accommodation === "no")  where.accommodationNeeded = false;
    if (workType)                where.preferredWorkType = workType;

    if (q) {
      where.OR = [
        { fullName: { contains: q } },
        { phone:    { contains: q } },
        { email:    { contains: q } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip:    (page - 1) * limit,
        take:    limit,
        include: { sends: true },
      }),
      prisma.lead.count({ where }),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({ leads: leads.map(parseLead), total, page, pages });
  } catch (err) {
    console.error("[GET /api/admin/leads]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
