# Data Subject Rights — Request Handling Procedure
## AgencyCheck — GDPR Art. 12–22

**Version:** 2026-08
**Controller:** AgencyCheck, obrt za poslovne usluge, vl. Antonio Maćaš
**Privacy contact:** hello@agencycheck.io

---

## 1. Rights Covered

| GDPR Article | Right | Description |
|---|---|---|
| Art. 15 | Right of access | Request a copy of all personal data held about you |
| Art. 16 | Right to rectification | Request correction of inaccurate data |
| Art. 17 | Right to erasure ("right to be forgotten") | Request deletion where no lawful basis remains |
| Art. 18 | Right to restriction | Limit how data is processed during a dispute |
| Art. 20 | Right to data portability | Receive data in a structured, machine-readable format |
| Art. 21 | Right to object | Object to processing based on legitimate interest |
| Art. 7(3) | Right to withdraw consent | Withdraw consent at any time; does not affect past processing |

---

## 2. How to Submit a Request

Email: **hello@agencycheck.io**
Subject line: **"Data Subject Request"**

Include in the email:
- The right(s) you wish to exercise
- The phone number and/or email address you used when submitting an application or review
- A brief description of what you are requesting

We do not require government-issued ID for standard requests.

---

## 3. Identity Verification

To protect against fraudulent erasure or access requests, we verify identity by confirming that the contact details provided in the request (phone number and/or email) match the data we hold.

For requests where the data subject cannot provide the original contact details (e.g. phone number has changed), we may ask for additional context about the submission (approximate date, job type, agency name applied to) to identify the record.

We do not request copies of identity documents for standard data subject requests.

---

## 4. Response Timeline

| Stage | Deadline |
|---|---|
| Acknowledge receipt | Within 3 working days |
| Substantive response | Within 1 calendar month from receipt (Art. 12(3)) |
| Extension (complex or numerous requests) | Up to 2 additional months — must notify the data subject of the extension and reason within 1 month of receiving the request (Art. 12(3)) |

If a request is manifestly unfounded or excessive (e.g. repeated requests), we may charge a reasonable fee or refuse to act, providing written reasons.

---

## 5. What Data AgencyCheck Holds

Depending on your interactions with the platform, we may hold:

**From the Lead model (job application forms):**
- Full name, phone number, email (if provided)
- Nationality, current country of residence
- Job preferences (work type, region, accommodation, experience level)
- Application source, submission date, status
- GDPR consent timestamp, consent version, privacy policy version
- Internal notes and tags added by admin

**From LeadSharingEvent:**
- Record of which agencies/partners your data was shared with, when, and which fields were included
- Lawful basis used for each share

**From CandidateReliabilityNote (if any exists):**
- Internal quality notes about candidate interactions (no special-category data)

**From CandidateRestriction (if any exists):**
- Normalised phone number and reason for restriction

**From PreQualification:**
- EU citizenship answer, BSN status, job title, submission timestamp

**Analytics:** Vercel Analytics data is aggregated and anonymised — individual records do not exist.
**Reviews:** If submitted without an account, reviews are anonymous — we cannot link them to a specific person unless you provide identifying context.

---

## 6. Fulfilling Access Requests (Art. 15)

On receipt of an access request:
1. Query the database for all records matching the provided phone number or email
2. Export: Lead record(s), LeadSharingEvent records, CandidateReliabilityNote records, CandidateRestriction records
3. Redact admin credentials and internal system fields not relevant to the data subject
4. Deliver in a human-readable format (JSON or structured plain text) by email

---

## 7. Fulfilling Erasure Requests (Art. 17)

Erasure is appropriate when:
- The lawful basis no longer applies
- Consent is withdrawn and no other basis applies
- The data is no longer necessary for its original purpose
- A valid objection is raised under Art. 21

**For unplaced candidates** (status not in converted/confirmed/paid):
- Delete the Lead record entirely (cascades to sends, sharing events)
- Set gdprErasureRequestedAt on the record before deletion for audit trail

**For placed candidates** (status: converted/confirmed/paid):
- Cannot delete the full record — financial records must be retained per Croatian accounting law
- Anonymise personal fields: fullName → "[anonymised]", phone → "", email → null, nationality → null, currentCountry → null, notes → null, internalNotes → null
- Retain: id, status, confirmedAt, workerStartDate, payoutAmount, paidAt, sourceType, gdprLawfulBasis, assignedAgencies

**Erasure is not required where** retention is necessary for:
- Compliance with a legal obligation
- Establishment, exercise, or defence of legal claims

---

## 8. Audit Trail of Requests

When an erasure or restriction request is received:
- Set gdprErasureRequestedAt on the Lead record (Art. 5(2) accountability)
- Set gdprRestricted = true and gdprRestrictedAt for restriction requests
- Log the action in the internal incident/request log

These accountability records are retained for up to 3 years to demonstrate compliance.

---

## 9. Right to Complain to Supervisory Authority

If you are unsatisfied with our response, you have the right to lodge a complaint with the Croatian data protection authority:

**Agencija za zaštitu osobnih podataka (AZOP)**
Website: https://azop.hr
Complaint form: https://azop.hr/zahtjev-za-utvrdivanje-povrede-prava/ (verified 28 Aug 2026)

You may also seek a judicial remedy under Art. 79 GDPR.

---

## 10. Version History

| Version | Date | Notes |
|---|---|---|
| 2026-08 | August 2026 | Initial version — Croatian Obrt, AZOP supervisory authority, Supabase database |
