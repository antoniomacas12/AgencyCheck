import type { Metadata } from "next";
import Link from "next/link";
import {
  TAX_BRACKETS_2026,
  AHK_2026,
  AK_2026,
  WML_HOURLY_2026,
  VAKANTIEGELD_RATE,
  HEALTHCARE_MONTHLY,
  HOUSING_DEDUCTION_RANGES,
  calculateTakeHome,
  fmtEur,
  fmtPct,
} from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Salary Calculation Methodology — AgencyCheck",
  description:
    "How AgencyCheck calculates take-home pay for agency workers in the Netherlands. Tax brackets, heffingskorting, assumptions, sources, and an annotated example payslip.",
  alternates: { canonical: "https://agencycheck.io/methodology" },
};

const LAST_UPDATED    = "January 2026";
const LAST_VERIFIED   = "January 2026";  // when we last cross-checked with Belastingdienst tables

// ─── Example worker for the annotated payslip ────────────────────────────────

const EXAMPLE = calculateTakeHome({
  hourlyRate:        14.71,   // WML 2026
  hoursPerWeek:      40,
  weeksPerYear:      52,
  includeVakantie:   true,
  housingCost:       450,     // €104/week — SNF typical for Noord-Brabant / Limburg
  transportCost:     0,       // included by agency in this example
  healthcareOwnRisk: 33,
});

