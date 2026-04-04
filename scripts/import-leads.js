/**
 * import-leads.js  (plain Node.js — no tsx/ts-node required)
 *
 * Run:
 *   node scripts/import-leads.js [path/to/leads.json]
 *
 * Defaults to: scripts/data/leads.json
 */

const fs   = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const NOW    = new Date();

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

function str(v, fallback = null)  { return typeof v === "string" && v.trim() ? v.trim() : fallback; }
function bool(v, fallback = null) { if (typeof v === "boolean") return v; if (v === "true") return true; if (v === "false") return false; return fallback; }
function flt(v)                   { return typeof v === "number" ? v : (typeof v === "string" && v ? parseFloat(v) : null); }
function dt(v)                    { return typeof v === "string" && v ? new Date(v) : null; }

async function main() {
  const file    = process.argv[2] ?? "scripts/data/leads.json";
  const records = loadRecords(file);

  console.log(`\n📂  Loaded ${records.length} leads from ${file}\n`);

  let created = 0, skipped = 0, errored = 0;

  for (const r of records) {
    const id = str(r.id);
    if (!id) { console.warn(`⚠️   Skipping lead with no id`); errored++; continue; }

    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
    if (existing) {
      console.log(`⏭️   Skip (exists):  ${id}  ${str(r.fullName) ?? ""}`);
      skipped++;
      continue;
    }

    try {
      await prisma.lead.create({
        data: {
          id,
          createdAt:            dt(r.createdAt) ?? NOW,
          updatedAt:            dt(r.updatedAt) ?? NOW,
          sourcePage:           str(r.sourcePage)  ?? "unknown",
          sourceType:           str(r.sourceType)  ?? "general_apply",
          sourceSlug:           str(r.sourceSlug),
          sourceLabel:          str(r.sourceLabel),
          fullName:             str(r.fullName)    ?? "Unknown",
          phone:                str(r.phone)       ?? "",
          email:                str(r.email),
          whatsappSame:         bool(r.whatsappSame) ?? false,
          nationality:          str(r.nationality),
          currentCountry:       str(r.currentCountry),
          alreadyInNL:          bool(r.alreadyInNL),
          preferredWorkType:    str(r.preferredWorkType),
          preferredRegion:      str(r.preferredRegion),
          accommodationNeeded:  bool(r.accommodationNeeded),
          driversLicense:       bool(r.driversLicense),
          canWorkWeekends:      bool(r.canWorkWeekends),
          experienceLevel:      str(r.experienceLevel),
          availableFrom:        dt(r.availableFrom),
          notes:                str(r.notes),
          status:               str(r.status)      ?? "new",
          tags:                 str(r.tags)         ?? "[]",
          assignedTo:           str(r.assignedTo),
          lastContactedAt:      dt(r.lastContactedAt),
          internalNotes:        str(r.internalNotes),
          assignedAgencies:     str(r.assignedAgencies) ?? "[]",
          sentAt:               dt(r.sentAt),
          confirmedAt:          dt(r.confirmedAt),
          workerStartDate:      dt(r.workerStartDate),
          payoutAmount:         flt(r.payoutAmount),
          paidAt:               dt(r.paidAt),
        },
      });
      console.log(`✅  Created:  ${id}  ${str(r.fullName) ?? ""}`);
      created++;
    } catch (err) {
      console.error(`❌  Failed:   ${id} — ${err.message}`);
      errored++;
    }
  }

  console.log(`
─────────────────────────────
  Leads import complete
  Created : ${created}
  Skipped : ${skipped}
  Errors  : ${errored}
─────────────────────────────
`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
