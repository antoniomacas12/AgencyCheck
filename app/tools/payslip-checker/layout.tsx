import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Payslip Checker — Verify Your Pay Netherlands — AgencyCheck",
  description:
    "Check if your Dutch agency payslip is correct. Enter your hours, gross pay, and deductions to see if the numbers add up. Includes a 12-point verification checklist.",
};

export default function PayslipCheckerLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",            url: "/" },
    { name: "Tools",           url: "/tools" },
    { name: "Payslip Checker", url: "/tools/payslip-checker" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Payslip Checker — AgencyCheck",
    description:         "Verify your Dutch agency payslip. Enter your hours worked, hourly wage, gross salary, and deductions to check if your pay is correct. Highlights errors and unusual deductions.",
    url:                 "https://agencycheck.nl/tools/payslip-checker",
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