function Row({ label, value, sub, bold, indent, neg, highlight }: {
  label: string; value: string; sub?: string;
  bold?: boolean; indent?: boolean; neg?: boolean; highlight?: boolean;
}) {
  return (
    <tr className={`border-t border-gray-100 ${highlight ? "bg-gray-50" : ""}`}>
      <td className={`py-2 pr-4 text-sm ${indent ? "pl-6" : "pl-2"} ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
        {label}
        {sub && <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{sub}</span>}
      </td>
      <td className={`py-2 text-right text-sm font-mono pr-2 ${bold ? "font-bold text-gray-900" : "text-gray-700"} ${neg ? "text-red-600" : ""} ${highlight ? "font-bold" : ""}`}>
        {value}
      </td>
    </tr>
  );
}

export default function MethodologyPage() {
  const toWeekly = (m: number) => Math.round(m * 12 / 52);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Transparency
        </p>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          How we calculate take-home pay
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
          Every number on AgencyCheck is computed — not guessed. This page explains
          exactly what goes into our salary estimates, what we include, what we don&apos;t,
          and where the numbers come from.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
            Last updated: {LAST_UPDATED}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
            Tax tables verified: {LAST_VERIFIED}
          </span>
          <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 font-semibold">
            2026 Dutch tax law
          </span>
        </div>
      </div>

      <div className="space-y-10 text-sm text-gray-700 leading-relaxed">

        {/* ── Sources ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Data sources</h2>
          <div className="space-y-3">
            {[
              {
                name: "Belastingdienst — loonheffing brackets 2026",
                url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/loonheffingen/",
                desc: "Official income tax brackets (Box 1) used for all wage calculations.",
              },
              {
                name: "Belastingdienst — heffingskortingen 2026",
                url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_1_2_en_3/",
                desc: "Algemene heffingskorting and arbeidskorting parameters. These tax credits significantly reduce the tax paid by low-income workers.",
              },
              {
                name: "Ministerie van SZW — Wettelijk minimumloon (WML) 2026",
                url: "https://www.rijksoverheid.nl/onderwerpen/minimumloon/bedragen-minimumloon",
                desc: `Minimum wage per hour: €${WML_HOURLY_2026} for workers aged 21+ working 40 hours/week (January 2026).`,
              },
              {
                name: "Burgerlijk Wetboek art. 7:634 — Vakantiegeld",
                url: "https://wetten.overheid.nl/BWBR0005290/",
                desc: `Legally required holiday allowance: ${(VAKANTIEGELD_RATE * 100).toFixed(0)}% of gross annual salary, paid to worker (usually in May).`,
              },
              {
                name: "SNF (Stichting Normering Flexwonen) — housing norms",
                url: "https://www.snf.nl/normen",
                desc: "Quality and pricing norms for agency worker accommodation. Typical deductions: €80–€115/week for SNF-certified housing.",
              },
              {
                name: "NZa / Zorginstituut Nederland — average health insurance premium",
                url: "https://www.zorginstituutnederland.nl/",
                desc: `Average basisverzekering premium: ~€${HEALTHCARE_MONTHLY}/month (2026 estimate). Individual premiums vary €120–€165/month by insurer.`,
              },
            ].map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-xl p-4">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-600 hover:underline text-sm"
                >
                  {s.name} ↗
                </a>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tax model ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Tax model</h2>

          <h3 className="font-bold text-gray-800 mb-2">Income tax brackets (loonheffing 2026)</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Taxable income</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Rate</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Notes</th>
                </tr>
              </thead>
              <tbody>
                {TAX_BRACKETS_2026.map((b, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 text-gray-700">
                      {i === 0
                        ? `€0 – €${b.upTo.toLocaleString("nl-NL")}`
                        : i === 1
                        ? `€${TAX_BRACKETS_2026[0].upTo.toLocaleString("nl-NL")} – €${b.upTo.toLocaleString("nl-NL")}`
                        : `> €${TAX_BRACKETS_2026[1].upTo.toLocaleString("nl-NL")}`}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-900">
                      {(b.rate * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">
                      {i === 0 ? "Most agency workers stay in this bracket" : i === 1 ? "Higher earners" : "Top rate"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Source: Belastingdienst loonheffing tabel 2026. Bracket 1 includes the AOW-premie component.
          </p>

          <h3 className="font-bold text-gray-800 mb-2">Heffingskorting — tax credits (the part many calculators miss)</h3>
          <p className="mb-3 text-gray-600">
            The Netherlands has two major tax credits that reduce the actual tax owed.
            For a worker earning €14–16/hr, these credits reduce effective tax from ~37% to roughly <strong className="text-gray-800">8–15%</strong>.
            We include both in all our calculations. Many third-party calculators do not, causing them to significantly understate take-home pay.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
              <p className="font-bold text-gray-800 mb-1">Algemene heffingskorting (AHK)</p>
              <p className="text-xs text-gray-600 mb-2">General tax credit — all taxpayers</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Maximum</span><span className="font-mono font-semibold">€{AHK_2026.max.toLocaleString()}/yr</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phase-out starts at</span><span className="font-mono">€{AHK_2026.phaseOutStart.toLocaleString()}/yr</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phase-out rate</span><span className="font-mono">{(AHK_2026.phaseOutRate * 100).toFixed(3)}%</span></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 bg-blue-50">
              <p className="font-bold text-gray-800 mb-1">Arbeidskorting (AK)</p>
              <p className="text-xs text-gray-600 mb-2">Employment tax credit — workers only</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Phase-in 1 (up to €{AK_2026.phaseIn1UpTo.toLocaleString()})</span><span className="font-mono">{(AK_2026.phaseIn1Rate * 100).toFixed(3)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phase-in 2 (up to €{AK_2026.phaseIn2UpTo.toLocaleString()})</span><span className="font-mono">{(AK_2026.phaseIn2Rate * 100).toFixed(3)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phase-out above</span><span className="font-mono">€{AK_2026.plateauUpTo.toLocaleString()}/yr</span></div>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <strong>Important assumption:</strong> We calculate heffingskorting assuming it is applied at source
            (i.e. the worker has submitted a <em>loonheffingskorting verklaring</em> to their primary employer).
            If you work for multiple employers simultaneously, only one employer can apply the full heffingskorting.
            The other employer should use a higher withholding rate. Check your payslip&apos;s &ldquo;loonheffingskorting&rdquo;
            line to confirm it is active.
          </div>
        </section>

        {/* ── Assumptions ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Assumptions</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Assumption</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Value used</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    label: "Working weeks per year",
                    value: "48 weeks (default)",
                    why: "Accounts for 4 weeks holiday leave (legally required minimum). Can be adjusted in the calculator.",
                  },
                  {
                    label: "Vakantiegeld",
                    value: `${(VAKANTIEGELD_RATE * 100).toFixed(0)}% of gross`,
                    why: "Legally required minimum per BW art. 7:634. Paid as lump sum, not included in weekly figures by default.",
                  },
                  {
                    label: "Primary employment",
                    value: "Yes — heffingskorting active",
                    why: "We assume this is the worker's only or main job. Workers with a second job should consult a payroll adviser.",
                  },
                  {
                    label: "Healthcare premium",
                    value: `€${HEALTHCARE_MONTHLY}/month`,
                    why: "National average basisverzekering estimate. Does not include supplementary (aanvullende) insurance.",
                  },
                  {
                    label: "Eigen risico (own risk)",
                    value: "€33/month spread",
                    why: "2026 own risk is €385/year ÷ 12. Only relevant when you actually use healthcare that year.",
                  },
                  {
                    label: "Housing cost (SNF typical)",
                    value: `€${HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate}/month`,
                    why: "SNF-certified rooms with shared facilities, national average. Amsterdam/Utrecht: typically €500–700/month.",
                  },
                  {
                    label: "Tax year",
                    value: "2026",
                    why: "All brackets and credit parameters use the published 2026 figures.",
                  },
                ].map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.label}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">{r.value}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── What we include / exclude ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">What we include and exclude</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-2">✓ Included</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {[
                  "Loonheffing (income tax, Box 1)",
                  "Algemene heffingskorting",
                  "Arbeidskorting",
                  "Vakantiegeld (8%, legally required)",
                  "Agency housing deductions (SNF ranges)",
                  "Health insurance premium (basisverzekering)",
                  "Eigen risico (own risk) spread monthly",
                  "Transport costs (user-adjustable)",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">✗ Not included</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {[
                  "WW / WIA / ZW premies — employer cost, not deducted from gross",
                  "ZVW inkomensafhankelijke bijdrage — employer pays this",
                  "Night / Sunday / public holiday surcharges",
                  "CAO-specific supplements or toeslagen",
                  "Zorgtoeslag (healthcare allowance) — increases spendable if eligible",
                  "Huurtoeslag / other toeslagen",
                  "Municipal / water board taxes (minor, region-specific)",
                  "Pension premiums (ABP / sector-specific)",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
            <strong>Note on zorgtoeslag:</strong> Low-income workers may be eligible for zorgtoeslag
            (healthcare allowance) of €100–€130/month, which further increases spendable income beyond what our
            calculators show. Check <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/zorgtoeslag/" target="_blank" rel="noopener noreferrer" className="underline">belastingdienst.nl/zorgtoeslag</a> to see if you qualify.
          </div>
        </section>

        {/* ── Regional note ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">Regional variation</h2>
          <p className="text-gray-600 mb-4">
            Tax brackets and heffingskorting are national — they apply equally across the Netherlands.
            What varies significantly by region is <strong className="text-gray-800">housing cost</strong>.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Region</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Typical housing/wk</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-600">vs. our default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { region: "Zeeland / Flevoland (greenhouses)", range: "€80–€100/wk",  vs: "−20%",  cls: "text-green-600" },
                  { region: "Noord-Brabant / Gelderland (warehouses)", range: "€95–€115/wk", vs: "default", cls: "text-gray-500" },
                  { region: "Rotterdam / Eindhoven (logistics)", range: "€100–€130/wk", vs: "+15%",  cls: "text-amber-600" },
                  { region: "Amsterdam / Utrecht / Haarlem", range: "€130–€175/wk",  vs: "+40–50%", cls: "text-red-600" },
                ].map((r) => (
                  <tr key={r.region}>
                    <td className="px-4 py-3 text-gray-700">{r.region}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-800">{r.range}</td>
                    <td className={`px-4 py-3 text-right font-semibold text-xs ${r.cls}`}>{r.vs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Source: worker-reported data on AgencyCheck + SNF inspection reports.
            Always adjust the housing slider in the calculator to match your actual situation.
          </p>
        </section>

        {/* ── Example payslip ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-1">Annotated example payslip</h2>
          <p className="text-gray-500 text-sm mb-4">
            Worker at WML (€{WML_HOURLY_2026}/hr), 40 hrs/week, 52 weeks, agency housing in Noord-Brabant.
            This is what a real Dutch loonstrook should show.
          </p>

          <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
            {/* Payslip header */}
            <div className="bg-gray-900 text-white px-5 py-4 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-sm">LOONSTROOK / PAYSLIP</span>
                <span className="text-gray-400">Periode: Maart 2026</span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-400">
                <span>Werknemer: A. Kowalski</span>
                <span>Werkgever: Example Agency BV</span>
                <span>Functie: Order Picker</span>
              </div>
            </div>

            {/* Payslip body */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Gross section */}
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Bruto loon (gross pay)
                    </td>
                  </tr>
                  <Row
                    label={`Basisloon: ${WML_HOURLY_2026} × 40h × 4.33 wk`}
                    value={fmtEur(EXAMPLE.grossMonthly / (1 + VAKANTIEGELD_RATE))}
                    sub="Regular hours at WML"
                    indent
                  />
                  <Row
                    label="Vakantiegeld (8%)"
                    value={fmtEur(EXAMPLE.vakantiegeldMonthly)}
                    sub="Legally required holiday pay (accumulated)"
                    indent
                  />
                  <Row
                    label="Bruto totaal"
                    value={fmtEur(EXAMPLE.grossMonthly)}
                    bold
                  />

                  {/* Tax section */}
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Loonheffing (income tax withholding)
                    </td>
                  </tr>
                  <Row
                    label={`Loonbelasting — bracket 1 (${(TAX_BRACKETS_2026[0].rate * 100).toFixed(2)}%)`}
                    value={`−${fmtEur(EXAMPLE.taxBeforeCredits / 12)}`}
                    sub="Tax before credits"
                    indent
                    neg
                  />
                  <Row
                    label="Algemene heffingskorting"
                    value={`+${fmtEur(EXAMPLE.ahkAnnual / 12)}`}
                    sub={`Tax credit (AHK) — max €${AHK_2026.max}/yr, income-dependent`}
                    indent
                  />
                  <Row
                    label="Arbeidskorting"
                    value={`+${fmtEur(EXAMPLE.akAnnual / 12)}`}
                    sub="Employment tax credit (AK) — workers only"
                    indent
                  />
                  <Row
                    label="Loonheffing (netto te betalen)"
                    value={`−${fmtEur(EXAMPLE.taxMonthly)}`}
                    sub={`Effective rate: ${fmtPct(EXAMPLE.effectiveTaxRate)} (vs ${(TAX_BRACKETS_2026[0].rate * 100).toFixed(1)}% statutory)`}
                    bold
                    neg
                  />

                  {/* Net */}
                  <Row
                    label="Nettoloon (net pay)"
                    value={fmtEur(EXAMPLE.netMonthly)}
                    bold
                    highlight
                  />

                  {/* Agency deductions */}
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Inhoudingen (agency deductions)
                    </td>
                  </tr>
                  <Row
                    label="Huisvesting — SNF gecertificeerd"
                    value={`−${fmtEur(EXAMPLE.housingMonthly)}`}
                    sub="Shared accommodation, Noord-Brabant — €104/week"
                    indent
                    neg
                  />
                  <Row
                    label="Transport"
                    value="−€0"
                    sub="Included by agency in this example"
                    indent
                  />
                  <Row
                    label="Overgemaakt naar bankrekening"
                    value={fmtEur(EXAMPLE.netMonthly - EXAMPLE.housingMonthly)}
                    bold
                    highlight
                  />

                  {/* Own costs */}
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Eigen kosten (not on payslip — worker pays directly)
                    </td>
                  </tr>
                  <Row
                    label="Zorgverzekering (basisverzekering)"
                    value={`−€${HEALTHCARE_MONTHLY}`}
                    sub="Approx. €140/month — varies by insurer"
                    indent
                    neg
                  />
                  <Row
                    label="Eigen risico (gespreid)"
                    value="−€33"
                    sub="€385/year own risk, if healthcare used"
                    indent
                    neg
                  />

                  {/* Final spendable */}
                  <Row
                    label="Vrij besteedbaar (spendable)"
                    value={fmtEur(EXAMPLE.spendableMonthly)}
                    bold
                    highlight
                    sub={`= €${toWeekly(EXAMPLE.spendableMonthly)}/week · ${fmtEur(EXAMPLE.effectiveHourly, 2)}/effective hour`}
                  />
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-blue-50 border-t border-blue-100 px-5 py-3 text-xs text-blue-800">
              <strong>What to check on your real payslip:</strong> Confirm loonheffingskorting is marked
              &ldquo;JA&rdquo; or &ldquo;Ja toegepast&rdquo; — if it shows &ldquo;NEE&rdquo; you are overpaying tax by{" "}
              {fmtEur((EXAMPLE.ahkAnnual + EXAMPLE.akAnnual) / 12)}/month. Also verify housing
              deduction is itemised separately, not bundled into a single &ldquo;netto&rdquo; line.
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Why does my payslip show more/less tax than the calculator?",
                a: "The most common reason is that loonheffingskorting is not applied (shows 'NEE' on payslip). Without it, you pay the full bracket rate (36.97%) with no credit. Also check: are you working for multiple employers? Only one can apply the full credit.",
              },
              {
                q: "Is vakantiegeld included in the weekly/monthly figures?",
                a: "By default, our weekly and monthly figures exclude vakantiegeld because it is typically paid as a lump sum in May. You can toggle it on in the real salary calculator to see the annualised effect. Legally it is 8% of gross and must be paid out.",
              },
              {
                q: "Why is the effective tax rate so low for minimum wage workers?",
                a: `At WML (€${WML_HOURLY_2026}/hr, 40h/wk), the combined heffingskorting exceeds the bracket tax, leaving an effective rate of around ${fmtPct(EXAMPLE.effectiveTaxRate)}. The Dutch tax system intentionally protects low earners through these credits.`,
              },
              {
                q: "Does the calculator account for night shifts or Sunday pay?",
                a: "No — surcharges (toeslagen) for night, Sunday, and public holiday work are sector and CAO-specific. If your CAO provides a 25–50% surcharge, add the blended hourly rate to the calculator manually. This can significantly increase take-home.",
              },
              {
                q: "I'm eligible for zorgtoeslag — can I add it?",
                a: "Not directly in the calculator, but zorgtoeslag (€100–€130/month for eligible low earners) effectively reduces your healthcare cost. Subtract it from the healthcare slider to see the real impact. Check eligibility at belastingdienst.nl/zorgtoeslag.",
              },
            ].map((item) => (
              <details key={item.q} className="border border-gray-200 rounded-xl overflow-hidden group">
                <summary className="px-5 py-3.5 font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-gray-400 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Feedback ── */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <p className="font-bold text-gray-800 mb-1">Found an error or outdated figure?</p>
          <p className="text-gray-600 text-sm mb-3">
            Tax tables change annually. If you spot a discrepancy between our calculator and your actual
            payslip (after confirming loonheffingskorting is active), please let us know.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Report an issue
          </Link>
        </section>

      </div>

      {/* Bottom nav */}
      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/tools/real-income-calculator" className="hover:text-brand-600">Real income calculator</Link>
        <Link href="/tools/real-salary-calculator" className="hover:text-brand-600">Salary calculator</Link>
        <Link href="/privacy" className="hover:text-brand-600">Privacy policy</Link>
        <Link href="/terms" className="hover:text-brand-600">Terms of use</Link>
        <Link href="/contact" className="hover:text-brand-600">Contact</Link>
      </div>
    </div>
  );
}
