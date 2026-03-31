import type { Metadata } from "next";
import ReviewsClientPage from "./ReviewsClientPage";
import { getLocale } from "@/lib/getLocale";
import { getPublishedReviewStats } from "@/lib/reviewStats";

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

  return (
    <ReviewsClientPage
      locale={locale}
      initialTotal={stats.total}
      initialVerified={stats.verifiedCount}
    />
  );
}
