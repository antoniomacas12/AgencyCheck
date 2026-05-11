import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";
import { breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Legal Transparency — Operator, GDPR, Data Policy | AgencyCheck",
  description:
    "Full legal transparency for AgencyCheck: operator identity, KvK registration, GDPR data controller, data retention policy, agency right of reply, third-party processors, and dispute process.",
  alternates: { canonical: "https://agencycheck.io/transparency" },
};

const LAST_UPDATED = "May 2026";

export default function TransparencyPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",         url: "/" },
    { name: "Transparency", url: "/transparency" },
  ]);
  const pageSchema = webPageSchema({
    name:        "Legal Transparency — AgencyCheck",
    description: "Legal entity, GDPR data controller, data retention, and agency right of reply for AgencyCheck.",
    url:         "/transparency",
    dateModified: "2026-05-01",
  });

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Transparency</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Legal transparency</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
            Dutch law and GDPR require us to identify who operates this site, how we handle data,
            and what rights you have. This page answers all of those questions in plain language.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
              Last updated: {LAST_UPDATED}
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
              GDPR (EU) 2016/679 compliant
            </span>
            <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1">
              Wet elektronische handel compliant
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* ── Jump nav ─────────────────────────────────────────────────────── */}
        <nav className="p-4 rounded-xl border border-gray-200 bg-gray-50">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">On this page</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              ["#operator",      "Operator identity"],
              ["#gdpr",          "GDPR / data controller"],
              ["#data-we-collect", "Data we collect"],
              ["#retention",     "Data retention"],
              ["#third-parties", "Third-party processors"],
              ["#right-of-reply","Agency right of reply"],
              ["#disputes",      "Dispute process"],
              ["#your-rights",   "Your rights"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-blue-600 font-semibold hover:underline bg-white border border-blue-100 rounded-full px-3 py-1">
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── 1. Operator identity ─────────────────────────────────────────── */}
        <section id="operator">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 1</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Operator identity</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Under Dutch law (Wet elektronische handel, implementing EU E-Commerce Directive 2000/31/EC),
            every commercial website must clearly identify its operator. This is that identification.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-bold text-gray-300">Legal entity details</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Brand name",            value: LEGAL.brandName },
                { label: "Legal / trading name",  value: LEGAL.legalName },
                { label: "Legal form",            value: "Eenmanszaak (sole trader)" },
                { label: "Registered address",    value: `${LEGAL.address.street}, ${LEGAL.address.postcode} ${LEGAL.address.city}, ${LEGAL.address.country}` },
                {
                  label: "KvK number",
                  value: LEGAL.kvkNumber || "Registration in progress — number pending. Address and legal name above are confirmed.",
                  special: !LEGAL.kvkNumber ? "amber" : "none",
                },
                { label: "BTW / VAT number",      value: "Not VAT-registered (KOR exemption applies at current revenue level)" },
                { label: "Website",               value: LEGAL.siteUrl },
                { label: "General contact",       value: LEGAL.emailGeneral },
              ].map((row) => (
                <div key={row.label} className="flex gap-4 px-5 py-3.5">
                  <p className="shrink-0 w-40 text-xs font-bold text-gray-500">{row.label}</p>
                  <p className={`text-sm ${row.special === "amber" ? "text-amber-700 font-semibold" : "text-gray-800"}`}>
                    {row.value}
                    {row.label === "KvK number" && LEGAL.kvkNumber && (
                      <> — <a href={`https://www.kvk.nl/zoeken/?query=${LEGAL.kvkNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Verify at kvk.nl ↗</a></>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. GDPR data controller ──────────────────────────────────────── */}
        <section id="gdpr">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 2</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">GDPR — data controller identification</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Under GDPR Art. 4(7), the data controller is the entity that determines the purposes and means
            of processing personal data. Under Art. 13, we must disclose the controller&apos;s identity and
            contact details at the point of data collection.
          </p>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 mb-5">
            <p className="text-sm font-bold text-blue-900 mb-1">Data Controller</p>
            <p className="text-sm text-blue-800">{LEGAL.legalName}</p>
            <p className="text-sm text-blue-800">{LEGAL.address.street}, {LEGAL.address.postcode} {LEGAL.address.city}</p>
            <p className="text-sm text-blue-800 mt-1">
              Privacy contact:{" "}
              <a href={`mailto:${LEGAL.emailPrivacy}`} className="font-bold underline">{LEGAL.emailPrivacy}</a>
            </p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            AgencyCheck does not have a Data Protection Officer (DPO) — Dutch law only requires one
            for organisations that process special categories of data at scale. We do not process
            health data, criminal records, or other special-category data. All privacy queries go to
            the data controller contact above.
          </p>
        </section>

        {/* ── 3. Data we collect ───────────────────────────────────────────── */}
        <section id="data-we-collect">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 3</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Data we collect and why</h2>

          <div className="space-y-4">
            {[
              {
                category: "Worker review submissions",
                legalBasis: "Legitimate interest (Art. 6(1)(f))",
                data: "Star ratings (1–5), optional written comment, agency name, timestamp. No name, email, or identity is collected with reviews.",
                purpose: "Publishing worker-submitted reviews to enable other workers to make informed decisions about agencies.",
                stored: "Indefinitely — reviews are the core product. Workers can request removal via email.",
              },
              {
                category: "Lead / job application forms",
                legalBasis: "Contract performance (Art. 6(1)(b)) + Consent (Art. 6(1)(a))",
                data: "Name, email, phone number, preferred city, housing preference, job type interest.",
                purpose: "Matching workers with suitable agencies. Submitting this form is explicit consent to contact by AgencyCheck for this purpose.",
                stored: "90 days if no match. Deleted after successful placement unless worker requests longer retention.",
              },
              {
                category: "Analytics (Vercel Analytics)",
                legalBasis: "Legitimate interest (Art. 6(1)(f))",
                data: "Aggregated, anonymised page views, country, device type. No cookies set. No individual user tracking.",
                purpose: "Understanding which pages are useful to improve the service.",
                stored: "90-day rolling window — Vercel policy.",
              },
              {
                category: "Server logs",
                legalBasis: "Legitimate interest — security",
                data: "IP address, request path, timestamp, status code. Standard web server logs.",
                purpose: "Detecting and blocking abuse, rate limiting, security monitoring.",
                stored: "14 days, then deleted.",
              },
              {
                category: "Hashed IP (review spam prevention)",
                legalBasis: "Legitimate interest — platform integrity",
                data: "One-way SHA-256 hash of IP address. Cannot be reversed to recover the original IP.",
                purpose: "Detecting duplicate review submissions from the same source within 24 hours.",
                stored: "72 hours, then deleted.",
              },
            ].map((item) => (
              <div key={item.category} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{item.category}</p>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                    {item.legalBasis}
                  </span>
                </div>
                <div className="px-5 py-4 grid sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-gray-600 mb-1 uppercase tracking-widest text-[10px]">Data collected</p>
                    <p className="text-gray-700 leading-relaxed">{item.data}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600 mb-1 uppercase tracking-widest text-[10px]">Purpose</p>
                    <p className="text-gray-700 leading-relaxed">{item.purpose}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600 mb-1 uppercase tracking-widest text-[10px]">Retention</p>
                    <p className="text-gray-700 leading-relaxed">{item.stored}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Data retention ────────────────────────────────────────────── */}
        <section id="retention">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 4</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Data retention schedule</h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Data type</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Retention</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Deletion trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: "Worker reviews",               ret: "Indefinite",   trigger: "User request or factual error confirmed" },
                  { type: "Lead / application data",      ret: "90 days",      trigger: "Automatic after 90 days if no match; immediate on request" },
                  { type: "Server logs (raw)",            ret: "14 days",      trigger: "Automatic rotation" },
                  { type: "Hashed IP (spam detection)",   ret: "72 hours",     trigger: "Automatic" },
                  { type: "Vercel Analytics",             ret: "90 days",      trigger: "Vercel platform policy — rolling window" },
                  { type: "Admin session tokens",         ret: "24 hours",     trigger: "Automatic expiry" },
                  { type: "Agency profile data",          ret: "Until corrected or agency ceases trading", trigger: "Correction request from agency or KvK deregistration confirmed" },
                ].map((r) => (
                  <tr key={r.type}>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.type}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{r.ret}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. Third-party processors ────────────────────────────────────── */}
        <section id="third-parties">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 5</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Third-party data processors</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            AgencyCheck uses the following third-party processors under GDPR Art. 28 data processing agreements.
            We do not sell data to any third party. We do not use advertising networks.
          </p>

          <div className="space-y-3">
            {[
              {
                name: "Vercel Inc.",
                role: "Hosting & analytics",
                location: "USA (EU Standard Contractual Clauses apply)",
                data: "Server logs, aggregated analytics. Vercel Analytics is cookie-free and does not track individuals.",
                dpa: "https://vercel.com/legal/dpa",
                privacy: "https://vercel.com/legal/privacy-policy",
              },
              {
                name: "Neon / PostgreSQL (via Vercel)",
                role: "Database",
                location: "EU region (AWS eu-west-1)",
                data: "Worker reviews (anonymised), lead data, agency DB records.",
                dpa: "https://neon.tech/privacy-policy",
                privacy: "https://neon.tech/privacy-policy",
              },
              {
                name: "Resend / email delivery",
                role: "Transactional email",
                location: "USA (SCCs apply)",
                data: "Email address and content of transactional messages (lead confirmation, admin notifications).",
                dpa: "https://resend.com/privacy",
                privacy: "https://resend.com/privacy",
              },
            ].map((p) => (
              <div key={p.name} className="rounded-xl border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role} · {p.location}</p>
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <a href={p.dpa} target="_blank" rel="noopener noreferrer" className="text-blue-600 border border-blue-100 bg-blue-50 rounded-full px-2 py-0.5 font-bold hover:underline">DPA ↗</a>
                    <a href={p.privacy} target="_blank" rel="noopener noreferrer" className="text-gray-600 border border-gray-200 bg-gray-50 rounded-full px-2 py-0.5 font-bold hover:underline">Privacy ↗</a>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{p.data}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Agency right of reply ─────────────────────────────────────── */}
        <section id="right-of-reply">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 6</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Agency right of reply</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            AgencyCheck publishes factual data about agencies. We recognise that data can become outdated
            or contain errors. Agencies have the following rights under our platform policy:
          </p>

          <div className="space-y-3">
            {[
              {
                right: "Factual correction request",
                can: true,
                detail: "If a data point on your agency profile is factually incorrect (wrong address, wrong KvK number, wrong accommodation status), you may request a correction. We will verify against primary sources. If correct, we update within 5 working days.",
                how: `Email ${LEGAL.emailAgencies} with subject: "Data correction — [Agency name]". Include the incorrect field, the correct value, and a source we can verify against.`,
              },
              {
                right: "SNA / ABU / NBBU status update",
                can: true,
                detail: "If your certification status has changed (gained or lost SNA, joined or left ABU/NBBU), you may notify us. We will verify on the public register and update the score within 5 working days.",
                how: `Email ${LEGAL.emailAgencies} with the certification change details and the public register URL we can verify against.`,
              },
              {
                right: "Review dispute on factual grounds",
                can: "limited",
                detail: "You may flag a specific review if it contains verifiable factual errors (e.g. reviewer states a housing cost that is demonstrably incorrect). We will investigate. Reviews cannot be removed because they are negative or because you disagree with the worker's opinion.",
                how: `Email ${LEGAL.emailAgencies} with the review ID (visible in URL), the specific factual claim in question, and the evidence you believe contradicts it.`,
              },
              {
                right: "Request removal of personal employee data",
                can: true,
                detail: "If a review names a specific individual employee and you believe this constitutes a GDPR violation, you may request review. We take these seriously and respond within 72 hours.",
                how: `Email ${LEGAL.emailPrivacy} with subject: "GDPR — personal data in review". Include the review identifier.`,
              },
              {
                right: "Request score increase through payment",
                can: false,
                detail: "Not possible. The transparency score is algorithm-calculated from public sources. No payment, partnership, or request can change the score. To improve your score, publish more information publicly.",
                how: "N/A",
              },
              {
                right: "Remove a negative but accurate review",
                can: false,
                detail: "Not possible. AgencyCheck's value to workers depends on publishing all reviews, including negative ones. Accurate worker experiences, even very negative ones, are not removable.",
                how: "N/A",
              },
            ].map((item) => (
              <div key={item.right} className={`rounded-xl border p-4 ${
                item.can === true ? "border-emerald-200 bg-emerald-50/50" :
                item.can === "limited" ? "border-amber-200 bg-amber-50/50" :
                "border-red-200 bg-red-50/50"
              }`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black rounded-md px-2 py-1 ${
                    item.can === true ? "text-emerald-700 bg-emerald-100" :
                    item.can === "limited" ? "text-amber-700 bg-amber-100" :
                    "text-red-700 bg-red-100"
                  }`}>
                    {item.can === true ? "✓ AVAILABLE" : item.can === "limited" ? "~ LIMITED" : "✗ NOT AVAILABLE"}
                  </span>
                  <p className="text-sm font-bold text-gray-900">{item.right}</p>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">{item.detail}</p>
                {item.how !== "N/A" && (
                  <p className="text-[11px] text-gray-500 italic">How to request: {item.how}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. Dispute process ───────────────────────────────────────────── */}
        <section id="disputes">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 7</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Dispute resolution process</h2>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-bold text-gray-300">Standard dispute timeline</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { day: "Day 1",    step: "Dispute received",         detail: `Email to ${LEGAL.emailAgencies} or ${LEGAL.emailPrivacy}. We confirm receipt within 1 working day.` },
                { day: "Days 1–3", step: "Initial review",           detail: "We review the dispute and identify what can be independently verified." },
                { day: "Days 3–5", step: "Primary source check",     detail: "We verify the disputed data point against: KvK register, ABU/NBBU member list, SNA certificate registry, or other named primary source." },
                { day: "Day 5",    step: "Decision communicated",    detail: "We inform the requester of our decision: update accepted, update rejected with reason, or investigation ongoing if more time required." },
                { day: "Day 5+",   step: "Update published",         detail: "If accepted: profile updated within the same working day as the decision. Correction note added to profile showing date of update." },
                { day: "Escalation", step: "Unresolved disputes",   detail: `If you believe our decision is incorrect, you may escalate in writing to ${LEGAL.emailLegal}. We will review with fresh eyes. If still unresolved, the matter may be referred to the Autoriteit Persoonsgegevens (AP) for GDPR matters, or to a Dutch court for other disputes.` },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 px-5 py-3.5">
                  <p className="shrink-0 w-20 text-xs font-black text-gray-500">{item.day}</p>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">{item.step}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 p-4 text-xs text-gray-600">
            <strong className="text-gray-900">Governing law:</strong> This platform and all disputes arising
            from it are governed by Dutch law. The competent court is the Rechtbank Rotterdam.
            For GDPR complaints, the supervisory authority is the{" "}
            <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Autoriteit Persoonsgegevens (AP) ↗
            </a>.
          </div>
        </section>

        {/* ── 8. Your rights ───────────────────────────────────────────────── */}
        <section id="your-rights">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Section 8</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Your rights under GDPR</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            As a data subject under GDPR, you have the following rights. To exercise any of them,
            email <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-blue-600 font-semibold underline">{LEGAL.emailPrivacy}</a>.
            We respond within 30 days (Art. 12).
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { art: "Art. 15", right: "Right of access",         detail: "Request a copy of all personal data we hold about you." },
              { art: "Art. 16", right: "Right to rectification",  detail: "Request correction of inaccurate personal data." },
              { art: "Art. 17", right: "Right to erasure",        detail: "Request deletion of your data where there is no longer a lawful basis for processing." },
              { art: "Art. 18", right: "Right to restriction",    detail: "Request we restrict processing while a dispute is resolved." },
              { art: "Art. 20", right: "Data portability",        detail: "Receive your data in a structured, machine-readable format." },
              { art: "Art. 21", right: "Right to object",         detail: "Object to processing based on legitimate interest. We will stop unless we have compelling grounds." },
              { art: "Art. 7",  right: "Withdraw consent",        detail: "Where processing is based on consent, you may withdraw it at any time. Withdrawal does not affect past processing." },
              { art: "Art. 77", right: "Lodge a complaint",       detail: "You may complain to the Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl)." },
            ].map((item) => (
              <div key={item.art} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{item.art}</span>
                  <p className="text-sm font-bold text-gray-900">{item.right}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            <strong>Note on anonymous reviews:</strong> Worker reviews submitted without an account are
            genuinely anonymous — we do not link them to an identity. If you submitted a review and
            wish to have it removed, email us with the agency name, approximate date, and enough detail
            for us to identify the review. We cannot verify you are the original submitter, but we
            will remove the review in good faith if the details match.
          </div>
        </section>

        {/* ── Cookies ──────────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Cookies</p>
          <h2 className="text-xl font-black text-gray-900 mb-4">Cookie policy</h2>
          <div className="rounded-xl border border-gray-200 p-5 text-sm text-gray-700 space-y-3">
            <p>
              <strong className="text-gray-900">AgencyCheck uses no third-party advertising or tracking cookies.</strong>
            </p>
            <p>
              Analytics are provided by Vercel Analytics, which is <strong>cookie-free</strong> and does not
              fingerprint individual users. No consent banner is required under ePrivacy Directive because
              no tracking cookies are set.
            </p>
            <p>
              The only cookies we may set are session cookies for the admin panel (first-party, essential,
              not accessible to JavaScript, httpOnly). These are not subject to cookie consent requirements
              under Dutch law (Telecommunicatiewet art. 11.7a).
            </p>
          </div>
        </section>

        {/* ── Bottom nav ───────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 pt-8">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Related pages</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/about",        label: "About AgencyCheck" },
              { href: "/methodology",  label: "Verification methodology" },
              { href: "/privacy",      label: "Privacy policy" },
              { href: "/terms",        label: "Terms of use" },
              { href: "/safety",       label: "Worker safety guide" },
              { href: "/contact",      label: "Contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            {LEGAL.legalName} · {LEGAL.address.street}, {LEGAL.address.postcode} {LEGAL.address.city} ·{" "}
            <a href={`mailto:${LEGAL.emailLegal}`} className="hover:text-gray-600">{LEGAL.emailLegal}</a>
          </p>
        </section>

      </div>
    </div>
  );
}
