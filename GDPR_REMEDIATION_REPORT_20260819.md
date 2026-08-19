# AgencyCheck — GDPR/Privacy/Security Remediation Report
**Date:** 19 August 2026  
**Prepared by:** Claude (automated implementation session)  
**Scope:** Phases 1–23 of the AgencyCheck GDPR/privacy/security remediation  
**Status:** Implementation complete — owner action items documented below

---

## A. Executive Summary

All planned code changes have been implemented. TypeScript compiles with zero errors. 17 existing files were modified; 2 new files and 1 directory were added. No candidate data was modified, no production deployment was made, no destructive SQL was run. The changes address the following risk categories:

| Risk | Before | After |
|------|--------|-------|
| GA4 tracking without cookie consent | Active (collecting data, contradicting privacy policy) | Removed — Vercel Analytics only |
| Sentry capturing candidate PII | fullName in error payloads | Removed — sourceType/sourcePage only |
| CandidateLeadForm had no GDPR notice | No notice at point of collection | Art. 13 notice added |
| ApplyPreScreen had no GDPR disclosure | No disclosure | Disclosure added before submit |
| Privacy/transparency pages contradicted each other on retention | 12 months vs 90 days | Unified: 12 months, no false automation claim |
| Sentry not disclosed as a data processor | Absent from both policy pages | Added to privacy page (2f) and transparency page (Section 5) |
| Two admin API routes had no authentication | /api/admin/recruiters, /api/admin/funnel | Both now require valid admin session |
| Webhook token hardcoded only (no env var path) | Hardcoded only | Env var primary, hardcoded fallback |
| No GDPR accountability fields on Lead records | None | 6 new nullable fields in schema |
| No data-sharing audit trail | None | LeadSharingEvent model added |

**Conversion impact:** Zero new required fields, zero new required clicks, zero new application screens. All privacy notices are passive disclosures (non-blocking). The HomepageLeadForm consent checkbox wording was updated but the checkbox mechanism is unchanged.

---

## B. Rollback / Recovery

A rollback tag was created before any changes:

```
git tag gdpr-pre-remediation-20260819
```

To roll back all changes:
```bash
git checkout gdpr-pre-remediation-20260819
```

The SQL migration (`prisma/gdpr_phase18_accountability.sql`) adds nullable columns with `IF NOT EXISTS` guards. If rolled back before running the SQL, no DB changes exist. If rolled back after running the SQL, the columns remain in the DB but the application will simply not use them — no harm.

---

## C. Phase 1 — GA4 Removal

**File:** `app/layout.tsx`  
**Action:** Removed the Google Analytics 4 script block (two `<Script>` tags for gtag.js and the GA4 initialisation). The `import Script from "next/script"` import was also removed as it was only used for GA4.

**File:** `lib/analytics.ts`  
**Action:** Fully rewritten. Removed `gtag` window interface declaration. Replaced `fireEvent()` implementation with `import { track as vercelTrack } from "@vercel/analytics"`. All four exported function signatures are preserved identically (`trackWhatsappClick`, `trackApplyJobClick`, `trackCandidateFormSubmit`, `trackReviewSubmit`). No call sites required changes.

**Privacy policy status:** Section 3 of `/privacy` already stated "We do not use Google Analytics or Meta Pixel" — this was inaccurate before the change. It is now accurate. No edit to the privacy page was needed for this item.

**ePrivacy status:** No cookie banner required. Vercel Analytics is cookieless. The admin session cookie is essential/functional and exempt under Dutch Telecommunicatiewet art. 11.7a.

---

## D. Phases 2–3 — Sentry PII Audit & Disclosure

**Audit scope:** All `captureException` call sites across the codebase.

| File | Calls found | PII before | PII after |
|------|-------------|------------|-----------|
| `app/api/leads/route.ts` | 1 | fullName, phone/email in `extra` and `console.error` | Removed — only sourceType, sourcePage retained |
| `app/api/referral-click/route.ts` | 2 | No candidate PII (tags + jobId/jobTitle only) | No change needed |
| `app/api/referral-redirect/route.ts` | 2 | recruiter name (not candidate PII), jobId/jobTitle | No change needed |

**Disclosure added:**
- `/privacy` page — new subsection 2(f): "Error monitoring (technical)" — identifies Sentry (Functional Software Inc.), states it captures stack traces/request metadata, confirms candidate names/phones/emails are excluded
- `/transparency` page — Sentry added to Section 5 (Third-party data processors) with DPA and privacy policy links

