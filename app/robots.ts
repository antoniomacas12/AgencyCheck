import type { MetadataRoute } from "next";

// ─── Canonical base URL ───────────────────────────────────────────────────────
const BASE_URL = "https://agencycheck.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers: allow everything except API routes and internal query strings
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",          // internal API routes — not for indexing
          "/admin/",        // admin panel — never index
          "/*?*",           // filter/query string pages (search, compare params) — avoid duplicate content
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
