# AgencyCheck — Prisma Schema Migration Notes

## Schema v6 additions — Payout tracking (2026-03-28)

**Run after pulling this update:**
```bash
npx prisma db push   # or: npm run db:push
```

### New Lead fields

| Field | Type | Notes |
|-------|------|-------|
| `confirmedAt` | DateTime? | When the worker was confirmed as started at the agency |
| `workerStartDate` | DateTime? | Actual first working day (if known, may differ from confirmedAt) |
| `payoutAmount` | Float? | Agreed or received fee in EUR (e.g. 150.00) |
| `paidAt` | DateTime? | When the agency payment was received |

### New Lead statuses

| Status | Meaning |
|--------|---------|
| `confirmed` | Worker confirmed as started — payout expected |
| `paid` | Payment received from agency |

### New API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/leads/[id]/confirm` | POST | Mark worker as started; optionally set payoutAmount |
| `/api/admin/leads/[id]/pay` | POST | Mark payout received; optionally record payoutAmount |
| `/api/admin/leads/export` | GET | Download all leads as CSV for invoicing |

---

## Running the full data pipeline

```bash
# Full pipeline: dedupe → generate TS → push schema → seed DB
npm run data:full

# Or step by step:
npm run data:pipeline      # run dedupe-pipeline.py + generate-seed-data.py
npx prisma db push         # apply schema to DB (dev / no migration history)
npm run db:seed            # seed 241 canonical agencies (idempotent)

# Dev server
npm run dev
```

## Schema v4 additions — Structured classification fields (2026-03-13)

Migration file: `prisma/migrations/20260313_v4_structured_fields/migration.sql`

### New Agency fields

| Field | Type | Notes |
|-------|------|-------|
| `agencyType` | String | Sector slug: "logistics", "healthcare", "it-tech", etc. (12 values) |
| `jobFocus` | String[] | Up to 4 job focus area slugs, e.g. `["order-picker", "forklift-driver"]` |
| `transparencyScore` | Int | 0–100 data quality score (housing, transport, website, reviews, contact) |
| `accommodation` | String | Granular housing: `"confirmed_with_deduction"` / `"not_provided"` / `"unknown"` |
| `supportedCities` | String[] | Cities this agency explicitly operates in |

### New page routes

| Route | SSG pages | Purpose |
|-------|-----------|---------|
| `/sectors` | 1 | Sector index/browse page |
| `/sectors/[sector]` | 12 | One page per active sector |
| `/sectors/[sector]/[city]` | ~300+ | Sector × city (only where agencies exist — no thin pages) |
| `/jobs` | 1 | Job type index page |
| `/jobs/[jobType]` | 12 | One page per job type (up from 9 → 12 types) |
| `/salary/[slug]` | 1,728 | 12 job types × 143 cities + 12 national pages |

### Page count breakdown (v11)

| Category | Count |
|----------|-------|
| Agency pages (`/agencies/[slug]`) | 241 |
| Agency reviews (`/agencies/[slug]/reviews`) | 241 |
| Agency jobs (`/agencies/[slug]/jobs`) | 241 |
| City pages (`/cities/[city]`) | 143 |
| City housing pages (`/cities/[city]/housing`) | 143 |
| Sector index pages (`/sectors/[sector]`) | 12 |
| Sector × city pages (`/sectors/[sector]/[city]`) | ~300+ |
| Job type pages (`/jobs/[jobType]`) | 12 |
| Salary pages (`/salary/[slug]`) | 1,728 |
| **Total** | **~3,061+** |

### Scoring logic

The `transparencyScore` (0–100) is computed per agency:

```
+20  Housing explicitly confirmed (YES or NO)
+15  Transport explicitly confirmed
+15  Has working website
+10  Has description
+10  Has contact info (email or phone)
+10  Has at least 1 worker review
+10  Source is OFFICIAL_WEBSITE
+10  Housing verification status = "verified"
−10  Per open issue report (max −30)
```

---

## Schema v2 additions (over base Next.js template)

### New enums

