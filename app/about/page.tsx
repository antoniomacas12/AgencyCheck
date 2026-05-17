import type { Metadata } from "next";
import Link from "next/link";
import { VERIFIED_AGENCIES } from "@/data/agencies";
import { LEGAL } from "@/lib/legalConfig";
import { organizationSchema, breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "About AgencyCheck — Independent Worker Protection Platform, Netherlands",
  description:
    "AgencyCheck is an independent platform documenting agency working conditions in the Netherlands. No paid rankings, no agency partnerships, no sponsored content. Built and run by a worker.",
  alternates: { canonical: "https://agencycheck.io/about" },
};

// ─── Static numbers ────────────────────────────────────────────────────────────
const VERIFIED_COUNT   = VERIFIED_AGENCIES.length;
const HOUSING_COUNT    = VERIFIED_AGENCIES.filter((a) => a.accommodation && a.accommodation !== "unknown" && (a.accommodation as string) !== "not_offered").length;
const COUNTRIES_SERVED = ["Poland", "Romania", "Portugal", "Bulgaria", "Slovakia", "Ukraine"];

// ─── Transparency score components ────────────────────────────────────────────
const SCORE_COMPONENTS = [
  { weight: 20, label: "Legal registration",    detail: "KvK number verified, ABU/NBBU membership status checked" },
  { weight: 20, label: "Housing transparency",  detail: "Whether housing cost, SNF certification, and deduction policy are published" },
  { weight: 15, label: "Salary clarity",        detail: "Whether the agency publishes hourly rates or CAO tier" },
  { weight: 15, label: "Contract clarity",      detail: "Uitzendovereenkomst phasing disclosed, phase A/B/C explained" },
  { weight: 15, label: "Contact & website",     detail: "Verified contact page, physical address, Dutch-domain email" },
  { weight: 10, label: "SNA / NEN certification", detail: "+10 if current SNA certificate is publicly verifiable on sna.nl" },
  { weight: 5,  label: "Worker data",           detail: "Reviews submitted by workers with consistent detail signals" },
];

