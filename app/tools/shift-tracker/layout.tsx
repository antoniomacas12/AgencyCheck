import type { Metadata } from "next";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Work Hours Tracker — Log Shifts & Verify Pay — AgencyCheck",
  description:
    "Track your shifts and hours as an agency worker in the Netherlands. Log start time, end time, breaks, and overtime. Export a CSV for your records.",
};

export default function ShiftTrackerLayout({ children }: { children: React.ReactNode }) {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",         url: "/" },
    { name: "Tools",        url: "/tools" },
    { name: "Shift Tracker", url: "/tools/shift-tracker" },
  ]);
  const appSchema   = softwareApplicationSchema({
    name:                "Work Hours Tracker — AgencyCheck",
    description:         "Log your daily working hours and verify your weekly pay as a flex worker in the Netherlands. Record start time, end time, breaks, and get your estimated pay.",
    url:                 "https://agencycheck.io/tools/shift-tracker",
    applicationCategory: "ProductivityApplication",
    operatingSystem:     "Web",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)   }} />
      {children}
    </>
  );
}
