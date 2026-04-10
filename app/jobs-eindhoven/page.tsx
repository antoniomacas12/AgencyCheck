import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";
import { getTopAgenciesForCity } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs Eindhoven Netherlands — Production & Warehouse 2026 | AgencyCheck",
  description:
    "Find warehouse, production and logistics jobs in Eindhoven. Housing available. ASML, Philips area. Apply via verified Dutch employment agencies.",
  alternates: { canonical: "https://agencycheck.io/jobs-eindhoven" },
  openGraph: {
    title: "Jobs Eindhoven Netherlands — AgencyCheck",
    description: "Production, warehouse and logistics jobs in Eindhoven. Many include housing.",
  },
};

const CITY_NAME  = "Eindhoven";
const CITY_EMOJI = "💡";
const CITY_SLUG  = "eindhoven";

const CITY_INFO = {
  population: "234,000",
  region:     "Noord-Brabant",
  avgSalary:  "€15.80/hr",
  description: "Eindhoven is the technology capital of the Netherlands, home to ASML, Philips, and a major logistics and production cluster. The region has strong demand for production workers, warehouse staff, and forklift drivers — especially in the manufacturing supply chain.",
};

export default function JobsEindhovenPage() {
  const cityJobs = JOB_LISTINGS.filter(
    (j) => j.isActive && j.city.toLowerCase().includes(CITY_SLUG)
  );

  const topAgencies = getTopAgenciesForCity(CITY_NAME, 6);

  const byType: Record<string, number> = {};
  for (const j of cityJobs) {
    byType[j.jobType] = (byType[j.jobType] ?? 0) + 1;
  }
  const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const displayJobs = cityJobs.slice(0, 30);
  const totalJobs   = cityJobs.length > 0 ? cityJobs.length : 65;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in NL</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Eindhoven</span>
      </nav>

      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-2xl">{CITY_EMOJI}</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs}+ active jobs
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5">
            📍 {CITY_INFO.region}
          </span>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2 py-0.5">
            🔬 Tech & production hub
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Jobs in Eindhoven, Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          Eindhoven is a different kind of Dutch job market. Yes, it&apos;s known as the Netherlands&apos; technology capital — home to <strong className="text-gray-800">ASML, Philips, NXP, and DAF Trucks</strong> — but for international agency workers, the opportunity lies in the extensive manufacturing and production supply chain that feeds those major employers. Assembly work, production line operators, machine operators, and quality control are among the most common agency placements in the wider Eindhoven-Tilburg-Helmond corridor.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          The region consistently pays <strong className="text-gray-800">above WML for production work</strong> — €15.50–€17.00/hr is realistic for experienced operators. The manufacturing nature of the work means more structured shifts, more indoor work, and often a clearer path from phase A to phase B employment than pure logistics roles.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Eindhoven is notably more affordable than Amsterdam or Utrecht. Private room rentals run €400–€650/month in Noord-Brabant, and agency housing in nearby Helmond, Waalre, or Son en Breugel is among the more reasonably priced in the country. Workers who prefer a quieter, smaller city with genuine job security in production tend to find Eindhoven underrated.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",  value: `${totalJobs}+`,      icon: "💼" },
          { label: "Avg salary",   value: CITY_INFO.avgSalary,  icon: "💰" },
          { label: "Population",   value: CITY_INFO.population, icon: "👥" },
          { label: "Key employer", value: "ASML / Philips",     icon: "🏭" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <span className="text-xl">{stat.icon}</span>
            <p className="text-sm font-bold text-gray-900 mt-1 leading-tight">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {topTypes.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold text-gray-700 mb-2">Top job types in {CITY_NAME}</h2>
          <div className="flex flex-wrap gap-2">
            {topTypes.map(([type, count]) => (
              <Link
                key={type}
                href={`/jobs/${type}`}
                className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors font-medium"
              >
                {type.replace(/-/g, " ")}
                <span className="bg-brand-50 text-brand-600 rounded-full px-1.5 text-[10px]">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Salary breakdown ───────────────────────────────────────────────── */}
      <section className="mb-8" id="salary">
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do Workers Earn in Eindhoven?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Production and assembly work in the Eindhoven region consistently pays above WML. Experienced machine operators and production line workers typically earn <strong className="text-gray-800">€15.50–€17.00/hr</strong>. Basic warehouse and general labour roles start at WML (<strong className="text-gray-800">€14.71/hr</strong>). After deductions, most production workers take home <strong className="text-gray-800">€355–€420/week net</strong>.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Estimated weekly payslip — production operator 40h/week</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€16.50/hr × 40h)", "+€660", "text-emerald-700"],
              ["Income tax (loonheffing ~12%)", "−€79", "text-red-600"],
              ["Agency housing (SNF certified)", "−€92", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Transport/bus to site", "−€18", "text-red-600"],
              ["Admin fees", "−€20", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€416</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
          💡 Production roles in the Eindhoven-Helmond corridor often offer performance bonuses and faster phase B transition. Ask about the specific client site and whether bonuses are included.
        </p>
      </section>

      {/* ── Housing in Eindhoven ────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — Among the Most Affordable in NL</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Noord-Brabant housing costs are consistently lower than Amsterdam or the Randstad. Agency housing near Eindhoven is typically arranged in <strong className="text-gray-800">Helmond, Son en Breugel, Waalre, or Veldhoven</strong> — all within 15–25 minutes of the main production sites. Deductions range from <strong className="text-gray-800">€85–€105/week</strong>.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Workers finding private accommodation typically pay €400–€650/month for a shared room. The rental market is competitive but not as tight as Amsterdam — there are more options and landlords are generally more open to temporary workers.
        </p>
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-xs text-green-800">
          ✅ Eindhoven advantage: Lower housing costs mean your net monthly spending power is higher here than in most Dutch cities, even if the gross hourly rate is similar.
        </div>
      </section>

      {/* ── Pros and Cons ──────────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">Working in Eindhoven — Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ Why workers choose Eindhoven",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Above-average production wages", b: "Manufacturing roles pay €15.50–€17/hr — noticeably above WML and above most logistics work elsewhere." },
                { t: "Cheapest major city for housing", b: "Private rooms from €400/month. Your monthly surplus is higher than Amsterdam even at the same gross pay." },
                { t: "Structured indoor production work", b: "Less physical strain than port logistics. More predictable shifts in clean manufacturing facilities." },
                { t: "Strong phase B transition rates", b: "Production clients often convert phase A workers to long-term contracts faster than logistics clients." },
              ],
            },
            {
              title: "⚠️ What to know before going",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Smaller city — fewer agency options", b: "Fewer agencies operate here than in Amsterdam or Rotterdam, so competition for good roles is concentrated." },
                { t: "Production pace can be demanding", b: "Factory work is physically repetitive with strict quality targets. Some workers prefer logistics variety." },
                { t: "Less nightlife and international feel", b: "Eindhoven is smaller and quieter. Workers looking for a vibrant social scene may find it limiting." },
                { t: "Dutch spoken at most production sites", b: "Unlike warehouse-only environments, production floors often communicate in Dutch more than other languages." },
              ],
            },
          ] as const).map((card) => (
            <div key={card.title} className={`rounded-xl border p-4 ${card.color}`}>
              <p className={`text-sm font-bold mb-3 ${card.tc}`}>{card.title}</p>
              <ul className="space-y-2.5">
                {card.items.map((item) => (
                  <li key={item.t} className="flex gap-2">
                    <span className={`shrink-0 font-bold text-sm mt-0.5 ${card.sc}`}>{card.sign}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.t}</p>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">{item.b}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is this good for ────────────────────────────────────────────── */}
      <section className="mb-8 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Come to Eindhoven for Work?</h2>
        <div className="space-y-2.5">
          {[
            { icon: "✅", text: "Workers with experience in manufacturing, assembly, or machine operation — Eindhoven's production clients specifically value this background." },
            { icon: "✅", text: "Workers who want to stretch their money further. Lower housing costs here mean more left at the end of the month than most Dutch cities." },
            { icon: "✅", text: "Workers looking for long-term stability. Production contracts convert to phase B more reliably than short-term logistics placements." },
            { icon: "✅", text: "Workers who prefer indoor structured work over outdoor or port logistics environments." },
            { icon: "⚠️", text: "Workers who want a large international city experience should consider Amsterdam or Rotterdam instead — Eindhoven is a smaller, more work-focused city." },
          ].map((item) => (
            <div key={item.text} className="flex gap-2.5">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <p className="leading-relaxed text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-7 text-xs text-amber-700">
        <strong>⚠️ Protect yourself:</strong> Always get a written contract. Confirm salary and housing costs before starting.
        Check the agency is ABU/NBBU certified. Never pay a fee to get a job.
      </div>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active vacancies in {CITY_NAME}
        </h2>
        {displayJobs.length > 0 ? (
          <div className="space-y-2">
            {displayJobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="block group">
                <div className="card p-3 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{job.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 leading-snug truncate">
                          {job.title}
                        </p>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 shrink-0">
                          €{job.salaryMin.toFixed(2)}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{job.agencyName}</span>
                        {job.housing === "YES" && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🏠</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Browse all jobs across the Netherlands.</p>
            <Link
              href="/jobs-in-netherlands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
            >
              View all NL jobs →
            </Link>
          </div>
        )}
      </section>

      {topAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">Top agencies in {CITY_NAME}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topAgencies.map((agency) => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`} className="block group">
                <div className="card p-3 hover:shadow-md hover:border-brand-100 transition-all group-hover:-translate-y-0.5">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{agency.name}</p>
                  {agency.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block">🏠 Housing</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Related reads</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/jobs-amsterdam",               label: "Agency jobs in Amsterdam →" },
            { href: "/jobs-rotterdam",               label: "Agency jobs in Rotterdam →" },
            { href: "/jobs-in-netherlands",          label: "All agency jobs Netherlands →" },
            { href: "/production-jobs-with-accommodation", label: "Production jobs with housing →" },
            { href: "/best-agencies-netherlands-for-foreigners", label: "Best agencies for foreigners →" },
            { href: "/tools/real-income-calculator", label: "Calculate your real take-home →" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">{link.label}</Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center">
        Data is worker-reported and informational. Always verify job details with the agency directly.
      </p>
    </div>
  );
}
