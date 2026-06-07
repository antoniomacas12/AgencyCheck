import type { Metadata } from "next";
import Link from "next/link";
import GateLink from "@/components/GateLink";

export const metadata: Metadata = {
  title: "Reachtruck Driver Job in Tiel | €16.24/hour | AgencyCheck",
  description:
    "Reachtruck driver vacancy in Tiel, Netherlands. €16.24/hour, SNF-certified housing included. EU workers with reachtruck certificate. Apply via WhatsApp — fast response.",
  alternates: {
    canonical: "https://agencycheck.io/jobs/reachtruck-driver-tiel",
  },
  openGraph: {
    title: "Reachtruck Driver Job in Tiel | €16.24/hour | AgencyCheck",
    description: "€16.24/hour + housing included. Apply via WhatsApp today.",
  },
};

const SALARY_ROWS = [
  { label: "Gross pay (€16.24 × 40h/week)",  amount: "+€650", positive: true },
  { label: "Tax & social (loonheffing)",       amount: "−€72",  positive: false },
  { label: "SNF housing (shared room)",        amount: "−€98",  positive: false },
  { label: "Transport (agency bus)",           amount: "−€25",  positive: false },
  { label: "Health insurance",                 amount: "−€35",  positive: false },
  { label: "💶 You keep per week",             amount: "≈€420", positive: true },
] as const;

const BENEFITS = [
  { icon: "🏠", label: "SNF-certified housing", detail: "Shared accommodation, inspected. Costs deducted from gross — no upfront payment." },
  { icon: "🚌", label: "Transport included",    detail: "Bus from accommodation to warehouse. No car needed." },
  { icon: "📄", label: "Written contract",      detail: "ABU CAO contract. All deductions itemised before you travel." },
  { icon: "🌍", label: "EU workers welcome",    detail: "English + Polish/Romanian communication. No Dutch required." },
  { icon: "⚡", label: "Start in 7–14 days",   detail: "Fast placement after phone screening. Same-week WhatsApp response." },
  { icon: "🆓", label: "Free application",      detail: "You never pay a fee. Agencies pay us — not you." },
];

export default function ReachtruckDriverTielPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white">

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[12px] text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/partner-vacancies" className="hover:text-gray-300 transition-colors">Jobs</Link>
          <span>/</span>
          <span className="text-gray-300">Reachtruck Driver — Tiel</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-widest uppercase text-emerald-300">Active vacancy</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
          Reachtruck Driver<br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Tiel, Netherlands
          </span>
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-gray-300 font-semibold">
            💰 €16.24/hour
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-gray-300 font-semibold">
            🏠 Housing included
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-gray-300 font-semibold">
            📍 Tiel, Gelderland
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-gray-300 font-semibold">
            🏗️ Reachtruck cert required
          </span>
        </div>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6">
          We are placing reachtruck operators in Tiel, Gelderland. The position is through a verified Dutch employment agency. <strong className="text-white">Housing available from €70/wk</strong> — own accommodation preferred. ET regeling applicable, travel reimbursed.
        </p>

        {/* Primary CTA */}
        <GateLink
          source="reachtruck-tiel-hero"
          waBase="https://wa.me/31649210631"
          referralMode={false}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-7 py-4 text-[16px] font-black text-white"
          style={{ boxShadow: "0 0 0 1px rgba(37,211,102,0.30), 0 8px 28px rgba(37,211,102,0.20)" }}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Apply on WhatsApp
        </GateLink>
        <p className="mt-3 text-[12px] text-gray-500">Free application · Response within same working day</p>
      </section>

      {/* Salary breakdown */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 border-t border-white/[0.06]">
        <h2 className="text-xl font-black text-white mb-4">Weekly take-home estimate</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {SALARY_ROWS.map((row) => (
            <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] last:border-b-0 ${row.positive && row.amount.startsWith("≈") ? "bg-emerald-500/10" : ""}`}>
              <span className={`text-[13px] sm:text-[14px] ${row.positive && row.amount.startsWith("≈") ? "text-white font-black" : "text-gray-400"}`}>{row.label}</span>
              <span className={`font-bold text-[14px] sm:text-[15px] tabular-nums ${row.positive ? "text-emerald-400" : "text-red-400"}`}>{row.amount}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-600 mt-2">Estimate based on 40h/week, ABU CAO Phase A, 2026 tax tables. Actual amounts may vary.</p>
      </section>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 border-t border-white/[0.06]">
        <h2 className="text-xl font-black text-white mb-5">What is included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.label} className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <span className="text-2xl shrink-0">{b.icon}</span>
              <div>
                <p className="text-white font-bold text-[14px] mb-0.5">{b.label}</p>
                <p className="text-gray-500 text-[12px] leading-snug">{b.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 border-t border-white/[0.06]">
        <h2 className="text-xl font-black text-white mb-4">Requirements</h2>
        <ul className="space-y-2">
          {[
            "Valid reachtruck certificate (VCA or equivalent)",
            "EU citizen with valid BSN number",
            "Physically fit for warehouse work",
            "Available for day / evening shifts",
            "English or Polish/Romanian communication",
          ].map((req) => (
            <li key={req} className="flex items-start gap-2.5 text-[14px] text-gray-300">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              {req}
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 border-t border-white/[0.06]">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-6 py-8 text-center">
          <p className="text-white font-black text-xl mb-2">Ready to apply?</p>
          <p className="text-gray-400 text-sm mb-6">Send us a WhatsApp message — our recruiter responds the same day.</p>
          <GateLink
            source="reachtruck-tiel-final"
            waBase="https://wa.me/31649210631"
            referralMode={false}
            className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-8 py-4 text-[15px] font-black text-white"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Apply Now — Free
          </GateLink>
        </div>
      </section>

    </div>
  );
}
