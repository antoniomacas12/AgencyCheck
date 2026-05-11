import type { MetadataRoute } from "next";
import { VERIFIED_AGENCIES } from "@/data/agencies";
import { CITIES, JOB_SALARY_DATA } from "@/lib/seoData";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_LISTINGS } from "@/lib/jobData";
import { GUIDES } from "@/lib/guideData";
import { allWorkInCombos } from "@/lib/workInSeoData";
import { getWorkerReportedAgencySlugs, getAllAgencyCityPairsForSitemap } from "@/lib/agencyDb";
import { toCitySlug } from "@/lib/cityNormalization";
import {
  filterEligibleComparisons,
  filterEligibleAgencyCityPairs,
  canGenerateAgencyCityPage,
} from "@/lib/pageEligibility";
import {
  getAllComboParams,
  SEO_JOB_TYPES,
  SEO_TOP_CITIES,
} from "@/lib/seoRoutes";
import {
  getLastReviewDates,
  getLastCityReviewDates,
} from "@/lib/reviewAggregates";
import { resolveLastmod } from "@/lib/seoPipeline";
import { AGENCY_BASE, CITY_BASE } from "@/lib/agencyI18nStrings";

// ─── Canonical base URL ───────────────────────────────────────────────────────
const BASE_URL = "https://agencycheck.io";

// ─── Sector slugs ─────────────────────────────────────────────────────────────
const SECTOR_SLUGS = [
  "logistics",
  "food-production",
  "construction",
  "healthcare",
  "it-tech",
  "transport",
  "hospitality",
  "agriculture",
  "cleaning",
  "general-staffing",
  "office-admin",
  "engineering",
] as const;

// ─── Job type slugs (from seoData) ────────────────────────────────────────────
const JOB_SLUGS = Object.keys(JOB_SALARY_DATA);

// ─── Date helpers ─────────────────────────────────────────────────────────────
const TODAY        = new Date().toISOString().split("T")[0];
const AGENCY_DATE  = "2026-03-14"; // dataset research date
const STATIC_DATE  = "2026-03-14";

