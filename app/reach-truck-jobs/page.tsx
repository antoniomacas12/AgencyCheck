import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_SALARY_DATA, CITIES, CITIES_BY_POPULATION } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Reach Truck Driver Jobs in the Netherlands — AgencyCheck",
  description:
    "Reach truck driver jobs in the Netherlands. Licence required. Average €15.25/hr gross. Compare agencies, housing options, and cities. Updated worker data.",
  alternates: { canonical: "/reach-truck-jobs" },
  openGraph: {
    title: "Reach Truck Jobs Netherlands — AgencyCheck",
    description:
      "Find reach truck driver work through verified agencies. Salary €13.50–€17.00/hr. Licence required.",
  },
};

const job = JOB_SALARY_DATA["reach-truck-driver"]!;
const netMonthly = Math.round(job.avg * 173 * 0.63 - 140);

const listings = JOB_LISTINGS.filter(
  (j) => j.jobType === "reach-truck-driver" && j.isActive
);
const withHousing = listings.filter((l) => l.housing === "YES");
const withTransport = listings.filter((l) => l.transport === "YES");

const agencies = ALL_AGENCIES.filter((a) => {
  if (a.jobFocus.some((jf) => jf === "reach-truck-driver" || jf.startsWith("reach"))) return true;
  return a.jobTypes?.toLowerCase().includes("reach truck") ?? false;
}).sort((a, b) => b.transparencyScore - a.transparencyScore);

const cities = [...new Set(listings.map((l) => l.city))]
  .map((name) => {
    const c = CITIES.find((x) => x.name === name);
    const count = listings.filter((l) => l.city === name).length;
    return c ? { name, slug: c.slug, count } : null;
  })
  .filter(Boolean) as { name: string; slug: string; count: number }[];

const topCities = CITIES_BY_POPULATION
  .filter((c) => c.population >= 50000)
  .slice(0, 15);

