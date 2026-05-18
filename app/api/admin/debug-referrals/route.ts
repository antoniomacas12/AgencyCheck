/**
 * GET /api/admin/debug-referrals
 *
 * Full diagnostic for the recruiter tracking system.
 * Returns the exact state of the DB — tables, rows, recent clicks.
 * Protected by admin auth.
 */

import { NextResponse }                        from "next/server";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";
import { prisma }                               from "@/lib/prisma";
import { ensureDbReady }                        from "@/lib/recruiter-db";
import { RECRUITER_SEEDS }                      from "@/lib/recruiters";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedJson();

  const result: Record<string, unknown> = {
    ts:    new Date().toISOString(),
    seeds: RECRUITER_SEEDS,
  };

  // ── 1. Raw DB connectivity ─────────────────────────────────────────────────
  try {
    await prisma.$queryRaw`SELECT 1`;
    result.db_connection = "ok";
  } catch (e) {
    result.db_connection = "FAILED";
    result.db_connection_error = String(e);
    return NextResponse.json(result);   // can't do anything without DB
  }

  // ── 2. Table existence ─────────────────────────────────────────────────────
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename IN ('recruiter_config', 'referral_clicks')
    `;
    result.tables_found = tables.map((t) => t.tablename);
  } catch (e) {
    result.tables_check_error = String(e);
  }

  // ── 3. Run ensureDbReady ───────────────────────────────────────────────────
  try {
    await ensureDbReady();
    result.ensure_db_ready = "ok";
  } catch (e) {
    result.ensure_db_ready = "FAILED";
    result.ensure_db_ready_error = String(e);
  }

  // ── 4. recruiter_config rows ───────────────────────────────────────────────
  try {
    const recruiters = await prisma.$queryRaw<
      { id: string; name: string; waUrl: string; enabled: boolean; sortOrder: number }[]
    >`SELECT "id", "name", "waUrl", "enabled", "sortOrder" FROM recruiter_config ORDER BY "sortOrder"`;
    result.recruiter_config_rows = recruiters;
    result.recruiter_config_count = recruiters.length;
  } catch (e) {
    result.recruiter_config_error = String(e);
  }

  // ── 5. referral_clicks count + recent rows ─────────────────────────────────
  try {
    const [cnt] = await prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) AS total FROM referral_clicks
    `;
    result.referral_clicks_total = Number(cnt.total);
  } catch (e) {
    result.referral_clicks_error = String(e);
  }

  try {
    const recent = await prisma.$queryRaw<
      { id: string; createdAt: Date; recruiter: string; jobId: string | null; jobTitle: string | null; source: string }[]
    >`
      SELECT "id", "createdAt", "recruiter", "jobId", "jobTitle", "source"
      FROM referral_clicks
      ORDER BY "createdAt" DESC
      LIMIT 10
    `;
    result.referral_clicks_recent = recent;
  } catch (e) {
    result.referral_clicks_recent_error = String(e);
  }

  // ── 6. Test INSERT + DELETE (non-destructive smoke test) ───────────────────
  const testId = `debug-test-${Date.now()}`;
  try {
    await prisma.$executeRaw`
      INSERT INTO referral_clicks ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
      VALUES (${testId}, 'DEBUG', 'https://wa.me/0', NULL, 'debug-smoke-test', 'AgencyCheck')
    `;
    await prisma.$executeRaw`
      DELETE FROM referral_clicks WHERE "id" = ${testId}
    `;
    result.insert_smoke_test = "ok";
  } catch (e) {
    result.insert_smoke_test = "FAILED";
    result.insert_smoke_test_error = String(e);
  }

  return NextResponse.json(result, { status: 200 });
}
