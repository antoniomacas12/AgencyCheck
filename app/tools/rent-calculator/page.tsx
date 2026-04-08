import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Client-only: uses local state and browser APIs — no SSR needed
const RentCalculatorClient = dynamic(
  () => import("@/components/RentCalculatorClient"),
  { ssr: false, loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" /> }
);

export const metadata: Metadata = {
  title: "Netherlands Rent Calculator 2026 — Affordability, Huurtoeslag & Housing Check",
  description:
    "Free tool for workers in the Netherlands. Check your rent-to-income ratio, estimate huurtoeslag eligibility, and find out if your rent is reasonable — based on official 2026 Dutch rules.",
  keywords: [
    "netherlands rent calculator", "huurtoeslag berekenen", "rent affordability netherlands",
    "agency worker housing calculator", "dutch rent check", "wws huurprijs check",
  ],
  alternates: { canonical: "https://agencycheck.io/tools/rent-calculator" },
  openGraph: {
    type: "website",
    title: "Netherlands Rent Calculator 2026",
    description: "Check your rent affordability, huurtoeslag eligibility, and whether your rent is reasonable — built on official 2026 Dutch rules.",
    siteName: "AgencyCheck",
  },
};

export default function RentCalculatorPage() {
  return <RentCalculatorClient />;
}
