#!/usr/bin/env python3
"""
Generate /data/agencies.ts from agencies_parsed.json.
Produces a clean, fully-typed TypeScript export of all 127 verified agencies.
"""
import json
from pathlib import Path

with open("/sessions/lucid-confident-hopper/agencies_parsed.json") as f:
    agencies = json.load(f)

def ts_str(val):
    """Format a Python value as a TypeScript string literal or null."""
    if val is None:
        return "null"
    # Escape backticks and backslashes; use template literal to handle quotes
    escaped = str(val).replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return f"`{escaped}`"

def ts_str_arr(arr):
    """Format a Python list as a TS string array."""
    if not arr:
        return "[]"
    items = ", ".join(f'"{x}"' for x in arr)
    return f"[{items}]"

lines = []
lines.append("// ─── AgencyCheck — Verified Agency Dataset ───────────────────────────────────")
lines.append("// Auto-generated from agency_profiles_batch_01–07.md")
lines.append("// Generated: 2026-03-14  |  127 verified Amsterdam-area agencies")
lines.append("// DO NOT EDIT MANUALLY — re-generate with: python3 scripts/gen_agencies_ts.py")
lines.append("")
lines.append("// ─── Types ───────────────────────────────────────────────────────────────────")
lines.append("")
lines.append("export type AgencySector =")
lines.append('  | "logistics"')
lines.append('  | "food-production"')
lines.append('  | "construction"')
lines.append('  | "healthcare"')
lines.append('  | "it-tech"')
lines.append('  | "transport"')
lines.append('  | "hospitality"')
lines.append('  | "agriculture"')
lines.append('  | "cleaning"')
lines.append('  | "general-staffing"')
lines.append('  | "office-admin"')
lines.append('  | "engineering";')
lines.append("")
lines.append("export type AccommodationType =")
lines.append('  | "confirmed_with_deduction"')
lines.append('  | "confirmed_no_deduction"')
lines.append('  | "not_provided"')
lines.append('  | "unverified_claim"')
lines.append('  | "unknown";')
lines.append("")
lines.append("export type ConfidenceLevel = \"high\" | \"medium\" | \"low\" | \"very_low\";")
lines.append("")
lines.append("export interface VerifiedAgency {")
lines.append("  id:                 number;")
lines.append("  name:               string;")
lines.append("  slug:               string;")
lines.append("  website:            string | null;")
lines.append("  phone:              string | null;")
lines.append("  email:              string | null;")
lines.append("  address:            string | null;")
lines.append("  city:               string | null;")
lines.append("  agencyType:         AgencySector;")
lines.append("  jobFocus:           string[];")
lines.append("  supportedCities:    string[];")
lines.append("  accommodation:      AccommodationType;")
lines.append("  transparencyScore:  number;")
lines.append("  confidenceLevel:    ConfidenceLevel;")
lines.append("  description:        string | null;")
lines.append("  sourceType:         string;")
lines.append("}")
lines.append("")
lines.append("// ─── Dataset (127 verified agencies) ─────────────────────────────────────────")
lines.append("")
lines.append("export const VERIFIED_AGENCIES: VerifiedAgency[] = [")

for i, a in enumerate(agencies):
    comma = "," if i < len(agencies) - 1 else ""
    lines.append("  {")
    lines.append(f"    id:                 {a['id']},")
    lines.append(f"    name:               {ts_str(a['name'])},")
    lines.append(f"    slug:               {ts_str(a['slug'])},")
    lines.append(f"    website:            {ts_str(a['website'])},")
    lines.append(f"    phone:              {ts_str(a['phone'])},")
    lines.append(f"    email:              {ts_str(a['email'])},")
    lines.append(f"    address:            {ts_str(a['address'])},")
    lines.append(f"    city:               {ts_str(a['city'])},")
    lines.append(f"    agencyType:         \"{a['agencyType']}\",")
    lines.append(f"    jobFocus:           {ts_str_arr(a['jobFocus'])},")
    lines.append(f"    supportedCities:    {ts_str_arr(a['supportedCities'])},")
    lines.append(f"    accommodation:      \"{a['accommodation']}\",")
    lines.append(f"    transparencyScore:  {a['transparencyScore']},")
    lines.append(f"    confidenceLevel:    \"{a['confidenceLevel']}\",")
    lines.append(f"    description:        {ts_str(a['description'])},")
    lines.append(f"    sourceType:         \"{a['sourceType']}\",")
    lines.append(f"  }}{comma}")

lines.append("];")
lines.append("")
lines.append("// ─── Utilities ───────────────────────────────────────────────────────────────")
lines.append("")
lines.append("export function getAgencyBySlug(slug: string): VerifiedAgency | undefined {")
lines.append("  return VERIFIED_AGENCIES.find((a) => a.slug === slug);")
lines.append("}")
lines.append("")
lines.append("export function getAgenciesBySector(sector: AgencySector): VerifiedAgency[] {")
lines.append("  return VERIFIED_AGENCIES.filter((a) => a.agencyType === sector);")
lines.append("}")
lines.append("")
lines.append("export function getAgenciesByCity(city: string): VerifiedAgency[] {")
lines.append("  const slug = city.toLowerCase().replace(/\\s+/g, \"-\");")
lines.append("  return VERIFIED_AGENCIES.filter((a) => a.supportedCities.includes(slug));")
lines.append("}")
lines.append("")
lines.append("export function getAgenciesWithAccommodation(): VerifiedAgency[] {")
lines.append("  return VERIFIED_AGENCIES.filter(")
lines.append("    (a) => a.accommodation !== \"not_provided\" && a.accommodation !== \"unknown\"")
lines.append("  );")
lines.append("}")
lines.append("")

output = "\n".join(lines)
out_path = "/sessions/lucid-confident-hopper/agencies.ts"
Path(out_path).write_text(output, encoding="utf-8")
print(f"Written: {out_path}")
print(f"Lines: {len(lines)}")
print(f"Size: {len(output):,} bytes")
