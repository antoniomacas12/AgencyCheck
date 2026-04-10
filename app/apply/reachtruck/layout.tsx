import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Reachtruck Driver Needed — Netherlands (€16.50/hr) | Apply Now",
  description:
    "We are hiring experienced reachtruck drivers for Waalwijk, Netherlands. " +
    "€16.50 gross per hour, 2-shift rota. Minimum 3 years experience. EU citizens only. Apply now.",
  keywords: [
    "reachtruck driver Netherlands",
    "reachtruck vacature Waalwijk",
    "reach truck job Holland",
    "warehouse driver job Netherlands",
    "reachtruck driver €16.50",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/reachtruck",
  },
  openGraph: {
    type:      "website",
    siteName:  "AgencyCheck",
    title:     "Reachtruck Driver — Netherlands (€16.50/hr)",
    description:
      "For experienced reachtruck operators only. Waalwijk area. Minimum 3 years experience. EU citizens. Apply takes 2 minutes.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function ReachtruckApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
