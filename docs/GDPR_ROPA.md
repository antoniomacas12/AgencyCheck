# Record of Processing Activities (RoPA)
## AgencyCheck — GDPR Art. 30

**Version:** 2026-08
**Next review:** 2027-08
**Controller:** AgencyCheck, obrt za poslovne usluge, vl. Antonio Maćaš | OIB: 59683153877
**Address:** Vijenac Salomona Henricha Gutmanna 5A, 31551 Belišće, Croatia
**Privacy contact:** hello@agencycheck.io

---

## 1. Controller Identity

| Field | Value |
|---|---|
| Legal name | AgencyCheck, obrt za poslovne usluge, vl. Antonio Maćaš |
| OIB | 59683153877 |
| MBO | 99352117 |
| Obrtnica number | 14010402288 |
| Legal form | Obrt (Croatian sole proprietorship) |
| Address | Vijenac Salomona Henricha Gutmanna 5A, 31551 Belišće, Croatia |
| Supervisory authority | Agencija za zaštitu osobnih podataka (AZOP) — azop.hr |
| DPO required? | No — sole trader, no large-scale special-category processing |

---

## 2. Processing Activities

### Activity 1 — Worker review submission

| Field | Detail |
|---|---|
| Activity | Worker submits agency review (star ratings, optional text comment) |
| Categories of data | Star ratings (1–5), optional comment text, agency name, timestamp. No identity collected. |
| Data subjects | Workers (anonymous — no name or identifier linked to submission) |
| Purpose | Publishing crowd-sourced transparency data to help other workers make informed decisions |
| Lawful basis | Legitimate interest — Art. 6(1)(f) |
| Recipients | None — stored internally and displayed publicly in anonymised form |
| Processors | Vercel (hosting), Supabase (database) |
| International transfers | Vercel (USA — SCCs); Supabase (EU region — no transfer) |
| Retention | 5 years from submission, or until deletion request |
| Notes | Reviews are the core product. Not personal data in the GDPR sense (anonymous by design). |

---

### Activity 2 — Job application via HomepageLeadForm / CandidateLeadForm

| Field | Detail |
|---|---|
| Activity | Candidate submits job interest form with contact details |
| Categories of data | Name, phone number, optionally: email, nationality, current country, experience level, housing preference, job type interest |
| Data subjects | Job-seeking candidates |
| Purpose | Matching workers with suitable recruitment/staffing partners |
| Lawful basis | Consent — Art. 6(1)(a) (explicit consent checkbox on form, version-tracked) |
| Recipients | Selected recruitment/staffing agencies (via email forwarding by admin) |
| Processors | Vercel (hosting), Supabase (database), Resend (email delivery) |
| International transfers | Vercel (USA — SCCs); Resend (USA — SCCs); Supabase (EU region) |
| Retention | Up to 12 months from submission; deleted on request at any time. Placed candidates: personal data anonymised at 12 months; financial records per Croatian accounting law (period pending legal verification). |
| Notes | sourceType stored: "candidate_homepage_consent". Consent version tracked in gdprConsentVersion and gdprPrivacyPolicyVersion fields. |

---

### Activity 3 — WhatsApp apply (pre-qualification gate)

| Field | Detail |
|---|---|
| Activity | Candidate answers EU citizenship gate and is assigned a recruiter via WhatsApp |
| Categories of data | EU citizenship status (boolean), BSN status (boolean), job title, source identifier, timestamp. AgencyCheck does NOT collect phone number. |
| Data subjects | Job-seeking candidates |
| Purpose | Pre-contractual eligibility check and recruiter assignment prior to job placement |
| Lawful basis | Pre-contractual steps at data subject's request — Art. 6(1)(b) |
| Recipients | Assigned recruiter coordinator (sees WhatsApp identity only when candidate initiates message) |
| Processors | Vercel (hosting), Supabase (database) |
| International transfers | Vercel (USA — SCCs) |
| Retention | 12 months from submission |
| Notes | Pre-qualification answers stored in PreQualification model. sourceType: various ("job_page", "agency_page" etc.) |

---

### Activity 4 — Lead forwarding to recruitment agencies

| Field | Detail |
|---|---|
| Activity | Admin forwards candidate lead data to a selected recruitment/staffing agency via email |
| Categories of data | Name, phone, optionally email, nationality, current country, experience level, housing preference, notes |
| Data subjects | Job-seeking candidates |
| Purpose | Job placement matching — connecting candidate with relevant agency |
| Lawful basis | Art. 6(1)(a) consent (for consent_art6a leads) or Art. 6(1)(b) pre-contractual (for precontract_art6b leads) — matches the basis recorded at submission |
| Recipients | Named recruitment/staffing agency coordinator |
| Processors | Resend (email delivery) |
| International transfers | Resend (USA — SCCs) |
| Retention | LeadSharingEvent record retained for accountability per Art. 5(2) |
| Notes | Every share creates a LeadSharingEvent audit record. Shareable fields logged in dataFields column. |

