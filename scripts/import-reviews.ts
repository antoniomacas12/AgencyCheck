/**
 * import-reviews.ts
 *
 * Safely imports reviews from a JSON export of the old Supabase project.
 * Handles the { "json_agg": [...] } wrapper produced by Supabase SQL queries.
 *
 * Run:
 *   npx tsx scripts/import-reviews.ts [path/to/reviews.json]
 *
 * Defaults to: scripts/data/reviews.json
 * Also accepts revju.json directly:
 *   npx tsx scripts/import-reviews.ts scripts/data/revju.json
 */

import fs   from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NOW    = new Date();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadRecords(filePath: string): Record<string, unknown>[] {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(abs, "utf-8"));

  // Unwrap [{ "json_agg": [...] }] or { "json_agg": [...] }
  if (Array.isArray(raw) && raw.length > 0 && "json_agg" in raw[0]) {
    return raw[0].json_agg as Record<string, unknown>[];
  }
  if (!Array.isArray(raw) && "json_agg" in raw) {
    return (raw as { json_agg: Record<string, unknown>[] }).json_agg;
  }
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  return [raw as Record<string, unknown>];
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}
function num(v: unknown, fallback: number): number {
  return typeof v === "number" ? v : fallback;
}
function numNullable(v: unknown): number | null {
  return typeof v === "number" ? v : null;
}
function floatNullable(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v !== "") return parseFloat(v);
  return null;
}
function intNullable(v: unknown): number | null {
  if (typeof v === "number") return Math.round(v);
  if (typeof v === "string" && v !== "") return parseInt(v, 10);
  return null;
}
function dt(v: unknown): Date {
  if (typeof v === "string" && v) return new Date(v);
  return NOW;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Accept revju.json as well as reviews.json
  const file    = process.argv[2] ?? "scripts/data/reviews.json";
  const records = loadRecords(file);

  console.log(`\n📂  Loaded ${records.length} reviews from ${file}\n`);

  // Pre-load all agency ids that exist in the new DB for fast lookup
  const agencyRows = await prisma.agency.findMany({ select: { id: true } });
  const agencyIds  = new Set(agencyRows.map((a) => a.id));
  console.log(`🏢  Found ${agencyIds.size} agencies in current DB\n`);

  let created  = 0;
  let skipped  = 0;
  let noAgency = 0;
  let errored  = 0;

  for (const r of records) {
    const id       = str(r.id);
    const agencyId = str(r.agencyId);

    if (!id) {
      console.warn(`⚠️   Skipping review with no id`);
      errored++;
      continue;
    }

    // Requirement 8: skip reviews whose agencyId doesn't exist
    if (!agencyId || !agencyIds.has(agencyId)) {
      console.warn(`🚫  Skip (no agency):  review ${id}  →  agencyId "${agencyId}" not found`);
      noAgency++;
      continue;
    }

    // Requirement 6: skip duplicates by id
    const existing = await prisma.review.findUnique({
      where:  { id },
      select: { id: true },
    });
    if (existing) {
      console.log(`⏭️   Skip (exists):  review ${id}`);
      skipped++;
      continue;
    }

    try {
      await prisma.review.create({
        data: {
          id,
          agencyId,
          status:               str(r.status,               "PUBLISHED"),
          isPublished:          r.isPublished === true || r.isPublished === "true" || r.status === "PUBLISHED",
          internalNotes:        r.internalNotes  as string | null ?? null,
          moderatedAt:          r.moderatedAt    ? new Date(r.moderatedAt as string) : null,
          moderatedBy:          r.moderatedBy    as string | null ?? null,
          reviewType:           str(r.reviewType,           "ANONYMOUS"),
          workerStatus:         str(r.workerStatus,         "UNKNOWN"),
          experiencePeriod:     r.experiencePeriod as string | null ?? null,
          jobType:              r.jobType         as string | null ?? null,
          jobTitle:             r.jobTitle        as string | null ?? null,
          city:                 r.city            as string | null ?? null,
          title:                r.title           as string | null ?? null,
          overallRating:        num(r.overallRating,        3),
          salaryRating:         num(r.salaryRating,         3),
          housingRating:        numNullable(r.housingRating),
          managementRating:     num(r.managementRating,     3),
          contractClarityRating:num(r.contractClarityRating,3),
          transportRating:      numNullable(r.transportRating),
          salaryAccuracyRating: numNullable(r.salaryAccuracyRating),
          accommodationProvided:str(r.accommodationProvided,"UNKNOWN"),
          roomType:             str(r.roomType,             "UNKNOWN"),
          weeklyRent:           floatNullable(r.weeklyRent),
          peopleInHouse:        intNullable(r.peopleInHouse),
          wouldRecommend:       str(r.wouldRecommend,       "UNSURE"),
          comment:              r.comment         as string | null ?? null,
          issueTags:            str(r.issueTags,            "[]"),
          verificationStatus:   str(r.verificationStatus,   "UNKNOWN"),
          sourceType:           str(r.sourceType,           "WORKER_REPORTED"),
          createdAt:            dt(r.createdAt),
        },
      });
      console.log(`✅  Created review ${id}  (agency: ${agencyId})`);
      created++;
    } catch (err) {
      console.error(`❌  Failed review ${id} — ${(err as Error).message}`);
      errored++;
    }
  }

  console.log(`
─────────────────────────────────────
  Reviews import complete
  Created        : ${created}
  Skipped        : ${skipped}  (already existed)
  No agency      : ${noAgency}  (agencyId missing from DB — run import-agencies first)
  Errors         : ${errored}
─────────────────────────────────────
`);

  if (noAgency > 0) {
    console.log(`ℹ️   ${noAgency} reviews skipped because their agency was not found.`);
    console.log(`    Run import-agencies.ts first, then re-run this script.\n`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
