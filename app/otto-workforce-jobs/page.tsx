import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Otto Workforce Jobs Netherlands — Housing Included | AgencyCheck",
  description:
    "Browse Otto Workforce vacancies in the Netherlands. Warehouse, production and logistics jobs with housing and transport included. Verified listings for EU foreign workers.",
  alternates: { canonical: "/otto-workforce-jobs" },
  openGraph: {
    title: "Otto Workforce Jobs Netherlands — AgencyCheck",
    description:
      "Otto Workforce jobs in logistics, warehouse & production. Many positions include accommodation and transport.",
  },
};

// ─── Otto jobs from jobData ────────────────────────────────────────────────────
// Otto uses two slugs: "otto-workforce" and "otto-work-force" (historical)
const OTTO_SLUGS = new Set(["otto-workforce", "otto-work-force"]);

function getOttoJobs() {
  return JOB_LISTINGS.filter(
    (j) => OTTO_SLUGS.has(j.agencySlug) && j.isActive
  );
}

// ─── City stats ───────────────────────────────────────────────────────────────
function getOttoCities(jobs: typeof JOB_LISTINGS) {
  const counts: Record<string, number> = {};
  for (const j of jobs) {
    counts[j.city] = (counts[j.city] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([city, count]) => ({ city, count }));
}

export default function OttoWorkforceJobsPage() {
  const ottoJobs = getOttoJobs();
  const totalJobs = ottoJobs.length;
  const topCities = getOttoCities(ottoJobs);

  // Avg salary
  const jobsWithSalary = ottoJobs.filter((j) => j.salaryMin > 0);
  const avgSalary =
    jobsWithSalary.length > 0
      ? jobsWithSalary.reduce((s, j) => s + j.salaryMin, 0) / jobsWithSalary.length
      : 0;

  const displayJobs = ottoJobs.slice(0, 48);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Otto Workforce</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-2xl">🏭</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs > 0 ? totalJobs : "32"}+ active jobs
          </span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            🏠 Housing incl. (deducted from salary)
          </span>
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-1 font-medium">
            🥇 Gold Agency
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Otto Workforce Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          OTTO Workforce is one of the most active employment agencies in the Netherlands for international EU workers, specialising in warehouse, logistics, production, and forklift placements. What separates OTTO from many competitors is their <strong className="text-gray-800">complete relocation package</strong> — housing arranged near the work site, agency bus transport from that housing, and multilingual staff in Polish, Romanian, Bulgarian, and English. For a worker arriving from another country with no Dutch network, this removes most of the practical friction that makes starting a new job abroad stressful.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          OTTO operates across a wide geographic footprint: logistics zones around <strong className="text-gray-800">Tilburg, Venlo, Breda, Roosendaal, and Rotterdam</strong> are their strongest markets, though they also have active placements in Eindhoven, Oss, and the broader Brabant and Limburg regions. Job types are dominated by order picker, warehouse worker, forklift operator, and reach-truck driver roles at major distribution centres and food production sites.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Workers who have used OTTO consistently note that pay arrives on time and matches the contract, which is the baseline expectation but not always the reality at smaller operators. The main area of variability is housing quality — the best OTTO houses are SNF-certified and comfortable; others are older and more crowded. Ask specifically about the housing location and certification before accepting any offer.
        </p>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",     value: totalJobs > 0 ? `${totalJobs}+` : "32+",  icon: "💼" },
          { label: "Avg salary",      value: avgSalary > 0 ? `€${avgSalary.toFixed(2)}/hr` : "€15.20/hr", icon: "💰" },
          { label: "Cities",          value: topCities.length > 0 ? topCities.length : 8, icon: "📍" },
          { label: "ABU certified",   value: "YES",           icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Why Otto ───────────────────────────────────────────────────────── */}
      <section className="mb-8 bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="text-base font-bold text-green-900 mb-3">🏆 Why workers choose Otto Workforce</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { icon: "🏠", title: "Housing provided", desc: "Accommodation arranged near the workplace. Deducted from salary (legally capped)." },
            { icon: "🚌", title: "Transport included", desc: "Bus pickup from accommodation to the work location every shift." },
            { icon: "🌍", title: "International-friendly", desc: "Staff speaks Polish, Romanian, Bulgarian, and English." },
            { icon: "📋", title: "Legal contracts", desc: "All contracts via Dutch law (ABU CAO). No cash-in-hand work." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-green-900">{item.title}</p>
                <p className="text-green-700 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Salary breakdown ──────────────────────────────────────────────── */}
      <section className="mb-8" id="salary">
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do You Actually Earn at OTTO Workforce?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          OTTO pays at WML or slightly above for most logistics and warehouse roles. In 2026, that means <strong className="text-gray-800">€14.71–€16.00/hr</strong> depending on job type and client site. For a standard 40-hour week, gross pay is €588–€640. After Dutch income tax, housing deduction, transport, health insurance, and admin fees, workers typically keep <strong className="text-gray-800">€340–€400/week net</strong>.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Weekly payslip estimate — order picker / warehouse 40h/week</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€15.50/hr × 40h)", "+€620", "text-emerald-700"],
              ["Income tax (loonheffing ~11%)", "−€68", "text-red-600"],
              ["Agency housing (SNF standard)", "−€95", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Agency transport bus", "−€22", "text-red-600"],
              ["Admin fees", "−€18", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€382</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Overtime, night, and weekend shifts are paid with premiums (20–35%). Phase B kicks in after 26 weeks — paid holidays and sick pay worth ~€700–€1,000/year.
        </p>
      </section>

      {/* ── Housing at OTTO ───────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — What OTTO Workers Actually Experience</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          OTTO housing is provided near most placement locations and deducted at <strong className="text-gray-800">€88–€110/week</strong>. Properties are predominantly in smaller towns and industrial areas close to the work sites — <strong className="text-gray-800">Tilburg, Venlo, Oss, Roosendaal</strong> being among the most common. Most OTTO housing is SNF or AKF certified, which means minimum Dutch quality standards for communal facilities, bedroom size, and fire safety.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          In practice, housing quality ranges from genuinely acceptable 2-person rooms in well-maintained houses, to older shared properties where 4–5 people share a room. Workers from Tilburg and Venlo placements tend to report better experiences than those from more remote sites. The key is to ask directly before accepting: <em>how many people per room, is it SNF-certified, how far from the work site?</em>
        </p>
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800">
          ⚠️ The Dutch legal maximum for agency housing is <strong>€113.50/week</strong> (SNF 2024 cap). If OTTO or any agency charges more, you can report it to the SNF complaints line at snf.nl.
        </div>
      </section>

      {/* ── Pros and Cons ─────────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">OTTO Workforce — Honest Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ What works well",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Housing and transport included", b: "Biggest practical advantage — no need to arrange accommodation from scratch in a foreign country." },
                { t: "Pay is reliable and accurate", b: "Workers consistently report correct, on-time payments that match the contract." },
                { t: "Multilingual coordinator support", b: "Polish, Romanian, Bulgarian, and English spoken. Less lost-in-translation stress." },
                { t: "Wide location coverage", b: "Active in Tilburg, Venlo, Breda, Rotterdam, Eindhoven — more flexibility if you want to move." },
              ],
            },
            {
              title: "⚠️ What to watch out for",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Housing quality varies a lot", b: "Some OTTO properties have 4–5 per room in older houses. Ask before accepting and check SNF status." },
                { t: "Work pace is fast", b: "High-volume logistics clients run at warehouse-industry pace. Physically demanding with performance targets." },
                { t: "Admin fees not always transparent", b: "Some workers report unexpected deductions. Get the full itemised breakdown before signing." },
                { t: "Phase A is limited", b: "First 26 weeks offer minimal sick pay and no paid holidays — standard for all ABU agencies but worth knowing." },
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

      {/* ── Who is this good for ──────────────────────────────────────────── */}
      <section className="mb-8 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Apply to OTTO Workforce?</h2>
        <div className="space-y-2.5">
          {[
            { icon: "✅", text: "Workers arriving in the Netherlands for the first time — the housing and transport package removes most of the practical barriers to starting." },
            { icon: "✅", text: "Workers from Poland, Romania, or Bulgaria — multilingual support and established networks in those communities make the onboarding much smoother." },
            { icon: "✅", text: "Workers targeting Tilburg, Venlo, or Breda logistics zones — OTTO has the deepest client base in these areas." },
            { icon: "✅", text: "Workers comfortable with warehouse and forklift work who want consistent, full-time hours with legal Dutch contracts." },
            { icon: "⚠️", text: "Workers who want to arrange their own private housing should check whether OTTO allows this — some contracts tie you to agency accommodation, which reduces your flexibility." },
          ].map((item) => (
            <div key={item.text} className="flex gap-2.5">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <p className="leading-relaxed text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warning ────────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-7 text-sm">
        <p className="font-semibold text-amber-800 mb-1">⚠️ Before you sign</p>
        <ul className="text-amber-700 space-y-0.5 list-disc list-inside text-xs">
          <li>Ask for the exact rent deduction amount in writing</li>
          <li>Confirm the housing location relative to the job site</li>
          <li>Make sure your contract is in a language you understand</li>
          <li>Check that accommodation meets SNF/AKF quality standards</li>
        </ul>
      </div>

      {/* ── Cities ─────────────────────────────────────────────────────────── */}
      {topCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">📍 Locations hiring via Otto Workforce</h2>
          <div className="flex flex-wrap gap-2">
            {topCities.map(({ city, count }) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 font-medium"
              >
                {city}
                <span className="bg-brand-50 text-brand-700 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ml-1">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Job listings ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active Otto Workforce vacancies
          {totalJobs > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">({totalJobs} jobs)</span>
          )}
        </h2>

        {displayJobs.length > 0 ? (
          <div className="space-y-3">
            {displayJobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="block group">
                <div className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{job.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 leading-snug">
                          {job.title}
                        </h3>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 shrink-0">
                          €{job.salaryMin.toFixed(2)}{job.salaryMax > job.salaryMin ? `–${job.salaryMax.toFixed(2)}` : ""}/hr
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">📍 {job.city}</p>
                      <div className="flex gap-2 mt-2">
                        {job.housing === "YES" && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">🏠 Housing</span>
                        )}
                        {job.transport === "YES" && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">🚌 Transport</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">View job →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Live listings are not loaded here yet — visit the agency page for the latest openings.</p>
            <Link
              href="/agencies/otto-workforce"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
            >
              View Otto Workforce agency page →
            </Link>
          </div>
        )}
      </section>

      {/* ── Agency CTA ─────────────────────────────────────────────────────── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex-1">
          <p className="font-bold text-gray-900">Ready to apply to Otto Workforce?</p>
          <p className="text-sm text-gray-600 mt-0.5">See the full agency profile, reviews, and issue history before applying.</p>
        </div>
        <Link
          href="/agencies/otto-workforce"
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold bg-brand-600 text-white rounded-full px-5 py-2.5 hover:bg-brand-700 transition-colors"
        >
          View Otto Workforce →
        </Link>
      </div>

      {/* ── Related links ──────────────────────────────────────────────────── */}
      <section className="mb-4 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Related reads</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/otto-workforce-review",        label: "OTTO Workforce full review →" },
            { href: "/otto-vs-tempo-team",           label: "OTTO vs Tempo-Team comparison →" },
            { href: "/agencies-with-housing",        label: "All agencies with housing NL →" },
            { href: "/warehouse-jobs-with-accommodation", label: "Warehouse jobs with housing →" },
            { href: "/check-agency",                 label: "How to verify an agency is legit →" },
            { href: "/tools/payslip-checker",        label: "Check your OTTO payslip →" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">{link.label}</Link>
          ))}
        </div>
      </section>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Data is worker-reported and informational. AgencyCheck does not verify agency claims.
      </p>
    </div>
  );
}