---

### Activity 5 — Admin error monitoring via Sentry

| Field | Detail |
|---|---|
| Activity | Application error reports sent to Sentry when server errors occur |
| Categories of data | Stack traces, request metadata (method, path, status code), runtime context. Candidate names, phones, and emails explicitly excluded from Sentry payloads. |
| Data subjects | N/A (no PII in error reports by design) |
| Purpose | Platform reliability and security monitoring |
| Lawful basis | Legitimate interest — Art. 6(1)(f) |
| Recipients | None |
| Processors | Sentry / Functional Software Inc. |
| International transfers | USA — SCCs apply |
| Retention | Per Sentry platform policy |

---

### Activity 6 — Cookieless analytics via Vercel Analytics

| Field | Detail |
|---|---|
| Activity | Aggregated page view statistics collected by Vercel Analytics |
| Categories of data | Aggregated page views, country, device type. No individual tracking. No cookies. |
| Data subjects | N/A — aggregated data; no individual identifiable |
| Purpose | Understanding platform usage to improve the service |
| Lawful basis | Legitimate interest — Art. 6(1)(f) (no cookie consent required — no cookies set) |
| Recipients | None |
| Processors | Vercel Inc. |
| International transfers | USA — SCCs apply |
| Retention | 90-day rolling window (Vercel platform policy) |

---

### Activity 7 — Admin session management

| Field | Detail |
|---|---|
| Activity | Admin user authenticated via httpOnly session cookie |
| Categories of data | Session token (hashed), login timestamp |
| Data subjects | Admin (single controller/owner) |
| Purpose | Security — preventing unauthorised access to admin panel |
| Lawful basis | Legitimate interest — Art. 6(1)(f) |
| Recipients | None |
| Processors | Vercel (hosting), Supabase (session data) |
| International transfers | Vercel (USA — SCCs) |
| Retention | 8 hours (automatic expiry) |

---

### Activity 8 — Candidate reliability notes

| Field | Detail |
|---|---|
| Activity | Admin creates private notes on candidate behaviour/quality for recruitment screening purposes |
| Categories of data | Candidate name (from associated lead), note type, severity, incident date, note text. No special-category data. |
| Data subjects | Candidates who have previously applied |
| Purpose | Recruitment quality control — identifying patterns of unreliable behaviour to protect agency partners |
| Lawful basis | Legitimate interest — Art. 6(1)(f) |
| Recipients | None (internal admin use only) |
| Processors | Vercel (hosting), Supabase (database) |
| International transfers | Vercel (USA — SCCs) |
| Retention | Maximum 12 months unless required for active legal/security matter |

---

### Activity 9 — Candidate restriction records

| Field | Detail |
|---|---|
| Activity | Admin blocks a phone number from the platform due to abuse or misuse |
| Categories of data | Normalised phone number, reason category, severity, internal note. No IP addresses stored (data minimisation). |
| Data subjects | Individuals whose phone numbers are restricted |
| Purpose | Platform security — preventing serial abuse of the apply system |
| Lawful basis | Legitimate interest — Art. 6(1)(f) |
| Recipients | None |
| Processors | Vercel (hosting), Supabase (database) |
| International transfers | Vercel (USA — SCCs) |
| Retention | 12 months |

---

## 3. Processors List

| Processor | Role | Location | DPA / Privacy |
|---|---|---|---|
| Vercel Inc. | Hosting, analytics | USA (SCCs) | vercel.com/legal/dpa |
| Supabase | Database (PostgreSQL) | EU region | supabase.com/privacy |
| Resend | Transactional email | USA (SCCs) | resend.com/privacy |
| Sentry / Functional Software Inc. | Error monitoring | USA (SCCs) | sentry.io/legal/dpa/ |

---

## 4. International Transfers

All international transfers to USA-based processors (Vercel, Resend, Sentry) are covered by EU Standard Contractual Clauses (SCCs) as specified in each processor's DPA documentation. The Supabase database runs in an EU region; no international transfer applies.

---

## 5. Technical and Organisational Safeguards

- HTTPS (TLS) encryption in transit for all connections
- Database access restricted to application-level queries via Prisma ORM
- Admin panel protected by httpOnly session cookie (8-hour expiry)
- Candidate PII (name, phone, email) explicitly excluded from Sentry error payloads
- No advertising networks, tracking pixels, or third-party analytics cookies
- Vercel Analytics: cookie-free, no individual tracking
- Data minimisation: restriction logs store no IP addresses or user agents
- Consent versioning: gdprConsentVersion and gdprPrivacyPolicyVersion tracked per lead
- Audit trail: LeadSharingEvent created for every candidate data share; AdminExportLog for bulk exports

---

## 6. Version History

| Version | Date | Changes |
|---|---|---|
| 2026-08 | August 2026 | Initial RoPA — Croatian Obrt, AZOP supervisory authority, Supabase database, GDPR Phase 18-21 accountability fields |
