import Link from "next/link";
import { PARTNER_VACANCIES, WRX_WA_NUMBER } from "@/lib/partnerVacancies";

const WA_ICON = (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function FeaturedPartnerVacancies() {
  if (PARTNER_VACANCIES.length === 0) return null;

  return (
    <section className="w-full mb-10">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
            🔥 Featured Partner Vacancies
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight mt-0.5">
            Real vacancies from AgencyCheck recruitment partners
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Submitted directly by verified agencies — apply instantly via WhatsApp
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1.5">
          ✓ Verified Recruitment Partner
        </span>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {PARTNER_VACANCIES.map((v) => {
          const waLink = `https://wa.me/${WRX_WA_NUMBER}?text=${encodeURIComponent(
            `Hi, I want to apply for: ${v.title} in ${v.location} [AgencyCheck Partner Vacancy]`
          )}`;

          return (
            <div
              key={v.slug}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] overflow-hidden flex flex-col"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5 shrink-0">
                    🔥 Priority
                  </span>
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5 shrink-0">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 truncate max-w-[100px] sm:max-w-none">{v.partner}</span>
              </div>

              {/* Content */}
              <div className="px-4 py-3 flex-1">
                <Link href={`/partner-vacancies/${v.slug}`}>
                  <h3 className="text-base font-black text-white hover:text-amber-300 transition-colors leading-tight mb-1">
                    {v.title}
                  </h3>
                </Link>
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
                        ? v.housingCost ? `From ${v.housingCost}` : "Own preferred"
                        : v.housing === "limited" ? "Ask on apply" : "Available"}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
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
              </div>

              {/* CTA — direct WhatsApp */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-black font-black text-sm py-3.5 rounded-xl transition-colors"
                >
                  {WA_ICON}
                  Apply on WhatsApp
                </a>
                <Link
                  href={`/partner-vacancies/${v.slug}`}
                  className="text-center text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  View full details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-gray-500 mt-3">
        Direct application · No middlemen · AgencyCheck reviews every submission
      </p>
    </section>
  );
}
