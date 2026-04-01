import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Weekly Salary Calculator Netherlands — Real Take-Home Pay — AgencyCheck",
  description:
    "Calculate your real weekly income after Dutch income tax (loonheffing 2026), agency housing deduction, insurance, and transport. Free, instant, no signup.",
};

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",              url: "/" },
    { name: "Tools",             url: "/tools" },
    { name: "Salary Calculator", url: "/tools/salary-calculator" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Weekly Salary Calculator — AgencyCheck",
    description:         "Calculate your real weekly income after Dutch income tax, agency housing deductions, insurance, and transport costs. Free, no signup required.",
    url:                 "https://agencycheck.nl/tools/salary-calculator",
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
