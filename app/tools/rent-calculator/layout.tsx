import type { Metadata } from "next";

/**
 * layout.tsx — Rent Calculator
 *
 * Metadata is defined here (layout level) for consistency with other tool
 * pages. JSON-LD schema markup is emitted in page.tsx alongside the client
 * component, ensuring schema is co-located with the page that renders it.
 */

export const metadata: Metadata = {
  title: "Netherlands Rent Calculator 2026 — Huurtoeslag & Affordable Rent Check",
  description:
    "Check if your Dutch rent is affordable, estimate huurtoeslag (rent allowance) eligibility, and verify 2026 legal rent limits. Includes WWS sector check for social vs free-market housing.",
  alternates: { canonical: "https://agencycheck.io/tools/rent-calculator" },
  openGraph: {
    title: "Netherlands Rent Calculator 2026 — Is My Rent Affordable?",
    description:
      "Check Dutch rent affordability, huurtoeslag eligibility, and whether your rent is within 2026 legal limits. Free calculator for flex workers and expats.",
  },
};

export default function RentCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