export default function AboutPage() {
  const orgSchema   = organizationSchema();
  const crumbSchema = breadcrumbSchema([
    { name: "Home",  url: "/" },
    { name: "About", url: "/about" },
  ]);
  const pageSchema  = webPageSchema({
    name:        "About AgencyCheck — Independent Worker Protection Platform",
    description: "AgencyCheck documents agency working conditions in the Netherlands. No paid rankings, no sponsored content.",
    url:         "/about",
    dateModified: "2026-05-01",
  });

  return (
    <div className="min-h-screen bg-white">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="bg-surface-hero text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-wrap gap-2 mb-6">
            {["No paid rankings", "No sponsored content", "No agency partnerships", "Netherlands"].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-gray-300">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            An independent database of agency working conditions in the Netherlands
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            AgencyCheck collects, verifies, and publishes data on {VERIFIED_COUNT}+ staffing agencies — salary
            transparency, housing deductions, contract clarity, and worker reviews. Every piece of
            data is sourced, every negative review is published, every agency is treated the same
            regardless of whether they like what we write about them.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/agencies" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              Browse agencies →
            </Link>
            <Link href="/methodology" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
              How we verify data →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">

        {/* ── Why this exists ─────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">The problem</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">The information gap that hurts workers</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Every year, tens of thousands of workers from {COUNTRIES_SERVED.slice(0, -1).join(", ")}, and {COUNTRIES_SERVED.at(-1)} arrive
              in the Netherlands to work through staffing agencies. Most arrive without knowing:
            </p>
            <ul className="space-y-2 pl-4 border-l-2 border-gray-200">
              {[
                "What a legal housing deduction looks like vs. what agencies actually charge",
                "That heffingskorting tax credits can cut effective tax from 37% to under 15%",
                "That ABU/NBBU CAO contract phases affect their rights differently",
                "Which agencies have SNA certification (the only independent quality audit)",
                "That they can report illegal deductions to the Inspectie SZW — for free",
              ].map((item) => (
                <li key={item} className="text-gray-600">{item}</li>
              ))}
            </ul>
            <p>
              Agencies know this information asymmetry exists. Some exploit it. AgencyCheck exists
              to close that gap — by making the data public, searchable, and free.
            </p>
          </div>
        </section>

        {/* ── Platform numbers ────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Platform scope</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">What AgencyCheck covers</h2>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                value: `${VERIFIED_COUNT}`,
                label: "Verified agencies",
                detail: "Each individually researched: KvK number, ABU/NBBU register, SNA certificate, website, housing policy, sector.",
                pill: "Research-verified",
                pillColor: "text-blue-700 bg-blue-50",
              },
              {
                value: `${HOUSING_COUNT}`,
                label: "With housing data",
                detail: "SNF compliance status, weekly deduction range, and whether housing is compulsory documented for each.",
                pill: "SNF-checked",
                pillColor: "text-emerald-700 bg-emerald-50",
              },
              {
                value: "6",
                label: "Languages covered",
                detail: "Agency profiles available in EN, PL, RO, PT, SK, BG — for workers from origin countries, in their language.",
                pill: "Multilingual",
                pillColor: "text-purple-700 bg-purple-50",
              },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-4xl font-black text-gray-900 mb-1 tabular-nums">{s.value}</p>
                <p className="text-sm font-bold text-gray-700 mb-2">{s.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.detail}</p>
                <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${s.pillColor}`}>{s.pill}</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "💶", title: "Salary calculator", body: "Official 2026 loonheffing brackets + both heffingskorting credits. Accurate to within ±2% of real payslips for WML earners.", href: "/tools/real-income-calculator" },
              { icon: "📄", title: "Payslip checker", body: "Upload a loonstrook and verify every line against ABU/NBBU CAO, SNF housing limits, and Belastingdienst tables.", href: "/tools/payslip-checker" },
              { icon: "⭐", title: "Worker reviews", body: "Anonymous reviews from workers. All sub-ratings (salary, housing, management, contract) published including every 1-star.", href: "/reviews" },
              { icon: "🔍", title: "Agency transparency scores", body: "0–100 score per agency based on 7 components — all weighted and explained. No agency has paid to improve their score.", href: "/methodology" },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 hover:border-gray-200 hover:shadow-sm transition-all group">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-sm font-black text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">{item.title} →</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Transparency score explained ────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">How scores work</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">The transparency score (0–100)</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Every agency on AgencyCheck receives a transparency score calculated from 7 components.
            The score measures how much verifiable information the agency makes available — not how good
            the agency is. A score of 0 means we could verify almost nothing. A score of 100 means all
            information is public, verified, and current.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-bold text-gray-300">Score components — total weight: 100 points</p>
            </div>
            <div className="divide-y divide-gray-100">
              {SCORE_COMPONENTS.map((c) => (
                <div key={c.label} className="flex items-start gap-4 px-5 py-3.5">
                  <div className="shrink-0 w-10 text-right">
                    <span className="text-sm font-black text-gray-900 tabular-nums">{c.weight}</span>
                    <span className="text-[10px] text-gray-400 block">pts</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{c.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                  </div>
                  <div className="shrink-0 w-24">
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.weight}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border-t border-blue-100 px-5 py-3 text-xs text-blue-800">
              Agencies cannot pay to improve their score. All checks use public sources only.{" "}
              <Link href="/methodology" className="font-bold underline">Full methodology →</Link>
            </div>
          </div>
        </section>

        {/* ── Independence model ──────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Independence</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">How independence is maintained</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Independence is not a marketing claim — it has to be structural. These are the specific
            rules that prevent commercial relationships from contaminating the data.
          </p>

          <div className="space-y-3">
            {[
              {
                verdict: "NEVER",
                verdictColor: "text-red-700 bg-red-50 border-red-100",
                rule: "Paid listings or placement fees",
                detail: "No agency has paid to appear on this site. There is no listing tier, no featured placement, and no ranking boost available for purchase.",
              },
              {
                verdict: "NEVER",
                verdictColor: "text-red-700 bg-red-50 border-red-100",
                rule: "Review removal or suppression",
                detail: "Agencies can flag a review for factual errors (e.g. wrong city, wrong date). We investigate. But they cannot delete or hide a review because it is negative.",
              },
              {
                verdict: "NEVER",
                verdictColor: "text-red-700 bg-red-50 border-red-100",
                rule: "Score manipulation",
                detail: "The transparency score is calculated by algorithm from publicly verifiable data. No human at AgencyCheck can manually adjust an agency's score.",
              },
              {
                verdict: "ALLOWED",
                verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
                rule: "Finder's fee for matched placements",
                detail: "When a worker uses our matching service and is successfully placed, the agency pays AgencyCheck a standard referral fee. Workers are always free. The matching shortlist is built from agencies with the highest worker ratings — not the highest payers.",
              },
              {
                verdict: "ALLOWED",
                verdictColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
                rule: "Agency right of reply",
                detail: "Any agency can submit factual corrections to their profile. We verify corrections against primary sources. If correct, we update the data. If not, we do not.",
              },
            ].map((item) => (
              <div key={item.rule} className="flex gap-4 rounded-xl border border-gray-100 p-4">
                <span className={`shrink-0 text-[10px] font-black border rounded-md px-2 py-1 h-fit ${item.verdictColor}`}>
                  {item.verdict}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.rule}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How we collect + validate ───────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Data pipeline</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">How data enters the platform</h2>

          <div className="relative space-y-0">
            {[
              {
                step: "01",
                color: "bg-blue-600",
                title: "Primary source research",
                source: "AgencyCheck team",
                body: "Each verified agency profile is built from: KvK public register, ABU/NBBU membership database, SNA certificate registry (sna.nl), agency website, LinkedIn, and job listing data. We record every claim we can verify and mark every claim we cannot.",
              },
              {
                step: "02",
                color: "bg-blue-600",
                title: "Transparency score calculation",
                source: "Automated — no human override",
                body: "Seven components are scored by algorithm (see above). The score reflects what is publicly verifiable today. If an agency publishes new information, their score updates on the next crawl cycle.",
              },
              {
                step: "03",
                color: "bg-amber-500",
                title: "Worker review submission",
                source: "Anonymous — worker-submitted",
                body: "Workers submit structured reviews covering salary accuracy, housing conditions, management, and contract clarity. All fields are optional except the star rating. Reviews are anonymous by design — workers should not fear retaliation.",
              },
              {
                step: "04",
                color: "bg-amber-500",
                title: "Review validation",
                source: "Anti-manipulation checks",
                body: "Each submission is checked: duplicate session detection, rate limiting per IP, consistency scoring across sub-ratings, and admin review of flagged submissions. We do NOT verify identity — that would break anonymity. Volume and consistency of multiple independent reports is what creates credibility.",
              },
              {
                step: "05",
                color: "bg-emerald-600",
                title: "Publication — unfiltered",
                source: "All reviews published",
                body: "Reviews are published in the order received. Negative reviews are not held back. Agencies with 1-star reviews appear with 1-star ratings. The data is what the data is.",
              },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center text-xs font-black shrink-0`}>
                    {item.step}
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>
                <div className={`pb-6 ${i < arr.length - 1 ? "" : ""}`}>
                  <p className="text-sm font-black text-gray-900 mb-0.5">{item.title}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                    item.color.includes("blue") ? "text-blue-600" :
                    item.color.includes("amber") ? "text-amber-600" : "text-emerald-600"
                  }`}>{item.source}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── What we don't do / limitations ─────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Limitations</p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">What AgencyCheck does not do</h2>
          <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {[
              {
                icon: "✗",
                iconColor: "text-red-500",
                bold: "We do not verify individual worker reviews.",
                text: "Reviews are anonymous submissions. We cannot confirm the reviewer actually worked at the agency. What we can do is detect and remove duplicate or bot submissions. Multiple consistent reports across different users and dates increases reliability.",
              },
              {
                icon: "✗",
                iconColor: "text-red-500",
                bold: "We do not inspect housing in person.",
                text: "Housing ratings come from worker reports. We cross-reference SNF certification status and the legal maximum (€113.50/week for shared rooms), but we cannot visit every address.",
              },
              {
                icon: "✗",
                iconColor: "text-red-500",
                bold: "We do not provide legal advice.",
                text: "Nothing on this site constitutes legal advice. For employment disputes: FNV (+31 900 9690), CNV (+31 30 751 1000), or the Inspectie SZW (iszw.nl).",
              },
              {
                icon: "✗",
                iconColor: "text-red-500",
                bold: "Scores can be outdated.",
                text: "We research agencies periodically, not continuously. An agency may have changed their housing policy, gained or lost SNA certification, or ceased trading. Always verify current status before signing a contract.",
              },
            ].map((item) => (
              <div key={item.bold} className="flex gap-4 px-5 py-4">
                <span className={`shrink-0 text-lg font-black mt-0.5 ${item.iconColor}`}>{item.icon}</span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.bold}</strong> {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Legal entity ────────────────────────────────────────────────────── */}
        <section className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm font-black text-gray-900">Legal entity</p>
            <Link href="/transparency" className="text-xs font-bold text-blue-600 hover:underline">
              Full legal transparency →
            </Link>
          </div>
          <div className="px-6 py-5 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Operator</p>
              <p className="text-gray-800 font-semibold">{LEGAL.legalName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Registered address</p>
              <p className="text-gray-800">
                {LEGAL.address.street}, {LEGAL.address.postcode} {LEGAL.address.city}, {LEGAL.address.country}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">KvK registration</p>
              <p className="text-gray-800">
                {LEGAL.kvkNumber
                  ? <><span className="font-mono font-bold">{LEGAL.kvkNumber}</span> — <a href={`https://www.kvk.nl/zoeken/?query=${LEGAL.kvkNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Verify at kvk.nl ↗</a></>
                  : <span className="text-amber-700 font-semibold">Registration in progress — number pending</span>
                }
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">GDPR data controller</p>
              <p className="text-gray-800">{LEGAL.legalName} · <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-blue-600 underline">{LEGAL.emailPrivacy}</a></p>
            </div>
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              { label: "General questions",         email: LEGAL.emailGeneral,  detail: "Response within 2 working days." },
              { label: "Privacy / data requests",   email: LEGAL.emailPrivacy,  detail: "GDPR requests handled within 30 days (Art. 12)." },
              { label: "Agency data corrections",   email: LEGAL.emailAgencies, detail: "Factual errors, outdated data, right of reply." },
              { label: "Legal notices",             email: LEGAL.emailLegal,    detail: "Formal correspondence and legal notices." },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{c.label}</p>
                <a href={`mailto:${c.email}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  {c.email}
                </a>
                <p className="text-[11px] text-gray-400 mt-1">{c.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Navigation ──────────────────────────────────────────────────────── */}
        <section className="border-t border-gray-100 pt-8">
          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Related pages</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/methodology",  label: "Salary + verification methodology" },
              { href: "/transparency", label: "Legal transparency" },
              { href: "/safety",       label: "Worker safety guide" },
              { href: "/agencies",     label: "Browse agencies" },
              { href: "/reviews",      label: "Worker reviews" },
              { href: "/privacy",      label: "Privacy policy" },
              { href: "/terms",        label: "Terms of use" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-xs font-semibold text-gray-600 border border-gray-200 bg-gray-50 rounded-full px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
