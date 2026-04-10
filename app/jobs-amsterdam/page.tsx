import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";
import { getTopAgenciesForCity } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs Amsterdam Netherlands — Warehouse & Logistics 2026 | AgencyCheck",
  description:
    "Find warehouse, logistics and production jobs in Amsterdam. Housing available. Apply via verified Dutch employment agencies. Updated daily.",
  alternates: { canonical: "https://agencycheck.io/jobs-amsterdam" },
  openGraph: {
    title: "Jobs Amsterdam Netherlands — AgencyCheck",
    description: "Warehouse, logistics and production jobs in Amsterdam. Many include housing.",
  },
};

const CITY_NAME  = "Amsterdam";
const CITY_EMOJI = "🌆";
const CITY_SLUG  = "amsterdam";

const CITY_INFO = {
  population: "921,000",
  region:     "Noord-Holland",
  mainIndustries: ["Logistics", "Warehousing", "Distribution", "Food processing", "Manufacturing"],
  avgSalary:  "€15.20/hr",
  description: "Amsterdam is the capital and most populous city of the Netherlands. The city has a large logistics hub, particularly at Schiphol airport and the surrounding industrial zones. Many EU workers find work through agencies based in or near Amsterdam.",
};

export default function JobsAmsterdamPage() {
  // Filter jobs by Amsterdam location (case-insensitive)
  const cityJobs = JOB_LISTINGS.filter(
    (j) => j.isActive && j.city.toLowerCase().includes(CITY_SLUG)
  );

  const topAgencies = getTopAgenciesForCity(CITY_NAME, 6);

  // Job type breakdown
  const byType: Record<string, number> = {};
  for (const j of cityJobs) {
    byType[j.jobType] = (byType[j.jobType] ?? 0) + 1;
  }
  const topTypes = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const displayJobs = cityJobs.slice(0, 30);
  const totalJobs   = cityJobs.length > 0 ? cityJobs.length : 89;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in NL</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Amsterdam</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-2xl">{CITY_EMOJI}</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs}+ active jobs
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5">
            📍 {CITY_INFO.region}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Jobs in Amsterdam, Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          Amsterdam is the most active job market in the Netherlands for international EU workers, with the highest concentration of employment agencies operating in the country. The main hiring zones are not in the city centre itself — they cluster around <strong className="text-gray-800">Schiphol Airport</strong>, the <strong className="text-gray-800">Westpoort industrial harbour</strong>, and the logistics belts stretching into Zaandam and Hoofddorp. Distribution centres, cold-chain logistics, baggage and cargo handling, food production plants, and general warehouse operations are the dominant employers.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          What makes Amsterdam different from Rotterdam or Eindhoven is the sheer scale and variety of agencies competing for workers here — which means more options and, at the right sites, pay that goes above WML. Some Schiphol-area logistics operations pay €15.50–€17.00/hr for experienced workers on regulated shift patterns.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          The main trade-off: Amsterdam is the most expensive city in the Netherlands for housing. If your agency doesn&apos;t provide accommodation, expect to pay €650–€900/month for a shared room anywhere near the work zones. Most international workers living here rely on agency-arranged housing in Zaandam or Hoofddorp rather than renting privately in the city.
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",  value: `${totalJobs}+`,       icon: "💼" },
          { label: "Avg salary",   value: CITY_INFO.avgSalary,   icon: "💰" },
          { label: "Population",   value: CITY_INFO.population,  icon: "👥" },
          { label: "Region",       value: CITY_INFO.region,      icon: "📍" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <span className="text-xl">{stat.icon}</span>
            <p className="text-sm font-bold text-gray-900 mt-1 leading-tight">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Job types breakdown ─────────────────────────────────────────────── */}
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
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do Workers Earn in Amsterdam?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Most agency jobs in the Amsterdam area pay WML or slightly above. In 2026 that is <strong className="text-gray-800">€14.71/hr</strong> as the legal floor, but Schiphol-area logistics and cold-chain work often starts at €15.50–€16.50/hr. After Dutch income tax, housing deduction (if provided), transport, and insurance, most workers take home <strong className="text-gray-800">€340–€400/week net</strong> — or roughly <strong className="text-gray-800">€1,470–€1,730/month</strong>.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Estimated weekly payslip — warehouse role 40h/week</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€15.50/hr × 40h)", "+€620", "text-emerald-700"],
              ["Income tax (loonheffing ~11%)", "−€68", "text-red-600"],
              ["Agency housing (SNF certified)", "−€100", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Transport/bus", "−€25", "text-red-600"],
              ["Admin fees", "−€20", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€372</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          ⚠️ Night and weekend premiums of +20–35% can significantly increase take-home. Ask specifically which shifts are included and whether premiums are shown on the loonstrook.
        </p>
      </section>

      {/* ── Housing in Amsterdam ────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — What to Expect</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Agency housing near Amsterdam is typically located in <strong className="text-gray-800">Zaandam, Hoofddorp, or Aalsmeer</strong> — all within 15–30 minutes of the main Schiphol and Westpoort work sites. Most agencies provide shared housing with 2–4 people per room, deducting <strong className="text-gray-800">€88–€113/week</strong> from your salary. SNF or AKF certification means the property meets minimum Dutch quality standards.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Finding private housing in Amsterdam while working agency hours is genuinely difficult. The rental market is competitive, prices are the highest in the country, and many landlords are reluctant to rent to temporary workers. If you plan to arrange your own accommodation, budget at least €650/month for a shared room — and start looking before you arrive.
        </p>
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
          💡 Always ask whether agency housing is SNF or AKF certified and exactly how many people share a room. Get the deduction amount in writing before signing your contract.
        </div>
      </section>

      {/* ── Pros and Cons ──────────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">Working in Amsterdam — Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ Why workers choose Amsterdam",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Largest agency concentration in NL", b: "More agencies = more options, more bargaining power, faster placement." },
                { t: "Premium pay at Schiphol-area sites", b: "Aviation logistics and cold-chain pay €15.50–€17/hr, above WML average." },
                { t: "Excellent transport connections", b: "Train, bus, and tram links to most work zones in Noord-Holland." },
                { t: "Well-developed international community", b: "Polish, Romanian, Bulgarian, and English speakers are everywhere — easier to settle in." },
              ],
            },
            {
              title: "⚠️ What makes Amsterdam harder",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Most expensive housing in the Netherlands", b: "Private rooms cost €650–€900/month. Budget carefully if agency housing is not included." },
                { t: "Work zones are far from city centre", b: "Schiphol and Westpoort are 20–40 min by public transport. Plan commute times carefully." },
                { t: "High competition for good positions", b: "The best-paying roles fill fast. Be flexible on shift times and job types." },
                { t: "Agency quality varies widely", b: "More agencies also means more scammers. Always verify ABU/NBBU certification." },
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
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Come to Amsterdam for Work?</h2>
        <div className="space-y-2.5 text-sm text-gray-700">
          {[
            { icon: "✅", text: "Workers targeting Schiphol logistics, cold-chain, or aviation-adjacent roles — these pay the highest hourly rates in the region." },
            { icon: "✅", text: "Workers who already have agency housing arranged in Zaandam or Hoofddorp — this solves the cost problem immediately." },
            { icon: "✅", text: "Workers who speak Polish or Romanian and have connections to Amsterdam-area agencies — placement is faster through networks." },
            { icon: "✅", text: "Workers who want a major city lifestyle and don't need private housing — social life, public transport, and weekend options are excellent." },
            { icon: "⚠️", text: "Workers who need to find their own private housing should think carefully. The rental market is competitive and expensive compared to Rotterdam or Eindhoven." },
          ].map((item) => (
            <div key={item.text} className="flex gap-2.5">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <p className="leading-relaxed text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warning ────────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-7 text-xs text-amber-700">
        <strong>⚠️ Protect yourself:</strong> Always get a written contract. Confirm salary and housing costs before starting.
        Check the agency is ABU/NBBU certified. Never pay a fee to get a job.
      </div>

      {/* ── Jobs list ──────────────────────────────────────────────────────── */}
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
            <p className="text-gray-500 text-sm mb-3">
              Browse all agencies active in {CITY_NAME} or check the full job list.
            </p>
            <Link
              href="/jobs-in-netherlands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
            >
              View all NL jobs →
            </Link>
          </div>
        )}
      </section>

      {/* ── Top agencies ───────────────────────────────────────────────────── */}
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

      {/* ── Related links ──────────────────────────────────────────────────── */}
      <section className="mb-6 space-y-4">
        {/* Other cities */}
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">🏙️ Other cities in the Netherlands</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/jobs-rotterdam",   label: "Jobs in Rotterdam →",   sub: "Port logistics, forklift, warehousing" },
              { href: "/jobs-eindhoven",   label: "Jobs in Eindhoven →",   sub: "ASML & Philips supply chain roles" },
              { href: "/jobs-in-netherlands", label: "All cities overview →", sub: "Find jobs anywhere in the Netherlands" },
              { href: "/cities/tilburg",   label: "Jobs in Tilburg →",     sub: "Largest logistics hub in NL" },
            ].map(({ href, label, sub }) => (
              <Link key={href} href={href} className="card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all block">
                <p className="text-xs font-semibold text-brand-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Job types */}
        <div className="rounded-xl bg-green-50 border border-green-100 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-green-500 mb-3">💼 Job types available in Amsterdam</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/order-picker-jobs",                 label: "Order picker jobs →",         sub: "Most openings; no experience needed" },
              { href: "/reach-truck-jobs",                  label: "Reach truck jobs →",           sub: "Higher pay; licence required" },
              { href: "/warehouse-jobs-with-accommodation", label: "Warehouse + housing →",        sub: "Combined job & accommodation package" },
              { href: "/jobs-in-netherlands-for-foreigners",label: "Jobs for foreigners →",        sub: "No Dutch language required" },
            ].map(({ href, label, sub }) => (
              <Link key={href} href={href} className="bg-white border border-green-100 rounded-xl px-3 py-2.5 hover:border-green-300 hover:bg-green-50/50 transition-all block">
                <p className="text-xs font-semibold text-green-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Agency reviews */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">🏢 Agency reviews &amp; comparisons</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/otto-workforce-review",   label: "OTTO Workforce review →",   sub: "Housing, salary & worker experiences" },
              { href: "/tempo-team-review",        label: "Tempo-Team review →",        sub: "Amsterdam & Schiphol operations" },
              { href: "/agencies-with-housing",    label: "Agencies with housing →",    sub: "Find agencies that provide accommodation" },
              { href: "/tools/real-income-calculator", label: "Calculate take-home →", sub: "Net salary after tax & housing" },
            ].map(({ href, label, sub }) => (
              <Link key={href} href={href} className="bg-white border border-blue-100 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50/50 transition-all block">
                <p className="text-xs font-semibold text-blue-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center">
        Data is worker-reported and informational. Always verify job details with the agency directly.
      </p>
    </div>
  );
}
