import type { Metadata } from "next";
import ReviewsClientPage from "./ReviewsClientPage";
import { getLocale } from "@/lib/getLocale";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { breadcrumbSchema, reviewsHubSchema, collectionPageSchema } from "@/lib/schemaMarkup";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Worker Reviews — Employment Agencies Netherlands — AgencyCheck",
  description:
    "Real worker reviews of employment agencies in the Netherlands. Read and share experiences about housing, salary, transport, and management. Anonymous. Free.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Worker Reviews — Employment Agencies Netherlands",
    description:
      "Real worker reviews of employment agencies in the Netherlands. Read honest experiences about housing costs, salary accuracy, and working conditions.",
  },
};

export default async function ReviewsPage() {
  const locale = getLocale();
  const stats  = await getPublishedReviewStats();

  // ── JSON-LD — built server-side with live DB counts ──────────────────────
  const crumbSchema   = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Reviews", url: "/reviews" },
  ]);
  const hubSchema     = reviewsHubSchema({
    total:       stats.total,
    agencyCount: ALL_AGENCIES.length,
    avgRating:   3.2,
  });
  const listSchema    = collectionPageSchema({
    name:        `Worker Reviews — ${stats.total} Agency Reviews in the Netherlands`,
    description: `${stats.total} real worker reviews of employment agencies in the Netherlands. ${stats.verifiedCount} verified. Anonymous and safe.`,
    url:         "/reviews",
    itemCount:   stats.total,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema)  }} />
      <ReviewsClientPage
        locale={locale}
        initialTotal={stats.total}
        initialVerified={stats.verifiedCount}
      />
    </>
  );
}
