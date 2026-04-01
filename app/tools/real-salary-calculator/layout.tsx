import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Real Salary Calculator Netherlands 2026 — After Tax — AgencyCheck",
  description:
    "Full Dutch salary calculation including loonheffing 2026, overtime premiums, vakantiegeld (8%), and housing deductions. See your true take-home pay as an agency worker.",
};

export default function RealSalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                    url: "/" },
    { name: "Tools",                   url: "/tools" },
    { name: "Real Salary Calculator",  url: "/tools/real-salary-calculator" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Real Salary Calculator Netherlands 2026 — AgencyCheck",
    description:         "Full Dutch salary calculation including loonheffing income tax, overtime premiums, vakantiegeld (8% holiday pay), and deductions. See your true take-home pay as an agency worker.",
    url:                 "https://agencycheck.nl/tools/real-salary-calculator",
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