---

## E. Phase 4 — Candidate Entry Flow Map (Read-Only)

Four distinct candidate entry flows identified:

| Flow | Component | API | DB storage | Recruiter OS |
|------|-----------|-----|------------|--------------|
| 1. HomepageLeadForm | `components/HomepageLeadForm.tsx` | POST /api/leads | `leads` table (`sourceType: "general_apply"`) | No |
| 2. CandidateLeadForm | `components/CandidateLeadForm.tsx` | POST /api/leads | `leads` table (`sourceType: "candidate_homepage"`) | No |
| 3. ApplyPreScreen (WhatsApp) | `components/ApplyPreScreen.tsx` | POST /api/apply-webhook + POST /api/referral-click | `phone_applications` (dedup only) | Yes — via /api/apply-webhook |
| 4. Partner vacancies apply | `app/partner-vacancies/[slug]/apply/page.tsx` | None (WhatsApp direct) | Not stored | No — goes to WRX_WA_NUMBER directly |

No code changes made in Phase 4.

---

## F. Phase 5 — HomepageLeadForm Consent Wording

**File:** `components/HomepageLeadForm.tsx`  
**sourceType:** `"general_apply"`  
**Lawful basis:** Art. 6(1)(a) — explicit consent (checkbox required to proceed)

**Change:** Consent checkbox wording updated from "up to 3 registered Dutch labour agencies" to "selected recruitment/staffing partners" — broader and accurate for potential future partners outside the Netherlands or outside ABU.

**No structural changes:** Checkbox unchecked by default, blocking (`canStep2` requires `gdprOk === true`), position unchanged.

---

## G. Phase 6 — CandidateLeadForm Privacy Notice

**File:** `components/CandidateLeadForm.tsx`  
**sourceType:** `"candidate_homepage"`  
**Lawful basis:** Art. 6(1)(b) — pre-contractual (no consent checkbox required or added)

**Change:** Added Art. 13 privacy notice below the submit button. Notice states purpose (matching with recruitment/staffing partners), that partners may contact the candidate, and provides links to `/privacy` and `/privacy#rights`.

Removed inaccurate microcopy: "No spam" (partners will contact them) and "Recruiter contacts you within 24h" (unverifiable guarantee). Replaced with "Free · No agency fees charged to candidates".

**No blocking controls added.** No new required fields.

---

## H. Phase 7 — ApplyPreScreen GDPR Disclosure

