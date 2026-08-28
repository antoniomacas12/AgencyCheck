# Personal Data Breach Response Procedure
## AgencyCheck — GDPR Art. 33–34

**Version:** 2026-08
**Controller:** AgencyCheck, obrt za poslovne usluge, vl. Antonio Maćaš
**Privacy contact:** hello@agencycheck.io

---

## 1. Scope and Purpose

This procedure covers how AgencyCheck identifies, contains, assesses, reports, and reviews personal data breaches. It applies to all personal data processed by AgencyCheck as data controller.

A personal data breach is any security incident leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data (GDPR Art. 4(12)).

---

## 2. What Constitutes a Personal Data Breach

Examples relevant to AgencyCheck:

- Unauthorised access to the Supabase database containing lead data (names, phones, emails)
- Accidental exposure of candidate data in a Sentry error report
- Admin credentials compromised, allowing unauthorised access to the admin panel
- A bulk export CSV file containing candidate data sent to the wrong recipient
- Database misconfiguration making lead data publicly accessible
- Ransomware or data encryption attack affecting hosted data

Not all security incidents are personal data breaches. A DDoS attack that causes downtime but does not expose data is an incident, not a breach.

---

## 3. Immediate Response (0–1 Hours)

1. **Stop the breach** — isolate affected systems, revoke compromised credentials, disable affected API endpoints if needed
2. **Preserve evidence** — take screenshots, export logs, note timestamps before any remediation steps that might overwrite logs
3. **Notify** — controller (Antonio Maćaš) must be informed immediately if the breach is discovered by anyone else
4. **Initial triage** — answer: What data? How many individuals? What categories? What is the likely impact?
5. **Engage processors** — contact Vercel, Supabase, Resend, or Sentry as appropriate (see Section 7)

---

## 4. Containment and Assessment (1–24 Hours)

1. **Contain** — patch the vulnerability, rotate credentials, implement temporary access restrictions
2. **Assess scope** — identify all affected data categories, estimate number of affected individuals
3. **Risk assessment** — evaluate likelihood and severity of harm to individuals:
   - Low risk: anonymised data, no contact details
   - Medium risk: names/phones of candidates exposed to unauthorised but identifiable actor
   - High risk: combined name + phone + nationality + job preference exposed publicly or to criminal actor

4. **Document** — record all findings in the internal incident log (Section 8)

---

## 5. AZOP Notification (when required)

**Supervisory authority:** Agencija za zaštitu osobnih podataka (AZOP)
**Website:** https://azop.hr
**Notification procedures:** Check https://azop.hr for current notification forms and procedures. Do NOT rely on contact details in this document without verifying at azop.hr — details may change.

**When notification is required (Art. 33):** The controller must notify AZOP within **72 hours** of becoming aware of a breach, unless the breach is unlikely to result in a risk to individuals' rights and freedoms.

**72-hour deadline runs from the moment the controller becomes aware** — not from when the breach occurred.

**What to include in the notification:**
- Nature of the breach (categories and approximate number of affected individuals and records)
- Name and contact details of the privacy contact (hello@agencycheck.io)
- Likely consequences of the breach
- Measures taken or proposed to address the breach and mitigate its effects

**If notification cannot be made within 72 hours:** Notify AZOP as soon as possible and explain the reason for the delay. Partial information can be provided initially with further details to follow.

**When notification is NOT required:** If the breach is unlikely to result in any risk to individuals (e.g. breach of encrypted data where the key was not compromised, or anonymised data with no re-identification risk).

---

## 6. Data Subject Notification (when required)

**When required (Art. 34):** When a breach is likely to result in a HIGH risk to individuals' rights and freedoms — notification to affected individuals is required without undue delay.

**High-risk examples for AgencyCheck:**
- Name, phone, and nationality of candidates exposed to an unknown third party
- Admin credentials compromised and candidate data accessed

**What to tell affected individuals:**
- Plain language description of the breach
- Name and contact of the privacy contact
- Likely consequences
- Steps taken to address and mitigate
- Rights available (especially Art. 17 erasure, Art. 18 restriction)

**How to notify:** Email to affected candidates using the email address on file. Where no email is available, consider other available means or publish a notice on the platform.

---

## 7. Processor Coordination

Contact each relevant processor through their security/incident reporting channel:

| Processor | Incident contact |
|---|---|
| Vercel | vercel.com/security — security@vercel.com |
| Supabase | supabase.com/security |
| Resend | resend.com — check current security contact at resend.com/privacy |
| Sentry | sentry.io/security |

Processors are obligated under their DPAs to notify AgencyCheck of breaches affecting AgencyCheck data without undue delay.

---

## 8. Internal Incident Log

For every breach (even low-risk ones not requiring AZOP notification), document:

- Date and time breach discovered
- Date and time breach occurred (if known)
- Who discovered the breach
- Nature of the breach
- Categories and volume of personal data affected
- Approximate number of individuals affected
- Likely consequences
- Containment actions taken (with timestamps)
- Whether AZOP was notified (and when, or why not)
- Whether data subjects were notified (and when, or why not)
- Outcome and remediation

Store this log securely. It must be available to AZOP on request.

---

## 9. Post-Incident Review

Within 2 weeks of containment:
1. Root cause analysis — how did the breach occur?
2. Process review — what controls failed?
3. Remediation — what technical or organisational changes prevent recurrence?
4. Update this procedure if gaps are identified
5. Update the RoPA if processing activities were affected

---

## 10. Version History

| Version | Date | Notes |
|---|---|---|
| 2026-08 | August 2026 | Initial version — Croatian Obrt, AZOP authority. Do NOT rely on AZOP contact details without checking azop.hr — verify before use. |
