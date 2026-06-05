import Link from "next/link";
import { PARTNER_VACANCIES } from "@/lib/partnerVacancies";

export default function FeaturedPartnerVacancies() {
  if (PARTNER_VACANCIES.length === 0) return null;

  return (
    <section className="w-full mb-10">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              🔥 Featured Partner Vacancies
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            Real vacancies from AgencyCheck recruitment partners
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Submitted directly by verified agencies — not scraped or auto-generated
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1.5">
          ✓ Verified Recruitment Partner
        </span>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {PARTNER_VACANCIES.map((v) => (
          <Link
            key={v.slug}
            href={`/partner-vacancies/${v.slug}`}
            className="group rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] hover:border-amber-500/40 hover:bg-amber-500/[0.08] transition-all overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">
                  🔥 Priority
                </span>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5">
                  ✓ Verified
                </span>
              </div>
              <span className="text-[10px] text-gray-500">{v.partner}</span>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-tight mb-1">
                {v.title}
              </h3>
              <p className="text-xs text-gray-400 mb-3">📍 {v.location}, Netherlands · {v.employment}</p>

              {/* Key facts */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-400">Salary</p>
                  <p className="text-sm font-black text-emerald-400">{v.salaryDisplay}</p>
                </div>
                <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                  <p className="text-[10px] text-gray-400">Housing</p>
                  <p className="text-sm font-semibold text-gray-200">
                    {v.housing === "own_preferred"
                      ? v.housingCost
                        ? `From ${v.housingCost}`
                        : "Own preferred"
                      : v.housing === "limited"
                      ? "Ask on apply"
                      : "Available"}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {v.certificates.map((c) => (
                  <span key={c} className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full px-2 py-0.5">
                    🏅 {c}
                  </span>
                ))}
                {v.languages.map((l) => (
                  <span key={l} className="text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full px-2 py-0.5">
                    🗣 {l}
                  </span>
                ))}
                {v.transport === "own_required" && (
                  <span className="text-[10px] font-semibold bg-white/[0.06] text-gray-300 border border-white/[0.10] rounded-full px-2 py-0.5">
                    🚗 Own car
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 group-hover:text-amber-300 transition-colors">
                  View & Apply →
                </span>
                <span className="text-[10px] text-gray-500">via AgencyCheck</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom trust note */}
      <p className="text-center text-[11px] text-gray-500 mt-3">
        Applications are reviewed personally by AgencyCheck before forwarding to the employer.
      </p>
    </section>
  );
}
