import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "C+E Truck Driver — Dordrecht, NL (€150/day) | Apply Now",
  description:
    "C+E Truck Driver needed in Dordrecht, Netherlands. " +
    "Starting from €150/day, weekly payment, direct contract. No agency, no middlemen. Apply via WhatsApp.",
  keywords: [
    "C+E truck driver Netherlands",
    "CE truck driver Dordrecht",
    "truck driver job Holland",
    "international truck driver Netherlands",
    "C+E rijbewijs vacature",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/reachtruck",
  },
  openGraph: {
    type:      "website",
    siteName:  "AgencyCheck",
    title:     "C+E Truck Driver — Dordrecht, NL (€150/day)",
    description:
      "Direct hire, no middlemen. Netherlands–France–Germany route. €150/day starting. Apply via WhatsApp.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function ReachtruckApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
