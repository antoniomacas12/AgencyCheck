import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";
import Footer            from "@/components/Footer";
import LayoutClientShell from "@/components/LayoutClientShell";
import { BLUR_PLACEHOLDER_IMAGES } from "@/lib/siteConfig";
import { BotIdClient } from "botid/client";

// ── BotID — protected page routes ────────────────────────────────────────────
// These routes are known targets for bot traffic / fake visits.
// BotIdClient injects a silent JavaScript challenge on every page load.
// When a browser (or JS-executing bot) navigates to these paths, the challenge
// result is attached to the request so server-side checkBotId() can verify it.
//
// NOTE: Basic mode (free) catches bots that fail the cryptographic challenge.
// Simple HTTP scrapers (curl, Python requests) that don't execute JS are best
// handled by the middleware UA filter below + Vercel Firewall rules.
const BOT_PROTECTED_ROUTES = [
  { path: "/compare/*",                      method: "GET" },
  { path: "/guides/*",                       method: "GET" },
  { path: "/jobs-rotterdam",                 method: "GET" },
  { path: "/assembly-jobs-zwolle",           method: "GET" },
  { path: "/production-jobs-netherlands",    method: "GET" },
  { path: "/salary/*",                       method: "GET" },
] as const;

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

// Brand wordmark font — Plus Jakarta Sans 800 (ExtraBold)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
  variable: "--font-jakarta",
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
  icons: {
    icon:             [
      { url: "/favicon.ico",         sizes: "any" },
      { url: "/favicon-32x32.png",   sizes: "32x32",   type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.svg",            type: "image/svg+xml" },
    ],
    apple:            [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut:         "/favicon.ico",
  },
  openGraph: {
    type:        "website",
    siteName:    "AgencyCheck",
    locale:      "en_NL",
    title:       "AgencyCheck — Real jobs. Honest agencies.",
    description: "Warehouse, logistics & production work in the Netherlands. Accommodation available.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AgencyCheck — Real jobs. Honest agencies." }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "AgencyCheck — Real jobs. Honest agencies.",
    description: "Warehouse, logistics & production work in the Netherlands. Accommodation available.",
    images:      ["/og-image.png"],
  },
  robots: {
    index:  true,
    follow: true,
  },
  verification: {
    google: "DWZA4IknSEh6vJWfUUmo_KacL4aYYCMhFYKOqNKyW38",
  },
};

// Explicit viewport — ensures iOS Safari uses device width and does not
// scale or expand the layout viewport to accommodate overflowing content.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// NOTE: No `export const dynamic` here — the root layout is now static by
// default.  Routes that need dynamic rendering (agencies, reviews, etc.)
// declare their own `export const dynamic = "force-dynamic"` at the page
// level.  This allows /apply/[slug] pages to be served from the static
// pre-render cache instead of being re-rendered on every request.
//
// Per-request behaviour (admin detection, locale detection) has moved into
// LayoutClientShell, which uses usePathname() — available during SSR without
// opting any route into dynamic rendering.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Default lang="en". LayoutClientShell patches this to the correct locale
    // for /pl/*, /ro/*, etc. routes via useEffect after hydration.
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      {/* BotID client-side challenge script — runs silently on every page load.
          Protects the routes in BOT_PROTECTED_ROUTES from JS-executing bots. */}
      <head>
        <BotIdClient protect={BOT_PROTECTED_ROUTES} />
      </head>
      <body className={`${inter.className} bg-[#0B1F14] flex flex-col min-h-screen overflow-x-hidden${BLUR_PLACEHOLDER_IMAGES ? " blur-placeholder-images" : ""}`}>
        <LayoutClientShell footer={<Footer />}>
          {children}
        </LayoutClientShell>
        <Analytics />

        {/* Google Analytics 4 — only in production */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-3WP6HM9FTL"
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3WP6HM9FTL', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
