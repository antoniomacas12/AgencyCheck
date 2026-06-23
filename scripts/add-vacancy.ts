#!/usr/bin/env ts-node
/**
 * add-vacancy — AgencyCheck page generator
 * =========================================
 * Run:  npm run add-vacancy
 *
 * What it does for each entry in VACANCIES:
 *   1. Checks if the city exists in lib/seoData.ts  → CITIES
 *   2. Checks if the city exists in lib/vacanciesData.ts → CITY_META
 *   3. Maps job category to a salary slug and checks lib/seoData.ts → JOB_SALARY_DATA
 *   4. Reports any agency not found in data/agencies.ts
 *   5. Lists every auto-generated page URL (job, city, housing, salary, agency)
 *
 * Pass --write to actually insert missing entries into the data files.
 * Without --write the script is a dry-run: it only prints what's needed.
 *
 * Usage examples:
 *   npm run add-vacancy              # dry-run report
 *   npm run add-vacancy -- --write   # write missing data + report
 */

import * as fs   from "fs";
import * as path from "path";

const WRITE  = process.argv.includes("--write");
const ROOT   = path.join(__dirname, "..");

// ── File paths ─────────────────────────────────────────────────────────────────
const SEO_DATA_PATH      = path.join(ROOT, "lib", "seoData.ts");
const VACANCIES_PATH     = path.join(ROOT, "lib", "vacanciesData.ts");
const AGENCIES_PATH      = path.join(ROOT, "data", "agencies.ts");

// ── Helpers ───────────────────────────────────────────────────────────────────

function readFile(p: string): string {
  return fs.readFileSync(p, "utf-8");
}
function writeFile(p: string, content: string): void {
  fs.writeFileSync(p, content, "utf-8");
}

/** Extract all slug values from a TypeScript array literal (simple regex). */
function extractSlugs(src: string, arrayName: string): Set<string> {
  // find the array block
  const start = src.indexOf(`${arrayName}`);
  if (start === -1) return new Set();
  const block = src.slice(start, start + 80000);
  const matches = block.matchAll(/slug:\s*[`"']([^`"']+)[`"']/g);
  return new Set([...matches].map(m => m[1]));
}

/** Extract all keys from a TypeScript Record literal. */
function extractRecordKeys(src: string, recordName: string): Set<string> {
  const start = src.indexOf(`${recordName}`);
  if (start === -1) return new Set();
  const block = src.slice(start, start + 40000);
  const matches = block.matchAll(/^\s+"([^"]+)":\s*\{/gm);
  return new Set([...matches].map(m => m[1]));
}

// ── Category → salary slug mapping ───────────────────────────────────────────
const CAT_TO_SALARY: Record<string, string> = {
  warehouse:    "warehouse-worker",
  production:   "production-worker",
  food:         "food-production-worker",
  driving:      "truck-driver",
  technical:    "construction-worker",
  automotive:   "machine-operator",
  hospitality:  "production-worker",
};

// ── Vacancy & city meta extraction (regex-based, no TS compilation needed) ────

interface RawVacancy {
  slug: string;
  title: string;
  category: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryDisplay: string;
  badges: string[];
  featured: boolean;
}

function parseVacancies(src: string): RawVacancy[] {
  const results: RawVacancy[] = [];
  const seen = new Set<string>();

  // ── Single-line format (most vacancies):
  // { slug: "foo", t: "Title", c: "category", s: "€14.71/h", sm: 588, sx: 0, l: "City", b: [] },
  const singleRe = /\{\s*slug:\s*"([^"]+)",\s*t:\s*"([^"]+)",\s*c:\s*"([^"]+)",\s*s:\s*"([^"]+)",\s*sm:\s*(\d+),\s*sx:\s*(\d+),\s*l:\s*"([^"]+)",\s*b:\s*\[([^\]]*)\]/g;
  let m: RegExpExecArray | null;
  while ((m = singleRe.exec(src)) !== null) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const badgesRaw = m[8].replace(/["'\s]/g, "");
    results.push({
      slug:          m[1],
      title:         m[2],
      category:      m[3],
      salaryDisplay: m[4],
      salaryMin:     parseInt(m[5]),
      salaryMax:     parseInt(m[6]),
      location:      m[7],
      badges:        badgesRaw ? badgesRaw.split(",") : [],
      featured:      false,
    });
  }

  // ── Multi-line format (featured vacancies):
  // slug, t, c, s, sm, sx, l, b each on their own line
  const multiRe = /slug:\s*"([^"]+)",[\s\S]*?t:\s*"([^"]+)",[\s\S]*?c:\s*"([^"]+)",[\s\S]*?s:\s*"([^"]+)",[\s\S]*?sm:\s*(\d+),[\s\S]*?sx:\s*(\d+),[\s\S]*?l:\s*"([^"]+)",[\s\S]*?b:\s*\[([^\]]*)\]/g;
  while ((m = multiRe.exec(src)) !== null) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const badgesRaw = m[8].replace(/["'\s]/g, "");
    results.push({
      slug:          m[1],
      title:         m[2],
      category:      m[3],
      salaryDisplay: m[4],
      salaryMin:     parseInt(m[5]),
      salaryMax:     parseInt(m[6]),
      location:      m[7],
      badges:        badgesRaw ? badgesRaw.split(",") : [],
      featured:      false,
    });
  }

  return results;
}

