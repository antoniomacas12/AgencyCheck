import type { Metadata } from "next";
import VacanciesClient from "@/components/VacanciesClient";

export const metadata: Metadata = {
  title:       "Open Vacancies Netherlands 2026 — 65 Jobs Now Hiring — AgencyCheck",
  description: "Current open vacancies in the Netherlands: truck drivers, welders, electricians, warehouse workers, bus drivers and more. EU citizens only. Immediate start. Apply on WhatsApp.",
  alternates:  { canonical: "https://agencycheck.io/vacancies" },
};

export default function VacanciesPage() {
  return <VacanciesClient />;
}
