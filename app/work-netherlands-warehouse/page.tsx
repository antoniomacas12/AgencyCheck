import type { Metadata } from "next";
import Link from "next/link";
import StickyApplyBar from "@/components/StickyApplyBar";
import GateLink      from "@/components/GateLink";
import { WA_NUMBER } from "@/lib/whatsapp";

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Work in the Netherlands — Warehouse Jobs, Housing Included | AgencyCheck",
  description:
    "100+ jobs in NL. Warehouse, production, logistics. No fees, housing included. Apply via WhatsApp and we reply the same day.",
  keywords: [
    "work in Netherlands warehouse", "warehouse jobs Netherlands no experience",
    "work Netherlands no experience", "warehouse jobs holland",
    "production jobs netherlands housing included", "work in holland warehouse",
    "jobs netherlands with accommodation", "netherlands warehouse job english",
  ],
  alternates: {
    canonical: "https://agencycheck.io/work-netherlands-warehouse",
    languages: {
      "en":        "https://agencycheck.io/work-netherlands-warehouse",
      "pl":        "https://agencycheck.io/praca-holandia-magazyn",
      "x-default": "https://agencycheck.io/work-netherlands-warehouse",
    },
  },
  openGraph: {
    title: "Work in the Netherlands — Warehouse Jobs, Housing | AgencyCheck",
    description: "100+ jobs in NL. Warehouse, production. No fees. Housing included. Apply via WhatsApp.",
  },
};

// ─── Real job data (from vacanciesData.ts — actual live postings) ──────────────
const JOBS = [
  {
    slug:     "order-picker-ept-driver-food-freezer-waalwijk",
    title:    "Order Picker / EPT Driver — Food (Freezer)",
    location: "Waalwijk",
    salary:   "€14.98/h gross",
    desc:     "Work in a refrigerated / freezer distribution hall. Operating an electric pallet truck (EPT). Housing available near the workplace from day one.",
    badge:    "🏠 Housing included",
    noExp:    true,
  },
  {
    slug:     "allround-warehouse-eindhoven",
    title:    "All-round Warehouse Worker",
    location: "Helmond / Deurne / Eindhoven",
    salary:   "€14.71/h gross",
    desc:     "Varied warehouse tasks — order picking, packing, and goods handling. Live interview on site required. Agency accommodation available nearby.",
    badge:    "🏠 Housing included",
    noExp:    true,
  },
  {
    slug:     "order-picker-ept-experience-apeldoorn",
    title:    "Order Picker with EPT Experience",
    location: "Apeldoorn",
    salary:   "€16.47/h gross",
    desc:     "Higher hourly rate for candidates with proven EPT experience. Fast-paced environment with clear daily targets. Housing organised by the agency.",
    badge:    "🏠 Housing included",
    noExp:    false,
  },
  {
    slug:     "warehouse-worker-amsterdam-tilburg-den-bosch",
    title:    "Warehouse Worker — Distribution Centre",
    location: "Amsterdam / Tilburg / Den Bosch",
    salary:   "€14.71/h gross",
    desc:     "Large distribution centres across multiple locations. Pick your preferred city. Agency housing available close to your workplace.",
    badge:    "🏠 Housing included",
    noExp:    true,
  },
  {
    slug:     "warehouse-worker-experience-waddinxveen",
    title:    "Experienced Warehouse Worker",
    location: "Waddinxveen",
    salary:   "€16.47/h gross",
    desc:     "Previous warehouse experience required. Higher rate rewards skilled candidates. SNF-certified housing provided from the start.",
    badge:    "🏠 Housing included",
    noExp:    false,
  },
  {
    slug:     "order-picker-ept-experience-fresh-netherlands",
    title:    "Order Picker — Fresh / Chilled Department",
    location: "Netherlands",
    salary:   "€14.98/h gross",
    desc:     "Order picking in a fresh / chilled goods department. Work with a scanner — no Dutch required. Agency accommodation available across the Netherlands.",
    badge:    "🏠 Housing included",
    noExp:    true,
  },
] as const;

const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const SOURCE  = "en-warehouse";

// ─── JobPosting Schema ─────────────────────────────────────────────────────────
function jobPostingSchema(job: (typeof JOBS)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.desc,
    hiringOrganization: {
      "@type": "Organization",
      name: "AgencyCheck",
      sameAs: "https://agencycheck.io",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
        addressLocality: job.location,
      },
    },
    employmentType: "FULL_TIME",
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        unitText: "HOUR",
      },
    },
    datePosted: new Date().toISOString().split("T")[0],
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    applicantLocationRequirements: { "@type": "Country", name: "Netherlands" },
    jobBenefits: "Housing provided, transport organised by agency, no placement fee",
  };
}

