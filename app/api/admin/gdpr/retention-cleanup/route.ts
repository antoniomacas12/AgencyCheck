/**
 * GET /api/admin/gdpr/retention-cleanup
 *
 * Default: DRY-RUN — reports which leads would be eligible for cleanup.
 * Live mode: requires ?mode=live AND x-gdpr-action: confirmed header.
 *
 * Retention policy (per privacy/transparency pages, August 2026):
 *   Lead data is kept for up to 12 months from submission.
 *   Active conversions (status: converted | confirmed | paid) are excluded
 *   from automated deletion — personal data is anonymised instead.
 *
 * Live mode behaviour:
 *   - Unplaced leads (NOT converted/confirmed/paid): DELETED entirely
 *   - Placed leads (converted/confirmed/paid): personal data ANONYMISED;
 *     financial records (id, status, confirmedAt, workerStartDate,
 *     payoutAmount, paidAt, sourceType, gdprErasureRequestedAt,
 *     gdprLawfulBasis, assignedAgencies) are retained.
 *
 * Query params:
 *   mode=live  — enables live deletion (requires header)
 *
 * Required header for live mode:
 *   x-gdpr-action: confirmed
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Statuses that indicate an active commercial relationship — anonymise, do not delete
const PLACED_STATUSES = ["converted", "confirmed", "paid"];

// 12-month retention period in milliseconds
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  const cutoffDate = new Date(Date.now() - RETENTION_MS);

  // ── LIVE MODE ─────────────────────────────────────────────────────────────
  if (mode === "live") {
    const authHeader = req.headers.get("x-gdpr-action");
    if (authHeader !== "confirmed") {
      return NextResponse.json({ error: "Missing x-gdpr-action: confirmed header" }, { status: 403 });
    }

    try {
      // 1. Delete unplaced expired leads (not in placed statuses)
      const unplacedToDelete = await prisma.lead.findMany({
        where: {
          createdAt: { lt: cutoffDate },
          NOT: { status: { in: PLACED_STATUSES } },
        },
        select: { id: true },
      });
      const unplacedIds = unplacedToDelete.map((l) => l.id);

      let deletedCount = 0;
      if (unplacedIds.length > 0) {
        const del = await prisma.lead.deleteMany({
          where: { id: { in: unplacedIds } },
        });
        deletedCount = del.count;
      }

      // 2. Anonymise personal data for placed expired leads
      const anonymiseResult = await prisma.lead.updateMany({
        where: {
          createdAt: { lt: cutoffDate },
          status: { in: PLACED_STATUSES },
        },
        data: {
          fullName:       "[anonymised]",
          phone:          "",
          email:          null,
          nationality:    null,
          currentCountry: null,
          notes:          null,
          internalNotes:  null,
        },
      });

      console.log(
        `[gdpr/retention-cleanup LIVE] deleted=${deletedCount} anonymised=${anonymiseResult.count} cutoff=${cutoffDate.toISOString()}`
      );

      return NextResponse.json({
        dryRun:          false,
        cutoffDate:      cutoffDate.toISOString(),
        deletedCount,
        anonymisedCount: anonymiseResult.count,
        message:
          `LIVE: ${deletedCount} unplaced lead(s) deleted, ` +
          `${anonymiseResult.count} placed lead(s) anonymised. ` +
          `Cutoff: ${cutoffDate.toISOString().split("T")[0]}.`,
      });
    } catch (err) {
      console.error("[gdpr/retention-cleanup LIVE] error:", err);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
  }

  // ── DRY-RUN MODE (default) ─────────────────────────────────────────────────
  try {
    const [unplaced, placedOld] = await Promise.all([
      prisma.lead.findMany({
        where: {
          createdAt: { lt: cutoffDate },
          NOT: { status: { in: PLACED_STATUSES } },
        },
        select: { id: true, createdAt: true, sourceType: true, status: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.lead.count({
        where: {
          createdAt: { lt: cutoffDate },
          status:    { in: PLACED_STATUSES },
        },
      }),
    ]);

    const eligibleIds = unplaced.slice(0, 200).map((l) => l.id);

    const bySource: Record<string, number> = {};
    for (const lead of unplaced) {
      bySource[lead.sourceType] = (bySource[lead.sourceType] ?? 0) + 1;
    }

    return NextResponse.json({
      dryRun:          true,
      cutoffDate:      cutoffDate.toISOString(),
      eligibleCount:   unplaced.length,
      wouldAnonymise:  placedOld,
      bySourceType:    bySource,
      eligibleIds,
      message:
        `DRY-RUN: ${unplaced.length} unplaced lead(s) eligible for deletion, ` +
        `${placedOld} placed lead(s) eligible for anonymisation ` +
        `(submitted before ${cutoffDate.toISOString().split("T")[0]}). ` +
        `No data was changed. To run live: add ?mode=live and x-gdpr-action: confirmed header.`,
    });
  } catch (err) {
    console.error("[gdpr/retention-cleanup] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
