/**
 * DIAGNOSTIC: layout.tsx stripped to absolute minimum.
 *
 * Removed: Navbar, Footer, ShockPopup, StickyIncomeStrip, WorkerQAPanel,
 *          FloatingStack, Inter font, GA4 scripts, locale detection, headers().
 *
 * Only: globals.css import + html + body + {children}.
 *
 * If production is stable after this deploy the crash lives in one of the
 * removed layout components.  Re-add them one at a time in this order:
 *   1. Inter font (next/font/google)
 *   2. Navbar
 *   3. Footer
 *   4. ShockPopup / StickyIncomeStrip / WorkerQAPanel / FloatingStack (ssr:false)
 *   5. GA4 Script tags
 *   6. locale detection via headers() + locale prop threading
 *
 * Restore original layout:
 *   git show HEAD~1:app/layout.tsx > app/layout.tsx
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgencyCheck — Employment Agencies Netherlands",
  description:
    "Compare verified employment agencies in the Netherlands by worker reviews, housing, salary, and transport.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