export default function ReachTruckJobsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Reach Truck Driver</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏗️</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-full px-2 py-0.5">
            🪪 Licence required
          </span>
          {withHousing.length > 0 && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              🏠 Housing available
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Reach Truck Driver Jobs in the Netherlands
        </h1>

        <div className="text-gray-600 text-sm leading-relaxed max-w-2xl space-y-3">
          <p>
            Reach truck drivers operate electric reach trucks in high-bay warehouses — navigating
            narrow aisles and lifting pallets to racking heights of 10 to 14 metres. The work is
            technically demanding: you read warehouse management system (WMS) instructions on a
            mounted screen, locate the correct bay, and place pallets with millimetre precision at
            height. Errors cost time and can cause costly stock damage, which is why the role pays
            a meaningful premium over standard order picking.
          </p>
          <p>
            The Netherlands has one of Europe&apos;s densest concentrations of high-bay distribution
            centres, particularly around Tilburg, Waalwijk, Venlo, and the logistics corridor
            between Rotterdam port and the German border. Major retailers, e-commerce platforms,
            and food manufacturers all rely on reach truck operators to stock and retrieve pallets
            around the clock. Many sites run 24/7 on rotating shifts, which means night and
            weekend premiums of 20–35% on top of base pay are common.
          </p>
          <p>
            A valid reach truck (VNA or narrow-aisle) licence is required — a counterbalance
            forklift licence does not automatically qualify you. If you don&apos;t yet hold one,
            several agencies offer paid in-house training before your first placement, typically
            lasting one to three days. Passing a brief practical test at the warehouse is standard
            even if you already hold a licence from another country.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">💶 Avg €{job.avg}/hr gross</span>
          <span>≈€{netMonthly}/mo net</span>
          {listings.length > 0 && (
            <span>💼 <strong>{listings.length}</strong> active listings</span>
          )}
          {withHousing.length > 0 && (
            <span className="text-green-700">🏠 <strong>{withHousing.length}</strong> with housing</span>
          )}
          {withTransport.length > 0 && (
            <span className="text-blue-700">🚌 <strong>{withTransport.length}</strong> with transport</span>
          )}
        </div>
      </div>

      {/* Salary card */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          💶 Reach Truck Driver Salary in the Netherlands
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
            <p className="font-semibold text-gray-700">€{WML_HOURLY_2026}/hr</p>
            <p>WML minimum 2026</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">+20–35%</p>
            <p>Night/weekend premium</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4 justify-center">
          <Link href="/salary/reach-truck-driver-netherlands" className="text-xs text-brand-600 hover:underline">
            Full salary breakdown →
          </Link>
          <Link href="/tools/real-income-calculator" className="text-xs text-gray-500 hover:underline">
            Calculate take-home →
          </Link>
        </div>
      </div>

      {/* Licence note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h2 className="font-bold text-blue-900 text-sm mb-1.5">🪪 Licence requirement</h2>
        <p className="text-xs text-blue-800 leading-relaxed">
          You need a valid reach truck licence to work in this role. Most Dutch warehouses accept
          a VCA or an internal licence issued by a previous employer. Some agencies offer
          in-house licence training — ask before applying if you don&apos;t have one yet.
          Forklift (counterbalance) licences do <em>not</em> automatically cover reach trucks.
        </p>
      </div>

      {/* Day in the life */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">🕐 A day in the life of a reach truck driver</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Most warehouse sites run an early shift (06:00–14:45) and a late shift (14:45–23:30). Here is what
          a typical early shift looks like at a high-bay DC:
        </p>
        <div className="card overflow-hidden mb-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-3 py-2 font-semibold text-gray-700 w-24">Time</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr><td className="px-3 py-2 text-gray-400">05:45</td><td className="px-3 py-2 text-gray-700">Agency bus picks up at accommodation or central meeting point</td></tr>
              <tr className="bg-gray-50/50"><td className="px-3 py-2 text-gray-400">06:00</td><td className="px-3 py-2 text-gray-700">Site briefing — team leader assigns zones; check WMS for inbound pallet list</td></tr>
              <tr><td className="px-3 py-2 text-gray-400">06:15</td><td className="px-3 py-2 text-gray-700">Put-away: storing inbound pallets into high-bay racking (9–14 m); scan, confirm, move on</td></tr>
              <tr className="bg-gray-50/50"><td className="px-3 py-2 text-gray-400">10:00</td><td className="px-3 py-2 text-gray-700">Paid 15-minute break; park truck in bay, charge if needed</td></tr>
              <tr><td className="px-3 py-2 text-gray-400">10:15</td><td className="px-3 py-2 text-gray-700">Replenishment picking — pull stock down to ground-level pick lanes for order pickers</td></tr>
              <tr className="bg-gray-50/50"><td className="px-3 py-2 text-gray-400">12:00</td><td className="px-3 py-2 text-gray-700">30-minute unpaid lunch break</td></tr>
              <tr><td className="px-3 py-2 text-gray-400">12:30</td><td className="px-3 py-2 text-gray-700">Afternoon tasks: cycle counts, relocations, and bulk storage movements</td></tr>
              <tr className="bg-gray-50/50"><td className="px-3 py-2 text-gray-400">14:15</td><td className="px-3 py-2 text-gray-700">End-of-shift handover — park truck on charge, note any damage or discrepancies</td></tr>
              <tr><td className="px-3 py-2 text-gray-400">14:45</td><td className="px-3 py-2 text-gray-700">Shift ends; bus departs for accommodation or city centre</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">Exact schedule varies by warehouse and contract. Night shifts typically attract a 25–35% premium.</p>
      </section>

      {/* Housing */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">🏠 Accommodation for reach truck workers</h2>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          Agency housing is widely available for reach truck placements, particularly at sites in Tilburg,
          Waalwijk, Venlo, and Eindhoven. Because shifts often start at 06:00 or earlier, most workers
          opt for housing close to the warehouse — private rentals in these cities typically run
          €400–€600/month for a room, and agency housing is usually €88–€110/week (legally capped at
          €113.50/week under Dutch law).
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">Agency housing</p>
            <p className="text-gray-500">€88–€113/week deducted from gross pay. Look for SNF-certified addresses — this certification sets minimum standards for space, hygiene, and occupancy.</p>
          </div>
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">Private rental</p>
            <p className="text-gray-500">Waalwijk, Tilburg, Venlo, and Helmond offer rooms from €400–€600/month — more affordable than Amsterdam or Rotterdam for the same wage level.</p>
          </div>
          <div className="card p-3">
            <p className="font-semibold text-gray-800 mb-1">What to check</p>
            <p className="text-gray-500">Always get housing deduction costs in writing before signing. Confirm if rent stops if your contract pauses. SNF inspections are published online.</p>
          </div>
        </div>
      </section>

      {/* Pros and cons */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">⚖️ Pros and cons of reach truck work</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">✅ Pros</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>→ €1.00–€2.00/hr premium over standard warehouse picking</li>
              <li>→ Licenced skill that transfers across companies and countries</li>
              <li>→ Seated work — less physically tiring than manual order picking</li>
              <li>→ High demand year-round; rarely without available vacancies</li>
            </ul>
          </div>
          <div className="card p-4">
            <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">❌ Cons</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>→ Licence required — without one you cannot start on day one</li>
              <li>→ Concentration required for full shift; mistakes at height are dangerous</li>
              <li>→ Cold storage sites (−25°C) are common; warm clothing is not always provided</li>
              <li>→ Early starts (05:45 bus) can disrupt sleep if on rotating shifts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who is this good for */}
      <section className="mb-8">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <h2 className="font-bold text-brand-900 text-sm mb-2">👤 Who is reach truck work good for?</h2>
          <ul className="text-xs text-brand-800 space-y-1.5 leading-relaxed">
            <li>→ <strong>Workers who already hold a reach truck or VNA licence</strong> — you can start within days and earn above WML from day one.</li>
            <li>→ <strong>Order pickers looking to progress</strong> — reach truck is the most common next step up; several agencies will fund your licence after 4–6 weeks on site.</li>
            <li>→ <strong>Workers who prefer seated, technical tasks</strong> — the job is focused and repetitive but far less physically demanding than floor-level picking.</li>
            <li>→ <strong>People targeting logistics hubs</strong> — Tilburg, Waalwijk, and Venlo have the highest concentration of openings and the most agency housing options nearby.</li>
            <li>→ <strong>Workers comfortable with shift rotation</strong> — early, late, and night shifts are all available; night premiums can meaningfully boost take-home pay.</li>
          </ul>
        </div>
      </section>

      {/* Active listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Active Reach Truck Listings"
            subtitle={`${listings.length} current vacancies across the Netherlands`}
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
                    {l.housing === "YES" && (
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                        🏠 Housing incl.
                      </span>
                    )}
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
            title="Agencies Hiring Reach Truck Drivers"
            subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} matched to this role`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {agencies.slice(0, 8).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {agencies.length > 8 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing 8 of {agencies.length}.{" "}
              <Link href="/agencies" className="text-brand-600 hover:underline">Browse all →</Link>
            </p>
          )}
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 Reach Truck Jobs by City
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

      {/* Salary by city */}
      <section className="mb-8">
        <SectionHeader
          title="Reach Truck Salary by City"
          subtitle="Rates vary by employer, contract, and shift pattern"
        />
        <div className="grid sm:grid-cols-3 gap-2">
          {topCities.slice(0, 12).map((c) => (
            <Link
              key={c.slug}
              href={`/salary/reach-truck-driver-${c.slug}`}
              className="card px-3 py-2.5 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-xs font-medium text-gray-800">{c.name}</span>
              <span className="text-xs font-bold text-brand-700">€{job.avg}/hr →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before accepting a reach truck job
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Confirm your licence is accepted — show it before signing a contract.</li>
            <li>→ Gross pay must be at or above WML: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Night and Sunday premiums must appear on your payslip, not just be promised.</li>
            <li>→ If housing is included, get the weekly deduction in writing: <strong>€80–€110/week</strong>.</li>
            <li>→ Get the contract in a language you understand before signing.</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { href: "/order-picker-jobs", icon: "📦", label: "Order picker jobs", sub: "Entry-level warehouse work" },
            { href: "/jobs/forklift-driver", icon: "🚜", label: "Forklift driver jobs", sub: "Counterbalance & reach" },
            { href: "/warehouse-jobs-with-accommodation", icon: "🏠", label: "Warehouse jobs with housing", sub: "Agency accommodation included" },
            { href: "/salary/reach-truck-driver-netherlands", icon: "💶", label: "Reach truck salary", sub: "Full gross-to-net breakdown" },
            { href: "/cities/tilburg", icon: "📍", label: "Jobs in Tilburg", sub: "Top logistics city for RT work" },
            { href: "/otto-workforce-jobs", icon: "🏢", label: "OTTO Workforce jobs", sub: "Major agency for warehouse roles" },
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
