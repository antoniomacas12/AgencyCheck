import { generateJobOGImage } from "@/lib/og-job-image";

export const alt = "Food Production Operator — Now Hiring in Netherlands | AgencyCheck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateJobOGImage({
    title:      "Food Production",
    titleAccent: "Operator",
    location:   "Netherlands",
    pay:        "Min. wage+",
    tag:        "Via agency partner",
    emoji:      "🏭",
    applicants: 34,
    altText:    alt,
  });
}
