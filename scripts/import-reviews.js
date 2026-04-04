/**
 * import-reviews.js  (plain Node.js — no tsx/ts-node required)
 *
 * Run:
 *   node scripts/import-reviews.js [path/to/revju.json]
 *
 * Defaults to: scripts/data/revju.json
 * Also accepts reviews.json:
 *   node scripts/import-reviews.js scripts/data/reviews.json
 */

const fs   = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const NOW    = new Date();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadRecords(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(abs, "utf-8"));
  if (Array.isArray(raw) && raw.length > 0 && "json_agg" in raw[0]) return raw[0].json_agg;
  if (!Array.isArray(raw) && "json_agg" in raw) return raw.json_agg;
  if (Array.isArray(raw)) return raw;
  return [raw];
}

function str(v, fallback = "")  { return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback; }
function num(v, fallback)        { return typeof v === "number" ? v : fallback; }
function numNullable(v)          { return typeof v === "number" ? v : null; }
function floatNullable(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v !== "") return parseFloat(v);
  return null;
}
function intNullable(v) {
  if (typeof v === "number") return Math.round(v);
  if (typeof v === "string" && v !== "") return parseInt(v, 10);
  return null;
}
function dt(v) { return typeof v === "string" && v ? new Date(v) : NOW; }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const file    = process.argv[2] ?? "scripts/data/revju.json";
  const records = loadRecords(file);

  console.log(`\n📂  Loaded ${records.length} reviews from ${file}\n`);

  // Pre-load all agency ids for fast lookup
  const agencyRows = await prisma.agency.findMany({ select: { id: true } });
  const agencyIds  = new Set(agencyRows.map((a) => a.id));
  console.log(`🏢  Found ${agencyIds.size} agencies in current DB\n`);

  let created = 0, skipped = 0, noAgency = 0, errored = 0;

  for (const r of records) {
    const id       = str(r.id);
    const agencyId = str(r.agencyId);

    if (!id) {
      console.warn(`⚠️   Skipping review with no id`);
      errored++;
      continue;
    }

    if (!agencyId || !agencyIds.has(agencyId)) {
      console.warn(`🚫  Skip (no agency):  review ${id}  →  agencyId "${agencyId}" not found`);
      noAgency++;
      continue;
    }

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
          internalNotes:        r.internalNotes  ?? null,
          moderatedAt:          r.moderatedAt    ? new Date(r.moderatedAt) : null,
          moderatedBy:          r.moderatedBy    ?? null,
          reviewType:           str(r.reviewType,           "ANONYMOUS"),
          workerStatus:         str(r.workerStatus,         "UNKNOWN"),
          experiencePeriod:     r.experiencePeriod ?? null,
          jobType:              r.jobType         ?? null,
          jobTitle:             r.jobTitle        ?? null,
          city:                 r.city            ?? null,
          title:                r.title           ?? null,
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
          comment:              r.comment         ?? null,
          issueTags:            str(r.issueTags,            "[]"),
          verificationStatus:   str(r.verificationStatus,   "UNKNOWN"),
          sourceType:           str(r.sourceType,           "WORKER_REPORTED"),
          // Use current timestamp so imported reviews surface as "new" at the top
          createdAt:            NOW,
        },
      });
      console.log(`✅  Created review ${id}  (agency: ${agencyId})`);
      created++;
    } catch (err) {
      console.error(`❌  Failed review ${id} — ${err.message}`);
      errored++;
    }
  }

  console.log(`
─────────────────────────────────────
  Reviews import complete
  Created        : ${created}
  Skipped        : ${skipped}  (already existed)
  No agency      : ${noAgency}  (agencyId missing from DB)
  Errors         : ${errored}
─────────────────────────────────────
`);

  if (noAgency > 0) {
    console.log(`ℹ️   ${noAgency} reviews skipped because their agency was not found.`);
    console.log(`    Run import-agencies.js first, then re-run this script.\n`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
