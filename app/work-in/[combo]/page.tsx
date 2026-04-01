import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  allWorkInCombos,
  parseWorkInCombo,
  WORK_IN_JOB_TYPES,
  WORK_IN_CITIES,
  WORK_IN_AUDIENCES,
  YOUTH_WML_2026,
} from "@/lib/workInSeoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { getTopAgenciesForCity, getCityHousingAgenciesEnriched } from "@/lib/agencyEnriched";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

// ─── Static params — all 50 combos ────────────────────────────────────────────
export function generateStaticParams() {
  return allWorkInCombos().map(({ combo }) => ({ combo }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { combo: string };
}): Promise<Metadata> {
  const parsed = parseWorkInCombo(params.combo);
  if (!parsed) return { title: "Page not found" };

  const job      = WORK_IN_JOB_TYPES[parsed.jobSlug];
  const city     = WORK_IN_CITIES[parsed.citySlug];
  const audience = WORK_IN_AUDIENCES[parsed.audience];

  return {
    title: `${job.title} Jobs ${city.name} ${audience.labelIn} – Salary, Housing & Agencies Netherlands 2026`,
    description: `Find ${job.titleShort.toLowerCase()} jobs in ${city.name} ${audience.labelIn.toLowerCase()}. Salary €${job.salaryMin.toFixed(2)}–€${job.salaryMax.toFixed(2)}/hr. Compare top agencies with housing options. Updated 2026.`,
    alternates: { canonical: `/work-in/${params.combo}` },
    openGraph: {
      title: `${job.title} Jobs ${city.name} ${audience.labelIn} – AgencyCheck`,
      description: `${job.titleShort} jobs in ${city.name} for ${audience.label.toLowerCase()}. Real salary data, top agencies, housing info. Netherlands 2026.`,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SalaryTag({ label, value, highlight = false }: {
  label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? "bg-brand-50 border border-brand-100" : "bg-gray-50 border border-gray-100"}`}>
      <p className={`text-lg font-extrabold tabular-nums ${highlight ? "text-brand-700" : "text-gray-800"}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <div>
        <span className="font-medium text-gray-700">{label}: </span>
        <span className="text-gray-600">{value}</span>
      </div>
    </div>
  );
}

function Tick({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-600">
      <span className="text-green-500 shrink-0 mt-0.5">✓</span>
      {text}
    </li>
  );
}

function Warn({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-600">
      <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
      {text}
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkInComboPage({ params }: { params: { combo: string } }) {
  const parsed = parseWorkInCombo(params.combo);
  if (!parsed) notFound();

  const job      = WORK_IN_JOB_TYPES[parsed.jobSlug];
  const city     = WORK_IN_CITIES[parsed.citySlug];
  const audience = WORK_IN_AUDIENCES[parsed.audience];

  // ── Agency data ─────────────────────────────────────────────────────────────
  const allCityAgencies     = getTopAgenciesForCity(city.name, 12);
  const housingAgencies     = getCityHousingAgenciesEnriched(city.name);
  const topAgencies         = allCityAgencies.slice(0, 6);
  const housingAgencyCount  = housingAgencies.length;

  // ── Salary calculations ──────────────────────────────────────────────────────
  const weeklyGross40  = +(job.salaryAvg * 40).toFixed(0);
  const weeklyNet40    = Math.round(weeklyGross40 * 0.77);  // rough ~23% loonheffing at WML
  const weeklyReal40   = weeklyNet40 - 95;                  // typical: housing €85 + insurance €10/week est
  const monthlyGross   = Math.round(weeklyGross40 * 4.33);
  const monthlyReal    = Math.round(weeklyReal40 * 4.33);

  // ── FAQ + schemas ────────────────────────────────────────────────────────────
  const baseFaqs = [
    {
      question: `What is the salary for a ${job.titleShort.toLowerCase()} job in ${city.name} in 2026?`,
      answer:   `${job.title} jobs in ${city.name} typically pay €${job.salaryMin.toFixed(2)}–€${job.salaryMax.toFixed(2)} per hour gross. The average is around €${job.salaryAvg.toFixed(2)}/hr. At 40 hours per week, this equals approximately €${weeklyGross40}/week gross or €${monthlyGross}/month gross before tax. The Dutch minimum wage (WML 2026) is €${WML_HOURLY_2026}/hr — no agency can legally pay below this.`,
    },
    {
      question: `Are there ${job.titleShort.toLowerCase()} jobs with housing in ${city.name}?`,
      answer:   housingAgencyCount > 0
        ? `Yes — ${housingAgencyCount} agencies in ${city.name} on AgencyCheck offer housing alongside ${job.titleShort.toLowerCase()} jobs. Housing is deducted directly from your salary, typically €80–€115/week. Agencies with SNF or ABF certification must meet minimum standards. Always ask for the exact deduction amount and housing address before signing.`
        : `Some agencies near ${city.name} offer accommodation packages alongside ${job.titleShort.toLowerCase()} contracts. Check individual agency profiles on AgencyCheck for housing availability. The standard housing deduction in the Netherlands is €80–€115/week.`,
    },
    ...audience.faqItems.map((item) => ({
      question: item.q,
      answer:   item.a,
    })),
    {
      question: `How do I find ${job.titleShort.toLowerCase()} agencies in ${city.name} as a ${audience.label.toLowerCase().replace("for ", "").replace(" workers", "")}?`,
      answer:   `Use AgencyCheck to filter agencies by city and job type. Compare transparency scores, housing options, and worker reviews before applying. ${audience.slug === "foreigners" ? "Look for agencies with an ABU or NBBU keurmerk — these are certified and must follow the CAO that protects all workers including foreign nationals." : "Many agencies actively recruit students for evening and weekend shifts. Filter by 'housing' if you need accommodation."}`,
    },
  ];

  const crumbSchema = breadcrumbSchema([
    { name: "Home",      url: "/" },
    { name: "Work In",   url: "/work-in" },
    { name: `${job.titleShort} Jobs ${city.name} ${audience.label}`, url: `/work-in/${params.combo}` },
  ]);
  const faqSchema   = faqPageSchema(baseFaqs);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)   }} />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in NL</Link>
        <span>›</span>
        <Link href={`/cities/${city.slug}`} className="hover:text-brand-600">{city.name}</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">
          {job.titleShort} Jobs {audience.label}
        </span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands 2026
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            📍 {city.name}
          </span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            {job.icon} {job.titleShort} Jobs
          </span>
          {housingAgencyCount > 0 && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-1 font-medium">
              🏠 {housingAgencyCount} agencies with housing
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          {job.title} Jobs in {city.name} {audience.labelIn}
          <span className="block text-base font-normal text-gray-500 mt-1">
            Salary, Housing & Top Agencies — Netherlands 2026
          </span>
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {audience.intro}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {city.industryNote} This page covers everything you need to know about finding a {job.titleShort.toLowerCase()} job in {city.name} as a {audience.label.toLowerCase().endsWith("s") ? audience.label.toLowerCase().slice(0, -1) : audience.label.toLowerCase()}: realistic salary expectations, housing options, the best agencies hiring now, and rights specific to your situation.
        </p>
      </div>

      {/* ── Salary card ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {job.titleShort} Salary in {city.name} 2026
        </h2>
        <div className="card p-5 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <SalaryTag label="Min hourly (WML)"     value={`€${job.salaryMin.toFixed(2)}/hr`} />
            <SalaryTag label="Max hourly"            value={`€${job.salaryMax.toFixed(2)}/hr`} />
            <SalaryTag label="Avg weekly gross (40h)" value={`€${weeklyGross40}`} highlight />
            <SalaryTag label="Avg monthly gross"      value={`€${monthlyGross}`} highlight />
          </div>
          <div className="space-y-2.5 border-t border-gray-100 pt-4">
            <InfoRow icon="📋" label="Role"          value={job.description} />
            <InfoRow icon="🕐" label="Shift pattern" value={job.shiftNote} />
            <InfoRow icon="🎓" label="Useful skills" value={job.skills.join(", ")} />
            <InfoRow icon="⚖️" label="WML 2026"       value={`€${WML_HOURLY_2026}/hr gross minimum — applies to all workers in the Netherlands`} />
          </div>
        </div>

        {/* Real income after deductions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-bold text-amber-800 mb-2">💶 Your real weekly income is lower than the gross figure</p>
          <p className="text-xs text-amber-700 leading-relaxed mb-3">
            Dutch income tax (loonheffing), health insurance (~€35/week), and housing deductions can reduce
            your gross pay by 35–50%. At {job.salaryAvg.toFixed(2)}/hr, 40 hours/week, after tax and typical
            deductions you realistically take home approximately{" "}
            <strong>€{weeklyReal40}/week (€{monthlyReal}/month)</strong>.
          </p>
          <Link href="/tools/salary-calculator"
            className="text-xs font-semibold text-amber-800 underline hover:text-amber-900">
            → Use the free salary calculator to see your exact take-home
          </Link>
        </div>
      </section>

      {/* ── Top agencies ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Top Agencies Hiring {job.titleShort} Workers in {city.name}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {allCityAgencies.length > 0
            ? `${allCityAgencies.length} verified agencies operate in ${city.name}. Sorted by transparency score.`
            : `Agencies from the greater ${city.region} region below.`}
        </p>

        {topAgencies.length > 0 ? (
          <div className="space-y-3">
            {topAgencies.map((agency) => (
              <Link
                key={agency.slug}
                href={`/agencies/${agency.slug}`}
                className="card p-4 flex items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group block"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors text-sm">
                    {agency.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">📍 {agency.city}</span>
                    {agency.housing === "YES" && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">🏠 Housing</span>
                    )}
                    {agency.transport === "YES" && (
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5">🚌 Transport</span>
                    )}
                    <span className="text-xs text-gray-400">Score {agency.transparencyScore}/100</span>
                  </div>
                </div>
                <span className="text-xs text-brand-600 font-semibold shrink-0 group-hover:underline">
                  View →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-5 text-center text-sm text-gray-500">
            <p className="mb-2">No agencies found specifically in {city.name} yet.</p>
            <Link href="/agencies" className="text-brand-600 font-semibold hover:underline">
              Browse all {WORK_IN_JOB_TYPES.warehouse.title} agencies →
            </Link>
          </div>
        )}

        {allCityAgencies.length > 6 && (
          <div className="mt-3 text-center">
            <Link href={`/cities/${city.slug}`}
              className="text-sm text-brand-600 font-semibold hover:underline">
              See all {allCityAgencies.length} agencies in {city.name} →
            </Link>
          </div>
        )}
      </section>

      {/* ── City facts ─────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Working in {city.name} — What to Know
        </h2>
        <div className="card p-5 space-y-3">
          <InfoRow icon="🌍" label="Region"            value={`${city.region}, Netherlands`} />
          <InfoRow icon="👥" label="Population"         value={city.population} />
          <InfoRow icon="🏠" label="Typical rent"       value={city.avgRent} />
          <InfoRow icon="🏭" label="Key employers"      value={city.keyEmployers.join(", ")} />
          <InfoRow icon="📦" label="Industrial zones"   value={city.nearbyHubs.join(", ")} />
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {city.housingNote}
        </p>
      </section>

      {/* ── Audience-specific section ──────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {audience.slug === "foreigners"
            ? `What Foreign Workers Need to Know Before Starting a ${job.titleShort} Job in ${city.name}`
            : `Student Jobs in ${city.name}: ${job.titleShort} Roles, Pay & Schedules`}
        </h2>

        {/* Requirements */}
        <div className="space-y-4 mb-6">
          {audience.requirements.map((req) => (
            <div key={req.title} className="border-l-2 border-brand-200 pl-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">{req.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{req.body}</p>
            </div>
          ))}
        </div>

        {/* Youth WML table — students only */}
        {audience.slug === "students" && (
          <div className="card p-4 mb-6 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Dutch Youth Minimum Wage 2026 (per hour, gross)
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 pr-4">Age</th>
                  <th className="pb-2 pr-4">% of adult WML</th>
                  <th className="pb-2">Min. hourly rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {YOUTH_WML_2026.map(({ age, pct, rate }) => (
                  <tr key={age} className={age >= 21 ? "bg-brand-50 font-semibold" : ""}>
                    <td className="py-1.5 pr-4">{age}{age >= 21 ? "+" : ""}</td>
                    <td className="py-1.5 pr-4">{pct}%</td>
                    <td className="py-1.5 text-brand-700">€{rate.toFixed(2)}/hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Advantages */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            {audience.slug === "foreigners" ? "Your rights as a foreign worker" : "Advantages of student jobs in the Netherlands"}
          </p>
          <ul className="space-y-1.5">
            {audience.advantages.map((adv) => <Tick key={adv} text={adv} />)}
          </ul>
        </div>

        {/* Warnings */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-800 mb-2">
            ⚠️ Common issues to watch out for
          </p>
          <ul className="space-y-1.5">
            {audience.warnings.map((w) => <Warn key={w} text={w} />)}
          </ul>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Frequently Asked Questions — {job.titleShort} Jobs {city.name} {audience.label}
        </h2>
        <div className="space-y-4">
          {baseFaqs.map((faq, i) => (
            <div key={i} className="border-l-2 border-gray-100 pl-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">{faq.question}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related pages ──────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Related pages
        </h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {[
            { href: `/jobs/${job.jobSlugRef}`,         label: `${job.title} jobs Netherlands` },
            { href: `/cities/${city.slug}`,             label: `All agencies in ${city.name}` },
            { href: `/salary/${job.jobSlugRef}-netherlands`, label: `${job.title} salary Netherlands` },
            { href: `/agencies-with-housing`,            label: "Agencies with housing" },
            audience.slug === "foreigners"
              ? { href: `/work-in-netherlands-for-foreigners`, label: "Complete guide for foreign workers" }
              : { href: `/guides/working-netherlands-salary-after-rent`, label: "Salary after rent guide" },
            { href: `/tools/salary-calculator`,          label: "Calculate your real take-home pay" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 hover:underline"
            >
              <span className="text-gray-300">→</span> {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Other combos for this city (cross-links) ───────────────────────── */}
      <section className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Other job types in {city.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(WORK_IN_JOB_TYPES)
            .filter((j) => j.slug !== job.slug)
            .map((j) => (
              <Link
                key={j.slug}
                href={`/work-in/${j.slug}-jobs-${city.slug}-${audience.slug}`}
                className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {j.icon} {j.titleShort} Jobs
              </Link>
            ))}
          {/* Switch audience */}
          {Object.values(WORK_IN_AUDIENCES)
            .filter((a) => a.slug !== audience.slug)
            .map((a) => (
              <Link
                key={a.slug}
                href={`/work-in/${job.slug}-jobs-${city.slug}-${a.slug}`}
                className="text-xs border border-brand-100 bg-brand-50 rounded-full px-3 py-1 text-brand-700 hover:bg-brand-100 transition-colors"
              >
                👤 {job.titleShort} Jobs {a.label}
              </Link>
            ))}
        </div>
      </section>

      {/* ── Legal note ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 text-center">
        Salary figures are estimates based on 2026 Dutch WML and sector averages.
        Individual pay depends on your employer, experience, and CAO applicable to your contract.
        For legal issues, contact the{" "}
        <a href="https://www.nlarbeidsinspectie.nl/english" target="_blank" rel="noopener noreferrer"
          className="underline hover:text-gray-700">Dutch Labour Inspectorate (NLA)</a>.
      </div>
    </div>
  );
}
