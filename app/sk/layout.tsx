import type { Metadata } from "next";

/**
 * Slovak segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="sk" automatically.
 * Adding html/body here causes nested invalid HTML → blank page.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.io"),
  title: {
    default: "AgencyCheck — Agentúry práce Holandsko — Hodnotenia pracovníkov a mzdy",
    template: "%s | AgencyCheck",
  },
  description:
    "Porovnajte agentúry práce v Holandsku podľa hodnotení pracovníkov, ubytovanie a reálnych platov. Zistite reálny čistý príjem pred podpisom zmluvy.",
  keywords: [
    "agentúra práce Holandsko", "práca s ubytovaním Holandsko",
    "zamestnávateľská agentúra hodnotenia", "čistý plat Holandsko",
    "práca v Holandsku pre Slovákov", "ubytovanie agentúra Holandsko",
  ],
  alternates: {
    canonical: "https://agencycheck.io/sk",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "pt":        "https://agencycheck.io/pt",
      "sk":        "https://agencycheck.io/sk",
      "bg":        "https://agencycheck.io/bg",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    type:     "website",
    siteName: "AgencyCheck",
    locale:   "sk_SK",
  },
};

export default function SkLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
