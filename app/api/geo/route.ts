/**
 * app/api/geo/route.ts
 *
 * Returns the visitor's country and whether they are in the EU.
 * Vercel automatically injects `x-vercel-ip-country` on every request
 * (ISO 3166-1 alpha-2 code, e.g. "PL", "NL", "US").
 *
 * Used by ApplyPreScreen to silently block non-EU visitors from starting
 * the application flow while leaving the rest of the platform accessible.
 *
 * Fail-open: if the header is missing (local dev, unknown edge case) the
 * response returns isEU: true so legitimate candidates are never blocked
 * by a geo-detection failure.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE",
  "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO",
  "SE", "SI", "SK",
]);

export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") ?? null;

  // Fail-open: unknown country → treat as EU so no false blocks
  const isEU = country === null ? true : EU_COUNTRIES.has(country);

  return NextResponse.json(
    { country, isEU },
    {
      headers: {
        // Cache for 10 minutes per user — country doesn't change mid-session
        "Cache-Control": "private, max-age=600",
      },
    },
  );
}
