import { generateJobOGImage } from "@/lib/og-job-image";

export const alt = "Production Worker / Picker — Now Hiring near Maastricht | AgencyCheck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateJobOGImage({
    title:       "Production Worker",
    titleAccent: "/ Picker",
    location:    "Near Maastricht, NL",
    pay:         "€16.12/hr",
    tag:         "Cookie factory",
    emoji:       "🍪",
    applicants:  27,
    altText:     alt,
  });
}
