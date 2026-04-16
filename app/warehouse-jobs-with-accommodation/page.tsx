import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_SALARY_DATA, CITIES } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Warehouse Jobs in the Netherlands with Accommodation — AgencyCheck",
  description:
    "Warehouse jobs in the Netherlands with housing included. Agencies provide accommodation in Tilburg, Venlo, and Breda. No experience required. €11.50–€15.00/hr.",
  alternates: { canonical: "https://agencycheck.io/warehouse-jobs-with-accommodation" },
  openGraph: {
    title: "Warehouse Jobs Netherlands with Accommodation — AgencyCheck",
    description:
      "Find warehouse work with housing included. Compare agencies, deductions, and cities. Real worker data.",
  },
};

const job = JOB_SALARY_DATA["warehouse-worker"]!;
const netMonthly = Math.round(job.avg * 173 * 0.63 - 140);
const housingDeductMonth = Math.round(95 * 4.33); // €95/wk typical
const netAfterHousing = netMonthly - housingDeductMonth;

const listings = JOB_LISTINGS.filter(
  (j) => j.jobType === "warehouse-worker" && j.housing === "YES" && j.isActive
);

const agencies = ALL_AGENCIES.filter((a) => {
  if (a.housing !== "YES") return false;
  if (a.jobFocus.some((jf) => jf === "warehouse-worker" || jf.startsWith("warehouse"))) return true;
  return a.jobTypes?.toLowerCase().includes("warehouse") ?? false;
}).sort((a, b) => b.transparencyScore - a.transparencyScore);

const cities = [...new Set(listings.map((l) => l.city))]
  .map((name) => {
    const c = CITIES.find((x) => x.name === name);
    const count = listings.filter((l) => l.city === name).length;
    return c ? { name, slug: c.slug, count } : null;
  })
  .filter(Boolean) as { name: string; slug: string; count: number }[];

export default function WarehouseJobsAccommodationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs/warehouse-worker" className="hover:text-brand-600">Warehouse Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">With Accommodation</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏭</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            🏠 Housing incl. (deducted from salary)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Warehouse Jobs in the Netherlands with Accommodation
        </h1>

        <div className="text-gray-600 text-sm leading-relaxed max-w-2xl space-y-3">
          <p>
            For workers arriving from abroad — or relocating within the Netherlands — warehouse
            jobs with accommodation bundled in are the most practical starting point. Agencies
            operating in logistics hubs like Tilburg, Venlo, Roosendaal, Breda, and Waalwijk
            routinely place hundreds of workers into shared houses close to distribution centres,
            handling everything from airport pickup to work permit administration in one package.
            No Dutch language skills or prior warehouse experience are required for most order
            picker and general warehouse positions.
          </p>
          <p>
            The accommodation arrangement works by deducting a fixed weekly amount from your
            gross pay — typically €88–€110/week. Under Dutch law this deduction is capped at
            €113.50/week, and your net pay after the deduction must still meet the legal minimum
            wage. Housing is usually in shared rooms (2–4 people per room) in SNF-certified
            accommodation — SNF is a Dutch quality mark that sets minimum standards for space,
            hygiene, kitchen access, and privacy. Agency housing with SNF certification is
            meaningfully better than non-certified options; it is worth asking specifically before
            signing.
          </p>
          <p>
            Transport to and from the warehouse is often included, particularly for early-morning
            shifts that start before public transport begins. This makes it genuinely possible to
            land a full-time warehouse job, a place to sleep, and daily transport without needing
            a Dutch bank account, a car, or local contacts. The trade-off is that your take-home
            pay is lower — roughly €{`${netAfterHousing}`}/month after housing on an average
            wage — and your accommodation depends on your employment contract continuing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">💶 Avg €{job.avg}/hr gross</span>
          <span>≈€{netAfterHousing}/mo net after housing</span>
          {listings.length > 0 && (
            <span className="text-green-700">🏠 <strong>{listings.length}</strong> listings with housing</span>
          )}
        </div>
      </div>

      {/* Salary + housing cost card */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          💶 Salary &amp; Housing Cost Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Min</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.min}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Average</p>
            <p className="text-2xl font-extrabold text-brand-700">€{job.avg}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Max</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.max}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-3 gap-3 text-center text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">€{netMonthly}/mo</p>
            <p>Est. net (40h/wk)</p>
          </div>
          <div>
            <p className="font-semibold text-amber-700">−€{housingDeductMonth}/mo</p>
            <p>Typical housing (€95/wk)</p>
          </div>
          <div>
            <p className="font-semibold text-green-700">≈€{netAfterHousing}/mo</p>
            <p>Left after housing</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">
          Gross figures. Dutch income tax and ZVW levy reduce gross by ~37%.
          Housing deduction varies by agency — get the amount in writing.
        </p>
      </div>

      {/* Active listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Active Warehouse Listings with Housing"
            subtitle={`${listings.length} current vacancies with accommodation included`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {listings.slice(0, 8).map((l) => (
              <Link
                key={l.slug}
                href={`/jobs/${l.slug}`}
                className="card p-3.5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
              >
                <span className="text-2xl shrink-0">{l.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">{l.title}</p>
                    <span className="text-xs font-bold text-brand-700 shrink-0">
                      €{l.salaryMin.toFixed(2)}–€{l.salaryMax.toFixed(2)}/hr
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 mt-0.5">{l.agencyName}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400">📍 {l.city}</span>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                      🏠 Housing incl.
                    </span>
                    {l.transport === "YES" && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5">
                        🚌 Transport incl.
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Agencies */}
      {agencies.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Agencies with Warehouse Jobs + Housing"
            subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} verified to provide accommodation`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {agencies.slice(0, 6).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {agencies.length > 6 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              <Link href="/agencies-with-housing" className="text-brand-600 hover:underline">
                All agencies with housing →
              </Link>
            </p>
          )}
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 Cities with Warehouse Jobs + Housing
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How agency housing works */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">🏠 How agency accommodation works in practice</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Agencies that provide accommodation typically offer a complete relocation package. Here is what the
          first week usually looks like and what to expect ongoing:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs mb-4">
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">Week 1: Arrival</p>
            <p className="text-gray-500">Many agencies offer airport or train station pickup. You will sign your employment contract, receive your work schedule, and be shown to shared accommodation — often a house with 4–12 workers from various countries.</p>
          </div>
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">Ongoing: Daily routine</p>
            <p className="text-gray-500">A bus or van collects workers from the house before each shift and returns them after. You pay for electricity and Wi-Fi via the housing deduction. Cleaning rotas for shared spaces are agency-managed.</p>
          </div>
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">If your contract ends</p>
            <p className="text-gray-500">Accommodation is typically tied to the work contract. You usually have 1–2 weeks notice before leaving the house. Plan ahead — losing a job means losing your address unless you have private backup accommodation.</p>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="text-xs font-bold text-gray-800 mb-3">Typical weekly payslip at €{job.avg}/hr, 40 hours</h3>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-50">
              <tr className="bg-gray-50/50">
                <td className="py-1.5 text-gray-600">Gross weekly pay (40h × €{job.avg})</td>
                <td className="py-1.5 text-right font-medium text-gray-800">≈ €{Math.round(job.avg * 40)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-gray-600">Income tax + ZVW levy (~37%)</td>
                <td className="py-1.5 text-right text-red-600">− €{Math.round(job.avg * 40 * 0.37)}</td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="py-1.5 text-gray-600">Net pay before housing</td>
                <td className="py-1.5 text-right font-medium text-gray-800">≈ €{Math.round(job.avg * 40 * 0.63)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-gray-600">Housing deduction (typical)</td>
                <td className="py-1.5 text-right text-amber-700">− €95</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-1.5 font-bold text-gray-800">Take-home after housing</td>
                <td className="py-1.5 text-right font-bold text-green-700">≈ €{Math.round(job.avg * 40 * 0.63 - 95)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros and cons */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">⚖️ Pros and cons of warehouse jobs with accommodation</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">✅ Pros</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>→ Zero upfront costs — no deposit, furniture, or rental agency fee</li>
              <li>→ Transport to warehouse included for most early shifts</li>
              <li>→ Work and housing sorted in one phone call or application</li>
              <li>→ Live close to the warehouse — very short commute, no car needed</li>
            </ul>
          </div>
          <div className="card p-4">
            <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">❌ Cons</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>→ Take-home pay is lower — €95+/week less than a worker in private renting</li>
              <li>→ Shared rooms with strangers; limited privacy</li>
              <li>→ Accommodation ends when the job ends — no separation between the two</li>
              <li>→ Non-SNF housing can be overcrowded or poorly maintained — always verify</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who is this good for */}
      <section className="mb-8">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <h2 className="font-bold text-brand-900 text-sm mb-2">👤 Who is this arrangement good for?</h2>
          <ul className="text-xs text-brand-800 space-y-1.5 leading-relaxed">
            <li>→ <strong>Workers arriving from outside the Netherlands</strong> — the bundled package eliminates the need for a Dutch address, bank account, or local guarantor before you start.</li>
            <li>→ <strong>People starting out in the Netherlands</strong> — agency housing gives you time to save a deposit while you look for a private rental on better terms.</li>
            <li>→ <strong>Workers targeting high-throughput DC locations</strong> — Tilburg, Venlo, and Roosendaal have the most agency housing options and the most consistent demand for warehouse staff.</li>
            <li>→ <strong>Workers who want transport included</strong> — if you don't drive or can't afford a car, an included bus to the 06:00 shift is a genuine advantage.</li>
            <li>→ <strong>Short-term or seasonal workers</strong> — the flexibility cuts both ways; if you only plan to stay 3–6 months, agency housing avoids signing a 12-month lease.</li>
          </ul>
        </div>
      </section>

      {/* Housing warning */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Check the housing terms before you accept
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Housing deduction must appear on your payslip. Typical: <strong>€80–€110/week</strong>.</li>
            <li>→ Ask if accommodation is SNF-certified (safety and hygiene standard for migrant workers).</li>
            <li>→ Minimum wage still applies after deduction: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Get the weekly cost and cancellation terms in writing before you travel.</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { href: "/order-picker-jobs", icon: "📦", label: "Order picker jobs", sub: "Most common warehouse role with housing" },
            { href: "/reach-truck-jobs", icon: "🏗️", label: "Reach truck jobs", sub: "Higher pay; licence required" },
            { href: "/agencies-with-housing", icon: "🏘️", label: "All agencies with housing", sub: "Full comparison of housing agencies" },
            { href: "/salary/warehouse-worker-netherlands", icon: "💶", label: "Warehouse salary breakdown", sub: "Gross-to-net + housing deduction" },
            { href: "/otto-workforce-jobs", icon: "🏢", label: "OTTO Workforce jobs", sub: "Large agency with housing packages" },
            { href: "/cities/tilburg", icon: "📍", label: "Jobs in Tilburg", sub: "Top city for warehouse + housing" },
          ].map(({ href, icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="card px-3 py-2.5 flex items-center gap-3 hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-lg shrink-0">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-brand-700">{label} →</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
