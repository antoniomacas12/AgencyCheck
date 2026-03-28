#!/usr/bin/env python3
"""
Multi-format parser for all 7 agency profile batches.
Handles:
  Format A: Batches 01-03 (# {num}. NAME, plain fields, textual confidence)
  Format B: Batch 04     (## {num}. Name, bold fields, textual confidence)
  Format C: Batches 05-07 (## {num}. Name, bold fields, numeric score /100)
"""

import re
import json
from pathlib import Path

BATCH_FILES = [
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_01.md", "A"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_02.md", "A"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_03.md", "A"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_04.md", "B"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_05.md", "C"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_06.md", "C"),
    ("/sessions/lucid-confident-hopper/mnt/outputs/agency_profiles_batch_07.md", "C"),
]

# ------------------------------------------------------------------
# Normalisation helpers
# ------------------------------------------------------------------

SECTOR_MAP = {
    # canonical
    "logistics": "logistics",
    "food-production": "food-production",
    "food production": "food-production",
    "construction": "construction",
    "healthcare": "healthcare",
    "it-tech": "it-tech",
    "it tech": "it-tech",
    "it": "it-tech",
    "information technology": "it-tech",
    "technology": "it-tech",
    "transport": "transport",
    "hospitality": "hospitality",
    "agriculture": "agriculture",
    "cleaning": "cleaning",
    "general-staffing": "general-staffing",
    "general staffing": "general-staffing",
    "office-admin": "office-admin",
    "office admin": "office-admin",
    "engineering": "engineering",
    # free-text mappings for A/B batches
    "real estate": "office-admin",
    "vastgoed": "office-admin",
    "finance": "office-admin",
    "finance and it": "office-admin",
    "banking": "office-admin",
    "accounting": "office-admin",
    "fmcg": "office-admin",
    "consumer goods": "office-admin",
    "legal": "office-admin",
    "hr": "office-admin",
    "executive search": "office-admin",
    "retail": "general-staffing",
    "multilingual": "general-staffing",
    "international": "general-staffing",
    "staffing": "general-staffing",
    "recruitment": "general-staffing",
    "life sciences": "healthcare",
    "pharma": "healthcare",
    "biotech": "healthcare",
    "medical": "healthcare",
    "care": "healthcare",
    "aviation": "logistics",
    "airport": "logistics",
    "maritime": "engineering",
    "energy": "engineering",
    "n/a": "general-staffing",
    "non-profit": "general-staffing",
    "social": "general-staffing",
}

def normalize_sector(raw: str) -> str:
    if not raw:
        return "general-staffing"
    # Take first segment before /, (, or newline
    raw = re.split(r'[/,\n(]', raw)[0].strip().strip("*").strip()
    raw = raw.lower().replace("–", "-").replace("—", "-").strip()
    # Try exact match
    if raw in SECTOR_MAP:
        return SECTOR_MAP[raw]
    # Try substring match
    for key, val in SECTOR_MAP.items():
        if key in raw:
            return val
    return "general-staffing"

def normalize_job_focus(raw: str) -> list:
    if not raw or raw.strip().lower() in ["not confirmed", "n/a", "none", "", "confirm directly"]:
        return []
    items = [x.strip().strip("*").strip("-").strip() for x in re.split(r'[,\n]', raw)]
    result = []
    for item in items:
        item = item.strip()
        if not item:
            continue
        # Accept if it looks like a job slug (contains hyphen or is short)
        if len(item) < 50 and item.replace("-", "").replace(" ", "").isalnum():
            # Normalize spaces to hyphens
            item = item.lower().replace(" ", "-")
            result.append(item)
    return result[:4]

def normalize_accommodation(raw: str) -> str:
    if not raw:
        return "unknown"
    lower = raw.lower()
    if "confirmed_with_deduction" in lower or ("confirmed" in lower and "deduction" in lower):
        return "confirmed_with_deduction"
    if "confirmed_no_deduction" in lower or ("confirmed" in lower and "no_deduction" in lower):
        return "confirmed_no_deduction"
    if "confirmed" in lower and "not" not in lower and "un" not in lower:
        return "confirmed_no_deduction"
    if "not_provided" in lower or "not provided" in lower:
        return "not_provided"
    if "unverified" in lower:
        return "unverified_claim"
    if "unknown" in lower or "not confirmed" in lower or "not verified" in lower:
        return "unknown"
    if lower.startswith("yes"):
        return "confirmed_no_deduction"
    if "no" in lower and len(lower) < 30:
        return "not_provided"
    return "unknown"

