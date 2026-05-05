import { generateJobOGImage } from "@/lib/og-job-image";

export const alt = "Warehouse Worker with Housing — Netherlands | AgencyCheck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateJobOGImage({
    title:      "Warehouse Worker",
    titleAccent: "with Housing",
    location:   "Netherlands",
    pay:        "Min. wage+",
    tag:        "Housing available",
    emoji:      "📦",
    applicants: 41,
    altText:    alt,
  });
}
