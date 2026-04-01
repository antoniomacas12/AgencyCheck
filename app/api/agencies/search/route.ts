/**
 * GET /api/agencies/search?q=<query>
 * Returns up to 8 agencies whose name contains the query (case-insensitive).
 * Searches both Supabase (live DB) and the static agency dataset so that all
 * 151 agencies on the site are always findable — even before they're seeded to
 * the database.  DB results get priority; static results fill any remaining
 * slots, deduplicated by slug.
 *
 * Used by the review form agency combobox.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VERIFIED_AGENCIES } from "@/data/agencies";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: NextRequest) {
  try {
    const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 1) return NextResponse.json({ agencies: [] });

    const qLower = q.toLowerCase();

    // ── 1. Search live DB ──────────────────────────────────────────────────
    let dbAgencies: { id: string; name: string; slug: string }[] = [];
    try {
      dbAgencies = await db.agency.findMany({
        where:   { name: { contains: q, mode: "insensitive" } },
        select:  { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
        take:    8,
      });
    } catch {
      // DB unavailable — fall through to static data only
    }

    // ── 2. Search static dataset ───────────────────────────────────────────
    const dbSlugs = new Set(dbAgencies.map((a) => a.slug));

    const staticMatches = VERIFIED_AGENCIES
      .filter((a) => a.name.toLowerCase().includes(qLower))
      .filter((a) => !dbSlugs.has(a.slug))   // skip if already in DB results
      .map((a) => ({ id: `static-${a.id}`, name: a.name, slug: a.slug }));

    // ── 3. Merge and cap at 8 ─────────────────────────────────────────────
    const agencies = [...dbAgencies, ...staticMatches].slice(0, 8);

    return NextResponse.json({ agencies });
  } catch (error) {
    console.error("[GET /api/agencies/search]", error);
    return NextResponse.json({ agencies: [] });
  }
}