def clean_url(url: str) -> str:
    if not url:
        return None
    # Strip markdown link [text](url) -> url
    m = re.match(r'\[.*?\]\((.*?)\)', url)
    if m:
        url = m.group(1)
    url = url.strip().rstrip(')').rstrip(']').strip()
    lower = url.lower()
    if any(x in lower for x in [
        "not found", "not publicly", "not confirmed", "n/a", "none",
        "contact via", "contact the", "varies", "available sources"
    ]):
        return None
    if not url.startswith("http") and not url.startswith("//"):
        if "." in url and len(url) > 4:
            url = "https://" + url.lstrip("/")
        else:
            return None
    return url

def clean_phone(phone: str) -> str:
    if not phone:
        return None
    phone = phone.strip()
    lower = phone.lower()
    if any(x in lower for x in ["not", "n/a", "none", "confirm", "varies", "publicly"]):
        return None
    # Keep +31 numbers
    if "+" in phone or phone.replace(" ","").replace("-","").isdigit():
        return phone
    return None

def clean_email(email: str) -> str:
    if not email:
        return None
    email = email.strip()
    lower = email.lower()
    if any(x in lower for x in ["not", "n/a", "none", "contact via", "verify", "publicly", "(general)", "(internships)"]):
        return None
    if "@" in email:
        return email.split()[0].strip()
    return None

def confidence_level(score: int) -> str:
    if score >= 70: return "high"
    if score >= 50: return "medium"
    if score >= 30: return "low"
    return "very_low"

def textual_confidence_to_score(text: str) -> int:
    """Convert 'High', 'Medium', 'Low' textual confidence to a score."""
    lower = text.lower()
    if "high" in lower: return 72
    if "medium" in lower: return 52
    if "low" in lower: return 32
    return 40

