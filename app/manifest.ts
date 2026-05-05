import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "AgencyCheck",
    short_name:       "AgencyCheck",
    description:      "Employment agency reviews & jobs in the Netherlands. Check, don't guess!",
    start_url:        "/",
    display:          "standalone",
    background_color: "#ffffff",
    theme_color:      "#22C55E",
    orientation:      "portrait",
    icons: [
      {
        src:     "/favicon-192x192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/favicon-192x192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "maskable",
      },
      {
        src:     "/apple-touch-icon.png",
        sizes:   "180x180",
        type:    "image/png",
      },
    ],
  };
}
