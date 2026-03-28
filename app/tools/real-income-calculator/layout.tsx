import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Income Calculator — AgencyCheck",
  description:
    "Compare two agency offers side by side after Dutch income tax, housing deductions, transport and healthcare. Find out your real take-home pay.",
};

export default function RealIncomeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
