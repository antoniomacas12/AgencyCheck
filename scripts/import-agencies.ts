/**
 * import-agencies.ts
 *
 * Safely imports agencies from a JSON export of the old Supabase project.
 * Handles the { "json_agg": [...] } wrapper produced by Supabase SQL queries.
 *
 * Run:
 *   npx tsx scripts/import-agencies.ts [path/to/agencije.json]
 *
 * Defaults to: scripts/data/agencije.json
 */

import fs   from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NOW    = new Date();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadRecords(filePath: string): Record<string, unknown>[] {
  const abs  = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  const raw  = JSON.parse(fs.readFileSync(abs, "utf-8"));

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
function num(v: unknown, fallback = 0): number {
  return typeof v === "number" ? v : fallback;
}
function dt(v: unknown): Date {
  if (typeof v === "string" && v) return new Date(v);
  return NOW;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const file    = process.argv[2] ?? "scripts/data/agencije.json";
  const records = loadRecords(file);

  console.log(`\n📂  Loaded ${records.length} agencies from ${file}\n`);

  let created  = 0;
  let skipped  = 0;
  let errored  = 0;

  for (const r of records) {
    const id   = str(r.id);
    const slug = str(r.slug);

    if (!id || !slug) {
      console.warn(`⚠️   Skipping record with missing id/slug:`, JSON.stringify(r).slice(0, 80));
      errored++;
      continue;
    }

    // Skip if already exists (by id OR slug)
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
          description:       r.description    as string | null ?? null,
          website:           r.website        as string | null ?? null,
          email:             r.email          as string | null ?? null,
          phone:             r.phone          as string | null ?? null,
          logoUrl:           r.logoUrl        as string | null ?? null,
          housing:           str(r.housing,           "UNKNOWN"),
          housingType:       str(r.housingType,       "UNKNOWN"),
          transport:         str(r.transport,         "UNKNOWN"),
          city:              str(r.city,              "unknown"),
          cities:            str(r.cities,            "[]"),
          jobTypes:          r.jobTypes       as string | null ?? null,
          salaryRange:       r.salaryRange    as string | null ?? null,
          agencyType:        str(r.agencyType,        "general-staffing"),
          jobFocus:          str(r.jobFocus,          "[]"),
          transparencyScore: num(r.transparencyScore, 0),
          accommodation:     str(r.accommodation,     "unknown"),
          supportedCities:   str(r.supportedCities,   "[]"),
          canonicalId:       r.canonicalId    as string | null ?? null,
          aliases:           str(r.aliases,           "[]"),
          duplicateCount:    num(r.duplicateCount,    1),
          confidenceScore:   num(r.confidenceScore,   100),
          sourceUrl:         r.sourceUrl      as string | null ?? null,
          sourceType:        str(r.sourceType,        "UNKNOWN"),
          lastCheckedAt:     r.lastCheckedAt  ? new Date(r.lastCheckedAt as string) : null,
          createdAt:         dt(r.createdAt),
          updatedAt:         r.updatedAt ? dt(r.updatedAt) : NOW,
        },
      });
      console.log(`✅  Created:  ${slug}  (${id})`);
      created++;
    } catch (err) {
      console.error(`❌  Failed:   ${slug} — ${(err as Error).message}`);
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
