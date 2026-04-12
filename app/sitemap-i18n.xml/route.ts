/**
 * app/sitemap-i18n.xml/route.ts
 *
 * A proper XML sitemap with xhtml:link hreflang annotations for all multilingual
 * agency pages. Next.js's built-in sitemap.ts format does not support the
 * <xhtml:link rel="alternate" hreflang="..."> extension, so we generate raw XML here.
 *
 * WHY THIS MATTERS FOR INDEXATION:
 * Google accepts hreflang signals from two sources:
 *   (a) <link rel="alternate" hreflang="..."> in page <head> — already fixed in page files
 *   (b) sitemap <xhtml:link> annotations — what this file provides
 * Both signals together give Google maximum confidence to index each locale version
 * under its own canonical URL rather than treating them as duplicates.
 *
 * Sitemap index reference in robots.ts:
 *   sitemap: ["https://agencycheck.io/sitemap.xml", "https://agencycheck.io/sitemap-i18n.xml"]
 */

import { NextResponse } from "next/server";
import { VERIFIED_AGENCIES } from "@/data/agencies";
import { getWorkerReportedAgencySlugs } from "@/lib/agencyDb";
import { getLastReviewDates } from "@/lib/reviewAggregates";

const BASE  = "https://agencycheck.io";
const PATHS = {
  en: (s: string) => `${BASE}/agencies/${s}`,
  pl: (s: string) => `${BASE}/pl/agencje/${s}`,
  ro: (s: string) => `${BASE}/ro/agentii/${s}`,
  pt: (s: string) => `${BASE}/pt/agencias/${s}`,
};
const LOCALES = ["en", "pl", "ro", "pt", "x-default"] as const;

function xhtmlLinks(slug: string): string {
  const alts = [
    { hreflang: "en",        href: PATHS.en(slug) },
    { hreflang: "pl",        href: PATHS.pl(slug) },
    { hreflang: "ro",        href: PATHS.ro(slug) },
    { hreflang: "pt",        href: PATHS.pt(slug) },
    { hreflang: "x-default", href: PATHS.en(slug) },
  ];
  return alts
    .map(
      ({ hreflang, href }) =>
        `      <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`,
    )
    .join("\n");
}

function urlBlock(loc: string, lastmod: string, links: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
${links}
  </url>`;
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Regenerate at most once per hour

export async function GET() {
  const FALLBACK = "2026-03-14";

  // Fetch dynamic last-modified dates
  const [agencyLastMod, workerRows] = await Promise.all([
    getLastReviewDates().catch(() => new Map<string, string>()),
    getWorkerReportedAgencySlugs().catch(() => [] as { slug: string; createdAt: Date }[]),
  ]);

  const verifiedSlugs = VERIFIED_AGENCIES.map((a) => a.slug);
  const verifiedSet   = new Set(verifiedSlugs);

  const workerSlugs = workerRows
    .filter((r: { slug: string; createdAt: Date }) => !verifiedSet.has(r.slug))
    .map((r: { slug: string; createdAt: Date }) => ({
      slug:    r.slug,
      lastmod: r.createdAt.toISOString().split("T")[0],
    }));

  // Build all URL blocks — one per locale per slug
  const blocks: string[] = [];

  for (const slug of verifiedSlugs) {
    const lastmod = agencyLastMod.get(slug) ?? FALLBACK;
    const links   = xhtmlLinks(slug);
    for (const locale of (["en", "pl", "ro", "pt"] as const)) {
      blocks.push(urlBlock(PATHS[locale](slug), lastmod, links));
    }
  }

  for (const { slug, lastmod } of workerSlugs) {
    const links = xhtmlLinks(slug);
    for (const locale of (["en", "pl", "ro", "pt"] as const)) {
      blocks.push(urlBlock(PATHS[locale](slug), lastmod, links));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
