import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shift Tracker — AgencyCheck",
  description:
    "Track your shifts and hours as an agency worker in the Netherlands. Log start time, end time, breaks, and overtime. Export a CSV for your records.",
};

export default function ShiftTrackerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
