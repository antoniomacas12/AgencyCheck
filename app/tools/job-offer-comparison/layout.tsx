import type { Metadata } from "next";

/**
 * layout.tsx — Job Offer Comparison Calculator
 *
 * Metadata is defined here (layout level) for consistency with other tool
 * pages. JSON-LD schema markup is emitted in page.tsx alongside the client
 * component, ensuring schema is co-located with the page that renders it.
 */

export const metadata: Metadata = {
  title: "Job Offer Comparison Calculator Netherlands 2026 — Which Offer Pays More?",
  description:
    "Compare two Dutch job offers side by side. Real take-home pay after loonheffing, housing deductions, transport, and healthcare. Find out which offer actually leaves you with more money.",
  alternates: { canonical: "https://agencycheck.io/tools/job-offer-comparison" },
  openGraph: {
    title: "Compare Two Dutch Job Offers — Real Take-Home Pay Calculator 2026",
    description:
      "Enter two job offers and see which one leaves you with more money after Dutch income tax, agency housing deductions, transport costs, and healthcare.",
  },
};

export default function JobOfferComparisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
