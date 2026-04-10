import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";
import { getTopAgenciesForCity } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs Rotterdam Netherlands — Warehouse & Port Work 2026 | AgencyCheck",
  description:
    "Find warehouse, port logistics, and production jobs in Rotterdam. Housing available. Apply via verified Dutch employment agencies. Updated daily.",
  alternates: { canonical: "https://agencycheck.io/jobs-rotterdam" },
  openGraph: {
    title: "Jobs Rotterdam Netherlands — AgencyCheck",
    description: "Warehouse, port logistics and production jobs in Rotterdam. Many include housing.",
  },
};

const CITY_NAME  = "Rotterdam";
const CITY_EMOJI = "⚓";
const CITY_SLUG  = "rotterdam";

const CITY_INFO = {
  population: "655,000",
  region:     "Zuid-Holland",
  avgSalary:  "€15.50/hr",
  description: "Rotterdam is Europe's largest port and a major logistics hub. The city has huge demand for warehouse workers, forklift drivers, and distribution centre staff. Many jobs are available near Maasvlakte, Botlek, and Waalhaven.",
};

export default function JobsRotterdamPage() {
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
  const totalJobs   = cityJobs.length > 0 ? cityJobs.length : 72;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in NL</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Rotterdam</span>
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
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5">
            🚢 Europe&apos;s largest port
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Jobs in Rotterdam, Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          Rotterdam is home to Europe&apos;s largest port — and that single fact shapes the entire job market here. The <strong className="text-gray-800">Maasvlakte, Botlek, and Waalhaven</strong> industrial zones generate continuous demand for warehouse workers, forklift and reach-truck drivers, container loaders, and distribution centre staff. Unlike Amsterdam where jobs cluster around an airport, Rotterdam&apos;s work is more physically intensive and concentrated in serious logistics infrastructure — cold storage, bulk cargo handling, food processing plants, and large-scale e-commerce fulfilment for the port&apos;s hinterland.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          For international workers, Rotterdam has a significant advantage over Amsterdam: <strong className="text-gray-800">housing is genuinely more affordable</strong>. Private rooms in South Holland run €450–€700/month, and agency accommodation in surrounding areas like Ridderkerk, Barendrecht, or Vlaardingen is generally cheaper and less overcrowded than near Schiphol.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Workers with forklift or reach-truck licences (VCA and BHV certificates are a plus) are in particularly high demand. Rotterdam&apos;s port operations run 24/7 — night and weekend shift premiums of 25–35% are standard and properly paid at certified agencies.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",  value: `${totalJobs}+`,      icon: "💼" },
          { label: "Avg salary",   value: CITY_INFO.avgSalary,  icon: "💰" },
          { label: "Population",   value: CITY_INFO.population, icon: "👥" },
          { label: "Port traffic", value: "#1 in EU",           icon: "🚢" },
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
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do Workers Earn in Rotterdam?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Rotterdam&apos;s port operations push wages slightly above Amsterdam&apos;s average for warehouse and logistics work. Basic warehouse roles start at WML (<strong className="text-gray-800">€14.71/hr</strong>), while forklift drivers, reach-truck operators, and specialised port logistics roles typically earn <strong className="text-gray-800">€15.50–€18.00/hr</strong>. Night and weekend premiums are consistently applied at ABU-certified agencies.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Estimated weekly payslip — forklift driver 40h/week</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€16.00/hr × 40h)", "+€640", "text-emerald-700"],
              ["Income tax (loonheffing ~12%)", "−€77", "text-red-600"],
              ["Agency housing (SNF certified)", "−€95", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Transport/bus to Botlek", "−€20", "text-red-600"],
              ["Admin fees", "−€20", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€393</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          💡 Workers on 24/7 port shift rotations with consistent night premiums can take home €430–€480/week. Ask specifically about shift patterns and whether Sunday premiums are included in the contract.
        </p>
      </section>

      {/* ── Housing in Rotterdam ────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — Cheaper Than Amsterdam, Still Variable</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Agency housing near Rotterdam is generally arranged in <strong className="text-gray-800">Ridderkerk, Barendrecht, Vlaardingen, or Spijkenisse</strong> — all within 20–30 minutes of the main port work zones. Deductions are typically <strong className="text-gray-800">€88–€110/week</strong>. Standards vary: some properties are SNF-certified and well-maintained; others are older shared houses. Always ask about the certification and occupancy before accepting.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Private rentals near Rotterdam are meaningfully cheaper than Amsterdam — expect €450–€700/month for a shared room in a working-class neighbourhood close to the port. Workers who find their own housing here often keep an extra €100–€200/month compared to colleagues paying agency housing rates.
        </p>
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-xs text-green-800">
          ✅ Rotterdam housing tip: Areas like Pernis, Hook of Holland, and Schiedam are close to major logistics sites and have lower rents than the city centre. Worth exploring if you&apos;re looking for private accommodation.
        </div>
      </section>

      {/* ── Pros and Cons ──────────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">Working in Rotterdam — Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ Why workers choose Rotterdam",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Premium pay for licensed roles", b: "Forklift, reach-truck, and VCA-certified workers earn €15.50–€18/hr — above most cities." },
                { t: "More affordable housing than Amsterdam", b: "Private rooms €450–€700/month vs €650–€900 in Amsterdam. Your money goes further." },
                { t: "Steady 24/7 port operations", b: "Work is consistent year-round — port logistics don't slow down seasonally." },
                { t: "Large Polish/Romanian worker community", b: "Strong networks, multilingual agency staff, and peer support for new arrivals." },
              ],
            },
            {
              title: "⚠️ What to know before going",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Port zones are far from city centre", b: "Maasvlakte is 30–40 min by car or agency bus. You need reliable transport." },
                { t: "Physically demanding work", b: "Port logistics and heavy warehouse roles are tiring. Night shifts are common and long." },
                { t: "Language gap at some employers", b: "Dutch is spoken on many port sites. Agencies with multilingual staff help, but it&apos;s something to be aware of." },
                { t: "Housing varies sharply by operator", b: "Rotterdam has both excellent and poor-quality agency housing. Verify before accepting." },
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
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Come to Rotterdam for Work?</h2>
        <div className="space-y-2.5">
          {[
            { icon: "✅", text: "Workers with a forklift or reach-truck licence — Rotterdam has the highest demand and pays the best rates for licensed operators in the country." },
            { icon: "✅", text: "Workers who want consistent year-round employment. Port logistics doesn't have seasonal dips like agriculture or event work." },
            { icon: "✅", text: "Workers who want to keep more of their money — housing is meaningfully cheaper here than in Amsterdam or Utrecht." },
            { icon: "✅", text: "Workers comfortable with night shifts and 12-hour rotations — the pay uplift makes it worthwhile, but you need to be physically ready for it." },
            { icon: "⚠️", text: "Workers who need a city-centre lifestyle: Rotterdam's work zones are in the industrial west and south, a long way from the city's social life." },
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
            { href: "/jobs-eindhoven",               label: "Agency jobs in Eindhoven →" },
            { href: "/jobs-in-netherlands",          label: "All agency jobs Netherlands →" },
            { href: "/reach-truck-jobs",             label: "Reach-truck driver jobs NL →" },
            { href: "/warehouse-jobs-with-accommodation", label: "Warehouse jobs with housing →" },
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
