/**
 * DIAGNOSTIC Phase 3: + Navbar (client component under test).
 * Still NO floating widgets, NO GA4 scripts.
 *
 * Tests: Navbar SSR with usePathname()/useT()/LanguageSwitcher.
 * If crashes → Navbar or LanguageSwitcher is the culprit.
 * If stable  → crash is in floating widgets or GA4.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.nl"),
  title: {
    default: "AgencyCheck — Employment Agencies Netherlands",
    template: "%s | AgencyCheck",
  },
  description:
    "Compare verified employment agencies in the Netherlands by worker reviews, housing, salary, and transport.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const locale = (headersList.get("x-ac-locale") ?? "en") as Locale;

  return (
    <html lang={locale} className={inter.variable}>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
