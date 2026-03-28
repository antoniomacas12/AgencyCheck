import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShockPopup from "@/components/ShockPopup";
import StickyIncomeStrip from "@/components/StickyIncomeStrip";
import WorkerQAPanel from "@/components/WorkerQAPanel";
import FloatingStack from "@/components/FloatingStack";
import { BLUR_PLACEHOLDER_IMAGES } from "@/lib/siteConfig";
import type { Locale } from "@/lib/i18n";

// GA4 — only injected when NEXT_PUBLIC_GA_ID is set. Safe to leave unset in dev.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://agencycheck.nl"),
  title: {
    default: "AgencyCheck — Employment Agencies Netherlands — Worker Reviews & Salary Data",
    template: "%s | AgencyCheck",
  },
  description:
    "Compare 127 verified employment agencies in the Netherlands by worker reviews, housing, salary, and transport. Find agencies near you and know your real take-home pay before signing.",
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
};

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
      <head>
        {/* GA4 — injected only when NEXT_PUBLIC_GA_ID env var is set */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen${BLUR_PLACEHOLDER_IMAGES ? " blur-placeholder-images" : ""}`}>
        {!isAdmin && <Navbar locale={locale} />}
        <main className={isAdmin ? "flex-1" : "flex-1 pb-14"}>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <ShockPopup />}
        {!isAdmin && <StickyIncomeStrip />}
        {!isAdmin && <WorkerQAPanel hideTrigger />}
        {!isAdmin && <FloatingStack />}
      </body>
    </html>
  );
}
