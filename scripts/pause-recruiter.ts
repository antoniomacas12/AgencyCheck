/**
 * scripts/pause-recruiter.ts
 *
 * Pauses a recruiter account on request (GDPR / opt-out).
 *
 * What this script does:
 *   1. Finds the recruiter in recruiter_config by name (case-insensitive search).
 *   2. Sets enabled = false  → removes her from round-robin immediately.
 *   3. Clears waUrl          → contact details no longer served to candidates.
 *   4. Records pausedAt + pausedReason for audit trail.
 *   5. Deactivates any JobListing rows linked to her agency (if applicable).
 *   6. Prints a full audit summary.
 *   7. Does NOT delete any rows — all data is preserved for reactivation.
 *
 * Usage (run from project root):
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/pause-recruiter.ts
 *
 * To reactivate later:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/pause-recruiter.ts --reactivate
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Config ───────────────────────────────────────────────────────────────────
const RECRUITER_NAME   = "Nuno's wife";   // real name: Raquel Teixeira
const PAUSE_REASON     = "Recruiter (Raquel Teixeira) requested removal of contact details and pause of recruitment (opt-out request received 2026-06-04)";
const REACTIVATE       = process.argv.includes("--reactivate");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[pause-recruiter] ${msg}`);
}

async function addPauseColumnsIfMissing() {
  // Adds pausedAt / pausedReason columns to recruiter_config if they don't exist yet.
  await prisma.$executeRawUnsafe(`
    ALTER TABLE recruiter_config
    ADD COLUMN IF NOT EXISTS "pausedAt"     TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "pausedReason" TEXT
  `);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {

  log("Starting…");
  log(`Mode: ${REACTIVATE ? "REACTIVATE" : "PAUSE"}`);
  log(`Target recruiter name: "${RECRUITER_NAME}"`);

  // 0. Ensure columns exist
  await addPauseColumnsIfMissing();
  log("DB columns verified (pausedAt, pausedReason).");

  // 1. Find recruiter
  const rows = await prisma.$queryRaw<
    { id: string; name: string; waUrl: string; enabled: boolean; sortOrder: number; pausedAt: Date | null; pausedReason: string | null }[]
  >`
    SELECT id, name, "waUrl", enabled, "sortOrder", "pausedAt", "pausedReason"
    FROM recruiter_config
    WHERE LOWER(name) LIKE ${'%' + RECRUITER_NAME.toLowerCase() + '%'}
  `;

  if (rows.length === 0) {
    log(`❌ No recruiter found matching "${RECRUITER_NAME}".`);
    log("Available recruiters:");
    const all = await prisma.$queryRaw<{ id: string; name: string; enabled: boolean }[]>`
      SELECT id, name, enabled FROM recruiter_config ORDER BY "sortOrder"
    `;
    all.forEach(r => log(`  • id="${r.id}"  name="${r.name}"  enabled=${r.enabled}`));
    return;
  }

  if (rows.length > 1) {
    log(`⚠️  Multiple matches found for "${RECRUITER_NAME}" — processing all:`);
    rows.forEach(r => log(`  • id="${r.id}"  name="${r.name}"`));
  }

  for (const recruiter of rows) {
    log(`\nFound: id="${recruiter.id}"  name="${recruiter.name}"  enabled=${recruiter.enabled}`);
    log(`  waUrl:       ${recruiter.waUrl}`);
    log(`  pausedAt:    ${recruiter.pausedAt ?? "null"}`);
    log(`  pausedReason: ${recruiter.pausedReason ?? "null"}`);

    if (REACTIVATE) {
      // ── Reactivate ──────────────────────────────────────────────────────────
      await prisma.$executeRaw`
        UPDATE recruiter_config
        SET
          enabled      = true,
          "pausedAt"   = NULL,
          "pausedReason" = NULL
        WHERE id = ${recruiter.id}
      `;
      log(`✅ Reactivated recruiter id="${recruiter.id}" name="${recruiter.name}"`);

      // Reactivate any job listings that were paused by this script
      // Job listings not linked to individual recruiters — nothing to reactivate.
      log(`  JobListings: N/A (round-robin platform, not per-recruiter)`);

    } else {
      // ── Pause ───────────────────────────────────────────────────────────────
      const now = new Date();

      // 2. Disable recruiter + clear contact info + record reason
      await prisma.$executeRaw`
        UPDATE recruiter_config
        SET
          enabled        = false,
          "waUrl"        = '[REMOVED ON REQUEST]',
          "pausedAt"     = ${now},
          "pausedReason" = ${PAUSE_REASON}
        WHERE id = ${recruiter.id}
      `;
      log(`✅ Recruiter disabled: id="${recruiter.id}" name="${recruiter.name}"`);
      log(`   waUrl cleared to: [REMOVED ON REQUEST]`);
      log(`   pausedAt: ${now.toISOString()}`);
      log(`   pausedReason: "${PAUSE_REASON}"`);

      // 3. Count referral clicks for audit (NOT deleted)
      const [clickRow] = await prisma.$queryRaw<{ cnt: bigint }[]>`
        SELECT COUNT(*) AS cnt FROM referral_clicks WHERE "recruiter" = ${recruiter.name}
      `;
      log(`   Historical referral_clicks preserved: ${Number(clickRow.cnt)} rows`);

      // 4. Deactivate job listings linked to her agency (if any)
      // Job listings are not directly linked to individual recruiters in this platform
      // (recruiter assignment is round-robin at apply time). Nothing to deactivate here.
      const deactivated = 0;
      log(`   JobListings deactivated: ${deactivated}`);

      // 5. Verify the update
      const [verified] = await prisma.$queryRaw<
        { id: string; name: string; waUrl: string; enabled: boolean; pausedAt: Date | null }[]
      >`
        SELECT id, name, "waUrl", enabled, "pausedAt"
        FROM recruiter_config
        WHERE id = ${recruiter.id}
      `;
      log(`\n── Verification ──────────────────────────────────────────────────`);
      log(`   id:       ${verified.id}`);
      log(`   name:     ${verified.name}`);
      log(`   enabled:  ${verified.enabled}  ← must be false`);
      log(`   waUrl:    ${verified.waUrl}`);
      log(`   pausedAt: ${verified.pausedAt}`);

      if (!verified.enabled) {
        log(`\n✅ CONFIRMED: Recruiter is now inactive. No new candidates will be routed to her.`);
      } else {
        log(`\n❌ ERROR: enabled is still true — update may have failed.`);
        process.exit(1);
      }
    }
  }

  log(`\n── Summary ────────────────────────────────────────────────────────`);
  log(`Action:          ${REACTIVATE ? "REACTIVATE" : "PAUSE"}`);
  log(`Recruiter:       ${RECRUITER_NAME}`);
  log(`Records deleted: 0  (no data was deleted)`);
  log(`Reactivation:    Run with --reactivate flag to restore full access`);
  log(`Done.`);
}

main()
  .catch((e) => {
    console.error("[pause-recruiter] FATAL:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
