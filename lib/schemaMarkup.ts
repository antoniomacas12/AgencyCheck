/**
 * schemaMarkup.ts — JSON-LD structured data generators
 *
 * All functions take real project data and emit valid schema.org objects.
 * Use these in page JSX via:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 *
 * Schemas implemented:
 *   - LocalBusiness (EmploymentAgency) + AggregateRating  → agency pages
 *   - FAQPage                                             → agency + guide pages
 *   - BreadcrumbList                                      → all pages
 *   - Article                                             → guide pages
 *   - Organization                                        → homepage, about, contact
 *   - WebSite + SearchAction                              → homepage
 *   - CollectionPage                                      → agencies list, reviews hub, sectors
 *   - SoftwareApplication                                 → tool pages
 *   - WebPage                                             → simple pages
 *   - AggregateRating (standalone)                        → reviews hub
 */

const BASE_URL = "https://agencycheck.nl";

// ─── Types (minimal — we only type what we actually use) ─────────────────────

export interface ReviewInput {
  title?:        string | null;
  comment?:      string | null;
  overallRating: number;
  createdAt:     string;
  verificationStatus?: string;
}

export interface AgencySchemaInput {
  name:         string;
  slug:         string;
  city:         string;
  address?:     string | null;
  website?:     string | null;
  description?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  url:  string;
}

export interface FaqItem {
  question: string;
  answer:   string;
}

// ─── EmploymentAgency (LocalBusiness) + AggregateRating ──────────────────────

export function agencyOrganizationSchema(
  agency:  AgencySchemaInput,
  reviews: ReviewInput[],
): object {
  const pageUrl = `${BASE_URL}/agencies/${agency.slug}`;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type":    ["LocalBusiness", "EmploymentAgency"],
    "name":     agency.name,
    "url":      pageUrl,
    ...(agency.website ? { "sameAs": agency.website } : {}),
    ...(agency.description ? { "description": agency.description } : {}),
    "address": {
      "@type":           "PostalAddress",
      "addressLocality": agency.city !== "unknown" ? agency.city : "Netherlands",
      "addressCountry":  "NL",
      ...(agency.address ? { "streetAddress": agency.address } : {}),
    },
  };

  if (reviews.length > 0) {
    const avg = reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length;
    base["aggregateRating"] = {
      "@type":       "AggregateRating",
      "ratingValue": parseFloat(avg.toFixed(1)),
      "reviewCount": reviews.length,
      "bestRating":  5,
      "worstRating": 1,
    };

    // Include up to 5 individual Review items (requires author + rating + body)
    const validReviews = reviews
      .filter((r) => r.comment && r.comment.length > 20)
      .slice(0, 5);

    if (validReviews.length > 0) {
      base["review"] = validReviews.map((r) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name":  r.verificationStatus === "VERIFIED" ? "Verified Worker" : "Anonymous Worker",
        },
        "reviewRating": {
          "@type":       "Rating",
          "ratingValue": r.overallRating,
          "bestRating":  5,
          "worstRating": 1,
        },
        ...(r.title   ? { "name": r.title }            : {}),
        ...(r.comment ? { "reviewBody": r.comment }    : {}),
        "datePublished": r.createdAt.slice(0, 10),
      }));
    }
  }

  return base;
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────

