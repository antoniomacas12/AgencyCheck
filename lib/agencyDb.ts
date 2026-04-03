/**
 * agencyDb.ts
 *
 * Server-side DB helpers for agency data — used by dynamic agency pages,
 * the sitemap, and the agencies hub page.
 *
 * Agencies that don't exist in the static VERIFIED_AGENCIES dataset are called
 * "DB-only" or "worker-reported" agencies. They are created automatically by
 * the agency extraction pipeline when workers submit reviews.
 */

import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbReview {
  id:                    string;
  overallRating:         number;
  salaryRating:          number | null;
  housingRating:         number | null;
  managementRating:      number | null;
  contractClarityRating: number | null;
  transportRating:       number | null;
  salaryAccuracyRating:  number | null;
  accommodationProvided: string;
  roomType:              string;
  weeklyRent:            number | null;
  peopleInHouse:         number | null;
  wouldRecommend:        string;
  workerStatus:          string;
  experiencePeriod:      string | null;
  comment:               string | null;
  title:                 string | null;
  city:                  string | null;
  jobType:               string | null;
  issueTags:             string;
  createdAt:             Date;
  photos: {
    id:        string;
    fileUrl:   string;
    fileType:  string;
    caption:   string | null;
    sortOrder: number;
  }[];
}

export interface DbMentionReview {
  review: {
    id:            string;
    overallRating: number;
    comment:       string | null;
    createdAt:     Date;
    agency: { slug: string; name: string };
  };
  extractedName: string;
  confidence:    number;
}

export interface DbAgencyFull {
  id:              string;
  name:            string;
  slug:            string;
  description:     string | null;
  website:         string | null;
  city:            string;
  housing:         string;
  transport:       string;
  sourceType:      string;
  confidenceScore: number;
  createdAt:       Date;
  // Direct reviews submitted specifically for this agency
  directReviews: DbReview[];
  // ReviewMentions where another review text names this agency
  mentionedInReviews: DbMentionReview[];
  // Agencies that co-appear in the same reviews (for related-agencies block)
  relatedAgencies: { slug: string; name: string; count: number }[];
}

// ─── Fetch a single DB agency (with all needed relations) ─────────────────────

