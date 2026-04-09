import type { Metadata } from "next";

/**
 * Bulgarian segment layout — metadata only.
 *
 * DO NOT add <html> or <body> here.
 * The root app/layout.tsx owns <html lang="..."> and <body>.
 * It reads x-ac-locale from middleware to set lang="bg" automatically.
 * Adding html/body here causes nested invalid HTML → blank page.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.io"),
  title: {
    default: "AgencyCheck — Агенции за труд Нидерландия — Отзиви от работници и заплати",
    template: "%s | AgencyCheck",
  },
  description:
    "Сравнете агенциите за труд в Нидерландия по отзиви от работници, жилище и реални заплати. Проверете реалната си нетна заплата преди подписване на договор.",
  keywords: [
    "агенция за труд Нидерландия", "работа с жилище Нидерландия",
    "агенция за труд отзиви", "нетна заплата Нидерландия",
    "работа в Нидерландия за българи", "жилище агенция Холандия",
  ],
  alternates: {
    canonical: "https://agencycheck.io/bg",
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
    locale:   "bg_BG",
  },
};

export default function BgLayout({ children }: { children: React.ReactNode }) {
  // Just pass through — root layout handles chrome (Navbar, Footer, etc.)
  return <>{children}</>;
}