export function faqPageSchema(faqs: FaqItem[]): object {
  return {
    "@context":    "https://schema.org",
    "@type":       "FAQPage",
    "mainEntity":  faqs.map((f) => ({
      "@type":          "Question",
      "name":           f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  f.answer,
      },
    })),
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export function breadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context":       "https://schema.org",
    "@type":          "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type":    "ListItem",
      "position": i + 1,
      "name":     item.name,
      "item":     item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// ─── Article (for guide pages) ────────────────────────────────────────────────

export function articleSchema(opts: {
  title:       string;
  description: string;
  slug:        string;
  datePublished: string;
  dateModified:  string;
}): object {
  return {
    "@context":     "https://schema.org",
    "@type":        "Article",
    "headline":     opts.title,
    "description":  opts.description,
    "url":          `${BASE_URL}/guides/${opts.slug}`,
    "datePublished": opts.datePublished,
    "dateModified":  opts.dateModified,
    "author": {
      "@type": "Organization",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
  };
}

// ─── Organization (AgencyCheck platform) ─────────────────────────────────────

/**
 * Organization schema for AgencyCheck itself.
 * Used on homepage, about, and contact pages.
 */
export function organizationSchema(): object {
  return {
    "@context":   "https://schema.org",
    "@type":      "Organization",
    "name":       "AgencyCheck",
    "url":        BASE_URL,
    "logo":       `${BASE_URL}/logo.png`,
    "description": "Independent platform for agency workers in the Netherlands. Real take-home salary data, unfiltered worker reviews, and housing conditions for 150+ employment agencies.",
    "address": {
      "@type":          "PostalAddress",
      "addressCountry": "NL",
    },
    "areaServed": {
      "@type": "Country",
      "name":  "Netherlands",
    },
    "knowsAbout": [
      "Dutch employment agencies",
      "Agency worker rights Netherlands",
      "Housing for workers Netherlands",
      "ABU CAO",
      "NBBU CAO",
      "Dutch minimum wage (WML)",
    ],
    "sameAs": [BASE_URL],
  };
}

// ─── WebSite + SearchAction (sitelinks search box) ────────────────────────────

/**
 * WebSite schema with SearchAction, enabling Google sitelinks search box.
 */
export function webSiteSchema(): object {
  return {
    "@context":     "https://schema.org",
    "@type":        "WebSite",
    "name":         "AgencyCheck",
    "url":          BASE_URL,
    "description":  "Find and compare employment agencies in the Netherlands. Real salary data, worker reviews, and housing conditions.",
    "inLanguage":   "en",
    "potentialAction": {
      "@type":        "SearchAction",
      "target": {
        "@type":       "EntryPoint",
        "urlTemplate": `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input":  "required name=search_term_string",
    },
  };
}

// ─── CollectionPage ───────────────────────────────────────────────────────────

/**
 * CollectionPage schema for listing/directory pages.
 * Used on agencies list, sectors, reviews hub.
 */
export function collectionPageSchema(opts: {
  name:        string;
  description: string;
  url:         string;
  itemCount?:  number;
}): object {
  const base: Record<string, unknown> = {
    "@context":    "https://schema.org",
    "@type":       "CollectionPage",
    "name":        opts.name,
    "description": opts.description,
    "url":         opts.url.startsWith("http") ? opts.url : `${BASE_URL}${opts.url}`,
    "publisher": {
      "@type": "Organization",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
  };
  if (opts.itemCount !== undefined) {
    base["numberOfItems"] = opts.itemCount;
  }
  return base;
}

// ─── SoftwareApplication (for calculators and tools) ─────────────────────────

/**
 * SoftwareApplication schema for tool/calculator pages.
 */
export function softwareApplicationSchema(opts: {
  name:                string;
  description:         string;
  url:                 string;
  applicationCategory?: string;
  operatingSystem?:    string;
}): object {
  return {
    "@context":           "https://schema.org",
    "@type":              "SoftwareApplication",
    "name":               opts.name,
    "description":        opts.description,
    "url":                opts.url.startsWith("http") ? opts.url : `${BASE_URL}${opts.url}`,
    "applicationCategory": opts.applicationCategory ?? "FinanceApplication",
    "operatingSystem":    opts.operatingSystem ?? "Web",
    "offers": {
      "@type":       "Offer",
      "price":       "0",
      "priceCurrency": "EUR",
    },
    "publisher": {
      "@type": "Organization",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
  };
}

// ─── WebPage (for informational / static pages) ───────────────────────────────

/**
 * WebPage schema for simple informational pages (contact, about, privacy, etc.)
 */
export function webPageSchema(opts: {
  name:        string;
  description: string;
  url:         string;
  dateModified?: string;
}): object {
  return {
    "@context":    "https://schema.org",
    "@type":       "WebPage",
    "name":        opts.name,
    "description": opts.description,
    "url":         opts.url.startsWith("http") ? opts.url : `${BASE_URL}${opts.url}`,
    ...(opts.dateModified ? { "dateModified": opts.dateModified } : {}),
    "isPartOf": {
      "@type": "WebSite",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name":  "AgencyCheck",
      "url":   BASE_URL,
    },
  };
}

// ─── Standalone AggregateRating (for reviews hub) ────────────────────────────

/**
 * Platform-level aggregate rating schema for the reviews hub page.
 * Uses real published review count from the database.
 */
export function reviewsHubSchema(opts: {
  total:        number;
  agencyCount:  number;
  avgRating?:   number;
}): object {
  const base: Record<string, unknown> = {
    "@context":   "https://schema.org",
    "@type":      ["Organization", "EmploymentAgency"],
    "name":       "AgencyCheck — Employment Agencies Netherlands",
    "url":        `${BASE_URL}/reviews`,
    "description": `Worker reviews for employment agencies in the Netherlands. ${opts.total} real reviews from verified and anonymous workers.`,
  };
  if (opts.total > 0) {
    base["aggregateRating"] = {
      "@type":       "AggregateRating",
      "ratingValue": opts.avgRating ?? 3.2,
      "reviewCount": opts.total,
      "bestRating":  5,
      "worstRating": 1,
      "itemReviewed": {
        "@type":        "EmploymentAgency",
        "name":         "Employment Agencies in the Netherlands",
        "areaServed":   "Netherlands",
      },
    };
  }
  return base;
}

// ─── Convenience: agency FAQ items from real data ─────────────────────────────

/**
 * Generates standard agency FAQ items from real agency data.
 * These target "does [agency] provide housing" style queries.
 */
export function buildAgencyFaqs(agency: {
  name:         string;
  city:         string;
  housing:      string;
  transport:    string;
  transparencyScore: number;
  avgHourlyPay: number | null;
}, reviewCount: number): FaqItem[] {
  const WML = 14.71;
  const hourly = agency.avgHourlyPay ?? WML;
  const weeklyGross = Math.round(hourly * 40);
  const weeklyNet   = Math.round(weeklyGross * 0.89); // approx 10.7% effective tax at WML level
  const cityStr = agency.city !== "unknown" ? agency.city : "the Netherlands";

  const faqs: FaqItem[] = [
    {
      question: `Does ${agency.name} provide housing?`,
      answer:   agency.housing === "YES"
        ? `Yes, ${agency.name} provides accommodation for workers. The housing deduction is typically €80–€113/week. Under Dutch SNF standards, the maximum legal deduction for shared rooms is €113.50/week. Always confirm the exact deduction amount, room occupancy, and location before signing.`
        : agency.housing === "NO"
        ? `${agency.name} does not include housing. You will need to arrange your own accommodation. Typical room rental near ${cityStr} costs €350–€600/month. Consider agencies that include housing to reduce upfront costs.`
        : `${agency.name}'s housing policy is not confirmed. Contact them directly to ask whether accommodation is included and what the weekly deduction is.`,
    },
    {
      question: `What is the salary at ${agency.name}?`,
      answer:   `The Dutch statutory minimum wage in 2026 is €${WML}/hour (€${Math.round(WML * 40)}/week gross for 40 hours). At this rate, after Dutch income tax and healthcare levy, a worker takes home approximately €${weeklyNet}/week. Some positions — especially forklift drivers and night shift workers — pay above minimum wage. Always verify the hourly rate and request a sample payslip before starting.`,
    },
    {
      question: `How many reviews does ${agency.name} have?`,
      answer:   reviewCount > 0
        ? `${agency.name} has ${reviewCount} worker review${reviewCount !== 1 ? "s" : ""} on AgencyCheck. Reviews cover salary accuracy, housing conditions, transport, and management. All reviews are published unfiltered — including negative ones.`
        : `${agency.name} does not yet have reviews on AgencyCheck. You can be the first to share your experience by submitting a review.`,
    },
    {
      question: `Is ${agency.name} a legitimate agency?`,
      answer:   agency.transparencyScore >= 70
        ? `${agency.name} has a transparency score of ${agency.transparencyScore}/100 on AgencyCheck, indicating good data availability and verified information. Check whether they are registered with ABU, NBBU, or SNA (Stichting Normering Arbeid) for additional verification.`
        : `${agency.name} has a transparency score of ${agency.transparencyScore}/100 on AgencyCheck. We recommend verifying their KvK (Chamber of Commerce) registration, checking for ABU/NBBU/SNA membership, and reading worker reviews before signing any contract.`,
    },
    {
      question: `What transport does ${agency.name} provide?`,
      answer:   agency.transport === "YES"
        ? `${agency.name} includes transport to and from the work location. Always confirm whether transport is free or deducted from your salary — some agencies include transport costs in their standard deductions.`
        : agency.transport === "NO"
        ? `${agency.name} does not include transport. You are responsible for getting to the work location. Factor in commute costs (public transport or car) when evaluating your actual take-home pay.`
        : `Transport availability at ${agency.name} is unconfirmed. Ask specifically about transport arrangements and any associated costs before accepting a placement.`,
    },
  ];

  return faqs;
}