| Enum | Values | Used on |
|------|--------|---------|
| `Transport` | YES / NO / UNKNOWN | Agency.transport |
| `ReviewType` | ANONYMOUS / VERIFIED_WORKER | Review.reviewType |
| `VerificationStatus` | VERIFIED / WORKER_REPORTED / UNKNOWN | (JSON fields) |
| `SourceType` | ABU_REGISTER / SNCU_REGISTER / OFFICIAL_WEBSITE / WORKER_REPORTED / UNKNOWN | Agency.sourceType |

### Agency model new fields

| Field | Type | Notes |
|-------|------|-------|
| `transport` | Transport | Whether agency provides transport |
| `city` | String | Primary city |
| `cities` | String[] | All known branch cities |
| `canonicalId` | String? | Pipeline canonical_id (agency_001…) |
| `aliases` | String[] | Other names this brand was found under |
| `duplicateCount` | Int | How many raw rows were merged here |
| `confidenceScore` | Int | Merge confidence (100=singleton, 90=domain merge) |
| `sourceUrl` | String? | Where we found this agency |
| `sourceType` | SourceType | Data provenance |
| `lastCheckedAt` | DateTime? | When data was last verified |
| `jobTypes` | String? | e.g. "logistics / warehouse / production" |
| `salaryRange` | String? | e.g. "€12–€16/hr" |
| `housingVerification` | Json? | `{value, status, source_url, source_type}` |
| `transportVerification` | Json? | `{value, status, source_url, source_type}` |
| `webPages` | Json? | `{homepage, jobs, housing?, contact}` |

### Review model new fields

| Field | Type | Notes |
|-------|------|-------|
| `reviewType` | ReviewType | ANONYMOUS (default) or VERIFIED_WORKER |
| `jobTitle` | String? | Optional job title context |
| `city` | String? | Optional city context |

## Deduplication pipeline stats (2026-03-11)

- Raw rows imported: **312**
- Duplicates removed: **71**
- Canonical agencies: **241**
- Domain merge groups: **33** (same brand, multiple sub-entities)
- Fuzzy auto-merged: **0** (strict threshold ≥ 0.95)
- Review flags (manual): **5** pairs
- Housing YES: **7**
- Transport YES: **3**
- Total aliases stored: **86**

### Notable merges

| Canonical name | Raw variants merged | Signal |
|----------------|---------------------|--------|
| Driessen | Driessen Overheid, Driessen Payroll, Driessen Publiek, Driessen Uitzendbureau, Driessen Zorg & Welzijn + Plus variants (8 total) | Same domain `driessen.nl` |
| OTTO Work Force | OTTO Work Force I, III, IV | Same domain `ottoworkforce.eu` |
| Level One | Level One Payroll, Level One Uitzendbureau | Same domain `level1.nl` |
| Jigler | Jigler payroll, Jigler uitzenden | Same domain `jigler.nl` |
| Manpower | Manpower Business Services, Flexibility, Flexwork, Logistics | Same domain `manpower.nl` |
| Abeos | 7 sub-brands (Administratief, Agrarisch, Bouwflex, etc.) | Same domain `abeos.nl` |
| GTX | DEG en Egberts, Flex Franchise 1-3, Flexible Human Services | Same domain `fhs.jobs` |

### Flagged for manual review (not auto-merged)

| Pair | Score | Action |
|------|-------|--------|
| HCA Project Support ↔ Hölscher Project Support | 0.837 | Likely different companies |
| dNM Interim ↔ P&M interim-zorg | 0.818 | Different companies |
| A-Flex ↔ Flex Personeel | 0.800 | Different companies |
| AltiFlex Personeelsdiensten ↔ Axiflex | 0.800 | Different companies |
| IQ Select ↔ Select Uitzendbureau | 0.800 | Likely different companies |

## Re-running the pipeline

If you receive new agency data:
1. Replace `scripts/data/` contents are regenerated automatically
2. Run `npm run data:pipeline` to re-dedupe and regenerate TS
3. Run `npm run db:seed` to upsert into DB (idempotent)
4. The seed uses `upsert` — existing reviews and reports are preserved
