import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Compare Two Agency Offers — Real Income Calculator — AgencyCheck",
  description:
    "Compare two Dutch agency job offers side by side after income tax, housing deductions, transport and healthcare. Find out which deal leaves you with more money.",
  alternates: { canonical: "https://agencycheck.io/tools/real-income-calculator" },
};

export default function RealIncomeCalculatorLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                    url: "/" },
    { name: "Tools",                   url: "/tools" },
    { name: "Real Income Calculator",  url: "/tools/real-income-calculator" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Compare Two Agency Offers — AgencyCheck",
    description:         "Put two Dutch agency job offers side by side and factor in housing deductions, transport, and income tax to see which deal actually leaves you with more money.",
    url:                 "https://agencycheck.io/tools/real-income-calculator",
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
