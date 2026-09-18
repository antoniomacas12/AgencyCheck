import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Food Production Worker – Cheese, Meat, Salads & Sauces | Netherlands | Apply Now",
  description:
    "Food production jobs in the Netherlands — cheese, meat, salads, sauces & more. " +
    "€14.99/h gross. 3-shift incl. nights. 0–10°C environment. Accommodation paid. Apply via WhatsApp.",
  keywords: [
    "food production worker Netherlands",
    "cheese production job Netherlands",
    "meat packing job Holland",
    "food factory job Netherlands",
    "3-shift food production Netherlands",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/food-production",
  },
  openGraph: {
    type:      "website",
    siteName:  "AgencyCheck",
    title:     "Food Production Worker – Cheese, Meat, Salads & Sauces — Netherlands",
    description:
      "€14.99/h gross. 3-shift incl. nights. 0–10°C. Accommodation paid. Apply via WhatsApp.",
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