// ─── WA icon ──────────────────────────────────────────────────────────────────
function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function WorkNetherlandsWarehousePage() {
  return (
    <>
      {/* ── JSON-LD schemas ── */}
      {JOBS.map((job) => (
        <script
          key={job.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema(job)) }}
        />
      ))}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wide text-emerald-400">
              {JOBS.length} active positions
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Work in the Netherlands —{" "}
            <span className="text-emerald-400">Warehouse &amp; Production</span>,{" "}
            Housing Included
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
            100+ current jobs. No fees. Apply via WhatsApp and we reply{" "}
            <strong className="text-white">the same day</strong>.
          </p>

          <GateLink
            source={SOURCE}
            jobTitle="Warehouse job — Netherlands"
            jobId="en-warehouse"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Apply via WhatsApp →
          </GateLink>

          <p className="text-gray-500 text-[12px] mt-3">
            Free for workers · Same-day reply
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["No fees", "Housing included", "No experience needed", "No Dutch required"].map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-gray-300"
              >
                <span className="text-emerald-400">✓</span> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB CARDS ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl mb-1">Current Job Openings</h2>
          <p className="text-gray-400 text-sm mb-6">Verified active positions. No middlemen.</p>

          <div className="space-y-3">
            {JOBS.map((job) => (
              <div
                key={job.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-[15px] leading-snug">{job.title}</h3>
                      <span className="shrink-0 text-[10px] font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 rounded-full px-2 py-0.5">
                        {job.badge}
                      </span>
                      {job.noExp && (
                        <span className="shrink-0 text-[10px] font-bold bg-blue-400/10 text-blue-300 border border-blue-400/20 rounded-full px-2 py-0.5">
                          No experience
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[12px]">📍 {job.location} &nbsp;·&nbsp; 💶 {job.salary}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-[13px] leading-relaxed mb-4">{job.desc}</p>
                <GateLink
                  source={SOURCE}
                  jobTitle={job.title}
                  jobId={job.slug}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-bold text-[14px] py-3 rounded-xl transition-all duration-150"
                >
                  <WAIcon className="w-4 h-4" />
                  Apply on WhatsApp
                </GateLink>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-[12px] mt-5">
            Looking for more?{" "}
            <Link href="/apply" className="text-emerald-400 underline">
              Browse all positions →
            </Link>
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0f1f14] border-y border-white/[0.06] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-8">How Does It Work?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                n: "1",
                title: "Pick a Job",
                body: "Click «Apply via WhatsApp» under any position that interests you.",
              },
              {
                n: "2",
                title: "Send Your Application",
                body: "WhatsApp opens with a pre-filled message. Send it and confirm your details with our recruiter.",
              },
              {
                n: "3",
                title: "We Call You Back",
                body: "We respond the same day — confirming your start date, pay rate, and housing arrangement.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 font-black text-[14px]">{s.n}</span>
                </div>
                <h3 className="text-white font-bold text-[14px] mb-1">{s.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AGENCYCHECK ───────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Why Apply Through Us?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: "🆓",
                title: "Always Free for Workers",
                body: "You never pay a placement fee. The agency covers our costs — 100%.",
              },
              {
                icon: "🏠",
                title: "Housing From Day One",
                body: "SNF-standard accommodation close to your workplace, arranged by the agency before you arrive.",
              },
              {
                icon: "✅",
                title: "Verified Agencies Only",
                body: "We work exclusively with certified Dutch temp agencies (SNA/ABU) — no cowboys.",
              },
              {
                icon: "⚡",
                title: "Same-Day Response",
                body: "Our recruiters reply the same day — usually within a few hours of your WhatsApp message.",
              },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="text-white font-bold text-[14px] mb-1">{b.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] px-4 py-10 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "Do I need to pay anything?",
                a: "No. Applying through AgencyCheck is 100% free for workers. The agency pays us for successful placements — you keep your full earnings.",
              },
              {
                q: "Do I need to speak Dutch?",
                a: "Most warehouse and production roles require only basic English or no language at all. Instructions are often given visually or with a scanner.",
              },
              {
                q: "How does the housing work?",
                a: "The agency organises accommodation (typically worker houses / housing parks) close to your workplace. The cost is around €95–€113 per week, deducted from your salary.",
              },
              {
                q: "How quickly can I start?",
                a: "Most positions have a start within 1–2 weeks of first contact. Many roles are looking for immediate starters.",
              },
              {
                q: "Do I need a BSN (Dutch tax number)?",
                a: "If you don't have one yet, the agency will help you register after you arrive. It doesn't block your employment — you can start before it's issued.",
              },
              {
                q: "Do I need previous warehouse experience?",
                a: "Many of our positions are suitable for beginners. Roles marked «No experience» require no prior warehouse background — full on-site training is provided.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white font-bold text-[14px] mb-2">{faq.q}</p>
                <p className="text-gray-400 text-[13px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1f14] px-4 py-10 border-t border-[#25D366]/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-white font-black text-xl mb-3">Ready to Apply?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Message us on WhatsApp — we reply the same day.
          </p>
          <GateLink
            source={SOURCE}
            jobTitle="Warehouse job — Netherlands"
            jobId="en-warehouse"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Apply via WhatsApp →
          </GateLink>
          <div className="mt-6 text-[12px] text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="mailto:hello@agencycheck.io" className="hover:text-gray-400">hello@agencycheck.io</a>
            <Link href="/agencies" className="hover:text-gray-400">Browse Agencies</Link>
            <Link href="/apply" className="hover:text-gray-400">All Jobs</Link>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile apply bar ─────────────────────────────────────────── */}
      <StickyApplyBar
        waBase={WA_BASE}
        jobTitle="Warehouse job — Netherlands"
        source={SOURCE}
        jobId="en-warehouse"
        referralMode={true}
      />

      {/* Bottom padding so sticky bar doesn't cover content on mobile */}
      <div className="h-24 md:hidden" />
    </>
  );
}
