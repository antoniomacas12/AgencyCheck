import type { Metadata } from "next";

/**
 * Romanian segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="ro" automatically.
 * Adding html/body here causes nested invalid HTML → blank page.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.nl"),
  title: {
    default: "AgencyCheck — Agenții de Muncă Olanda — Recenzii și Salarii Reale",
    template: "%s | AgencyCheck",
  },
  description:
    "Compară agențiile de muncă din Olanda după recenzii de la muncitori, cazare și salarii reale. Calculează salariul net real înainte să semnezi.",
  keywords: [
    "agenție de muncă Olanda", "locuri de muncă cu cazare Olanda",
    "muncă în Olanda cu cazare", "agenție muncă recenzii",
    "salariu net Olanda", "locuri de muncă Olanda pentru romani",
  ],
  alternates: {
    canonical: "https://agencycheck.nl/ro",
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
    locale:   "ro_NL",
  },
};

export default function RoLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