export async function getDbAgency(slug: string): Promise<DbAgencyFull | null> {
  try {
    const agency = await db.agency.findUnique({
      where: { slug },
      select: {
        id:              true,
        name:            true,
        slug:            true,
        description:     true,
        website:         true,
        city:            true,
        housing:         true,
        transport:       true,
        sourceType:      true,
        confidenceScore: true,
        createdAt:       true,
        reviews: {
          where:   { isPublished: true },
          orderBy: { createdAt: "desc" },
          take:    20,
          select: {
            id:                    true,
            overallRating:         true,
            salaryRating:          true,
            housingRating:         true,
            managementRating:      true,
            contractClarityRating: true,
            transportRating:       true,
            salaryAccuracyRating:  true,
            accommodationProvided: true,
            roomType:              true,
            weeklyRent:            true,
            peopleInHouse:         true,
            wouldRecommend:        true,
            workerStatus:          true,
            experiencePeriod:      true,
            comment:               true,
            title:                 true,
            city:                  true,
            jobType:               true,
            issueTags:             true,
            createdAt:             true,
            photos: {
              select:  { id: true, fileUrl: true, fileType: true, caption: true, sortOrder: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        mentions: {
          where:   { confidence: { gte: 40 } },
          orderBy: { confidence: "desc" },
          take:    20,
          select: {
            extractedName: true,
            confidence:    true,
            review: {
              select: {
                id:            true,
                overallRating: true,
                comment:       true,
                createdAt:     true,
                agency: { select: { slug: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!agency) return null;

    // Build related-agencies list: other agencies that share review-mentions
    // with this one (i.e. appeared in the same reviews as this agency)
    const relatedMap = new Map<string, { slug: string; name: string; count: number }>();
    for (const m of agency.mentions ?? []) {
      const primarySlug = m.review?.agency?.slug;
      const primaryName = m.review?.agency?.name;
      if (!primarySlug || primarySlug === slug) continue;
      const existing = relatedMap.get(primarySlug);
      if (existing) {
        existing.count++;
      } else {
        relatedMap.set(primarySlug, { slug: primarySlug, name: primaryName, count: 1 });
      }
    }
    const relatedAgencies = [...relatedMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      id:              agency.id,
      name:            agency.name,
      slug:            agency.slug,
      description:     agency.description ?? null,
      website:         agency.website ?? null,
      city:            agency.city ?? "Netherlands",
      housing:         agency.housing ?? "UNKNOWN",
      transport:       agency.transport ?? "UNKNOWN",
      sourceType:      agency.sourceType ?? "UNKNOWN",
      confidenceScore: agency.confidenceScore ?? 0,
      createdAt:       agency.createdAt,
      directReviews:   agency.reviews ?? [],
      mentionedInReviews: (agency.mentions ?? []).map((m: DbMentionReview) => ({
        review:        m.review,
        extractedName: m.extractedName,
        confidence:    m.confidence,
      })),
      relatedAgencies,
    };
  } catch (err) {
    console.error("[agencyDb.getDbAgency]", err);
    return null;
  }
}

// ─── Get all DB-only agency slugs (for sitemap) ───────────────────────────────

export async function getWorkerReportedAgencySlugs(): Promise<
  { slug: string; createdAt: Date }[]
> {
  try {
    const rows = await db.agency.findMany({
      where: { sourceType: "WORKER_REPORTED" },
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return rows ?? [];
  } catch {
    return [];
  }
}

// ─── Get recently worker-reported agencies for hub-page section ───────────────

export async function getRecentWorkerReportedAgencies(limit = 8): Promise<
  { slug: string; name: string; city: string; mentionCount: number; createdAt: Date }[]
> {
  try {
    const rows = await db.agency.findMany({
      where:   { sourceType: "WORKER_REPORTED" },
      orderBy: { createdAt: "desc" },
      take:    limit,
      select: {
        slug:      true,
        name:      true,
        city:      true,
        createdAt: true,
        _count: { select: { mentions: true } },
      },
    });
    return (rows ?? []).map((r: { slug: string; name: string; city: string; createdAt: Date; _count: { mentions: number } }) => ({
      slug:         r.slug,
      name:         r.name,
      city:         r.city ?? "Netherlands",
      mentionCount: r._count?.mentions ?? 0,
      createdAt:    r.createdAt,
    }));
  } catch {
    return [];
  }
}

// ─── Compute rating averages from DB reviews ──────────────────────────────────

export interface RatingAverages {
  overall:  number;
  salary:   number | null;
  housing:  number | null;
  mgmt:     number | null;
  contract: number | null;
  count:    number;
}

export function computeRatingAverages(reviews: DbReview[]): RatingAverages | null {
  if (reviews.length === 0) return null;
  const avg = (key: keyof DbReview) => {
    const vals = reviews
      .map((r) => r[key] as number | null)
      .filter((v): v is number => v != null && v > 0);
    return vals.length > 0 ? parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)) : null;
  };
  return {
    overall:  avg("overallRating") ?? 0,
    salary:   avg("salaryRating"),
    housing:  avg("housingRating"),
    mgmt:     avg("managementRating"),
    contract: avg("contractClarityRating"),
    count:    reviews.length,
  };
}

// ─── Agency city mentions from worker comments ────────────────────────────────

export interface DbCityMention {
  cityDisplay:    string;
  cityNormalized: string;
  mentionCount:   number;
}

/**
 * Returns the cities workers mention most for a given agency,
 * sorted by mention count descending.
 */
export async function getAgencyCityMentions(agencyId: string): Promise<DbCityMention[]> {
  try {
    const rows = await db.agencyCityMention.findMany({
      where:   { agencyId },
      orderBy: { mentionCount: "desc" },
      take:    20,
      select: {
        cityDisplay:    true,
        cityNormalized: true,
        mentionCount:   true,
      },
    });
    return rows ?? [];
  } catch {
    return [];
  }
}

// ─── Worker comments for agency+city pages ────────────────────────────────────

export interface DbAgencyCityComment {
  id:         string;
  agencyName: string;
  city:       string;
  body:       string;
  createdAt:  Date;
}

/**
 * Returns up to 20 worker comments for a specific agency+city pair,
 * sorted newest-first.
 *
 * ReviewComment only stores the display `city` field, so we normalise
 * it in JS after fetching a batch.
 */
export async function getAgencyCommentsByCity(
  agencyId:       string,
  cityNormalized: string,
): Promise<DbAgencyCityComment[]> {
  try {
    // Fetch up to 200 recent comments for this agency, then filter by city
    const rows = await db.reviewComment.findMany({
      where:   { review: { agencyId } },
      orderBy: { createdAt: "desc" },
      take:    200,
      select: { id: true, agencyName: true, city: true, body: true, createdAt: true },
    });
    return (rows ?? [])
      .filter(
        (r: DbAgencyCityComment) =>
          r.city.trim().toLowerCase().replace(/\s+/g, " ") === cityNormalized,
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

// ─── City-level worker data (for /cities/[city] augmentation) ─────────────────

export interface DbCityWorkerAgency {
  agencyId:      string;
  agencySlug:    string | null;
  agencyName:    string | null;
  cityDisplay:   string;
  mentionCount:  number;
}

export interface DbCityWorkerComment {
  id:         string;
  agencyName: string;
  city:       string;
  body:       string;
  createdAt:  Date;
  agencySlug: string | null;
  reviewId:   string;
}

export interface DbCityWorkerData {
  agencies: DbCityWorkerAgency[];
  comments: DbCityWorkerComment[];
}

/**
 * Returns agencies and recent comments for a given city (by normalized key).
 * Used to augment static city pages with real DB-sourced worker data.
 */
export async function getCityWorkerData(cityNormalized: string): Promise<DbCityWorkerData> {
  try {
    const [mentions, comments] = await Promise.all([
      db.agencyCityMention.findMany({
        where:   { cityNormalized },
        orderBy: { mentionCount: "desc" },
        take:    20,
        select: {
          agencyId:     true,
          cityDisplay:  true,
          mentionCount: true,
          agency: {
            select: { slug: true, name: true },
          },
        },
      }),
      // ReviewComment has no cityNormalized field — fetch recent ones and filter
      db.reviewComment.findMany({
        orderBy: { createdAt: "desc" },
        take:    300,
        select: {
          id:         true,
          agencyName: true,
          city:       true,
          body:       true,
          createdAt:  true,
          review: {
            select: {
              id:     true,
              agency: { select: { slug: true } },
            },
          },
        },
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agencies: DbCityWorkerAgency[] = (mentions ?? []).map((m: any) => ({
      agencyId:     m.agencyId,
      agencySlug:   m.agency?.slug ?? null,
      agencyName:   m.agency?.name ?? null,
      cityDisplay:  m.cityDisplay,
      mentionCount: m.mentionCount,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commentsList: DbCityWorkerComment[] = (comments ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((c: any) => c.city.trim().toLowerCase().replace(/\s+/g, " ") === cityNormalized)
      .slice(0, 10)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => ({
        id:         c.id,
        agencyName: c.agencyName,
        city:       c.city,
        body:       c.body,
        createdAt:  c.createdAt,
        agencySlug: c.review?.agency?.slug ?? null,
        reviewId:   c.review?.id ?? "",
      }));

    return { agencies, comments: commentsList };
  } catch {
    return { agencies: [], comments: [] };
  }
}

// ─── All agency+city pairs for sitemap ────────────────────────────────────────

export interface DbAgencyCityPair {
  agencySlug:     string;
  cityNormalized: string;
  mentionCount:   number;
  lastSeenAt:     Date;
}

/**
 * Returns all agency+city pairs from the DB that have at least `minMentions`
 * mentions. Used by the sitemap generator to discover indexable pages.
 */
export async function getAllAgencyCityPairsForSitemap(
  minMentions = 1,
): Promise<DbAgencyCityPair[]> {
  try {
    const rows = await db.agencyCityMention.findMany({
      where:   { mentionCount: { gte: minMentions } },
      orderBy: { lastSeenAt: "desc" },
      select: {
        cityNormalized: true,
        mentionCount:   true,
        lastSeenAt:     true,
        agency: { select: { slug: true } },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rows ?? [])
      .filter((r: any) => r.agency?.slug)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any) => ({
        agencySlug:     r.agency.slug as string,
        cityNormalized: r.cityNormalized as string,
        mentionCount:   r.mentionCount as number,
        lastSeenAt:     r.lastSeenAt as Date,
      }));
  } catch {
    return [];
  }
}

// ─── Extract topic signals from review text ───────────────────────────────────
// Returns which topics workers mention most in their comments.
// Used to populate "What workers mention most" block without inventing data.

export interface TopicSignal {
  topic: string;
  label: string;
  count: number;
}

const TOPIC_PATTERNS: { topic: string; label: string; patterns: RegExp[] }[] = [
  {
    topic:    "housing",
    label:    "Housing & accommodation",
    patterns: [/\b(house|housing|accommodation|room|huis|kamer|cazare|zakwaterowanie)\b/i],
  },
  {
    topic:    "salary",
    label:    "Salary & pay",
    patterns: [/\b(salary|salari|pay|wage|loon|betaling|wynagrodzenie|salariu|money|euro|hour|uur)\b/i],
  },
  {
    topic:    "transport",
    label:    "Transport",
    patterns: [/\b(bus|transport|shuttle|travel|commute|rijden|auto|vervoer|dojazd)\b/i],
  },
  {
    topic:    "contract",
    label:    "Contract & paperwork",
    patterns: [/\b(contract|overeenkomst|umowa|agreement|paperwork|documents|belasting|tax)\b/i],
  },
  {
    topic:    "management",
    label:    "Management & communication",
    patterns: [/\b(manager|management|supervisor|recruiter|contact|communicate|behandeling|behandeld)\b/i],
  },
];

export function extractTopicSignals(reviews: DbReview[]): TopicSignal[] {
  const counts: Record<string, number> = {};
  for (const r of reviews) {
    if (!r.comment) continue;
    for (const { topic, patterns } of TOPIC_PATTERNS) {
      if (patterns.some((p) => p.test(r.comment!))) {
        counts[topic] = (counts[topic] ?? 0) + 1;
      }
    }
  }
  return TOPIC_PATTERNS
    .map(({ topic, label }) => ({ topic, label, count: counts[topic] ?? 0 }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}