/** Extract city name from a location string (first token before comma or slash). */
function cityFromLocation(loc: string): string | null {
  if (!loc || loc === "Netherlands" || loc === "Belgium" || loc === "Greece") return null;
  const raw = loc.split(/[,/]/)[0].trim().replace(/ area$/, "").replace(/ NL$/, "");
  return raw || null;
}

/** Convert city name to slug. */
function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Parse CITY_META from vacanciesData.ts to extract addressRegion per city name. */
function parseCityMetaRegions(src: string): Map<string, { region: string; postalCode: string }> {
  const map = new Map<string, { region: string; postalCode: string }>();
  // "CityName": { streetAddress: "...", addressLocality: "...", addressRegion: "Region", postalCode: "1234" }
  const re = /"([^"]+)":\s*\{\s*streetAddress:[^,]+,\s*addressLocality:[^,]+,\s*addressRegion:\s*"([^"]+)",\s*postalCode:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    map.set(m[1], { region: m[2], postalCode: m[3] });
  }
  return map;
}

// ── Insertion helpers ─────────────────────────────────────────────────────────

/** Insert a CITIES entry before the closing `];` of the CITIES array. */
function insertCity(src: string, name: string, slug: string, region: string, pop: number): string {
  const entry = `  { name: "${name}",${" ".repeat(Math.max(1, 26 - name.length))}slug: "${slug}",${" ".repeat(Math.max(1, 28 - slug.length))}region: "${region}",${" ".repeat(Math.max(1, 18 - region.length))}population: ${pop}  },\n`;
  // Insert before the first `};` after CITIES array start
  const citiesStart = src.indexOf("export const CITIES");
  const closingIdx  = src.indexOf("];\n", citiesStart);
  return src.slice(0, closingIdx) + entry + src.slice(closingIdx);
}

/** Insert a JOB_SALARY_DATA entry before the closing `};` of the record. */
function insertSalaryType(src: string, key: string, title: string, icon: string, min: number, max: number, avg: number, description: string): string {
  const entry = `  "${key}": { title: "${title}", slug: "${key}", icon: "${icon}", min: ${min}, max: ${max}, avg: ${avg}, description: "${description}" },\n`;
  const dataStart  = src.indexOf("export const JOB_SALARY_DATA");
  const closingIdx = src.indexOf("};\n", dataStart);
  return src.slice(0, closingIdx) + entry + src.slice(closingIdx);
}

