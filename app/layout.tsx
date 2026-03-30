/**
 * DIAGNOSTIC Phase 2: Inter font + locale detection + Footer.
 * Still NO Navbar, NO floating widgets, NO GA4 scripts.
 *
 * Tests: next/font/google, headers(), getLocale(), getT(), Footer render.
 * If stable → none of those cause the crash → add Navbar next.
 * If crashes → crash is in font injection, headers(), or Footer.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
