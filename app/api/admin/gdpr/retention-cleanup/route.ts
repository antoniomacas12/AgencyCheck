/**
 * GET /api/admin/gdpr/retention-cleanup
 *
 * DRY-RUN ONLY — reports which leads would be eligible for deletion
 * under the 12-month retention policy. NEVER performs actual deletion.
 *
 * Retention policy (per privacy/transparency pages, August 2026):
 *   Lead data is kept for up to 12 months from submission.
 *   Active conversions (status: converted | confirmed | paid) are excluded
 *   from automated cleanup as they represent legitimate ongoing records.
 *
 * LIVE DELETION is deliberately NOT enabled here.
 * When/if live deletion is authorised by the data controller, a separate
 * coordinated migration should be performed — never automated without review.
 *
 * Query params:
 *   none required — always dry-run
 *
 * Response:
 *   {
 *     dryRun:       true,                    // always true
 *     cutoffDate:   "2025-08-19T...",        // leads before this date are eligible
 *     eligibleCount: number,                 // how many leads would be deleted
 *     excluded:     { active: number },      // how many were excluded (active status)
 *     eligibleIds:  string[],                // lead IDs (max 200 shown)
 *     message:      string                   // human-readable summary
 *   }
 */

import { NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Statuses that indicate an active commercial relationship — exclude from cleanup
const ACTIVE_STATUSES = new Set(["converted", "confirmed", "paid"]);

// 12-month retention period in milliseconds
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const cutoffDate = new Date(Date.now() - RETENTION_MS);

  try {
    // Leads older than 12 months, excluding active commercial records
    const [eligible, activeOldLeads] = await Promise.all([
      prisma.lead.findMany({
        where: {
          createdAt: { lt: cutoffDate },
          NOT: { status: { in: [...ACTIVE_STATUSES] } },
        },
        select: {
          id:         true,
          createdAt:  true,
          sourceType: true,
          status:     true,
          // NOTE: gdprLawfulBasis and gdprRestricted fields are defined in schema.prisma
          // but the Prisma client types are stale until `npx prisma generate` is run
          // after applying prisma/gdpr_phase18_accountability.sql.
          // They are omitted from this select to keep the file compilable in the interim.
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.lead.count({
        where: {
          createdAt: { lt: cutoffDate },
          status:    { in: [...ACTIVE_STATUSES] },
        },
      }),
    ]);

    const eligibleIds = eligible.slice(0, 200).map((l) => l.id);

    // Summarise by sourceType — useful for the owner to understand composition
    const bySource: Record<string, number> = {};
    for (const lead of eligible) {
      bySource[lead.sourceType] = (bySource[lead.sourceType] ?? 0) + 1;
    }

    return NextResponse.json({
      dryRun:        true,
      cutoffDate:    cutoffDate.toISOString(),
      eligibleCount: eligible.length,
      excluded:      { active: activeOldLeads },
      bySourceType:  bySource,
      eligibleIds,
      message:
        `DRY-RUN: ${eligible.length} lead(s) submitted before ${cutoffDate.toISOString().split("T")[0]} ` +
        `are eligible for deletion under the 12-month retention policy. ` +
        `${activeOldLeads} active-status lead(s) excluded. ` +
        `No data was deleted. Live deletion requires a separate coordinated action.`,
    });
  } catch (err) {
    console.error("[gdpr/retention-cleanup] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