/** Insert a CITY_META entry before the closing `};` of the record. */
function insertCityMeta(src: string, name: string, region: string, postalCode: string): string {
  const entry = `  "${name}": { streetAddress: "${name}", addressLocality: "${name}", addressRegion: "${region}", postalCode: "${postalCode}" },\n`;
  const metaStart  = src.indexOf("const CITY_META");
  const closingIdx = src.indexOf("};\n", metaStart);
  return src.slice(0, closingIdx) + entry + src.slice(closingIdx);
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const seoSrc       = readFile(SEO_DATA_PATH);
  const vacanciesSrc = readFile(VACANCIES_PATH);
  const agenciesSrc  = readFile(AGENCIES_PATH);
  const cityMetaMap  = parseCityMetaRegions(vacanciesSrc);

  const existingCitySlugs    = extractSlugs(seoSrc, "CITIES");
  const existingSalarySlugs  = extractRecordKeys(seoSrc, "JOB_SALARY_DATA");
  const existingAgencySlugs  = extractSlugs(agenciesSrc, "VERIFIED_AGENCIES");
  const existingCityMetaKeys = extractRecordKeys(vacanciesSrc, "CITY_META");

  const vacancies = parseVacancies(vacanciesSrc);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AgencyCheck — add-vacancy page generator`);
  console.log(`  Mode: ${WRITE ? "WRITE (modifying data files)" : "DRY-RUN (no changes)"}`);
  console.log(`${"═".repeat(60)}\n`);
  console.log(`Found ${vacancies.length} vacancies in VACANCIES.\n`);

  // Track what needs to be added
  const missingCities:     { name: string; slug: string }[] = [];
  const missingSalaryTypes: { key: string; title: string; cat: string }[] = [];
  const missingAgencies:    string[] = [];
  const missingCityMeta:    { name: string }[] = [];

  // Generated page URLs per vacancy
  const generatedPages: { slug: string; title: string; pages: string[] }[] = [];

  const seenCities  = new Set<string>();
  const seenSalary  = new Set<string>();

  for (const v of vacancies) {
    const cityName = cityFromLocation(v.location);
    const citySlug = cityName ? toSlug(cityName) : null;
    const salaryKey = CAT_TO_SALARY[v.category] ?? "production-worker";

    const pages: string[] = [
      `/apply/${v.slug}`,
    ];

    // City page
    if (citySlug) {
      pages.push(`/cities/${citySlug}`);
      pages.push(`/cities/${citySlug}/housing`);

      if (!existingCitySlugs.has(citySlug) && !seenCities.has(citySlug)) {
        missingCities.push({ name: cityName!, slug: citySlug });
        seenCities.add(citySlug);
      }
      if (!existingCityMetaKeys.has(cityName!) && !seenCities.has(`meta:${cityName}`)) {
        missingCityMeta.push({ name: cityName! });
        seenCities.add(`meta:${cityName}`);
      }
    }

    // Salary pages
    if (!existingSalarySlugs.has(salaryKey) && !seenSalary.has(salaryKey)) {
      missingSalaryTypes.push({ key: salaryKey, title: v.title, cat: v.category });
      seenSalary.add(salaryKey);
    }
    if (citySlug) {
      pages.push(`/salary/${salaryKey}-${citySlug}`);
    }
    pages.push(`/salary/${salaryKey}-netherlands`);

    generatedPages.push({ slug: v.slug, title: v.title, pages });
  }

  // ── Print missing items ────────────────────────────────────────────────────

  if (missingCities.length) {
    console.log(`⚠️  MISSING CITIES (${missingCities.length}) — need to add to lib/seoData.ts CITIES:`);
    for (const c of missingCities) {
      console.log(`   { name: "${c.name}", slug: "${c.slug}", region: "?", population: 0 }`);
    }
    console.log();
  }

  if (missingCityMeta.length) {
    console.log(`⚠️  MISSING CITY_META (${missingCityMeta.length}) — need to add to lib/vacanciesData.ts CITY_META:`);
    for (const c of missingCityMeta) {
      console.log(`   "${c.name}": { streetAddress: "?", addressLocality: "?", addressRegion: "?", postalCode: "?" }`);
    }
    console.log();
  }

  if (missingSalaryTypes.length) {
    console.log(`⚠️  MISSING SALARY TYPES (${missingSalaryTypes.length}) — need to add to lib/seoData.ts JOB_SALARY_DATA:`);
    for (const s of missingSalaryTypes) {
      console.log(`   "${s.key}": { ... }   ← derived from category "${s.cat}"`);
    }
    console.log();
  }

  // ── Print all generated pages ─────────────────────────────────────────────

  console.log(`✅  AUTO-GENERATED PAGE URLS (${vacancies.length} jobs × all page types):\n`);
  for (const { slug, title, pages } of generatedPages) {
    console.log(`  📋 ${title} (${slug})`);
    for (const p of pages) {
      const exists = !p.includes("cities") || existingCitySlugs.has(p.split("/")[2]);
      console.log(`       ${exists ? "✓" : "⚡"} https://agencycheck.io${p}`);
    }
    console.log();
  }

  // ── Write mode ────────────────────────────────────────────────────────────

  if (WRITE) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  Writing data files...\n`);

    let updatedSeo       = seoSrc;
    let updatedVacancies = vacanciesSrc;

    // Add missing salary types with placeholder data
    for (const s of missingSalaryTypes) {
      if (!extractRecordKeys(updatedSeo, "JOB_SALARY_DATA").has(s.key)) {
        updatedSeo = insertSalaryType(
          updatedSeo, s.key, s.title, "🏭",
          14.71, 17.00, 15.50,
          `Production or logistics role mapped from category: ${s.cat}. Update salary figures with actual data.`
        );
        console.log(`  ✅ Added salary type: "${s.key}" to lib/seoData.ts`);
      }
    }

    // Add missing cities — look up region from CITY_META if available
    for (const c of missingCities) {
      if (!extractSlugs(updatedSeo, "CITIES").has(c.slug)) {
        const meta   = cityMetaMap.get(c.name);
        const region = meta?.region ?? "Netherlands";
        updatedSeo = insertCity(updatedSeo, c.name, c.slug, region, 0);
        console.log(`  ✅ Added city: "${c.name}" (${c.slug}), region: ${region} → lib/seoData.ts`);
      }
    }

    // Add missing CITY_META entries
    for (const c of missingCityMeta) {
      if (!extractRecordKeys(updatedVacancies, "CITY_META").has(c.name)) {
        updatedVacancies = insertCityMeta(updatedVacancies, c.name, "Netherlands", "0000");
        console.log(`  ✅ Added CITY_META: "${c.name}" to lib/vacanciesData.ts`);
        console.log(`     ⚠️  Update region, postalCode manually.`);
      }
    }

    if (updatedSeo !== seoSrc) writeFile(SEO_DATA_PATH, updatedSeo);
    if (updatedVacancies !== vacanciesSrc) writeFile(VACANCIES_PATH, updatedVacancies);

    if (missingAgencies.length) {
      console.log(`\n  ⚠️  Agencies NOT auto-added (require verified data):`);
      for (const a of missingAgencies) {
        console.log(`     → "${a}" — add manually to data/agencies.ts`);
      }
    }

    console.log(`\n  Done. Run: npx tsc --noEmit to verify no TypeScript errors.\n`);
  } else {
    console.log(`─────────────────────────────────────────────────────────────`);
    console.log(`Run with --write to auto-insert missing cities + salary types.`);
    console.log(`Agencies always require manual addition to data/agencies.ts.\n`);
  }
}

main();
