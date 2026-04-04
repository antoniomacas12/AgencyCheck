import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import nDynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLUR_PLACEHOLDER_IMAGES } from "@/lib/siteConfig";
import type { Locale } from "@/lib/i18n";

// These widgets start hidden and access browser APIs (sessionStorage,
// window.scrollY, window.location) on mount. SSR-ing them causes React
// hydration mismatch errors #418/#423 because server and client render
// differ. ssr:false ensures they only mount after hydration completes.
const StickyIncomeStrip = nDynamic(() => import("@/components/StickyIncomeStrip"), { ssr: false });
const WorkerQAPanel     = nDynamic(() => import("@/components/WorkerQAPanel"),     { ssr: false });
const FloatingStack     = nDynamic(() => import("@/components/FloatingStack"),     { ssr: false });
const CookieNotice      = nDynamic(() => import("@/components/CookieNotice"),      { ssr: false });

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.io"),
  title: {
    default: "AgencyCheck — Employment Agencies Netherlands — Worker Reviews & Salary Data",
    template: "%s | AgencyCheck",
  },
  description:
    "Compare 150+ verified employment agencies in the Netherlands by worker reviews, housing, salary, and transport. Find agencies near you and know your real take-home pay before signing.",
  keywords: [
    "employment agency netherlands", "uitzendbureau", "werk met huisvesting",
    "warehouse jobs netherlands", "agency housing worker", "looncheck",
    "employment agency reviews", "agency worker rights netherlands",
  ],
  openGraph: {
    type: "website",
    siteName: "AgencyCheck",
    locale: "en_NL",
  },
  robots: {
    index:  true,
    follow: true,
  },
  verification: {
    google: "DWZA4IknSEh6vJWfUUmo_KacL4aYYCMhFYKOqNKyW38",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read locale set by middleware (x-ac-locale header).
  // Defaults to "en" for all existing English routes.
  // /pl/* routes get "pl", /ro/* routes get "ro".
  const headersList = headers();
  const locale  = (headersList.get("x-ac-locale") ?? "en") as Locale;
  // Admin routes: suppress public navigation / widgets
  const isAdmin = headersList.get("x-ac-admin") === "true";

  return (
    <html lang={locale} className={inter.variable}>
      <body className={`${inter.className} bg-white flex flex-col min-h-screen${BLUR_PLACEHOLDER_IMAGES ? " blur-placeholder-images" : ""}`}>
        {!isAdmin && <Navbar locale={locale} />}
        <main className={isAdmin ? "flex-1" : "flex-1 pb-14"}>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <StickyIncomeStrip />}
        {!isAdmin && <WorkerQAPanel hideTrigger />}
        {!isAdmin && <FloatingStack />}
        {!isAdmin && <CookieNotice />}
        <Analytics />
      </body>
    </html>
  );
}
