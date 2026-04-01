import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Accommodation Cost Calculator — Agency Housing Netherlands — AgencyCheck",
  description:
    "Calculate how much agency housing costs will reduce your real weekly income. Enter your housing deduction, insurance, and transport to see your spendable income.",
};

export default function AccommodationCostsLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                          url: "/" },
    { name: "Tools",                         url: "/tools" },
    { name: "Accommodation Cost Calculator", url: "/tools/accommodation-costs" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Accommodation Cost Calculator — AgencyCheck",
    description:         "Calculate how agency housing deductions affect your real weekly income in the Netherlands. Essential before accepting a job with accommodation included.",
    url:                 "https://agencycheck.io/tools/accommodation-costs",
    applicationCategory: "FinanceApplication",
    operatingSystem:     "Web",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)   }} />
      {children}
    </>
  );
}
