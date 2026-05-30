import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "BSN Number Netherlands — Complete Guide for Agency Workers 2026",
  description:
    "How to get your BSN number in the Netherlands as an EU agency worker. RNI registration, gemeente registration, documents needed, timeline, and what your agency should arrange for you.",
  alternates: { canonical: "https://agencycheck.io/bsn-number-netherlands-guide" },
  openGraph: {
    title: "BSN Number Netherlands — Complete Guide for Agency Workers 2026",
    description:
      "Step-by-step: get your Dutch BSN as an EU agency worker. RNI vs gemeente registration, required documents, DigiD, and what happens if you work without a BSN.",
  },
};

export const dynamic = "force-static";

const STEPS = [
  {
    step: "1",
    title: "Arrive in the Netherlands",
    body: "As an EU/EEA citizen you have the right to live and work in the Netherlands from day one — no work permit required. You do not need to register or apply for anything before you arrive. Your agency will already have a start date confirmed.",
    tip: null,
  },
  {
    step: "2",
    title: "Register at an RNI desk or your local gemeente",
    body: "You need to register your presence in the Netherlands to receive a BSN. There are two routes depending on whether you have a fixed home address or agency-provided accommodation.",
    tip: "RNI (Registratie Niet-Ingezetenen) registration is for workers without a permanent Dutch address — typically agency housing. There are 19 RNI desks at large municipalities including Rotterdam, Amsterdam, Eindhoven, Den Haag, Venlo, and Breda. Your agency should tell you which one is nearest and may arrange transport.",
  },
  {
    step: "3",
    title: "Bring the correct documents",
    body: "Regardless of whether you register at an RNI desk or gemeente, you need: (1) Valid national ID or passport, (2) Proof of work in the Netherlands — this can be your employment contract from the agency, (3) Proof of address — if using agency housing, a letter from the agency confirming your accommodation address is accepted.",
    tip: "Some municipalities also ask for a birth certificate. Ask your agency in advance what their local desk requires. The appointment can be booked online at the respective municipality website.",
  },
  {
    step: "4",
    title: "Receive your BSN",
    body: "At the RNI desk, your BSN is issued on the same day in most cases. At a gemeente, it can take up to 5 working days. Your BSN is a 9-digit number. Write it down and keep it — you will need it for your payslip, health insurance, bank account, and DigiD.",
    tip: "Your agency needs your BSN to correctly process your payroll and loonheffing (wage tax). Until your BSN is registered, your employer must apply the highest tax rate (noodloon — 'emergency wage withholding') which can mean significantly less take-home pay in your first week.",
  },
  {
    step: "5",
    title: "Apply for DigiD (optional but recommended)",
    body: "DigiD is the Dutch government's digital identity system — a separate login/password you need to access government services online: tax returns (Belastingdienst), healthcare allowance (zorgtoeslag), housing benefit (huurtoeslag). It is not the same as your BSN, but you need your BSN to apply for DigiD.",
    tip: "DigiD applications are made at digid.nl. Activation takes 5–7 days by letter to your registered address. If you later want to claim toeslagen (allowances) that reduce your cost of living, DigiD is required.",
  },
];

const DOCUMENTS = [
  { doc: "Valid national ID card or passport", note: "Must be in date — expired ID is rejected" },
  { doc: "Employment contract from your agency", note: "Shows you are working in the Netherlands" },
  { doc: "Proof of address in the Netherlands", note: "Agency housing letter with full address is accepted" },
  { doc: "Birth certificate (some municipalities)", note: "Check with your specific RNI desk in advance" },
];

const RNI_DESKS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
  "Enschede", "Arnhem", "Haarlem", "Haarlemmermeer", "Zaanstad",
  "Venlo", "Maastricht", "Dordrecht", "Zwolle",
];

