/**
 * import-agencies.js  (plain Node.js — no tsx/ts-node required)
 *
 * Run:
 *   node scripts/import-agencies.js [path/to/agencije.json]
 *
 * Defaults to: scripts/data/agencije.json
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
  // Unwrap [{ "json_agg": [...] }] or { "json_agg": [...] }
  if (Array.isArray(raw) && raw.length > 0 && "json_agg" in raw[0]) return raw[0].json_agg;
  if (!Array.isArray(raw) && "json_agg" in raw) return raw.json_agg;
  if (Array.isArray(raw)) return raw;
  return [raw];
}

function str(v, fallback = "")  { return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback; }
function num(v, fallback = 0)   { return typeof v === "number" ? v : fallback; }
function dt(v)                   { return typeof v === "string" && v ? new Date(v) : NOW; }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const file    = process.argv[2] ?? "scripts/data/agencije.json";
  const records = loadRecords(file);

  console.log(`\n📂  Loaded ${records.length} agencies from ${file}\n`);

  let created = 0, skipped = 0, errored = 0;

  for (const r of records) {
    const id   = str(r.id);
    const slug = str(r.slug);

    if (!id || !slug) {
      console.warn(`⚠️   Skipping record with missing id/slug:`, JSON.stringify(r).slice(0, 80));
      errored++;
      continue;
    }

    const existing = await prisma.agency.findFirst({
      where: { OR: [{ id }, { slug }] },
      select: { id: true },
    });

    if (existing) {
      console.log(`⏭️   Skip (exists):  ${slug}`);
      skipped++;
      continue;
    }

    try {
      await prisma.agency.create({
        data: {
          id,
          name:              str(r.name, slug),
          slug,
          description:       r.description    ?? null,
          website:           r.website        ?? null,
          email:             r.email          ?? null,
          phone:             r.phone          ?? null,
          logoUrl:           r.logoUrl        ?? null,
          housing:           str(r.housing,           "UNKNOWN"),
          housingType:       str(r.housingType,       "UNKNOWN"),
          transport:         str(r.transport,         "UNKNOWN"),
          city:              str(r.city,              "unknown"),
          cities:            str(r.cities,            "[]"),
          jobTypes:          r.jobTypes       ?? null,
          salaryRange:       r.salaryRange    ?? null,
          agencyType:        str(r.agencyType,        "general-staffing"),
          jobFocus:          str(r.jobFocus,          "[]"),
          transparencyScore: num(r.transparencyScore, 0),
          accommodation:     str(r.accommodation,     "unknown"),
          supportedCities:   str(r.supportedCities,   "[]"),
          canonicalId:       r.canonicalId    ?? null,
          aliases:           str(r.aliases,           "[]"),
          duplicateCount:    num(r.duplicateCount,    1),
          confidenceScore:   num(r.confidenceScore,   100),
          sourceUrl:         r.sourceUrl      ?? null,
          sourceType:        str(r.sourceType,        "UNKNOWN"),
          lastCheckedAt:     r.lastCheckedAt  ? new Date(r.lastCheckedAt) : null,
          createdAt:         dt(r.createdAt),
          updatedAt:         r.updatedAt ? dt(r.updatedAt) : NOW,
        },
      });
      console.log(`✅  Created:  ${slug}  (${id})`);
      created++;
    } catch (err) {
      console.error(`❌  Failed:   ${slug} — ${err.message}`);
      errored++;
    }
  }

  console.log(`
─────────────────────────────
  Agencies import complete
  Created : ${created}
  Skipped : ${skipped}
  Errors  : ${errored}
─────────────────────────────
`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
