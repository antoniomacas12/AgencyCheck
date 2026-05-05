import { generateJobOGImage } from "@/lib/og-job-image";

export const alt = "C+E Truck Driver — Now Hiring in Dordrecht, NL | AgencyCheck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateJobOGImage({
    title:      "C+E Truck Driver",
    location:   "Dordrecht, NL",
    pay:        "€150+/day",
    tag:        "Direct contract",
    emoji:      "🚛",
    applicants: 18,
    altText:    alt,
  });
}
