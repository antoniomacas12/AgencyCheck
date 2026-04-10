import type { Metadata } from "next";

/**
 * /reviews/submit — utility form page (accepts ?agency= query param).
 *
 * noindex: the parameterised URL variants (e.g. /reviews/submit?agency=randstad)
 * would otherwise be indexed as thin duplicate pages. The form itself is
 * not a standalone piece of indexable SEO content.
 */
export const metadata: Metadata = {
  title: "Write a Review — AgencyCheck",
  description:
    "Share your experience working with a Dutch employment agency. Tell other workers about salary, housing, and how you were treated.",
  robots: { index: false, follow: false },
};

export default function ReviewSubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
