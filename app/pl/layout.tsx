import type { Metadata } from "next";

/**
 * Polish segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="pl" automatically.
 * Adding html/body here causes nested invalid HTML → blank page.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.nl"),
  title: {
    default: "AgencyCheck — Agencje Pracy Holandia — Opinie Pracowników i Zarobki",
    template: "%s | AgencyCheck",
  },
  description:
    "Porównaj agencje pracy w Holandii według opinii pracowników, zakwaterowania i realnych zarobków. Sprawdź prawdziwe zarobki netto zanim podpiszesz umowę.",
  keywords: [
    "agencja pracy Holandia", "praca z zakwaterowaniem Holandia",
    "praca w Holandii zakwaterowanie", "agencja pracy opinie",
    "zarobki netto Holandia", "praca Holandia dla Polaków",
  ],
  alternates: {
    canonical: "https://agencycheck.nl/pl",
    languages: {
      "en":        "https://agencycheck.nl/",
      "pl":        "https://agencycheck.nl/pl",
      "ro":        "https://agencycheck.nl/ro",
      "x-default": "https://agencycheck.nl/",
    },
  },
  openGraph: {
    type:     "website",
    siteName: "AgencyCheck",
    locale:   "pl_NL",
  },
};

export default function PlLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
