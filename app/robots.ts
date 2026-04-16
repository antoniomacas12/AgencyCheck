import type { MetadataRoute } from "next";

// ─── Canonical base URL ───────────────────────────────────────────────────────
const BASE_URL = "https://agencycheck.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers: allow everything except API routes and admin
        // NOTE: We do NOT disallow /*?* here. Blocking all query-string URLs
        // prevents Googlebot from reading canonical tags on those URLs and
        // was causing "Blocked by robots.txt" errors in Search Console for
        // legitimate agency pages reached via tracking-parameter backlinks.
        // Duplicate-content from query params is handled by canonical tags instead.
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",    // internal API routes — not for indexing
          "/admin/",  // admin panel — never index
        ],
      },
      {
        // Block GPTBot (OpenAI) from scraping agency data for training
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // Block CCBot (Common Crawl training data)
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        // Block Anthropic's Claude crawler (ClaudeBot is the current UA string)
        userAgent: "ClaudeBot",
        disallow: "/",
      },
    ],
    // Two sitemaps:
    //  1. sitemap.xml        — all canonical URLs (existing)
    //  2. sitemap-i18n.xml   — agency pages with xhtml:link hreflang annotations
    //     This gives Google explicit cross-locale signals and stops it treating
    //     translated agency pages as duplicates of the English version.
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-i18n.xml`,
    ],
    host: BASE_URL,
  };
}
