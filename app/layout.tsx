/**
 * DIAGNOSTIC Phase 4: + floating widgets (all ssr:false).
 * Still NO GA4 scripts.
 *
 * Tests: nDynamic ssr:false for ShockPopup, StickyIncomeStrip,
 *        WorkerQAPanel, FloatingStack.
 * If crashes → something about ssr:false dynamic imports is broken.
 * If stable  → crash was GA4 scripts or is now fully resolved.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import nDynamic from "next/dynamic";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

const ShockPopup        = nDynamic(() => import("@/components/ShockPopup"),        { ssr: false });
const StickyIncomeStrip = nDynamic(() => import("@/components/StickyIncomeStrip"), { ssr: false });
const WorkerQAPanel     = nDynamic(() => import("@/components/WorkerQAPanel"),     { ssr: false });
const FloatingStack     = nDynamic(() => import("@/components/FloatingStack"),     { ssr: false });

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
        <ShockPopup />
        <StickyIncomeStrip />
        <WorkerQAPanel hideTrigger />
        <FloatingStack />
      </body>
    </html>
  );
}
