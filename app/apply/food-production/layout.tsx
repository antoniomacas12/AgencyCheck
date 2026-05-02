import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Food Production Operator — Netherlands | Apply Now",
  description:
    "Food Production Operator needed in the Netherlands. " +
    "Fast placement via verified agency partners. Start within 1 week. Apply via WhatsApp.",
  keywords: [
    "food production operator Netherlands",
    "food industry job Holland",
    "production operator vacature",
    "food factory job Netherlands",
    "fast placement food industry NL",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/food-production",
  },
  openGraph: {
    type:      "website",
    siteName:  "AgencyCheck",
    title:     "Food Production Operator — Netherlands",
    description:
      "Fast placement via verified agency partners. Start within 1 week. Apply via WhatsApp.",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function FoodProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