// ─── Sitemap ─────────────────────────────────────────────────────────────────
// Async so we can query the DB for dynamic lastModified dates.
// Agency and city pages use the date of the most recent published review.
// All other pages use static dates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic lastmod maps (fail-safe — empty map if DB is unavailable)
  const [agencyLastMod, cityLastMod, workerReportedSlugs, dbAgencyCityPairs] = await Promise.all([
    getLastReviewDates(),
    getLastCityReviewDates(),
    getWorkerReportedAgencySlugs(),
    getAllAgencyCityPairsForSitemap(1), // threshold: at least 1 comment mentioning that city
  ]);
  // ── 1. Static core pages ──────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url:              `${BASE_URL}/`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/agencies`,
      lastModified:     AGENCY_DATE,
      changeFrequency:  "weekly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/agencies-with-housing`,
      lastModified:     AGENCY_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    // ── Job-type SEO landing pages ───────────────────────────────────────────
    {
      url:              `${BASE_URL}/jobs-with-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/warehouse-jobs-with-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/production-jobs-with-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/greenhouse-jobs-with-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/reach-truck-jobs`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/order-picker-jobs`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    // /search intentionally excluded — parameterised search-result page;
    // not indexable. noindex is set on the page directly.
    {
      url:              `${BASE_URL}/compare`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/jobs`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
    // ── Active job application pages ─────────────────────────────────────────
    {
      url:              `${BASE_URL}/apply`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/apply/reachtruck`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/apply/food-production`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/apply/production-worker-maastricht`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/apply/warehouse`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    // ── Polish job pages ─────────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/pl/oferty-pracy`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/pl/oferty-pracy/kierowca-ce`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/pl/oferty-pracy/operator-produkcji`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/pl/oferty-pracy/pracownik-produkcji-maastricht`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/pl/oferty-pracy/pracownik-magazynu`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    // ── Romanian job pages ───────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/ro/oferte-de-munca`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/ro/oferte-de-munca/sofer-ce`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/ro/oferte-de-munca/operator-productie-alimentara`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/ro/oferte-de-munca/lucrator-productie-maastricht`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/ro/oferte-de-munca/lucrator-depozit`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.82,
    },
    {
      url:              `${BASE_URL}/sectors`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.7,
    },
    // ── Randstad jobs landing page (real scraped data, updated frequently) ──
    {
      url:              `${BASE_URL}/randstad-jobs`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.8,
    },
    // ── New high-value SEO pages ──────────────────────────────────────────────
    {
      url:              `${BASE_URL}/jobs-in-netherlands`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.95,
    },
    {
      url:              `${BASE_URL}/work-in-netherlands-for-foreigners`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/otto-workforce-jobs`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/tempo-team-jobs`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.85,
    },
    // ── Agency review pages (SEO landing pages) ──────────────────────────────
    {
      url:              `${BASE_URL}/otto-workforce-review`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.88,
    },
    {
      url:              `${BASE_URL}/tempo-team-review`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.88,
    },
    {
      url:              `${BASE_URL}/covebo-review`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/randstad-review`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.88,
    },
    {
      url:              `${BASE_URL}/otto-vs-tempo-team`,
      lastModified:     TODAY,
      changeFrequency:  "weekly",
      priority:         0.87,
    },
    // ─────────────────────────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/best-agencies-with-housing-netherlands`,
      lastModified:     AGENCY_DATE,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/real-salary-netherlands-after-rent`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/guides`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    // ── New money pages (high-intent commercial + informational) ─────────────
    {
      url:              `${BASE_URL}/work-agency-netherlands`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/best-work-agencies-netherlands`,
      lastModified:     AGENCY_DATE,
      changeFrequency:  "weekly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/agency-housing-netherlands`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/jobs-in-netherlands-for-foreigners`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/real-salary-netherlands-agency-work`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/best-agencies-netherlands-for-foreigners`,
      lastModified:     AGENCY_DATE,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/warehouse-work-netherlands`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/temporary-work-netherlands-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/work-in-netherlands-with-accommodation`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    // /warehouse-jobs-netherlands-with-accommodation intentionally excluded —
    // duplicate of /warehouse-jobs-with-accommodation (canonical points there, noindex set)
    // ── Topic hub pages ───────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/salary-guides`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/housing-guides`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    // ── City job pages ────────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/jobs-amsterdam`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/jobs-rotterdam`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/jobs-eindhoven`,
      lastModified:     TODAY,
      changeFrequency:  "daily",
      priority:         0.8,
    },
    {
      url:              `${BASE_URL}/tools`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.8,
    },
    // ── Trust pages ──────────────────────────────────────────────────────────
    {
      url:              `${BASE_URL}/check-agency`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.75,
    },
    {
      url:              `${BASE_URL}/methodology`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/about`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.6,
    },
    {
      url:              `${BASE_URL}/transparency`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/privacy`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "yearly",
      priority:         0.3,
    },
    {
      url:              `${BASE_URL}/terms`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "yearly",
      priority:         0.3,
    },
    {
      url:              `${BASE_URL}/for-agencies`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.4,
    },
    {
      url:              `${BASE_URL}/share-experience`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.6,
    },
    // ── Polish SEO content pages ──────────────────────────────────────────────
    {
      url:              `${BASE_URL}/pl`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/pl/praca-z-zakwaterowaniem`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/pl/agencje-pracy-holandia`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/pl/zarobki-holandia`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    // ── Romanian SEO content pages ────────────────────────────────────────────
    {
      url:              `${BASE_URL}/ro`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "weekly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/ro/locuri-de-munca-cu-cazare`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.85,
    },
    {
      url:              `${BASE_URL}/ro/agentii-munca-olanda`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/ro/salariu-olanda`,
      lastModified:     STATIC_DATE,
      changeFrequency:  "monthly",
      priority:         0.9,
    },
  ];

  // ── 2. Agency profile pages (150+ static + DB-only worker-reported) ─────────
  // Static verified agencies get higher priority; DB-only agencies are lower
  // priority but still indexable — they have real review data.
  // Exclude any DB-only slug that already exists in VERIFIED_AGENCIES.
  const verifiedSlugsSet = new Set(VERIFIED_AGENCIES.map((a) => a.slug));

  const agencyPages: MetadataRoute.Sitemap = VERIFIED_AGENCIES.map((agency) => ({
    url:             `${BASE_URL}/agencies/${agency.slug}`,
    lastModified:    resolveLastmod(agency.slug, agencyLastMod, AGENCY_DATE),
    changeFrequency: "monthly" as const,
    priority:        agency.confidenceLevel === "high"
      ? 0.8
      : agency.confidenceLevel === "medium"
      ? 0.7
      : 0.5,
  }));

  // DB-only (worker-reported) agency pages — auto-added as workers mention new agencies.
  // lastModified = createdAt date; priority 0.5 (lower than verified agencies).
  const dbAgencyPages: MetadataRoute.Sitemap = workerReportedSlugs
    .filter((row) => !verifiedSlugsSet.has(row.slug))
    .map((row) => ({
      url:             `${BASE_URL}/agencies/${row.slug}`,
      lastModified:    row.createdAt.toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority:        0.5 as const,
    }));

  // ── 3. Agency sub-pages: /reviews and /jobs per agency ────────────────────
  // /reviews pages get the dynamic date (they change on every new review)
  // /jobs pages keep the static agency date (jobs data does not change often)
  const agencySubPages: MetadataRoute.Sitemap = VERIFIED_AGENCIES.flatMap((agency) => [
    {
      url:             `${BASE_URL}/agencies/${agency.slug}/reviews`,
      lastModified:    resolveLastmod(agency.slug, agencyLastMod, AGENCY_DATE),
      changeFrequency: "weekly" as const,
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/agencies/${agency.slug}/jobs`,
      lastModified:    AGENCY_DATE,
      changeFrequency: "weekly" as const,
      priority:        0.6,
    },
  ]);

  // ── 4. City pages (143) ───────────────────────────────────────────────────
  // lastModified = date of most recent review mentioning that city (dynamic)
  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url:             `${BASE_URL}/cities/${city.slug}`,
    lastModified:    resolveLastmod(city.slug, cityLastMod, AGENCY_DATE),
    changeFrequency: "monthly" as const,
    // Prioritise larger cities
    priority:        city.population >= 100000
      ? 0.8
      : city.population >= 30000
      ? 0.7
      : 0.5,
  }));

  // ── 5. Sector pages (12) ─────────────────────────────────────────────────
  const sectorPages: MetadataRoute.Sitemap = SECTOR_SLUGS.map((sector) => ({
    url:             `${BASE_URL}/sectors/${sector}`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // ── 6. Job type pages (12) ───────────────────────────────────────────────
  const jobPages: MetadataRoute.Sitemap = JOB_SLUGS.map((slug) => ({
    url:             `${BASE_URL}/jobs/${slug}`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // ── 6b. Individual active job listing pages ────────────────────────────────
  // Only active listings are included. Stale listings redirect to /jobs anyway.
  const activeJobListingPages: MetadataRoute.Sitemap = JOB_LISTINGS
    .filter((j) => j.isActive)
    .map((j) => ({
      url:             `${BASE_URL}/jobs/${j.slug}`,
      lastModified:    STATIC_DATE,
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));

  // ── 7. Salary pages — national only (12), not 1,728 city variants ────────
  // We include national salary pages only. City × job salary pages are
  // high-volume thin pages — including all 1,728 would dilute crawl budget.
  // Top-50-city salary pages are included for major employment hubs.
  const TOP_CITY_SLUGS = CITIES
    .filter((c) => c.population >= 50000)
    .sort((a, b) => b.population - a.population)
    .slice(0, 50)
    .map((c) => c.slug);

  const nationalSalaryPages: MetadataRoute.Sitemap = JOB_SLUGS.map((jobSlug) => ({
    url:             `${BASE_URL}/salary/${jobSlug}-netherlands`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  const topCitySalaryPages: MetadataRoute.Sitemap = JOB_SLUGS.flatMap((jobSlug) =>
    TOP_CITY_SLUGS.map((citySlug) => ({
      url:             `${BASE_URL}/salary/${jobSlug}-${citySlug}`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.5,
    }))
  );

  // ── 8. Tool pages (all 6 tools, each listed exactly once) ───────────────
  const toolPages: MetadataRoute.Sitemap = [
    "salary-calculator",
    "accommodation-costs",
    "real-income-calculator",
    "real-salary-calculator",
    "payslip-checker",
    "shift-tracker",
  ].map((tool) => ({
    url:             `${BASE_URL}/tools/${tool}`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // ── 9. Agency comparison pages (all indexed eligible pairs) ─────────────
  const comparisonPages: MetadataRoute.Sitemap = filterEligibleComparisons(ALL_AGENCIES, true)
    .map(({ a, b, overlap }) => ({
      url:             `${BASE_URL}/compare/${a.slug}-vs-${b.slug}`,
      lastModified:    AGENCY_DATE,
      changeFrequency: "monthly" as const,
      // Higher overlap = better comparison page = higher priority
      priority:        overlap.overlapScore >= 80 ? 0.7 : overlap.overlapScore >= 50 ? 0.6 : 0.5,
    }));

  // ── 10. Agency + city sub-pages (indexed only — skip noindex pairs) ─────
  const agencyCityPages: MetadataRoute.Sitemap = filterEligibleAgencyCityPairs(ALL_AGENCIES)
    .filter(({ agency, city }) => !canGenerateAgencyCityPage(agency, city).noindex)
    .map(({ agency, city }) => ({
      url:             `${BASE_URL}/agencies/${agency.slug}/${city.toLowerCase().replace(/\s+/g, "-")}`,
      lastModified:    AGENCY_DATE,
      changeFrequency: "monthly" as const,
      priority:        agency.transparencyScore >= 70 ? 0.6 : 0.5,
    }));

  // ── 10b. DB-driven agency+city pages from worker comment mentions ─────────
  // Only include pairs with at least 1 city mention. Exclude pairs already
  // covered by the static agencyCityPages above to avoid duplicate URLs.
  const staticAgencyCityUrlSet = new Set(
    agencyCityPages.map((p) => p.url),
  );
  const dbAgencyCityPages: MetadataRoute.Sitemap = dbAgencyCityPairs
    .map((pair) => ({
      url:             `${BASE_URL}/agencies/${pair.agencySlug}/${toCitySlug(pair.cityNormalized)}`,
      lastModified:    pair.lastSeenAt.toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority:        pair.mentionCount >= 3 ? 0.6 : 0.5,
    }))
    .filter((entry) => !staticAgencyCityUrlSet.has(entry.url));

  // ── 11. Programmatic city job pages (/jobs-in-[city]) ─────────────────────
  const cityJobPages: MetadataRoute.Sitemap = CITIES
    .filter((c) => c.population >= 10000)
    .map((city) => ({
      url:             `${BASE_URL}/jobs-in-${city.slug}`,
      lastModified:    TODAY,
      changeFrequency: "daily" as const,
      priority:        city.population >= 100000 ? 0.85 : city.population >= 50000 ? 0.75 : 0.65,
    }));

  // ── 12. Combo pages (/forklift-jobs-amsterdam, /warehouse-jobs-netherlands, etc.) ──
  const comboPageEntries: MetadataRoute.Sitemap = getAllComboParams().map(({ combo }) => {
    const isNational  = combo.endsWith("-netherlands");
    const hasHousing  = combo.endsWith("-with-accommodation");
    return {
      url:             `${BASE_URL}/${combo}`,
      lastModified:    TODAY,
      changeFrequency: "weekly" as const,
      priority:        isNational ? 0.8 : hasHousing ? 0.7 : 0.72,
    };
  });

  // ── 13. Guide pages (6 long-tail SEO worker guides) ───────────────────────
  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url:             `${BASE_URL}/guides/${g.slug}`,
    lastModified:    g.dateModified,
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  // ── 13b. Issue pages (worker rights issue types) ─────────────────────────
  // e.g. /issues/missing-overtime, /issues/bad-housing etc.
  // These pages were missing from the sitemap; canonical tags added to page.tsx.
  const issuePageSlugs = [
    "missing-overtime",
    "bad-housing",
    "late-payment",
    "missing-sunday-pay",
    "contract-issues",
    "underpayment",
  ];
  const issuePages: MetadataRoute.Sitemap = issuePageSlugs.map((slug) => ({
    url:             `${BASE_URL}/issues/${slug}`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  // ── 14. Work-in audience+city+job combo pages (50 pages) ──────────────────
  // 5 job types × 5 cities × 2 audiences (foreigners, students)
  const workInPages: MetadataRoute.Sitemap = allWorkInCombos().map(({ combo }) => ({
    url:             `${BASE_URL}/work-in/${combo}`,
    lastModified:    STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.75,
  }));

  // ── 15. Polish agency pages (/pl/agencje/[slug]) ───────────────────────────
  // Only include VERIFIED agencies with rich locale-specific content.
  // Worker-reported (DB-only) agencies are excluded: their locale pages are
  // thin near-duplicates of the EN page and cause "Alternative page" GSC errors.
  const plAgencyPages: MetadataRoute.Sitemap = VERIFIED_AGENCIES.map((agency) => ({
    url:             `${BASE_URL}${AGENCY_BASE.pl}/${agency.slug}`,
    lastModified:    resolveLastmod(agency.slug, agencyLastMod, AGENCY_DATE),
    changeFrequency: "monthly" as const,
    priority:        0.75,
  }));

  // ── 16. Romanian agency pages (/ro/agentii/[slug]) ────────────────────────
  // Same policy — verified agencies only for locale pages.
  const roAgencyPages: MetadataRoute.Sitemap = VERIFIED_AGENCIES.map((agency) => ({
    url:             `${BASE_URL}${AGENCY_BASE.ro}/${agency.slug}`,
    lastModified:    resolveLastmod(agency.slug, agencyLastMod, AGENCY_DATE),
    changeFrequency: "monthly" as const,
    priority:        0.72,
  }));

  // ── 17. Polish + Romanian agency+city pages ────────────────────────────────
  // REMOVED: these locale agency+city sub-pages are thin (city comments only,
  // usually empty) and produce hundreds of "Alternative page with correct
  // canonical tag" errors in Google Search Console. Pages are marked noindex
  // in their generateMetadata. EN equivalents remain in sitemap (section 10b).
  const plAgencyCityPages: MetadataRoute.Sitemap = [];
  const roAgencyCityPages: MetadataRoute.Sitemap = [];

  // ── 18. Polish + Romanian + Portuguese city pages ──────────────────────────
  // DB-driven: only cities that have at least one agency mention in the DB.
  const dbCitySlugs = [...new Set(dbAgencyCityPairs.map((p) => toCitySlug(p.cityNormalized)))];

  const plCityPages: MetadataRoute.Sitemap = dbCitySlugs.map((citySlug) => ({
    url:             `${BASE_URL}${CITY_BASE.pl}/${citySlug}`,
    lastModified:    TODAY,
    changeFrequency: "weekly" as const,
    priority:        0.6,
  }));

  const roCityPages: MetadataRoute.Sitemap = dbCitySlugs.map((citySlug) => ({
    url:             `${BASE_URL}${CITY_BASE.ro}/${citySlug}`,
    lastModified:    TODAY,
    changeFrequency: "weekly" as const,
    priority:        0.55,
  }));

  const ptCityPages: MetadataRoute.Sitemap = dbCitySlugs.map((citySlug) => ({
    url:             `${BASE_URL}${CITY_BASE.pt}/${citySlug}`,
    lastModified:    TODAY,
    changeFrequency: "weekly" as const,
    priority:        0.5,
  }));

  // ── 19. Portuguese agency pages (/pt/agencias/[slug]) ────────────────────
  // Only verified agencies — same policy as PL/RO to avoid thin duplicate pages.
  const ptAgencyPages: MetadataRoute.Sitemap = VERIFIED_AGENCIES.map((agency) => ({
    url:             `${BASE_URL}${AGENCY_BASE.pt}/${agency.slug}`,
    lastModified:    resolveLastmod(agency.slug, agencyLastMod, AGENCY_DATE),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // ── 20. Portuguese agency+city pages (/pt/agencias/[slug]/[city]) ────────
  // REMOVED: thin pages, marked noindex in generateMetadata (same as PL/RO).
  const ptAgencyCityPages: MetadataRoute.Sitemap = [];

  // ── 21. Portuguese static content pages ───────────────────────────────────
  const ptStaticPages: MetadataRoute.Sitemap = [
    {
      url:             `${BASE_URL}/pt`,
      lastModified:    STATIC_DATE,
      changeFrequency: "weekly" as const,
      priority:        0.85,
    },
    {
      url:             `${BASE_URL}/pt/trabalho-com-alojamento`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.85,
    },
    {
      url:             `${BASE_URL}/pt/agencias-trabalho-holanda`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/pt/salario-holanda`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/safety`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.5,
    },
    {
      url:             `${BASE_URL}/tools/rent-calculator`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/tools/job-offer-comparison`,
      lastModified:    STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    },
  ];

  return [
    ...corePages,
    ...agencyPages,
    ...dbAgencyPages,
    ...agencySubPages,
    ...cityPages,
    ...sectorPages,
    ...jobPages,
    ...activeJobListingPages,
    ...nationalSalaryPages,
    ...topCitySalaryPages,
    ...toolPages,
    ...comparisonPages,
    ...agencyCityPages,
    ...dbAgencyCityPages,
    ...cityJobPages,
    ...comboPageEntries,
    ...guidePages,
    ...issuePages,
    ...workInPages,
    // Multilingual pages (PL + RO + PT)
    ...plAgencyPages,
    ...roAgencyPages,
    ...ptAgencyPages,
    ...plAgencyCityPages,
    ...roAgencyCityPages,
    ...ptAgencyCityPages,
    ...plCityPages,
    ...roCityPages,
    ...ptCityPages,
    ...ptStaticPages,
    // ── /bg and /sk landing pages (exist, self-canonical, previously missing from sitemap)
    { url: `${BASE_URL}/bg`, lastModified: STATIC_DATE, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/sk`, lastModified: STATIC_DATE, changeFrequency: "monthly" as const, priority: 0.8 },
  ];
}