**File:** `components/ApplyPreScreen.tsx`  
**Lawful basis:** Art. 6(1)(b) — pre-contractual  
**Data destination:** (1) Recruiter OS via /api/apply-webhook, (2) Recruiter directly via WhatsApp (candidate's contact details become visible to the recruiter through WhatsApp itself)

**Change:** Added passive disclosure paragraph below the "EU citizenship or valid NL work permit required" line, before the Apply via WhatsApp button. Disclosure identifies that contact details become visible to the recruitment partner via WhatsApp and that pre-qualification answers are processed for job placement. Links to `/privacy`.

**No new blocking controls.** All routing logic, EU validation, geo gate, dedup, round-robin — untouched.

---

## I. Phase 8 — Partner-Vacancies Partner Name Disclosure

**File:** `app/partner-vacancies/[slug]/apply/page.tsx`

**Change:** Updated the GDPR disclosure paragraph from generic "a recruiter partner" to the actual `vacancy.partner` name. `vacancy.partner` was already available in the component scope (used in the header). Wording clarified: "your answers will be shared with [Partner Name] for job placement purposes."

---

## J. Phase 9 — Privacy Page Updates

**File:** `app/privacy/page.tsx`  
**LAST_UPDATED:** "April 2026" → "August 2026"

Changes made:

| Section | Before | After |
|---------|--------|-------|
| 2(d) lawful basis | "you consent to this by submitting the form" | Accurate dual-basis disclosure: Art. 6(1)(a) for forms with consent checkbox, Art. 6(1)(b) for pre-contractual forms |
| 2(d) partner description | "employment agencies" | "recruitment/staffing partners" |
| 2(f) [new] | Absent | Sentry error monitoring disclosure added |
| 6 retention (lead data) | "12 months; deleted automatically after this period" | "Up to 12 months; deleted on request at any time; manual review at retention date" |
| 7 GDPR rights [added paragraph] | No mention of internal accountability records | Note added: restriction/erasure requests generate internal accountability records kept ≤3 years (Art. 5(2)) |

---

## K. Phase 10 — Transparency Page Updates

**File:** `app/transparency/page.tsx`  
**LAST_UPDATED:** "May 2026" → "August 2026"  
**dateModified schema markup:** "2026-05-01" → "2026-08-19"

Changes made:

| Section | Before | After |
|---------|--------|-------|
| Section 3 — lead form legal basis | "Contract performance (Art. 6(1)(b)) + Consent (Art. 6(1)(a))" | "Art. 6(1)(b) pre-contractual + Art. 6(1)(a) consent (form-dependent)" |
| Section 3 — lead form purpose | "Submitting this form is explicit consent" | Accurate: basis depends on which form; described per-form |
| Section 3 — retention | "90 days if no match" | "Up to 12 months from submission; manual review at retention date" |
| Section 4 retention table | "90 days" / "Automatic after 90 days if no match" | "12 months" / "Manual review at retention date; immediate on request" |
| Section 5 processors | Vercel, Neon, Resend (3 entries) | Added Sentry (Functional Software Inc.) with DPA + privacy links |

---

## L. Phase 11 — Terms Page Verification

**File:** `app/terms/page.tsx`  
**LAST_UPDATED:** "April 2026" → "August 2026"

**Verified complete:** All 12 sections present and adequate — platform description, no-advice disclaimer, user-submitted content rules (truthfulness, personal experience, no personal data, no illegal content, photo responsibility, licence grant), agency data accuracy + certification status warning, no affiliation, limitation of liability, acceptable use, content moderation policy (with agency dispute process and worker appeal process), DSA illegal-content reporting, governing law, changes clause, contact.

**One inconsistency fixed:** Section 10 governing law referenced "courts of Amsterdam" while the transparency page referenced "Rechtbank Rotterdam". Aligned to Rechtbank Rotterdam to match the transparency page and operator's location area.

---

## M. Phase 12 — Retention Policy Consistency

**Root cause:** Privacy page said "12 months" and "deleted automatically"; transparency page said "90 days" and "automatic". Neither matched reality (no automatic deletion exists).

**Resolution:** Both pages now say "up to 12 months" and "manual review at retention date; immediate on request". All four instances of false "automatic" deletion language removed across both pages.

---

## N. Phase 13 — Admin Auth Credentials (WAITING FOR OWNER ACTION)

**File:** `lib/adminAuth.ts`

**Finding:** Three hardcoded fallback values exist for `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. The password fallback is committed to git history.

**Action taken:** Added `console.warn` calls in production mode when env vars are missing — visible in Vercel function logs. Added detailed ACTION REQUIRED comment block documenting exactly what needs to be done.

**Fallback values NOT changed** — doing so would break the live admin panel if Vercel env vars are not yet set. This is intentional per the spec constraint.

### ⚠️ OWNER ACTION REQUIRED — Admin Credentials

In Vercel dashboard → Settings → Environment Variables, set:
1. `ADMIN_EMAIL` — your admin login email  
2. `ADMIN_PASSWORD` — a strong unique password (not the current fallback)  
3. `ADMIN_SESSION_SECRET` — a 32+ character random string

Generate a secure secret:
```bash
openssl rand -hex 32
```

After setting env vars and redeploying, verify admin login works, then remove the hardcoded fallback values from `lib/adminAuth.ts` in a follow-up commit.

---

## O. Phase 14 — Webhook Token Environment Variable Migration

**File:** `app/api/apply-webhook/route.ts`

**Action:** Added `process.env.RECRUITER_OS_WEBHOOK_TOKEN` and `process.env.RECRUITER_OS_WEBHOOK_URL` support. Hardcoded values remain as fallbacks so the live system continues to function unchanged.

### ⚠️ OWNER ACTION REQUIRED — Webhook Token Rotation

**Coordination required with Recruiter OS team:**

1. Set `RECRUITER_OS_WEBHOOK_TOKEN` = [new token to be generated with Recruiter OS] in Vercel env vars  
2. Set `RECRUITER_OS_WEBHOOK_URL` = `https://recruiter.agencycheck.io/api/wapp-apply` in Vercel env vars  
3. Coordinate with Recruiter OS to update the expected token on their end simultaneously  
4. Deploy and verify apply flow works  
5. Once confirmed, remove the hardcoded fallback values from `app/api/apply-webhook/route.ts`

The existing hardcoded token is in git history — consider it compromised for future use once rotated.

---

## P. Phase 15 — Rate Limiting

**Action:** Documented recommendation in `app/api/admin/auth/login/route.ts` header comment.

**Recommendation:** Use Vercel Firewall (vercel.com → Project → Firewall → Custom Rules) to rate-limit `/api/admin/auth/login`:
- Condition: Same IP makes > 10 requests to that path within 60 seconds
- Action: Block with 429

No npm packages added. The existing 300ms artificial delay on failed attempts in `adminAuth.ts` continues to provide base brute-force protection.

Candidate-facing endpoints (`/api/leads`, `/api/apply-webhook`) have no server-side rate limiting — Vercel's edge network provides basic DDoS protection. Recommend monitoring via Vercel Analytics for abuse patterns before adding throttling that could block legitimate candidates.

---

## Q. Phase 16 — API Security Review

**Auth guard audit across all `/api/admin/*` routes:**

| Route | Before | After |
|-------|--------|-------|
| GET /api/admin/recruiters | ❌ NO AUTH | ✅ Fixed |
| PATCH /api/admin/recruiters | ❌ NO AUTH | ✅ Fixed |
| GET /api/admin/funnel | ❌ NO AUTH | ✅ Fixed |
| GET /api/admin/leads | ✅ Guarded | No change |
| GET /api/admin/leads/export | ✅ Guarded | No change |
| GET/POST /api/admin/leads/[id]/send | ✅ Guarded | No change |
| GET/POST /api/admin/restrictions | ✅ Guarded | No change |
| GET/DELETE /api/admin/restrictions/[id] | ✅ Guarded | No change |
| GET /api/admin/leads/[id] | ✅ Guarded | No change |
| PATCH /api/admin/leads/[id]/approve | ✅ Guarded | No change |
| All other admin/* routes | ✅ Guarded | No change |

**Session cookie settings verified (lib/adminAuth.ts):**
- `httpOnly: true` ✅
- `secure: process.env.NODE_ENV === "production"` ✅
- `sameSite: "strict"` ✅
- `maxAge: 28800` (8 hours) ✅
- Cookie name: `ac_admin_session` ✅

**Impact of unguarded recruiters route:** Before fix, any unauthenticated request could read all recruiter names and WhatsApp URLs, and could disable/enable any recruiter — silently disrupting candidate routing without the admin's knowledge. **This was a critical finding.**

---

## R. Phase 17 — Processor/DPA Owner Checklist

The following processors are used by AgencyCheck. The owner should verify DPA status with each:

| Processor | Role | DPA location | Action needed |
|-----------|------|-------------|---------------|
| **Vercel Inc.** | Hosting + analytics | vercel.com/legal/dpa | Sign if not already done; confirm EU data residency settings |
| **Neon (via Vercel)** | PostgreSQL database | neon.tech/privacy-policy | Confirm EU region (AWS eu-west-1) is configured; check DPA acceptance |
| **Resend** | Transactional email | resend.com/privacy | Confirm DPA accepted; check EU → US transfer mechanism (SCCs) |
| **Sentry.io** | Error monitoring | sentry.io/legal/dpa/ | Accept DPA in Sentry organisation settings; configure data scrubbing rules |
| **WhatsApp (Meta)** | Candidate communication channel | — | Note: AgencyCheck does not store WhatsApp data; candidates use their own WhatsApp account. The recruiter/partner uses WhatsApp on their own behalf. No DPA required from AgencyCheck. |

**Sentry data scrubbing recommendation:** In Sentry dashboard → Settings → Security & Privacy → Data Scrubbing, add custom patterns for:
- Phone number patterns (e.g. `\+?[\d\s\-]{7,15}`)
- Email addresses (Sentry has a built-in rule for these — verify it's enabled)

---

## S. Phase 18 — GDPR Accountability Fields

**Files modified:** `prisma/schema.prisma`, `app/api/leads/route.ts`  
**New file:** `prisma/gdpr_phase18_accountability.sql`

Six nullable fields added to the `Lead` model in `schema.prisma`:

| Field | Type | Purpose |
|-------|------|---------|
| `gdprLawfulBasis` | `String?` | Records the legal basis used at collection: `"consent_art6a"` or `"precontract_art6b"` |
| `gdprConsentAt` | `DateTime?` | Timestamp of consent — populated only for `consent_art6a` submissions |
| `gdprRestricted` | `Boolean @default(false)` | True when an Art. 18 restriction request has been acknowledged |
| `gdprRestrictedAt` | `DateTime?` | When the restriction was applied |
| `gdprRestrictedReason` | `String?` | Reason for restriction |
| `gdprErasureRequestedAt` | `DateTime?` | When an Art. 17 erasure request was received |

**`app/api/leads/route.ts`:** Updated to populate `gdprLawfulBasis` and `gdprConsentAt` on every new lead:
- `sourceType: "general_apply"` → `gdprLawfulBasis: "consent_art6a"`, `gdprConsentAt: new Date()`
- All other sourceTypes → `gdprLawfulBasis: "precontract_art6b"`, `gdprConsentAt: null`

**Historical records:** All pre-Phase-18 leads will have `gdprLawfulBasis: null`. No backfill.

### ⚠️ OWNER ACTION REQUIRED — Run SQL Migration

Apply `prisma/gdpr_phase18_accountability.sql` via:
- **Option A (Supabase):** Supabase dashboard → SQL editor → paste file → Run
- **Option B (direct connection):** `psql $DIRECT_URL -f prisma/gdpr_phase18_accountability.sql`

Then run `npx prisma generate` locally to update the TypeScript client types. This will resolve the two `@ts-expect-error` annotations in `app/api/leads/route.ts` and `app/api/admin/gdpr/retention-cleanup/route.ts`.

**Do NOT run `prisma db push` against production.**

---

## T. Phase 19 — LeadSharingEvent Model (GDPR Audit Trail)

**File:** `prisma/schema.prisma` (new model, included in same SQL migration)

New `LeadSharingEvent` model provides an explicit GDPR Art. 5(2) accountability trail for every time candidate data is forwarded to a recruitment/staffing partner.

Fields: `id`, `createdAt`, `leadId`, `partnerName`, `partnerEmail`, `partnerSlug`, `lawfulBasis`, `purposeNote`, `sharedByAdmin`, `dataFields` (JSON array of field names), `leadSendId` (optional reference to existing LeadSend record).

**Note:** The existing `LeadSend` model already tracks email sends. `LeadSharingEvent` is distinct — it is the explicit GDPR accountability record and supports Art. 15 right-of-access responses ("your data was shared with X on date Y for purpose Z").

**Integration:** The admin send flow (`/api/admin/leads/[id]/send`) does not yet create `LeadSharingEvent` records automatically — this is a follow-up task for Phase 2 of the remediation. The model is in place; wiring it into the send flow requires a separate sprint.

---

## U. Phase 20 — Historical Candidates Categorisation

**No code changes.** Read-only analysis only.

Historical leads categorised by GDPR risk level for partner sharing:

| Group | sourceType | GDPR basis at collection | Risk for sharing | Recommendation |
|-------|-----------|-------------------------|------------------|----------------|
| **A — Safe** | `general_apply` | Consent checkbox was present and blocking | Low | Safe to share with partners under the consent basis |
| **B — Needs review** | `candidate_homepage` | No privacy notice shown before this remediation | Medium | Obtain re-consent or conduct Legitimate Interest Assessment (LIA) before sharing |
| **C — Unknown** | All others (`job_page`, `agency_page`, `reachtruck_apply`, `rent_calculator`, `jobs_with_housing`) | Basis not confirmed — forms not fully audited | Unknown | Audit each form individually before sharing |

**Owner action:** Before sharing any Group B or C leads with partners, conduct a LIA or re-contact campaign. Group A leads (sourceType = "general_apply") are safe to share under the consent already captured.

---

## V. Phase 21 — Retention Cleanup Endpoint (Dry-Run Only)

**New file:** `app/api/admin/gdpr/retention-cleanup/route.ts`

`GET /api/admin/gdpr/retention-cleanup` — requires admin session.

Reports leads eligible for deletion under the 12-month retention policy. **Never deletes.** The response includes:
- `dryRun: true` — always
- `cutoffDate` — the 12-month threshold
- `eligibleCount` — number of leads that would be deleted
- `excluded.active` — how many were excluded (status: converted/confirmed/paid)
- `bySourceType` — breakdown of eligible leads by sourceType
- `eligibleIds` — first 200 IDs (no PII included)
- `message` — human-readable summary

**Live deletion is not implemented.** When the owner is ready to perform deletion, it must be a manually reviewed, separate coordinated action — not automated.

---

## W. Phases 22–23 — Terms Verification + Croatian Obrt Config

### Phase 22 — Terms page

**File:** `app/terms/page.tsx` — VERIFIED COMPLETE. 12 sections covering all required areas for GDPR + Dutch ecommerce law + DSA compliance. Updated `LAST_UPDATED` to August 2026. Fixed governing law section to reference Rechtbank Rotterdam (consistent with transparency page).

### Phase 23 — Croatian Obrt Configuration Preparation

**File:** `lib/legalConfig.ts` — Added detailed comment block listing all 7 locations in the codebase that require updates when Croatian obrt registration details become available:

1. `lib/legalConfig.ts` — legalName, kvkNumber (→ OIB), vatNumber (→ PDV), address, emails
2. `app/transparency/page.tsx` ~line 99 — hardcoded "Eenmanszaak (sole trader)" string
3. `app/transparency/page.tsx` — "Verify at kvk.nl" link → Croatian business register
4. `app/transparency/page.tsx` — supervisory authority: AP (Dutch) → AZOP (Croatian)
5. `app/privacy/page.tsx` — supervisory authority reference
6. `app/terms/page.tsx` — governing law: Netherlands → Croatia, Rechtbank Rotterdam → Croatian court
7. `app/transparency/page.tsx` — "Wet elektronische handel" → Croatian equivalent

**Do not update any of the above until confirmed Croatian obrt registration details are available.**

---

## Appendix 1 — TypeScript Verification Log

| Checkpoint | Status |
|------------|--------|
| After Phase 1 (GA4 removal + analytics rewrite) | ✅ EXIT:0 |
| After Phases 2–3 (Sentry PII fix) | ✅ EXIT:0 |
| After Phases 5–8 (form privacy notices) | ✅ EXIT:0 |
| After Phases 9–12 (policy pages) | ✅ EXIT:0 |
| After Phase 13–16 (admin security) | ✅ EXIT:0 |
| After Phase 17–21 (GDPR fields — post @ts-expect-error workaround) | ✅ EXIT:0 |
| **Final check** | ✅ EXIT:0 |

Note: Two `@ts-expect-error` annotations exist in `app/api/leads/route.ts` and `app/api/admin/gdpr/retention-cleanup/route.ts`. These resolve automatically when the owner runs `npx prisma generate` after applying the SQL migration.

---

## Appendix 2 — Git Diff Summary

**17 modified files, 2 new additions, 0 deletions of existing files:**

```
M  app/api/admin/auth/login/route.ts        Phase 15 — rate limiting comment
M  app/api/admin/funnel/route.ts            Phase 16 — auth guard added
M  app/api/admin/recruiters/route.ts        Phase 16 — auth guard added (GET + PATCH)
M  app/api/apply-webhook/route.ts           Phase 14 — env var support for webhook token
M  app/api/leads/route.ts                   Phase 2 (Sentry PII) + Phase 18 (GDPR fields)
M  app/layout.tsx                           Phase 1 — GA4 scripts removed
M  app/partner-vacancies/[slug]/apply/page.tsx  Phase 8 — partner name in disclosure
M  app/privacy/page.tsx                     Phases 9–12 — lawful basis, Sentry, retention, date
M  app/terms/page.tsx                       Phase 12 — date + Rechtbank Rotterdam
M  app/transparency/page.tsx                Phases 9–12 — retention, processors, date
M  components/ApplyPreScreen.tsx            Phase 7 — GDPR disclosure added
M  components/CandidateLeadForm.tsx         Phase 6 — privacy notice added
M  components/HomepageLeadForm.tsx          Phase 5 — consent wording updated
M  lib/adminAuth.ts                         Phase 13 — env var warnings, security comments
M  lib/analytics.ts                         Phase 1 — migrated to Vercel Analytics
M  lib/legalConfig.ts                       Phase 23 — Croatian obrt TODO comment block
M  prisma/schema.prisma                     Phases 18–19 — GDPR fields + LeadSharingEvent

?? app/api/admin/gdpr/retention-cleanup/route.ts   Phase 21 — dry-run cleanup endpoint (NEW)
?? prisma/gdpr_phase18_accountability.sql           Phases 18–19 — SQL migration file (NEW)
```

**Files NOT touched (confirmed):**
- All recruiter routing logic (`lib/recruiter-db.ts`, `lib/partnerVacancies.ts`)
- All WhatsApp redirect logic
- All SEO pages and structured data
- All agency data files
- All vacancy/job listing files
- All review and salary report logic
- Existing candidate records (no data modified)

---

## Appendix 3 — Owner Action Checklist

Priority order for post-remediation owner actions:

| # | Priority | Action | File/Location |
|---|----------|--------|---------------|
| 1 | 🔴 CRITICAL | Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL` in Vercel env vars | Vercel dashboard |
| 2 | 🔴 CRITICAL | After step 1: remove hardcoded password and secret fallback values from `lib/adminAuth.ts` | lib/adminAuth.ts lines ~24–26 |
| 3 | 🔴 CRITICAL | Coordinate webhook token rotation with Recruiter OS team; set `RECRUITER_OS_WEBHOOK_TOKEN` + `RECRUITER_OS_WEBHOOK_URL` in Vercel | Vercel dashboard |
| 4 | 🔴 CRITICAL | After step 3: remove hardcoded fallback token from `app/api/apply-webhook/route.ts` | app/api/apply-webhook/route.ts lines ~22–25 |
| 5 | 🟠 HIGH | Apply `prisma/gdpr_phase18_accountability.sql` to production DB | Supabase SQL editor |
| 6 | 🟠 HIGH | Run `npx prisma generate` locally after step 5 | Terminal |
| 7 | 🟠 HIGH | Add Vercel Firewall rule: rate-limit `/api/admin/auth/login` to 10 req/60s per IP | Vercel Firewall |
| 8 | 🟠 HIGH | Verify DPA status with Vercel, Neon, Resend, Sentry (see Section R) | — |
| 9 | 🟠 HIGH | Add Sentry data scrubbing rules for phone patterns | Sentry dashboard |
| 10 | 🟡 MEDIUM | KvK registration: fill in `LEGAL.kvkNumber` in `lib/legalConfig.ts` | lib/legalConfig.ts |
| 11 | 🟡 MEDIUM | Wire `LeadSharingEvent` creation into admin send flow | app/api/admin/leads/[id]/send/route.ts |
| 12 | 🟡 MEDIUM | Review Group B historical leads (sourceType: "candidate_homepage") — LIA or re-consent before sharing | Admin panel |
| 13 | 🟡 MEDIUM | Test retention cleanup endpoint: `GET /api/admin/gdpr/retention-cleanup` | Admin session |
| 14 | 🟢 LOW | When Croatian obrt registered: update all 7 locations listed in lib/legalConfig.ts | See Phase 23 comment block |

---

## Appendix 4 — Conversion Impact Assessment

**New required fields added to any form:** 0  
**New required clicks added to any flow:** 0  
**New application screens added:** 0  
**Blocking privacy controls added:** 0  

Changes by form:

| Form | Change type | Impact |
|------|-------------|--------|
| HomepageLeadForm | Consent wording update only | Zero — checkbox mechanics unchanged |
| CandidateLeadForm | Passive notice added below submit button | Zero friction — no action required from user |
| ApplyPreScreen | Passive disclosure paragraph added | Zero friction — one extra line of text visible before clicking |
| Partner-vacancies apply | Partner name added to existing disclosure | Zero — disclosure already existed |

The consent checkbox on HomepageLeadForm was already present and blocking before this remediation. No new blocking mechanism was added.

---

## Appendix 5 — What Was NOT Implemented (Deferred)

The following items from the original scope are either deferred or require owner action before they can be implemented:

| Item | Reason not implemented |
|------|----------------------|
| Live automatic data deletion | Spec mandates dry-run only; live deletion requires owner authorisation |
| LeadSharingEvent auto-creation on send | Requires Phase 18 SQL migration to be applied first; then a follow-up wiring sprint |
| Admin auth fallback removal | Requires owner to confirm Vercel env vars are set first |
| Webhook token rotation | Requires coordination with Recruiter OS team |
| Sentry PII scrubbing rules | Dashboard action, not code |
| Croatian obrt legal entity update | Details not yet available |
| Processor DPA acceptance | Dashboard actions with each vendor |

---

*Report generated: 19 August 2026. All code changes were made against the local workspace only. No production deployment was made. No `prisma db push` was run against production. No candidate records were modified.*
