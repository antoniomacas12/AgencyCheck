/**
 * AgencyCheck — Prisma Seed Script v6
 * Seeds 127 research-verified agencies + ~392 job listings + ~97 worker reviews.
 *
 * Features:
 *   - Idempotent: uses upsert (safe to re-run)
 *   - Preserves existing salary reports and issue reports
 *   - Updates reviews if they already exist (matched by agencyId + createdAt + title)
 *   - Detailed progress output
 *
 * Run:
 *   npx prisma db seed
 *   — or —
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";
import { VERIFIED_AGENCIES }  from "../data/agencies";
import { JOB_LISTINGS }       from "../lib/jobData";
import { REVIEW_SEED_DATA }   from "../lib/reviewData";

const prisma = new PrismaClient();

// All enum helpers now return plain strings (SQLite has no native enum support)
function toHousingEnum(v: string): string {
  if (v === "YES") return "YES";
  if (v === "NO")  return "NO";
  return "UNKNOWN";
}

function toTransportEnum(v: string): string {
  if (v === "YES") return "YES";
  if (v === "NO")  return "NO";
  return "UNKNOWN";
}

function toHousingTypeEnum(v: string): string {
  const valid = new Set(["SHARED_HOUSE", "PRIVATE_ROOM", "STUDIO", "APARTMENT", "UNKNOWN"]);
  const upper = v?.toUpperCase();
  return valid.has(upper) ? upper : "UNKNOWN";
}

function toSourceTypeEnum(v: string): string {
  const valid = new Set(["ABU_REGISTER", "SNCU_REGISTER", "OFFICIAL_WEBSITE", "WORKER_REPORTED", "UNKNOWN"]);
  const upper = v?.toUpperCase();
  return valid.has(upper) ? upper : "UNKNOWN";
}

function toReviewTypeEnum(v: string): string {
  return v === "VERIFIED_WORKER" ? "VERIFIED_WORKER" : "ANONYMOUS";
}

function toVerificationStatusEnum(v: string): string {
  const valid = new Set(["VERIFIED", "WORKER_REPORTED", "UNKNOWN"]);
  const upper = v?.toUpperCase();
  return valid.has(upper) ? upper : "UNKNOWN";
}

async function main() {
  console.log("🌱 AgencyCheck database seed v6");
  console.log(`   Agencies to upsert:     ${VERIFIED_AGENCIES.length}`);
  console.log(`   Job listings to upsert: ${JOB_LISTINGS.length}`);
  console.log(`   Reviews to upsert:      ${REVIEW_SEED_DATA.length}`);
  console.log("   Mode: UPSERT — safe to re-run, preserves existing salary/issue reports\n");

  const startTime = Date.now();

  // ── Phase 1: Seed agencies ──────────────────────────────────────────────
  console.log("── Phase 1: Agencies ──────────────────────────────");
  let agencyCreated = 0, agencyUpdated = 0, agencyErrors = 0;
  const agencyIdMap: Record<string, string> = {};

  for (const agency of VERIFIED_AGENCIES) {
    try {
      // ── v6: All fields are research-verified — no inference needed ────────
      const housingStr: "YES" | "NO" | "UNKNOWN" =
        agency.accommodation === "not_provided" ? "NO" :
        agency.accommodation === "unknown"      ? "UNKNOWN" : "YES";

      const cityStr    = agency.city ?? "Amsterdam";
      const citiesArr  = agency.supportedCities.length > 0
        ? agency.supportedCities
        : [cityStr.toLowerCase().replace(/\s+/g, "-")];

      // SQLite stores arrays/objects as JSON strings — stringify all such fields
      const agencyData = {
        name:         agency.name,
        slug:         agency.slug,
        description:  agency.description,
        website:      agency.website,
        email:        agency.email,
        phone:        agency.phone,
        housing:      toHousingEnum(housingStr),
        housingType:  "UNKNOWN",
        transport:    "UNKNOWN",
        city:         cityStr,
        cities:       JSON.stringify(citiesArr),
        jobTypes:     agency.jobFocus.length > 0 ? agency.jobFocus.join(", ") : null,
        salaryRange:  null,
        canonicalId:  `agency_v${agency.id.toString().padStart(3, "0")}`,
        aliases:      JSON.stringify([]),
        duplicateCount:  1,
        confidenceScore: agency.transparencyScore,
        sourceUrl:    agency.website,
        sourceType:   toSourceTypeEnum(agency.sourceType),
        webPages:     JSON.stringify(agency.website ? { homepage: agency.website } : {}),
        housingVerification:   JSON.stringify({
          value:       housingStr,
          status:      agency.accommodation === "unknown" ? "unknown" : "verified",
          source_url:  agency.website ?? "",
          source_type: agency.sourceType,
        }),
        transportVerification: JSON.stringify({
          value:       "UNKNOWN",
          status:      "unknown",
          source_url:  agency.website ?? "",
          source_type: agency.sourceType,
        }),
        lastCheckedAt: new Date("2026-03-14"),
        // v4 structured fields (research-verified)
        agencyType:        agency.agencyType,
        jobFocus:          JSON.stringify(agency.jobFocus),
        transparencyScore: agency.transparencyScore,
        accommodation:     agency.accommodation,
        supportedCities:   JSON.stringify(citiesArr),
      };

      const existing = await prisma.agency.findUnique({ where: { slug: agency.slug } });

      const result = await prisma.agency.upsert({
        where:  { slug: agency.slug },
        create: agencyData,
        update: {
          name:         agencyData.name,
          description:  agencyData.description,
          website:      agencyData.website,
          housing:      agencyData.housing,
          housingType:  agencyData.housingType,
          transport:    agencyData.transport,
          city:         agencyData.city,
          cities:       agencyData.cities,
          jobTypes:     agencyData.jobTypes,
          salaryRange:  agencyData.salaryRange,
          canonicalId:  agencyData.canonicalId,
          aliases:      agencyData.aliases,
          duplicateCount:  agencyData.duplicateCount,
          confidenceScore: agencyData.confidenceScore,
          sourceUrl:    agencyData.sourceUrl,
          sourceType:   agencyData.sourceType,
          webPages:     agencyData.webPages,
          housingVerification:   agencyData.housingVerification,
          transportVerification: agencyData.transportVerification,
          lastCheckedAt:         agencyData.lastCheckedAt,
          // v4 structured fields
          agencyType:            agencyData.agencyType,
          jobFocus:              agencyData.jobFocus,
          transparencyScore:     agencyData.transparencyScore,
          accommodation:         agencyData.accommodation,
          supportedCities:       agencyData.supportedCities,
        },
      });

      agencyIdMap[agency.slug] = result.id;

      await prisma.agencyScore.upsert({
        where:  { agencyId: result.id },
        create: { agencyId: result.id, score: 100 },
        update: {},
      });

      existing ? agencyUpdated++ : agencyCreated++;
    } catch (err) {
      agencyErrors++;
      console.error(`  ✗ Agency: ${agency.slug}`, err);
    }
  }

  console.log(`  Created: ${agencyCreated}  Updated: ${agencyUpdated}  Errors: ${agencyErrors}`);

  // ── Phase 2: Seed job listings ──────────────────────────────────────────
  console.log("\n── Phase 2: Job Listings ──────────────────────────");
  let jobCreated = 0, jobUpdated = 0, jobSkipped = 0, jobErrors = 0;

  for (const job of JOB_LISTINGS) {
    const agencyId = agencyIdMap[job.agencySlug];
    if (!agencyId) {
      jobSkipped++;
      continue;
    }
    try {
      const jobData = {
        slug:        job.slug,
        title:       job.title,
        jobType:     job.jobType,
        description: job.description,
        city:        job.city,
        agencyId,
        salaryMin:   job.salaryMin,
        salaryMax:   job.salaryMax,
        housing:     toHousingEnum(job.housing),
        transport:   toTransportEnum(job.transport),
        isActive:    job.isActive,
      };

      const existing = await prisma.jobListing.findUnique({ where: { slug: job.slug } });

      await prisma.jobListing.upsert({
        where:  { slug: job.slug },
        create: jobData,
        update: {
          title:       jobData.title,
          jobType:     jobData.jobType,
          description: jobData.description,
          city:        jobData.city,
          salaryMin:   jobData.salaryMin,
          salaryMax:   jobData.salaryMax,
          housing:     jobData.housing,
          transport:   jobData.transport,
          isActive:    jobData.isActive,
        },
      });

      existing ? jobUpdated++ : jobCreated++;
    } catch (err) {
      jobErrors++;
      console.error(`  ✗ Job: ${job.slug}`, err);
    }
  }

  console.log(`  Created: ${jobCreated}  Updated: ${jobUpdated}  Skipped: ${jobSkipped}  Errors: ${jobErrors}`);

  // ── Phase 3: Seed reviews ──────────────────────────────────────────────
  console.log("\n── Phase 3: Reviews ───────────────────────────────");
  let reviewCreated = 0, reviewSkipped = 0, reviewErrors = 0;

  for (const rev of REVIEW_SEED_DATA) {
    const agencyId = agencyIdMap[rev.agencySlug];
    if (!agencyId) {
      reviewSkipped++;
      continue;
    }
    try {
      // Idempotency key: agencyId + createdAt + title
      const existing = await prisma.review.findFirst({
        where: {
          agencyId,
          createdAt: new Date(rev.createdAt),
          title:     rev.title,
        },
        select: { id: true },
      });

      if (existing) {
        // Update in place — keep id, update content
        await prisma.review.update({
          where: { id: existing.id },
          data: {
            reviewType:            toReviewTypeEnum(rev.reviewType),
            title:                 rev.title,
            overallRating:         rev.overallRating,
            salaryRating:          rev.salaryRating,
            housingRating:         rev.housingRating ?? null,
            managementRating:      rev.managementRating,
            contractClarityRating: rev.contractClarityRating,
            comment:               rev.comment,
            jobTitle:              rev.jobTitle ?? null,
            city:                  rev.city ?? null,
            issueTags:             JSON.stringify(rev.issueTags || []),
            verificationStatus:    toVerificationStatusEnum(rev.verificationStatus),
            sourceType:            toSourceTypeEnum(rev.sourceType),
          },
        });
      } else {
        await prisma.review.create({
          data: {
            agencyId,
            reviewType:            toReviewTypeEnum(rev.reviewType),
            title:                 rev.title,
            overallRating:         rev.overallRating,
            salaryRating:          rev.salaryRating,
            housingRating:         rev.housingRating ?? null,
            managementRating:      rev.managementRating,
            contractClarityRating: rev.contractClarityRating,
            comment:               rev.comment,
            jobTitle:              rev.jobTitle ?? null,
            city:                  rev.city ?? null,
            issueTags:             JSON.stringify(rev.issueTags || []),
            verificationStatus:    toVerificationStatusEnum(rev.verificationStatus),
            sourceType:            toSourceTypeEnum(rev.sourceType),
            createdAt:             new Date(rev.createdAt),
          },
        });
        reviewCreated++;
      }
    } catch (err) {
      reviewErrors++;
      console.error(`  ✗ Review: ${rev.agencySlug} / "${rev.title}"`, err);
    }
  }

  console.log(`  Created: ${reviewCreated}  Skipped (no agency): ${reviewSkipped}  Errors: ${reviewErrors}`);

  // ── Summary ─────────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const [totalAgencies, housingYes, transportYes, totalJobs, activeJobs, totalReviews, verifiedReviews] = await Promise.all([
    prisma.agency.count(),
    prisma.agency.count({ where: { housing: "YES" } }),
    prisma.agency.count({ where: { transport: "YES" } }),
    prisma.jobListing.count(),
    prisma.jobListing.count({ where: { isActive: true } }),
    prisma.review.count(),
    prisma.review.count({ where: { reviewType: "VERIFIED_WORKER" } }),
  ]);

  console.log(`\n📊 Database state after seed:`);
  console.log(`   Agencies:          ${totalAgencies}`);
  console.log(`   Housing YES:       ${housingYes}`);
  console.log(`   Transport YES:     ${transportYes}`);
  console.log(`   Job listings:      ${totalJobs}`);
  console.log(`   Active jobs:       ${activeJobs}`);
  console.log(`   Reviews:           ${totalReviews}`);
  console.log(`   Verified reviews:  ${verifiedReviews}`);
  console.log(`   Elapsed:           ${elapsed}s`);

  if (agencyErrors + jobErrors + reviewErrors > 0) {
    console.warn(`\n⚠️  ${agencyErrors + jobErrors + reviewErrors} records failed.`);
    process.exit(1);
  } else {
    console.log("\n✅ Seed complete.");
  }
}

main()
  .catch((e) => { console.error("Fatal seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
