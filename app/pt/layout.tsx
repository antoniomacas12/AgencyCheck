import type { Metadata } from "next";

/**
 * Portuguese segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="pt" automatically.
 * Adding html/body here causes nested invalid HTML → blank page.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.io"),
  title: {
    default: "AgencyCheck — Agências de Trabalho Holanda — Avaliações de Trabalhadores e Salários",
    template: "%s | AgencyCheck",
  },
  description:
    "Compara agências de trabalho na Holanda por avaliações de trabalhadores, alojamento e salários reais. Verifica o salário líquido real antes de assinar o contrato.",
  keywords: [
    "agência de trabalho Holanda", "trabalho com alojamento Holanda",
    "trabalho na Holanda alojamento", "agência de trabalho avaliações",
    "salário líquido Holanda", "trabalho Holanda para portugueses",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pt",
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
    locale:   "pt_PT",
  },
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
