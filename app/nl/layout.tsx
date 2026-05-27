import type { Metadata } from "next";

/**
 * Dutch segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="nl" automatically.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.io"),
  title: {
    default: "AgencyCheck — Uitzendbureaus Nederland — Werknemersreviews en Salaris 2026",
    template: "%s | AgencyCheck",
  },
  description:
    "Vergelijk 150+ uitzendbureaus in Nederland op werknemersreviews, huisvesting en reëel nettoloon. Zie wat je écht overhoudt na aftrek. Controleer hier voordat je tekent.",
  keywords: [
    "uitzendbureau Nederland", "werk met huisvesting Nederland",
    "uitzendbureau reviews", "nettoloon berekenen Nederland",
    "vacatures Nederland", "tijdelijk werk Nederland 2026",
  ],
  alternates: {
    canonical: "https://agencycheck.io/nl",
    languages: {
      "en":        "https://agencycheck.io/",
      "nl":        "https://agencycheck.io/nl",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    type:     "website",
    siteName: "AgencyCheck",
    locale:   "nl_NL",
  },
};

export default function NlLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
