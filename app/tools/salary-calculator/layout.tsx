import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculator — AgencyCheck",
  description:
    "Calculate your Dutch gross and net salary as an agency worker. Includes holiday pay (vakantiegeld) and estimated loonheffing for 2026.",
};

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
