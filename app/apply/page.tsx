// /apply — All open positions ("Actual Jobs") landing page
import type { Metadata } from "next";
import VacanciesClient from "@/components/VacanciesClient";

export const metadata: Metadata = {
  title: "Actual Jobs in the Netherlands — 65 Open Positions | AgencyCheck",
  description:
    "Current open vacancies in the Netherlands: truck drivers, welders, electricians, warehouse workers, bus drivers and more. EU citizens only. Immediate start. Apply on WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply",
    languages: {
      "en":        "https://agencycheck.io/apply",
      "pl":        "https://agencycheck.io/pl/oferty-pracy",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca",
      "x-default": "https://agencycheck.io/apply",
    },
  },
};

export default function ApplyIndexPage() {
  return <VacanciesClient />;
}
