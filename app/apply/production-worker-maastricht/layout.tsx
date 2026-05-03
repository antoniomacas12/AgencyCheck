import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Production Worker / Picker — Near Maastricht, NL (€16.12/hr) | Apply Now",
  description:
    "Production Worker / Picker needed near Maastricht, Netherlands. " +
    "€16.12/hr + shift allowance, 2–3 shift system, immediate start. Own transport required.",
  keywords: [
    "production worker Maastricht",
    "picker job Netherlands",
    "food factory job NL",
    "cookie factory worker Maastricht",
    "production job €16 Netherlands",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/production-worker-maastricht",
  },
  openGraph: {
    type:      "website",
    siteName:  "AgencyCheck",
    title:     "Production Worker / Picker — Near Maastricht, NL",
    description:
      "€16.12/hr + shift allowance. Immediate start. 2–3 shift system. Own transport required.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function ProductionWorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