const FAQS = [
  {
    q: "How long does it take to get a BSN number in the Netherlands?",
    a: "At an RNI desk, your BSN is typically issued on the same day during your appointment. At a gemeente (for those with a fixed address), it can take up to 5 working days. Most agencies arrange the RNI appointment within the first 3–5 working days of your arrival. Without a BSN, your employer must apply the highest tax withholding rate (noodloon), so getting it quickly directly affects your first payslip.",
  },
  {
    q: "Can I work in the Netherlands without a BSN?",
    a: "You can start working, but your employer must apply the emergency tax withholding rate (noodloon/anoniementarief) until your BSN is processed. This means significantly less take-home pay for that period — sometimes 40–50% withheld instead of the normal 10–15%. Once your BSN is registered and submitted to your employer, the correct rate is applied going forward. The withheld excess in your first period is usually corrected on your annual tax return.",
  },
  {
    q: "What is the difference between a BSN and a DigiD?",
    a: "Your BSN (Burgerservicenummer) is a permanent 9-digit number that identifies you in Dutch government and tax systems — it appears on your payslip and is used by your employer to report your income to the Belastingdienst (tax authority). DigiD is a separate username and password system for logging into government websites. You need your BSN to create a DigiD, but they are different things. You always have your BSN once assigned; DigiD is a login you apply for separately.",
  },
  {
    q: "Does my employer (agency) need my BSN?",
    a: "Yes — your BSN is legally required for your employer to process payroll correctly. Under Dutch law, employers must record the BSN of every employee (Wet op de loonbelasting Art. 28). Without it, the noodtarief (emergency rate) applies and more tax is withheld. Give your BSN to your agency recruiter as soon as you receive it — the same day if possible.",
  },
  {
    q: "Can I open a Dutch bank account without a BSN?",
    a: "Most Dutch banks (ING, Rabobank, ABN AMRO) require a BSN to open an account. Some banks like Bunq or Revolut allow you to open an account without a Dutch BSN, using an EU identity document. However, to receive your salary from a Dutch employer, having a Dutch bank account is strongly recommended. Having a Dutch IBAN also avoids SEPA transfer fees that some agencies pass on for foreign account payments.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "BSN Number Netherlands — Complete Guide for Agency Workers 2026",
  description: "Step-by-step guide to getting a Dutch BSN number as an EU agency worker, including RNI registration, required documents, and what your agency should arrange.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "en",
  url: "https://agencycheck.io/bsn-number-netherlands-guide",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://agencycheck.io" },
    { "@type": "ListItem", position: 2, name: "Guides", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "BSN Number Guide", item: "https://agencycheck.io/bsn-number-netherlands-guide" },
  ],
};

export default async function BsnGuide() {
  const featuredAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300">Guides</Link>
            <span>/</span>
            <span className="text-gray-400">BSN Number Netherlands</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">2026 Admin Guide</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            BSN Number Netherlands —<br className="hidden sm:block" />
            <span className="text-emerald-400">Complete Guide for EU Agency Workers</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Your <strong className="text-white">BSN (Burgerservicenummer)</strong> is your Dutch tax identification number.
            You need it to receive your correct salary, open a bank account, access healthcare, and file a tax return.
            As an EU/EEA citizen you are entitled to work in the Netherlands from day one — getting your BSN is the first administrative step after arrival.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Same-day at RNI desk", "19 RNI locations across NL", "Required for correct payroll", "Free to apply"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is BSN ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">What is a BSN and why do you need it?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            The <strong>Burgerservicenummer (BSN)</strong> is a permanent 9-digit number assigned to every person
            registered in the Netherlands. It is the equivalent of a social security number or tax ID number.
            Once assigned, your BSN never changes — even if you leave and return years later.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Your employer is legally required to register your BSN with the Dutch tax authority (Belastingdienst)
            within the first pay period. Without it, they must apply the <strong>anoniementarief</strong>
            — the anonymous withholding rate — which means significantly more tax is deducted from your first paycheck.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              { icon: "💶", label: "Payslip & payroll", desc: "Your employer files your tax using your BSN — required by Wet op de loonbelasting" },
              { icon: "🏥", label: "Health insurance", desc: "Your BSN is needed to register for Dutch zorgverzekering (mandatory health insurance)" },
              { icon: "🏦", label: "Bank account", desc: "Dutch banks (ING, Rabobank, ABN AMRO) require your BSN to open an account" },
              { icon: "📋", label: "Tax return & toeslagen", desc: "Needed to file a Dutch tax return and claim zorgtoeslag or huurtoeslag allowances" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-black text-gray-900">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Step by step ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Step-by-step: how to get your BSN</h2>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-black flex items-center justify-center mt-0.5">{s.step}</div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.body}</p>
                  {s.tip && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                      <strong>Note:</strong> {s.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documents ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Documents you need for BSN registration</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {DOCUMENTS.map((d) => (
                <div key={d.doc} className="flex items-start gap-4 px-5 py-4 bg-white">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{d.doc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RNI desk list ────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">RNI desks — 19 locations across the Netherlands</h2>
          <p className="text-sm text-gray-500 mb-5">
            If you are in agency housing without a permanent address, you register at one of these 19 RNI desks.
            Appointments can usually be booked online within 1–3 days.
          </p>
          <div className="flex flex-wrap gap-2">
            {RNI_DESKS.map((city) => (
              <span key={city} className="text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">{city}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Book appointments at the official municipality website for your nearest city. Your agency should provide the address of the nearest RNI desk.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
                <h3 className="text-sm font-black text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agency CTA ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Find work through AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Agencies that help you with BSN registration</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Good agencies guide you through the BSN process within the first 3 days of arrival.
              Browse verified agencies on AgencyCheck — free to apply via WhatsApp.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Browse all open vacancies →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Related guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/how-to-read-dutch-payslip",       label: "How to read your Dutch payslip" },
              { href: "/et-scheme-netherlands-explained",  label: "ET scheme — up to €150/wk extra net" },
              { href: "/after-you-apply",                  label: "What happens after you apply" },
              { href: "/what-is-order-picking",            label: "Order picking — pay and conditions" },
              { href: "/tools/real-salary-calculator",     label: "Net salary calculator Netherlands" },
              { href: "/work-in-netherlands-for-foreigners", label: "Complete guide for foreign workers" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
