import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Salary Netherlands After Rent — 2026 Calculator | AgencyCheck",
  description:
    "Calculate your real take-home salary in the Netherlands after housing, tax and transport deductions. Updated with 2026 minimum wage and tax rates.",
  alternates: { canonical: "/real-salary-netherlands-after-rent" },
  openGraph: {
    title: "Real Salary Netherlands After Rent — AgencyCheck",
    description:
      "See your actual take-home pay after housing deductions, income tax, and transport costs. 2026 NL rates.",
  },
};

export default function RealSalaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