def get_field(text: str, *labels) -> str:
    """Extract first matching field value from a text block."""
    for label in labels:
        # Try both bold and plain variants
        patterns = [
            rf'\*\*{re.escape(label)}[:\*]*\*\*\s*(.+?)(?:\n|$)',   # **Label:** value
            rf'-\s+{re.escape(label)}[:\s]+(.+?)(?:\n|$)',            # - label: value
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                val = m.group(1).strip().strip("*").strip()
                if val:
                    return val
    return None

def get_description(block: str) -> str:
    """Extract the first paragraph of the Description section."""
    # Try ###  Description first (format C/B), then ## Description (A)
    for pat in [
        r'### Description\s*\n(.*?)(?=\n###|\n##|\Z)',
        r'## Description\s*\n(.*?)(?=\n##|\Z)',
    ]:
        m = re.search(pat, block, re.DOTALL)
        if m:
            desc = m.group(1).strip()
            # First paragraph only
            paras = [p.strip() for p in re.split(r'\n{2,}', desc) if p.strip()]
            if paras:
                return paras[0]
    return ""

# ------------------------------------------------------------------
# Format A parser (Batches 01-03)
# Separator: \n# {number}. {NAME}
# ------------------------------------------------------------------

def parse_format_a(content: str) -> list:
    # Split at "# N." headings (single #, not ##)
    blocks = re.split(r'\n(?=# \d+\.)', content)
    agencies = []
    for block in blocks:
        m = re.match(r'# (\d+)\.\s+(.+)', block.strip())
        if not m:
            continue
        agency_id = int(m.group(1))

        # Name
        name = get_field(block, "agency_name") or m.group(2).title()
        # Clean common formatting
        name = name.strip("*").strip()

        # Slug: derive from name if not in block
        slug_raw = get_field(block, "slug")
        if slug_raw:
            slug = slug_raw
        else:
            slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

        # Basic fields
        website = clean_url(get_field(block, "website"))
        phone = clean_phone(get_field(block, "contact_phone"))
        email = clean_email(get_field(block, "contact_email"))
        city = get_field(block, "city") or "Amsterdam"
        address = get_field(block, "address")

        # Description
        description = get_description(block)

        # Agency info section
        ai_match = re.search(r'## Agency Information\s*\n(.*?)(?=\n##|\Z)', block, re.DOTALL)
        ai = ai_match.group(1) if ai_match else ""

        sector_raw = get_field(ai, "Sectors served", "Sectors", "Sector", "Staffing focus") or ""
        agency_type = normalize_sector(sector_raw)

        job_raw = get_field(ai, "Job categories", "Job focus", "Job categories served") or ""
        job_focus = normalize_job_focus(job_raw)

        housing_raw = get_field(ai, "Accommodation mentioned", "Accommodation", "Housing") or ""
        accommodation = normalize_accommodation(housing_raw)

        # Confidence
        dc_match = re.search(r'## Data Confidence\s*\n(.*?)(?=\n---|\n#|\Z)', block, re.DOTALL)
        dc_text = dc_match.group(1) if dc_match else ""
        score_m = re.search(r'\*\*(High|Medium|Low)\*\*', dc_text, re.IGNORECASE)
        if score_m:
            transparency_score = textual_confidence_to_score(score_m.group(1))
        else:
            # Check for numeric score
            score_num = re.search(r'(\d+)/100', dc_text)
            transparency_score = int(score_num.group(1)) if score_num else 45

        supported_cities = []
        if city:
            city_slug = city.lower().replace(" ", "-").replace("'", "")
            supported_cities = [city_slug]

        agencies.append({
            "id": agency_id,
            "name": name,
            "slug": slug,
            "website": website,
            "phone": phone,
            "email": email,
            "address": address,
            "city": city,
            "agencyType": agency_type,
            "jobFocus": job_focus,
            "supportedCities": supported_cities,
            "accommodation": accommodation,
            "transparencyScore": transparency_score,
            "confidenceLevel": confidence_level(transparency_score),
            "description": description,
            "sourceType": "OFFICIAL_WEBSITE" if website else "GOOGLE_MAPS",
        })
    return agencies

# ------------------------------------------------------------------
# Format B parser (Batch 04)
# Separator: \n## {number}. {Name}
# Bold fields, textual confidence
# ------------------------------------------------------------------

def parse_format_b(content: str) -> list:
    blocks = re.split(r'\n(?=## \d+\.)', content)
    agencies = []
    for block in blocks:
        m = re.match(r'## (\d+)\.\s+(.+)', block.strip())
        if not m:
            continue
        agency_id = int(m.group(1))

        bp_match = re.search(r'### Basic Profile\s*\n(.*?)(?=\n###|\n##|\Z)', block, re.DOTALL)
        bp = bp_match.group(1) if bp_match else block

        name = get_field(bp, "agency_name", "Name", "name") or m.group(2)
        name = name.strip("*").strip()

        slug_raw = get_field(bp, "slug", "Slug")
        slug = slug_raw if slug_raw else re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

        website = clean_url(get_field(bp, "website", "Website"))
        phone = clean_phone(get_field(bp, "contact_phone", "Phone"))
        email = clean_email(get_field(bp, "contact_email", "Email"))
        city = get_field(bp, "city", "City") or "Amsterdam"
        address = get_field(bp, "address", "Address")

        description = get_description(block)

        ai_match = re.search(r'### Agency Information\s*\n(.*?)(?=\n###|\n##|\Z)', block, re.DOTALL)
        ai = ai_match.group(1) if ai_match else ""

        sector_raw = get_field(ai, "Sectors", "Sector", "Sectors served", "Staffing Focus") or ""
        agency_type = normalize_sector(sector_raw)

        job_raw = get_field(ai, "Job Categories", "Job focus", "Job categories") or ""
        job_focus = normalize_job_focus(job_raw)

        housing_raw = get_field(ai, "Accommodation/Housing for Workers", "Housing", "Accommodation") or ""
        accommodation = normalize_accommodation(housing_raw)

        dc_match = re.search(r'### Data Confidence\s*\n(.*?)(?=\n---|\n##|\Z)', block, re.DOTALL)
        dc_text = dc_match.group(1) if dc_match else ""
        score_m = re.search(r'\*\*(High|Medium|Low)\*\*', dc_text, re.IGNORECASE)
        if score_m:
            transparency_score = textual_confidence_to_score(score_m.group(1))
        else:
            score_num = re.search(r'(\d+)/100', dc_text)
            transparency_score = int(score_num.group(1)) if score_num else 45

        supported_cities = []
        if city:
            city_slug = city.lower().replace(" ", "-").replace("'", "")
            supported_cities = [city_slug]

        agencies.append({
            "id": agency_id,
            "name": name,
            "slug": slug,
            "website": website,
            "phone": phone,
            "email": email,
            "address": address,
            "city": city,
            "agencyType": agency_type,
            "jobFocus": job_focus,
            "supportedCities": supported_cities,
            "accommodation": accommodation,
            "transparencyScore": transparency_score,
            "confidenceLevel": confidence_level(transparency_score),
            "description": description,
            "sourceType": "OFFICIAL_WEBSITE" if website else "GOOGLE_MAPS",
        })
    return agencies

# ------------------------------------------------------------------
# Format C parser (Batches 05-07) — already working
# Separator: \n## {number}. {Name}, ### subsections, numeric /100
# ------------------------------------------------------------------

def parse_format_c(content: str) -> list:
    blocks = re.split(r'\n(?=## \d+\.)', content)
    agencies = []
    for block in blocks:
        m = re.match(r'## (\d+)\.\s+(.+)', block.strip())
        if not m:
            continue
        agency_id = int(m.group(1))

        bp_match = re.search(r'### Basic Profile\s*\n(.*?)(?=\n###)', block, re.DOTALL)
        bp = bp_match.group(1) if bp_match else ""

        name = get_field(bp, "Name") or m.group(2)
        name = name.strip("*").strip()

        slug = get_field(bp, "Slug") or re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        website = clean_url(get_field(bp, "Website"))
        phone = clean_phone(get_field(bp, "Phone"))
        email = clean_email(get_field(bp, "Email"))
        city = get_field(bp, "City") or "Amsterdam"
        address = get_field(bp, "Address")

        description = get_description(block)

        ai_match = re.search(r'### Agency Information\s*\n(.*?)(?=\n###)', block, re.DOTALL)
        ai = ai_match.group(1) if ai_match else ""

        sector_raw = get_field(ai, "Sector") or ""
        agency_type = normalize_sector(sector_raw)

        job_raw = get_field(ai, "Job focus") or ""
        job_focus = normalize_job_focus(job_raw)

        housing_raw = get_field(ai, "Housing") or ""
        accommodation = normalize_accommodation(housing_raw)

        dc_match = re.search(r'### Data Confidence\s*\n(.*?)(?=\n---|\Z)', block, re.DOTALL)
        dc_text = dc_match.group(1) if dc_match else ""
        score_m = re.search(r'\*\*Score:\*\*\s*(\d+)/100', dc_text)
        transparency_score = int(score_m.group(1)) if score_m else 40

        supported_cities = []
        if city:
            city_slug = city.lower().replace(" ", "-").replace("'", "")
            supported_cities = [city_slug]

        agencies.append({
            "id": agency_id,
            "name": name,
            "slug": slug,
            "website": website,
            "phone": phone,
            "email": email,
            "address": address,
            "city": city,
            "agencyType": agency_type,
            "jobFocus": job_focus,
            "supportedCities": supported_cities,
            "accommodation": accommodation,
            "transparencyScore": transparency_score,
            "confidenceLevel": confidence_level(transparency_score),
            "description": description,
            "sourceType": "OFFICIAL_WEBSITE" if website else "GOOGLE_MAPS",
        })
    return agencies

# ------------------------------------------------------------------
# Run all parsers
# ------------------------------------------------------------------

PARSERS = {"A": parse_format_a, "B": parse_format_b, "C": parse_format_c}

all_agencies = []
for filepath, fmt in BATCH_FILES:
    content = Path(filepath).read_text(encoding="utf-8")
    parser = PARSERS[fmt]
    batch = parser(content)
    if batch:
        print(f"  {Path(filepath).name} [fmt {fmt}]: {len(batch)} agencies  IDs {batch[0]['id']}–{batch[-1]['id']}")
    else:
        print(f"  {Path(filepath).name} [fmt {fmt}]: 0 agencies — CHECK!")
    all_agencies.extend(batch)

all_agencies.sort(key=lambda a: a["id"])

# Deduplicate
seen_slugs = set()
seen_ids = set()
clean_agencies = []
for a in all_agencies:
    if a["id"] in seen_ids:
        print(f"  DUPLICATE ID removed: #{a['id']} {a['name']}")
        continue
    if a["slug"] in seen_slugs:
        print(f"  DUPLICATE SLUG removed: #{a['id']} {a['name']} (slug={a['slug']})")
        continue
    seen_slugs.add(a["slug"])
    seen_ids.add(a["id"])
    clean_agencies.append(a)

print(f"\nTotal after dedup: {len(clean_agencies)} agencies")

# Check for expected IDs 1-127
expected_ids = set(range(1, 128))
found_ids = set(a["id"] for a in clean_agencies)
missing = expected_ids - found_ids
extra = found_ids - expected_ids
if missing:
    print(f"  MISSING IDs: {sorted(missing)}")
if extra:
    print(f"  EXTRA IDs: {sorted(extra)}")

# Save JSON for inspection
with open("/sessions/lucid-confident-hopper/agencies_parsed.json", "w") as f:
    json.dump(clean_agencies, f, indent=2, ensure_ascii=False)

print("\nAgency ID coverage:")
for a in clean_agencies:
    flag = " ← NO WEBSITE" if not a["website"] else ""
    flag2 = " ← NO DESCRIPTION" if not a["description"] else ""
    print(f"  #{a['id']:3d} {a['name'][:40]:<40} | {a['agencyType']:<20} | score={a['transparencyScore']:3d} | conf={a['confidenceLevel']}{flag}{flag2}")
