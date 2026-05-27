// /nl/vacatures — Dutch vacancies index
import type { Metadata } from "next";
import VacanciesClient from "@/components/VacanciesClient";
import { VACANCIES } from "@/lib/vacanciesData";

export const metadata: Metadata = {
  title: `Actuele Vacatures Nederland — ${VACANCIES.length} Open Functies | AgencyCheck`,
  description:
    "Actuele vacatures in Nederland: vrachtwagenchauffeurs, lassers, elektriciens, magazijnmedewerkers, buschauffeurs en meer. Alleen EU-burgers. Direct beschikbaar. Solliciteer via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/nl/vacatures",
    languages: {
      "en":        "https://agencycheck.io/apply",
      "nl":        "https://agencycheck.io/nl/vacatures",
      "pl":        "https://agencycheck.io/pl/oferty-pracy",
      "x-default": "https://agencycheck.io/apply",
    },
  },
};

export default function NlVacaturesPage() {
  return <VacanciesClient />;
}
