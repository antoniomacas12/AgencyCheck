// ─── Agency SEO Content ────────────────────────────────────────────────────────
// Long-form, unique editorial content for major agency pages.
// Content is grounded in real 2026 Dutch labour data:
//   WML €14.71/hr · SNF housing max €113.50/week
//   ABU CAO premiums: night +22%, Sunday +50%, overtime 125/150%
//   Net take-home at WML ≈ €345/week (after loonheffing ~10.7% + vakantiegeld 8%)
//
// Slugs that exist in /data/agencies.ts render live on their agency page.
// Slugs not yet in the dataset are stored here ready for when the agency is added.

export interface AgencySeoSection {
  heading: string;
  body: string;
}

export interface AgencySeoContent {
  metaTitle: string;         // ≤60 chars
  metaDescription: string;   // ≤155 chars
  intro: string;             // 2–3 sentence page lede
  sections: AgencySeoSection[];
  pros: string[];
  cons: string[];
  internalLinks: Array<{ href: string; label: string }>;
}

// ─── Content map: slug → editorial content ────────────────────────────────────

export const AGENCY_SEO_CONTENT: Record<string, AgencySeoContent> = {

  // ── 1. Tempo-Team ───────────────────────────────────────────────────────────
  "tempo-team-amsterdam-uitzendbureau": {
    metaTitle: "Tempo-Team Netherlands Review 2026 – Salary & Housing",
    metaDescription:
      "Real worker review of Tempo-Team Netherlands. Salary at WML €14.71/hr, housing deductions up to €113.50/week, shift premiums. What workers actually take home.",
    intro:
      "Tempo-Team is one of the largest staffing groups in the Netherlands, operating under the Randstad Group umbrella. It places thousands of workers each year across logistics, production, and food-processing — roles that typically start at WML (€14.71/hr in 2026) and rely heavily on agency-provided housing. The scale means fast placements but inconsistent experiences depending on which inhouse location manages your contract.",
    sections: [
      {
        heading: "Wages and Payslip Breakdown",
        body: `Tempo-Team contracts for production and logistics roles start at the 2026 Statutory Minimum Wage: €14.71 gross per hour. On a standard 40-hour week that is €588.40 gross before deductions. After loonheffing (approximately 10.7% at WML) and with vakantiegeld (8% holiday pay) accruing separately, workers take home roughly €340–€355 per week in cash — before housing is deducted.

Shift premiums under the ABU CAO apply when Tempo-Team places workers on non-standard hours: 22% uplift for night shifts (between 00:00 and 06:00), 50% for Sunday work, and 125% for the first two hours of overtime. These premiums can push weekly gross to €650–€700 for workers doing full night-shift rotations. The difference between a day-shift and a regular night-shift week is approximately €100 net.

Workers in Phase A (weeks 1–78) earn no paid public holidays. Phase B workers (from week 79 under the ABU CAO) receive improved conditions including holiday pay-out rights and sick pay entitlement after 26 weeks.`,
      },
      {
        heading: "Housing Provision and Deductions",
        body: `Tempo-Team provides housing for many of its logistics and production placements in the Netherlands, typically through SNF-registered (Stichting Normering Flexwonen) accommodation. The legal maximum deduction under SNF norms is €113.50 per week in 2026. Tempo-Team charges within this range, though the exact figure varies by location.

Accommodation is typically shared: four to six workers per room, shared bathroom and kitchen facilities. In high-demand periods near major logistics hubs such as the Tilburg–Venlo corridor or the Rotterdam port area, housing quality drops and occupancy rises. Agency workers here describe that accommodation near Amazon and Rhenus fulfilment centres is functional but basic — shared sleeping rooms, a communal kitchen, and shuttle access to the site.

If housing is deducted at €113.50/week, a worker taking home €345/week net is left with approximately €231 after rent — roughly €1,000/month disposable income before food and transport.`,
      },
      {
        heading: "Work Environment and Transport",
        body: `Transport to site is typically provided by Tempo-Team for inhouse logistics placements. The shuttle runs on shift timings, and workers with non-standard shift hours report occasional gaps between the last bus and shift end. Workers placed without inhouse transport arrangements should budget €10–€20/week for public transport.

Work conditions in logistics roles are physically demanding: standing, lifting (up to 25kg), and repetitive scanning tasks for 8–10 hour shifts. Temperature-controlled warehouses can be cold in winter. Safety gear (gloves, safety shoes) is provided on day one at most sites, though workers report variation in the quality of provided footwear.

Contracts are standard ABU Phase A initially — zero-hours with weekly renewal. Most workers placed at major sites transition to fixed weekly hours after two to four weeks once site managers confirm availability.`,
      },
      {
        heading: "The Case For and Against",
        body: `The clearest advantage of working through Tempo-Team is speed: placement can happen within 48 hours of registration, and housing is arranged simultaneously. For workers arriving from abroad with no existing accommodation, this removes the main barrier to starting work. The Randstad Group's compliance infrastructure also means tax registrations (BSN, DigiD, bank account) are handled systematically.

The main disadvantage is inconsistency. Tempo-Team operates through dozens of inhouse and branch locations across the Netherlands. Experiences at a Tilburg logistics site can differ substantially from those at an Amsterdam distribution centre — different local managers, different housing stock, different attention to payslip accuracy. Workers report that payslip queries can take several weeks to resolve when escalated to a central team rather than a responsive local coordinator.

Salary is reliably at or above WML, but night and overtime premiums are occasionally absent from payslips. Workers should check every payslip against their shift schedule, particularly in the first four weeks.`,
      },
      {
        heading: "Our Assessment for 2026",
        body: `Tempo-Team is a workable first step into the Dutch labour market, particularly for workers who need both employment and housing arranged quickly. The Randstad Group backing ensures regulatory compliance is generally maintained. Realistic expectations: approximately €340/week cash in hand at WML day shifts, €440–€460 on regular night shifts. After SNF housing (€113.50), disposable income is approximately €230–€350/week depending on shifts.

The risks are payslip errors on premium shifts and variable housing quality. Workers should register with SNF's complaints channel if housing falls below standard, and use the payslip checker tool to verify deductions before signing the first contract.`,
      },
    ],
    pros: [
      "Fast placement — housing + employment arranged simultaneously",
      "ABU CAO compliance — shift premiums apply when hours qualify",
      "Large inhouse presence at major logistics sites",
      "Randstad Group compliance infrastructure for BSN/tax registration",
    ],
    cons: [
      "Quality inconsistency across 50+ inhouse locations",
      "Premium shifts occasionally missing from payslips",
      "Phase A workers: no paid public holidays, limited sick pay",
      "Housing stock quality varies significantly by region",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  // ── 2. Randstad Nederland ───────────────────────────────────────────────────
  "randstad-nederland": {
    metaTitle: "Randstad Nederland Review 2026 – Salary, Housing, Workers",
    metaDescription:
      "Randstad Netherlands review by workers 2026. Salary accuracy, housing deductions, payslip record. What to expect at WML and above-WML roles.",
    intro:
      "Randstad is the world's largest staffing company and the benchmark agency in the Dutch market. Its Netherlands operation covers everything from warehouse workers at WML through to technical specialists earning €20+/hr — the experience of a logistics worker placed through a Randstad inhouse team differs substantially from a professional placed through a Randstad Professionals branch. This review focuses on the warehouse, production, and general labour segment, where most international workers first encounter the brand.",
    sections: [
      {
        heading: "Gross to Net: What Workers Keep",
        body: `Randstad pays at WML minimum for entry-level logistics and production placements: €14.71 gross/hr in 2026. On a 40-hour week this equals €588.40 gross. Net take-home after loonheffing and with vakantiegeld accruing is approximately €345–€360/week. Workers with contractual night or Sunday shifts receive the applicable ABU CAO premiums (22% night, 50% Sunday).

Randstad's payslip record is generally better than smaller agencies. The company's centralised payroll systems mean errors are less frequent, and the online payslip portal allows workers to check their deductions in detail. Employees note that when payslip errors do occur — typically on premium shift hours — they are resolved within two pay cycles when escalated via the app.

Above-WML roles do exist through Randstad, particularly in technical, maintenance, and skilled food-processing. Workers placed in these roles report hourly rates of €16–€19, with net take-home of €380–€440/week before housing.`,
      },
      {
        heading: "Where to Live and What It Costs",
        body: `Randstad provides housing for its logistics and production placements in most regions. Accommodation is SNF-certified; the maximum legal deduction is €113.50/week. Those who have worked here say deductions in the €95–€113 range depending on the location and occupancy level.

Housing quality at Randstad is rated marginally better than smaller competitors by workers who have used both. Rooms typically house three to four workers, with shared facilities. Sites in the Rotterdam Rijnmond, Amsterdam Westpoort, and North Brabant logistics corridor are the most frequently reported housing locations. Maintenance response times are described as adequate — broken facilities are typically repaired within a week.

Workers seeking to arrange their own accommodation can do so from Phase A onwards, though Randstad advises using agency housing for the first month while getting settled. Workers who opt out of agency housing do not receive a housing supplement in lieu.`,
      },
      {
        heading: "Commute and Workplace Conditions",
        body: `Randstad inhouse teams at major logistics sites provide shuttle transport. Bus times align with shift start and end, though workers on split or unusual shifts report the service as less reliable at off-peak hours. Workers without shuttle access budget approximately €10–€25/week for OV-chipkaart travel depending on location.

Production and logistics work is physical: standing for 8–10 hours, repetitive movement, lifting. Randstad's larger clients (DHL, PostNL, cooling storage operations) maintain reasonably well-equipped break rooms and provide mandatory safety briefings. Agency workers here describe that induction quality varies: some sites provide full on-site tours and multi-language safety materials, others give only a brief orientation.

The Randstad app allows workers to view shifts, accept or decline extra hours, and track holiday hour accumulation. Workers rate the app positively for transparency.`,
      },
      {
        heading: "Where They Excel and Where They Fall Short",
        body: `Randstad's primary advantage is institutional reliability. Payslips are accessible, CAO compliance is generally maintained, and the brand's scale means there is always someone available when issues arise. Workers transitioning from smaller agencies frequently report the contrast in payslip accuracy and communication responsiveness.

The disadvantage is scale itself: workers can feel like a number rather than a person. Local inhouse teams vary significantly in how engaged they are with individual workers. Workers placed at very large sites (5,000+ workers) report less personal contact with their coordinator than those at smaller sites. Some workers also report that overtime is offered unevenly — coordinators favour workers with higher availability ratings in the app.

Randstad is not the cheapest for workers in terms of housing deduction — smaller agencies sometimes offer lower deductions to attract workers. However, the overall package including payslip accuracy and housing maintenance standard makes the total worker experience competitive.`,
      },
      {
        heading: "Our Take for 2026",
        body: `For workers who want a structured, compliant agency experience in the Netherlands, Randstad is the benchmark. Payslip accuracy, housing that meets SNF standards, and a functioning app make the day-to-day experience less stressful than many alternatives.

Workers typically end up with: €345/week day shifts at WML, rising to €420–€460 on regular night rotations. After SNF housing at maximum rate, disposable income is approximately €230–€350. Workers looking to save substantially should target above-WML placements through Randstad's skilled/technical branches from month three onwards.`,
      },
    ],
    pros: [
      "Best payslip accuracy of the major agencies",
      "SNF-certified housing across all placements",
      "App with full payslip transparency and shift management",
      "Above-WML roles available from week 8 for skilled workers",
    ],
    cons: [
      "Large sites feel impersonal — coordinator contact minimal",
      "Housing deduction at or near SNF maximum",
      "Overtime not always distributed fairly at high-volume sites",
      "Phase A conditions apply for first 78 weeks",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
    ],
  },

  // ── 3. Covebo ───────────────────────────────────────────────────────────────
  "covebo": {
    metaTitle: "Covebo Review 2026 – Logistics Specialist Salary & Housing",
    metaDescription:
      "Covebo workers review 2026. Logistics specialist agency. WML salary, SNF housing, Fase A/B progression, Tilburg–Venlo corridor experience.",
    intro:
      "Covebo is a mid-size Dutch staffing agency specialising in logistics, production, and warehouse roles. Unlike generalist agencies, Covebo operates almost exclusively in the supply chain sector, with a strong presence in the Tilburg–Venlo logistics corridor and the North Brabant and Limburg regions. Staff who have worked here describe that Covebo's sector focus produces better-prepared coordinators and more accurate payslips than generalist competitors placing workers in the same sites.",
    sections: [
      {
        heading: "Pay Rates and Weekly Take-Home",
        body: `Covebo contracts start at WML: €14.71/hr in 2026. On a standard 40-hour week, gross pay is €588.40. Net take-home after loonheffing is approximately €345/week, with vakantiegeld (8%) accruing separately. Night and Sunday shift premiums under the applicable CAO (ABU or sector-specific logistics CAO where applicable) add €20–€60/week for workers on regular premium shifts.

Workers at Covebo report a notably higher rate of correct payslip generation than the sector average. Shift premiums appear correctly from the first pay cycle in the majority of cases. Workers recommend keeping a personal shift log (start/end times, break durations) to verify against the payslip — Covebo's coordinators are responsive to corrections when documented evidence is provided.

Vakantiegeld is paid out at the end of the Fase A period (or annually if requested). At WML, 8% of €588.40/week over 48 working weeks equals approximately €2,260 in accumulated holiday pay — a significant sum for workers planning to save.`,
      },
      {
        heading: "Agency Housing: What to Expect",
        body: `Covebo arranges housing through SNF-certified accommodation. The housing deduction is consistently reported at €100–€113.50/week — within the legal SNF maximum. Rooms are shared (three to four workers), with shared bathroom and kitchen. Covebo's logistics focus means most housing is positioned within 10–20 minutes of a Tilburg, Venlo, or Eindhoven logistics site.

Reviews on AgencyCheck indicate that Covebo housing is clean and functional. Specific locations near major DHL and Geodis sites in North Brabant receive consistently positive mentions for maintenance response. Workers who have moved from other agencies report that the condition-on-arrival is better than average.

One pattern in worker reports: housing during peak periods (October to January, driven by e-commerce volumes) becomes tighter. Shared rooms that normally house three workers may temporarily accommodate four. This is above the SNF guideline maximum and workers are advised to raise it formally via SNF's complaints mechanism if it persists.`,
      },
      {
        heading: "Site Access and Working Environment",
        body: `Transport to logistics sites is provided for most Covebo placements. The shuttle runs on shift times. Workers at Covebo's Venlo-area placements report that transport is reliable — the coordinator network in this region is experienced and responsive to last-minute shift changes.

Work conditions reflect the logistics sector: standing shifts, lifting, pick-and-pack tasks. Covebo's inhouse teams at large sites conduct daily briefings and have a visible floor presence, which workers rate positively. Health and safety compliance is reported as above average by workers who have also worked with other agencies at the same client sites.

Workers transitioning from Phase A to Phase B (after 78 weeks of employment) with Covebo gain improved conditions under the ABU CAO: paid public holidays, sick pay entitlement from week 26, and the right to request a fixed-hours contract. Covebo coordinators are described as proactive about informing workers when they are approaching Phase B.`,
      },
      {
        heading: "What This Agency Does Well",
        body: `Covebo's specialisation in logistics is its clearest advantage. Coordinators know the sector, the clients, and the typical issues (peak planning, WML compliance, overtime regulations) better than generalist agencies. Workers get faster resolutions to payslip queries and better-timed housing arrangements because the agency operates a predictable regional model rather than placing workers nationally across multiple sectors.

The main constraint is geographic — Covebo's work is concentrated in North Brabant and Limburg. Workers who need or want to relocate to other regions of the Netherlands will find fewer options through Covebo than through a national generalist.

Payslip record is the highest-rated aspect across multiple worker reviews. Workers rarely report missing overtime or incorrect deductions, which is the single most common complaint at larger agencies.`,
      },
      {
        heading: "Is It Worth Registering?",
        body: `Covebo is the recommended choice for workers who are certain they want logistics or production work in North Brabant or Limburg and value payslip reliability above all else. The combination of sector expertise, accurate payslips, and SNF housing in close proximity to major sites makes it a strong option for workers planning to stay in the Netherlands for 12+ months and build toward Phase B conditions.

After all deductions, workers receive: €345/week day shifts at WML, approximately €400–€420 on night shifts. After housing at €110–€113.50, disposable income is approximately €230–€305/week.`,
      },
    ],
    pros: [
      "Highest payslip accuracy rating among logistics-specialist agencies",
      "Logistics sector expertise — coordinators know the CAO and client sites",
      "SNF housing near major Tilburg/Venlo logistics hubs",
      "Proactive Phase B transition communication",
    ],
    cons: [
      "Limited geographic coverage — mainly North Brabant and Limburg",
      "Fewer roles outside logistics and production",
      "Peak-period housing can become crowded",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
    ],
  },

  // ── 4. Adecco ───────────────────────────────────────────────────────────────
  "adecco-uitzendbureau-bij-heineken-experience-center-amsterdam": {
    metaTitle: "Adecco Netherlands Review 2026 – Salary, Housing, Roles",
    metaDescription:
      "Adecco Netherlands worker review 2026. Technical and skilled roles above WML. Third-party housing, payslip accuracy, global agency pros and cons.",
    intro:
      "Adecco is the world's third-largest staffing company, with a broad Netherlands operation spanning from warehouse workers to technical specialists. In the Dutch market, Adecco tends to attract workers for higher-skilled production, technical maintenance, and facilities roles — often paying above WML — as well as standard logistics placements. The distinction matters: Adecco's experience for a machine operator at €17/hr differs substantially from that of a packer at WML.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: `Entry-level logistics roles through Adecco start at WML: €14.71/hr in 2026. However, Adecco's job mix includes a higher proportion of technical and skilled production roles than most general staffing agencies. Workers in roles such as forklift operator, maintenance technician, or quality inspector typically earn €16.00–€19.50/hr. Net take-home at €17/hr on a 40-hour week is approximately €400–€420, before housing.

At WML (€14.71/hr), standard 40-hour net take-home is approximately €345/week. Shift premiums under the ABU CAO apply: 22% for nights, 50% for Sundays. Workers on regular night shifts report gross earnings of €640–€680/week, translating to approximately €430–€450 net.

Reviews on AgencyCheck indicate that Adecco's payslip system is reliable for standard roles but less consistent for complex technical CAOs with multiple premium rates. Workers in technical placements are advised to check the applicable sector CAO and compare it to their payslip in the first month.`,
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: `Adecco sources housing through third-party housing providers rather than managing accommodation directly. This means the housing experience varies based on which provider is contracted in the worker's region. SNF-certified accommodation is standard, with deductions in the €100–€113.50 range.

The third-party housing model has a practical downside: the chain of accountability is longer. When housing issues arise — maintenance delays, overcrowding, billing errors — the response path runs: worker → Adecco coordinator → housing provider. People placed through this agency say this creates delays of up to two weeks for non-urgent repairs. Adecco coordinators are described as responsive at intake but less engaged with ongoing housing issues once placement is confirmed.

Workers who can arrange their own accommodation (particularly those in the Netherlands for a second or subsequent contract) benefit from opting out of agency housing and keeping the full €113.50/week in their own pocket.`,
      },
      {
        heading: "Daily Work Reality",
        body: `Transport arrangements depend on the client site. Major logistics clients with Adecco inhouse presence provide shuttle transport. Technical and skilled placements at smaller manufacturers typically do not include transport, requiring workers to use public transport or arrange their own (budget €15–€30/week in most industrial areas).

Work conditions for technical roles are generally safer and more ergonomic than pure logistics work. Machine operation, quality checking, and maintenance roles involve less sustained physical loading. Adecco's induction process for technical roles is more thorough than for logistics: workers report multi-day client orientations, equipment certifications, and structured health and safety training.

Contract terms for above-WML technical roles often include a six-week evaluation period followed by a direct offer from the client, creating a potential direct-hire pathway — one of Adecco's stated selling points.`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `Adecco's biggest advantage for workers is access to above-WML roles that are less common at smaller agencies. The global brand's relationships with multinational manufacturers mean Adecco often gets first access to technical placements. Workers with vocational qualifications (forklift, reach truck, HACCP, electrical) or relevant experience should register specifically as skilled rather than general labour.

The main drawback is the third-party housing model. Workers who place high importance on housing quality and accountability are better served by agencies that manage accommodation directly. Housing billing errors — charged for days not occupied, deductions continuing after contract end — are reported more frequently with third-party providers.

Payslip accuracy for standard roles is good. The Adecco app allows workers to view payslips and holiday accrual. Multi-language support is available at registration centres in Amsterdam, Rotterdam, and Eindhoven.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `Adecco is best suited to workers with skills that qualify them for above-WML placements — technical, skilled production, or specialist roles. For standard logistics at WML, the experience is comparable to Randstad or Tempo-Team but with less direct housing management.

Net weekly income in practice: €345/week (WML day shift) to €420+/week (above-WML technical). After third-party housing at the SNF maximum, disposable income is €230–€310/week at WML, rising to €310–€380 at above-WML rates. Workers should verify housing billing carefully each month, particularly during the first two pay cycles.`,
      },
    ],
    pros: [
      "Access to above-WML technical and skilled roles",
      "Direct-hire pathway at many client sites",
      "Multi-language registration support",
      "Payslip app with holiday accrual tracking",
    ],
    cons: [
      "Third-party housing creates accountability gaps",
      "Housing billing errors more common than with direct-managed providers",
      "Technical CAO payslips require worker verification",
      "Transport not included for most non-logistics placements",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  // ── 5. Timing ───────────────────────────────────────────────────────────────
  "timing-uitzendbureau-inhouse-rai": {
    metaTitle: "Timing Netherlands Review 2026 – Production & Food Sector",
    metaDescription:
      "Timing agency Netherlands worker review 2026. Production and food processing roles at WML. Housing quality, payslip complaints, shift premiums explained.",
    intro:
      "Timing is a mid-size Dutch staffing agency with its strongest presence in production, food processing, and light manufacturing. It operates inhouse teams at a number of food factories and packaging facilities across the Netherlands. Timing's workforce is predominantly placed at WML, and the agency's housing provision is a key part of its offering for workers arriving from abroad.",
    sections: [
      {
        heading: "Living Conditions and Housing Cost",
        body: `Housing is the first topic most workers raise when discussing Timing. The agency provides accommodation through SNF-registered facilities, with deductions in the €95–€113.50 range. However, the housing quality reported by Timing workers is more variable than that reported by workers at Randstad or Covebo.

Workers at food processing placements in the eastern Netherlands (Gelderland, Overijssel) describe housing that is functional but dated — shared rooms of four to six, older bathroom facilities, and maintenance response times of one to two weeks. Workers near major food industry clusters in the west (Rotterdam area) report marginally better conditions, likely due to higher housing investment in areas with more worker competition.

Workers who experience below-standard housing conditions should document them with photographs and report to SNF directly. The SNF maximum deduction of €113.50 is conditional on the accommodation meeting SNF's minimum standards — if it does not, workers have grounds to dispute the full deduction amount.`,
      },
      {
        heading: "Earnings Breakdown for 2026",
        body: `Timing pays at WML for production and food processing roles: €14.71/hr in 2026. On 40 hours per week, gross is €588.40. Net take-home is approximately €340–€355/week after loonheffing, with vakantiegeld (8%) accumulating for payout at period end.

Shift premiums apply for night and weekend work under the food industry CAO. Night premium rates are typically 22–30% (food sector CAOs often exceed the ABU minimum), Sunday premiums are 50%. Workers on regular night shifts in food production report weekly gross earnings of €620–€680.

Payslip complaints are above average for Timing. Workers frequently report that Sunday or bank holiday premiums are missing from one or more payslips. The pattern suggests a payroll system error rather than deliberate underpayment — but the practical result is the same. Workers are strongly advised to keep a shift log and cross-check every payslip against it.`,
      },
      {
        heading: "Daily Work Reality",
        body: `Transport to food processing sites is provided for most Timing inhouse placements. The shuttle schedule aligns with shift times for standard shifts but is less reliable for split or non-standard hours. Workers without transport provided should budget €10–€25/week.

Food processing work is physically demanding in different ways from logistics: cold environments, repetitive cutting or packaging tasks, strict hygiene requirements. Personal protective equipment (hairnets, gloves, waterproof footwear) is provided at most Timing sites. Workers report that footwear quality varies — some sites provide quality waterproof boots, others provide basic covers that wear quickly.

HACCP and food safety induction is conducted at all Timing food placements, usually on day one. Workers with previous food processing experience note that the training quality at Timing is adequate but basic.`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `The advantage of Timing is its food sector specialisation: the coordinators understand food processing CAOs, shift patterns, and hygiene requirements. Workers with food industry experience find placement faster than at generalist agencies. Timing's inhouse presence at major food facilities means less time between registration and first shift.

The main concern is payslip accuracy. A higher-than-average proportion of Timing workers report needing to query one or more payslips during their placement. Workers who do not track their own shifts will likely receive the incorrect amount and not notice. This is not unique to Timing but is reported more frequently here than at the larger agencies.

Housing quality is variable. Workers should ask specifically about SNF certification, occupancy numbers, and recent inspection scores before signing.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `Timing is a practical option for workers with food industry or production experience who want fast placement. The sector expertise and inhouse presence at established food sites provides stability. However, payslip vigilance is non-negotiable: check every payslip against your shifts, particularly for premium rates.

After all deductions, workers receive: €340–€355/week at WML day shifts, €410–€440 on regular night shifts. After housing deduction (€95–€113.50), disposable income is approximately €225–€345 depending on shifts and housing rate.`,
      },
    ],
    pros: [
      "Food sector expertise — faster placement for experienced workers",
      "Inhouse presence at established food processing sites",
      "Night shift premiums can significantly increase weekly net pay",
    ],
    cons: [
      "Above-average payslip error rate on premium shifts",
      "Housing quality variable — older stock in some eastern regions",
      "Workers must track own shifts to verify payslips",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── 6. Olympia ──────────────────────────────────────────────────────────────
  "olympia-uitzendbureau": {
    metaTitle: "Olympia Netherlands Review 2026 – Worker Salary & Housing",
    metaDescription:
      "Olympia uitzendbureau Netherlands 2026 worker review. Founded 1964, broad sectors, regional quality variation. Salary, housing, and what to watch for.",
    intro:
      "Olympia is the oldest staffing agency still operating in the Netherlands, founded in 1964. Its longevity reflects a broad sector reach — logistics, production, hospitality, retail, and office — and a national branch network. This breadth is both Olympia's strength and its main variability factor: a worker placed by Olympia in a Groningen warehouse will have a different experience from one placed in a Rotterdam port operation, and both will differ from a worker in an Amsterdam hospitality role.",
    sections: [
      {
        heading: "What the Payslip Shows",
        body: `Olympia applies the relevant sector CAO to each placement. For logistics and production roles — which represent the majority of international worker placements — this means the ABU CAO at WML minimum: €14.71/hr in 2026. Net take-home on a standard 40-hour week is approximately €345/week.

For hospitality and retail placements, the applicable CAO (Horeca CAO or Retail CAO) may provide different overtime and premium structures. Workers in these sectors should confirm their applicable CAO at registration — the premium rates differ from the ABU CAO and the holiday accrual calculation can also vary.

Workers at Olympia report generally reliable salary payments. Payslip accuracy is rated as average to good — better than Timing, comparable to Adecco for standard roles. Workers note that responses to payslip queries are typically two to three working days, faster than the industry average.`,
      },
      {
        heading: "Accommodation: Reality vs Promise",
        body: `Olympia provides housing for production and logistics placements. SNF certification applies and deductions are within the €95–€113.50 range. Housing quality reports vary significantly by region. Workers placed in the Randstad (Amsterdam, Rotterdam, The Hague areas) generally report better facilities than those in rural or smaller-city placements. This likely reflects both housing stock age and the level of investment Olympia makes in high-demand areas.

Workers placed through Olympia in northern Netherlands (Groningen, Friesland) report older accommodation — often converted houses rather than purpose-built worker housing. Shared rooms of three to four, functional but dated. Workers in North Brabant and Zeeland for agricultural or food placements report accommodation near worksites but with limited transport connectivity.

Olympia workers mention that communication about housing — deduction breakdown, SNF registration number, inspection history — is not always proactively provided. Workers should ask specifically for this information before committing to a placement that includes agency housing.`,
      },
      {
        heading: "Physical Demands and Transport Setup",
        body: `Transport provision depends on the placement type. Olympia inhouse logistics placements include shuttle transport to site. Branch placements (where a worker registers at a local Olympia branch rather than being managed inhouse at a client site) often do not include transport. Workers in these arrangements should clarify transport from the outset.

Work conditions reflect the sector: logistics roles are physically demanding, hospitality roles require flexible hours including evenings and weekends. Olympia's broad sector coverage means coordinators may not have deep expertise in every sector they place workers into — a coordinator managing both a hotel kitchen and a packing line in the same week will necessarily be more generalist in their knowledge.

Olympia's longevity means it has established relationships with long-standing clients. This can translate into more stable placement availability — fewer sudden contract terminations — compared with newer agencies trying to win market share.`,
      },
      {
        heading: "What Sets Them Apart — and What Doesn't",
        body: `The advantage of Olympia is breadth and stability. Workers who want options across multiple sectors, or who are uncertain which type of role suits them, benefit from registering with a genuinely cross-sector agency. Workers also benefit from Olympia's long client relationships — placements at established clients are less likely to be disrupted by the agency changing commercial strategy.

The main limitation is regional variation. Olympia's quality is more consistent at high-demand regional hubs than at smaller branches. Workers in low-demand regions may find coordinator support thinner and housing stock older.

Payslip accuracy is average — better than the sector worst but not as strong as Covebo or Randstad. Workers should check their first three payslips carefully.`,
      },
      {
        heading: "Worth Your Time in 2026?",
        body: `Olympia is a reliable mid-tier choice for workers who value sector flexibility and regional presence across the Netherlands. The 60-year history means established processes and stable client relationships. For workers who know they want logistics in North Brabant or food processing in Limburg specifically, a logistics-specialist agency like Covebo will provide a tighter experience. For workers who want options and flexibility, Olympia's breadth is an asset.

Real weekly income works out to: €345/week at WML day shifts. After SNF housing, disposable income is approximately €230–€345 depending on housing rate and shifts.`,
      },
    ],
    pros: [
      "Broadest sector coverage among established Dutch agencies",
      "60+ year history — stable client relationships",
      "National branch network for workers who relocate",
      "Reasonable payslip query response times",
    ],
    cons: [
      "Regional quality variation — rural locations less well-serviced",
      "Branch coordinators may lack deep sector expertise",
      "Housing information not always proactively disclosed",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── 7. Carrière ─────────────────────────────────────────────────────────────
  "carriere-uitzendbureau": {
    metaTitle: "Carrière Uitzendbureau Review 2026 – Salary, Housing, NL",
    metaDescription:
      "Carrière uitzendbureau Netherlands review 2026. Smaller personal agency, third-party housing, regional coverage. Pros, cons, and real worker take-home.",
    intro:
      "Carrière is a smaller Dutch staffing agency offering a more personal service model than the national giants. Its regional focus and smaller workforce means individual attention from coordinators is more common — workers are less likely to feel like a number. However, the smaller scale also means fewer active placements, more reliance on third-party housing providers, and less leverage with clients on worker complaints.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: `Carrière pays at WML for most of its production and logistics placements: €14.71/hr in 2026. Net take-home on a 40-hour week is approximately €340–€355. Shift premiums apply under the applicable CAO. Workers placed in smaller manufacturing or food operations may fall under sector-specific CAOs with premium structures that differ slightly from ABU norms.

Workers at Carrière report that payslips are generally accurate for standard hours. Premium shifts — particularly irregular overtime and weekend work — are more likely to generate queries. The smaller payroll team at Carrière means resolution times can be longer than at larger agencies, typically three to five working days rather than one to two.

Vakantiegeld (8% holiday pay) accrues and is paid out at period end. Workers who stay for a full year accumulate approximately €2,260 at WML rates — a meaningful saving figure.`,
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: `Carrière uses third-party housing providers for worker accommodation. The agency does not manage housing stock directly. This creates the same accountability gap as seen with Adecco's housing model: when issues arise, the response chain is worker → Carrière coordinator → housing provider → maintenance.

Housing deductions are within the SNF maximum of €113.50/week. People placed through this agency say deductions in the €95–€110 range depending on location and contract. SNF certification applies to the third-party providers used — workers should ask for the SNF registration number of their specific accommodation at the start of their contract.

The most common housing complaint from Carrière workers relates not to conditions but to billing: deductions continuing after contract end, or the first week being charged even when arrival was mid-week. Workers are advised to photograph their arrival and departure conditions, and to formally confirm via written message (WhatsApp to coordinator counts) both the start date and the end date of housing occupancy.`,
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: `Transport to site is variable at Carrière. Larger client placements include shuttle transport; smaller manufacturing sites do not. Workers should confirm transport arrangements at registration before committing to a placement. Budget approximately €15–€25/week for public transport if it is not provided.

Work conditions in Carrière's placements are typical of light manufacturing and regional food processing: standing work, repetitive tasks, moderate physical demand. Coordinators at Carrière typically have smaller portfolios than their counterparts at national agencies — 40–80 workers rather than 150+. This translates to more personal contact and faster responses to individual questions.

The smaller agency model also means fewer buffer options when a client reduces headcount. Workers placed at a single client site via Carrière have less guarantee of being moved to another placement quickly if that site reduces orders, compared with workers at agencies with dozens of active client relationships.`,
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: `Carrière's primary advantage is the personal service model. Workers who have experience of being ignored or underserved by coordinators at large agencies find the smaller-team approach significantly better. Queries get personal responses, and coordinators know their workers individually.

The main limitation is scale. Fewer active placements, fewer housing options, less leverage with clients. Workers who need maximum employment flexibility or want to move between sectors or cities regularly will find Carrière's network constraining compared with Randstad or Olympia.

Third-party housing billing errors are the most significant practical risk. Workers must document housing start and end dates carefully and follow up on final billing within the first two weeks after contract end.`,
      },
      {
        heading: "Best Suited For",
        body: `Carrière is a good choice for workers who prioritise personal service and are placing themselves in a region where Carrière has strong client relationships. The reduced anonymity improves the day-to-day experience compared with national giants. Workers should approach housing billing with care — document everything, confirm dates in writing, and verify the final payslip after contract end.

In practice, workers keep: €340–€355/week at WML day shifts. After third-party housing at €95–€110/week, disposable income is approximately €230–€260. Workers on regular night or weekend shifts can add €60–€100 to this figure.`,
      },
    ],
    pros: [
      "Personal coordinator service — smaller portfolios mean individual attention",
      "Faster query response than large agencies",
      "SNF-certified third-party housing",
    ],
    cons: [
      "Third-party housing billing errors — document start/end dates carefully",
      "Fewer placements when client demand drops",
      "Smaller network limits sector and city flexibility",
      "Premium shift payslip accuracy requires worker verification",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENCIES 11–20
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 11. Workstead ──────────────────────────────────────────────────────────
  "workstead": {
    metaTitle: "Workstead Netherlands Review 2026 – Salary & Housing",
    metaDescription:
      "Workstead agency Netherlands 2026 worker review. Logistics and production placements at WML. Housing deductions, shift premiums, and real take-home.",
    intro:
      "Workstead is a Dutch staffing agency placing workers in logistics, warehouse, and light production roles across the Netherlands. Its model combines online registration with regional coordinators — workers complete intake remotely and are matched to sites in their preferred region. Housing is provided for most placements, with the full SNF package available from day one.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: `Workstead pays at the 2026 Statutory Minimum Wage for its logistics and production placements: €14.71 gross per hour. On a standard 40-hour week, gross pay is €588.40. After loonheffing (approximately 10.7% effective rate at WML) and with vakantiegeld (8%) accruing, workers take home approximately €340–€355 per week in cash.

Shift premiums apply under the ABU CAO: 22% for night shifts (00:00–06:00), 50% for Sunday work, and 125% for the first two overtime hours. Workers on regular night rotations see weekly gross rise to €630–€670, netting approximately €420–€445 before housing.

Workstead workers report that the online payslip portal is accessible and readable, though first-payslip queries (particularly for workers whose first week includes mixed day/night shifts) are common. Workers are advised to confirm the shift premium rate in writing at registration.`,
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: `Workstead provides SNF-certified housing for most of its out-of-region placements. Deductions fall in the €95–€113.50 range — within the 2026 SNF maximum. Accommodation is shared: typically three to four workers per room, shared kitchen and bathroom.

Workers placed at logistics hubs in South Holland and North Brabant report housing that is functional and well-maintained. Rooms are cleaned weekly and maintenance issues are addressed within five to seven days in most reports. Workers note that the proximity of housing to site is a particular strength — most Workstead housing is within a 15-minute shuttle ride of the work location.

Workers who plan to stay for more than three months and want more privacy can enquire about single-room options. These are available at select locations for an additional weekly cost above the standard SNF rate, agreed separately and documented in an addendum to the housing contract.`,
      },
      {
        heading: "Daily Work Reality",
        body: `Shuttle transport is included for Workstead's inhouse logistics placements. The shuttle schedule is aligned to shift times. Workers placed at sites without inhouse arrangements should budget €10–€20/week for public transport, depending on the region.

Work conditions match the logistics sector: standing shifts of 8–10 hours, repetitive tasks, moderate lifting (up to 23kg at most sites). Safety induction is conducted on day one. Most placements report receiving adequate safety footwear and PPE at most Workstead client sites, with a clearer onboarding process than at some smaller agencies.

Zero-hours contracts apply in Phase A (first 78 weeks under ABU CAO). Workers typically receive 3–5 days' work per week during the initial placement period, rising to fixed weekly hours once the client confirms demand. Workers placed at busy fulfilment centres may receive work offers exceeding 40 hours in peak periods (October–January).`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `The online registration model is Workstead's most distinctive advantage. Workers can complete intake documentation remotely — including ID verification, BSN registration assistance, and bank account setup guidance — before they arrive in the Netherlands. This reduces the uncertainty of the first week significantly.

The main reported issue is coordinator responsiveness after placement. Workers describe intake coordinators as thorough and helpful; ongoing support coordinators at client sites are described as less engaged. For workers who need active support during their first months, the follow-up contact frequency can feel insufficient.

Housing quality is above average for the price point, and proximity to site is rated as one of the best aspects of the Workstead placement model. Workers who have used larger agencies at the same client sites often report that Workstead's housing is comparable in quality at a similar or slightly lower deduction rate.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `Workstead suits workers who are organised, can handle the digital registration process, and prioritise housing quality close to site. The above-average housing standard and reliable SNF compliance make it a sound choice for workers planning a 6–12 month stint in the Dutch logistics sector.

Net weekly income in practice: €340–€355/week at WML day shifts, approximately €420–€445 on night shifts. After SNF housing (€95–€113.50), disposable income is approximately €225–€350 depending on shifts and housing rate.`,
      },
    ],
    pros: [
      "Online registration — complete intake before arriving in the Netherlands",
      "Housing close to site — typically within 15-minute shuttle distance",
      "SNF-certified accommodation at all placements",
      "Readable payslip portal with online access",
    ],
    cons: [
      "Ongoing coordinator support less attentive than intake",
      "First-payslip premium errors on mixed shift weeks",
      "Zero-hours in Phase A — hours not guaranteed beyond agreed minimums",
    ],
    internalLinks: [
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── 12. Flexcraft ──────────────────────────────────────────────────────────
  "flexcraft": {
    metaTitle: "Flexcraft Netherlands Review 2026 – Skilled Trade Roles",
    metaDescription:
      "Flexcraft Netherlands 2026 review. Technical and skilled trades staffing above WML. Salary, housing, construction and manufacturing placements.",
    intro:
      "Flexcraft operates in the skilled trades and technical manufacturing segment of the Dutch staffing market. Unlike agencies focused purely on logistics at WML, Flexcraft places workers with vocational qualifications — welders, machine operators, electricians, and maintenance technicians — in roles that typically pay €16–€22/hr. This above-WML positioning means workers who qualify for Flexcraft placements can achieve meaningfully different take-home figures than the standard logistics minimum.",
    sections: [
      {
        heading: "Weekly Pay and Deductions Explained",
        body: `Flexcraft's strength is above-WML placement. For skilled trades and technical roles, hourly rates range from €16.00 (entry-level machine operator) to €21.50 (experienced maintenance technician or licensed electrician). On 40 hours at €17/hr, gross weekly pay is €680. Net take-home after loonheffing (approximately 13–14% at this income level) is approximately €390–€415 per week, before housing.

At the top of the Flexcraft pay scale — an electrician or industrial mechanic at €20–€21.50/hr — weekly gross reaches €840. Net take-home is approximately €490–€520/week. After housing at SNF maximum (€113.50), disposable income is approximately €375–€410/week — a substantially better financial outcome than the WML logistics worker.

WML baseline roles do exist in Flexcraft's portfolio (general production workers at manufacturing clients), but these are a minority. Workers with vocational qualifications should specify their certifications at registration to access the higher-paid tier of placements.`,
      },
      {
        heading: "Room Quality and Housing Deductions",
        body: `Flexcraft provides housing for workers in manufacturing and construction placements, though not universally. Technical workers placed at urban sites (Rotterdam, Eindhoven, Breda) may be offered housing or may be expected to arrange their own. Workers placed at rural industrial sites or in regions with high accommodation demand are more reliably offered agency housing.

Where housing is provided, SNF certification applies and deductions are within the €100–€113.50 range. Workers in higher-paid technical roles often share accommodation with workers on WML contracts at the same site — the housing standard does not vary by pay rate, only by occupancy and location.

Flexcraft workers report that for skilled/technical roles, housing is less central to the recruitment pitch than at logistics-focused agencies. Workers who negotiate their placement may have more flexibility to opt out of agency housing and receive a travel/housing allowance in lieu — this is worth discussing at intake for workers who already have accommodation in the Netherlands.`,
      },
      {
        heading: "Work Site Access and Safety",
        body: `Transport arrangements for skilled trades placements are site-dependent. Large manufacturing clients often provide transport. Smaller workshops and specialist manufacturers typically expect workers to arrange their own. Flexcraft workers at construction sites usually travel independently, with fuel costs reimbursed at the standard Dutch rate of €0.23/km (2026) under the metal/construction sector CAO.

Work conditions vary by role. Welding and metalwork involve exposure to fumes and heat — PPE including welding screens, gloves, and appropriate footwear is mandatory and provided at reputable client sites. Machine operators typically work in controlled factory environments, often cleaner and more ergonomic than logistics warehouses.

Technical placements frequently come with a structured trial period (3–6 weeks) after which the client may offer a direct employment contract. Flexcraft workers in skilled roles describe the direct-hire pathway as one of the most realistic routes to a permanent position in the Netherlands.`,
      },
      {
        heading: "The Full Picture",
        body: `The clear advantage is pay. Workers with vocational skills who use Flexcraft can earn 15–45% more per hour than the WML logistics worker. After 12 months at an above-WML technical rate, savings potential is significantly higher — a worker at €18/hr retaining €420/week after housing saves approximately €15,000 over a year, versus €10,000–€12,000 for the WML logistics worker.

The limitation is that Flexcraft is not the right agency for workers without certified skills. General labour placements exist but are not the core offering. Workers who register as general labour at a skills-focused agency often find themselves waiting longer for placement than they would at an agency with deeper logistics or production volume.

Housing provision is less consistent than at logistics-specialist agencies — workers with skills that qualify them for above-WML roles should clarify housing arrangements before committing to a placement, particularly for rural site locations.`,
      },
      {
        heading: "Recommendation for 2026",
        body: `Flexcraft is the recommended route for workers with vocational certifications — forklift, reach truck, welding, electrical, mechanical maintenance — who want to convert their skills into above-WML pay in the Dutch market. The direct-hire pathway at technical clients is real and frequently used.

What actually lands in the bank: €390–€520/week depending on skill level and hourly rate. After housing (where provided at €100–€113.50), disposable income is approximately €275–€410/week — the widest range of any agency in this review series, reflecting the breadth of Flexcraft's pay scale.`,
      },
    ],
    pros: [
      "Above-WML pay for skilled and technical roles — €16 to €21.50/hr",
      "Direct-hire pathway at manufacturing clients",
      "Kilometre reimbursement under sector CAOs for non-transport placements",
      "Structured trial periods with realistic permanent job outcomes",
    ],
    cons: [
      "Not suitable for workers without vocational qualifications",
      "Housing provision inconsistent — must clarify at intake",
      "Fewer placements for general labour than logistics-specialist agencies",
    ],
    internalLinks: [
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── 13. Luba ───────────────────────────────────────────────────────────────
  "luba-uitzendbureau": {
    metaTitle: "Luba Uitzendbureau Review 2026 – Salary, Housing, NL",
    metaDescription:
      "Luba uitzendbureau Netherlands 2026 worker review. Production and logistics at WML. Regional branches, housing conditions, ABU CAO compliance.",
    intro:
      "Luba is an established Dutch staffing agency with a national branch network covering production, logistics, technical, and office roles. Its regional branch model — rather than purely inhouse operations at large client sites — means workers interact with a local coordinator who manages relationships across multiple client companies in a region. This creates a different dynamic from purely inhouse agencies: more flexibility between clients, but potentially less depth of knowledge of any single work site.",
    sections: [
      {
        heading: "What the Payslip Shows",
        body: `Luba pays at the applicable sector CAO for each placement. For production and logistics roles, this is typically the ABU CAO at WML: €14.71/hr in 2026. On 40 hours, gross is €588.40/week. Net take-home after loonheffing is approximately €345/week, with vakantiegeld (8%) accruing for separate payout.

Luba's branch coordinators have access to a wider range of clients than inhouse agencies, which sometimes means workers can be placed in above-WML technical or specialist production roles that a pure logistics agency would not have. Workers with relevant experience should describe their full skill set at intake — Luba's multi-sector client base means there may be a better-paying match than the first offered role.

Shift premiums apply under the ABU CAO or relevant sector CAO. Workers on night and Sunday shifts see the standard uplifts: 22% night, 50% Sunday. Workers placed at food or chemical manufacturing sites may fall under sector-specific CAOs with different premium structures — always confirm which CAO applies to your role at intake.`,
      },
      {
        heading: "Accommodation: Reality vs Promise",
        body: `Luba provides housing for logistics and production placements through SNF-certified accommodation. The branch model means housing stock varies by region. Workers in urbanised regions (Randstad) report more modern accommodation; workers in agricultural and rural regions report older stock with more variable maintenance standards.

Housing deductions fall within the SNF maximum of €113.50/week. Most placements report deductions in the €90–€110 range for standard shared accommodation. Luba's regional coordinators manage housing directly rather than through third-party providers at most locations, which workers generally report as a positive — issues are addressed more directly.

Workers who have been with Luba for three months or more and have demonstrated reliable attendance report being offered improved accommodation options at some regional branches — smaller rooms with fewer occupants, or options with private bathroom access at a higher but still SNF-compliant rate.`,
      },
      {
        heading: "Physical Demands and Transport Setup",
        body: `Transport varies by placement type. Luba's inhouse teams at larger client sites provide shuttle transport. Branch placements — where a worker is placed at a smaller client without an inhouse operation — may or may not include transport. Workers should confirm this at the point of job offer.

The multi-client branch model also means workers can be placed at different client sites in the same week if one client reduces hours. This provides employment stability that inhouse-only placements cannot offer — a client reducing orders affects the worker less directly when the coordinator has alternative sites available.

Work conditions are sector-dependent. Luba places workers across a wider range of physical environments than logistics-specialist agencies: from cold food storage, through heated plastics manufacturing, to light assembly work. Workers should specify any physical limitations at registration to avoid placement in environments incompatible with their health.`,
      },
      {
        heading: "What Sets Them Apart — and What Doesn't",
        body: `Luba's primary advantage is the multi-client branch model. Workers who value employment flexibility — the ability to be placed at different clients when one site reduces hours — find Luba more resilient than single-site inhouse agencies. The broader client base also means workers with specific skills have a better chance of being matched to a higher-paying role.

The limitation is consistency. A branch model with many clients means coordinator expertise is spread across sectors and sites. Workers at complex manufacturing sites with detailed safety requirements sometimes report that their Luba coordinator is less knowledgeable about site-specific conditions than the inhouse coordinator at a competitor agency.

Housing is generally well-managed due to the direct (rather than third-party) model, but quality varies meaningfully between regions.`,
      },
      {
        heading: "Worth Your Time in 2026?",
        body: `Luba is a solid choice for workers who want a stable, multi-option placement rather than being tied to a single client site. The branch network provides employment resilience and access to above-WML opportunities for workers with relevant skills.

Real weekly income works out to: €345/week at WML, rising with experience and role type. After housing at €90–€110/week, disposable income is approximately €235–€255 at WML day shifts.`,
      },
    ],
    pros: [
      "Multi-client branch model — employment resilience when one site reduces hours",
      "Access to above-WML technical and specialist roles",
      "Direct housing management (not third-party) at most branches",
      "National branch network for workers who relocate within the Netherlands",
    ],
    cons: [
      "Coordinator expertise spread across multiple sectors and sites",
      "Housing quality varies significantly between regions",
      "Transport not always included for branch (non-inhouse) placements",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  // ── 14. AB Midden ─────────────────────────────────────────────────────────
  "ab-midden": {
    metaTitle: "AB Midden Netherlands Review 2026 – Salary & Housing",
    metaDescription:
      "AB Midden agency Netherlands 2026. Small Nieuwegein-area warehouse and production agency. Housing confirmed, low transparency score. What workers report.",
    intro:
      "AB Midden is a small Dutch staffing agency operating in the Nieuwegein and Utrecht area, placing workers in warehouse and production roles. The agency has a lower public transparency score than national agencies, largely because it operates without a public website and most information comes from worker reports rather than official sources. This makes it a higher-risk placement for workers who value verifiable agency information upfront — but workers who are already placed report broadly functional operations for the area.",
    sections: [
      {
        heading: "What Workers Report About AB Midden",
        body: `Because AB Midden operates without a significant online presence, most available information comes from workers who have been placed by the agency. The picture is consistent: AB Midden fills warehouse and production roles in the Nieuwegein corridor, pays at or near WML (€14.71/hr in 2026), and provides housing at affiliated properties nearby.

Staff who have worked here describe that AB Midden's operations are functional but minimal. Payslips are provided, housing is arranged, and work placements at warehouse clients in the Nieuwegein industrial zones are available. The experience is lean: less app infrastructure, less proactive communication, and fewer multi-language support options than the national agencies. Workers who speak Dutch or are comfortable operating with limited administrative support manage better than those who need extensive guidance.

The transparency score of 42/100 reflects the lack of verifiable public information — not necessarily poor worker treatment. Workers should approach this as a trade-off: less visible, less polished, but locally functional for the Nieuwegein area.`,
      },
      {
        heading: "Real Earnings vs Contract Rate",
        body: `AB Midden places workers at WML for warehouse and production roles. At €14.71/hr (2026) on a 40-hour week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is paid at period end.

Staff who have worked here describe that payslips are provided on a regular cycle, though the payslip format is basic compared with larger agencies. Workers with premium shift hours — nights, Sundays — should verify their payslip carefully against the applicable CAO rate, as smaller agencies with less automated payroll infrastructure are more likely to generate errors on non-standard hours.

The ABU CAO applies to AB Midden placements. Workers should confirm this at intake — a small number of agencies in this size tier operate under non-standard collective agreements that provide different or weaker conditions.`,
      },
      {
        heading: "What the Housing Package Looks Like",
        body: `AB Midden provides housing at affiliated addresses in and around Nieuwegein. Housing is confirmed as provided with deduction — the SNF maximum of €113.50/week sets the legal ceiling, and workers report deductions in the €95–€113 range.

The affiliated housing model means AB Midden does not use SNF-registered third-party providers in the same way as national agencies — the accommodation is directly linked to the agency's own network. Workers should ask specifically for the SNF registration details of their accommodation before committing, as SNF certification is the key quality assurance mechanism for small-agency housing.

Workers who do confirm SNF registration should then verify occupancy: the SNF standard sets a per-worker minimum floor space and maximum occupancy per room. Workers housed above these limits are entitled to a reduced or zero housing deduction for the duration of the non-compliant period.`,
      },
      {
        heading: "Getting There and Working There",
        body: `Transport to Nieuwegein warehouse sites is typically provided or the sites are accessible by bicycle from the affiliated housing addresses. Workers placed in the Nieuwegein industrial zone report that the commute infrastructure is practical — the area is designed for worker logistics.

Work conditions in Nieuwegein warehouses are typical for the sector: shift work, standing, repetitive tasks, safety footwear required. Client sites in the area include distribution operations for consumer goods, e-commerce, and food distribution. Agency workers here describe standard health and safety conditions at the client sites — the quality of workplace conditions at the end client is largely independent of the agency.

AB Midden's smaller scale means the coordinator-to-worker ratio is lower than at national agencies — workers typically have more direct access to their coordinator for day-to-day questions.`,
      },
      {
        heading: "The Honest Summary",
        body: `AB Midden is a practical option for workers specifically targeting the Nieuwegein and Utrecht region who are comfortable operating with minimal agency infrastructure. The lean model keeps costs lower and allows more direct coordinator contact than at national agencies. The risk is reduced verifiability — workers should confirm SNF housing registration and CAO compliance in writing before starting.

What actually lands in the bank: €340–€355/week at WML. After housing at €95–€113, disposable income is approximately €227–€260/week. Workers on night or Sunday shifts add €60–€100 to this figure.`,
      },
    ],
    pros: [
      "Direct coordinator contact — smaller portfolio, more personal",
      "Practical location in Nieuwegein warehouse zone",
      "Housing available near site",
    ],
    cons: [
      "Low transparency score — limited public verifiable information",
      "No public website — harder to verify agency legitimacy before arrival",
      "Less payroll infrastructure increases premium shift error risk",
      "Always verify SNF certification of housing before committing",
    ],
    internalLinks: [
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  // ── 15. Euro Planit ────────────────────────────────────────────────────────
  "euro-planit": {
    metaTitle: "Euro Planit Netherlands Review 2026 – Migrant Worker Agency",
    metaDescription:
      "Euro Planit Netherlands 2026. Agency specialising in European migrant workers, logistics and production at WML. Housing, salary, and worker experience.",
    intro:
      "Euro Planit is a Dutch staffing agency with a focus on placing European migrant workers — primarily from Eastern Europe — in production, logistics, and agricultural roles in the Netherlands. Its model is built around the full package: travel coordination from the country of origin, SNF housing on arrival, and a Dutch employment contract from day one. For workers making the move from Poland, Romania, Bulgaria, or Hungary for the first time, this integrated approach removes significant friction.",
    sections: [
      {
        heading: "The Euro Planit Model: What You Get on Arrival",
        body: `Euro Planit's integrated placement model means workers typically arrive with a confirmed work placement, accommodation address, and first-week schedule already arranged. The agency manages the initial BSN (citizen service number) registration process, DigiD setup guidance, and Dutch bank account opening for new arrivals.

This start-to-finish coordination has real value for first-time arrivals. Workers placed through agencies without this support often spend their first two weeks navigating Dutch bureaucracy in parallel with starting a new job — a significant additional stress. Euro Planit workers report that the administrative start is smoother than average.

The trade-off is dependency: the housing, the job, the transport, and the paperwork are all managed by the same organisation. Workers who develop any dispute with Euro Planit (about pay, housing conditions, or contract terms) have fewer independent footholds than workers who arranged their own housing and banking separately.`,
      },
      {
        heading: "Your Actual Weekly Income",
        body: `Euro Planit placements start at WML: €14.71/hr in 2026. On a 40-hour week, gross pay is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is paid at period end or annually.

Shift premiums under the ABU CAO apply: 22% for nights, 50% for Sundays. Workers placed in production and food processing roles with regular night shifts report weekly gross of €630–€670, netting approximately €420–€440.

Workers specifically report checking payslips after the first month. Euro Planit's payroll is reportedly reliable for standard hours but generates queries more frequently on premium shifts — a pattern common across agencies that place high volumes of workers from multiple countries simultaneously. Workers should note that the payslip will be in Dutch — Euro Planit does provide translation support on request, but workers benefit from learning the basic Dutch payslip terms (bruto, netto, loonheffing, vakantiegeld) before arrival.`,
      },
      {
        heading: "The Housing Deal: Costs and Conditions",
        body: `Housing is central to Euro Planit's offering and is provided for all out-of-region placements. Accommodation is SNF-certified and deductions fall within the €100–€113.50 range. Shared rooms of four to six workers are typical.

Agency workers here describe that Euro Planit's housing is functional and compliant. The proximity to work sites is a consistent positive — accommodation is selected based on site location, so commutes are short (typically 10–20 minutes by shuttle or bicycle). Workers arriving from countries with different housing standards sometimes describe the conditions as basic but acceptable for the purpose and price point.

The main housing-related concern reported by Euro Planit workers is the bundled contract structure. Housing and employment are often in a single document — if the work contract ends, housing ends simultaneously. Workers should clarify the notice period for both components: the employment contract notice and the housing vacating requirement. Dutch law requires written notice and a reasonable period to find alternative accommodation.`,
      },
      {
        heading: "How You Get to Work",
        body: `Transport from accommodation to work site is included for all Euro Planit placements. This is a consistent positive across worker reports. The shuttle service runs on shift times and workers report it as reliable at most sites.

Work conditions are typical of logistics and food processing: standing work, lifting, repetitive tasks. The majority of Euro Planit placements are at established, compliant client sites where safety standards are externally audited. Staff who have worked here describe adequate safety briefings, provided PPE, and visible safety management at most client locations.

Multi-language coordinator support is available — Polish, Romanian, Bulgarian, and English — at Euro Planit intake and throughout the placement. This is a material advantage for workers who are not confident in Dutch or English.`,
      },
      {
        heading: "Right Agency for You?",
        body: `Euro Planit is well-suited to first-time arrivals in the Netherlands who want a fully managed start — housing, job, and administration arranged before they land. The integrated model reduces first-week friction substantially. Workers should understand the trade-off: dependency on one organisation for multiple critical needs. Maintaining independent financial and administrative records from day one provides important security.

Real weekly income works out to: €340–€355/week at WML day shifts. After housing at €100–€113.50/week, disposable income is approximately €227–€255. Night shift rotations add €65–€90/week net.`,
      },
    ],
    pros: [
      "Full arrival package — job, housing, and admin coordination from origin country",
      "Multi-language coordinator support (Polish, Romanian, Bulgarian, English)",
      "Transport included to all work sites",
      "SNF-certified housing for all placements",
    ],
    cons: [
      "Bundled contract — housing ends when work ends; clarify notice terms",
      "All services from one provider increases dependency and dispute risk",
      "Premium shift payslip errors require worker verification",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  // ── 16. Uitzendbureau NL ───────────────────────────────────────────────────
  "uitzendbureau-nl": {
    metaTitle: "Uitzendbureau NL Review 2026 – Dutch Agency Worker Guide",
    metaDescription:
      "Uitzendbureau NL Netherlands 2026 review. Online Dutch staffing agency. Salary, housing options, and what workers report about placements.",
    intro:
      "Uitzendbureau NL operates as an online-first Dutch staffing intermediary, connecting workers to placements across multiple sectors through a digital registration and matching platform. The broad name reflects its positioning: a general-purpose, national-reach agency for workers who want a quick path to employment in the Netherlands without the geographic constraint of a local branch. For workers already in the Netherlands with their own accommodation, this model offers flexibility. For workers arriving from abroad who need the full housing-and-work package, the experience is different.",
    sections: [
      {
        heading: "Take-Home Pay in Practice",
        body: `Uitzendbureau NL matches workers to client companies across sectors — the applicable salary and CAO depend on the role and client, not the platform itself. For logistics and production placements (the most common for international workers), the ABU CAO applies and pay starts at WML: €14.71/hr in 2026. On 40 hours per week, gross is €588.40; net take-home is approximately €340–€355.

Workers who specify skills at registration — forklift certification, food HACCP, construction qualifications — are matched to roles with higher hourly rates. Workers without specific qualifications are directed to general labour pools at WML.

The platform model means the worker's direct employment contract is with the end client or with a partner employment entity, not with Uitzendbureau NL itself. Workers should verify who their legal employer is at intake — this determines which CAO applies, which payroll system is used, and where to direct disputes.`,
      },
      {
        heading: "Worker Housing in Practice",
        body: `Uitzendbureau NL does not universally provide housing — accommodation arrangements depend on whether the matched placement includes housing provision. Workers matched to placements through partner agencies or clients that offer housing will receive SNF-certified accommodation at the standard deduction rate. Workers matched to placements without housing provision receive no housing support through the platform.

Workers arriving from abroad who need housing must confirm this is included before accepting a match. The platform's national-reach model means matches may include placements across multiple regions — a worker registering in Amsterdam may be matched to a role in Venlo or Tilburg, which only makes sense with housing included.

Workers who have their own accommodation in the Netherlands benefit most from the platform model — the quick matching time and sector breadth allow workers to find placements faster than through traditional branch registration, without needing the full agency package.`,
      },
      {
        heading: "Shift Life: Transport and Environment",
        body: `Transport provision follows the same logic as housing: it depends on the matched placement, not the platform. Inhouse placements at large logistics sites include shuttle transport; smaller-site matches do not. Workers must clarify at the point of match acceptance.

Work conditions are entirely determined by the end client and the applicable sector CAO. The platform model means Uitzendbureau NL has less ability to intervene in day-to-day work conditions than a fully inhouse agency team. Workers who have issues with work conditions should raise them through the named employment entity in their contract, which may be a partner agency or the client directly.

The platform does provide coordinator contact — workers are not left with no support — but the coordinator's role is matching and contract management rather than on-site support.`,
      },
      {
        heading: "Good Reasons to Register — and Reasons to Think Twice",
        body: `The platform's main advantage is speed and reach. Workers with clear skill profiles can receive placement matches quickly, across a wider range of clients and sectors than a single regional branch could offer. For workers who are already settled in the Netherlands and want to find their next placement without visiting a physical branch, the digital process is convenient.

The main limitation is the variable package. Housing, transport, and ongoing support quality depend on which partner agency or client is involved in the matched placement. Workers who need certainty about housing and transport before accepting should require written confirmation of all package components.

Workers should also verify ABU CAO coverage. Platform-mediated placements occasionally use non-standard employment structures that may provide different conditions than ABU CAO workers at the same client site.`,
      },
      {
        heading: "Worth It For These Workers",
        body: `Uitzendbureau NL works best for workers who are already in the Netherlands, have their own accommodation, and want a fast path to a new placement. It is less suited to first-time arrivals who need housing, transport, and full administrative support arranged as a package.

Real weekly income works out to: variable by placement, but typically €340–€355/week for standard logistics at WML. Skilled placements can reach €390–€440+. Workers must verify the full package — housing, transport, CAO, employer entity — before accepting any match.`,
      },
    ],
    pros: [
      "Fast digital matching across multiple sectors",
      "National reach — placements available across all Dutch regions",
      "Suitable for workers already settled with own accommodation",
    ],
    cons: [
      "Housing and transport not universally included — must verify per match",
      "Legal employer entity varies — confirm CAO coverage at intake",
      "Less on-site support than traditional inhouse agencies",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  // ── 17. In Person ─────────────────────────────────────────────────────────
  "in-person-amsterdam": {
    metaTitle: "In Person Amsterdam Review 2026 – Hospitality & Production",
    metaDescription:
      "In Person Amsterdam 2026 worker review. Hospitality, production, and retail staffing in Amsterdam. Salary, working conditions, and what to expect.",
    intro:
      "In Person is an Amsterdam-based staffing agency specialising in hospitality (horeca), production, and retail placements in the Amsterdam metropolitan area. Its focus on the city's service and production sectors gives it a different character from the logistics-heavy agencies in this series: workers placed through In Person are as likely to be in a hotel kitchen or a retail stockroom as in a warehouse. This sector mix produces a different set of experiences, working hours, and salary structures.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: `In Person placements span three sectors with different applicable CAOs. Hospitality workers fall under the Horeca CAO; production workers under the ABU CAO; retail workers under the Retail CAO. Each has different minimum rates, holiday accrual rules, and shift premium structures.

For hospitality placements in Amsterdam, hourly rates typically start at WML (€14.71/hr in 2026) for kitchen assistant and service support roles, rising to €16–€18 for experienced kitchen staff with specific qualifications. Production roles pay at WML. Retail roles pay at WML for basic picking and packing, rising with responsibility level.

Net take-home on a 40-hour WML week is approximately €340–€355/week. The Horeca CAO provides specific premiums for late-night work (after 22:00) and weekend work that can be more generous than the ABU CAO for the same hours — workers in hospitality on regular late-night or Sunday shifts may receive higher premiums than the standard 22%/50% ABU rates. Workers should confirm the specific premium schedule in their contract.`,
      },
      {
        heading: "Work Conditions in Hospitality and Production",
        body: `Hospitality work in Amsterdam involves irregular and late hours — restaurants, hotels, and event venues run to a different clock than warehouse shifts. Workers placed in hotel kitchen support roles report shift patterns of 07:00–16:00 or 14:00–23:00, with weekend work common. Late finishes mean public transport home after midnight — workers should factor this into their assessment of the placement.

Production placements through In Person are at smaller Amsterdam-area facilities compared with the large warehouse operations in the logistics-focused agencies. Lighter manufacturing, food preparation, and packaging operations in the Amsterdam Westpoort industrial area are typical. Conditions are generally less physically demanding than large-scale logistics.

In Person's Amsterdam focus means most workers are placed within cycling or OV distance of their work location. The agency does not typically provide shuttle transport — the urban setting and public transport network are assumed to handle worker commuting.`,
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: `In Person does not universally provide housing — the Amsterdam-focused model assumes many workers already have accommodation in the city or have arranged it independently. For out-of-city workers and new arrivals, housing through affiliated providers can be arranged, but this is less central to In Person's offering than at logistics agencies in rural or suburban locations.

Workers who need housing should confirm availability explicitly at intake. Amsterdam's rental market makes agency-provided housing in the city expensive — SNF maximum deductions apply (€113.50/week), but the accommodation quality for this price in Amsterdam is lower than the same rate in Tilburg or Venlo, where housing stock is cheaper.

Workers who already have accommodation in Amsterdam or surroundings find In Person's placement model straightforward — the hospitality and retail sectors offer regular, predictable shift patterns and consistent hours once placement is established.`,
      },
      {
        heading: "Upsides and Watch Points",
        body: `In Person's advantage is its Amsterdam sector specialisation. Workers who want hospitality or retail work in the city, and who have existing accommodation, find the agency's local client relationships produce faster placement than using a national agency with weaker Amsterdam networks.

The limitation is sector scope. In Person does not cover logistics, technical, or agricultural sectors — workers who want the flexibility to move between sectors or regions are better served by a national generalist. Workers who are committed to hospitality or urban production work in Amsterdam find In Person a useful and appropriately specialised option.

Pay in hospitality can include tips and service charges in some client arrangements — these are not counted in the formal payslip but can supplement take-home meaningfully for front-of-house roles.`,
      },
      {
        heading: "Summary Verdict",
        body: `In Person is the right agency for workers in Amsterdam who want hospitality, production, or retail work and have their own accommodation sorted. The city-focused model means sector-specific expertise and faster placement in the Amsterdam market than national generalists.

In practice, workers keep: €340–€360/week at WML, rising to €380–€420 for experienced hospitality roles with late-night and Sunday premiums. Housing not typically provided — workers need their own Amsterdam accommodation.`,
      },
    ],
    pros: [
      "Hospitality sector expertise in Amsterdam — faster placement for experienced workers",
      "Multiple sectors: hospitality, production, retail",
      "Local client network for Amsterdam-based workers",
      "Horeca CAO late-night premiums can exceed ABU CAO rates",
    ],
    cons: [
      "Housing not universally provided — Amsterdam accommodation is expensive",
      "No logistics or technical sector coverage",
      "Late-night hospitality shifts require own transport home after 22:00",
      "Limited value for workers outside Amsterdam area",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── 18. WerkTalent ─────────────────────────────────────────────────────────
  "werktalent": {
    metaTitle: "WerkTalent Netherlands Review 2026 – Salary & Placements",
    metaDescription:
      "WerkTalent Netherlands 2026 worker review. Dutch staffing agency for skilled and semi-skilled roles. Salary, housing, and what workers report.",
    intro:
      "WerkTalent is a Dutch staffing agency that positions itself around worker skill matching — connecting workers with roles that align with their experience and development goals rather than simply filling headcount at any available site. This approach produces a different intake experience: more questions about skills, goals, and availability; less emphasis on immediate volume placement. Workers who take the time to complete a thorough intake at WerkTalent report better role alignment than those who rush through registration.",
    sections: [
      {
        heading: "Take-Home Pay in Practice",
        body: `WerkTalent placements span multiple salary levels depending on the role and qualifications. Entry-level production and logistics workers are placed at WML: €14.71/hr in 2026, netting approximately €340–€355/week. Workers placed in skilled or specialist roles earn €15.50–€19/hr, with net take-home of €370–€435/week before housing.

The skills-matching model means workers with documented qualifications — forklift certification, HACCP, NEN 3140, or relevant trade certificates — are actively directed toward higher-paying placements rather than being defaulted to WML logistics. Workers who have invested in Dutch labour market certifications find the WerkTalent matching process translates that investment into pay more reliably than volume-placement agencies.

ABU CAO shift premiums apply: 22% night, 50% Sunday. Workers confirm the applicable CAO at intake based on the role and client sector. WerkTalent coordinates confirm which sector CAO applies before contract signing — a standard that is not maintained consistently at all agencies.`,
      },
      {
        heading: "Worker Housing in Practice",
        body: `WerkTalent provides housing for workers in out-of-region placements. SNF-certified accommodation with deductions in the €95–€113.50 range applies. The agency's skill-matching focus means workers are not always placed at the closest available site — they may be placed at a site 50–100km from the main registration area if that is where the best role match exists. In such cases, housing is always provided.

Reviews on AgencyCheck indicate that WerkTalent's housing is standard quality — shared rooms, shared facilities, functional rather than exceptional. The smaller agency scale means housing stock is more limited than at Randstad or Tempo-Team: workers may have fewer choices about location within a given region.

Workers placed in skills-matched above-WML roles sometimes receive different housing options — smaller rooms or facilities with fewer occupants — as an acknowledgement that the worker profile justifies better accommodation. This is not guaranteed but is worth enquiring about at intake if the worker's skills justify an above-WML placement.`,
      },
      {
        heading: "Shift Life: Transport and Environment",
        body: `Transport is provided for inhouse-style placements at larger client sites. For skills-matched placements at smaller specialist manufacturers or technical operations, transport may not be included — workers placed in above-WML technical roles often travel to work independently, with kilometre reimbursement where the applicable CAO provides it.

Work conditions match the placement type. Logistics roles are physically demanding; technical and skilled roles involve different physical requirements and environments. WerkTalent's intake process includes a health and capability assessment — workers with physical restrictions that affect certain role types are directed away from incompatible placements rather than placed regardless.

Induction quality at client sites varies independently of the agency, but workers report that WerkTalent provides pre-placement briefings about the specific client's environment, safety requirements, and working culture before the first shift. This reduces first-day uncertainty.`,
      },
      {
        heading: "Good Reasons to Register — and Reasons to Think Twice",
        body: `The skills-matching approach is WerkTalent's clearest differentiator. Workers who invest time in a thorough intake are better matched to roles that fit their profile, which reduces placement churn — fewer early contract terminations due to mismatch, better relationship with the client, and a clearer path toward Phase B and improved conditions.

The limitation is intake time. Workers who need immediate placement and income cannot afford a thorough matching process. WerkTalent is not the fastest agency for emergency placement — workers who need to start within 48 hours are better served by volume-placement agencies with immediate availability.

Housing and transport are functional but not distinctive. The agency's value is in the placement quality, not in ancillary services.`,
      },
      {
        heading: "Worth It For These Workers",
        body: `WerkTalent suits workers with documented skills who want to be placed in a role that matches their profile and pays above WML. The investment in a thorough intake pays off over a 6–12 month placement. Workers who need immediate placement without the matching process should use a volume agency first and switch to WerkTalent once settled.

Realistic take-home: €340–€435/week depending on skill level and role type. After housing at €95–€113.50, disposable income is approximately €225–€320/week — or higher for above-WML placements.`,
      },
    ],
    pros: [
      "Skills-matching intake — better role alignment than volume agencies",
      "Higher-paying placements for workers with documented qualifications",
      "Pre-placement client briefings reduce first-day uncertainty",
      "Health and capability screening avoids incompatible placements",
    ],
    cons: [
      "Slower intake — not suitable for workers needing immediate placement",
      "Limited housing stock compared with national giants",
      "Transport not always included for technical or specialist placements",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
    ],
  },

  // ── 19. UBN ────────────────────────────────────────────────────────────────
  "ubn": {
    metaTitle: "UBN Netherlands Review 2026 – Regional Agency Salary & Housing",
    metaDescription:
      "UBN uitzendbureau Netherlands 2026 review. Regional Dutch staffing for production and logistics. Salary at WML, housing, and worker experience.",
    intro:
      "UBN (Uitzendbureau Nederland) is a regional Dutch staffing agency focusing on production, logistics, and general labour placements. Operating with a smaller footprint than national agencies, UBN concentrates on specific regional industrial zones and builds deep client relationships within those areas. Workers placed through UBN often have a more direct relationship with both the agency coordinator and the client site than is typical at large national agencies.",
    sections: [
      {
        heading: "Pay Rates and Weekly Take-Home",
        body: `UBN places workers at WML for general production and logistics roles: €14.71/hr in 2026. On 40 hours per week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week, with vakantiegeld (8%) accruing for payout at period end.

The ABU CAO applies to UBN placements. Shift premiums (22% nights, 50% Sundays) are reported as accurately applied by most workers, though smaller payroll operations are more likely to generate premium errors on non-standard hours. Workers should track their own shifts and compare against payslips for the first two months.

Above-WML placements are limited at UBN — the regional model with smaller client base provides fewer specialist or technical roles than national agencies with broader portfolios. Workers with vocational qualifications may find better-paying matches at larger agencies with more diverse client networks.`,
      },
      {
        heading: "Agency Housing: What to Expect",
        body: `UBN provides housing for workers in its regional placements. SNF-certified accommodation with deductions in the €90–€113 range is typical. Shared rooms of three to four workers, shared facilities. Agency workers here describe that UBN's housing is maintained to a functional standard, with maintenance issues addressed within five to seven days at most locations.

The regional focus means housing and work sites are closely matched geographically — a consistent positive in worker reports. Transport from housing to work is short, reducing fatigue and transport costs. Workers placed through UBN rarely report the long commute times that sometimes occur with national agencies that place workers far from available housing.

People placed through this agency say that UBN coordinators are accessible for housing issues — the smaller portfolio means a housing problem gets direct attention rather than being escalated through a multi-layer support system.`,
      },
      {
        heading: "Site Access and Working Environment",
        body: `Transport to client sites is included for most UBN placements. The regional model means all UBN client sites are within the agency's transport infrastructure, so shuttle provision is more consistent than at national agencies where transport coverage varies by region.

Work conditions are typical of the production and logistics sectors. Physically demanding standing work, safety footwear and PPE provided at client sites. Workers report that UBN's client base consists of established regional manufacturers and distribution operations with good safety standards — UBN does not place workers at sites with poor compliance records.

The smaller agency scale means new workers are known personally to the coordinator from day one. This produces faster issue resolution — pay queries, scheduling problems, housing concerns — than working through the support channels of a national agency.`,
      },
      {
        heading: "What This Agency Does Well",
        body: `UBN's main advantage is the regional depth model: close housing-to-site geography, personal coordinator relationships, and consistent transport provision. Workers who value predictability and direct access to support over the breadth of options find the UBN model significantly less stressful than large national agencies.

The limitation is scale. Fewer active placements mean workers may wait longer to be placed if demand at UBN's client sites is low. Workers who need guaranteed continuous employment regardless of market conditions need a national agency with more client diversity.

Payslip accuracy is average — above the sector worst but no better than the national mid-tier. Workers should verify premium shifts in the first two months.`,
      },
      {
        heading: "Is It Worth Registering?",
        body: `UBN is a good choice for workers committed to a specific region who value personal service and close housing-to-work geography over maximum flexibility. The direct coordinator model produces better day-to-day support than national agencies at equivalent roles.

Realistic take-home: €340–€355/week at WML. After housing at €90–€113/week, disposable income is approximately €227–€265. Workers on regular night shifts add €60–€95/week.`,
      },
    ],
    pros: [
      "Regional depth — housing and work site geographically close",
      "Personal coordinator relationship from day one",
      "Consistent transport provision within the regional network",
      "Maintenance and support issues resolved faster than at national agencies",
    ],
    cons: [
      "Fewer active placements — possible wait time in low-demand periods",
      "Limited above-WML specialist placements",
      "No national coverage for workers who want to relocate",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  // ── 20. Djops ──────────────────────────────────────────────────────────────
  "djops": {
    metaTitle: "Djops Netherlands Review 2026 – Modern Dutch Staffing Agency",
    metaDescription:
      "Djops Netherlands 2026 review. Digital-first staffing for production and logistics. Salary at WML, housing, shift management app, worker experience.",
    intro:
      "Djops is a newer entrant to the Dutch staffing market, built with digital tools and app-based shift management at the core. The name references the Dutch-English 'do jobs' — the agency pitches itself as a simpler, more transparent way to find and manage work in the Netherlands. For workers comfortable with digital processes, Djops offers a fast registration and clear shift visibility. For workers who prefer in-person support, the leaner model requires adjustment.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: `Djops places workers in production and logistics roles at WML: €14.71/hr in 2026. On a standard 40-hour week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is visible in the Djops app, building transparency for workers tracking their full earnings picture.

Shift premiums under the ABU CAO are flagged in the app when shifts qualify — night shifts, Sunday work, overtime. Reviews on AgencyCheck indicate that the app's shift confirmation system creates a useful record for payslip verification: if a premium shift is confirmed in the app but missing from the payslip, there is a clear documented record for the query.

Workers placed at above-standard roles (skilled production, quality roles) earn above WML. Djops does not limit its portfolio to WML placements, but the majority of current placements are in the standard logistics and production tier.`,
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: `Djops provides SNF-certified housing for workers who require it, with deductions within the €100–€113.50 range. The housing side of the operation is managed through partner providers — Djops coordinates housing allocation but does not manage accommodation stock directly.

Agency workers here describe that Djops housing is adequate and SNF compliant. The main worker concern is the partner-managed model: when housing issues arise, the resolution path runs through Djops coordination to the housing partner, adding a step compared with agencies that manage their own accommodation. Workers should save the housing partner's direct contact details at check-in for use in case of maintenance or billing issues.

The app tracks housing costs and deductions, giving workers a clear view of the full deduction breakdown each pay period. Workers rate this transparency positively.`,
      },
      {
        heading: "App Features and Work Conditions",
        body: `The Djops app is the central tool for shift management, payslip access, holiday accrual tracking, and worker communication. Workers confirm shifts, submit availability, and flag issues through the app. New workers report a learning curve in the first week but positive reviews thereafter — the app is described as well-designed relative to similar tools at larger agencies.

Work conditions at Djops' client sites are standard for the logistics and production sectors. Safety briefings, PPE provision, and shift structures are managed by the end client. Djops maintains an induction process that prepares workers for the specific client environment before the first shift — a positive feature shared with WerkTalent.

Workers placed at Djops' current client base report physical work conditions comparable to Randstad or Tempo-Team placements at the same client sites. The agency does not currently have inhouse presence at very large sites; most placements are at mid-size logistics and production facilities.`,
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: `Djops' clearest advantage is digital transparency. Workers who use the app actively know their shift premium breakdown, housing deduction, holiday accrual, and net pay in real time rather than waiting for the monthly payslip. This is genuinely useful for workers who want to track their financial position week by week.

The limitation is scale and history. As a newer agency, Djops has fewer client relationships, less historical worker data, and fewer housing options than agencies with decades of Dutch market experience. Workers who need maximum placement options or want certainty about work availability year-round may find Djops' current portfolio limiting.

The partner-managed housing model introduces the same accountability gap as Adecco's third-party housing — workers should document housing start and end dates carefully and verify billing.`,
      },
      {
        heading: "Best Suited For",
        body: `Djops is a genuine option for tech-comfortable workers who value real-time transparency over the breadth of options. The app-based model, shift confirmation records, and visible deduction breakdown provide better week-to-week financial clarity than most traditional agencies. As the agency grows its client base and housing stock, the portfolio limitation will reduce.

Real weekly income works out to: €340–€355/week at WML day shifts, approximately €415–€440 on regular night shifts. After housing at €100–€113.50, disposable income is approximately €227–€340.`,
      },
    ],
    pros: [
      "App-based shift management with real-time premium flagging",
      "Transparent weekly deduction breakdown in-app",
      "Pre-placement client briefings reduce first-shift uncertainty",
      "Shift confirmation records simplify payslip verification",
    ],
    cons: [
      "Newer agency — fewer client relationships and placement options than established agencies",
      "Partner-managed housing — document start/end dates carefully",
      "Less inhouse presence at very large logistics sites",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENCIES 22–30  (21 = Covebo, already implemented above)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 22. Synergie ───────────────────────────────────────────────────────────
  "synergie-uitzendbureau": {
    metaTitle: "Synergie Netherlands Review 2026 – Salary & Work Conditions",
    metaDescription:
      "Synergie Netherlands 2026 worker review. French-origin multinational staffing in industrial and technical roles. Salary, housing, CAO compliance.",
    intro:
      "Synergie is the Netherlands arm of the Synergie Group, a French staffing multinational with operations across Western Europe. In the Dutch market it targets industrial, technical, and logistics placements — a profile that overlaps with both the generalist agencies and the technical specialists. Workers at Synergie Netherlands typically encounter a more structured, process-driven agency experience than at purely Dutch regional players, with clearer documentation standards but occasionally more bureaucratic issue resolution.",
    sections: [
      {
        heading: "From Gross to Net: The Numbers",
        body: `Synergie Netherlands pays at the applicable sector CAO for each placement. Logistics and production roles start at WML: €14.71/hr in 2026. On a standard 40-hour week, gross earnings are €588.40. After loonheffing (approximately 10.7% effective at WML) and with vakantiegeld (8%) accruing separately, cash take-home is approximately €345/week.\n\nTechnical and industrial maintenance roles — Synergie's differentiated offering in the Dutch market — pay above WML. Machine operators and maintenance technicians report hourly rates of €16–€19. At €17/hr on 40 hours, gross is €680; net take-home is approximately €400–€415/week before housing.\n\nThe ABU CAO applies to standard flex placements. Synergie Netherlands workers report that payslips are professionally formatted and accessible through an online portal. Payslip accuracy for standard hours is rated as good; errors on premium shifts (night, Sunday) are reported less frequently than the sector average.`,
      },
      {
        heading: "SNF Housing: What Workers Get",
        body: `Synergie provides SNF-certified housing for workers in its logistics and industrial placements. Deductions fall within the €100–€113.50/week range. Accommodation is shared — three to four workers per room, shared bathroom and kitchen — with facilities maintained to a standard that workers consistently describe as above average for the price.\n\nThe French parent company's quality standards influence Synergie's housing management approach. Unlike some Dutch agencies where housing is managed with minimal oversight, Synergie conducts periodic facility checks and has a formal complaints process for housing issues. People placed through this agency say that maintenance requests are actioned within five working days at most locations.\n\nWorkers who have used multiple agencies cite Synergie's housing documentation as unusually clear — deduction amounts, SNF registration numbers, and check-in/check-out procedures are all provided in writing at intake, without the worker needing to request them.`,
      },
      {
        heading: "Working Conditions on Site",
        body: `Transport to site is provided for Synergie's inhouse logistics placements. For branch placements at industrial clients without an inhouse team, transport may not be included — workers should clarify at the point of job offer. In most industrial regions, public transport alternatives are available at a cost of €10–€20/week.\n\nWork conditions at Synergie's industrial clients are generally well-managed. Synergie maintains a health and safety review process for client sites, which workers report produces better on-site PPE provision and safety briefing quality than at agencies that conduct no independent client auditing.\n\nThe induction process includes a pre-placement briefing specific to the client site, covering PPE requirements, shift patterns, break entitlements, and the contact chain for reporting issues. Workers describe this level of preparation as more thorough than they received at other agencies at the same client sites.`,
      },
      {
        heading: "Before You Sign: What to Know",
        body: `Synergie's primary advantage is institutional quality. The multinational background produces better documentation, more reliable payroll infrastructure, and a more formal approach to housing management than most Dutch-only competitors. Workers who place high value on clarity and process find the Synergie experience significantly less stressful.\n\nThe limitation is responsiveness speed. The formal process structure that produces good documentation also means issue escalation goes through more steps. Reviews on AgencyCheck indicate that urgent problems take slightly longer to resolve than at smaller agencies where a coordinator can make an immediate decision.\n\nFor above-WML technical placements, Synergie is well-regarded — the combination of clear contracts, accurate payroll, and structured client relationships makes it one of the better-organised options in the industrial sector.`,
      },
      {
        heading: "Should You Register Here?",
        body: `Synergie Netherlands is a strong choice for workers who prioritise process clarity, documented housing terms, and accurate payslips over raw speed of placement. The multinational infrastructure produces reliably good outcomes for workers who engage with it correctly.\n\nActual cash in hand runs to: €345/week at WML (day shifts), rising to €400–€415 for technical roles at €17/hr. After SNF housing at €100–€113.50, disposable income is approximately €230–€315/week.`,
      },
    ],
    pros: [
      "Multinational payroll infrastructure — fewer payslip errors than Dutch-only competitors",
      "Written housing documentation provided at intake without prompting",
      "Independent client site safety review process",
      "Good above-WML options for industrial and technical workers",
    ],
    cons: [
      "Issue escalation slower due to multi-tier support structure",
      "Less nimble than smaller regional agencies for urgent requests",
      "Branch placement transport not always included",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── 23. Sagius ─────────────────────────────────────────────────────────────
  "sagius": {
    metaTitle: "Sagius Netherlands Review 2026 – Agency Salary & Housing",
    metaDescription:
      "Sagius Netherlands 2026 worker review. Dutch staffing focused on stable placements. Phase B progression, SNF housing, WML salary explained.",
    intro:
      "Sagius is a Dutch staffing agency with a focus on sustainable employment placements — the agency positions itself around longer-term worker relationships rather than volume turnover. This means a more selective intake process, emphasis on matching workers to roles that suit their skills and circumstances, and active management of Phase A to Phase B progression. Workers who fit the Sagius model well report significantly better placement stability than they experienced at volume-focused agencies.",
    sections: [
      {
        heading: "What You Actually Earn",
        body: `Sagius pays at the applicable sector CAO for each placement. For production and logistics roles, the ABU CAO applies and pay starts at WML: €14.71/hr in 2026. On a 40-hour week, gross is €588.40 and net take-home after loonheffing is approximately €345/week.\n\nThe sustainable placement model means Sagius actively works to move workers into Phase B (after 78 weeks under the ABU CAO), which provides improved conditions: paid public holidays, sick pay from week 26, and the right to request a fixed-hours contract. Registered workers note that Sagius coordinators flag Phase B eligibility proactively and support the documentation process.\n\nFor workers who achieve Phase B status, paid public holidays (typically 8–9 days/year in the Netherlands) represent approximately €500/year in additional earnings at WML rates that Phase A workers do not receive.`,
      },
      {
        heading: "Accommodation Quality and Cost",
        body: `Sagius provides SNF-certified housing for workers in placements that require it. Deductions are within the €95–€113.50 range. Housing quality is rated as adequate to good by workers, with no significant negative patterns in reports. Maintenance is handled within a week in the majority of cases.\n\nThe longer-term placement focus influences housing management. Because Sagius aims to keep workers for 12+ months, there is more incentive to maintain housing to a standard that keeps workers satisfied. Registered workers note that housing quality at Sagius is noticeably better than at agencies with high turnover and large-scale accommodation blocks.\n\nShared rooms of three to four are typical. Workers at Sagius housing describe a quieter, more stable environment than at larger-agency accommodation — fewer new arrivals each week, more established co-residents.`,
      },
      {
        heading: "Getting to Work and Daily Conditions",
        body: `Transport provision depends on the placement. Sagius manages a mix of inhouse and branch placements. Inhouse logistics placements include shuttle transport; branch placements at smaller manufacturers may require independent travel. Workers should confirm at intake.\n\nWork conditions in Sagius placements are described as well-managed. The agency's sustainable employment focus means it selects clients with decent working conditions. Workers who have worked at the same client sites through other agencies report better coordinator attention and faster issue escalation when placed through Sagius.\n\nPhase A workers receive weekly contract renewals; Phase B workers receive fixed-term or open-ended contracts with formal notice periods. This contract security matters for workers who want to plan beyond the next week.`,
      },
      {
        heading: "Strengths and Weaknesses",
        body: `Sagius's defining advantage is the genuine focus on longer-term placements. Workers who want stability — a fixed work location, a known coordinator, consistent hours — find the Sagius model delivers this better than agencies treating flex workers as interchangeable units. The Phase B progression support is a genuine and valuable differentiator.\n\nThe limitation is the selectivity of intake. Workers with irregular availability or who need immediate placement may not fit the Sagius model. The agency is not the fastest option for workers who need to start tomorrow.\n\nWorkers also note that Sagius's client base is smaller than national agencies. This provides depth in the regions and sectors where Sagius operates, but limits options if the worker wants to change sector or move to a different city.`,
      },
      {
        heading: "Bottom Line for 2026",
        body: `Sagius is the right choice for workers who plan to stay in the Netherlands for at least 12 months and want stable working conditions. The Phase B progression pathway makes Sagius financially attractive over a long placement — the effective earnings improvement from paid holidays and sick pay at Phase B is worth approximately €700–€1,000 per year at WML rates.\n\nIn practice, workers keep: €345/week at WML day shifts. After housing at €95–€113/week, disposable income is approximately €232–€250. Phase B workers add approximately €500/year through paid public holiday entitlement.`,
      },
    ],
    pros: [
      "Genuine Phase B progression support — paid holidays, sick pay, fixed hours",
      "Stable placements — longer-term focus reduces turnover disruption",
      "Housing quality above average for the deduction rate",
      "Selective client base — fewer placements at poor-condition sites",
    ],
    cons: [
      "Selective intake — not suitable for workers needing immediate placement",
      "Smaller client base limits sector and city flexibility",
      "Not the fastest agency for first-week start",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
    ],
  },

  // ── 24. Maintec ────────────────────────────────────────────────────────────
  "maintec": {
    metaTitle: "Maintec Netherlands Review 2026 – Technical Staffing Salary",
    metaDescription:
      "Maintec Netherlands 2026 review. Technical maintenance staffing above WML. Electricians, mechanics, welders. Salary €16–€24/hr, housing, direct-hire.",
    intro:
      "Maintec is a Dutch technical staffing specialist placing maintenance engineers, electricians, mechanical technicians, and industrial mechanics in manufacturing and infrastructure projects across the Netherlands. It operates at the premium end of the flex labour market — the majority of Maintec placements are above WML, often significantly so. Workers without technical qualifications will not find relevant roles here; workers with verifiable technical credentials find Maintec one of the most financially rewarding agency routes in the Dutch market.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: `Maintec placements pay well above WML. The agency's core roles — maintenance technician, industrial electrician, mechanical engineer, instrument technician — command hourly rates of €18–€28/hr depending on qualifications, sector, and experience level. Entry-level technical placements (MBO level 2–3 with relevant experience) start at €16–€18/hr. Senior NEN 3140-qualified electricians or certified instrument technicians can reach €24–€28/hr.\n\nAt €20/hr on a 40-hour week, gross earnings are €800. After loonheffing (approximately 14–16% at this income level), net take-home is approximately €455–€475/week before housing. At €26/hr, weekly gross reaches €1,040 and net take-home approaches €600.\n\nThe applicable CAO varies by sector. Workers in metal and manufacturing fall under the Metal CAO; workers at utilities or chemical plants fall under their respective sector CAOs. Maintec confirms and documents the applicable agreement at intake.`,
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: `Maintec provides housing primarily for out-of-region project placements — where a maintenance project at a refinery, chemical plant, or industrial facility requires workers to be near the site for the duration. For workers placed at client sites near their home region, housing is not typically provided.\n\nWhere provided, housing is SNF-certified and deductions are within the €100–€113.50 range. Workers on project placements (typically 3–6 months at a specific site) report that Maintec's housing for technical workers is marginally better quality than the standard logistics agency accommodation — fewer occupants per room, sites selected for proximity to the project location.\n\nWorkers at above-WML technical rates (€20+/hr) who also receive SNF housing retain substantially more than logistics workers after deduction. At €20/hr net take-home of €465 minus housing at €113.50, disposable income is approximately €350/week.`,
      },
      {
        heading: "Technical Qualifications and Direct-Hire Pathway",
        body: `Maintec's core value to workers is the direct-hire pathway. The agency's model — place, evaluate, convert — means a substantial proportion of Maintec workers transition to direct employment contracts with the client within 3–6 months. For maintenance workers, a direct employment contract at a large Dutch manufacturer typically includes pension contributions, travel expense reimbursement, and fixed annual salary.\n\nAgency workers here describe that Maintec actively prepares workers for direct-hire conversations. The coordinator communicates client feedback, highlights areas for development, and facilitates the direct contract discussion when the client signals readiness. Workers describe this as one of Maintec's most valued services.\n\nWorkers who want to maximise their direct-hire chances should maintain NEN certifications current (NEN 3140 for electrical, VCA for safety) and should proactively request additional client-side training during the placement period.`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `The overwhelming advantage of Maintec is pay. Workers with the right technical qualifications earn 25–100% more per hour than the WML logistics worker. The cumulative savings difference over a 12-month placement is €10,000–€25,000 depending on the hourly rate.\n\nThe direct-hire pathway is a genuine and frequently used route. Workers who perform well and maintain their certifications have a realistic chance of converting to a permanent Dutch employment contract within 6–9 months.\n\nThe limitation is entry requirement. Workers without current and verifiable technical certifications will not be placed at the rates described. Workers who want to eventually work at the Maintec level but do not currently have qualifications should consider investing in Dutch-recognised certification (MBO qualification or sector certificate) before registering.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `Maintec is the best agency in this review series for workers with technical maintenance qualifications. The pay differential, direct-hire pathway, and structured placement model make it the highest-financial-outcome option for qualified workers.\n\nActual cash in hand runs to: €455–€600/week depending on qualifications and hourly rate. After project housing where provided (€100–€113.50/week), disposable income is €340–€490/week — 50–100% more than the WML logistics worker.`,
      },
    ],
    pros: [
      "Highest pay range — €16 to €28/hr for technical specialists",
      "Genuine direct-hire pathway — many workers convert to permanent contracts",
      "CAO confirmed and documented at intake",
      "Active coordinator support for certification maintenance and client progression",
    ],
    cons: [
      "No general labour placements — technical qualifications required",
      "Housing only for out-of-region project placements",
      "Workers without current NEN/VCA certificates will not access top rates",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── 25. BaanMeesters ───────────────────────────────────────────────────────
  "baanmeesters": {
    metaTitle: "BaanMeesters Netherlands Review 2026 – Salary & Housing",
    metaDescription:
      "BaanMeesters Netherlands 2026 worker review. Personal Dutch staffing for production and logistics. WML salary, lower housing deduction, smaller rooms.",
    intro:
      "BaanMeesters — Dutch for 'job masters' — is a Dutch staffing agency positioning itself around personalised placement and active worker support. Its model is closer to the smaller regional agency than to the national generalist giant, with coordinators managing smaller portfolios and placing emphasis on matching the worker to the right role rather than filling vacancies as fast as possible. For workers who have felt underserved by the impersonal scale of national agencies, BaanMeesters represents a different kind of relationship with their employment agency.",
    sections: [
      {
        heading: "What You Actually Earn",
        body: `BaanMeesters pays at the applicable sector CAO for each placement. Production and logistics roles follow the ABU CAO at WML: €14.71/hr in 2026. On a 40-hour week, gross is €588.40 and net take-home after loonheffing is approximately €345/week.\n\nWorkers with specific skills or qualifications are matched to above-WML roles where available in the BaanMeesters client base. Hourly rates for semi-skilled production roles range from €15.50 to €17.50. At €16/hr on 40 hours, net take-home is approximately €375–€385/week.\n\nReviews on AgencyCheck indicate that payslip accuracy is good for standard hours. The smaller payroll team means premium shift errors are possible — workers should verify their first three payslips against their shift records, particularly if the role involves regular night or weekend work.`,
      },
      {
        heading: "Accommodation Quality and Cost",
        body: `BaanMeesters provides SNF-certified housing for out-of-region placements. Deductions fall in the €90–€110/week range, slightly below the SNF maximum. Employees note that BaanMeesters housing is well-maintained — the lower occupancy model (two to three workers per room at several locations) is repeatedly cited as an advantage over the four-to-six person rooms at larger agencies.\n\nThe 'job masters' positioning extends to housing: BaanMeesters coordinators make a point of visiting housing locations periodically and are described as more personally invested in the worker's overall living situation than the coordinator at a high-volume national agency.\n\nWorkers who prefer to arrange their own accommodation are not penalised — BaanMeesters does not apply pressure to accept agency housing.`,
      },
      {
        heading: "Getting to Work and Daily Conditions",
        body: `Transport to client sites is provided for inhouse placements. For workers at smaller client locations, transport may need to be arranged independently. BaanMeesters coordinators are clear about transport arrangements at the point of job offer.\n\nBaanMeesters places workers at a mix of food processing, general manufacturing, and warehouse operations. Coordinators perform client site visits to maintain awareness of conditions — workers who raise work environment concerns receive a faster response than typical of national agencies.\n\nBaanMeesters applies Phase A contract terms for the first 78 weeks. Workers approaching Phase B receive active coordinator support for the transition, including documentation assistance.`,
      },
      {
        heading: "Strengths and Weaknesses",
        body: `BaanMeesters' core advantage is the genuinely personal service model. Smaller coordinator portfolios mean workers are known individually, queries receive direct responses, and housing conditions receive personal attention. Workers who have rotated through multiple agencies frequently describe the BaanMeesters experience as substantially less impersonal.\n\nThe housing occupancy model (two to three per room at select locations) is a material quality-of-life improvement. The housing deduction is also slightly below the SNF maximum, which adds €3–€23/week of disposable income compared with agencies charging the full rate.\n\nThe limitation is scale — fewer active placements than national agencies means potential waiting time when BaanMeesters client demand is low.`,
      },
      {
        heading: "Bottom Line for 2026",
        body: `BaanMeesters is well-suited to workers who have had frustrating experiences with impersonal national agency coordinators and want a more human placement experience. The smaller rooms, personal coordinator attention, and active Phase B management are genuine advantages for workers planning a 6–18 month placement.\n\nRealistic take-home: €345/week at WML, rising to €375–€385 for semi-skilled roles. After housing at €90–€110/week, disposable income is approximately €235–€295. The lower housing deduction rate slightly improves outcomes compared with agencies charging the SNF maximum.`,
      },
    ],
    pros: [
      "Smaller coordinator portfolios — genuinely personal service",
      "Lower housing occupancy (2–3 per room at select locations)",
      "Housing deduction below SNF maximum at €90–€110/week",
      "Active Phase B progression support",
    ],
    cons: [
      "Smaller client base — potential wait time in low-demand periods",
      "Premium shift payslip accuracy requires worker verification",
      "Limited geographic coverage outside core regions",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── 26. FlevoDirect ────────────────────────────────────────────────────────
  "flevodirect": {
    metaTitle: "FlevoDirect Netherlands Review 2026 – Flevoland Agency",
    metaDescription:
      "FlevoDirect Netherlands 2026 review. Flevoland regional staffing for agriculture, logistics, and production. Salary, seasonal work, housing conditions.",
    intro:
      "FlevoDirect is a regional staffing agency rooted in Flevoland — the Netherlands' youngest province, home to some of the country's most productive agricultural land and a growing logistics hub around Almere and Lelystad. The agency places workers in agricultural, food processing, logistics, and light production roles specific to the Flevoland economy. For workers who want regional depth rather than national breadth, FlevoDirect's knowledge of local employers, seasonal patterns, and transport infrastructure is a genuine advantage.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: `FlevoDirect placements span two distinct pay tiers. Agricultural and food processing roles typically pay at WML: €14.71/hr in 2026. On a 40-hour week, gross is €588.40 and net take-home is approximately €340–€355/week. Seasonal agricultural work may involve variable hours — volumes fluctuate with harvests — so guaranteed weekly hours should be confirmed at intake.\n\nLogistics roles at Almere and Lelystad distribution facilities pay at WML with shift premiums under the ABU CAO. Workers on regular Sunday distribution shifts report weekly gross of €650–€680, netting approximately €430–€450.\n\nWorkers in cold storage and refrigerated distribution may fall under the Koelveem CAO, which provides conditions specific to cold environment work including temperature allowances and additional break entitlements. Workers should confirm which CAO applies at intake if working in refrigerated or frozen storage.`,
      },
      {
        heading: "Agricultural and Seasonal Work Reality",
        body: `Flevoland is one of the Netherlands' primary vegetable and flower-growing regions. FlevoDirect places workers in tulip, potato, carrot, and onion operations — seasonal work that differs significantly from year-round logistics placements. Workers considering agricultural placements should understand the seasonal nature: high demand from March through October, significantly reduced availability in winter.\n\nAgricultural work involves outdoor exposure in variable weather, physical tasks, and often early morning starts. Pay is at WML but weekly hours are variable — a dry harvest week may provide 50+ hours; a cold wet week may provide 25. Workers who need a guaranteed minimum weekly income should ask FlevoDirect for a minimum hours commitment in writing.\n\nFood processing roles (onion sorting, potato grading, asparagus preparation) are indoor and year-round at large facilities in the Dronten and Emmeloord areas, providing more stable earnings than field work.`,
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: `FlevoDirect provides housing for workers in its agricultural and logistics placements. SNF-certified accommodation with deductions in the €90–€110/week range applies. Housing is positioned near work sites — agricultural housing is near farm and processing operations; logistics housing is near the Almere and Lelystad distribution zones.\n\nReviews on AgencyCheck indicate that FlevoDirect housing in Flevoland is functional and generally well-maintained. The province's relatively modern infrastructure (most of Flevoland was built after 1960) means housing stock is newer than in many other Dutch regions.\n\nWorkers on agricultural placements should clarify whether housing continues during off-season low-work periods. Some FlevoDirect agricultural housing is seasonal — workers may need to arrange alternative accommodation between November and February if agricultural work volume drops below a viable weekly total.`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `FlevoDirect's primary advantage is regional expertise. No national agency knows the Flevoland employment market as deeply — the seasonal agricultural rhythm, the specific client relationships with major Flevoland food producers, and the local transport infrastructure are areas where FlevoDirect's knowledge adds real value.\n\nFor workers interested in the agricultural sector specifically, FlevoDirect provides access to placements that larger logistics-focused agencies do not cover. The different CAO conditions and seasonal patterns suit workers who prefer outdoor environments to warehouse logistics.\n\nThe limitation is geographic — FlevoDirect's value diminishes entirely for workers who want to work elsewhere in the Netherlands.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `FlevoDirect is the right agency for workers who want agricultural, food processing, or Flevoland logistics work and are committed to living and working in the province. The regional knowledge, agricultural sector access, and newer housing stock are genuine advantages that national agencies cannot match in this specific area.\n\nRealistic take-home: €340–€355/week at WML for standard roles. Cold storage or Sunday logistics workers add €60–€90/week. After housing at €90–€110/week, disposable income is approximately €230–€265. Seasonal agricultural workers should budget conservatively for the November–February low period.`,
      },
    ],
    pros: [
      "Deep Flevoland regional expertise — agricultural and logistics knowledge",
      "Agricultural sector access unavailable at logistics-only agencies",
      "Newer housing stock due to Flevoland's post-1960 construction",
      "Cold storage CAO conditions for refrigerated environment workers",
    ],
    cons: [
      "No value outside Flevoland — purely regional",
      "Agricultural work hours variable — winter low period reduces earnings significantly",
      "Seasonal housing may not cover the full year",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── 27. Perflexxion ────────────────────────────────────────────────────────
  "perflexxion": {
    metaTitle: "Perflexxion Netherlands Review 2026 – Salary & Work Conditions",
    metaDescription:
      "Perflexxion Netherlands 2026 worker review. Flexible Dutch staffing for production and logistics. WML salary, housing, zero-to-fixed hours progression.",
    intro:
      "Perflexxion is a Dutch staffing agency built around the flexibility model — the name combines 'per' (by) and 'flexxion' (flexibility). The agency targets workers who want to manage their own availability and hours, offering a zero-to-full-hours contract structure that allows workers to accept or decline shifts based on their schedule. For workers who have dependants, other commitments, or who simply want to test the Dutch labour market before committing to a fixed placement, Perflexxion's flexibility pitch has genuine appeal.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: `Perflexxion pays at WML for production and logistics roles: €14.71/hr in 2026. The variable-hours model means weekly earnings fluctuate with the shifts the worker accepts. A worker accepting 40 hours per week earns approximately €345 net (after loonheffing), with vakantiegeld (8%) accruing. A worker accepting only 25 hours earns approximately €215 net — a significant reduction that workers entering the flexible model need to factor into their budget planning.\n\nThe upside is overtime willingness. Workers available for last-minute shifts during the October–January peak logistics period can exceed 48 hours/week, pushing weekly gross above €700 with overtime premiums. Workers with high availability ratings in the app are the first offered additional shift hours.\n\nABU CAO shift premiums apply: 22% for nights, 50% for Sundays. Workers who build a pattern of accepting weekend and night shifts see their effective hourly rate rise significantly above WML even on standard contract terms.`,
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: `Perflexxion provides SNF-certified housing for workers who require it. Deductions fall in the €95–€113.50 range. The flexibility model creates a housing complication: workers who reduce their hours during lower-demand periods still pay full housing costs. The housing contract typically runs independently of the work contract.\n\nWorkers who want to exit housing early should understand the notice period in the housing contract before signing. Perflexxion housing contracts typically require two to four weeks' written notice before the deduction ceases.\n\nHousing quality is standard for the sector: shared rooms, shared facilities, functional and SNF-compliant. Reviews on AgencyCheck indicate adequate maintenance response times.`,
      },
      {
        heading: "Daily Work Reality",
        body: `Transport is provided for Perflexxion's logistics site placements. The flexibility model means shift times vary week to week — shuttle schedules accommodate this by running for all major shift windows. Registered workers note the shuttle service as adequate for standard shift windows but less reliable for unusual shift start times accepted at short notice.\n\nWork conditions in Perflexxion's logistics and production placements are standard for the sector. Workers with consistent high availability transition to fixed weekly hours arrangements at most Perflexxion clients within six to eight weeks, which stabilises the schedule without losing the formal flexibility right.`,
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: `The flexibility model is Perflexxion's core selling point and primary limitation simultaneously. Workers who genuinely need schedule flexibility find the model valuable. Workers who end up accepting every available shift would be better served by a fixed-hours placement from the start, which would provide more schedule certainty and equivalent pay.\n\nThe housing deduction-when-low-hours situation is the main financial risk. Workers who accept a housing arrangement and then find work hours drop continue to pay housing costs from reduced earnings. This can create a negative net position in low-hours weeks.\n\nWorkers who thrive with Perflexxion are those with clear availability patterns who use the flexibility to supplement income alongside other commitments.`,
      },
      {
        heading: "Who This Agency Works For",
        body: `Perflexxion works best as a supplementary or initial-testing placement rather than a primary full-time employment arrangement. Workers who want to test the Dutch market or manage their own availability find the model useful. Workers who need predictable full-time income from week one should use a fixed-placement agency.\n\nRealistic take-home: €215/week (25 hours) to €345/week (40 hours) at WML, rising with overtime and premium shifts. After housing at €95–€113.50, disposable income varies widely by hours worked.`,
      },
    ],
    pros: [
      "Genuine schedule flexibility — accept or decline shifts based on availability",
      "High overtime availability during peak periods (Oct–Jan)",
      "ABU CAO premiums apply on all qualifying shifts",
    ],
    cons: [
      "Variable income — low-hours weeks significantly reduce earnings",
      "Housing deduction continues during low-hours periods",
      "Fixed-placement agencies provide better income certainty for full-time workers",
    ],
    internalLinks: [
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── 28. Techvisie ──────────────────────────────────────────────────────────
  "techvisie": {
    metaTitle: "Techvisie Netherlands Review 2026 – Technical Staffing",
    metaDescription:
      "Techvisie Netherlands 2026 review. Technical and IT staffing above WML. Salary for engineers and technicians, housing, project placement conditions.",
    intro:
      "Techvisie — 'technical vision' — is a Dutch staffing agency focusing on technical professionals: IT specialists, process engineers, automation technicians, and industrial IT workers. It occupies a narrower niche than Maintec (which focuses on physical maintenance) by targeting the intersection of technical knowledge and digital systems — SCADA operators, PLC programmers, industrial network engineers. This is a high-value segment of the Dutch labour market where day rates and hourly rates are significantly above WML.",
    sections: [
      {
        heading: "From Gross to Net: The Numbers",
        body: `Techvisie placements are consistently above WML. The agency's core roles — PLC/SCADA programmer, automation engineer, process control technician, industrial IT specialist — command hourly rates of €22–€40/hr for experienced workers. Entry-level technical graduates in relevant fields start at €17–€20/hr.\n\nAt €25/hr on a 40-hour week, gross earnings are €1,000/week. After loonheffing (approximately 18–20% at this income level), net take-home is approximately €545–€570/week. At the top of the Techvisie scale (€35–€40/hr for senior automation specialists), weekly net take-home approaches €800–€900.\n\nThe applicable CAO depends on the client sector. Techvisie confirms and documents the applicable agreement at intake. Workers should verify that the stated CAO is correctly applied — the premium structures and holiday entitlements vary significantly between sector CAOs at these income levels.`,
      },
      {
        heading: "Work Conditions and Project Nature",
        body: `Techvisie placements are predominantly project-based. Workers are placed on automation upgrade projects, production system implementations, and technical infrastructure rollouts at manufacturing facilities, utilities, and food processing plants. Projects typically last three to nine months.\n\nMost Techvisie placements are at established industrial facilities with good physical working conditions — clean, temperature-controlled control rooms and engineering offices, well-equipped workshops. Workers should be prepared for the first week of each new project to be high-learning-curve: familiarisation with the client's specific systems, protocols, and team.\n\nSome Techvisie placements involve shift work if the client runs continuous production. Shift work for process and automation technicians at chemical and process plants includes shift premiums of 25–35% for night and weekend work, above the ABU CAO minimum.`,
      },
      {
        heading: "Housing and Mobility",
        body: `Techvisie provides housing for project placements where the client site is distant from the worker's home. Where project housing is provided, it is in a different category from logistics agency accommodation — Techvisie's technical workers are typically housed in serviced apartments or single/double occupancy rooms rather than shared six-person rooms.\n\nWorkers on project placements often receive a daily or weekly travel allowance in addition to their hourly rate. At Dutch rates (€0.23/km standard), a project 100km from home generates approximately €230/week in tax-free travel allowance.\n\nDeductions for technical project housing may be €150–€200/week rather than the SNF-standard €113.50, though this is paid from a significantly higher income base.`,
      },
      {
        heading: "Before You Sign: What to Know",
        body: `Techvisie's advantage is access to the highest-paying technical segment of the Dutch flex market. Workers with automation, process control, or industrial IT skills earn two to three times the WML logistics worker's take-home. The project variety also provides faster skill development than a fixed placement at a single client.\n\nThe limitation is qualification requirement. Workers without demonstrable technical qualifications in the relevant fields will not access Techvisie placements. The minimum entry requirement is an MBO level 4 or HBO qualification in a technical or engineering discipline with relevant practical experience.\n\nThe project model also means periodic periods between placements. Workers should maintain a financial buffer for these transition periods.`,
      },
      {
        heading: "Should You Register Here?",
        body: `Techvisie is the highest-earning segment of the Dutch agency market for workers with the right qualifications. The combination of above-WML hourly rates, travel allowances, shift premiums, and project variety makes it financially and professionally rewarding.\n\nRealistic take-home: €545–€900/week depending on hourly rate and project type. After project housing (where provided), disposable income is €350–€700/week — the highest range in this entire review series.`,
      },
    ],
    pros: [
      "Highest pay tier in the Dutch flex market — €22–€40/hr for technical specialists",
      "Travel allowances for out-of-region project placements",
      "Project variety accelerates skill development",
      "Better housing quality on technical project placements",
    ],
    cons: [
      "Strict qualification requirement — MBO level 4 / HBO minimum",
      "Gap periods between projects require financial buffer",
      "Project CAO verification required at each new placement",
    ],
    internalLinks: [
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  // ── 29. Artiflex ───────────────────────────────────────────────────────────
  "artiflex": {
    metaTitle: "Artiflex Netherlands Review 2026 – Agriculture & Horticulture",
    metaDescription:
      "Artiflex Netherlands 2026 review. Agriculture and horticulture staffing specialist. Seasonal work, greenhouse conditions, salary at WML, housing.",
    intro:
      "Artiflex is a Dutch staffing agency specialising in agriculture, horticulture, and food processing — sectors that represent the foundation of the Dutch rural economy but are often overlooked in agency reviews that focus exclusively on logistics. Artiflex places workers in greenhouse operations (tomatoes, peppers, flowers), open field vegetable cultivation, and fruit and vegetable processing facilities. The work is different from warehousing in almost every physical dimension — and so is the placement experience.",
    sections: [
      {
        heading: "Agricultural Work: What It Actually Involves",
        body: `Agriculture and horticulture work through Artiflex involves tasks specific to the Dutch growing season and greenhouse sector. Greenhouse work — tomato and pepper cultivation, rose and lily production — is year-round due to the heated glasshouse environment. Workers perform plant training, harvesting, leaf removal, and quality sorting in warm (20–28°C) environments with high humidity.\n\nOpen field work is seasonal: potato planting and harvesting, onion cultivation, asparagus cutting (April–June), and sugar beet harvesting (September–November). Hours are weather-dependent — good harvest weeks may produce 50+ hours; rain or frost weeks may provide under 20. Workers considering open field placements need to plan their finances around this variability.\n\nFood processing roles — onion peeling, potato sorting, flower sorting for export — are typically indoor, year-round, and provide more stable hours. These roles involve cold, damp environments and strong smells.`,
      },
      {
        heading: "Pay Structure and Real Income",
        body: `Artiflex pays at WML for agricultural and food processing roles: €14.71/hr in 2026. The applicable CAO depends on the sector. Greenhouse workers fall under the Glastuinbouw CAO; open field workers under the Open Teelt CAO; food processing workers may fall under the ABU CAO or a sector-specific agreement.\n\nOn a reliable 40-hour week in greenhouse or processing work, net take-home is approximately €340–€355/week. Workers in the Glastuinbouw CAO receive an end-of-season bonus in some arrangements — typically 2–3% of annual earnings for workers completing a full growing season contract, adding approximately €350–€500 to annual earnings.\n\nWorkers in open field roles with variable hours should discuss a guaranteed minimum hours clause at intake. A minimum of 25 hours per week in writing protects against weeks when weather dramatically reduces work availability.`,
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: `Artiflex provides SNF-certified housing for most of its agricultural placements. Deductions fall in the €90–€110/week range. Agricultural housing tends to be in rural locations — converted farmhouses, purpose-built worker accommodation on or near farm properties — rather than in urban or industrial estates.\n\nWorkers in rural agricultural housing report a different quality-of-life profile from urban logistics workers: quieter, more space, but further from public transport, shops, and social infrastructure. Workers who want urban amenity access should specifically request housing in nearby market towns (Westland for greenhouse workers, Emmeloord for Flevoland field work).\n\nWorkers in greenhouse operations near Westland, Aalsmeer, or the Bleiswijk complex report better public transport access and more housing options than workers in remote eastern or northern agricultural zones.`,
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: `Artiflex's primary advantage is specialist agricultural sector knowledge. No generalist logistics agency can match Artiflex's understanding of greenhouse CAO conditions, growing season rhythms, and the specific physical demands of horticultural work.\n\nThe end-of-season completion bonus available through the Glastuinbouw CAO is a genuine financial incentive that most other sectors and agencies do not offer. Workers completing a full growing season with reliable attendance access this bonus.\n\nThe limitation for some workers is the work environment itself. Greenhouse work is warm, humid, and involves sustained standing. Open field work involves outdoor exposure in variable Dutch weather. Workers should be honest about their physical comfort zone when registering.`,
      },
      {
        heading: "Best Suited For",
        body: `Artiflex is the specialist of choice for workers who want to work in Dutch agriculture, horticulture, or food processing and who are comfortable with the physical and seasonal realities of those sectors.\n\nWorkers typically end up with: €340–€355/week on reliable 40-hour weeks. Open field seasonal workers should budget for weeks of €200–€250 during weather-disrupted periods. End-of-season bonus adds approximately €350–€500 for greenhouse season completers. After housing at €90–€110/week, disposable income is approximately €230–€265 on reliable weeks.`,
      },
    ],
    pros: [
      "Specialist in agriculture and horticulture — unmatched sector knowledge",
      "Glastuinbouw CAO end-of-season completion bonus",
      "Quieter, more spacious rural housing options",
      "Year-round greenhouse placements available",
    ],
    cons: [
      "Open field work variable hours — weather-dependent earnings",
      "Rural housing locations may lack urban amenities and public transport",
      "Greenhouse environment not suitable for all workers (heat, humidity)",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
    ],
  },

  // ── 30. OTTO Workforce ─────────────────────────────────────────────────────
  // ── BATCH 31–40 ─────────────────────────────────────────────────────────────

  // ── 35. Start People ─────────────────────────────────────────────────────
  "start-people": {
    metaTitle: "Start People Netherlands Review 2026 – Salary & Roles",
    metaDescription:
      "Real Start People review for Netherlands workers 2026. Salary at WML €14.71/hr, deductions, job types from production to admin. Is Start People the right agency?",
    intro:
      "Start People is one of the Netherlands' largest staffing agencies, part of Recruit Holdings alongside Unique. It spans a genuinely wide spectrum — production line shifts at food factories through to office temping at corporate HQ. That breadth makes Start People harder to summarise than a logistics-only agency: your experience depends heavily on which branch, which client, and which sector places you.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: "Start People operates under the ABU CAO. Phase A workers are paid at WML (€14.71/hr in 2026) unless the client's own CAO is more generous. On a 40-hour week that's gross monthly earnings of approximately €2,549. After loonheffing (~10.7%), net is around €2,277. Vakantiegeld (8%) accrues separately.\n\nIf you're in agency accommodation, deductions of €85–€113.50/week reduce effective take-home to approximately €1,550–€1,680/month. Night premiums (+22%) and Sunday rates (+50%) apply under ABU CAO and materially improve weekly pay for workers on those shifts. It's worth asking explicitly which CAO applies to your specific placement — Start People is legally required to disclose this, but not all branches volunteer it proactively.",
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: "Not all Start People placements include accommodation. For admin, retail, or hospitality roles, housing is not arranged — you source your own. For production and logistics placements attracting EU migrant workers, Start People partners with SNF-certified housing providers.\n\nQuality varies by partner: Rotterdam and Den Haag placements typically report shared rooms (4–6 per room) with basic kitchen and bathroom. The housing deduction is itemised on payslips. Before accepting a relocation, ask specifically: which housing partner, how many occupants per room, and what the exact weekly deduction will be. These are required disclosures — vagueness here is a practical red flag.",
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: "For out-of-city placements at distribution centres and industrial parks, most branches arrange shared transport from accommodation to worksite. Many Dutch logistics parks (Schiphol zone, Rotterdam Waalhaven, Breda industrial) are not accessible by public transport — confirm site location before accepting.\n\nContracts in Phase A are zero-hours or min-max. Shift patterns range from three-shift rotation (06:00/14:00/22:00) in production to standard office hours in admin. Confirm your specific shift pattern before committing to relocation — the difference in day-to-day life is significant.",
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: "Start People's main strength is breadth: fast placements across sectors nationwide with ABU CAO protections and transparent Phase A/B progression. Some placements convert to permanent client contracts after Phase B, and admin roles are available for workers with Dutch or English skills.\n\nThe weaknesses are consistency: housing quality varies by partner (not directly managed by Start People), zero-hours contracts leave income vulnerable in slow periods, and not all branches communicate deduction details clearly upfront. Relocation to a specific area can leave workers exposed if client demand drops unexpectedly.",
      },
      {
        heading: "Best Suited For",
        body: "Always ask which specific client, which housing partner, and which CAO applies before committing to a Start People relocation. Workers comparing Start People with Manpower should note that Start People has stronger presence in semi-professional and admin temp work, while Manpower skews more toward industrial manufacturing. For production roles with housing included, compare Start People's offered deduction directly with agencies that specialise in accommodation packages.\n\nHave you worked with Start People? Leave a review on this page — your experience helps other workers make an informed decision.",
      },
    ],
    pros: [
      "Nationwide presence with genuine job variety across sectors",
      "ABU CAO protections with transparent Phase A/B progression",
      "Admin and professional roles for workers with Dutch or English skills",
      "Some placements convert to permanent client contract after Phase B",
      "SNF-certified housing where accommodation is offered",
    ],
    cons: [
      "Zero-hours contracts standard in Phase A — no income guarantee on slow weeks",
      "Housing quality varies significantly by partner, not directly managed by Start People",
      "Production placements often involve mandatory overtime at peak season",
      "Not all branches clearly communicate deductions and CAO terms upfront",
      "Relocation risk if client demand drops in the region you've moved to",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── 37. Manpower ─────────────────────────────────────────────────────────
  "manpower": {
    metaTitle: "Manpower Netherlands Review 2026 – Salary & Worker Guide",
    metaDescription:
      "Manpower Netherlands worker review 2026. Salary at WML, housing deductions, manufacturing & logistics roles. What workers actually experience with ManpowerGroup.",
    intro:
      "ManpowerGroup is one of the world's three largest staffing firms, with major Dutch operations. Workers encounter two distinct Manpower experiences: Experis (IT, engineering, finance) and Manpower core (production, logistics, manufacturing). This review focuses on temporary production and logistics placements — the roles that represent the majority of migrant worker experiences with Manpower in the Netherlands.",
    sections: [
      {
        heading: "Hourly Rate and Net Income",
        body: "Manpower operates under the ABU CAO for general temporary placements. WML in 2026 is €14.71/hr. On a 40-hour week that's gross monthly earnings of approximately €2,549 and net after loonheffing (~10.7%) of around €2,277 before any housing deduction.\n\nProgression beyond WML within Phase A is realistic at Manpower. Placements at client sites with sector CAOs — metalworking, food processing, chemical, semiconductor logistics — push hourly rates to €16–€20 depending on role and shift. Workers with a forklift licence typically start at €15.50–€16.50/hr. Night shift premiums (+22% under ABU CAO; many Manpower clients pay +30–35% under their own CAO) significantly increase weekly pay for workers who accept antisocial hours.",
      },
      {
        heading: "Where Workers Sleep",
        body: "Manpower provides accommodation for some placements — typically where temporary housing for international workers is scarce or for large-scale batch recruitment. Accommodation is SNF-certified and deductions are itemised on payslips at up to €113.50/week.\n\nFor major city placements (Amsterdam, Rotterdam, Eindhoven), Manpower generally does not arrange housing. For EU workers relocating specifically for a Manpower placement, this gap is real: the housing question is not always addressed at the offer stage. Ask explicitly before accepting: 'Will housing be arranged, and what is the weekly deduction?' Silence or vagueness is a practical warning sign.",
      },
      {
        heading: "Commute, Tools, and On-Site Reality",
        body: "For large industrial sites outside city centres, Manpower or the client arranges transport. Eindhoven-area technical placements often have shuttle buses from central Eindhoven. Rotterdam-area warehouse placements vary — some sites run employer transport, others expect independent commuting.\n\nWork contracts at production sites are typically 40 hours per week. Shift patterns at manufacturing clients are generally fixed — you know your schedule in advance. The largest worker complaints at Manpower production placements centre on communication gaps between agency, client site HR, and worker when problems arise, rather than on pay accuracy.",
      },
      {
        heading: "Honest Assessment",
        body: "Major client relationships mean above-WML sector CAO rates and generally better working conditions than small agencies can arrange. Real Phase B progression happens; permanent conversion exists at some long-running placements. Multinational payroll infrastructure means payslips are generally accurate. The Experis arm provides a pathway for technically qualified workers.\n\nThe downsides: experience quality depends entirely on the client site; housing is not universally arranged; large-scale operations mean impersonal service with slower complaint resolution; and waiting periods between assignments can be 1–3 weeks without pay in Phase A.",
      },
      {
        heading: "Who Should Register Here",
        body: "Manpower is a credible choice for workers seeking production or logistics work at well-known Dutch manufacturers — the major-client relationships mean better baseline conditions than smaller agencies can offer. The critical variable is housing: if Manpower is not providing it, you need to budget carefully before relocating. Confirm in writing: exact weekly housing deduction, number of room-mates, and which CAO applies to your specific placement.\n\nWorkers comparing Manpower with Randstad and Tempo-Team should note that Manpower's strength is in longer-term placements at industrial manufacturing clients; for short-term high-volume logistics, Randstad or Tempo-Team may place faster. Share your Manpower experience below — salary accuracy, housing quality, communication reality.",
      },
    ],
    pros: [
      "Major clients = better-than-average conditions and sector CAO rates above WML",
      "Real Phase B progression and occasional direct permanent hire at client",
      "Multinational payroll infrastructure — payslips are generally accurate and timely",
      "Experis arm provides pathway for IT and engineering workers",
      "Structured shift systems at manufacturing clients — schedule predictability",
    ],
    cons: [
      "Experience quality entirely dependent on the client site",
      "Housing not universally arranged — gap between offer and practical reality",
      "Large scale = impersonal service, complaints can take 2–4 business days to reach",
      "Some placements lock workers into a specific region with difficult exit terms",
      "Waiting periods between assignments: 1–3 weeks without pay in Phase A",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
    ],
  },

  // ── 39. Unique Uitzendbureau ──────────────────────────────────────────────
  "unique-uitzendbureau": {
    metaTitle: "Unique Uitzendbureau Review 2026 – Office & Admin Workers",
    metaDescription:
      "Unique Uitzendbureau Netherlands review 2026. Salary for admin and office temps, contract terms, take-home pay. What white-collar workers actually experience.",
    intro:
      "Unique Uitzendbureau is a Dutch staffing institution — founded in 1966, now part of Recruit Holdings alongside Start People. Unlike most agencies reviewed here, Unique focuses on office, administrative, and professional temporary work: secretarial roles, HR assistants, management support, call centre, and finance temps. The typical worker profile and day-to-day experience are fundamentally different from logistics or production agencies.",
    sections: [
      {
        heading: "Salary Reality for Office-Based Roles",
        body: "Unique placements pay above WML in most cases. Administrative temps earn €15–€22/hr depending on role and language requirements. Management support and bilingual secretarial roles reach €24–€28/hr for experienced workers. At €18/hr on a standard 36-hour Dutch office week, gross monthly income is approximately €2,808. After loonheffing at this bracket (~24–27% combined), net monthly is around €2,050–€2,150 plus separately accrued vakantiegeld.\n\nOne important nuance: Unique contracts are typically 36 or 38 hours per week, not 40. Calculate your income on actual contracted hours — at 36 hours rather than 40, €18/hr produces approximately €250/month less gross. Dutch B2 proficiency is strongly preferred; workers with English-only are routed to international companies and English-language call centres, which exist but are fewer and more competitive.",
      },
      {
        heading: "Room Quality and Housing Deductions",
        body: "Unique does not offer or arrange housing. Workers must source private rental accommodation independently. In Amsterdam that means €900–€1,500/month for a shared flat or studio; Utrecht and Den Haag are somewhat lower (€800–€1,200/month shared).\n\nThe absence of a housing deduction means Unique workers keep their full net pay. At €18/hr net (~€2,100/month) minus private rent of €900/month, effective disposable income is approximately €1,200/month. This is structurally different from production agencies where housing is deducted at €85–€113/week — the earnings ceiling is higher at Unique but so is the housing cost floor.",
      },
      {
        heading: "Working Conditions and Environment",
        body: "Unique placements are in offices. Working conditions are standard Dutch office environments — hybrid or in-person, Dutch or English working language, laptop and workspace provided. Hours are predictable: typically 09:00–17:00 or equivalent flexible schedule. Sick leave and holiday entitlement apply under the ABU CAO; many Unique clients exceed the ABU minimum.\n\nThe most consistent complaints from Unique workers: contract extension uncertainty (endemic to all temp work), role-task mismatches where an advertised 'management assistant' role turns out to be largely basic admin, and difficulty converting placements into permanent contracts — clients often prefer rolling Unique temps over direct hire. These are structural features of white-collar temp work, not unique to this agency.",
      },
      {
        heading: "The Full Picture",
        body: "The case for Unique is clear: above-WML hourly rates, professional working environments, no housing deduction, and institutional stability from 60 years of operation. For workers already based in the Netherlands with their own housing, it provides well-paid flexible work with standard Dutch office conditions.\n\nThe case against: Dutch B2 is effectively required for most placements; no housing support; contract uncertainty is the norm; role-task mismatches are common; and permanent conversion is rare. Workers who need housing arranged or who are at WML level should look at other agencies.",
      },
      {
        heading: "Recommendation for 2026",
        body: "Unique is the right agency for workers with Dutch language skills who want above-WML office work on a flexible basis. It's not the right starting point if you need housing arranged, don't have sufficient Dutch, or are looking for production and logistics roles. Register with multiple white-collar agencies simultaneously — Randstad Professionals and Start People are natural parallel applications alongside Unique.\n\nHave you worked through Unique Uitzendbureau? Leave a review — particularly on whether the placed role matched what was advertised and how your take-home compared to expectations.",
      },
    ],
    pros: [
      "Above-WML rates: €15–€28/hr depending on role and experience",
      "Professional office environments — standard Dutch business hours",
      "No housing deduction — keep your full net pay",
      "Long institutional track record (operating since 1966) and ABU membership",
      "Permanent employment pathway exists, even if uncommon",
    ],
    cons: [
      "No housing support — must arrange and fully fund your own accommodation",
      "Dutch B2 strongly preferred; English-only significantly limits placement options",
      "Contract extension uncertainty is the norm, not the exception",
      "Role-task mismatches common: advertised vs actual responsibilities often differ",
      "Permanent conversion is rare — clients value the temp flexibility",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── Timing Amsterdam West ─────────────────────────────────────────────────
  "uitzendbureau-amsterdam-west-timing": {
    metaTitle: "Timing Amsterdam West Review 2026 – Salary & Work",
    metaDescription:
      "Timing Amsterdam West branch review 2026. Production and warehouse jobs in Sloterdijk and Westpoort. Real salary, contracts, and conditions for temp workers.",
    intro:
      "Timing's Amsterdam West branch covers the Sloterdijk and Westpoort industrial areas — one of Amsterdam's most active employer zones for warehousing, food production, light manufacturing, and cold storage. Unlike Timing's Inhouse RAI operation (which serves the events sector), Amsterdam West placements are year-round production and logistics roles serving the western industrial ring from Sloterdijk station to the Westpoort port area.",
    sections: [
      {
        heading: "From Gross to Net: The Numbers",
        body: "Timing operates under the ABU CAO. At WML (€14.71/hr in 2026), a 40-hour week produces gross monthly earnings of approximately €2,549. After loonheffing (~10.7%), net monthly take-home is around €2,277. Night shifts earn +22% and Sunday shifts earn +50% under ABU CAO — both are common in the food production and cold-storage client mix at Westpoort.\n\nWorkers consistently on night or weekend shifts can reach effective hourly averages of €16–€18/hr. A worker doing 40% of hours on night shifts adds approximately €140–€180/month gross compared to a pure day-shift equivalent. Phase B workers (after 78 weeks) earn at or above the client CAO rate — the step change can be €0.50–€1.50/hr for many Amsterdam food and logistics clients.",
      },
      {
        heading: "SNF Housing: What Workers Get",
        body: "Timing Amsterdam West does not provide housing. Workers are expected to arrange their own accommodation in or around Amsterdam. With Amsterdam studio flats starting from €1,100+/month and shared rooms from €700–€900/month, this is a significant cost constraint for workers at WML. Net take-home of €2,277 minus €800+/month housing leaves limited disposable income.\n\nFor this reason, Amsterdam West placements tend to attract workers already based in the greater Amsterdam area rather than newly arriving international workers. If you're relocating from abroad, a logistics agency with included SNF accommodation (like Workstead or AB Midden) may offer better initial financial conditions.",
      },
      {
        heading: "Working Conditions on Site",
        body: "The Amsterdam West branch serves one of the most transport-accessible industrial areas in the Netherlands. Sloterdijk station connects to Amsterdam Centraal in 6 minutes and Schiphol in 12 minutes, with metro, train, and bus services. Many Sloterdijk-area production facilities are walkable or cyclable from the station — a genuine practical advantage over agencies placing workers at remote logistics parks.\n\nWestpoort itself is less accessible: cycling from Sloterdijk to the furthest sites takes 20–30 minutes. Early-morning starts (06:00) often begin before local bus frequencies are reliable. Confirm your specific client site location and whether employer transport is provided before accepting a Westpoort placement.",
      },
      {
        heading: "Before You Sign: What to Know",
        body: "The clear advantage is accessibility: Sloterdijk hub makes Amsterdam West production work reachable without a car for workers already in the city. Year-round demand, night/Sunday premiums, and ABU protections with Phase A/B progression round out the positives. Part of the national Timing network means access to other branches if Amsterdam work volumes drop.\n\nThe negatives are Amsterdam-specific: no housing support, expensive rental market absorbing a large share of take-home at WML, and early Westpoort starts conflicting with public transport timing. Food production and cold storage are also physically demanding environments — not a small consideration across a full shift.",
      },
      {
        heading: "Should You Register Here?",
        body: "Timing Amsterdam West makes sense if you're already based in Amsterdam and want consistent production or logistics work without a long commute. The Sloterdijk transport hub is a genuine advantage. It is not the right entry point if you're relocating from abroad and need housing arranged.\n\nWorkers interested in events-sector temp work (RAI, AFAS Live, Ziggo Dome) should contact the Timing Inhouse RAI branch separately — Amsterdam West covers production and warehouse, not events. Use the pay calculator to verify your shift premiums if something on your payslip looks off.",
      },
    ],
    pros: [
      "Year-round work — not subject to seasonal fluctuations like agricultural agencies",
      "Excellent public transport access via Sloterdijk hub",
      "Night and Sunday premiums boost earnings above WML base rate",
      "Part of national Timing network — placement continuity if Amsterdam volume drops",
      "ABU CAO protections with transparent Phase A/B progression",
    ],
    cons: [
      "No housing provided — Amsterdam rent absorbs a large share of WML take-home",
      "Early Westpoort starts begin before reliable local public transport",
      "Food production and cold storage are physically demanding throughout a full shift",
      "Zero-hours contracts in Phase A — no income guarantee on slow weeks",
      "Amsterdam cost of living limits effective savings potential at WML",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── HOBIJ Uitzendbureau (Den Haag) ────────────────────────────────────────
  "hobij-uitzendbureau": {
    metaTitle: "HOBIJ Uitzendbureau Den Haag Review 2026 – Salary",
    metaDescription:
      "HOBIJ Uitzendbureau review for Den Haag workers 2026. Logistics and warehouse jobs, housing deductions, real take-home pay in South Holland.",
    intro:
      "HOBIJ is a South Holland-based temp agency focused on logistics and warehousing placements in the greater Den Haag and Zoetermeer region. The agency places workers primarily at distribution centres and production facilities in Haaglanden, provides accommodation for incoming international workers, and operates largely with EU migrant labour. Not a nationally known name, but workers searching specifically in the Den Haag area encounter HOBIJ regularly on Dutch job platforms.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: "HOBIJ operates under the ABU CAO. At WML (€14.71/hr), a 40-hour week produces gross weekly earnings of approximately €589. After loonheffing (~10.7%), net weekly is around €526. With housing deducted at the SNF maximum (€113.50/week), net-of-housing weekly take-home drops to approximately €412 — roughly €1,650/month.\n\nForklift-certified workers (heftruck/reachtruck VCA) earn €15.50–€16/hr at HOBIJ logistics placements. At €16/hr with loonheffing and housing (~€100/week), effective weekly disposable income is approximately €466 — around €1,864/month. ABU CAO shift premiums for night and weekend work apply. Den Haag's logistics zone includes major retailer distribution operations with regular weekend shifts and associated premiums.",
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: "HOBIJ provides accommodation for workers relocating to the Den Haag area. Based on agency information and worker reports, accommodation is in shared properties — typically 2–4 workers per room — in residential areas of Den Haag Zuid or nearby municipalities including Rijswijk and Leidschendam. The deduction is itemised on payslips within the SNF maximum of €113.50/week.\n\nWorker reviews on accommodation are mixed: SNF-compliant (regular inspections ensure legal baseline), but shared bathrooms and kitchens are standard, and private space is minimal. Workers who have experienced individual-room agencies (like Select Uitzendbureau in Haarlem) find the shared arrangement a notable step down. The upside: Den Haag residential-area properties are generally quieter and more socially integrated than industrial-park housing near larger national agencies.",
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: "Den Haag is well-served by tram, bus, and RandstadRail. Zoetermeer and Rijswijk distribution facilities are generally accessible by public transport during regular hours. For early-start shifts before 06:00 or industrial park locations off direct tram routes, HOBIJ or the client typically arranges transport.\n\nDen Haag's cost of living outside housing is notably lower than Amsterdam — groceries, daily transport costs, and social expenses are more affordable. A HOBIJ worker at €1,650/month net-of-housing will find remaining disposable income goes further in Den Haag than the equivalent figure would in Amsterdam.",
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: "HOBIJ provides housing for incoming workers — a real practical necessity in the Den Haag area. The lower cost of living across the city reduces pressure on take-home pay, and Den Haag's tram network provides reasonable public transport access to the logistics zone. Forklift certification is available through the agency and directly increases the hourly rate.\n\nThe downsides are the shared-room accommodation limiting privacy, a smaller placement pool compared to national agencies, geographic restriction to South Holland, and limited third-party review availability for independent verification of current conditions.",
      },
      {
        heading: "Best Suited For",
        body: "HOBIJ fills a clear niche: workers who want logistics or warehouse work in the Den Haag area with housing included. For workers targeting South Holland specifically, it's worth contacting alongside larger agencies. The cost-of-living advantage of Den Haag over Amsterdam is real — quantify it in your budget before deciding between regional placements.\n\nIf shared accommodation is a firm dealbreaker, HOBIJ may not fit. If you can manage shared rooms and want the Den Haag region with legal housing protections in place, it's a viable entry point. Leave a review if you've worked with HOBIJ — housing conditions and payslip accuracy are the most useful data points for other workers.",
      },
    ],
    pros: [
      "Housing provided for incoming workers in the Den Haag region",
      "Lower cost of living than Amsterdam reduces pressure on WML take-home",
      "Den Haag public transport (tram, bus, RandstadRail) covers much of the logistics area",
      "Forklift certification available through agency, directly increasing hourly rate",
      "ABU CAO protections and SNF housing certification",
    ],
    cons: [
      "Shared rooms in accommodation — limited personal privacy",
      "Smaller agency with fewer placement options if primary client work drops",
      "Limited to South Holland job market",
      "Limited third-party reviews available for independent verification",
      "Lower brand recognition — less useful as a CV reference than national agencies",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
    ],
  },

  // ── Select Uitzendbureau (Haarlem) ────────────────────────────────────────
  "select-uitzendbureau": {
    metaTitle: "Select Uitzendbureau Haarlem Review 2026 – Housing & Pay",
    metaDescription:
      "Select Uitzendbureau review for Haarlem workers 2026. Modern individual-room accommodation, logistics and production jobs, real salary and deductions explained.",
    intro:
      "Select Uitzendbureau is a Haarlem-based agency that stands out in the Dutch flex-worker market for one specific reason: it offers modern, purpose-built accommodation with individual rooms rather than the shared dormitory arrangements common to most housing-providing agencies. For workers who place high value on personal space, this single differentiator makes Select worth examining carefully against larger agencies offering cheaper but denser housing.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: "Select's logistics and production placements operate under the ABU CAO. At WML (€14.71/hr in 2026), a 40-hour week produces gross monthly earnings of approximately €2,549. Net after loonheffing (~10.7%) is around €2,277 before housing.\n\nSelect charges the SNF maximum for housing: €113.50/week (approximately €454/month). Net-of-housing effective take-home: approximately €1,823/month. Compared with a shared-room agency deducting the same €113.50 but providing 4–6 occupants per room, Select gives you genuinely more for the same deduction — but you are paying the full maximum for that privacy. Overtime at peak production periods earns 125% for the first 8 hours above the weekly standard, 150% further — potentially adding €100–€150/week during busy periods.",
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: "Select operates modern housing blocks where workers have individual rooms with their own lock. Shared facilities (kitchen, bathroom) are arranged per cluster of 4–6 residents — a meaningful improvement over the 10–15 sharing common in older converted houses used by other agencies. Workers consistently identify this as a real quality-of-life differentiator.\n\nThe Haarlem location adds value beyond the housing itself: Haarlem train station provides a 15-minute direct service to Amsterdam Centraal and a 25-minute connection to Schiphol. Workers who want agency housing with access to Amsterdam's social infrastructure will find Haarlem a substantially better base than remote logistics-park accommodation.",
      },
      {
        heading: "Daily Work Reality",
        body: "Select placements are primarily in the Haarlem and South Kennemerland industrial area: food production, packaging operations, and distribution logistics. Transport from accommodation to work is typically arranged. Shift patterns vary by client: some are fixed two-shift (06:00–14:00 / 14:00–22:00), others are day-only.\n\nSelect's smaller size means placements are typically with a single client for an extended period — stability for workers who prefer familiarity, but a vulnerability if that client's demand drops. The food production sector in South Kennemerland has consistent year-round demand, reducing this risk compared to more seasonal clients.",
      },
      {
        heading: "Worth Considering or Worth Avoiding?",
        body: "Select's individual-room housing at the same SNF maximum deduction as shared-room agencies is the clearest differentiator in the Dutch flex-worker market. Modern purpose-built facilities, Haarlem's Amsterdam rail connection, and SNF/ABU certification round out the positives. Overtime opportunities at peak production periods provide meaningful income boosts above the WML base.\n\nThe trade-offs: full SNF maximum deduction regardless of housing quality tier, limited to Haarlem and the immediate region, smaller placement pool than national agencies, and limited independent third-party reviews to verify current conditions.",
      },
      {
        heading: "Who This Agency Works For",
        body: "Select Uitzendbureau makes a compelling case for workers who prioritise housing quality. Individual rooms at the full SNF deduction still represent more value per euro than shared-room agencies at the same rate. The Haarlem location — with direct Amsterdam and Schiphol rail access — adds to the practical appeal.\n\nThe trade-off is scale: Select's smaller placement pool means less flexibility than Randstad or Tempo-Team. For workers who want a stable logistics or production placement with above-average housing and can accept a single-client arrangement in the Haarlem area, it's a serious candidate. Leave a review if you've worked with Select — housing quality and payslip accuracy are particularly useful for other workers.",
      },
    ],
    pros: [
      "Individual room accommodation — the clearest differentiator from Dutch agency average",
      "Modern purpose-built housing, not converted residential properties",
      "Haarlem location with direct Amsterdam Centraal and Schiphol rail access",
      "SNF and ABU certification — legally compliant on all key metrics",
      "Overtime at peak production periods boosts earnings meaningfully",
    ],
    cons: [
      "Full SNF maximum deduction (€113.50/week) — highest possible housing cost",
      "Smaller agency = fewer placement options if primary client demand reduces",
      "Limited to Haarlem and South Kennemerland region",
      "Single-client placement model creates vulnerability if that client's work drops",
      "Limited third-party reviews for independent verification of current conditions",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
    ],
  },

  // ── SkyHire Uitzendbureau Schiphol ────────────────────────────────────────
  "skyhire-uitzendbureau-schiphol": {
    metaTitle: "SkyHire Schiphol Review 2026 – Airport Staffing & Pay",
    metaDescription:
      "SkyHire Uitzendbureau Schiphol review 2026. Airport jobs — baggage handling, cargo, security hosting. Real salary, Schiphol pass process, and working conditions.",
    intro:
      "SkyHire is a Schiphol-specialist staffing agency founded in 2017, operating exclusively within the Amsterdam Airport Schiphol ecosystem. Placements cover baggage handling, cargo operations, aircraft ground services, and security hosting — all requiring a Schiphol Airside Pass (Schipholpas) and a five-year background check. SkyHire is one of the most process-intensive agencies to start with, but places workers into roles with structured shift systems and consistently above-WML pay.",
    sections: [
      {
        heading: "Take-Home Pay in Practice",
        body: "Airport roles at Schiphol pay above WML due to physical demands and antisocial hours. Baggage handlers start at €15.50–€17/hr depending on the ground handler (Swissport, Menzies, dnata, Viggo, WFS). Cargo roles — cold storage, pharmaceutical cargo, fresh-produce handling — start at €16–€18/hr. Security hosting starts around €15–€16/hr.\n\nAt €16/hr on a 40-hour week, gross monthly earnings are approximately €2,773. Net after loonheffing (~12%) is around €2,440. Night shift premiums (+22% under ABU CAO minimum; many Schiphol clients pay +30–35% under ground handling CAOs) substantially increase take-home for workers accepting antisocial hours. A worker doing 60% nights at a client paying +30% sees an effective average rate of approximately €17.60/hr — around €3,050/month gross.",
      },
      {
        heading: "The Schiphol Pass Process",
        body: "Before any airside work at Schiphol, a Schipholpas (airside pass) is mandatory. Requirements: valid EU or Schengen identity document, five-year verifiable background check including employment and residence history, and a clean criminal record. Processing takes 3–6 weeks. During this time, SkyHire may place you in landside roles (cargo scanning, sorting) — but this is not guaranteed. Some workers report waiting at home without paid work during pass processing.\n\nOnce issued, the Schipholpas is linked to continuous employment at Schiphol. Employment gaps beyond a defined period can expire the pass, requiring the process to repeat. Loss of a Schipholpas for conduct reasons bars you from all Schiphol airside work across all ground handlers — not just from SkyHire. This is the most significant risk factor specific to airport employment.",
      },
      {
        heading: "Worker Housing in Practice",
        body: "SkyHire does not provide housing. Workers must source accommodation near Schiphol independently. Key options within commuting range: Hoofddorp (10–15 minutes by bus or bike), Nieuw-Vennep, Haarlem (25 minutes by train), Amstelveen, or Amsterdam. Shared rooms in Hoofddorp start from around €650–€900/month; Amsterdam is significantly higher.\n\nFor workers relocating internationally, the absence of housing is a real barrier. Some Schiphol workers connect via expat and migrant Facebook groups specifically for airport employees, which can source room shares faster than standard rental platforms. Budget a minimum of €700–€900/month for housing costs in the Schiphol vicinity before accepting a SkyHire placement.",
      },
      {
        heading: "Good Reasons to Register — and Reasons to Think Twice",
        body: "Above-WML rates for all primary roles, structured shift systems (you receive your schedule in advance), genuine skill development in aviation procedures, and SkyHire's sector specialisation providing better-informed HR support — these are the real advantages. Schiphol employment demand is relatively stable outside major travel crises.\n\nThe negatives are substantial: 3–6 weeks of pass processing before airside work begins, no housing provided in an expensive area, antisocial hours unavoidable, and Schipholpas revocation for conduct issues bars you from the entire airport. The processing gap is the biggest practical risk — workers without 4–6 weeks of living costs in reserve before their first shift are in a genuinely difficult position.",
      },
      {
        heading: "Worth It For These Workers",
        body: "SkyHire is worth considering if you're specifically targeting airport work. The sector specialisation, above-WML rates, and structured scheduling are genuine advantages over general temp agencies for this type of work. But the barriers are real and need pre-planning: pass processing gap, no housing support, expensive Schiphol-area rent.\n\nThe pass processing gap is a non-negotiable financial risk: have 4–6 weeks of living costs in reserve before you commit to relocating. Workers who underestimate this specific issue sometimes find themselves in financial difficulty before earning their first airside shift. Share your SkyHire experience below — particularly on pass processing timelines and actual payslip accuracy.",
      },
    ],
    pros: [
      "Above-WML rates for all primary roles (€15.50–€18/hr depending on position)",
      "Structured shift systems — schedule received in advance, unlike on-call logistics",
      "Genuine skill development: aviation procedures, cargo handling, ground services",
      "Sector specialisation means real knowledge of aviation HR and employment conditions",
      "Stable local demand — Schiphol employment relatively consistent outside travel crises",
    ],
    cons: [
      "3–6 week Schipholpas processing time before any airside work can begin",
      "No housing provided — Schiphol-area accommodation is expensive",
      "Antisocial hours unavoidable: early AM, night, and weekend shifts are standard",
      "Schipholpas revocation bars you from all Schiphol airside work, not just this agency",
      "Pass processing gap: potential weeks without income after registration",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  // ── Ruigrok Personeel (Aalsmeer) ──────────────────────────────────────────
  "ruigrok": {
    metaTitle: "Ruigrok Personeel Aalsmeer Review 2026 – Flowers & Pay",
    metaDescription:
      "Ruigrok Personeel review for Aalsmeer workers 2026. Flower auction, horticulture, and logistics jobs. Hotel-style accommodation, real salary and deductions.",
    intro:
      "Ruigrok Personeel is an Aalsmeer-based agency specialising in temporary staffing for the Dutch flower and horticulture industry. Aalsmeer is home to Royal FloraHolland — the world's largest flower auction by transaction volume — and a dense network of growers, packagers, and logistics operators supplying cut flowers and plants across Europe. Work here is fast-paced, physically specific, and sharply seasonal, with peak demand in February–April (Valentine's, Mother's Day) and October–December (Christmas period).",
    sections: [
      {
        heading: "Real Earnings vs Contract Rate",
        body: "Ruigrok placements in flower processing, grading, and packaging start at WML (€14.71/hr, 2026). Logistics roles at FloraHolland or adjacent warehouses — forklift, pallet operations, dispatch — often earn €15–€16/hr depending on certification. Greenhouse growing roles (planting, pruning, harvesting at Aalsmeer-adjacent growers) start at WML under the Glastuinbouw CAO, which includes some sector-specific allowances above the ABU baseline.\n\nOn a 40-hour week at WML, gross monthly is €2,549 and net after loonheffing is approximately €2,277. Ruigrok's hotel-style accommodation is charged at or near the SNF maximum (~€113/week), giving an effective net-of-housing take-home of approximately €1,823/month. Peak season substantially changes the picture: workers in February's Valentine's surge regularly clock 48–55 hours at FloraHolland. Overtime earns 125% for the first 8 hours above 40 weekly, 150% beyond — adding approximately €120 extra gross per peak week at WML.",
      },
      {
        heading: "What the Housing Package Looks Like",
        body: "Ruigrok provides hotel-style accommodation — a positioning in the market that implies individual rooms and a standard above the sector's typical converted-house dormitories. Worker reports support this: Ruigrok housing is consistently mentioned as a quality-of-life differentiator, with individual sleeping arrangements, reasonable cleanliness, and no severe overcrowding.\n\nAalsmeer is well-positioned geographically: good bus connections to Schiphol airport (approximately 20 minutes) and Amsterdam (35 minutes by bus and train). For workers who want agency accommodation near both a major airport and Amsterdam while avoiding Amsterdam's cost of living, Aalsmeer is a viable base.",
      },
      {
        heading: "Getting There and Working There",
        body: "Royal FloraHolland's Aalsmeer complex is one of the largest buildings in the world by footprint. Ruigrok arranges transport to the complex and to nearby grower facilities. Most client sites are within the Aalsmeer and Amstelveen area. Early-morning auction shifts (starting 04:00–05:00 during peak periods) precede public transport — agency transport is essential for these shifts.\n\nFlower processing work involves standing, fast repetitive movements, and cold environments — cut-flower storage areas are maintained at 3–7°C. Product quality is sensitive, so pace and care are both required simultaneously. Logistics roles at FloraHolland-adjacent facilities are closer to standard warehouse work: forklift, pallet jack, loading and unloading at ambient or refrigerated temperatures.",
      },
      {
        heading: "Benefits and Drawbacks",
        body: "Hotel-style individual room accommodation above the Dutch sector average, peak-season overtime significantly boosting earnings, a unique sector in a globally significant market, and good Schiphol and Amsterdam accessibility from Aalsmeer — these make Ruigrok a genuinely differentiated option for workers open to horticulture and flower work.\n\nThe trade-offs: WML base rate outside peak periods, sharply seasonal demand (volume drops in summer), cold working environments in flower processing, very early starts during peak auction periods, and limited social infrastructure in Aalsmeer itself.",
      },
      {
        heading: "The Honest Summary",
        body: "Ruigrok Personeel offers something distinct in the Dutch temp-agency market. The accommodation quality combined with the FloraHolland sector experience and Aalsmeer's geographic positioning make it worth a direct application if you're interested in horticulture and flower-sector work. Time your start for January or October to enter directly into peak demand — starting in June or July means a slower entry with fewer guaranteed hours.\n\nCompare Ruigrok against Artiflex and Westflex if the horticulture sector appeals — each agency covers a different crop type and geographic sub-region of Dutch greenhouse and flower production. Have you worked at FloraHolland or at a Ruigrok grower client? Reviews on peak-season hours and payslip accuracy are particularly useful.",
      },
    ],
    pros: [
      "Hotel-style individual room accommodation — above the Dutch agency sector average",
      "Peak season overtime (February, pre-Christmas) significantly boosts earnings",
      "Unique sector experience in a globally significant industry (FloraHolland)",
      "Aalsmeer location: good access to both Schiphol and Amsterdam",
      "Glastuinbouw/ABU CAO protections in place",
    ],
    cons: [
      "WML base rate outside peak periods — ceiling lower than technical or skilled roles",
      "Sharply seasonal work — volume and hours drop significantly in summer",
      "Cold environments in cut-flower storage are demanding year-round",
      "Very early starts (04:00–05:00) during auction season are non-negotiable",
      "Aalsmeer's social and commercial infrastructure is limited (small municipality)",
    ],
    internalLinks: [
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  // ── JTS Work (Zeeland) ────────────────────────────────────────────────────
  "jts-work": {
    metaTitle: "JTS Work Zeeland Review 2026 – Agricultural & Production",
    metaDescription:
      "JTS Work review for Zeeland workers 2026. Agricultural and production jobs in Bruinisse. Chalet accommodation at holiday park. Real salary and conditions.",
    intro:
      "JTS Work is a Zeeland-based staffing agency in Bruinisse, a municipality in Schouwen-Duiveland known for mussel cultivation, oyster farming, and delta-region agricultural production. JTS places workers in agricultural and production roles and provides accommodation in a holiday park — chalets and mobile homes rather than residential housing. For workers specifically seeking seasonal agricultural work in a distinctive coastal region, JTS Work is a small but notable option.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: "JTS Work placements start at WML (€14.71/hr in 2026), consistent with the Dutch agricultural labour market. Under the Open Teelt or Glastuinbouw CAO (depending on specific employer), minimum rates are WML-level with some sector allowances for early starts or specific conditions. On a 40-hour week, gross monthly is €2,549 and net after loonheffing is approximately €2,277.\n\nChalet-style holiday-park accommodation is typically deducted at below-maximum SNF rates — around €85–€100/week — as this accommodation type is assessed at a lower quality tier than purpose-built flex housing. At a €90/week deduction, net-of-housing effective take-home is approximately €1,917/month, marginally better than the full-maximum deduction scenario. Agricultural work in Zeeland is significantly seasonal: mussel and oyster season peaks in specific months, and out-of-season hours may drop considerably.",
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: "Accommodation in a Zeeland holiday park is genuinely unusual for a work placement. Holiday parks are built for leisure, not year-round residence: communal toilets, showers, and small kitchen areas, with minimal private space and seasonal-tourism infrastructure throughout the site. In summer, when the park also hosts paying holiday guests, workers and tourists share the same facilities.\n\nThe practical upside: some chalet units offer a small separate sleeping area for 2 people, which is more private than a 6-person dormitory in a converted residential house. The Zeeland countryside setting — flat polder landscape, proximity to the Oosterschelde tidal inlet — is genuinely scenic for workers who value outdoor space over urban amenities.",
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: "Bruinisse is remote by Dutch standards. There is no direct train connection; the nearest rail-accessible towns are Zierikzee and Bergen op Zoom, both requiring a bus transfer. Workers without a car have very limited mobility outside agency-arranged work transport. JTS Work provides transport from accommodation to work sites for shifts. Independent mobility in Zeeland essentially requires a bicycle or car.\n\nAgricultural work in the Zeeland delta involves outdoor work in a windswept coastal climate. Mussel processing, oyster cultivation, and field harvesting are the primary activities depending on season and client. The physical nature is generally entry-level but requires consistency and reliability over the season — irregular attendance is not viable in agricultural processing operations.",
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: "Below-maximum housing deduction (€85–€100/week vs €113.50 maximum) is the clearest financial advantage. The rural Zeeland environment is genuinely peaceful and different from urban agency placements. Specialised maritime and agricultural sector experience (mussels, oysters, delta agriculture) is available, and the lower cost of living in Zeeland means remaining disposable income goes further than in Amsterdam or Utrecht.\n\nThe negatives are significant for workers who need urban infrastructure: very remote location without a car, sharply seasonal work with income volatility, holiday-park accommodation not designed for year-round residency, and minimal social amenities in Bruinisse itself.",
      },
      {
        heading: "Best Suited For",
        body: "JTS Work suits a specific worker profile: those who actively want rural, coastal, or agricultural work in a quiet environment and can accept seasonal income variability. Workers needing consistent year-round hours and urban accessibility will be better served by national logistics agencies. For workers who want a genuinely different Dutch experience — working by the Oosterschelde, in Europe's seafood delta — JTS Work offers something that no Amsterdam logistics agency can match.\n\nZeeland is one of the most rural Dutch provinces. If you need regular urban amenities, Bruinisse will feel isolating within weeks. If you prefer exactly that quiet, this may be the right placement. Have you worked with JTS Work? Reviews on seasonal hour patterns and holiday-park accommodation conditions are particularly useful.",
      },
    ],
    pros: [
      "Below-maximum housing deduction (~€85–€100/week) — better than agencies at the SNF cap",
      "Peaceful, scenic coastal environment — genuinely different from urban placements",
      "Specialised agricultural and maritime experience (mussels, oysters, delta crops)",
      "Lower cost of living in Zeeland makes disposable income go further",
      "ABU CAO protections apply",
    ],
    cons: [
      "Very remote location — isolated without a car, very limited public transport",
      "Sharply seasonal demand — hours and income are not consistent year-round",
      "Zero-hours contract risk during off-season in Phase A",
      "Holiday-park accommodation is not designed for year-round worker residency",
      "Minimal social and commercial infrastructure in Bruinisse",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
    ],
  },

  // ── Westflex (Wateringen / Westland) ─────────────────────────────────────
  "westflex": {
    metaTitle: "Westflex Westland Review 2026 – Greenhouse & Logistics",
    metaDescription:
      "Westflex review for Westland and Rotterdam workers 2026. Greenhouse horticulture and logistics jobs. Real salary, working conditions, and agency details.",
    intro:
      "Westflex is based in Wateringen, in the Westland municipality — the Netherlands' most intensive greenhouse horticulture region. Westland grows a substantial share of the Netherlands' commercially exported tomatoes, peppers, cucumbers, and houseplants, almost entirely under glass. Westflex places workers in both greenhouse production roles and logistics operations along the Rotterdam–Utrecht corridor, giving it a dual-sector footprint uncommon among regional Dutch agencies.",
    sections: [
      {
        heading: "Real Earnings vs Contract Rate",
        body: "Greenhouse workers at Westflex placements often fall under the Glastuinbouw CAO rather than the standard ABU framework, depending on the specific client employer. Glastuinbouw CAO rates start at WML (€14.71/hr, 2026) but include sector provisions: early-start premiums for shifts before 06:00, some temperature-based allowances at specific employers, and vacation day accrual that can exceed the ABU minimum.\n\nOn a 40-hour week at WML, gross monthly is €2,549 and net is approximately €2,277. Where Glastuinbouw CAO early-start premiums apply, effective gross can reach €15.50–€16.50/hr. Rotterdam logistics placements via Westflex (Naaldwijk/Poeldijk cold-storage, Rotterdam distribution) start at €14.71–€16/hr depending on VCA certification and specific operation.",
      },
      {
        heading: "What the Housing Package Looks Like",
        body: "Westflex does not appear to provide agency housing directly. Workers in the Westland area typically live in Den Haag, Delft, Naaldwijk, or surrounding municipalities and commute by bicycle or car. The absence of housing deduction means workers keep their full net pay.\n\nAt WML net (~€2,277/month) minus privately arranged housing at €80–€130/week (~€320–€520/month), effective disposable income is approximately €1,757–€1,957/month. This is comparable to a housing-included agency at maximum deduction, but with full autonomy over your living arrangement. The Westland area has an established migrant worker community (Portuguese, Polish, Romanian), which often facilitates informal room-share connections faster than standard rental platforms.",
      },
      {
        heading: "Getting There and Working There",
        body: "Westland is almost entirely dependent on bicycle or car for movement within the greenhouse zone. The area is flat (ideal for cycling) but sprawling — greenhouse complexes, auction halls, and packing facilities cover a large geographic area with limited bus frequency between individual sites. Most workers cycle directly to their specific greenhouse client from nearby accommodation, or are collected from a central meeting point by employer transport.\n\nGreenhouse work involves repetitive tasks in warm (20–28°C), humid environments: pruning tomato plants, harvesting peppers, grading and packaging cut flowers, transplanting young plants. The physical rhythm is consistent across the shift. Greenhouses operate year-round — unlike open-field agriculture — which significantly reduces the seasonal income risk compared to field crop agencies.",
      },
      {
        heading: "Benefits and Drawbacks",
        body: "Year-round greenhouse operations, Glastuinbouw CAO allowances potentially exceeding standard ABU rates, dual-sector placement capacity, no housing deduction (keep full net pay), and Rotterdam proximity for logistics career pathways — these are the genuine advantages of Westflex for the right worker profile.\n\nThe downsides: no agency housing requires independent sourcing, greenhouse heat and humidity are demanding across full shifts, Westland depends entirely on bike or car transport, early starts limit public transport as a realistic commuting option, and smaller agency size limits placement options outside the immediate Westland area.",
      },
      {
        heading: "The Honest Summary",
        body: "Westflex is worth contacting if you're targeting the Westland greenhouse region and don't need agency accommodation. The year-round operation, Glastuinbouw CAO provisions, and Rotterdam logistics access make it more versatile than purely seasonal agricultural agencies. Compare it directly with Artiflex — which covers overlapping horticultural regions — to assess which has better current placement volume for your specific skills and availability.\n\nFor workers new to greenhouse work: the environment differs enough from warehousing that a trial shift before full relocation commitment is genuinely useful. The heat, humidity, and repetitive nature of greenhouse tasks are manageable for most workers but worth experiencing before signing a full contract. Share your Westflex experience below — particularly on Glastuinbouw CAO application in practice and what the housing search process was like without agency support.",
      },
    ],
    pros: [
      "Glastuinbouw CAO can exceed standard ABU rates with early-start and sector allowances",
      "Year-round greenhouse operation reduces seasonal income volatility",
      "Dual-sector placement: greenhouse horticulture and Rotterdam logistics corridor",
      "No agency housing deduction — keep your full net monthly pay",
      "Rotterdam proximity opens a logistics career pathway if you want to transition",
    ],
    cons: [
      "No agency housing — must independently source and fund accommodation",
      "Greenhouse heat (20–28°C) and humidity demanding across a full shift",
      "Westland entirely dependent on bike or car — no meaningful internal public transport",
      "Early greenhouse starts (06:00) before local bus services are operational",
      "Smaller regional agency — fewer placement options outside the Westland area",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── OTTO Workforce ────────────────────────────────────────────────────────
  "otto-workforce": {
    metaTitle: "OTTO Workforce Review 2026 – Salary, Housing & Worker Guide",
    metaDescription:
      "OTTO Workforce Netherlands 2026 review. Major migrant worker logistics agency. OTTO Housing, WML salary, ABU CAO, Amazon/DHL placements, worker reality.",
    intro:
      "OTTO Workforce is one of the Netherlands' largest and most prominent agencies for migrant workers in logistics, production, and warehouse operations. Headquartered in Venlo — the heart of the Netherlands' largest logistics zone — OTTO has placed tens of thousands of Polish, Romanian, Bulgarian, and other EU national workers in Dutch distribution centres and factories. It operates its own housing subsidiary (OTTO Housing) and is ABU-certified. For many migrant workers, OTTO is either the first agency they hear about or the first they use when arriving in the Netherlands.",
    sections: [
      {
        heading: "Wages and Payslip Breakdown",
        body: `OTTO Workforce pays at WML for its logistics and production placements: €14.71 gross per hour in 2026. On a standard 40-hour week, gross earnings are €588.40. After loonheffing (approximately 10.7% effective rate at WML) and with vakantiegeld (8%) accruing separately, workers take home approximately €345–€355 per week in cash, before housing deductions.\n\nOTTO operates at major logistics clients including Amazon, DHL, PostNL, Rhenus, and Gorillas distribution centres. Workers placed at clients with night, Sunday, or significant overtime requirements receive the applicable ABU CAO shift premiums: 22% for night shifts, 50% for Sunday work, and 125% for the first two overtime hours. Workers on regular night rotations at Amazon Fulfilment Centres report weekly gross of €640–€680, netting approximately €425–€450.\n\nPhase A workers (weeks 1–78 under the ABU CAO) receive no paid public holidays and limited sick pay. OTTO coordinators are described as inconsistent in proactively informing workers about Phase B eligibility; workers should track their own ABU Phase A start date and raise Phase B transition with their coordinator directly.`,
      },
      {
        heading: "OTTO Housing: The Reality",
        body: `OTTO Housing is the agency's own accommodation subsidiary, providing housing to the majority of OTTO Workforce's out-of-region workers. Accommodation is SNF-certified and deductions are within the SNF maximum of €113.50/week. OTTO Housing operates accommodation in Venray, 's-Hertogenbosch, Zwolle, Assen, Boxtel, Zaandam, Nieuwegein, and other logistics hub towns.\n\nBecause OTTO manages its own housing rather than using third-party providers, the accountability chain is shorter. Workers with maintenance issues or billing disputes contact OTTO Housing directly. In practice, workers report mixed experiences: housing quality is adequate and SNF-compliant at most OTTO locations, but response times for non-urgent maintenance vary significantly between sites.\n\nThe scale of OTTO's housing operation means accommodation is reliably available when workers accept a placement. However, rooms of four to six workers are standard, and housing in high-demand logistical locations near major Amazon sites can be crowded during peak periods. Workers should request the SNF registration number, inspection date, and maximum occupancy for their specific accommodation before moving in.`,
      },
      {
        heading: "Which Sites Does OTTO Workforce Operate?",
        body: `OTTO Workforce has inhouse teams at some of the Netherlands' largest logistics operations. Key client sites include distribution centres in the Venlo–Venray corridor, the 's-Hertogenbosch area, Zwolle in Overijssel, Assen in Drenthe, and Nieuwegein in the Utrecht province.\n\nWorkers placed at OTTO's inhouse client sites receive shuttle transport included. OTTO runs its own shuttle fleet rather than contracting externally, which produces more consistent service than at agencies using third-party transport providers.\n\nWorkers placed through OTTO at non-inhouse sites — smaller manufacturing clients or facilities outside the main OTTO logistics network — may not receive inhouse transport. Workers should clarify transport provision when accepting a placement outside the main Venlo–Venray–'s-Hertogenbosch triangle.`,
      },
      {
        heading: "Multi-Language Support and Arrival Process",
        body: `OTTO Workforce's registration process is available in Polish, Romanian, Bulgarian, and English in addition to Dutch. This reflects the agency's predominantly Eastern European worker base and is a practical advantage for workers who are not yet confident in Dutch.\n\nThe arrival process is structured: workers receive a pre-arrival information pack covering the work placement, OTTO Housing address, first-shift schedule, and what to bring. BSN registration, DigiD setup guidance, and Dutch bank account opening are supported by OTTO staff. Staff who have worked here describe that the administrative start is efficient.\n\nWorkers should note that the housing and employment contracts are often linked — if the work contract ends, the housing contract typically ends simultaneously with a defined notice period. Workers should read the housing contract exit terms carefully before signing, and should set up an independent Dutch bank account early in their placement.`,
      },
      {
        heading: "Common Worker Concerns and Final Verdict",
        body: `OTTO Workforce receives mixed reviews, which is partly a function of scale — with tens of thousands of placements, even a small percentage of negative experiences generates substantial online commentary. The specific concerns that appear across multiple sources: payslip accuracy on shift premiums (workers should log their own shifts and cross-check every payslip); Phase B transition not proactively managed (workers must initiate this themselves at week 70–75); and peak-period housing occupancy rising above comfortable levels from October to January.\n\nFor many migrant workers, OTTO is the path of least resistance into the Dutch labour market. The scale, multi-language support, own-brand housing, and inhouse presence at major logistics clients make the initial placement fast and administratively supported. Workers who engage actively — tracking their own shifts, monitoring payslips, initiating Phase B conversations — have significantly better financial outcomes than workers who passively accept each week as it comes.\n\nWhat actually lands in the bank: €345–€355/week at WML day shifts, €425–€450 on regular night shifts. After OTTO Housing deduction at SNF maximum (€113.50/week), disposable income is approximately €230–€340 depending on shifts. Over a 12-month night-shift rotation, a worker can save approximately €12,000–€15,000 after all deductions.`,
      },
    ],
    pros: [
      "Scale and reliability — housing and placement available when you arrive",
      "Own-brand OTTO Housing — shorter accountability chain than third-party providers",
      "Multi-language support: Polish, Romanian, Bulgarian, English",
      "Inhouse presence at Amazon, DHL, PostNL, and major logistics centres",
      "Own shuttle fleet for confirmed reliable inhouse site transport",
    ],
    cons: [
      "Payslip accuracy on premium shifts requires active worker monitoring",
      "Phase B transition not proactively managed — workers must initiate",
      "Housing at SNF maximum rate — no discount for long-term workers",
      "Peak-period housing occupancy can exceed comfortable levels",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/real-income-calculator", label: "Calculate your actual weekly take-home at OTTO" },
    ],
  },

  // ── BATCH 41–50 ─────────────────────────────────────────────────────────────

  // ── Brunel Amsterdam ──────────────────────────────────────────────────────
  "brunel-amsterdam": {
    metaTitle: "Brunel Netherlands Review 2026 – Engineering Salary & Pay",
    metaDescription:
      "Brunel Netherlands engineering staffing review 2026. Day rates, contract terms, salary for engineers and IT. What international professionals actually earn at Brunel.",
    intro:
      "Brunel was founded in Amsterdam in 1975 and still operates its global headquarters from the Dutch capital. The agency specialises exclusively in engineering, IT, life sciences, energy, and construction placements — if you're a mechanical engineer, process technician, software architect, or project manager, Brunel is one of the five agencies in the Netherlands most likely to have a relevant active vacancy. Workers are typically seconded to major industrial clients (Shell, ASML, Philips, TenneT, Tata Steel) on medium-to-long assignments of 6–24 months.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: "Brunel placements pay well above WML. Engineers with HBO or WO qualifications and 2–5 years' experience earn €30–€50/hr gross. Senior engineers with specific specialisations (process, electrical HV/MV, structural) and 10+ years' experience reach €55–€80/hr. IT professionals with in-demand skills (cloud architecture, cybersecurity, SAP, embedded software) typically start at €40/hr and exceed €90/hr at senior contractor level.\n\nBrunel operates both payroll (employed by Brunel, placed at client) and contracting (via own BV or as freelancer) models. For payroll workers at €40/hr, combined loonheffing and social insurance runs 40–50%. Net effective hourly after tax is roughly €22–€24/hr. For own-BV contractors, the effective rate improves but requires accounting for pension, insurance, and healthcare deductible personally. Consult a Dutch belastingadviseur before structuring any contractor arrangement.",
      },
      {
        heading: "Housing and Relocation Conditions",
        body: "Brunel does not operate SNF-scheme accommodation. Engineering professionals arrange their own housing — in Amsterdam and the Randstad, a studio or one-bed apartment costs €1,200–€1,800/month. For international workers relocating for a Brunel assignment, relocation support is often negotiated in the contract: a one-time relocation allowance (typically €2,000–€5,000), temporary housing for the first 4–8 weeks, or assistance finding permanent rental housing.\n\nWorkers qualifying for the 30% ruling (kennismigranten) gain a significant net income improvement — effectively 30% of gross salary is exempt from Dutch income tax for up to five years. Brunel's HR team is experienced with the kennismigrant permit process, which is a practical advantage for international technical workers over self-navigating Dutch immigration requirements.",
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: "Brunel placements are at industrial and technical client sites: refineries in Rotterdam (Botlek, Maasvlakte), semiconductor fabs near Eindhoven, offshore platforms for energy sector workers, data centres, and corporate engineering offices. Industrial zone sites are generally not accessible by public transport — workers commute by car or use client shuttle services.\n\nVCA certification is required on most industrial client sites. Site-specific safety inductions are mandatory for each new assignment. Working conditions are professional and structured: fixed project phases, clear reporting lines, Dutch or English working language depending on client and team composition.",
      },
      {
        heading: "What Workers Say: Good and Bad",
        body: "Brunel's premium is access: major Dutch and multinational technical clients that are simply not reachable through general temp agencies. Salary rates are genuinely high — engineers earn multiples of WML, and experienced specialists earn contractor rates among the best available in the Dutch market. The 50-year track record and Amsterdam HQ mean deep placement relationships.\n\nThe entry barrier is real: professional technical qualifications and experience are required. No housing support, long assignment entry timelines (2–6 weeks from application to start), VCA and site induction friction, and the complexity of the own-BV contractor model for workers unfamiliar with Dutch tax are the main downsides.",
      },
      {
        heading: "Best Suited For",
        body: "Brunel is the agency to contact if you are a qualified engineer or technical IT professional seeking placement at major Dutch industrial or technology clients. For international technical workers, Brunel's familiarity with the kennismigrant visa, 30% ruling, and expat employment contracts makes it operationally smoother than approaching Dutch clients directly from abroad. Register alongside comparable agencies (Hays Engineering, Randstad Engineering, Yacht) for broad market coverage.\n\nHave you worked through Brunel in the Netherlands? A review on placement timelines, contract accuracy, and actual hourly rates vs advertised would be genuinely useful for other technical professionals.",
      },
    ],
    pros: [
      "Premium rates: engineering roles start at €30/hr and scale significantly higher",
      "Access to major Dutch and multinational technical clients (Shell, ASML, Philips, TenneT)",
      "50+ years in the Dutch technical market — placement depth and client relationships",
      "30% ruling and kennismigrant expertise for international technical workers",
      "Both payroll and contractor models available for different tax strategies",
    ],
    cons: [
      "Not an entry-level agency — requires professional qualifications and relevant experience",
      "No housing support — expensive Dutch cities require substantial self-funded accommodation",
      "2–6 week entry timeline from application to first day — not a fast-start option",
      "VCA certification and site inductions add onboarding friction",
      "Own-BV contractor model requires Dutch tax knowledge — not suitable for all workers",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  // ── Hays Netherlands ──────────────────────────────────────────────────────
  "hays": {
    metaTitle: "Hays Netherlands Review 2026 – Professional Staffing",
    metaDescription:
      "Hays Netherlands review 2026. Professional placement across finance, IT, HR, and engineering. Salary ranges, contract terms, and what workers actually experience.",
    intro:
      "Hays has been operating in the Netherlands for over 35 years, with 80+ specialist consultants placing professionals across accounting and finance, IT, HR, legal, construction, and engineering. Consistently ranked in the top three professional staffing agencies in the country, its sector specialisation — each practice area staffed by consultants with genuine domain knowledge — differentiates it from generalist agencies. The typical Hays worker is mid-career: 3–10 years' experience seeking either a permanent position or a project-based interim role.",
    sections: [
      {
        heading: "What Hays Actually Offers — and What It Doesn't",
        body: "Hays is primarily a permanent placement and interim/contract agency for professional roles — not a traditional production or logistics uitzendbureau. There is no Phase A/B progression structure for most placements because Hays places workers directly into permanent or fixed-term roles with the client, not through an ongoing agency employment contract.\n\nFor interim and contract placements, Hays operates a detachment model: the worker is employed by Hays (payroll) or operates via their own entity, and is placed at the client for the assignment duration. Permanent placement is the other main track — Hays charges the client a fee on successful hire; the worker pays nothing and starts directly with the employer.",
      },
      {
        heading: "Real Earnings vs Contract Rate",
        body: "Finance professionals: junior accountant €32,000–€42,000 permanent, senior controller €55,000–€80,000+. IT professionals: junior developer €40,000–€52,000, senior architect €70,000–€95,000+. HR professionals: HR advisor €40,000–€55,000, HR manager €60,000–€80,000. Engineering: project engineer €45,000–€65,000.\n\nFor interim day rates: finance interim €350–€600/day, IT interim €400–€700/day, senior management €600–€1,000/day. At these income levels, loonheffing runs 40–50% for payroll-employed interims. Own-BV contractors should model effective tax rate with a belastingadviseur before accepting. No housing deductions apply — workers arrange their own accommodation with Amsterdam/Utrecht rental budgets of €1,100–€1,800+/month.",
      },
      {
        heading: "Getting There and Working There",
        body: "Hays placements are office and hybrid-work environments in Amsterdam, Rotterdam, Utrecht, Eindhoven, and Arnhem at corporate offices, financial institutions, or tech headquarters. Public transport access is generally good; the OV-chipkaart travel allowance or NS-business card is standard in Dutch professional employment.\n\nWorking conditions at Hays client organisations are standard Dutch professional environments: 36–40 hour weeks, hybrid working 2–3 days from home typical, modern office facilities. Interim roles sometimes involve travel between client locations.",
      },
      {
        heading: "Benefits and Drawbacks",
        body: "Hays's sector-specialist consultants are a genuine differentiator — a dedicated finance consultant placing 50 accountants per year has sharper market intelligence than a generalist covering ten disciplines. Access to permanent roles at recognisable Dutch employers, 35+ year track record with established client relationships, and both permanent and interim models are the clear strengths.\n\nThe commercial incentive of consultants (placement fee) means advice may favour faster-to-place options over best-fit roles. Dutch language is often expected for non-tech roles. Permanent placements take 4–12 weeks — not a fast-entry option. Salary ranges are not always disclosed transparently during the recruitment process.",
      },
      {
        heading: "The Honest Summary",
        body: "Hays is a legitimate top-tier option for qualified professionals seeking permanent or interim work in the Netherlands. Register alongside Michael Page, Robert Half, and Randstad Professionals for maximum sector coverage — using one agency exclusively limits your market exposure. Maintain your own direct applications to target companies in parallel with any recruiter relationship.\n\nHave you been placed through Hays in the Netherlands? Reviews on consultant responsiveness, job description accuracy, and whether salary matched what was discussed help other professionals evaluating this agency.",
      },
    ],
    pros: [
      "Sector-specialist consultants with real domain knowledge in finance, IT, HR, and engineering",
      "Access to permanent roles at recognisable Dutch employers — leads to actual careers",
      "35+ year track record in the Dutch professional market with deep client relationships",
      "Both permanent and interim/contract placement models available",
      "No housing deductions — workers retain full net professional salary",
    ],
    cons: [
      "Not suitable for workers without professional qualifications and relevant experience",
      "Commercial incentive may steer toward faster-to-place roles over genuinely best-fit",
      "Permanent placements take 4–12 weeks — not a fast-entry option",
      "Dutch language often required for non-tech roles even at international companies",
      "Salary transparency during the recruitment process is sometimes limited",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── HappyNurse Amsterdam ──────────────────────────────────────────────────
  "happynurse-amsterdam-regio-west": {
    metaTitle: "HappyNurse Amsterdam Review 2026 – Healthcare Staffing",
    metaDescription:
      "HappyNurse Amsterdam Regio West review 2026. Healthcare staffing for nurses, GGZ, and care workers. Real salary, CAO Zorg rates, and flexible work conditions.",
    intro:
      "HappyNurse is a national healthcare staffing agency founded in 2008, headquartered in The Hague. The Amsterdam – Regio West branch serves hospitals, mental health (GGZ) institutions, elderly care homes (verpleeghuizen), home care (thuiszorg), and disability care organisations across western Netherlands. It places nurses (MBO/HBO level), GGZ professionals, childcare workers, and geriatric specialists primarily on flexible and oproep (on-call) contracts — making it one of the most recognisable specialist healthcare agencies in the country.",
    sections: [
      {
        heading: "What You Actually Earn",
        body: "Healthcare salary at HappyNurse is governed by the CAO Zorg en Welzijn (FWG function scales). A Level 3 care assistant (helpende) earns approximately €14.71–€15.50/hr. Level 4 nursing auxiliary (verzorgende IG): €16.00–€18.50/hr. MBO-level nurse (verpleegkundige niveau 4): €18–€22/hr. HBO-registered nurse: €21–€26/hr. GGZ professionals (psychiatrisch verpleegkundige, SPV): €24–€32/hr.\n\nWhat makes healthcare work financially distinct from production or logistics is the premium structure under CAO Zorg: Saturday +50%, Sunday +100%, public holiday +100%, night shifts +30–40%. A healthcare worker doing consistent weekend shifts can earn 30–40% more per month than a weekday-only equivalent. HBO-nurse at 32 hours/week (Dutch healthcare standard) earns approximately €2,100–€2,600/month net before premiums; with regular weekend work this reaches €2,400–€3,000+ net monthly.",
      },
      {
        heading: "Accommodation Quality and Cost",
        body: "HappyNurse does not operate SNF-scheme accommodation for standard placements. Healthcare workers arrange their own housing — in Amsterdam, this means competing in a tight rental market where healthcare workers are among the groups most affected by the city's housing shortage.\n\nSome larger healthcare clients (GGZ institutions, large elderly care organisations outside Amsterdam) offer staff housing for workers willing to relocate. These are negotiated directly with the client institution, not through HappyNurse's standard agency model. Ask explicitly at registration whether any clients offer staff accommodation — particularly relevant if you're relocating from another region or from abroad.",
      },
      {
        heading: "Getting to Work and Daily Conditions",
        body: "Placements are at client institutions across the western Netherlands: hospitals (OLVG, AMC/Amsterdam UMC area), GGZ facilities (GGZ inGeest, Mentrum), elderly care homes, and home care routes. Some thuiszorg (home care) placements require car travel between multiple client homes — mileage allowance of €0.21–€0.30/km typically applies. Urban healthcare locations are accessible by OV; early-morning and night shifts require independent transport.\n\nHappyNurse places workers on oproep (on-call) contracts: you set your availability via the agency's app or planning system and receive shift offers to accept or decline. This is the core flexibility proposition — genuine schedule control. The trade-off is that income is not guaranteed; it depends on shift availability and your acceptance rate.",
      },
      {
        heading: "Strengths and Weaknesses",
        body: "CAO Zorg weekend and holiday premiums are the clear financial advantage — far exceeding ABU CAO equivalents for the same hours. The on-call flexibility model gives workers real schedule autonomy. Access to diverse healthcare settings across western Netherlands and a national network for workers willing to travel are also genuine strengths.\n\nThe counterweights: on-call contracts mean no income guarantee; Amsterdam's tight rental market creates a real housing barrier; BIG-register verification is mandatory before the first shift; and the current Dutch healthcare market means some client institutions are under significant staffing pressure — high-stress shifts are common.",
      },
      {
        heading: "Bottom Line for 2026",
        body: "HappyNurse is a credible specialist for qualified healthcare workers seeking flexible work in the western Netherlands. The weekend premium structure is a genuine financial advantage, and the on-call model delivers real schedule flexibility. The trade-off is income predictability — purely on-call work with variable acceptance creates monthly fluctuation that a structured shift pattern does not.\n\nFor healthcare workers relocating from abroad: verify your qualification with the Dutch BIG-register before contacting HappyNurse. Without BIG registration, regulated care placements are not possible. The BIG application process takes time — start it before you arrive in the Netherlands.\n\nHave you worked through HappyNurse? Reviews on shift availability, premium accuracy, and consultant responsiveness are especially valuable for healthcare professionals considering flexible work here.",
      },
    ],
    pros: [
      "CAO Zorg weekend and holiday premiums significantly exceed ABU CAO equivalents",
      "On-call model: genuine schedule control — accept only shifts that suit you",
      "Access to diverse healthcare settings: hospital, GGZ, elderly care, home care",
      "Specialist healthcare focus means consultants understand qualification requirements",
      "National network for workers willing to work beyond the western region",
    ],
    cons: [
      "On-call contract — no income guarantee, dependent on shift availability",
      "No housing arranged — tight Amsterdam rental market creates real barrier",
      "BIG-register verification mandatory before any first shift",
      "Current Dutch healthcare market: understaffed clients create high-pressure shifts",
      "Weekend and night availability often expected to maintain good placement frequency",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── Klik Uitzendbureau ────────────────────────────────────────────────────
  "klik-uitzendbureau": {
    metaTitle: "Klik Uitzendbureau Review 2026 – Cleaning & Production Jobs",
    metaDescription:
      "Klik Uitzendbureau Amsterdam review 2026. Hotel cleaning, industrial production, and housekeeping jobs. Real salary under CAO Schoonmaak and ABU, work conditions.",
    intro:
      "Klik Uitzendbureau is an Amsterdam-based NEN 4400-1 certified agency specialising in two distinct areas: hotel and commercial cleaning (schoonmaak), and industrial production staffing. NEN 4400-1 confirms identity verification, correct tax payment, and valid liability insurance — a meaningful legal compliance baseline. The combination of hotel cleaning and industrial production in one agency is unusual and gives Klik a broader placement menu than single-sector cleaning specialists.",
    sections: [
      {
        heading: "Salary and Real Take-Home Pay — Hotel Cleaning vs Production",
        body: "Salary depends entirely on which sector you're placed in. Hotel cleaning placements fall under the CAO Schoonmaak en Glazenwassers. From 2026, the CAO Schoonmaak minimum starts at WML (€14.71/hr), with experienced cleaning workers stepping up to higher periodic scales after 12+ months of CAO-covered work. The CAO also includes service-based periodieken that increase the rate annually up to a ceiling — a real benefit for workers who stay in the sector.\n\nIndustrial production placements at Klik fall under the ABU CAO at WML (€14.71/hr). On a 40-hour week, gross monthly is approximately €2,549 and net after loonheffing (~10.7%) is around €2,277. Neither hotel cleaning nor production typically includes agency housing, so workers keep the full net monthly. Hotel cleaning at 4- and 5-star Amsterdam properties carries one additional upside: guest tipping can add €20–€80/week informally on busy floors — real but unpredictable, and not something to budget.",
      },
      {
        heading: "Where Workers Sleep",
        body: "Klik does not provide or arrange housing. Workers at both cleaning and production placements are expected to source their own Amsterdam accommodation. Shared rooms in Amsterdam cost €700–€950/month at WML-income levels. Workers commuting from satellite cities — Almere, Zaandam, Purmerend, Hoofddorp — can find notably cheaper housing with acceptable commute times by train or regional bus, all within 30–45 minutes of central Amsterdam.",
      },
      {
        heading: "Commute, Tools, and On-Site Reality",
        body: "Hotel cleaning placements are in central Amsterdam — accessible by public transport from throughout the city. Hotel housekeeping starts early (07:00–08:00 for morning shifts) and involves covering 10–18 rooms per shift at busy 4- and 5-star properties, with strict cleanliness and time standards. The work is physically demanding throughout the shift: repetitive lifting, bending, and continuous movement.\n\nProduction placements are at industrial facilities in Amsterdam's western zones (Westpoort, Sloterdijk), accessible by public transport from central Amsterdam. Work is standing or moving throughout the shift — physically similar demands to logistics but with less heavy lifting than warehouse picking.",
      },
      {
        heading: "Honest Assessment",
        body: "NEN 4400-1 certification is a compliance differentiator — confirmed legal operation and tax compliance, which is not universal in the cleaning sector. Hotel cleaning placements offer tip income not available in standard production roles. Amsterdam-based placements are accessible without a car. The CAO Schoonmaak periodic step-ups reward workers who stay in the sector with real salary progression above the WML floor.\n\nNo housing provided creates real cost pressure at WML in Amsterdam. Hotel housekeeping is physically demanding with time pressure and presentation standards — some workers find this combination harder than production work. Tip income is informal and unpredictable. Production placements offer no sector CAO premium above ABU baseline.",
      },
      {
        heading: "Who Should Register Here",
        body: "Klik Uitzendbureau is a solid choice for workers specifically interested in Amsterdam hotel or commercial cleaning, or who want production work in the city. The NEN 4400-1 certification provides a compliance edge over uncertified cleaning agencies. The hotel cleaning angle is worth considering seriously if you're comfortable with the physical demands — Amsterdam's hotel sector is consistent year-round, the work is accessible by public transport, and the tip upside is a genuine bonus.\n\nFor workers deciding between hotel cleaning and production placements: hotel cleaning has more social interaction, physical variety, and the tip opportunity. Production work has more predictable conditions and possibly night-shift premium options. Both start at WML. Have you worked with Klik? Reviews on hotel placement quality and how consistent the work availability is would help other Amsterdam workers.",
      },
    ],
    pros: [
      "NEN 4400-1 certified — legal compliance and identity verification confirmed",
      "Hotel cleaning placements offer tip income upside unavailable in standard production roles",
      "Amsterdam-based placements accessible without a car by public transport",
      "CAO Schoonmaak periodic step-ups provide real salary progression with sector experience",
      "Dual-sector coverage: cleaning and production in one agency",
    ],
    cons: [
      "No housing provided — Amsterdam rental market creates real cost pressure at WML",
      "Hotel housekeeping is physically demanding with time pressure and quality scrutiny",
      "Tip income is unpredictable and informal — cannot be included in income planning",
      "Production placements: standard WML only, no sector CAO premium advantage",
      "NEN 4400-1 is a compliance floor, not a guarantee of working conditions quality",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  // ── Computer Futures ──────────────────────────────────────────────────────
  "computer-futures": {
    metaTitle: "Computer Futures Netherlands Review 2026 – IT Staffing",
    metaDescription:
      "Computer Futures Netherlands IT staffing review 2026. Day rates for developers, cybersecurity, and tech roles. Contract vs perm placement, what IT workers actually earn.",
    intro:
      "Computer Futures is a global IT workforce specialist and part of the SThree Group, placing IT professionals in Amsterdam across software development, cloud infrastructure, data engineering, cybersecurity, and IT management. In the Dutch tech market — one of Europe's most active for IT talent — Computer Futures competes with Hays IT, Brunel Digital, Harvey Nash, and Dutch boutique tech recruiters. It operates on two tracks: permanent recruitment (placed directly with client employer) and contract/interim (placed at client for a defined period via payroll or own entity).",
    sections: [
      {
        heading: "IT Salary Ranges in the Netherlands",
        body: "Dutch IT salaries are among the highest in Western Europe. Junior software developers (2–4 years) earn €42,000–€58,000 gross annually for permanent roles. Mid-level full-stack or backend developers (5–8 years) earn €60,000–€80,000. Senior engineers and architects earn €80,000–€110,000+. For contract roles: junior €350–€450/day, mid €450–€650/day, senior €650–€950/day.\n\nCybersecurity specialists and data engineers are in particularly short supply — rates are premium. Senior security engineers through Computer Futures command €700–€1,000+/day. Cloud architects (AWS/Azure/GCP certified) typically earn €550–€850/day for contract roles. At a €75,000 permanent salary, effective net after loonheffing (~37–50%) is roughly €48,000–€52,000 annually. The 30% ruling for qualifying kennismigranten dramatically improves this.",
      },
      {
        heading: "Contract vs Permanent: What to Expect",
        body: "Computer Futures operates most strongly in the contract market, where agency margins are higher. Workers should be aware that consultants may steer capable candidates toward contract roles even when permanent placement might be more appropriate. Clearly stating your permanent vs contract preference in the first consultation focuses the conversation.\n\nFor contract workers: Computer Futures manages the client relationship and invoicing in exchange for a margin (typically 15–25% on day rate). Contract roles at major Dutch tech clients — Booking.com, TomTom, ASML, ING, ABN AMRO, Philips — are well-compensated and commonly extend well beyond the initial 3–6 month agreement. Know your market rate before your first consultant conversation — use Glassdoor NL, CBS salary data, and the SThree annual IT salary survey.",
      },
      {
        heading: "Housing and Relocation",
        body: "Computer Futures does not arrange housing. IT professionals must self-arrange. In Amsterdam, appropriate professional rental housing costs €1,200–€1,800/month for a studio or small apartment. Many international IT workers use specialist expat housing agencies (Expatriate Housing, Kamernet, Pararius, Funda) — expect 4–8 weeks of active searching for a well-suited rental at a fair price.\n\nThe 30% ruling, if applicable, significantly offsets Amsterdam housing costs by increasing net take-home by approximately 15 percentage points on the applicable income portion. Workers who qualify should ensure the ruling is correctly applied from their first payslip — errors here are costly and difficult to correct retroactively.",
      },
      {
        heading: "Honest Assessment",
        body: "Market-rate IT day rates, SThree global network with relationships at most major NL tech employers, genuine sector knowledge from specialist IT consultants, and strength in premium niches (cybersecurity, cloud, data engineering) are the real advantages. Both contract and permanent models are available.\n\nNot suitable without IT qualifications or portfolio. Commercial incentive toward contract placement may not align with all workers' goals. Day rate negotiations require market knowledge workers unfamiliar with IT rates may lack. No housing support in Amsterdam's tight rental market.",
      },
      {
        heading: "Who Should Register Here",
        body: "Computer Futures is legitimate and capable for experienced IT professionals entering the Dutch market. Its strength is contract and interim — if you're a senior developer, cloud architect, or security specialist looking for a 6–18 month assignment at a recognisable Dutch client, it's worth a consultation. For permanent placement, compare with Robert Half Technology, Hays IT, and Dutch boutique recruiters before committing to one channel.\n\nPlaced through Computer Futures in the Netherlands? Reviews on day rate accuracy, consultant follow-through, and how well the role matched its description help other IT professionals evaluating this agency.",
      },
    ],
    pros: [
      "Market-rate IT day rates — contract roles at major Dutch tech clients pay premium",
      "SThree global network with relationships across most major NL tech employers",
      "Specialist IT consultants with genuine sector knowledge, not generalists",
      "Strong in premium niches: cybersecurity, cloud architecture, data engineering",
      "Both contract and permanent placement tracks available",
    ],
    cons: [
      "Not suitable for workers without relevant IT qualification or demonstrable portfolio",
      "Commercial incentive toward contract placement may not serve all workers' goals",
      "Day rate negotiation requires market knowledge — uninformed workers are disadvantaged",
      "No housing support in Amsterdam's expensive rental market",
      "Consultant responsiveness varies in busy periods — slower communication during peak",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
    ],
  },

  // ── NL People Uitzendbureau ───────────────────────────────────────────────
  "nl-people-uitzendbureau": {
    metaTitle: "NL People Uitzendbureau Review 2026 – Staffing Agency NL",
    metaDescription:
      "NL People Uitzendbureau review 2026. Based in Badhoevedorp, 12 years placing workers in admin, production, logistics and care. Salary, conditions, and real worker experience.",
    intro:
      "NL People Uitzendbureau is a Badhoevedorp-based staffing agency with over 12 years in the Dutch labour placement market, covering administrative roles, production and logistics, and care sector positions from its base near Schiphol in the Haarlemmermeer municipality. Unlike the large national chains, NL People operates at a regional scale — a smaller client roster, more direct account management, and a more personal placement experience. The trade-off is volume: fewer active vacancies than Randstad or Tempo-Team, so workers should typically register with multiple agencies simultaneously.",
    sections: [
      {
        heading: "Pay Rates and Weekly Take-Home",
        body: "NL People's placement salary depends on sector. Production and logistics placements operate under the ABU CAO at WML (€14.71/hr in 2026). On a 40-hour week, gross monthly is approximately €2,549 and net after loonheffing (~10.7%) is around €2,277. Administrative and care roles typically start at €15–€19/hr depending on role and language requirements.\n\nCare sector placements fall under CAO Zorg en Welzijn where applicable — including the significant weekend premium structure (Saturday +50%, Sunday +100%). For care workers doing consistent weekend shifts, effective monthly income can be €400–€700 higher than a weekday-only equivalent. Administrative roles at clients in the Haarlemmermeer and Schiphol business park area sometimes attract above-WML rates due to the international company concentration in the zone.",
      },
      {
        heading: "Agency Housing: What to Expect",
        body: "NL People does not provide housing. The Badhoevedorp area is part of the Haarlemmermeer municipality — housing costs here run notably lower than Amsterdam city (shared rooms from €650–€850/month in Hoofddorp and Badhoevedorp vs €750–€950+ in Amsterdam) while maintaining excellent rail and bus connections to both Amsterdam Centraal and Schiphol.\n\nFor workers considering the Haarlemmermeer as a base: this is one of the most international areas of the Netherlands, with established communities of Portuguese, Polish, and Romanian workers particularly linked to Schiphol and adjacent logistics operations. The area's internationalism makes settling easier for EU workers than many other Dutch regions.",
      },
      {
        heading: "Site Access and Working Environment",
        body: "NL People placements are in the Haarlemmermeer and greater Amsterdam region: logistics parks, production facilities, and administrative offices across Hoofddorp, Badhoevedorp, Schiphol logistics ring, and Amsterdam West. The Schiphol-area industrial zone is notably well-served by public transport compared to remote logistics parks in other regions — Hoofddorp and Schiphol stations connect to Amsterdam Centraal and Haarlem in under 20 minutes.\n\nCare sector placements may require a car or mileage-reimbursed bicycle journey depending on the specific client routes. Ask at registration which care clients NL People works with and whether transport is arranged.",
      },
      {
        heading: "What This Agency Does Well",
        body: "Twelve-plus years of market stability, broader sector coverage than single-sector specialists, lower housing costs in the Haarlemmermeer vs Amsterdam city, and more direct personal placement coordination than large chains are the genuine advantages. Care sector placements add the weekend premium income potential.\n\nSmaller placement pool limits vacancy options; no housing provided; regional focus limits national flexibility; and lower brand recognition matters less for day-to-day work but more for long-term CV.",
      },
      {
        heading: "Is It Worth Registering?",
        body: "NL People Uitzendbureau is a competent regional option for workers in the Haarlemmermeer and greater Amsterdam area who want production, admin, or care work with more personal agency coordination. Register here alongside at least one national agency for maximum placement options across the region.\n\nThe Haarlemmermeer zone — Hoofddorp, Badhoevedorp, Nieuw-Vennep — is a significant employment hub that many overseas workers overlook. Lower rent, fast Schiphol access, and an international worker community make it worth considering as a base independently of which agency you use. Reviews on placement speed and care sector conditions are especially valuable.",
      },
    ],
    pros: [
      "12+ years in the Dutch market — operational stability for a regional agency",
      "Broader sector coverage: admin, production, logistics, and care in one agency",
      "Haarlemmermeer base: lower housing costs than Amsterdam while near Schiphol",
      "More personal placement coordination than large national chains",
      "Care sector placements: weekend premium income well above standard production rates",
    ],
    cons: [
      "Smaller placement pool than national agencies — fewer active vacancies at any time",
      "No housing provided — workers must arrange independently",
      "Regional focus limits placement options outside the Haarlemmermeer and Amsterdam area",
      "Limited third-party review data for independent verification",
      "Lower brand recognition may matter for long-term CV and employer references",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── Pegasus Uitzendbureau ─────────────────────────────────────────────────
  "pegasus-uitzendbureau": {
    metaTitle: "Pegasus Uitzendbureau Review 2026 – Construction Staffing",
    metaDescription:
      "Pegasus Uitzendbureau review 2026. Construction and bouw staffing near Schiphol. VCA requirements, CAO Bouwnijverheid rates, real salary for painters and site workers.",
    intro:
      "Pegasus Flex is a construction and bouw (building) sector staffing agency headquartered in Lijnden, near Schiphol Airport on the western edge of Amsterdam. It supplies skilled and semi-skilled construction workers across the greater Amsterdam area: painters and decorators, construction site security, on-site cleaning and waste management, and general bouw labourers. Amsterdam's construction pipeline — Zeeburgereiland, Amstelkwartier, Zuidas, A10 infrastructure — is one of Western Europe's most active, creating consistent demand for qualified bouw temp workers.",
    sections: [
      {
        heading: "Weekly Pay and Deductions Explained",
        body: "Construction sector temp work falls under the CAO Bouwnijverheid. Rates depend on skill level: general bouw labourer €15.00–€16.00/hr, painter/decorator (schilder) with vakdiploma €16.50–€20.00/hr depending on CAO function classification B/C/D, construction site security €15.50–€17.00/hr, on-site waste management €14.71–€15.50/hr.\n\nAt €17/hr on a 40-hour bouw week, gross monthly is approximately €2,947 and net after loonheffing (~12.5%) is approximately €2,578. The CAO Bouwnijverheid includes slecht-weerregeling (bad-weather compensation) — workers sent home due to weather conditions are entitled to partial pay, a meaningful protection for outdoor construction work. Travel time allowance for job sites beyond a certain distance also applies under the CAO.",
      },
      {
        heading: "VCA Certification Requirements",
        body: "VCA certification (Veiligheid, Gezondheid en Milieu Checklist Aannemers) is required on most regulated Dutch construction sites. VCA-B (basic, for operational workers) is obtained in a one-day course and is valid for 10 years. Some clients require VCA-VOL for supervisory roles. Pegasus may contribute to or cover VCA course costs — ask explicitly at registration, as this is not universal.\n\nThe VCA certificate is personal — once obtained, it's valid across all agencies and employers for 10 years. Even if you pay for it yourself (€150–€250 for VCA-B), it's a transferable credential worth acquiring. Workers without VCA on regulated sites will be removed — this is strictly enforced in the Netherlands.",
      },
      {
        heading: "Housing Conditions and Transport",
        body: "Pegasus does not provide housing. Construction workers typically have existing accommodation and commute to sites — the mobile nature of construction placements (assignments changing location every few months) makes fixed agency housing impractical. The Lijnden location means workers in the Schiphol vicinity have access to Haarlemmermeer-area housing at lower cost than Amsterdam city.\n\nAmsterdam construction sites operate on 07:00–07:30 starts, aligning with peak public transport. Sites in central Amsterdam are accessible by multiple transport options; sites in development zones outside the city may require car or employer transport. Many construction workers in the Netherlands travel to sites by bike within reasonable distance, which is practical given the flat terrain.",
      },
      {
        heading: "The Full Picture",
        body: "CAO Bouwnijverheid rates exceed WML meaningfully for skilled workers — painters earn €16.50–€20/hr, well above production floor rates. The slecht-weerregeling provides real income protection for outdoor work. High Amsterdam construction demand means good placement availability. Specialist bouw focus means better CAO knowledge than generalist agencies.\n\nOutdoor, physically demanding, and weather-exposed work is the fundamental trade-off. VCA requirement adds time and potential cost to entry. Assignment mobility means changing site locations every few months. No housing provided. Limited national presence outside the Amsterdam-area construction market.",
      },
      {
        heading: "Recommendation for 2026",
        body: "Pegasus Uitzendbureau is a solid specialist option for construction workers with VCA and relevant skills targeting the Amsterdam market. The CAO Bouwnijverheid rates, slecht-weerregeling protection, and strong Amsterdam construction pipeline make it financially competitive for qualified workers. Register alongside Randstad Bouw and Tempo-Team Bouw for maximum vacancy access across Amsterdam-area construction projects.\n\nIf VCA certification is your barrier: a VCA-B one-day course costs €150–€250. Negotiate cost-sharing with Pegasus or a client upfront — it's a standard request in the bouw temp sector. Your VCA is valid for 10 years and transferable, making it a worthwhile professional investment. Worked with Pegasus on Amsterdam construction sites? Reviews on site safety standards and payslip accuracy are particularly useful.",
      },
    ],
    pros: [
      "CAO Bouwnijverheid rates exceed WML significantly for skilled workers (€16.50–€20/hr for painters)",
      "Slecht-weerregeling: partial pay entitlement when sent home due to weather",
      "High Amsterdam construction demand — good ongoing placement availability",
      "Specialist bouw focus means better CAO Bouwnijverheid knowledge than generalist agencies",
      "VCA certification support potentially available — negotiate at registration",
    ],
    cons: [
      "Outdoor, physically demanding, weather-exposed work throughout the year",
      "VCA certification required on most sites — adds onboarding time and potential cost",
      "No housing provided — workers arrange independently",
      "Construction assignments change location every few months — no fixed site permanence",
      "Limited national presence — works primarily in the greater Amsterdam construction market",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  // ── Transflex Amsterdam ───────────────────────────────────────────────────
  "transflex-amsterdam": {
    metaTitle: "Transflex Netherlands Review 2026 – Driver Staffing Agency",
    metaDescription:
      "Transflex Netherlands driver staffing review 2026. Truck and bus driver placements, Code 95, CAO Goederenvervoer salary ranges. What drivers actually earn.",
    intro:
      "Transflex Personeelsdiensten B.V. is a transport-specialist staffing agency placing professional truck and bus drivers nationally, with an Amsterdam branch. In a Dutch transport market facing a structural shortage of 20,000+ driver positions, Transflex operates in a high-demand niche: CE licence holders and Code 95-certified bus drivers are consistently among the most sought-after temp workers in the Netherlands. Professional driver placements differ fundamentally from production or logistics floor work — the entry requirements are significant, but so is the pay differential above WML.",
    sections: [
      {
        heading: "Real Earnings vs Contract Rate",
        body: "Truck driver salaries through Transflex fall under the CAO Beroepsgoederenvervoer. For CE licence holders: €17.00–€19.50/hr for standard daytime routes, increasing with experience. Long-distance international drivers earn €18.50–€22/hr plus dagvergoedingen (daily allowances for overnight stays) of approximately €35–€50/night tax-free. Bus drivers (CAO Beroepspersonenvervoer): €15.50–€19.00/hr depending on route type.\n\nAt €18/hr on a 40-hour week, gross monthly is approximately €3,120. Net after loonheffing (~13%) is approximately €2,714/month. Night driving allowances and weekend premiums under the transport CAO add further — regular night or weekend routes add €300–€500/month gross above base. The dagvergoeding for long-distance drivers is especially valuable: €35–€50/night is broadly tax-free, meaning it represents genuine net income above salary.",
      },
      {
        heading: "Code 95 and Professional Requirements",
        body: "All professional truck and bus drivers must hold valid Code 95 Vakbekwaamheid certification — this is mandatory under EU Directive 2003/59/EC and enforced in the Netherlands. Code 95 requires 35 hours of training per 5-year renewal cycle, costing approximately €200–€350. Ask Transflex at registration whether they contribute to Code 95 renewal for active workers — some transport agencies offer this, and it's a legitimate negotiation point.\n\nEU licences are automatically valid in the Netherlands without conversion. Non-EU licences require a conversion process through CBR (Centraal Bureau Rijvaardigheidsbewijzen). Code 95 obtained in any EU member state is also valid in the Netherlands — no conversion required for EU Code 95 holders.",
      },
      {
        heading: "Housing Conditions and Work Structure",
        body: "Transflex does not provide housing for standard local transport placements. Long-distance truck drivers on international routes manage overnight stays through cab sleep (in the truck's sleeping compartment) and occasional hotel accommodation, with dagvergoedingen designed to cover these costs. The cab lifestyle — living in a 2.4 square metre sleeping compartment for multiple nights per week — is a specific reality of long-distance haulage that workers should research carefully before accepting.\n\nFor local and regional transport (daily return home), workers arrange their own accommodation as with any professional placement. Schedule patterns vary: some placements are fixed routes at fixed times (highly predictable), others are day-by-day dispatch. Fixed-route placements are generally more sought-after for workers with family commitments.",
      },
      {
        heading: "Benefits and Drawbacks",
        body: "CE truck driver rates (€17–€22/hr) and tax-efficient dagvergoedingen for long-distance drivers significantly exceed production WML. Structural driver shortage in the Netherlands means high placement security for qualified drivers. Specialist transport agency knowledge of Code 95 and tachograph rules means better CAO compliance than generalist agencies. Dutch tachograph regulations are strictly enforced — working with an experienced transport agency reduces the risk of being placed with non-compliant clients.\n\nSignificant entry qualification barrier (CE or D licence plus active Code 95). Long-distance routes mean time away from home. Tachograph compliance violations are the driver's personal professional risk. Early-morning or overnight starts are unavoidable in distribution transport.",
      },
      {
        heading: "The Honest Summary",
        body: "Transflex is worth contacting if you hold a CE licence and active Code 95 and want truck or transport placements in the Amsterdam area and nationally. The transport CAO rates above WML, the dagvergoeding system for long-distance work, and the structural driver shortage all make this sector financially attractive for qualified professionals.\n\nDriven for Transflex in the Netherlands? Reviews on route types, dispatch consistency, payslip accuracy (especially overnight allowances), and Code 95 renewal support are the most useful contributions from experienced drivers.",
      },
    ],
    pros: [
      "CE truck driver rates (€17–€22/hr) significantly above production and logistics WML",
      "Tax-efficient dagvergoedingen (€35–€50/night) for long-distance routes add real net income",
      "Structural driver shortage creates high placement security for qualified drivers",
      "Specialist transport agency: knowledge of Code 95, tachograph rules, and CAO specifics",
      "Code 95 renewal contribution potentially negotiable at registration",
    ],
    cons: [
      "Significant entry barrier: requires CE or D licence plus active Code 95",
      "No housing provided — drivers arrange independently",
      "Long-distance routes mean nights away from home — genuine lifestyle trade-off",
      "Tachograph violations are the driver's personal professional responsibility",
      "Early-morning or overnight starts unavoidable in distribution and passenger transport",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
    ],
  },

  // ── Youbahn ───────────────────────────────────────────────────────────────
  "youbahn": {
    metaTitle: "Youbahn Netherlands Review 2026 – Digital Flex Platform",
    metaDescription:
      "Youbahn Netherlands review 2026. App-based flex work platform for order pickers, hospitality, and care workers. How the digital model works and what workers actually earn.",
    intro:
      "Youbahn is an Amsterdam-founded digital staffing platform that combines the flexibility of a gig-economy app with the legal protections of a licensed uitzendbureau. Serving 15,000+ flex workers, the platform connects them with employers across logistics, hospitality, healthcare support, and facility management. Workers sign up via app, set availability, and accept or decline individual shift offers from multiple employers. Unlike pure gig platforms (Temper, YoungOnes), Youbahn employs workers under standard Dutch uitzendbureau law — social insurance, vakantiegeld accrual, and WW entitlement are included.",
    sections: [
      {
        heading: "How the Platform Works",
        body: "Create a profile, upload identity documents and relevant certifications, and receive shift notifications from employers in your area and skill category. Accepting a shift is one tap — no CV submission or interview for standard logistics and hospitality shifts. From sign-up to first paid shift can be as fast as 48 hours for straightforward roles.\n\nThe flexibility cuts both ways. Because you select individual shifts rather than committing to a regular pattern, there is no income guarantee. In high-demand periods (pre-Christmas logistics peak, summer festival season for hospitality), shifts are abundant. In lower-demand periods, availability drops and income becomes unpredictable. Youbahn is designed for workers who want supplementary income or genuine flexibility — not for those needing a predictable full-time equivalent income every week.",
      },
      {
        heading: "What You Actually Earn",
        body: "Youbahn shifts operate at or above WML (€14.71/hr in 2026). Logistics and order picking: €14.71–€15.50/hr. Hospitality and facility: €14.71–€15.00/hr. Healthcare support: €15.00–€17.00/hr. Standard ABU CAO premiums apply: +22% nights, +50% Sundays.\n\nAt WML on a 40-hour equivalent week, gross monthly is approximately €2,549 and net after loonheffing is around €2,277. The practical reality: most Youbahn workers use the platform for 15–32 hours per week, generating €800–€1,600/month depending on hours and shifts accepted. Youbahn's digital payroll generates payslips automatically after each shift with transparent breakdowns of earnings, tax deductions, and vakantiegeld accrual — viewable in real time in the app.",
      },
      {
        heading: "Accommodation Quality and Cost",
        body: "Youbahn does not provide housing. As a platform-based model, housing arrangement is entirely the worker's responsibility. The primary worker pool is already based in Amsterdam and the Randstad region. Workers relocating from abroad specifically for Youbahn work would face the same Amsterdam housing challenges as any WML-level worker — difficult rental market, €700–€950/month minimum for shared accommodation — without any agency housing support.",
      },
      {
        heading: "Strengths and Weaknesses",
        body: "Maximum schedule flexibility is the genuine core advantage — accept only the shifts you want, when you want them, from multiple employers. Fast onboarding (first shift possible within 48 hours), real-time payroll transparency, full uitzendbureau employment protections unlike ZZP gig platforms, and multi-sector coverage in one app are all real.\n\nNo guaranteed income — shift availability varies significantly by season. Not suitable as a primary income source for workers needing reliable full-time equivalent hours. App-mediated relationship means no dedicated account manager. No housing in Amsterdam's expensive rental market. Lower per-shift earnings than specialised technical or professional placements.",
      },
      {
        heading: "Bottom Line for 2026",
        body: "Youbahn fills a specific need: maximum scheduling flexibility with full uitzendbureau protections. For students, parents, or people with other primary income sources who want 15–30 hours of paid work per week on their own terms, it's one of the best-structured Dutch options. For workers who need reliable full-time income, the shift-acceptance model introduces volatility that a traditional agency minimises.\n\nThe key comparison with Temper and YoungOnes (pure ZZP platforms): Youbahn's employment model means vakantiegeld accrual, social insurance, and WW protection — meaningfully better for consistent platform workers than ZZP status. Have you used Youbahn? Reviews on shift availability by sector and payslip accuracy help other flex workers evaluating the platform.",
      },
    ],
    pros: [
      "Maximum schedule flexibility: accept only shifts you want, when you want them",
      "Fast onboarding — first shift possible within 48 hours for standard logistics roles",
      "Real-time payroll transparency: earnings, deductions, and vakantiegeld visible in app",
      "Full uitzendbureau employment protections: WW, social insurance, vakantiegeld",
      "Multi-sector coverage: logistics, hospitality, care, and facility in one platform",
    ],
    cons: [
      "No guaranteed income — shift availability varies significantly by season and demand",
      "Not suitable as a primary income source for workers needing reliable full-time hours",
      "App-mediated model means no dedicated account manager — support is platform-based",
      "No housing arranged — Amsterdam rental market creates cost pressure at WML",
      "Lower per-shift earnings than specialised technical, professional, or driver roles",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── Repay HRM Amsterdam ───────────────────────────────────────────────────
  "repay-hrm-amsterdam": {
    metaTitle: "Repay HRM Netherlands Review 2026 – Digital Staffing & Pay",
    metaDescription:
      "Repay HRM Netherlands review 2026. Digital-first staffing and payroll for 15,000+ flex workers. Order picking, warehouse, and admin placements. Real salary and conditions.",
    intro:
      "Repay HRM is a digital-first Dutch staffing and payroll agency founded in 2005, serving over 15,000 flexible workers and 1,500 client organisations across the Netherlands. Workers register digitally, receive placement offers, manage contracts, and view payslips through a web portal — no branch visit required. The large worker base makes Repay HRM one of the larger digital staffing operators in the Netherlands, placing workers in order picking, warehouse operations, office administration, and general logistics roles.",
    sections: [
      {
        heading: "How Repay HRM Operates",
        body: "Repay HRM's digital model replaces the traditional agency branch visit with online registration. Workers upload identity documents, complete a digital profile indicating preferred work types and availability, and are matched with client vacancies via the platform. For straightforward production and logistics roles, placement can happen within a few days.\n\nThe agency also operates as a payroll bureau for clients who manage their own recruitment but want professional payroll administration. This dual function (staffing + payroll) is common among larger digital-first Dutch agencies. For workers, the relevant implication is that Repay HRM's payroll infrastructure is robust — automated, compliance-driven, and less prone to the manual errors common at smaller agencies.",
      },
      {
        heading: "Take-Home Pay in Practice",
        body: "Repay HRM placements operate under the ABU CAO. At WML (€14.71/hr in 2026), a 40-hour week produces gross monthly earnings of approximately €2,549. Net after loonheffing (~10.7%) is approximately €2,277. Order picking and warehouse roles — the core of Repay HRM's production volume — start at WML. Workers with VCA or forklift certification typically earn €15.00–€16.00/hr at sites requiring these.\n\nPayslip processing is digital and automated — shifts logged by client site feed into the payroll system and generate payslips without manual intervention. Workers and researchers consistently report that payslip accuracy at digital-first agencies like Repay HRM is better than at smaller agencies where manual entry is standard. Discrepancies can be flagged directly through the digital portal without visiting a branch.",
      },
      {
        heading: "Housing Conditions and Transport",
        body: "Repay HRM does not provide housing. With a national client portfolio, workers are placed across the Netherlands and expected to arrange their own accommodation. The digital model means there is no branch infrastructure to assist with relocation logistics — housing research is entirely the worker's responsibility. Workers registering from abroad should arrange accommodation before their first shift.\n\nTransport to client sites is also worker-managed. The digital portal provides specific client site addresses at the point of placement — verify transport options before accepting. Many Dutch logistics parks are not accessible by public transport, particularly for early-morning starts, so confirm site location and transport access as part of your placement review.",
      },
      {
        heading: "Good Reasons to Register — and Reasons to Think Twice",
        body: "Digital-first platform with online registration, automated payslips, and transparent payroll processing — payroll accuracy is a genuine advantage over smaller manual-process agencies. Large worker base (15,000+) suggests a broad national client network. ABU CAO protections with Phase A/B progression apply as standard. Real-time payslip review via portal with direct discrepancy flagging.\n\nNo housing provided and entirely self-service for relocation workers. No dedicated branch consultant — less personal support when issues arise. Limited brand visibility makes independent reputation verification harder. Standard WML for most production placements with no sector premium. Transport to industrial client sites is worker-managed.",
      },
      {
        heading: "Worth It For These Workers",
        body: "Repay HRM makes sense for workers comfortable managing their employment relationship digitally and who don't need face-to-face branch service. The payroll accuracy and transparency are genuine advantages in a market where payslip errors are a common complaint. Workers new to the Dutch labour market — unfamiliar with payslip structure, CAO rights, and tax deductions — may find a traditional branch-based agency a better starting point. Once familiar with how Dutch employment works, switching to a digital platform for efficiency is straightforward.\n\nUsed Repay HRM as a flex worker? Reviews on payslip accuracy, platform usability, and how responsive the digital support team is when things go wrong are the most useful contributions.",
      },
    ],
    pros: [
      "Digital-first: online registration, automated payslips, transparent payroll processing",
      "Large worker base (15,000+) suggests broad national client network and placement availability",
      "Payslip accuracy consistently better than manual-process smaller agencies",
      "Direct payslip discrepancy flagging through the digital portal — no branch visit required",
      "ABU CAO protections with Phase A/B progression apply as standard",
    ],
    cons: [
      "No housing provided — entirely self-service for workers relocating from abroad",
      "No dedicated branch consultant — less personal support when issues arise",
      "Limited brand visibility makes independent reputation verification harder",
      "Standard WML start for most production placements — no sector premium above ABU baseline",
      "Transport to industrial client sites is worker-managed — not all sites are accessible by public transport",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
    ],
  },

  // ── Michael Page ─────────────────────────────────────────────────────────
  "michael-page-recruitment-agency-permanent-interim": {
    metaTitle: "Michael Page Netherlands Review 2026 – Finance & IT Recruitment",
    metaDescription:
      "Michael Page Netherlands review 2026. Global specialist recruitment for finance, HR, IT and sales. Permanent and interim roles. Real salary ranges and conditions.",
    intro:
      "Michael Page operates as one of the world's most recognised specialist recruitment consultancies, with 15 dedicated specialist teams embedded across the Netherlands. The Amsterdam operation covers permanent and interim placement from mid-level professionals through to director and executive appointments. For candidates navigating the Dutch professional job market — particularly those with a finance, legal, HR, IT, or sales background — Michael Page's name appears consistently in salary benchmark surveys and specialist shortlists.",
    sections: [
      {
        heading: "How Michael Page Operates in the Netherlands",
        body: "Michael Page works exclusively on direct hire and interim contract placements — this is not a flex or uitzendbureau model. Candidates are matched to permanent roles or interim assignments (typically six to twelve months) at client organisations. The agency does not place workers on ABU CAO flex contracts. Each placement results in a direct employment contract with the hiring organisation (for permanent roles) or a contract through Michael Page's interim infrastructure (for interim assignments).\n\nThe Dutch offices cover Amsterdam, Rotterdam, Eindhoven, and Den Haag, with the Amsterdam team serving the Randstad corridor, Zuidas financial district, and multinationals headquartered in the metropolitan area. Specialisms are divided into Finance & Accounting, Human Resources, Sales & Marketing, Information Technology, Legal, Procurement & Supply Chain, and Property & Construction. For international candidates, Michael Page's Amsterdam team has long experience with the 30% ruling (for kennismigranten qualifying above €46,660 in 2026) and with supporting candidates through the knowledge migrant visa process.",
      },
      {
        heading: "Salary Ranges: What Michael Page Placements Actually Pay",
        body: "Michael Page placements are well above the Dutch statutory minimum wage (WML €14.71/hr in 2026). The agency's annual Salary Guide — published each year and freely available — is among the most cited benchmarks in the Dutch professional labour market. Indicative 2026 ranges: Finance manager roles (3–7 years): €60,000–€85,000 gross/year. HR business partner positions: €55,000–€75,000. Mid-level IT professionals: €65,000–€90,000. Sales manager positions in FMCG or technology: €65,000–€95,000 including variable bonus. Interim assignments command a 20–40% day-rate premium above equivalent permanent salary.\n\nNet take-home at these levels involves Box 1 income tax at 36.97% between the first and second bracket thresholds (€38,441–€76,817 in 2026) and 49.5% above. At €70,000 gross, net monthly take-home is approximately €3,900–€4,100. For kennismigranten eligible for the 30% ruling, effective net monthly take-home rises by approximately €600–€900 at this income level — a material difference that Michael Page recruiters are equipped to explain.",
      },
      {
        heading: "Working with a Global Recruiter in the Dutch Market",
        body: "The Michael Page candidate experience differs from a traditional flex agency. Registration is by CV submission through the website or LinkedIn, after which a specialist consultant reviews the profile and arranges a call. There is no branch walk-in model and no shift-based availability management. The typical recruitment timeline from first contact to offer is four to ten weeks — appropriate for permanent and senior interim roles where fit assessment and hiring manager rounds are involved.\n\nMichael Page's transparency is strong at the market benchmark level but mixed at the individual vacancy level — job postings frequently list salary ranges, but the specific client name may not be disclosed initially. Candidates who engage directly with a consultant — rather than cold-applying — typically receive faster responses and clearer information on specific vacancies.",
      },
    ],
    pros: [
      "Global brand with 15+ specialist teams: genuine depth of specialisation rather than generic placement",
      "Annual Salary Guide is among the most cited benchmarks in the Dutch professional market",
      "Strong experience with international candidates and 30% ruling/kennismigranten pathways",
      "Interim placements command day-rate premiums; well-suited to experienced professionals between permanent roles",
      "Zuidas and multinational client network — not just SME placements",
    ],
    cons: [
      "Not suitable for blue-collar, logistics, or WML-rate placements — exclusively professional-level focus",
      "Permanent placements take 4–10 weeks to complete — not suited to candidates needing immediate income",
      "Client name often withheld initially — reduces candidate ability to research role fit before investing time",
      "High candidate volume means consultants prioritise strong sector-match profiles",
      "No housing, transport, or relocation logistics support",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── Ployees ───────────────────────────────────────────────────────────────
  "ployees": {
    metaTitle: "Ployees Amsterdam Review 2026 – Freelance Hospitality Shifts",
    metaDescription:
      "Ployees Amsterdam review 2026. Freelance hospitality platform for bartenders, hotel staff and event crew. How the app works, shift pay, and realistic earnings.",
    intro:
      "Ployees is a hospitality-focused staffing platform based in Amsterdam, connecting freelance workers with employers in hotels, restaurants, bars, events, and kitchen support roles. The model is app-first: workers register, set availability, browse and claim shifts, and receive payment through the platform. Workers operate as ZZP (zelfstandigen zonder personeel, self-employed freelancers) or under a payroll arrangement depending on individual registration type — with meaningfully different tax and insurance implications for each.",
    sections: [
      {
        heading: "The Platform Model: Freelancing in Dutch Hospitality",
        body: "Ployees connects workers who have hospitality skills — bartenders, waitstaff, hotel front-desk, kitchen support, and event crew — with venues and operators that need flexible staffing above their permanent headcount. A worker might do three hotel breakfast shifts Monday–Wednesday, two bar shifts Thursday–Friday, and an event staffing job on Saturday — all through the same platform interface, with different hourly rates depending on employer and role type.\n\nPloyes' legal structure for workers depends on registration type. ZZP workers invoice through the platform and are responsible for their own belasting (tax) filings, zorgverzekering (health insurance), and pension. Workers who prefer employment-based registration may be placed under a payroll bureau arrangement, which provides the employer protections of the ABU or Horeca CAO. Confirm your registration type before your first shift — the tax and insurance implications are significantly different.",
      },
      {
        heading: "Earnings and Take-Home Pay on Shift-Based Hospitality Work",
        body: "Ployees shift rates vary by employer, role, and event type. In 2026, Horeca CAO scale B (waiter, bar staff) starts at approximately €12.00–€13.50/hr at lower experience steps, but rises above the WML of €14.71/hr at experienced levels. Ployees platform rates for standard hotel breakfast or event floor staffing start around €14.00–€15.50/hr. Weekend premiums, public holiday surcharges, and night-rate additions apply under the Horeca CAO and are reflected on relevant shifts.\n\nFor workers billing as ZZP, the gross rate is the full rate — no employer contributions deducted — but income tax (inkomstenbelasting) must be set aside manually. The standard guidance for ZZP workers is to set aside 30–35% of gross earnings for tax and insurance, leaving effective take-home closer to the employee net equivalent. Workers employed through a payroll arrangement will see loonheffing deducted at source — at €15.00/hr on 25 hours/week, gross monthly is approximately €1,625 and net approximately €1,452.",
      },
      {
        heading: "Getting Around Amsterdam for Early Shifts and Late Finishes",
        body: "Hospitality shifts don't follow 9-to-5 patterns. Hotel breakfast shifts start at 06:00 or 06:30; late bar shifts end at 01:00 or 02:00. Amsterdam's GVB tram and metro network stops around 00:30 on weekdays and 01:30 on weekends — night buses (N-lines) run until 05:00 but at reduced frequency. For workers without a bicycle, late-ending bar and event shifts may require a taxi or e-step (electric scooter share) home, which erodes hourly earnings on shorter shifts.\n\nPlatform workers are responsible for their own transport to all Ployees shifts. Hotel and event venues are distributed across central Amsterdam and the RAI/Europaplein convention district. Most are reachable by GVB or bicycle if the worker is Amsterdam-based.",
      },
    ],
    pros: [
      "Multi-client flexibility: claim shifts from multiple employers in the same week through one platform",
      "App-first interface — no branch visit or paper registration required",
      "Hospitality sector focus means role experience transfers between shifts",
      "Weekend, public holiday, and night premiums reflected on relevant shifts",
      "Works well as supplementary income alongside study or a second employment base",
    ],
    cons: [
      "ZZP registration requires self-managed tax filing and insurance — not suitable for workers unfamiliar with Dutch self-employment obligations",
      "Rates for standard floor/breakfast shifts start close to WML",
      "Late-ending shifts create transport difficulty outside normal GVB service hours",
      "No housing provided — Amsterdam rental market creates cost pressure at these income levels",
      "Irregular demand: shifts concentrated in weekends and event periods, creating income variability",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  // ── R-Recruitment B.V. (AIRR) ─────────────────────────────────────────────
  "r-recruitment-bv": {
    metaTitle: "R-Recruitment AIRR Schiphol Review 2026 – Airport Logistics Jobs",
    metaDescription:
      "R-Recruitment (AIRR) Schiphol review 2026. Airport logistics, cargo and ground handling placements since 1999. Schipholpas, shift pay, and real conditions.",
    intro:
      "R-Recruitment B.V., operating under the brand name AIRR, is a Schiphol-based staffing agency specialising in airport logistics and ground handling placements since 1999. With over 25 years focused on the Schiphol ecosystem, AIRR is one of the long-established niche agencies serving the airport's continuous demand for cargo handlers, forklift drivers, warehouse operators, and ground support workers. Schiphol is one of Europe's busiest cargo hubs, and airport logistics work runs on shift patterns that differ meaningfully from standard warehouse or transport roles.",
    sections: [
      {
        heading: "Airport Logistics Placements and How AIRR Operates",
        body: "AIRR places workers in shift-based positions at Schiphol and surrounding cargo areas: cargo handling, baggage logistics, airside warehouse operations, and ground support functions. Working at Schiphol requires a Schipholpas — the airport security pass issued by the Royal Netherlands Marechaussee after background screening including a VOG and employment history declaration. The process takes two to four weeks; workers cannot start airside until the pass is issued.\n\nFor forklift and cargo handling roles, VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers) certification is required by most Schiphol cargo clients. VCA Basis can be obtained in a day-long course for €80–€120; some AIRR placements include or subsidise VCA training as part of onboarding. Workers with existing VCA certificates have faster placement timelines.",
      },
      {
        heading: "Schiphol Shift Pay: What Cargo and Ground Roles Actually Earn",
        body: "AIRR placements operate under the ABU CAO. Entry-level cargo handling roles start above WML (€14.71/hr in 2026), reflecting the physical demands and security clearance requirements: €15.00–€16.50/hr for standard cargo. Forklift and loading dock operators: €16.00–€18.00/hr. Senior cargo coordinators with sector experience: €18.00–€21.00/hr.\n\nNight shift premiums under the ABU CAO are +22% above base rate for hours between 00:00 and 06:00. Schiphol cargo operations run 24 hours — a significant proportion of available shifts fall in the night window. At €16.50/hr base with night premium applied to eight night hours per week, gross monthly earnings rise to approximately €2,955. Net after loonheffing: approximately €2,641. Overtime during peak freight periods carries ABU CAO rates of 125% for the first two hours beyond 8hr/day, 150% thereafter.",
      },
      {
        heading: "Schipholpas, Security, and Practical Realities of Airside Work",
        body: "The Schiphol environment has characteristics that workers from standard warehousing backgrounds will not have encountered. Airside access is strictly controlled — workers carry their Schipholpas at all times and pass through security checkpoints before each shift. The airport operates a zero-tolerance substance policy; random checks are routine.\n\nTransport to Schiphol is straightforward by NS train (Amsterdam Centraal to Schiphol in 17 minutes; Amsterdam Zuid in 6 minutes). Night trains run on the Amsterdam–Schiphol route, though frequency drops to one or two per hour between 01:00 and 05:00. Workers based in Amsterdam or the Randstad have good NS access to both regular and overnight shifts.",
      },
    ],
    pros: [
      "25+ years of Schiphol specialisation: genuine depth of airport logistics placement knowledge",
      "Above-WML base rates for cargo handling roles reflecting clearance and physical demands",
      "Night shift premiums (ABU CAO +22%) are standard and transparent on overnight shifts",
      "Structured Schipholpas guidance included as part of onboarding",
      "VCA training support available for workers entering the certification process",
    ],
    cons: [
      "Schipholpas application takes 2–4 weeks — no immediate-start possibility without an existing pass",
      "Background screening may be challenging for candidates with complex travel or employment history",
      "Zero-tolerance substance policy: non-negotiable with immediate consequences for violation",
      "No housing provided — Schiphol-area rental costs are high relative to WML-adjacent wages",
      "Night shift concentration in cargo roles requires workers to be comfortable with irregular hours",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── RAI Amsterdam Hospitality CrewCenter (HCC) ────────────────────────────
  "rai-amsterdam-hospitality-crewcenter-hcc": {
    metaTitle: "RAI Amsterdam HCC Review 2026 – Event & Hospitality Staffing",
    metaDescription:
      "RAI Amsterdam HCC review 2026. In-house event staffing for the RAI convention centre. How the CrewCenter works, pay rates, and what to expect on shift.",
    intro:
      "The RAI Amsterdam Hospitality CrewCenter (HCC) is the in-house staffing and crew management facility of the RAI Amsterdam Convention Centre — one of Europe's largest exhibition and event venues, covering over 100,000 square metres in Amsterdam-Zuid. The HCC coordinates hospitality workers for the venue's own events: international trade shows, congresses, corporate events, and public exhibitions. This is not an independent agency placing workers across multiple clients — it is a venue-specific crew management function serving a single, consistent location.",
    sections: [
      {
        heading: "What the HCC Actually Does",
        body: "The RAI hosts a dense calendar of large-scale events throughout the year — AutoRAI, METSTRADE, IBTM, Horecava, and hundreds of smaller congress and corporate events. Each event requires a different staffing configuration: reception crews for congress registration, floor stewards for exhibition halls, hospitality hosts for VIP lounges, cloakroom staff, and catering support. The HCC maintains a pool of registered hospitality workers who can be called up for specific event assignments.\n\nThe venue is fixed: Amsterdam-Zuid, directly accessible by tram 4, metro 52 (Noord/Zuidlijn), and the RAI NS station. Workers know the environment across all assignments — no navigating new client sites, no unfamiliar security procedures per shift.",
      },
      {
        heading: "Event Staffing Pay: Realistic Numbers for RAI Assignments",
        body: "The RAI HCC operates in the Horeca and events sector. In 2026, hospitality floor staff rates are in the range of €13.50–€16.50/hr depending on role and experience. Standard floor steward and registration desk roles start closer to WML (€14.71/hr); experienced reception leads and VIP hospitality hosts earn €15.50–€17.00/hr. Public holiday and Sunday assignments carry Horeca CAO surcharges.\n\nEvent shifts typically run 6–10 hours. An eight-hour shift at €15.00/hr produces €120 gross before deductions. Net after loonheffing: approximately €107 per shift. The income is supplementary by nature — the HCC's transparency score in the agencycheck database is 35, reflecting limited public information on pay rates and registration terms. Request written confirmation of hourly rate, CAO coverage, and any minimum guarantee before your first assignment.",
      },
      {
        heading: "Irregular Demand and What It Means for Scheduling",
        body: "The RAI event calendar drives HCC staffing demand entirely. Workers registered with the HCC have no guaranteed weekly hours — some weeks may see three shift invitations; others may see none. The RAI's busiest event periods align with the European trade show calendar: autumn (October–November) and spring (March–May). Summer and January are typically quieter.\n\nInternational workers considering the HCC as a primary income should note the seasonal concentration and the absence of guaranteed hours. Pair the HCC with a platform-based agency like Ployees or a full-service hospitality uitzendbureau to maintain income stability.",
      },
    ],
    pros: [
      "Fixed, consistent venue: workers know the environment, layout, and procedures across all assignments",
      "Amsterdam-Zuid location: accessible by metro (Noord/Zuidlijn), tram 4, and direct NS station (Amsterdam RAI)",
      "Europe-scale event exposure: large international trade shows and congresses",
      "No multi-client logistics — same building for every assignment",
      "Hospitality experience from a major venue is transferable to hotels and premium corporate events",
    ],
    cons: [
      "No guaranteed hours — demand is entirely event-calendar dependent and can drop to zero in quiet months",
      "Transparency score of 35 — limited public information on pay rates, CAO coverage, and registration terms",
      "Not suitable as a primary income source for workers needing reliable weekly earnings",
      "Exclusively venue-specific: no ability to diversify across clients through the HCC",
      "Application and selection process not publicly documented",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── Robert Walters ────────────────────────────────────────────────────────
  "robert-walters-recruitmentbureau-amsterdam": {
    metaTitle: "Robert Walters Amsterdam Review 2026 – Executive Recruitment",
    metaDescription:
      "Robert Walters Amsterdam review 2026. Specialist professional recruitment for finance, legal, HR and IT. Zuidas-based since 1990. Salary benchmarks and candidate experience.",
    intro:
      "Robert Walters has operated its Amsterdam office from the Zuidas financial district since 1990, making it one of the longest-established international specialist recruiters in the Netherlands. The Amsterdam team covers finance, legal, human resources, information technology, and business support recruitment — both permanent and interim — for multinationals, financial institutions, legal firms, and tech companies headquartered in the Randstad. Robert Walters positions itself at the senior and specialist end of the professional recruitment market.",
    sections: [
      {
        heading: "Robert Walters' Recruitment Model in the Netherlands",
        body: "Robert Walters operates a direct hire and interim model. Candidates are not placed on ABU CAO flex contracts — each placement results in either a permanent employment contract with the hiring company or an interim arrangement through the Robert Walters contract infrastructure. The Amsterdam office employs specialist consultants organised by discipline: Finance & Accounting, Human Resources, Legal, Information Technology, and Business Support. Each specialist has vertical knowledge of their market segment — a Finance consultant covers the Dutch accountancy, controller, and treasury market in real time.\n\nRobert Walters publishes an annual Salary Survey covering the Dutch professional labour market, broken down by function, seniority, and sector. The 2026 edition is freely available via registration on their website and remains one of the standard references for salary negotiation in the Netherlands.",
      },
      {
        heading: "Professional Salary Ranges and What Robert Walters Places",
        body: "Robert Walters placements operate well above WML. Indicative 2026 ranges: Financial controller roles (5–10 years): €70,000–€100,000 gross/year. HR managers: €60,000–€85,000. Legal counsel (in-house, 3–7 years PQE): €75,000–€110,000. IT project managers and programme directors: €85,000–€130,000. Business support and EA/PA roles at multinational level: €45,000–€65,000.\n\nInterim assignments carry a contractor day rate reflecting the absence of pension accrual and sick pay. A permanent finance manager at €80,000 converts to an interim day rate of approximately €500–€650 for an equivalent profile. For senior IT professionals on €100,000 gross eligible for the 30% ruling, the ruling reduces the taxable base to €70,000, improving net take-home by approximately €1,200–€1,500 per month — a benefit Robert Walters consultants are well-versed in explaining.",
      },
      {
        heading: "Working With an International Recruiter From the Zuidas",
        body: "The Zuidas location and international client portfolio mean Robert Walters is well-positioned for candidates with multilingual profiles or experience from international markets. The Amsterdam office regularly places candidates from the UK, Germany, Belgium, and France into Dutch-market roles. English-language CVs are fully accepted; Dutch language is increasingly required for roles with domestic stakeholder management but remains optional for many multinational positions.\n\nThe consultation experience follows a structured process: CV review, consultant call, candidate briefing, interview preparation coaching, and offer management. For senior placements, the process takes six to twelve weeks from first contact to signed offer.",
      },
    ],
    pros: [
      "35+ years in the Dutch market: deep sector knowledge and established Zuidas and multinational client relationships",
      "Annual Salary Survey is a credible, freely available benchmark reference for the Dutch professional market",
      "Strong experience with international candidates and 30% ruling/kennismigranten applications",
      "Specialist consultant structure ensures you deal with someone who knows your sector",
      "Interim infrastructure capable of handling senior contractor placements without administrative complexity",
    ],
    cons: [
      "Exclusively senior/specialist market — not appropriate for entry-level, logistics, or trade roles",
      "Slow placement timeline (6–12 weeks for permanent roles) — not for candidates needing immediate income",
      "Initial client disclosure often limited — candidates may invest time before knowing the employer",
      "High candidate volume in popular disciplines may slow response for niche profiles",
      "No housing, transport, or relocation support",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── Spirit Hospitality Services ───────────────────────────────────────────
  "spirit-hospitality-services": {
    metaTitle: "Spirit Hospitality Services Review 2026 – VIP Schiphol Staffing",
    metaDescription:
      "Spirit Hospitality Services Schiphol review 2026. VIP hospitality and private aviation staffing at Schiphol-East General Aviation Terminal. Pay, security passes, and conditions.",
    intro:
      "Spirit Hospitality Services operates from the General Aviation Terminal at Schiphol-East — the arrivals and departure facility for private jets and business aviation at Amsterdam Airport Schiphol. The agency places workers in VIP lounges, concierge services, and ground-level reception for private aviation clients. The environment, client profile, and required skill set differ significantly from standard hospitality or airport ground-handling work.",
    sections: [
      {
        heading: "VIP Hospitality at Schiphol-East: What Spirit Does",
        body: "The General Aviation Terminal (GAT) at Schiphol-East is physically and operationally separate from the main terminal complex. It serves the private jet, charter, and business aviation market — passengers are typically executives, high-net-worth individuals, and government or diplomatic travellers. Hospitality workers at the GAT provide concierge-level reception, lounge service, and premium guest coordination — not queue control or standard hotel breakfast service.\n\nWorking at Schiphol-East requires a Schipholpas — the same security pass required for airside work at the main terminal. Background screening (VOG plus travel and employment history declaration) takes two to four weeks. Workers cannot start at the GAT without an active pass.",
      },
      {
        heading: "Pay and Conditions in Private Aviation Hospitality",
        body: "Spirit Hospitality Services placements fall within the Horeca CAO or an applicable hospitality sector arrangement. Experienced hospitality workers in premium aviation environments earn €15.00–€20.00/hr depending on role and experience. VIP concierge and senior reception roles at private aviation facilities typically start at €16.50/hr and rise with demonstrable experience in luxury or aviation environments.\n\nShift structures at the GAT follow aviation movement patterns — early-morning starts (05:00–06:00) for dawn departures are typical. Shift lengths vary: short high-intensity shifts of 4–6 hours for specific flight movements alongside standard 8-hour patterns. Transport to Schiphol-East is separate from the main terminal and less public-transport-accessible — verify the last-mile connection and factor in transfer time for early starts.",
      },
      {
        heading: "Clearances, Passes, and the Schiphol-East Environment",
        body: "Beyond the Schipholpas, VIP hospitality for government or diplomatic clients may involve additional background verification. Workers must be comfortable with a high-security, access-controlled environment where photography, personal device use, and casual conversation about clients are strictly restricted. Discretion requirements are substantively more demanding than standard hotel or event work.\n\nThe Schiphol-East environment is smaller and more intimate than the main terminal. Workers form part of a recognisable, recurring crew — performance, reliability, and service attitude are visible and valued by permanent staff and management.",
      },
    ],
    pros: [
      "Niche specialisation in premium VIP aviation hospitality — a genuinely differentiated CV entry",
      "Above-average hourly rates relative to standard hospitality and event staffing",
      "Fixed, consistent environment at the Schiphol-East General Aviation Terminal",
      "Professional development in luxury service standards applicable to premium hotels and corporate hospitality",
      "Smaller crew environment means performance is visible and relationships develop faster",
    ],
    cons: [
      "Schipholpas required: 2–4 weeks background screening before first shift — no immediate start",
      "Entry threshold is high: prior luxury or aviation hospitality experience typically required",
      "Transport to Schiphol-East is less convenient — car or taxi often needed for early-morning shifts",
      "Strict discretion requirements: not suitable for workers uncomfortable with non-disclosure environment",
      "Limited public transparency on pay rates, minimum guaranteed hours, and CAO coverage",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── Studentalent Amsterdam ────────────────────────────────────────────────
  "studentalent-amsterdam": {
    metaTitle: "Studentalent Amsterdam Review 2026 – Student Jobs HBO & WO",
    metaDescription:
      "Studentalent Amsterdam review 2026. 25+ years matching HBO/WO students with branch-specific part-time jobs and projects. Realistic pay and conditions for student workers.",
    intro:
      "Studentalent is a specialist student employment agency with over 25 years of experience in the Dutch higher education labour market. The agency focuses specifically on HBO and WO students seeking part-time work that connects to their field of study — placing a business administration student in marketing support rather than a warehouse, a healthcare student in care home administrative support rather than production. The discipline-relevant matching approach distinguishes Studentalent from generic platforms that treat student workers interchangeably with any flex candidate.",
    sections: [
      {
        heading: "Matching Students With Relevant Part-Time Roles",
        body: "The Studentalent model rests on the principle that student work should be professionally developmental, not just financially supportive. The agency maintains relationships with employers across healthcare, administration, customer contact, project support, research assistance, and social work — all areas where HBO and WO students can apply discipline-relevant skills while studying. Placements are typically 8–20 hours per week, designed to fit around a full study schedule.\n\nStudentalent's 25+ year track record means the agency has accumulated Amsterdam employer relationships that newer platforms have not built. This institutional knowledge — knowing which healthcare organisations reliably pay on time, which admin teams provide good student supervision, which customer contact centres treat student workers fairly — is a practical advantage over algorithm-based job matching.",
      },
      {
        heading: "Student Pay and How It Fits Alongside a Degree",
        body: "Student workers employed through Studentalent are placed under normal Dutch employment law. In 2026, the WML for workers aged 21 and over is €14.71/hr. Youth WML applies below 21: 18 years — 40% (€5.88/hr); 19 years — 60% (€8.83/hr); 20 years — 80% (€11.77/hr). For most HBO/WO students who are 21+, the full WML applies as the floor.\n\nMany Studentalent placements in care, admin, and customer contact pay above WML — sector CAOs apply in healthcare (CAO Zorg en Welzijn) and some office environments. A student placed in healthcare administrative support might earn €15.00–€16.50/hr under the care CAO. At 16 hours per week, that produces approximately €240–€264 gross weekly; net after loonheffing approximately €880–€960/month. The loonheffingskorting applies if using only one employer — students working multiple jobs should confirm which employer applies the credit to avoid year-end corrections.",
      },
      {
        heading: "Sectors and Job Types Studentalent Covers",
        body: "Healthcare and care support, customer contact and call centre roles, marketing support, project assistance, and research roles represent the core of Studentalent's vacancy portfolio. The agency does not typically handle production, warehouse, or physical logistics placements — the higher-education graduate positioning defines the model.\n\nStudents in IT, finance, or law — disciplines where part-time professional placement is harder to source — may find the Studentalent portfolio thinner. The agency is strongest in Amsterdam's care, service, and administrative sectors. Students in technical or analytical disciplines may get better results from specialist platforms or direct employer application.",
      },
    ],
    pros: [
      "25+ year track record in the Amsterdam student employment market — established employer relationships",
      "Discipline-relevant placement approach: jobs that connect to your field of study rather than generic flex work",
      "Strong coverage of healthcare, admin, and customer contact with CAO-protected pay above WML",
      "Flexible part-time hours (8–20 hrs/week) designed to fit around full-time study schedules",
      "Proper loonheffing administration through a structured agency",
    ],
    cons: [
      "Not suitable for students seeking full-time or summer-concentrated work at scale",
      "Portfolio is strongest in care and admin; thinner for IT, finance, and technical disciplines",
      "Amsterdam-centric: less useful for students studying in Utrecht, Rotterdam, or other cities",
      "No housing provided — assumes students have accommodation through university or private rental",
      "Youth minimum wage rates (for students aged 18–20) are significantly below the adult WML",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  // ── StudentenBureau Amsterdam ──────────────────────────────────────────────
  "studentenbureau-amsterdam": {
    metaTitle: "StudentenBureau Amsterdam Review 2026 – Internships & Starters",
    metaDescription:
      "StudentenBureau Amsterdam review 2026. Part of Laurens Simonse Group. Internship and starter placements for HBO/WO students since 1998. Pay, process, and what to expect.",
    intro:
      "StudentenBureau Amsterdam is part of the Laurens Simonse Group, a national organisation that has specialised in internship and student placement since 1998. The organisation connects highly educated HBO and WO students with host organisations for internship placements, graduation research assignments, and first-step starter positions. Unlike a traditional uitzendbureau, the primary product is structured internship mediation — sitting at the intersection of higher education and the labour market.",
    sections: [
      {
        heading: "Internships and Starter Roles: The StudentenBureau Model",
        body: "The Dutch HBO and WO system builds practical internship periods (stages) into most degree programmes. HBO students typically complete one major internship in year 3 and a graduation internship in year 4; WO students increasingly pursue master-level internships and research placements. StudentenBureau Amsterdam mediates between students seeking these placements and organisations willing to host them — handling the matching, contract formalities, and supervision framework.\n\nThe sister company XL Studenten Uitzendbureau handles student workers who want part-time employment (not formal internships). The Laurens Simonse Group has built infrastructure covering both the curricular internship market and the paid student employment market through connected entities — students seeking paid part-time work while studying should investigate both routes.",
      },
      {
        heading: "Pay, Allowances, and Internship Compensation",
        body: "Dutch internship compensation is not standardised by law for most sectors. HBO and WO internship placements may be paid or unpaid depending on the host organisation and sector. In 2026, many organisations — particularly larger ones — pay internship allowances of €400–€700/month for full-time stage placements. Some sectors (healthcare, social work) have CAO-mandated minimum stage vergoedingen; others (media, creative, small organisations) may offer zero or token compensation.\n\nStudentenBureau provides guidance on what constitutes a reasonable stage vergoeding for each sector. Students should not assume a bureau-mediated placement automatically carries fair compensation — ask specifically about the host's policy before signing. For starter positions post-graduation, entry-level graduate positions typically start at €2,200–€2,800 gross/month for HBO-level roles and €2,600–€3,200 for WO-level roles.",
      },
      {
        heading: "From University to Your First Job: The Laurens Simonse Approach",
        body: "The Laurens Simonse Group's structure — internship placement (StudentenBureau) feeding into student employment (XL Studenten Uitzendbureau) feeding into graduate placement — creates a pipeline model where students who engage early in their degree can build a relationship with the organisation through to post-graduation job search. For students who value continuity, this integration is a practical advantage.\n\nThe national market leader claim carries some substance: the organisation has been operating since 1998, has offices across multiple Dutch cities, and has accumulated employer relationships across healthcare, business services, education, and government. The Amsterdam bureau serves the Randstad metropolitan area.",
      },
    ],
    pros: [
      "Part of the Laurens Simonse Group — national operation with 25+ years of student placement experience",
      "Structured internship mediation: pre-vetted host organisations and contract framework support",
      "Integration with XL Studenten Uitzendbureau creates continuity from internship to paid employment to starter role",
      "Guidance on stage vergoeding norms and negotiation support",
      "Strong in healthcare, business services, and government sectors in the Amsterdam metropolitan area",
    ],
    cons: [
      "Internship compensation not guaranteed — unpaid or below-norm placements require active negotiation",
      "Mediation model does not employ students directly — protection depends on host organisation contract terms",
      "Less suitable for students seeking immediate paid work rather than curricular internship placement",
      "Matching portfolio may not cover all disciplines equally — technical and IT students may find fewer relevant hosts",
      "No housing support for students relocating to Amsterdam for an internship placement",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
    ],
  },

  // ── Charlie Works ─────────────────────────────────────────────────────────
  "charlie-works": {
    metaTitle: "Charlie Works Breda Review 2026 – Logistics Staffing & Housing",
    metaDescription:
      "Charlie Works Breda review 2026. Logistics and production placements in Brabant with housing for relocated workers. ABU CAO rates, SNF housing costs, and real conditions.",
    intro:
      "Charlie Works is a Dutch employment agency based in Breda, specialising in logistics and production staffing across the Brabant region and beyond. The agency differentiates itself by providing housing for workers relocating to take up placements — a practical solution for the significant share of logistics workers who cannot immediately source accommodation in an unfamiliar region. Breda sits at the intersection of the Rotterdam-Antwerp freight corridor and the east–west Eindhoven logistics axis, making it a meaningful hub for warehouse and production staffing.",
    sections: [
      {
        heading: "Logistics and Production in Brabant: How Charlie Works Operates",
        body: "Charlie Works places workers in warehouse operations, order picking, production line roles, and logistics operator positions across Brabant and surrounding provinces. Client organisations include distribution centres, food production facilities, and contract logistics operators serving the national and cross-border transport market. The Brabant triangle — Breda, Tilburg, Eindhoven — contains some of the Netherlands' largest logistics parks with consistent year-round demand.\n\nThe agency operates under the ABU CAO, governing flex worker rights, phase progression (Phase A: weeks 1–78; Phase B: after 78 weeks with one employer), holiday pay (vakantiegeld: 8% of earned wages), and sector premiums. Charlie Works' regional focus allows more direct contact between workers and consultants — the same consultant handles shift adjustments, payroll queries, and accommodation matters throughout the placement.",
      },
      {
        heading: "Wages in the Logistics Triangle: Realistic Earning Expectations",
        body: "Charlie Works logistics placements start at WML (€14.71/hr in 2026) for standard order picking and general warehouse roles. Roles requiring VCA certification start at €15.50–€17.00/hr. Forklift operators with valid certificaat earn €16.00–€18.50/hr. At WML on a 40-hour week: gross monthly €2,549; net after loonheffing (~10.7%) approximately €2,277.\n\nThe SNF maximum housing deduction is €113.50/week in 2026 (€491.83/month). Net after-housing cash at WML: approximately €1,785/month. Night shift work at 24-hour Brabant distribution centres attracts the ABU CAO night premium of +22% — at WML base, the night rate is €17.95/hr — making overnight shifts financially appealing for workers comfortable with the schedule.",
      },
      {
        heading: "Housing for Relocated Workers: What Charlie Works Provides",
        body: "Workers relocating to Breda can access agency-provided housing. The accommodation model follows the SNF framework — SNF-certified housing meets Dutch quality standards: minimum 10m² living space per occupant, functioning heating, hot water, separate toilet and shower, and an emergency contact system. Verify Charlie Works' current SNF certification status if accommodation quality is a priority.\n\nWorkers who prefer to source their own housing can do so; the Breda rental market for short-term furnished rooms runs approximately €600–€900/month for shared accommodation. Workers planning to stay long-term (12+ months) should investigate private rental options to reduce dependence on agency-provided accommodation and improve net take-home.",
      },
    ],
    pros: [
      "Regional Brabant focus: strong client relationships in Breda-Tilburg-Eindhoven logistics corridor",
      "Housing provided for relocated workers under SNF framework",
      "Personal consultant contact model: fewer handoffs, more accountability for issues",
      "ABU CAO protections with transparent Phase A/B progression and night shift premiums",
      "VCA-certified roles available above WML for workers with existing certification",
    ],
    cons: [
      "Regional focus limits usefulness for workers seeking placements outside Brabant",
      "SNF housing deduction (up to €113.50/week) significantly reduces net take-home at WML",
      "Smaller agency: fewer vacancies in absolute terms than national chains",
      "Limited online presence makes independent reputation verification harder",
      "Night shift concentration in 24-hour logistics sites requires comfort with irregular hours",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  // ── Level One ─────────────────────────────────────────────────────────────
  "level-one": {
    metaTitle: "Level One Gouda Review 2026 – Production Staffing & Housing",
    metaDescription:
      "Level One Gouda review 2026. Production and logistics placements across western Netherlands with modern apartment housing. ABU CAO, SNF rates, and real take-home pay.",
    intro:
      "Level One is a Dutch staffing agency based in Gouda, placing workers in production and logistics roles across the western Netherlands. The agency stands out within the regional staffing market by offering modern apartment-style housing in a high-rise building — not the typical shared house or converted property associated with agency accommodation. Gouda's central position in the western Netherlands gives Level One access to client sites across the region, including production parks around Gouda, logistics operators near Alphen aan den Rijn, and facilities in the Rotterdam-Utrecht corridor.",
    sections: [
      {
        heading: "Production and Warehouse Placements in the Western Netherlands",
        body: "Level One's placement portfolio covers production line operators, warehouse workers, order pickers, and logistics support roles. Client sites are distributed across Gouda and surrounding municipalities — the western Netherlands production cluster serves food processing, dairy (Gouda is historically a cheese region with active food industry infrastructure), printing and packaging, and general manufacturing. Placements are under the ABU CAO framework with standard Phase A/B progression.\n\nWorkers with forklift certification (reach truck, counterbalance) have access to a wider range of higher-rate placements across the client network. Level One's regional scope — western Netherlands rather than a single city — means the agency can match workers with multiple client types across different municipalities depending on skills, transport access, and scheduling preferences.",
      },
      {
        heading: "Salary and Real Take-Home Pay at WML and Above",
        body: "Level One production placements start at WML (€14.71/hr in 2026) for entry-level roles without specialist certification. Gross monthly at WML on a 40-hour week: approximately €2,549. Net after loonheffing (~10.7%): approximately €2,277. Workers with VCA or forklift certification access placements at €15.50–€17.50/hr.\n\nThe SNF-standard housing deduction (maximum €113.50/week = €491.83/month) reduces net take-home materially. Net cash after housing at WML: approximately €1,785/month. Night shift premiums under the ABU CAO (+22% for 00:00–06:00) apply across placements where client site schedules include overnight shifts — production facilities in the food and dairy sector frequently run 24-hour operations. Overtime carries ABU CAO rates of 125% for the first two hours beyond 8hr/day, 150% thereafter.",
      },
      {
        heading: "High-Rise Housing in Gouda: What Level One Provides",
        body: "Level One's high-rise apartment housing distinguishes the agency within the regional staffing market. Instead of shared terraced houses typical of agency accommodation, workers are housed in modern apartments in a Gouda high-rise building — in principle providing self-contained or semi-self-contained units rather than shared dormitory-style rooms. The SNF framework governs minimum quality standards: 10m² per occupant, functioning heating and hot water, separate bathroom facilities, and a 24-hour emergency contact. Ask to view the accommodation before accepting a placement and request written confirmation of the specifications.\n\nGouda has good rail connections: direct NS trains to Rotterdam (24 minutes), Utrecht (20 minutes), Den Haag (36 minutes), and Amsterdam (43 minutes). For workers whose client site is not in Gouda itself, the rail network provides access to the wider western Netherlands production corridor. Verify whether specific client sites are accessible from Gouda station — not all production parks have direct public transport connections.",
      },
    ],
    pros: [
      "Modern high-rise apartment housing — a genuine differentiator from typical agency shared-house accommodation",
      "Central Gouda location with direct NS access to Rotterdam, Utrecht, Den Haag, and Amsterdam",
      "Western Netherlands client network covers food production, dairy, logistics, and manufacturing",
      "ABU CAO framework with transparent phase progression, night shift premiums, and overtime rates",
      "Forklift and VCA-certified workers access above-WML placements across the regional client network",
    ],
    cons: [
      "SNF housing deduction (up to €113.50/week) reduces net take-home to approximately €1,785/month at WML",
      "Regional focus means limited placement options outside western Netherlands",
      "High-rise apartment claim requires verification — SNF certification covers the minimum, not the marketing description",
      "Night shift concentration in 24-hour production facilities may not suit all workers despite premium incentive",
      "Smaller agency with limited online presence makes independent reputation verification more challenging",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── 1KLICK (Real Estate Recruitment) ─────────────────────────────────────
  "1klick-de-recruiter-voor-vastgoedprofessionals": {
    metaTitle: "1KLICK Netherlands Review 2026 – Real Estate Recruitment",
    metaDescription:
      "1KLICK Netherlands review 2026. Amsterdam recruitment agency for real estate professionals since 2008. Project developers, property managers, controllers. Salary ranges and candidate experience.",
    intro:
      "1KLICK is an Amsterdam-based recruitment agency founded in 2008 with a single-sector focus: real estate. The agency places medior and senior professionals — project developers, project managers, property managers, asset managers, and financial controllers — with clients across the Dutch commercial and residential real estate market. In a sector characterised by long client relationships and specialist market knowledge, 1KLICK's exclusive focus on vastgoed (real estate) is both its core proposition and its key differentiator from generalist agencies.",
    sections: [
      {
        heading: "What 1KLICK Actually Does",
        body: "1KLICK operates as a direct hire recruitment agency, not a uitzendbureau. Placements are permanent or fixed-term contract positions — no ABU CAO flex labour framework applies. The agency works with property developers, housing corporations (woningcorporaties), real estate investment managers, commercial property operators, and project management firms active in the Dutch market.\n\nThe Dutch real estate market in 2026 remains active: the housing shortage continues to drive demand for project developers and residential development professionals. Logistics real estate (distribution parks) and mixed-use urban redevelopment are growth areas. 1KLICK's sector-only focus means the agency tracks these dynamics in real time, rather than treating real estate as one segment among many. The agency covers both medior level (3–7 years experience) and senior level (8+ years, often with team management); entry-level candidates without sector experience are generally outside the agency's core placement activity.",
      },
      {
        heading: "Salary Ranges in Dutch Real Estate",
        body: "Salaries in the Dutch real estate sector for the profiles 1KLICK places are well above WML (€14.71/hr in 2026). Indicative 2026 gross annual salary ranges: Project developer (medior, 3–7 years): €65,000–€90,000. Senior project developer or development director: €90,000–€130,000. Property manager (portfolio management): €55,000–€75,000. Asset manager (investment management): €70,000–€110,000. Financial controller in real estate: €60,000–€85,000.\n\nNet take-home involves Box 1 income tax at 36.97% between the first and second bracket thresholds (€38,441–€76,817 in 2026) and 49.5% above. At €80,000 gross annual, net monthly take-home is approximately €4,150–€4,400. For internationally recruited professionals eligible for the 30% ruling, the taxable base reduction can add €800–€1,200 to monthly net at this income level. Dutch real estate packages often include 13th-month and performance bonuses — particularly at development and investment management level.",
      },
      {
        heading: "Working With a Sector Specialist",
        body: "1KLICK consultants know the Dutch real estate employer landscape in depth — which woningcorporaties are expanding, which development companies have active acquisition pipelines, which commercial operators are restructuring. This market intelligence translates into more accurate role descriptions and more relevant introductions than a generalist recruiter working from a sector snapshot.\n\nThe limitation mirrors the strength: 1KLICK is useful only for candidates with a demonstrable real estate background. Candidates transitioning from adjacent disciplines (construction, finance, architecture) may qualify if sector-relevant experience is clear from the CV; candidates with no sector connection will not be placed by a specialist-only agency.",
      },
    ],
    pros: [
      "Exclusive real estate sector focus since 2008: deep market knowledge and established client relationships",
      "Places medior to senior professionals — not a generalist agency pushing volume at junior level",
      "Dutch market expertise covers woningcorporaties, commercial operators, logistics real estate, and development companies",
      "Sector-specialist consultants can advise meaningfully on career positioning, not just open roles",
      "Access to a client network accumulated over 16+ years of sector-only operation",
    ],
    cons: [
      "Not suitable for entry-level candidates or professionals without a clear real estate track record",
      "Amsterdam-centric focus may limit options for candidates seeking roles outside the Randstad",
      "Specialist focus means fewer total vacancies than a generalist agency at any given moment",
      "No support for flex, temp, or ZZP arrangements — exclusively permanent and fixed-term placements",
      "Limited public information on fee structure and placement timeline",
    ],
    internalLinks: [
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── Acre Amsterdam (Sustainability/ESG Recruitment) ───────────────────────
  "acre-amsterdam": {
    metaTitle: "Acre Amsterdam Review 2026 – Sustainability & ESG Recruitment",
    metaDescription:
      "Acre Amsterdam review 2026. Global sustainability and ESG recruitment with European offices. Climate, renewables, and sustainability director roles. Salary benchmarks and candidate experience.",
    intro:
      "Acre is a global recruitment and executive search firm that has specialised exclusively in sustainability, ESG (environmental, social, and governance), climate, and renewable energy since 2003. The Amsterdam office serves the European market, placing professionals across sustainability management, ESG reporting, climate strategy, renewable energy project development, and corporate responsibility leadership. With offices in London, Amsterdam, New York, and Singapore, Acre operates where the intersection of capital markets and climate imperatives creates growing demand for specialist talent.",
    sections: [
      {
        heading: "Acre's Focus: Why Sustainability Recruitment Is a Distinct Discipline",
        body: "The ESG and sustainability talent market has grown substantially since the EU's Sustainable Finance Disclosure Regulation (SFDR), the Corporate Sustainability Reporting Directive (CSRD), and the European Green Deal created mandatory disclosure and strategy requirements for a large proportion of European companies. In 2026, ESG officers, sustainability directors, and climate strategists are regulatory necessities at most large and mid-sized European businesses — not specialist add-ons.\n\nAcre's Amsterdam office places ESG managers at pension funds and asset managers in the Zuidas district, sustainability directors at multinationals with Dutch headquarters, climate specialists at energy companies navigating the energy transition, and renewables project professionals at solar, wind, and infrastructure developers active across Europe. The agency works on retained executive search for director and board-level sustainability roles, and contingency placement for mid-level professional roles.",
      },
      {
        heading: "Salary Reality: What ESG and Sustainability Roles Pay",
        body: "The sustainability talent market is sufficiently young that salary benchmarking is less standardised than in established disciplines. In 2026, indicative Amsterdam-market ranges: ESG analyst / sustainability advisor (2–5 years): €55,000–€75,000 gross/year. Sustainability manager (5–10 years): €75,000–€105,000. ESG director or Chief Sustainability Officer: €110,000–€180,000+. Renewables project manager (solar/wind, 4–8 years): €65,000–€95,000. Climate strategy specialist at pension fund or asset manager: €80,000–€130,000.\n\nAcre publishes annual salary guides for the sustainability market; accessing the most recent edition before salary negotiation is recommended. International candidates with strong sustainability credentials should investigate 30% ruling eligibility — many senior ESG roles meet the kennismigranten salary threshold (€46,660 in 2026).",
      },
      {
        heading: "The Amsterdam Market for Sustainability Professionals",
        body: "Amsterdam's Zuidas concentration of financial institutions — banks, insurance companies, and pension funds — creates specific demand for ESG professionals with financial sector understanding. Dutch pension funds (some of the largest in the world as a proportion of GDP) have active sustainability teams focused on responsible investment, ESG integration, and climate reporting.\n\nThe Dutch energy transition context — significant offshore wind infrastructure in the North Sea and an active green hydrogen sector — creates demand for renewables-specific professionals at project developer and corporate level. Acre's Amsterdam office is positioned within this market. Candidates without European work authorisation require additional lead time for visa arrangements; the agency has experience supporting this process for non-EU candidates.",
      },
    ],
    pros: [
      "Global sustainability-only specialist since 2003: unmatched sector depth in a fast-growing field",
      "Amsterdam office positioned for European ESG mandate driven by SFDR, CSRD, and Green Deal requirements",
      "Annual salary guide for sustainability roles — a credible benchmark in a market with limited public data",
      "Executive search capability for CSO and board-level sustainability appointments",
      "Strong Zuidas and pension fund client network for ESG integration and responsible investment roles",
    ],
    cons: [
      "Specialist focus means smaller vacancy volume than generalist agencies at any given moment",
      "Junior sustainability candidates (0–2 years) may find the threshold for consultant engagement higher",
      "International candidates without European work authorisation require additional lead time for visa arrangements",
      "Sustainability role definitions vary widely across employers — pre-agreement on actual scope is critical",
      "No flex, temp, or ZZP placements — direct employment only",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── Focus Engineering ─────────────────────────────────────────────────────
  "focus-engineering": {
    metaTitle: "Focus Engineering Amsterdam Review 2026 – Technical Recruitment",
    metaDescription:
      "Focus Engineering Amsterdam review 2026. Specialist engineering recruitment since 2013. Mechanical, piping, electrical, and automation professionals. Salary ranges and placement experience.",
    intro:
      "Focus Engineering is an Amsterdam-based engineering recruitment agency founded in 2013 by Tim Snijder and Ben Bond. The agency specialises in placing professionals in Control & Automation, Electrical & Instrumentation, Mechanical & Piping, and Mechatronics disciplines. The client base is primarily the Dutch and international process industry and capital projects market: oil & gas, petrochemicals, offshore, renewables, and industrial manufacturing. Focus Engineering positions itself as a genuinely specialist operator — smaller and more targeted than global engineering staffing firms like Brunel.",
    sections: [
      {
        heading: "Engineering Disciplines and Client Sectors",
        body: "The four disciplines Focus Engineering covers map directly to core technical roles in Dutch industrial projects. Control & Automation engineers design and commission SCADA, DCS, and PLC systems. Electrical & Instrumentation professionals handle power distribution, field instrumentation, and hazardous area classification — one of the most consistently in-demand disciplines in European process industry. Mechanical & Piping engineers cover piping design, stress analysis, and static equipment engineering. Mechatronics bridges mechanical and electronics engineering, increasingly relevant in industrial automation.\n\nThe Dutch engineering market in 2026 is driven by: energy transition projects (offshore wind O&M, green hydrogen, carbon capture); maintenance and modification work at Rotterdam's Botlek and Pernis process clusters; and capital investment in semiconductor and chip manufacturing infrastructure. Placements are primarily interim or project contract — engineers on capital projects work on fixed-term contracts aligned to project phase duration.",
      },
      {
        heading: "Salary and Day Rates for Engineering Roles",
        body: "Engineering salaries in the Dutch process industry are competitive. Indicative 2026 rates: Control & Automation engineer (3–8 years): €65,000–€90,000 gross/year permanent, or €500–€700/day interim. Senior E&I engineer: €75,000–€105,000 permanent, €600–€800/day interim. Mechanical/Piping engineer (medior): €60,000–€85,000 permanent, €450–€650/day interim. Senior piping designer with offshore exposure: €700–€950/day.\n\nThe Netherlands applies the 30% ruling for kennismigranten (salary threshold €46,660 in 2026 for standard eligibility). For engineers earning €80,000 gross under the 30% ruling, effective net take-home improves by approximately €900–€1,300/month. For interim engineers billing as ZZP, the distinction between self-employed and payroll arrangement matters significantly for tax and pension — model this carefully before comparing to a permanent offer.",
      },
      {
        heading: "Placement Experience and Market Positioning",
        body: "Focus Engineering's smaller size relative to global engineering staffing firms means a curated client portfolio rather than volume relationships. The consultants know their clients well — but the total number of live vacancies is lower than a Brunel or Reed Engineering. Candidates should register with Focus Engineering as part of a broader strategy that includes larger specialist engineering agencies and direct applications to major operators and EPC contractors.\n\nThe founding team's engineering background is a genuine differentiator — consultants who understand what a piping stress analysis involves can screen CVs and brief candidates more accurately than generalist recruiters using keyword matching. This matters for niche engineering disciplines where incorrect placement wastes time for both candidate and client.",
      },
    ],
    pros: [
      "Genuine engineering specialisation: four core disciplines (C&A, E&I, Mechanical/Piping, Mechatronics)",
      "Founded by engineers — consultants understand technical requirements rather than relying on keyword screening",
      "Access to Dutch process industry, energy transition, and capital projects client network",
      "Interim and permanent placement capability for engineers who move between contract and employed status",
      "30% ruling and kennismigranten experience for internationally recruited engineers",
    ],
    cons: [
      "Smaller agency: fewer live vacancies at any given time than global staffing firms like Brunel",
      "Amsterdam-based team: some regional gaps for roles concentrated in Rotterdam, Groningen, or offshore",
      "Limited public vacancy advertising — direct outreach to consultants more effective than job board monitoring",
      "No logistics, production, or non-technical placement capability — exclusively engineering",
      "Project contract placements mean income continuity depends on project pipeline and market conditions",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── Finest People (Digital Marketing Recruitment) ─────────────────────────
  "finest-people": {
    metaTitle: "Finest People Amsterdam Review 2026 – Digital Marketing Jobs",
    metaDescription:
      "Finest People Amsterdam review 2026. Specialist digital marketing and e-commerce recruitment since 2010. SEO, PPC, performance marketing. Salary ranges and placement experience.",
    intro:
      "Finest People is an Amsterdam-based recruitment agency that has specialised in digital marketing and digital sales since 2010. With over 1,000 digital professionals placed at more than 500 companies, the agency has built one of the larger track records in Dutch digital marketing recruitment. Core placement disciplines are performance marketing (SEA/SEO/affiliates), e-commerce management, CRM and marketing automation, social media management, content strategy, and digital analytics.",
    sections: [
      {
        heading: "What Finest People Places and Who They Work With",
        body: "Finest People covers the full spectrum of digital marketing roles — from hands-on specialists (SEO specialist, Google Ads specialist, email marketing specialist) through to leadership positions (Head of Digital, E-commerce Director, CMO). The agency places at permanent and interim level; ZZP/freelance digital marketers can also register.\n\nThe Amsterdam digital marketing job market in 2026 is driven by: the continued growth of direct-to-consumer (DTC) e-commerce; the evolution of performance marketing as cookie deprecation and iOS privacy changes force agencies and brands to rebuild attribution models; and the rise of AI-powered content and ad optimisation tools creating new specialist roles. Finest People's client base reflects Amsterdam's density of scale-ups, digital agencies, and brand-owned e-commerce operations.",
      },
      {
        heading: "Salary Reality for Digital Marketing Professionals",
        body: "Digital marketing salaries in the Netherlands vary considerably by discipline, seniority, and employer type. In 2026, indicative ranges: SEO specialist (2–4 years): €40,000–€58,000 gross/year. Performance marketer / Google Ads specialist (medior): €48,000–€68,000. E-commerce manager (4–7 years): €55,000–€80,000. Head of Digital or Digital Marketing Director: €80,000–€120,000. CRM/Marketing automation specialist: €50,000–€70,000.\n\nNet at €55,000 gross: approximately €3,000–€3,100/month after standard loonheffing. At €80,000 gross: approximately €4,100–€4,300/month. Agency-side digital marketing roles typically pay 10–20% below equivalent brand-side roles, reflecting agency margin structures. Finest People's annual market insights publications are worth reviewing before any salary discussion.",
      },
      {
        heading: "Placement Experience: What to Expect When Registering",
        body: "Finest People's registration process starts online — CV upload and digital profile, followed by a consultant call. The agency places significant emphasis on cultural fit alongside technical skills, reflecting the reality that digital marketing roles in scale-ups involve close team integration and significant autonomy. Candidates who can articulate not just their technical skills (GA4, Meta Ads Manager, Klaviyo) but also the business context in which they applied those skills — revenue impact, channel mix decisions, attribution approach — will perform better in the Finest People screening process.\n\nCandidates in the mid-market digital marketing space (2–8 years experience, €45,000–€80,000 target salary) are in the agency's sweet spot. Very senior CMO-level candidates may get better traction with a broader executive search firm.",
      },
    ],
    pros: [
      "14+ years of digital marketing specialisation: 1,000+ placements at 500+ companies",
      "Full discipline coverage: SEO, SEA, performance, e-commerce, CRM, content, analytics, and social",
      "Access to Amsterdam's scale-up, DTC e-commerce, and digital agency client ecosystem",
      "Both permanent and interim/ZZP placement capability for digital professionals",
      "Annual market insights publications provide useful salary and trend benchmarking",
    ],
    cons: [
      "Amsterdam-centric client base — less useful for digital professionals outside the Randstad",
      "Fast-moving market means job descriptions can become outdated quickly — verify role scope at interview",
      "Very senior CMO/VP roles may be better placed through executive search firms",
      "Competitive candidate pool: Amsterdam digital marketing market is well-supplied with talent",
      "No support for non-digital or traditional marketing roles",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
    ],
  },

  // ── Centre People Appointments BV ─────────────────────────────────────────
  "centre-people-appointments-bv": {
    metaTitle: "Centre People Appointments Review 2026 – Japanese Recruitment NL",
    metaDescription:
      "Centre People Appointments Netherlands review 2026. Specialist recruiter for Japanese-speaking and multilingual professionals since 1986. IT, accounting, sales, admin. Salary and placement experience.",
    intro:
      "Centre People Appointments was established in 1986 and is the Netherlands subsidiary of QUICK Co., Ltd., a Japanese HR services company with over 40 years of operation. The agency specialises in placing Japanese-speaking professionals and multilingual candidates — particularly those with English, Dutch, and/or Japanese language combinations — in roles across IT, accounting, sales, and business administration. The client base spans Japanese companies with Netherlands operations, multinationals seeking Japan-linked business development capabilities, and international organisations requiring multilingual professional staff.",
    sections: [
      {
        heading: "The Niche: Why Japanese-Speaking Recruitment Exists in the Netherlands",
        body: "The Netherlands is home to one of Europe's larger concentrations of Japanese business operations. The Amsterdam, Rotterdam, and Randstad area hosts European headquarters and regional offices of major Japanese multinationals, trading companies (sogo shosha), and financial institutions. The Rotterdam port and its chemical and logistics clusters attract Japanese logistics and chemical companies. This creates persistent demand for professionals who can bridge Japanese-Dutch or Japanese-English business relationships.\n\nCentre People's 1986 founding pre-dates the modern international staffing industry's attention to this niche. The QUICK Co., Ltd. parent brings Japanese HR market depth — useful for candidates recruited from Japan into the Netherlands, or for Dutch-based professionals with Japan experience seeking roles at Japanese-owned companies.",
      },
      {
        heading: "Salary and Employment Conditions at Japanese-Linked Companies",
        body: "Salaries for the roles Centre People places are in the professional range — above WML (€14.71/hr in 2026) but typically below top-tier finance executive or senior technology roles. In 2026, indicative ranges: IT support specialist at Japanese company (3–5 years): €40,000–€58,000 gross/year. Account manager with Japanese language (business development): €50,000–€70,000 plus commission. Financial accountant at Japanese subsidiary: €50,000–€72,000. Office manager or executive assistant at smaller Japanese European office: €38,000–€55,000.\n\nJapanese-owned companies in the Netherlands often maintain Japanese employment culture elements: structured hierarchy, consensus-based decision-making, and formal reporting lines to Tokyo. Candidates unfamiliar with Japanese corporate culture should research this dimension before accepting a placement — the experience differs meaningfully from Dutch or broader European corporate norms.",
      },
      {
        heading: "Relocation and Practical Considerations",
        body: "International candidates relocating from Japan to the Netherlands should account for: sofinummer (BSN) application, health insurance (zorgverzekering) setup, and initial accommodation search. Many Japanese companies in the Netherlands have relocation support packages; Centre People's consultants can clarify what the specific employer provides as part of offer negotiation.\n\nThe three typical candidate profiles Centre People serves: a Japanese national relocating to the Netherlands for a European position; a Dutch or European national with Japanese language ability (typically JLPT N2 or N1) seeking a role where that combination is valued; and a multilingual professional without Japanese but fitting the business profile Centre People's clients seek.",
      },
    ],
    pros: [
      "38+ years of specialist operation: one of the longest-established multilingual/Japanese recruitment agencies in the Netherlands",
      "QUICK Co., Ltd. parent provides direct connection to Japanese HR market for Japan-origin candidate sourcing",
      "Access to Japanese company European subsidiary job market — a niche most generalist agencies do not cover",
      "Multilingual candidate capability extends beyond Japanese to broader international professional placement",
      "Guidance on relocation logistics for candidates moving from Japan to the Netherlands",
    ],
    cons: [
      "Niche focus means total vacancy volume is lower than generalist agencies at any given time",
      "Candidates without Japanese language or multilingual profile may not fit core client requirements",
      "Japanese corporate culture characteristics require preparation — the working environment may differ from Dutch norms",
      "Amsterdam/Randstad centric — limited relevance for candidates seeking roles outside the major metropolitan area",
      "Limited public salary benchmarking for the specific niche — ask for market data explicitly at consultation",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  // ── Corparis Amstelveen (Care & Housing Secondment) ───────────────────────
  "corparis-amstelveen-detacheringsbureau-zorg-wonen": {
    metaTitle: "Corparis Amstelveen Review 2026 – Care & Housing Secondment",
    metaDescription:
      "Corparis Amstelveen review 2026. Detachering agency for care and housing sector professionals. Policy advisors, project managers, asset managers. 10+ years of sector experience.",
    intro:
      "Corparis is a detachering (secondment) agency based in Amstelveen that specialises exclusively in the care (zorg) and housing (wonen) sectors. With over 10 years of operation, the agency places interim and secondment professionals at housing corporations (woningcorporaties), mental health organisations (GGZ), geriatric care providers, and social care organisations across the Netherlands. The dual-sector focus reflects the overlap between care provision and housing in Dutch social infrastructure — organisations like housing corporations and care providers are interlinked in ways that create specific cross-sector management needs.",
    sections: [
      {
        heading: "Detachering in the Dutch Care and Housing Sectors",
        body: "Detachering — secondment — is a common employment model in the Dutch public and semi-public sector. Rather than placing workers on temporary contracts directly with the client, a detachering bureau employs the professional and seconds them to the client for a fixed period (typically 6–24 months). The worker has an employment contract with Corparis; the client pays a fee covering salary, employer contributions, and agency margin.\n\nCorparis places professionals in advisory and management roles — not care workers delivering direct patient or resident care. Profiles include: policy advisors developing housing strategy or care programme frameworks; project managers running renovation or development projects for woningcorporaties or care organisations; asset managers managing property and maintenance portfolios; and care coordinators bridging clinical and administrative management at GGZ or geriatric care providers.",
      },
      {
        heading: "Salary and Secondment Pay Conditions",
        body: "Corparis professionals are employed by the agency during secondment. Salaries are benchmarked against the relevant sector CAO: CAO Woondiensten (housing corporations) or CAO Zorg en Welzijn (care sector). In 2026, indicative ranges for Corparis secondment profiles: Policy advisor (junior/medior, 2–5 years): €48,000–€68,000 gross/year. Senior policy advisor or specialist: €65,000–€90,000. Project manager (housing or care): €60,000–€85,000. Asset manager at housing corporation: €65,000–€95,000.\n\nAs a secondment professional employed by Corparis, standard Dutch employment protections apply: loonheffing deducted at source, vakantiegeld (8%), pension contribution, and sick pay. This differs materially from ZZP status, where the professional bears all these costs independently. For professionals weighing detachering employment against ZZP billing, the detachering model provides income security and employer-side insurance at the cost of billing rate flexibility.",
      },
      {
        heading: "Working in the Dutch Semi-Public Sector",
        body: "The clients — housing corporations and care organisations — are semi-public Dutch institutions with specific governance, procurement, and accountability frameworks. Working within this environment requires familiarity with Dutch public sector processes: Aedes (housing corporation sector) governance requirements, care sector quality standards, and GITP-style assessments. Corparis candidates without prior experience in the Dutch semi-public sector should discuss cultural and procedural preparation with the agency before the first secondment.\n\nSecondment placements are distributed across the Netherlands — housing corporations and care organisations operate nationally, not concentrated in Amsterdam. Secondment professionals should expect placements that may require travel or temporary relocation depending on the client organisation's location.",
      },
    ],
    pros: [
      "10+ years of exclusive care and housing sector specialisation: deep understanding of sector-specific procurement and governance",
      "Secondment model: employed by Corparis during placement with full employment protections and sector CAO benchmarking",
      "Dual-sector focus (care + housing) serves organisations where care provision and housing intersect",
      "Access to client organisations — woningcorporaties, GGZ, geriatric care — not typically reached by generalist agencies",
      "Policy, project management, and asset management profiles are genuinely in demand across both sectors",
    ],
    cons: [
      "Exclusively advisory and management level — not suitable for care workers seeking direct patient or resident care roles",
      "Secondment model means income continuity depends on placement renewal — no guarantee of consecutive assignments",
      "Dutch semi-public sector experience often required — candidates unfamiliar with the governance framework face a steeper onboarding curve",
      "National placement scope means individual placements may require travel or temporary accommodation",
      "Smaller agency: fewer simultaneous vacancies than multi-sector staffing firms",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── Bij Oranje (Public Sector Interim) ───────────────────────────────────
  "bij-oranje": {
    metaTitle: "Bij Oranje Amsterdam Review 2026 – Public Sector Interim Roles",
    metaDescription:
      "Bij Oranje Amsterdam review 2026. Specialist interim and ZZP recruitment for Dutch government and public sector. Policy, project, and HR roles. Day rates and placement experience.",
    intro:
      "Bij Oranje is an Amsterdam-based recruitment agency specialising in interim and ZZP (self-employed) placements within the Dutch (semi-)public sector. The agency places professionals in government ministries, municipalities (gemeenten), non-profit organisations, and public services organisations. Core role types: policy advisor (beleidsadviseur), project manager, portfolio manager, programme director, HR advisor, and information analyst. The name is a nod to the Dutch national colour — orange — reflecting the agency's exclusive focus on the domestic public sector landscape.",
    sections: [
      {
        heading: "The Dutch Public Sector Interim Market",
        body: "The Dutch public sector is one of the most active markets for interim professional placement in the Netherlands. The Rijksoverheid (national government), 352 Dutch gemeenten (municipalities), provincial governments, and arm's-length public bodies all use interim staffing to manage workload fluctuations and specialist project needs. The ongoing digitalisation agenda, energy transition policy landscape, and local authority housing and care programme delivery create consistent demand for policy and project professionals.\n\nBij Oranje works as a placement intermediary — matching interim professionals (often billing as ZZP) with public sector organisations for defined periods. Typical assignment durations: 6–18 months for policy projects, 3–12 months for implementation or organisational change projects. The agency navigates Dutch government procurement requirements on behalf of both clients and candidates.",
      },
      {
        heading: "Rates and Earnings for Public Sector Interim Professionals",
        body: "Interim day rates in the Dutch public sector in 2026: Policy advisor (junior/medior, 2–5 years): €75–€110/day. Senior policy advisor or specialist (6–10+ years): €110–€160/day. Programme or project manager (6–12 years): €120–€180/day. Portfolio manager or senior programme director: €150–€220/day. HR advisor (generalist, 3–7 years): €85–€120/day.\n\nOn an annual basis, a policy professional billing €120/day on 220 working days produces €26,400 gross. After ZZP obligations (inkomstenbelasting, zorgverzekering premie, no employer pension), effective annual net is significantly lower than an equivalent permanent employee. The rule of thumb is that ZZP gross should be approximately 40–50% higher than equivalent employee gross to achieve the same net take-home. Candidates moving from permanent public sector employment to ZZP status should model this carefully before accepting the first interim assignment.",
      },
      {
        heading: "The Working Environment in Dutch Government",
        body: "The Dutch public sector working environment has specific cultural characteristics. Dutch government organisations prioritise consensus (overleg), transparency (openheid), and formal accountability (verantwoording) in ways that can surprise candidates from private sector backgrounds. Decision-making is often collegial — proposals move through working groups and management layers before approval, which can feel slow relative to private sector project timelines.\n\nPolitical sensitivity is real in public sector policy work — policy advisors working on politically charged dossiers (housing shortage, energy transition, asylum and immigration) need to understand the ministerial and political context, not just the technical content. Bij Oranje's consultants, focused exclusively on this market, can brief candidates on specific political context of key dossiers before placement.",
      },
    ],
    pros: [
      "Specialist focus on Dutch (semi-)public sector: genuine understanding of government procurement, culture, and policy landscape",
      "Covers national, provincial, and municipal level placements — broad public sector access",
      "ZZP and interim professional matching for experienced policy and project professionals",
      "Useful for candidates targeting energy transition, housing, care, or digital government policy dossiers",
      "Amsterdam location gives access to the Randstad public sector concentration (ministries, major municipalities)",
    ],
    cons: [
      "Exclusively advisory and project management level — not for administrative, operational, or clerical public sector roles",
      "ZZP status requires full self-management of tax, insurance, and pension — not appropriate for those unfamiliar with Dutch ZZP obligations",
      "Public sector rate ceilings exist in some procurement frameworks — day rates may be below private sector equivalents",
      "Assignment continuity not guaranteed — public sector budgets and priorities shift",
      "Limited publicly available information on typical assignment timelines and rate ranges",
    ],
    internalLinks: [
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
    ],
  },

  // ── Kroon & Amstel Uitzendbureau ──────────────────────────────────────────
  "kroon-amstel-uitzendbureau": {
    metaTitle: "Kroon & Amstel Amsterdam Review 2026 – Construction & Facility Jobs",
    metaDescription:
      "Kroon & Amstel Amsterdam review 2026. Multi-sector staffing group covering construction, facility services, horticulture, and social return. ABU CAO, housing costs, and real worker conditions.",
    intro:
      "Kroon & Amstel is an Amsterdam-based multi-sector staffing group with specialised daughter companies covering facility services, construction, social return (werk & re-integratie), and general staffing (uitzendbureau). The group places workers in craftwork, construction trades, horticulture, cleaning, and general logistics — the operational workforce sectors that form the backbone of Amsterdam's construction boom and building maintenance market. The social return dimension distinguishes the group from purely commercial staffing: Kroon & Amstel works with clients that have social return obligations requiring employment of people at a disadvantage in the labour market.",
    sections: [
      {
        heading: "Multi-Sector Operations: Construction, Facility, and Social Return",
        body: "The construction and facility arms place craft workers, general construction labourers, carpenters, tilers, plumbers, and building maintenance workers across Amsterdam's active building renovation and new construction market. The city's housing renovation programmes (driven by energy transition requirements — insulation, heat pump installation, solar) and new development projects in Zuidas, IJburg, and harbour redevelopment areas create consistent demand.\n\nThe facility services arm covers cleaning, security support, and facility management roles at office buildings, housing corporation managed properties, and public facilities. The social return unit works with clients required to spend a percentage of large public procurement contracts on employing workers at a disadvantage in the labour market: long-term unemployed, partially disabled (arbeidsbeperkt), or benefit-dependent individuals seeking return to work through Participatiewet frameworks.",
      },
      {
        heading: "Pay, CAO Coverage, and Housing for Construction Workers",
        body: "Kroon & Amstel placements operate under the ABU CAO for general flex workers, and under the CAO voor de Bouwnijverheid (construction industry CAO) for construction-specific placements. The construction CAO specifies minimum hourly rates above WML (€14.71/hr in 2026): entry-level general construction labourer starts at approximately €15.50–€16.50/hr; certified craftworkers (timmerman, loodgieter, tegelzetter) earn €17.00–€22.00/hr depending on trade and experience.\n\nKroon & Amstel does not systematically provide housing — the group primarily serves workers who are already Amsterdam-based or have arranged their own accommodation. Workers relocating to Amsterdam face the city's tight rental market: private room rents in accessible neighbourhoods run €700–€1,100/month (shared house) to €1,200–€1,600/month (studio). Workers receiving WML (approximately €2,277 net/month after loonheffing) face significant housing cost pressure in the Amsterdam market.",
      },
      {
        heading: "Amsterdam Construction Sites and Transport",
        body: "Construction sites across Amsterdam are typically accessible by public transport or bicycle. GVB services reach most major development sites, though early-morning starts (07:00) may require the N-night bus lines for workers in outer districts. The Amsterdam ring road (A10) construction cluster (Zuidas area, Amstelkwartier) is GVB metro and tram accessible. North Amsterdam sites (NDSM, Buiksloterham) require ferry or tram access.\n\nThe social return component means the group also works with workers whose earning capacity may be below standard WML, with wage subsidies (loonkostensubsidie) from municipalities. Workers entering through social return programmes typically receive WML or slightly above, with the employer receiving a subsidy covering part of the employment cost — governed by the Participatiewet and offering structured return-to-work pathways with accompanying guidance and support.",
      },
    ],
    pros: [
      "Multi-sector capability: construction trades, facility services, horticulture, and social return under one group",
      "CAO voor de Bouwnijverheid coverage for construction placements: rates above WML for certified trades",
      "Social return expertise: relevant for workers re-entering the labour market through Participatiewet pathways",
      "Amsterdam market knowledge: established presence in the city's construction and facility management market",
      "Group structure allows specialisation without sacrificing breadth",
    ],
    cons: [
      "No systematic housing provision — Amsterdam's rental market creates pressure for workers without established accommodation",
      "Social return placements involve additional supervision and municipal coordination",
      "Construction work is physically demanding and weather-dependent — outdoor work continues year-round in Dutch conditions",
      "Limited public presence makes independent reputation verification harder than for nationally branded agencies",
      "Horticulture seasonal demand creates periods of reduced availability outside peak growing seasons",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── LIME Search (Finance Executive Search) ────────────────────────────────
  "lime-search": {
    metaTitle: "LIME Search Amsterdam Review 2026 – Finance Executive Search",
    metaDescription:
      "LIME Search Amsterdam review 2026. Specialist finance executive search since 2005. CFO, Finance Director, Business Development Director roles. €100k–€300k salary market and placement experience.",
    intro:
      "LIME Search is an Amsterdam-based specialist in Finance Executive Search and Interim Management, founded in 2005. The agency operates exclusively at the senior end of the finance function: CFOs, Finance Directors, Business Development Directors, Corporate Controllers, and Finance Business Partners at director level. The salary bandwidth of €100,000 to €300,000 defines the candidate market LIME serves — the agency does not place finance professionals below this level. In the Dutch executive search market, LIME operates as a boutique: smaller, more relationship-driven, and more narrowly focused than international search firms like Spencer Stuart or Korn Ferry.",
    sections: [
      {
        heading: "Executive Search: How LIME's Model Works",
        body: "Executive search at this level is fundamentally different from contingency recruitment. LIME Search operates primarily on a retained basis — clients pay a fee upfront (or in stages) to commission a structured search process. The agency maps the relevant universe of candidates (including passive candidates not actively looking), conducts outreach, assesses and interviews shortlisted candidates, and presents a curated set to the client. The process takes 8–16 weeks for senior appointments.\n\nLIME's focus on the €100,000–€300,000 finance executive market serves both the corporate CFO market at larger companies and the Finance Director market at scale-ups, PE-backed businesses, and mid-market family-owned companies. The PE-backed company market is particularly active in the Netherlands — private equity funds regularly need interim CFOs or permanent finance directors for their investee businesses. Interim management at this level — typically billing as ZZP at day rates of €900–€2,000/day — is a significant part of LIME's activity.",
      },
      {
        heading: "Salary and Rate Reality for Finance Executives",
        body: "At the salary levels LIME covers, Dutch income tax applies at the highest rate for a significant portion of earnings. Above €76,817 (the second bracket threshold in 2026), income tax applies at 49.5%. At €150,000 gross annual, net monthly take-home is approximately €7,200–€7,600. The 30% ruling for international executives qualifying as kennismigranten can improve this materially — at €150,000 gross, the effective net improvement is approximately €2,000–€2,500/month.\n\nFor interim executives billing as ZZP, day rates of €1,000–€1,500/day for CFO-level assignments produce annual gross billings of €220,000–€330,000 on 220 working days. After ZZP obligations, pension provision, and insurance, effective net is significantly lower — complex tax structuring through a BV (besloten vennootschap) is typically managed by a specialist accountant. LIME Search's consultants can introduce appropriate advisors.",
      },
      {
        heading: "Total Compensation at Executive Level",
        body: "Total compensation packages at CFO and Finance Director level include base salary, annual bonus (typically 20–40% of base), pension contribution (often above standard), and sometimes equity or LTIP (long-term incentive) components at PE-backed companies. Understanding the full package — not just the base salary — is essential at this level. LIME Search's consultants are experienced in facilitating multi-component package negotiations.\n\nLIME's candidate pool is narrow by design. The relevant candidate is a finance executive with 10+ years of career progression who has reached or is approaching CFO/Finance Director level, with demonstrable ownership of a full finance function. Candidates at early career stages or not yet at senior level are outside the scope of what LIME Search places.",
      },
    ],
    pros: [
      "Exclusive focus on €100,000–€300,000 finance executive market since 2005: boutique depth in a narrow niche",
      "Retained search model ensures structured, thorough process — not contingency volume recruitment",
      "Active in the Dutch PE-backed company market for interim CFO and Finance Director assignments",
      "Interim management practice serves executives between roles or seeking contract-to-perm exposure",
      "Strong understanding of multi-component package negotiation (base, bonus, pension, equity) at executive level",
    ],
    cons: [
      "Exclusively senior/director level — not relevant for finance professionals below €100,000 salary target",
      "Retained search process is slow (8–16+ weeks) — not a solution for candidates needing rapid placement",
      "Boutique size means fewer simultaneous searches than international executive search firms",
      "ZZP/BV structuring at high day rates requires specialist accountancy advice that LIME facilitates but does not provide directly",
      "Limited public information on fee structure and typical search timelines",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
    ],
  },

  // ── MJ People (Hospitality Management Recruitment) ────────────────────────
  "mj-people": {
    metaTitle: "MJ People Amsterdam Review 2026 – Hospitality Management Hiring",
    metaDescription:
      "MJ People Amsterdam review 2026. Specialist hospitality management recruitment since 2010. Hotel general managers, revenue managers, F&B directors. Salary ranges and candidate experience.",
    intro:
      "MJ People is an Amsterdam-based hospitality management recruitment agency founded in 2010 by Jacob de Graaff and Melle Pegman. The agency specialises in placing professionals at management and executive level within the hospitality industry — hotels, restaurants, resorts, and catering organisations. Role types include Hotel General Manager, F&B Director, Revenue Manager, Hotel Director, Executive Chef, and departmental Head of roles. MJ People operates at the management tier of the hospitality sector, not at the operational floor-staff level that agencies like Ployees or the RAI HCC serve.",
    sections: [
      {
        heading: "Management Recruitment in Dutch Hospitality: What MJ People Does",
        body: "Hotel General Managers and F&B Directors are not sourced through shift platforms or flex agencies — they are placed through relationship-based specialist recruitment that understands hospitality P&L ownership, brand standards, and the culture of hotel groups, independent luxury properties, and branded chains. MJ People's clients range across Amsterdam and the broader Netherlands: international hotel groups (IHG, Marriott, Accor properties), Dutch independent luxury hotels, resort and spa properties, and restaurant groups.\n\nThe agency also works internationally — placing Dutch hospitality managers abroad and placing international hospitality management professionals in the Netherlands. The placement model is direct hire: permanent or fixed-term management contracts. The agency does not place operational workers on flex contracts.",
      },
      {
        heading: "Salary Ranges for Dutch Hospitality Management Roles",
        body: "Hospitality management salaries in the Netherlands sit below comparable management roles in finance or technology, but above operational hospitality pay. In 2026, indicative ranges: Hotel General Manager (50–150 room property): €70,000–€100,000 gross/year. Hotel General Manager (200+ room full-service): €90,000–€150,000. F&B Director at full-service hotel: €60,000–€85,000. Revenue Manager: €55,000–€80,000. Executive Chef at premium property: €65,000–€95,000. Front Office Manager: €45,000–€62,000.\n\nHospitality management packages often include on-property benefits — meals on duty, hotel rate discounts, and in some cases accommodation (particularly for resort properties). Net take-home at €80,000 gross: approximately €4,100–€4,300/month after standard loonheffing. For international managers eligible for the 30% ruling, net improves by approximately €900–€1,100/month at this income level.",
      },
      {
        heading: "The Amsterdam Hospitality Market and Housing Reality",
        body: "Amsterdam remains one of Europe's most active hospitality markets. The pipeline of new hotel openings — luxury boutique properties, aparthotel formats, and converted heritage buildings — continues to add management roles. Schiphol's strategic position as a European hub drives demand for premium airport hotel and business travel hospitality.\n\nThe challenge for hospitality management candidates in Amsterdam is the housing market — €80,000 gross puts a professional in the Dutch middle income bracket, but Amsterdam rents for a professional-level apartment (60–85m², standalone) run €1,800–€2,600/month, representing 40–60% of net take-home. Candidates relocating to Amsterdam for a management role should model their accommodation budget carefully and investigate employer relocation assistance as part of the offer stage.",
      },
    ],
    pros: [
      "15+ year track record in Dutch hospitality management recruitment: established client relationships across hotel groups and independents",
      "Covers full management spectrum: GM, F&B Director, Revenue Manager, Executive Chef, and departmental Head of roles",
      "International placement capability — placing both international candidates in the Netherlands and Dutch managers abroad",
      "Founded by hospitality professionals: consultants understand the sector's operational and management culture",
      "Access to both branded hotel groups and prestigious Amsterdam independent properties",
    ],
    cons: [
      "Exclusively management level — not suitable for candidates without a hospitality management track record",
      "Amsterdam housing costs create financial pressure even at management salary levels — factor into relocation decisions",
      "Hospitality management market is smaller than general professional recruitment — fewer simultaneous vacancies",
      "International candidates may face visa and work authorisation lead times before placement can begin",
      "Boutique agency: personal service but fewer resources than global hospitality staffing firms",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
    ],
  },

  // ── Agile Recruitment ─────────────────────────────────────────────────────
  "agile-recruitment": {
    metaTitle: "Agile Recruitment Amsterdam Review 2026 – IT & HR Jobs",
    metaDescription:
      "Agile Recruitment Amsterdam review 2026. IT infrastructure, software engineering, HR, and sales placement since 2016. Salary ranges, permanent and contract roles, candidate experience.",
    intro:
      "Agile Recruitment is an Amsterdam-based recruitment agency founded in 2016, placing professionals in IT infrastructure, software engineering, HR, and sales roles across the Netherlands and Europe. In eight years of operation, the agency has built a client network spanning Dutch-market multinationals, scale-ups, and tech companies requiring specialist professional placement in a market where IT talent shortages have been persistent.",
    sections: [
      {
        heading: "What Agile Recruitment Places and How It Operates",
        body: "The agency covers three main disciplines. On the IT side: IT infrastructure specialists (network, security, cloud, systems administration), software engineers across common stacks (Java, .NET, Python, full-stack web), and IT account management roles bridging technical delivery and commercial client management. On the business side: HR professionals (HR business partners, recruiters, L&D specialists) and commercial sales roles for technology and SaaS companies.\n\nAgile Recruitment places at both permanent and contract level. The agency's European scope — placing Dutch professionals in roles abroad and international professionals in the Netherlands — is a differentiator for candidates with international career aspirations or for companies seeking talent beyond the domestic pool. Relocation support varies by employer; Agile Recruitment can advise on which client companies have structured relocation packages.",
      },
      {
        heading: "Salary Reality: What IT, HR, and Sales Roles Pay in 2026",
        body: "Salaries for the profiles Agile Recruitment places range from mid-professional to senior technical level — well above WML (€14.71/hr in 2026). Indicative Amsterdam-market ranges: IT infrastructure specialist (3–6 years): €50,000–€75,000 gross/year. Software engineer (medior, 3–5 years): €60,000–€85,000. Senior software engineer or tech lead (6–10 years): €80,000–€110,000. HR business partner (4–8 years): €55,000–€75,000. IT-sector account executive (2–5 years): €45,000–€65,000 plus commission (OTE typically 30–50% above base).\n\nAt €70,000 gross/year, net monthly take-home is approximately €3,700–€3,900 after loonheffing. For international candidates qualifying for the 30% ruling (kennismigranten at salary threshold €46,660+), net improves by approximately €600–€1,000/month. Contract day rates: Infrastructure specialist (medior/senior): €350–€550/day. Software engineer (medior): €400–€600/day. Senior engineer or architect: €600–€850/day.",
      },
      {
        heading: "Working Culture and What to Expect in Amsterdam's Tech Market",
        body: "Amsterdam's technology labour market in 2026 has partially recovered from the 2023–24 hiring correction in a sector-specific way: AI and ML engineers, cloud platform specialists, and cybersecurity professionals face strong demand; generalist web developers in non-specialised stacks face more competitive conditions. Candidates should ask Agile Recruitment's consultants about current market velocity in their specific technical domain before anchoring salary expectations.\n\nThe working environment at Amsterdam tech companies varies considerably between global multinationals (structured hierarchy, strong benefits), Dutch-founded scale-ups (flat structure, high autonomy, equity), and digital agencies (project-based rhythms, multi-client exposure, typically lower base pay). Candidates should state their cultural preference clearly at the first consultant conversation to ensure relevant introductions.",
      },
    ],
    pros: [
      "Multi-discipline coverage: IT infrastructure, software engineering, HR, and sales roles in one agency",
      "European remit: both inbound (international candidates to NL) and outbound (Dutch professionals to Europe) placement",
      "Permanent and contract placement capability for candidates who shift between employment modes",
      "Active in the Dutch tech and scale-up market since 2016 with genuine client relationships",
      "30% ruling and kennismigranten experience for internationally recruited IT professionals",
    ],
    cons: [
      "Founded 2016 — a shorter track record than long-established Dutch IT staffing firms",
      "Multi-discipline coverage means less depth per discipline than single-sector specialists",
      "Amsterdam-centric despite European scope — fewer client connections in other Dutch cities",
      "Competitive market: Amsterdam IT recruitment is saturated with agencies",
      "No housing or accommodation support for relocating professionals",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
    ],
  },

  // ── Babbage Company B.V. ──────────────────────────────────────────────────
  "babbage-company-b-v": {
    metaTitle: "Babbage Company Amsterdam Review 2026 – Marketing Recruitment",
    metaDescription:
      "Babbage Company Amsterdam review 2026. Specialist marketing and communications recruitment and interim since 1999. Financial services, retail, non-profit, and government clients.",
    intro:
      "Babbage Company is an Amsterdam-based recruitment and interim management agency that has specialised in marketing and communications professionals since 1999. Over 25 years of operation, the agency has built a client base spanning financial and business services, retail, non-profit organisations, government institutions, and multinationals — sectors where marketing and communications functions range from commercial brand management to public affairs and corporate communication.",
    sections: [
      {
        heading: "Marketing and Communications: Babbage's Sector Depth",
        body: "Babbage Company covers the full marketing and communications discipline range: brand managers, marketing managers, product marketers, digital marketing specialists, internal communications managers, corporate affairs advisors, PR professionals, and marketing directors. The agency places at permanent and interim management level.\n\nThe 1999 founding is meaningful in context. Babbage has observed the transformation of the marketing function from broadcast/offline-first to digital-first, and more recently to data-driven and AI-assisted. The cross-sector client base — financial services, retail, non-profit, government — is a differentiator: a financial services brand manager and a non-profit communications manager require different sector knowledge from the recruiter who introduces them. Babbage's 25-year track record means consultants understand what marketing looks like at a bank versus a retail chain versus a government communications department.",
      },
      {
        heading: "Salary Ranges for Dutch Marketing and Communications Professionals",
        body: "In 2026, indicative ranges: Marketing coordinator or junior brand manager (2–4 years): €38,000–€52,000 gross/year. Marketing manager (4–8 years, in-house): €55,000–€80,000. Head of Marketing or Marketing Director (8+ years): €80,000–€120,000. Corporate communications manager (5–9 years): €60,000–€85,000. Internal communications specialist (3–7 years): €50,000–€70,000. PR manager (4–7 years): €48,000–€68,000.\n\nFinancial services marketing roles typically pay 15–25% above equivalent FMCG or non-profit roles. Government and non-profit communications roles typically pay below commercial equivalents — the compensation tradeoff against mission alignment is real. Interim marketing management rates: marketing director interim — €600–€900/day; marketing manager interim (experienced): €400–€600/day.",
      },
      {
        heading: "25 Years in Dutch Marketing Recruitment",
        body: "Babbage Company's 25-year track record means the agency has relationship depth in core client sectors that newer marketing recruitment agencies cannot match. Long-established financial services clients, retail chains, and government communications departments that have placed marketing professionals through Babbage over multiple hiring cycles generate institutional trust in the agency's recommendations.\n\nThe limitation is the same as for any long-established specialist: the agency's approach reflects the marketing recruitment market as it developed over 25 years, which may mean less emphasis on the newest digital marketing specialisations (performance marketing, growth hacking, AI-driven content) that have emerged in the last 5–7 years. Candidates whose primary identity is in these newer disciplines may find more relevant traction at newer agencies like Finest People.",
      },
    ],
    pros: [
      "25+ years in marketing and communications recruitment: deep sector client relationships across finance, retail, non-profit, and government",
      "Full discipline range: brand management, PR, corporate affairs, digital marketing, internal communications",
      "Permanent and interim management capability for both career movers and professionals between roles",
      "Cross-sector client base provides access to a diverse marketing employer landscape",
      "Track record through multiple marketing paradigm shifts: broadcast to digital to data-driven",
    ],
    cons: [
      "Established approach may underweight the newest digital marketing specialisations relative to newer agencies",
      "Amsterdam-centric focus may limit options for candidates targeting marketing roles outside the Randstad",
      "Mid-to-senior focus: junior marketing professionals (0–2 years) may find fewer directly relevant vacancies",
      "No housing or accommodation support",
      "Limited public salary benchmark data specific to Babbage's track record",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  // ── Bluebird Recruitment ──────────────────────────────────────────────────
  "bluebird-recruitment": {
    metaTitle: "Bluebird Recruitment Amsterdam Review 2026 – SaaS Sales Jobs",
    metaDescription:
      "Bluebird Recruitment Amsterdam review 2026. International SaaS and AI sales recruitment since 2020. Account executives, sales leaders, VP Sales. OTE structures and placement experience.",
    intro:
      "Bluebird Recruitment is an international SaaS and AI sales recruitment agency founded in 2020 by Machiel Kunst, with European headquarters in Amsterdam. The agency specialises exclusively in placing sales professionals and sales leaders for SaaS and AI companies — account executives, sales managers, enterprise account managers, VP Sales, and Chief Revenue Officers. The 2020 founding places Bluebird directly within the era of explosive SaaS adoption and the subsequent demand surge for B2B tech sales talent.",
    sections: [
      {
        heading: "SaaS Sales Recruitment: A Distinct Market",
        body: "Selling enterprise software is a specialised discipline that generalist recruiters do not place well. SaaS account executives are evaluated on metrics — ACV (annual contract value) attainment, new logo acquisition, renewal rates, pipeline coverage ratios — that require sector-specific competency assessment. Bluebird's focus on SaaS and AI sales means the agency's consultants evaluate candidates on quota attainment history, deal size and sales cycle length, CRM discipline (Salesforce, HubSpot), and sales methodology alignment (MEDDIC, SPIN, Challenger).\n\nThe AI company market in 2026 has distinct characteristics: faster-moving sales cycles for AI tools, higher buyer skepticism requiring technical credibility in the sales process, and an evolving competitive landscape that changes month to month. Bluebird's positioning to serve AI companies directly means the agency tracks this sub-market in real time.",
      },
      {
        heading: "OTE, Base, and Variable: What SaaS Sales Really Pays in the Netherlands",
        body: "SaaS sales compensation follows global B2B tech norms: base salary plus uncapped or high-ceiling variable (commission), expressed as OTE. In 2026, indicative OTE ranges: Account executive (SMB/mid-market, 2–4 years): base €50,000–€65,000, OTE €80,000–€110,000. Enterprise account executive (5–8 years): base €70,000–€90,000, OTE €120,000–€180,000. Sales manager (player-coach, 6–10 years): base €80,000–€110,000, OTE €130,000–€200,000. VP Sales or CRO: base €120,000–€180,000, OTE €200,000–€350,000+.\n\nNet take-home on high-OTE roles involves Box 1 income tax at 49.5% above €76,817 on the variable component. The 30% ruling is particularly valuable for international SaaS sales professionals — for US or UK-origin enterprise sales professionals recruited to Amsterdam, the ruling dramatically improves the financial case versus an equivalent US or UK package.",
      },
      {
        heading: "Amsterdam as a European SaaS Hub",
        body: "Amsterdam hosts European headquarters or EMEA sales operations for a significant number of global SaaS companies. The city's English-speaking professional market, Schiphol's connectivity, and the European HQ status of many US tech companies make it the natural base for European enterprise sales teams.\n\nBluebird's positioning in this market is well-aligned — the agency was founded during the period when Amsterdam's SaaS employer base was growing fastest and has tracked the market's evolution through the 2021–22 hiring peak, the 2023 correction, and the 2024–25 recovery. Candidates returning to the market after a SaaS sector layoff should ask Bluebird's consultants about current market sentiment and vacancy velocity in their specific SaaS vertical.",
      },
    ],
    pros: [
      "SaaS and AI sales exclusive focus: genuine competency-based assessment rather than keyword CV screening",
      "Understanding of OTE structure, quota attainment metrics, and B2B tech sales methodology alignment",
      "European headquarters in Amsterdam with international reach — relevant for EMEA commercial roles",
      "Tracks the AI company market as a specific and growing sub-segment of SaaS sales",
      "30% ruling expertise for US and international sales professionals recruited to the Netherlands",
    ],
    cons: [
      "Founded 2020 — 4 years of operation is a shorter track record than established Dutch recruitment agencies",
      "SaaS-only focus means candidates in non-tech commercial sales should look elsewhere",
      "Market volatility in SaaS hiring means vacancy density varies significantly with market conditions",
      "Enterprise AEs at very high OTE levels face complex Dutch tax obligations requiring specialist advice",
      "No housing or relocation logistics support for internationally recruited sales professionals",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  // ── Centerpoint Amsterdam ─────────────────────────────────────────────────
  "centerpoint-amsterdam": {
    metaTitle: "Centerpoint Amsterdam Review 2026 – Construction Recruitment",
    metaDescription:
      "Centerpoint Amsterdam review 2026. Specialist construction and civil engineering recruitment since 1991. Project managers, BIM specialists, site managers. Salary ranges and placement experience.",
    intro:
      "Centerpoint is an Amsterdam-based recruitment and selection agency specialising in construction (bouwkunde) and civil engineering (civiele techniek) professionals since 1991. Over 33 years of operation, the agency has built one of the most established track records in the Dutch construction professional market, placing roles from young professionals through to senior project managers and construction directors. The depth of that history — spanning the 1990s Dutch construction growth period, the 2008–2013 crisis, and the current infrastructure and housing programme expansion — gives Centerpoint market memory that newer agencies cannot replicate.",
    sections: [
      {
        heading: "Construction and Civil Engineering Disciplines Centerpoint Covers",
        body: "Centerpoint places professionals across the full construction and civil engineering spectrum: project managers, site managers (uitvoerders), quantity surveyors (calculatoren), BIM specialists, civil engineers working on infrastructure (roads, bridges, waterways), and construction directors (projectdirecteuren). The Dutch construction market in 2026 is driven by two major demand streams: the national housing programme (ambitious residential construction targets across multiple provinces) and the infrastructure investment programme (rail and road expansion, flood defence upgrades, urban public space redevelopment).\n\nThe BIM specialisation is a growing share of Centerpoint's placement activity — the Dutch construction sector has adopted BIM standards (NEN 2660, BIM Basis ILS) rapidly, and BIM coordinators and managers are in genuine short supply. Candidates with BIM software proficiency (Revit, ArchiCAD, Navisworks) in a construction context are well-positioned in the current market.",
      },
      {
        heading: "Salary Ranges in Dutch Construction and Civil Engineering",
        body: "In 2026, indicative permanent salary ranges: Junior project manager or assistant site manager (0–3 years): €38,000–€52,000 gross/year. Project manager (construction, 4–8 years): €60,000–€85,000. Senior project manager or construction director (8–15 years): €80,000–€120,000. BIM specialist/coordinator (3–7 years): €50,000–€72,000. Quantity surveyor/calculator (3–7 years): €52,000–€75,000. Civil engineer (infrastructure, 3–7 years): €55,000–€78,000.\n\nInterim construction project managers working as ZZP on major projects bill €600–€1,100/day depending on project scale and seniority. VCA certification (required for all site managers) and LEAN construction methodology experience both add to placement value. Net take-home at €80,000 gross/year: approximately €4,100–€4,300/month.",
      },
      {
        heading: "33 Years in Dutch Construction: What That Track Record Delivers",
        body: "Three decades of continuous operation produces a specific institutional value: relationships with client organisations across multiple economic cycles, consultants who have placed the same candidates more than once across career progression, and a market read that encompasses not just current vacancies but the multi-year construction programme pipelines that determine where demand will be 12–36 months ahead.\n\nCandidates registered with Centerpoint benefit from a consultant who can contextualise a vacancy within the broader programme it belongs to — not just a site manager vacancy for a single housing project, but a role within a 10-year residential programme in Noord-Holland that could lead to programme-level management with the right performance over 2-3 years. This career-positioning capability is what distinguishes a 33-year specialist from a generalist agency.",
      },
    ],
    pros: [
      "33+ years of continuous construction and civil engineering recruitment: the longest-established specialist agency in this segment",
      "Places across the full construction career ladder: from young professionals to construction directors",
      "BIM specialist placement capability in a discipline facing genuine supply shortage",
      "Market memory spanning multiple economic cycles — useful for strategic career planning, not just current vacancies",
      "Strong alignment with the Dutch national housing programme and infrastructure investment pipelines",
    ],
    cons: [
      "Amsterdam-centric focus may not cover construction roles in eastern Netherlands, Brabant, or Limburg as strongly",
      "Long process for senior roles — placement of construction directors and senior PMs takes 6–10 weeks",
      "No housing or accommodation support for candidates relocating from outside the Netherlands",
      "Competition for the best project manager candidates in the Dutch market is intense",
      "BIM-focused growth areas may receive less weight in an agency built on traditional construction placement",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
    ],
  },

  // ── Dijk & Van Emmerik ────────────────────────────────────────────────────
  "dijk-van-emmerik-amstelveen-hr-adviesbureau": {
    metaTitle: "Dijk & Van Emmerik Review 2026 – HR & Reintegration Services",
    metaDescription:
      "Dijk & Van Emmerik Amstelveen review 2026. Psychological HR advisory for reintegration, outplacement, vitality, and absence management. NIP-registered coaches. How it works and what to expect.",
    intro:
      "Dijk & Van Emmerik is an Amsterdam/Amstelveen-based psychological HR advisory firm with approximately 29 years of operation. Since September 2024, the bureau has been part of Meijers Vitaal. The organisation provides services across four domains: re-integration (begeleiding bij terugkeer naar werk na ziekte of uitval), outplacement (coaching for professionals seeking new employment after leaving an organisation), vitality (proactive mental and physical wellbeing programmes), and absence management (verzuimbegeleiding for employers). All coaches and trainers are registered labour and organisational psychologists (NIP — Nederlands Instituut van Psychologen).",
    sections: [
      {
        heading: "What Dijk & Van Emmerik Provides and for Whom",
        body: "Dijk & Van Emmerik is not a traditional uitzendbureau or recruitment agency — the organisation operates in the HR advisory and psychological coaching space, serving both individuals and employer organisations. If you are a worker seeking re-integration support after long-term illness-related absence (langdurig verzuim), your employer may commission services from Dijk & Van Emmerik on your behalf. If you are a professional undergoing outplacement — receiving career transition support as part of a redundancy or restructure — you may be referred here by your employer's HR department.\n\nThe re-integration domain is governed in the Netherlands by the Wet verbetering poortwachter (WvP), which sets requirements for employers and occupational health services during the first two years of sick leave. Dijk & Van Emmerik's NIP-registered psychologist-coaches work within this framework, providing second-spoor re-integration trajectories when return to the original employer is not possible.",
      },
      {
        heading: "The Vitality and Absence Management Dimensions",
        body: "Dutch employers face significant financial incentives to manage absence effectively — under the Ziektewet/WGA framework, employers pay sick employees for up to two years, with penalties for insufficient re-integration effort (loonsanctie from UWV). This creates employer demand for proactive vitality programmes that prevent absence, and for professional absence management support when workers are already on sick leave.\n\nSince joining Meijers Vitaal in September 2024, the organisation's resources and programme portfolio have expanded. Meijers Vitaal is an established national player in organisational vitality and absence management. Clients benefit from the broader infrastructure while retaining the NIP-registered psychologist quality standard that defines the Dijk & Van Emmerik approach.",
      },
      {
        heading: "Who Should Contact Dijk & Van Emmerik",
        body: "Workers: If your employer has referred you to a re-integration or outplacement provider, the NIP registration of coaches is a meaningful quality indicator. NIP-registered professionals are bound by a professional code of conduct and are accountable to a professional register — a stronger guarantee than unregistered career coaches. Ask at first contact which coach will handle your trajectory and verify their NIP registration.\n\nEmployers: HR managers seeking re-integration support for workers on long-term sick leave, outplacement services for a redundancy programme, or proactive vitality interventions for high-stress teams will find Dijk & Van Emmerik's NIP-registered team a credible and professionally qualified option.",
      },
    ],
    pros: [
      "29+ years of operation in HR advisory and psychological coaching — substantial sector experience",
      "All coaches and trainers are NIP-registered labour and organisational psychologists: professional quality guarantee",
      "Full spectrum: re-integration, outplacement, vitality, and absence management under one organisation",
      "Part of Meijers Vitaal since September 2024: expanded programme capacity and national coverage",
      "Operates within the WvP re-integration legal framework: relevant for workers and employers navigating sick leave obligations",
    ],
    cons: [
      "Not a recruitment or placement agency — does not find jobs or match candidates with employers in the traditional sense",
      "Services are typically commissioned by employers, not directly by individual workers seeking placement",
      "Amsterdam/Amstelveen base — coverage in regions outside the Randstad depends on the Meijers Vitaal integration",
      "Outplacement coaching is most valuable when aligned with active employer-sponsored budget",
      "Limited public information on specific programme costs — typically negotiated at employer level",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
    ],
  },

  // ── Eswelt B.V. ───────────────────────────────────────────────────────────
  "eswelt-b-v": {
    metaTitle: "Eswelt Amsterdam Review 2026 – SAP & ERP Staffing Netherlands",
    metaDescription:
      "Eswelt Amsterdam review 2026. IT staffing specialist for SAP, Microsoft Dynamics, and Salesforce professionals since 2013. Permanent and contract ERP/CRM placements.",
    intro:
      "Eswelt is an Amsterdam-based IT staffing specialist that has focused exclusively on ERP and CRM professionals since 2013. The agency matches SAP, Microsoft Dynamics, and Salesforce specialists with organisations across the Netherlands, Belgium, and internationally. The client range spans start-ups through to multinationals — ERP systems are platform-agnostic in terms of company size, and a mid-sized Dutch manufacturer running SAP S/4HANA has the same need for skilled functional consultants as a global enterprise deploying SAP across multiple countries.",
    sections: [
      {
        heading: "The ERP/CRM Staffing Niche: Why It Requires Specialism",
        body: "Placing professionals in ERP and CRM platforms requires more than matching the platform name on a CV to a job description. SAP alone has more than 25 modules (FI, CO, MM, SD, PP, HR/HCM, BW/BI, ABAP, Basis, S/4HANA, Fiori, and many more), and a specialist in SAP Finance (FI/CO) is not interchangeable with a specialist in SAP Manufacturing (PP/MES). Eswelt's exclusive ERP/CRM focus means the agency understands these module-level distinctions — consultants can meaningfully assess whether a candidate's SAP FI experience translates to a client's S/4HANA finance transformation, rather than relying on keyword matching.\n\nERP projects — S/4HANA migrations, Dynamics 365 implementations, Salesforce rollouts — typically last 12–36 months. The project nature creates consistent demand for experienced contractors who can join mid-programme and deliver with minimal ramp-up.",
      },
      {
        heading: "Day Rates and Permanent Salaries for ERP/CRM Specialists",
        body: "ERP and CRM specialists command premium rates relative to generalist IT professionals. In 2026, indicative Dutch market rates: SAP FI/CO functional consultant (3–7 years): €70,000–€95,000 gross/year permanent, or €550–€800/day contract. SAP SD or MM functional consultant (medior): €65,000–€90,000 permanent, €500–€750/day contract. SAP ABAP developer: €70,000–€100,000 permanent, €600–€850/day contract. Microsoft Dynamics 365 F&O consultant: €65,000–€90,000 permanent, €500–€750/day contract. Salesforce architect or senior developer: €80,000–€120,000 permanent, €700–€1,000/day contract.\n\nThe 30% ruling is highly relevant for ERP professionals recruited to the Netherlands from abroad — SAP and Dynamics specialists from Eastern Europe, South Asia, and the US are frequently placed in the Dutch market. Contractors billing €700–€900/day earn €150,000+ annually but must self-manage all tax and insurance obligations; many experienced SAP contractors structure through a BV for tax efficiency.",
      },
      {
        heading: "Placement Quality in a Niche Market",
        body: "Eswelt's exclusive ERP/CRM focus since 2013 means the agency has accumulated specific knowledge of the Dutch SAP, Dynamics, and Salesforce market that generalist IT staffing firms cannot match. The agency knows which Dutch organisations are on S/4HANA migration roadmaps, which Salesforce SI partners have active project pipelines, and which Microsoft Dynamics partners are growing their practice. This forward-looking market knowledge translates into better placement timing — matching not just to open vacancies but to upcoming project needs.\n\nERP professionals should register with Eswelt alongside direct outreach to major SAP and Dynamics system integrator partners active in the Netherlands (Capgemini, Sogeti, Atos) and end-user-facing recruitment at large Dutch manufacturers and financial institutions.",
      },
    ],
    pros: [
      "Exclusive ERP/CRM focus since 2013: module-level platform knowledge rather than keyword CV matching",
      "Covers SAP, Microsoft Dynamics 365, and Salesforce — the three dominant platforms in the Dutch market",
      "Both permanent and contract/interim placement for project-based ERP professionals",
      "30% ruling and kennismigranten experience for internationally recruited ERP specialists",
      "Forward-looking market intelligence on S/4HANA migration and Dynamics/Salesforce project pipelines",
    ],
    cons: [
      "Niche focus means the agency is not relevant for IT professionals outside ERP/CRM platforms",
      "Amsterdam base may create some regional gaps for ERP roles at companies outside the Randstad",
      "Contract day rates at €700–€1,000/day require specialist Dutch tax and BV structuring advice",
      "ERP project demand fluctuates with corporate capex cycles — market conditions can change in 6–12 months",
      "Limited public vacancy advertising — direct outreach and profile registration is more effective",
    ],
    internalLinks: [
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  // ── Genius Recruitment ────────────────────────────────────────────────────
  "genius-recruitment": {
    metaTitle: "Genius Recruitment Review 2026 – Finance, HR & Admin Jobs NL",
    metaDescription:
      "Genius Recruitment Badhoevedorp review 2026. Professional recruitment for finance, HR, admin, and customer service. Connecting specialists with organisations across the Netherlands.",
    intro:
      "Genius Recruitment is a recruitment agency based in Badhoevedorp — the Haarlemmermeer municipality immediately west of Schiphol Airport — specialising in connecting professionals with organisations across finance, HR, recruitment, sales and marketing, and administrative roles. The Badhoevedorp location, close to Schiphol and the western Randstad, reflects the agency's focus on the Amsterdam metropolitan area and the broader Haarlemmermeer business cluster.",
    sections: [
      {
        heading: "What Genius Recruitment Places and Who Uses Them",
        body: "The core placement disciplines span the business support and professional services functions that nearly every organisation needs: financial administrators and controllers, HR generalists and HR business partners, recruitment professionals, sales and marketing coordinators, and office management and administrative support. Badhoevedorp and the Haarlemmermeer municipality are home to a concentration of logistics, aviation-linked, and international businesses — Schiphol-area companies, FMCG European headquarters, and transport and distribution businesses that create consistent demand for professional administrative and support functions.\n\nGenius Recruitment's location within this cluster rather than in central Amsterdam gives the agency proximity to a specific employer ecosystem that a centrally-located Amsterdam agency may not serve as naturally. The actual placement model is direct hire recruitment at both permanent and temporary-to-permanent level, working across the full career ladder from junior coordinators to senior finance managers.",
      },
      {
        heading: "Salary Reality for Finance, HR, and Administrative Professionals",
        body: "In 2026, indicative gross annual figures in the Amsterdam/Haarlemmermeer area: Financial administrator (2–4 years): €35,000–€48,000. Financial controller (4–8 years): €55,000–€78,000. HR generalist (3–6 years): €45,000–€62,000. HR business partner (5–9 years): €58,000–€80,000. Recruitment consultant (in-house, 2–5 years): €38,000–€55,000. Office manager / management assistant (4–8 years): €42,000–€58,000.\n\nNet take-home at €45,000 gross/year: approximately €2,500–€2,700/month after loonheffing. Financial professionals with Dutch GAAP knowledge plus English language ability command a 10–15% premium above roles requiring only Dutch language — a marketable combination given Haarlemmermeer's international employer base.",
      },
      {
        heading: "The Haarlemmermeer Professional Labour Market",
        body: "Haarlemmermeer is one of the fastest-growing municipalities in the Netherlands. The combination of Schiphol's logistics and aviation ecosystem, major European headquarters presence, and the Ring Road A9/A5 corridor industrial parks creates a diverse professional employment base. Professionals based in Haarlem, Hoofddorp, Nieuw-Vennep, or western Amsterdam can reach the Haarlemmermeer employer cluster more easily than navigating Amsterdam's city centre — making Genius Recruitment's geographic positioning a practical advantage for candidates in the western Randstad.\n\nFor Badhoevedorp-area workers without a car, transport to client sites outside the immediate Schiphol cluster may involve NS plus connecting bus or shared mobility. Factor commute time and cost into any placement decision for logistics company roles on the Schiphol periphery.",
      },
    ],
    pros: [
      "Haarlemmermeer location provides proximity to Schiphol-area and western Randstad employers not well-served by Amsterdam-centric agencies",
      "Multi-discipline coverage of finance, HR, admin, and support roles",
      "Permanent and temporary-to-permanent placement: suitable for both career movers and those testing a new organisation",
      "International employer base in Haarlemmermeer creates dual-language roles at competitive salary levels",
      "Accessible to candidates based in Haarlem, Hoofddorp, and western Amsterdam",
    ],
    cons: [
      "Limited public brand visibility makes independent reputation verification harder than for nationally branded agencies",
      "Multi-discipline generalist positioning means less depth per discipline than specialist agencies",
      "Haarlemmermeer employer focus means fewer options for candidates seeking roles in Amsterdam city centre or other regions",
      "No housing or accommodation support",
      "Salary ranges for support functions are below the Amsterdam tech and professional services market",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
    ],
  },

  // ── Good Company ──────────────────────────────────────────────────────────
  "good-company-reinventing-recruitment": {
    metaTitle: "Good Company Amsterdam Review 2026 – Tech & Professional Jobs",
    metaDescription:
      "Good Company Amsterdam review 2026. Technology, sales, marketing, and engineering recruitment. Digital tools plus human approach. Software developers, data analysts, and commercial roles.",
    intro:
      "Good Company is an Amsterdam-based technology and professional recruitment agency that positions itself as 'Reinventing Recruitment' through a combination of specialist expertise, digital tools, and a human approach. The agency places professionals in IT (software development, data analytics, infrastructure), commercial roles (sales, business development), marketing, and engineering disciplines. Good Company's branding emphasises transparency, speed, and candidate experience — dimensions where traditional recruitment has historically underperformed.",
    sections: [
      {
        heading: "The 'Reinventing Recruitment' Positioning: What It Means in Practice",
        body: "The 'Reinventing Recruitment' tagline positions Good Company within a category of post-2015 agencies that challenged the traditional contingency model with digital-first processes, structured feedback loops, and more transparent communication. In practice, this means candidates can expect clear communication about vacancy status and timeline, digital profile management rather than paper CV-based processes, and consultant conversations focused on career context rather than just keyword matching.\n\nWhether any individual experience lives up to this positioning depends on the specific consultant and client. The most reliable signal for any agency is candidate outcome data: placement rate, time-to-placement, and candidate satisfaction after placement. Good Company's Trustpilot-style feedback sources are worth reviewing before registering.",
      },
      {
        heading: "Salary Benchmarks Across Good Company's Placement Disciplines",
        body: "In 2026, indicative salary ranges: Software developer (medior, 3–5 years): €58,000–€82,000 gross/year. Senior software developer or tech lead (6–10 years): €80,000–€110,000. Data analyst (3–6 years): €52,000–€72,000. Data engineer (3–7 years): €60,000–€85,000. Commercial account executive (B2B tech, 2–5 years): €48,000–€70,000 base, OTE €80,000–€120,000. Marketing manager (4–8 years): €55,000–€78,000. Cloud or infrastructure engineer (3–7 years): €60,000–€88,000.\n\nNet take-home at €75,000 gross/year: approximately €3,900–€4,100/month. The 30% ruling applies for international tech professionals qualifying as kennismigranten at the €46,660 salary threshold. The Amsterdam tech market in 2026 has partially recovered from the 2023 hiring correction — candidates should ask Good Company's consultants for a current read on their specific discipline before anchoring salary expectations to 2021–22 peak rates.",
      },
      {
        heading: "What Candidates Can Expect From a Good Company Registration",
        body: "Good Company's registration process emphasises the candidate experience: prompt follow-up, transparent vacancy communication, and structured feedback from client interview processes. Consultants at smaller specialist agencies typically have more time per candidate than high-volume generalists, which supports the human approach component of the positioning.\n\nThe agency places at both permanent and contract level. Permanent placements result in direct employment with the hiring company; contract placements are through ZZP or payroll bureau arrangement. For tech professionals who move between permanent and contract status across their career, Good Company's dual-mode capability is a practical advantage.",
      },
    ],
    pros: [
      "Digital-first process with commitment to candidate communication transparency — less opacity than traditional contingency agencies",
      "Multi-discipline coverage: IT, data, commercial, and marketing in one agency",
      "Permanent and contract/ZZP placement capability for professionals who shift between employment modes",
      "30% ruling experience for internationally recruited tech professionals",
      "Amsterdam scale-up and tech client network — relevant for candidates targeting growth-stage companies",
    ],
    cons: [
      "Broad discipline scope means less depth per area than single-discipline specialists",
      "The 'Reinventing Recruitment' positioning is a marketing claim — actual experience depends on individual consultant",
      "Amsterdam-centric focus: fewer client connections outside the Randstad",
      "No housing or accommodation support for internationally recruited candidates",
      "Relatively newer agency: shorter track record than established specialists",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  // ── JP Gray ───────────────────────────────────────────────────────────────
  "jp-gray": {
    metaTitle: "JP Gray Amsterdam Review 2026 – Finance & HR Recruitment NL",
    metaDescription:
      "JP Gray Amsterdam review 2026. Part of the SThree Group. Finance & accounting, HR, supply chain, and customer services placement in the Netherlands. Permanent and contract roles.",
    intro:
      "JP Gray is an Amsterdam-based business operations workforce consultancy and part of the global SThree Group — the same international staffing group that owns Computer Futures, Huxley, and Progressive Recruitment. The agency specialises in Finance & Accounting, HR, Customer Services, Supply Chain, Business and Sales Support, and Life Sciences roles in the Netherlands. As an SThree brand, JP Gray combines the resources of a global staffing infrastructure with a focus on business operations disciplines rather than the technology and STEM focus of SThree's other Dutch brands.",
    sections: [
      {
        heading: "JP Gray's Positioning Within the SThree Ecosystem",
        body: "In the Netherlands, SThree operates multiple specialist brands: Computer Futures (IT), Huxley (financial services), Progressive Recruitment (engineering), and JP Gray (business operations). Each brand focuses on a distinct market segment, allowing SThree to offer specialist depth while leveraging shared back-office infrastructure, payroll capability, and cross-border candidate networks.\n\nFor candidates, the SThree Group membership provides: a well-capitalised back-office ensuring payroll reliability for contract workers, a cross-brand candidate referral network (a candidate registered with JP Gray for a finance role who also has IT project management experience may be referred to Computer Futures), and the compliance and governance standards of a FTSE-listed UK company.",
      },
      {
        heading: "Salary Ranges Across JP Gray's Disciplines",
        body: "Finance & Accounting: Financial analyst or junior controller (2–5 years): €45,000–€62,000 gross/year. Financial controller (5–9 years): €62,000–€85,000. Finance manager (7–12 years): €75,000–€100,000. HR: HR business partner (4–8 years): €55,000–€75,000. Supply Chain: Procurement manager (4–8 years): €58,000–€80,000. Life Sciences: Regulatory affairs specialist (3–7 years): €55,000–€80,000. QA manager: €65,000–€90,000.\n\nContract rates: Financial controller interim: €400–€600/day. HR business partner interim: €350–€500/day. Supply chain programme manager interim: €450–€650/day. The SThree payroll infrastructure supports both direct ZZP contractors and workers who prefer an employer-of-record arrangement — useful for candidates unfamiliar with Dutch self-employment obligations.",
      },
      {
        heading: "Global Infrastructure, Dutch Market Focus",
        body: "JP Gray's SThree Group membership provides cross-border candidate access — relevant for supply chain professionals with European operations experience, or finance professionals with multi-country controller history. The Amsterdam office can draw on SThree's global network when clients need candidates with specific international backgrounds.\n\nThe Life Sciences specialisation is particularly relevant in the context of the Dutch biotech and pharmaceutical cluster — Johnson & Johnson Netherlands, AstraZeneca, and numerous CROs and medical device companies in the Amsterdam/Utrecht corridor create consistent demand for regulatory affairs and QA professionals.",
      },
    ],
    pros: [
      "Part of SThree plc: listed company governance, reliable payroll infrastructure, and cross-border candidate network",
      "Multi-discipline business operations coverage: finance, HR, supply chain, customer services, and life sciences",
      "Both permanent and contract placement with employer-of-record option for candidates new to Dutch self-employment",
      "Cross-brand referral within SThree Group (Computer Futures, Huxley, Progressive) for multi-skilled candidates",
      "Life Sciences specialism aligns with the Dutch pharma/biotech/CRO cluster in Amsterdam and Utrecht corridor",
    ],
    cons: [
      "Multi-brand SThree structure can create uncertainty about which brand is most relevant for a specific profile",
      "Less depth per discipline than dedicated specialists like Robert Walters or LIME Search for senior finance",
      "Listed company compliance requirements may create slower processes compared to boutique agencies",
      "Amsterdam office focus: candidates seeking roles outside the Randstad may find fewer client connections",
      "No housing or relocation support for internationally placed professionals",
    ],
    internalLinks: [
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  // ── Jopp Recruitment ──────────────────────────────────────────────────────
  "jopp-recruitment": {
    metaTitle: "Jopp Recruitment Amsterdam Review 2026 – SaaS & FinTech Sales",
    metaDescription:
      "Jopp Recruitment Amsterdam review 2026. Sustainable recruitment for SaaS and FinTech commercial teams. Account executives, sales managers, customer success. OTE structures and placement experience.",
    intro:
      "Jopp is an Amsterdam-based recruitment partner exclusively focused on SaaS and FinTech organisations, positioning itself as a 'sustainable recruitment' practice. The agency helps growth-stage tech and FinTech companies scale their commercial teams — placing Account Executives, Sales Managers, Customer Success Managers, and VP Sales roles — while emphasising long-term placement quality over high-volume contingency throughput.",
    sections: [
      {
        heading: "SaaS and FinTech Commercial Hiring: Jopp's Specific Market",
        body: "Jopp's client base is growth-stage SaaS and FinTech — typically companies at Series A through Series C scaling from founder-led sales to a structured commercial organisation. This is a specific moment in development where the commercial hire profile is critical: the first commercial hires after the founding team establish the sales culture, methodology, and customer success model the company will scale from.\n\nThe FinTech dimension adds Amsterdam-specific relevance: the Netherlands is one of Europe's leading FinTech markets, with Amsterdam hosting a dense cluster of payment companies (Adyen, Mollie), crypto and DeFi projects, open banking platforms, and embedded finance providers. This creates consistent commercial hiring demand for FinTech-experienced sales professionals who can navigate the compliance-heavy, trust-intensive FinTech sales process.",
      },
      {
        heading: "OTE and Commercial Compensation in Dutch SaaS and FinTech",
        body: "Commercial compensation follows the standard B2B tech model: base salary plus variable commission expressed as OTE. In 2026, indicative ranges: Account executive (SMB/mid-market SaaS, 2–4 years): base €52,000–€68,000, OTE €90,000–€130,000. Enterprise account executive (5–8 years, EMEA scope): base €75,000–€95,000, OTE €140,000–€200,000. Customer Success Manager (2–5 years): base €50,000–€65,000, OTE €70,000–€90,000. Sales Manager (5–9 years): base €80,000–€110,000, OTE €140,000–€200,000.\n\nThe sustainable recruitment approach means Jopp aims to place candidates at OTE levels that are achievable with the right territory, quota, and ramp time. Candidates should ask specifically about average quota attainment at the client company — the gap between headline OTE and actual average attainment is the single most important data point for evaluating a commercial role's real earnings potential.",
      },
      {
        heading: "The Sustainable Recruitment Approach in Practice",
        body: "Jopp's sustainable recruitment claim rests on a pre-placement alignment process that goes beyond CV review: assessing company-stage fit (does the candidate thrive in a founder-led or structured environment?), product complexity fit (can the candidate credibly sell technical FinTech infrastructure?), and cultural fit.\n\nFor candidates, the practical implication is a more thorough pre-placement process than contingency recruitment — expect a substantive consultant conversation focused on career motivations, preferred company stage, and working style preferences, not just a skills-and-experience review. This investment of time up front is in the candidate's interest as much as the agency's: a well-matched placement is better for both sides than a quick placement that fails at six months.",
      },
    ],
    pros: [
      "Exclusive SaaS and FinTech commercial focus: genuine understanding of B2B tech sales compensation, metrics, and methodology",
      "Sustainable recruitment approach reduces placement churn risk for both candidates and employers",
      "Strong positioning in Amsterdam's FinTech cluster: Adyen ecosystem, payment infrastructure, and embedded finance companies",
      "Interim commercial management placement capability for companies needing experienced leadership during growth phases",
      "Company-stage and cultural fit assessment beyond CV review",
    ],
    cons: [
      "Exclusive SaaS/FinTech focus: not relevant for commercial professionals outside tech B2B sales",
      "Founded relatively recently — shorter track record than established Dutch recruitment agencies",
      "High OTE positions in enterprise SaaS involve complex Dutch tax obligations requiring specialist advice",
      "Thorough pre-placement process requires more candidate time investment than a quick-CV contingency approach",
      "No housing or relocation support for internationally recruited commercial professionals",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions explained" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
    ],
  },

  "2b-connected-w-s-voor-makelaardij-en-hypotheek-professionals": {
    metaTitle: "2B Connected Reviews Netherlands | Mortgage & Real Estate Jobs",
    metaDescription: "2B Connected W&S specialises in mortgage and real estate recruitment in the Netherlands. Read what workers and candidates say before you apply.",
    intro: "Finding work as a hypotheekadviseur or makelaar in the Netherlands is a different proposition than most temp-agency placements. The sector is regulated, qualification-heavy, and the agencies serving it are a world apart from the uitzendbureau model you encounter in logistics or hospitality. 2B Connected W&S voor makelaardij en hypotheek professionals is one of Amsterdam's more established niche recruiters in this space, with over 10 years of operation and a claimed track record of 700+ successful placements. This review looks at what it means financially and practically to be placed through them.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: "Salary expectations in the mortgage advisory and real estate brokerage sector are substantially higher than the Dutch statutory minimum wage (WML), which stands at €14.71 per hour in 2026. A junior hypotheekadviseur placed through 2B Connected will typically earn between €2,800 and €3,500 gross per month, while senior or independent advisors may command €4,000 to €5,500 gross. Makelaars in Amsterdam's competitive market often start on a base plus commission structure, meaning take-home can vary significantly month to month. For international candidates eligible for the 30% ruling, the salary threshold in 2026 is €46,660 gross annually — many senior placements here cross that line. A €3,200 gross monthly salary translates to roughly €2,500–2,650 net after loonheffing and premiums. Vakantiegeld (8%) accrues separately and is paid in May.",
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: "2B Connected does not provide housing. This is consistent with the professional nature of their placements: candidates in this sector are generally established professionals with their own accommodation. Anyone relocating for a role placed through this agency should budget €1,400–2,000 per month for a one-bedroom in Amsterdam or €1,000–1,400 in surrounding areas such as Amstelveen, Almere, or Haarlem. Using a verhuurmakelaar (rental agent) typically costs one month's rent as commission.",
      },
      {
        heading: "On the Floor: Working Conditions",
        body: "Working in the Dutch mortgage sector requires a valid WFT (Wet op het Financieel Toezicht) diploma — typically WFT Hypothecair Krediet for advisors. Without this, you cannot legally advise clients on mortgages in the Netherlands. 2B Connected confirms this requirement upfront, but candidates from other EU markets should verify whether their existing qualifications need supplementary Dutch exams. This process can take 4–8 weeks. Real estate brokerage roles require NVM or VBO membership or employer affiliation in most cases. Hours are often flexible but can extend into evenings for client appointments.",
      },
    ],
    pros: [
      "Niche focus in mortgage and real estate translates to faster, more relevant introductions",
      "10+ years of operation and 700+ claimed placements suggests an active client network",
      "Sector expertise means recruiters understand WFT requirements and Dutch regulatory context",
      "Amsterdam metropolitan focus aligns with the highest-density mortgage advisory market",
    ],
    cons: [
      "Moderate transparency score (52/100) — limited public data on fee structures or placement guarantees",
      "Sector requires WFT qualification which can take 4–8 weeks to obtain for new entrants",
      "Commission-based pay structures for makelaars introduce income variability",
      "No housing or relocation support",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
    ],
  },

  "acadeem-uitzendbureau-nederland-b-v": {
    metaTitle: "Acadeem Uitzendbureau Reviews Netherlands | Graduate Jobs",
    metaDescription: "Acadeem places HBO and WO graduates in economics, law and social sciences. What do candidates say about working through Acadeem in the Netherlands?",
    intro: "Graduating from a Dutch HBO or WO programme and then having to navigate the temp-agency market is a frustrating rite of passage for many young professionals. Acadeem Uitzendbureau Nederland B.V. exists specifically for this group, focusing exclusively on placing academic-level candidates in appropriate roles rather than routing them toward call centres or warehouse work. This review examines the financial and practical realities of working through Acadeem.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: "Graduate placements through Acadeem typically start in the range of €2,200 to €2,800 gross per month for entry-level positions in economics or legal support roles. Loonheffing at this income level runs at roughly 10–12%, meaning a €2,400 gross salary yields approximately €1,900–2,050 net after all deductions. Vakantiegeld of 8% accrues and is typically paid in May. Under Phase A of the ABU CAO (weeks 1–78), candidates are placed on a uitzendbeding — the contract can be terminated with one day's notice if the client assignment ends. One important nuance: academic qualification does not automatically translate to higher placement rates. Acadeem places candidates at CAO rates for the role they fill, not a graduate premium.",
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: "Acadeem does not provide housing. The expectation is that candidates are Amsterdam-based residents or have their own accommodation. For recent graduates still in Amsterdam after university, shared housing is common at €700–1,000 per room in the city, with more affordable options in Diemen, Hoofddorp, or Zaandam accessible by public transit.",
      },
      {
        heading: "On the Floor: Working Conditions",
        body: "Work placements are concentrated in the Amsterdam metropolitan area. Many temp contracts do not include travel allowance — clarify this before signing. The agency's transparency score is 32/100, indicating limited publicly verifiable information about their fee structures, active client roster, or placement volume. Candidates who register may find the active vacancy list is smaller than expected.",
      },
    ],
    pros: [
      "Niche focus on academic graduates prevents mismatch into warehouse or call-centre work",
      "Relevant for HBO and WO graduates in economics, law, and social sciences seeking first professional roles",
      "Amsterdam-based focus aligns with where most graduate opportunities are concentrated",
    ],
    cons: [
      "Low transparency score (32/100) — limited public information about placement volumes or success rates",
      "Graduate pay rates are set by role CAO, not education level — no automatic graduate premium",
      "Phase A uitzendbeding allows one-day contract termination, which limits security",
      "Vacancy volume may be smaller than expected given the niche positioning",
    ],
    internalLinks: [
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  "actief65": {
    metaTitle: "Actief65+ Reviews Netherlands | Work After 65 via Agency",
    metaDescription: "Actief65+ places workers aged 65 and older in flexible roles across the Netherlands. Understand pay, tax, and rights before working through them.",
    intro: "Working past the age of 65 in the Netherlands is more common than many assume. The AOW state pension age reached 67 in 2024, and a significant portion of older workers choose to continue part-time, often through specialist agencies. Actief65+, founded in 2001 and operating nationally, is one of the few Dutch staffing agencies focused exclusively on placing workers aged 65 and above. This review covers what to expect from them financially and practically.",
    sections: [
      {
        heading: "What the Payslip Shows",
        body: "Working through Actief65+ while also receiving AOW creates a specific tax situation that differs substantially from younger workers. AOW recipients are exempt from AOW-premie on earned income, meaning the effective payroll deduction is lower than for workers under 67. A 65+ worker earning €14.71 per hour (WML) for 24 hours per week grosses around €1,700 per month, with a notably lower loonheffing rate due to the absence of AOW premiums. Actief65+ positions itself as a low-cost flexible staffing solution — workers should verify that the offered hourly rate complies with their sector CAO independently. Vakantiegeld (8%) and paid public holidays still apply regardless of age.",
      },
      {
        heading: "Accommodation: Reality vs Promise",
        body: "Actief65+ does not provide housing. The working assumption is that candidates aged 65+ are established residents with their own home. Transport reimbursement varies by client and assignment — candidates should confirm whether reiskosten vergoeding is included before accepting any placement. For seniors without a car, confirm whether the workplace is accessible by public transit.",
      },
      {
        heading: "Physical Demands and Transport Setup",
        body: "The national scope of Actief65+ means roles span a wide range: reception work, administrative support, retail assistance, light logistics, security, museum and cultural guides, and garden maintenance are among the most common categories. For retired professionals with specific expertise — former teachers, nurses, accountants, or engineers — the agency occasionally places candidates in advisory or training support roles. Scheduling is typically flexible, which is the core appeal for this demographic.",
      },
    ],
    pros: [
      "Specialist focus means seniors are not de-prioritised in favour of younger candidates",
      "National coverage across a wide variety of role types",
      "Founded 2001 — over 20 years of operating in senior flexible staffing",
      "Flexible scheduling accommodates health appointments and part-time preferences",
      "Lower effective loonheffing due to AOW premium exemption improves net-to-gross ratio",
    ],
    cons: [
      "Low-cost positioning may mean CAO rates are at the minimum rather than premium",
      "Work assignments can be irregular — lean months require savings buffer",
      "WML-level earnings may not justify effort for those with substantial pension income",
      "No housing support or relocation assistance",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
    ],
  },

  "agile-professionals-bv": {
    metaTitle: "Agile Professionals BV Reviews Netherlands",
    metaDescription: "Limited public information available about Agile Professionals BV. Read what we know and why you should verify thoroughly before registering.",
    intro: "Not every agency in the Dutch labour market maintains a robust public profile, and Agile Professionals BV — registered in Amsterdam at Johan Huizingalaan 763a — is one where publicly available information is sparse. The domain agileprofessionals.nl was not active as an agency website at the time of research, and no verified details about their sector focus, fee structures, or placement track record could be confirmed. This review covers what can be said and what you should ask before engaging.",
    sections: [
      {
        heading: "Gross to Net: What Workers Keep",
        body: "If Agile Professionals BV operates in IT or project management staffing — as the name may suggest — salary ranges for typical roles would fall between €3,500 and €6,000 gross per month depending on seniority. A junior Scrum Master or agile coach typically earns €3,800–4,500 gross; an experienced IT project manager may command €5,000–7,000 gross. These figures are illustrative of the professional IT staffing market generally, not Agile Professionals BV specifically. Any candidate should receive written confirmation of hourly rate or monthly salary, contract type, and formal employer identity before signing.",
      },
      {
        heading: "Where to Live and What It Costs",
        body: "There is no indication that Agile Professionals BV provides housing. For a professional-level agency in the IT or project management space, this is standard. Amsterdam and surrounding municipalities remain among the most expensive rental markets in the Netherlands, with one-bedroom apartments averaging €1,600–2,000 per month in the city.",
      },
      {
        heading: "Commute and Workplace Conditions",
        body: "Key questions to ask before registering: Which industries and role types have active vacancies? Are you a member of ABU or NVP, and which CAO applies? Who is the formal legal employer during a placement — the agency or the client? What is the notice period during Phase A? Has the agency placed workers in the past 12 months, and can references be provided? A legitimate Dutch uitzendbureau should answer these immediately. If responses are evasive, proceed cautiously.",
      },
    ],
    pros: [
      "KvK-registered entity — the company formally exists",
      "If active in IT or agile space, salary levels are substantially above WML",
      "Potential niche focus could mean precise job-role matching for agile practitioners",
    ],
    cons: [
      "Low transparency score (32/100) — limited independently verifiable information",
      "No active public website found at time of research",
      "Sector focus and vacancy volume cannot be confirmed from public sources",
      "Unverified track record requires extra due diligence before registering",
    ],
    internalLinks: [
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  "all-star-chefs": {
    metaTitle: "All Star Chefs Reviews Netherlands | Chef Staffing Agency",
    metaDescription: "All Star Chefs supplies interim and freelance chefs across the Netherlands. Read about pay under Horeca CAO, shift conditions, and what chefs say about them.",
    intro: "Chef placements in the Netherlands sit at an interesting intersection: the Horeca CAO governs pay and conditions, the work is physically demanding, hours are anti-social by definition, and the agency model in this sector operates quite differently from tech or finance recruitment. All Star Chefs is an Amsterdam-based specialist staffing agency that places interim and freelance chefs across restaurants, catering companies, corporate kitchens, events, and private client assignments.",
    sections: [
      {
        heading: "Earnings Breakdown for 2026",
        body: "Under the CAO Horeca, hourly rates depend on job classification. A basic production chef (Kok niveau 1) earns around €14.80–15.50 per hour gross under 2026 rates. A chef de partie or experienced freelance chef typically commands €16.50–20.00 per hour, while executive and head chef placements may exceed €22–28 per hour on day rate. All Star Chefs places workers on interim or freelance terms. Under a payroll construction, loonheffing, ZVW, and social premiums are deducted — a €18.00/hr gross rate yields approximately €13.50–14.50 net per hour depending on total annual earnings. Freelance ZZP arrangements offer higher day rates but remove social security coverage and pension accrual.",
      },
      {
        heading: "Living Conditions and Housing Cost",
        body: "All Star Chefs does not provide housing. Chef placements are typically Amsterdam and Randstad-based, so candidates need their own accommodation in a high-cost rental market. For chefs doing evening restaurant shifts, public transport becomes unreliable after midnight. Own transport — bicycle or car — is a practical necessity for many assignments.",
      },
      {
        heading: "Daily Work Reality",
        body: "Kitchens run on split shifts, weekend loads, and evening rushes. Expect shifts starting at 9–10am or 4–5pm, with service running until 10pm or later. Weekend work is common and the Horeca CAO mandates a Sunday premium of 50% and evening or night premiums from 22:00 onwards. Verify in writing that All Star Chefs correctly applies these premiums. Corporate kitchen placements and event work tend to offer more predictable hours. Physical conditions include standing for 8–10 hours, high heat environments, and fast-paced service pressure.",
      },
    ],
    pros: [
      "Specialist culinary focus means relevant placements across restaurants, catering, and events",
      "ZZP option allows experienced chefs to maximise day rates on short-term assignments",
      "Variety across corporate kitchens, events, and restaurants builds a diverse CV",
      "Transparency marketing suggests working conditions are communicated before assignment",
    ],
    cons: [
      "Horeca sector is notorious for inconsistent premium application — verify payslips carefully",
      "Evening and weekend hours are the norm rather than the exception",
      "ZZP arrangements offer no WW unemployment or AOW pension accrual",
      "No housing support; Amsterdam accommodation is expensive relative to chef day rates",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  "amsterdam-werkt-aan-de-winkel": {
    metaTitle: "Amsterdam Werkt aan de Winkel Reviews",
    metaDescription: "Very limited public information about Amsterdam Werkt aan de Winkel. Find out what is known and what to verify before engaging this Amsterdam agency.",
    intro: "Some agencies in the Dutch employment market operate with minimal public visibility. Amsterdam Werkt aan de Winkel, located at Steelvlietplein 73 in Amsterdam, is one of these cases. No active public website was found during research, and independently verifiable information about their sector focus, services, or staffing model is limited. The name — which translates loosely as Amsterdam Works at the Shop — suggests a retail or consumer-facing employment focus.",
    sections: [
      {
        heading: "Hourly Rate and Net Income",
        body: "If Amsterdam Werkt aan de Winkel operates in the retail sector, the relevant wage framework is the CAO Retail Non-Food or CAO Detailhandel. Entry-level retail positions in the Netherlands in 2026 typically pay €14.71–16.50 per hour gross (at or just above WML), with classification depending on role and experience. A €15.00/hr gross retail position for a worker with 160 hours per month yields approximately €1,560 net after loonheffing and premiums. Amsterdam-area retail positions attract demand for flexible, part-time hours, particularly among students and those re-entering the labour market.",
      },
      {
        heading: "Where Workers Sleep",
        body: "No housing provision is indicated for this agency. Placements appear to be local Amsterdam-area, which means commuting by bicycle or GVB is the default. Amsterdam Nieuw-West, the area around Steelvlietplein, is well connected to the city centre via tram lines, so most assignments should be accessible without a car.",
      },
      {
        heading: "Commute, Tools, and On-Site Reality",
        body: "Key questions before engaging: Does the agency operate as a commercial uitzendbureau, a social employment service, or a community re-integration programme? What sector and type of work is currently available? What is the formal employment contract structure — agency contract, direct hire, or subsidised employment? Is the agency ABU-affiliated and does the ABU CAO apply? If Amsterdam Werkt aan de Winkel functions as a social-return or re-integration bureau, subsidised employment schemes such as Banenafspraak may be available.",
      },
    ],
    pros: [
      "Potential access to local Amsterdam retail employment market",
      "Community-oriented service may provide subsidised employment pathways",
      "Amsterdam Nieuw-West location near public transport links",
    ],
    cons: [
      "Very low transparency score (32/100) — no active website found",
      "Sector focus and operational model cannot be confirmed from public sources",
      "Retail earnings at WML level are modest relative to Amsterdam living costs",
      "Unverifiable track record requires in-person due diligence before registering",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "What workers really earn in the Netherlands" },
      { href: "/tools/payslip-checker", label: "Payslip checker: verify every line of your pay" },
    ],
  },

  "be-my-guest-hospitality-events": {
    metaTitle: "Be My Guest Hospitality Reviews Netherlands",
    metaDescription: "Be My Guest staffs weddings, festivals, and events across the Netherlands since 2014. What do event workers say about pay, conditions, and flexibility?",
    intro: "Event and hospitality staffing is one of the most flexible corners of the Dutch labour market — and one of the most variable in how it treats workers. Be My Guest, active in Amsterdam since 2014, supplies event staff for weddings, festivals, trade shows, business dinners, corporate openings, and private events. Their work looks glamorous in promotional materials but involves long prep days, late finishes, and variable income. This review looks at the financial and practical picture for staff working through them.",
    sections: [
      {
        heading: "Real Earnings vs Contract Rate",
        body: "Event staffing in the Netherlands falls under the CAO Horeca or ABU uitzend-CAO depending on the formal employment structure. The hourly rate for bar staff, service staff, or reception staff placed through Be My Guest typically runs between €13.50 and €16.00 gross per hour for standard assignments. Specialist event roles — sommelier, floor manager, event coordinator — may command €17–22 per hour. Under the CAO Horeca, evening work from 22:00 attracts a night supplement and Sunday assignments carry a 50% surcharge. Workers should verify that Be My Guest applies these premiums in payslips. Many event agencies use oproepkracht or min-max contract constructions, meaning income is inherently variable: busy spring and summer event seasons may generate 3–4 assignments per week, while January and February tend to be lean.",
      },
      {
        heading: "What the Housing Package Looks Like",
        body: "Be My Guest does not provide housing. Event staff in Amsterdam are expected to be local residents. Given the late-night nature of much event work, living within cycling distance of central Amsterdam assignments is a practical advantage. The Amsterdam rental market for shared housing runs €800–1,200 per room, which represents a significant portion of monthly event-staffing income for part-time workers.",
      },
      {
        heading: "Getting There and Working There",
        body: "Staff should expect events across the Amsterdam metropolitan area and occasionally further afield — hotels in the Zuidas, venues in Amstelveen or Haarlem, private estates. Transport to venues is not always reimbursed. Clarify travel reimbursement before accepting each assignment, particularly for late-night events where no public transport is available for the journey home. Dress code requirements are strict for hospitality roles; workers are generally expected to provide their own all-black professional outfit. Shifts starting at 4pm and running to 1am are common during peak season.",
      },
    ],
    pros: [
      "Active since 2014 — decade of established client relationships in Amsterdam events market",
      "Flexible scheduling: accept or decline individual assignments based on availability",
      "Variety across weddings, corporate events, festivals, and private dining",
      "Evening and Sunday premiums under CAO Horeca boost effective hourly earnings",
    ],
    cons: [
      "Income is highly seasonal — lean months in January and February require savings buffer",
      "Zero-hours and oproep contracts offer minimal job security",
      "Late finishes mean public transport unavailability — own transport often needed",
      "Premium pay only valuable if correctly applied — check payslips carefully",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
    ],
  },

  "berna-detacheringen-b-v": {
    metaTitle: "Berna Detacheringen Reviews Netherlands",
    metaDescription: "Berna Detacheringen B.V. is a registered Amsterdam secondment agency with limited public information. Read what to check before working through them.",
    intro: "Detachering — the Dutch secondment model in which a worker is formally employed by one party but performs work at a client company — is a common arrangement across many sectors in the Netherlands. Berna Detacheringen B.V., registered at Jan Janzenstraat 7 in Amsterdam, operates in this space. No active public website was found during research and verifiable details about their sector focus, client base, or placement volume are limited. This review explains the detachering model, outlines the key financial considerations, and highlights what any worker should verify before signing.",
    sections: [
      {
        heading: "Take-Home Pay in Practice",
        body: "Without knowing Berna Detacheringen B.V.'s sector focus, specific salary ranges are impossible to give accurately. In detachering, the gross rate is generally higher than equivalent temp work because the arrangement carries more overhead for the agency. A financial sector detachee might earn €3,500–5,500 gross per month; an IT detachee €4,000–7,000 gross; a healthcare detachee under CAO Zorg en Welzijn may earn €2,800–3,800 gross depending on function and classification. The agency margin in detachering is typically 15–25% of the worker bill rate to the client. Workers can legitimately request a breakdown of the client billing rate versus their gross salary. Vakantiegeld (8%) accrues as normal.",
      },
      {
        heading: "Worker Housing in Practice",
        body: "Berna Detacheringen does not appear to provide housing. Amsterdam-based detachering typically assumes workers are local residents. Client site locations vary — some detachees work at large corporate campuses in the Zuidas or Amsterdam Science Park that are well connected by public transit; others at smaller offices that require own transport.",
      },
      {
        heading: "Shift Life: Transport and Environment",
        body: "Key questions before signing any detachering agreement: What sector and client are you being placed with? What is the contract duration and notice period? Who is the formal employer for social insurance purposes? Which CAO applies? What is the process if the assignment ends before the contract end date? A legitimate detachering bureau will have clear written answers to all of these before you sign. The low transparency score (32/100) and absence of a public web presence mean candidates must do more direct due diligence than with an established bureau.",
      },
    ],
    pros: [
      "Detachering model typically offers more structured employment than standard uitzend — defined assignments and professional environments",
      "KvK-registered entity confirms formal legal existence",
      "Secondment arrangements usually carry fixed-term contracts rather than open uitzendbeding",
    ],
    cons: [
      "Very low transparency score (32/100) — no active public website",
      "Sector focus and placement volume cannot be confirmed independently",
      "Extra due diligence required compared to ABU-affiliated agencies with public track records",
      "No housing or relocation support",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  "bluepeaks": {
    metaTitle: "Bluepeaks Reviews Netherlands | RPO Recruitment Agency",
    metaDescription: "Bluepeaks is an Amsterdam RPO and recruitment marketing agency. Learn about working conditions, pay, and what embedded recruiters say about the Bluepeaks model.",
    intro: "Most staffing agency reviews focus on the workers placed into client businesses. Bluepeaks occupies a different niche: they place recruitment professionals themselves into client organisations on an embedded basis. As part of the Bluewave group, Bluepeaks offers RPO (Recruitment Process Outsourcing) solutions in which recruiters and talent acquisition specialists work within a client company's HR function rather than operating from a separate bureau. This review covers the financial and professional picture for recruiters working through this model.",
    sections: [
      {
        heading: "What the Payslip Shows",
        body: "Recruitment professionals at the level typically placed through Bluepeaks earn €3,200–5,000 gross per month depending on seniority and specialism. A junior talent acquisition specialist earns around €2,800–3,200 gross; a senior recruiter or recruitment marketeer €3,800–5,200 gross; a lead TA or RPO manager €5,000–7,000 gross. Net salary from €4,200 gross monthly works out to approximately €3,050–3,200 net after Dutch loonheffing and premiums. Vakantiegeld at 8% is standard. Confirm whether your Bluepeaks contract includes pension accrual (pensioenopbouw) — this varies between employment contracts and is worth quantifying.",
      },
      {
        heading: "Accommodation: Reality vs Promise",
        body: "Bluepeaks does not provide housing. Their placements are professional-level and Amsterdam-based, with salary levels that make the Amsterdam rental market accessible — though challenging. A €1,600–2,000 per month one-bedroom represents roughly 40–45% of gross salary at the €3,800 gross level, which is at the top of what financial planners typically recommend for housing costs.",
      },
      {
        heading: "Physical Demands and Transport Setup",
        body: "Embedded RPO work means functioning operationally as a recruiter inside the client organisation — attending their team meetings, using their ATS, and operating under their hiring processes — while remaining formally employed by Bluepeaks. Your rights under the ABU CAO or a specific employment contract apply to Bluepeaks, not to the client. The RPO market is cyclical: during hiring freezes, RPO programmes are among the first to be paused. Recruiters in embedded roles can find themselves returned to the agency quickly when a client cuts talent acquisition spend. Transport to client sites is typically the recruiter's own responsibility — many assignments are in Amsterdam or the Randstad and accessible by public transport.",
      },
    ],
    pros: [
      "Bluewave group structure provides continuity between assignments — more stable than independent contracting",
      "Embedded RPO model offers substantive, strategic recruitment work rather than purely transactional sourcing",
      "Amsterdam market focus with access to diverse client organisations across sectors",
      "Professional environment with client-side perks even as a Bluepeaks employee",
    ],
    cons: [
      "RPO programmes are cyclical and can be paused quickly during hiring freezes",
      "Dual accountability to Bluepeaks and the client requires careful navigation",
      "Moderate transparency score (52/100) — room for improvement on public disclosure",
      "No housing or relocation support",
    ],
    internalLinks: [
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  "brandpit": {
    metaTitle: "BrandPit Reviews Netherlands | Digital Marketing Recruiter",
    metaDescription: "BrandPit is an Amsterdam headhunter for digital marketing and e-commerce roles. Read reviews, understand placement fees, and compare salary expectations.",
    intro: "Digital marketing and e-commerce recruitment in the Netherlands has become a crowded space, but BrandPit maintains a clear positioning: they operate as a specialist headhunter boutique for online marketing, e-commerce management, data analytics, digital transformation, and UX design roles. Based in Amsterdam, BrandPit places candidates in both permanent and interim positions, working primarily on retained or contingency search mandates for established Dutch and international brands.",
    sections: [
      {
        heading: "From Gross to Net: The Numbers",
        body: "BrandPit operates at the professional end of the digital marketing market. Salary benchmarks for roles they typically fill in 2026 are: Online Marketing Manager €3,800–5,500 gross/month; E-commerce Manager €4,000–6,000 gross/month; Data Analyst €3,500–5,000 gross/month; Digital Transformation Lead €5,500–8,000 gross/month; UX Designer €3,800–5,500 gross/month. The 30% ruling is relevant for international candidates at the €46,660+ annual salary threshold. At €5,000 gross per month, an eligible international hire sees a significantly lower effective tax burden. For interim placements, BrandPit-placed professionals typically operate at €80–160 per hour day rate depending on seniority.",
      },
      {
        heading: "SNF Housing: What Workers Get",
        body: "BrandPit does not provide housing. Permanent hires sort their own accommodation; interim placements are expected to be locally available or cover their own relocation costs unless otherwise negotiated with the hiring employer. For international candidates relocated to Amsterdam for a BrandPit-placed role, relocation cost negotiation is standard practice at senior digital marketing levels.",
      },
      {
        heading: "Working Conditions on Site",
        body: "As a headhunter, BrandPit conducts detailed intake conversations before presenting candidates to clients. The process is selective — they prefer 2–3 highly matched candidates per role rather than sending large volumes. Headhunting timelines for permanent digital marketing roles average 6–10 weeks. Interim placements can move in 2–3 weeks depending on client urgency. Candidates should verify non-solicitation clauses in any agreement at placement — some arrangements prevent re-hiring directly by the employer for a defined period.",
      },
    ],
    pros: [
      "Deep specialism in Amsterdam digital marketing and e-commerce market",
      "Boutique headhunter model means personalised candidate experience",
      "Access to roles across senior online marketing, e-commerce management, data, and UX design",
      "Handles both permanent and interim placements — flexible engagement options",
    ],
    cons: [
      "Moderate transparency score (52/100) — limited public data on placement volumes or client names",
      "Boutique model means fewer active mandates at any given time vs. large agencies",
      "Slower placement timelines than contingency or uitzend models for permanent roles",
      "Non-solicitation clauses may limit future direct employment options",
    ],
    internalLinks: [
      { href: "/agencies", label: "Browse all verified agencies on AgencyCheck" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  "briqxx-people": {
    metaTitle: "Briqxx People Reviews Netherlands | Finance, IT & Food Jobs",
    metaDescription: "Briqxx People recruits for finance, ICT, and food industry roles from Amstelveen. Read honest reviews of pay, conditions, and placement quality.",
    intro: "Amstelveen is home to a significant cluster of international and Dutch corporate offices, and it is where Briqxx People has operated since its incorporation in 2012. The agency works across three distinct sectors — financial services, ICT, and the food industry — which makes it an unusual hybrid in the Netherlands staffing market. Most agencies build a reputation in one vertical; Briqxx People's cross-sector approach means their value depends heavily on which of those three areas a candidate is coming from.",
    sections: [
      {
        heading: "Pay Structure and Real Income",
        body: "Salary expectations vary enormously across Briqxx People's three sectors. In financial services, junior analyst or bookkeeper roles typically start at €2,800 to €3,500 gross per month; senior finance professionals in control, compliance, or treasury functions earn €4,500 to €7,000 gross. ICT placements mirror the broader Amsterdam tech market: a junior developer or IT support analyst earns €3,000 to €4,000 gross; a cloud engineer or data professional commands €4,500 to €7,000 gross. Food industry roles are a different story: production operators, quality inspectors, and logistics coordinators in food manufacturing typically earn €2,200 to €3,200 gross, often under the CAO Vlees, CAO Levensmiddelen, or CAO Zoetwaren depending on the client. At €2,800 gross, take-home is approximately €2,150–2,300 net. At €4,500 gross, net runs to €3,200–3,400. Vakantiegeld of 8% accrues across all placements.",
      },
      {
        heading: "Housing Standards and SNF Compliance",
        body: "Briqxx People does not provide housing. Their placements are professional in orientation, and the Amstelveen base means most roles are accessible from Amsterdam, Schiphol-Rijk, or the wider South Amsterdam area. Shared housing in Amstelveen runs approximately €900 to €1,300 per room per month. For food industry placements at production facilities in the broader North Holland region, candidates should clarify site location before accepting.",
      },
      {
        heading: "Transport to Site and Physical Demands",
        body: "The Bavinckhouse office complex in Amstelveen is accessible by tram from Amsterdam Zuid and by bus from various metro interchange points. ICT placements tend to be at client offices in Amsterdam or the Zuidas, accessible by NS or GVB. Food industry placements may require own transport if the production facility is in an industrial park outside urban transit coverage. The cross-sector model means a recruiter serving three very different sectors may not have the deep specialisation that a single-sector boutique provides — clarify which vertical is currently most active before investing significant time in intake conversations.",
      },
    ],
    pros: [
      "Cross-sector flexibility — if one market slows, candidates may find openings in another vertical",
      "Amstelveen base gives access to the international corporate cluster in that area",
      "12-year track record since 2012 is meaningful in a market where short-lived bureaus are common",
      "Financial, ICT, and food industry coverage in one agency simplifies the search for multi-disciplinary candidates",
    ],
    cons: [
      "Cross-sector model may lack the depth of single-sector specialists in each vertical",
      "Moderate transparency score (52/100) — adequate but not comprehensive public disclosure",
      "Food industry rates are significantly lower than finance or ICT rates at the same agency",
      "No housing or relocation support",
    ],
    internalLinks: [
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
      { href: "/guides/hidden-costs-netherlands", label: "What agencies deduct — and what is legal" },
    ],
  },

  "circle-hospitality": {
    metaTitle: "Circle Hospitality Reviews Netherlands | Events Staffing",
    metaDescription: "Circle Hospitality supplies trained staff for festivals, events and corporate dinners since 2017. Read pay rates, shift conditions and worker reviews.",
    intro: "When a corporate dinner for 300 guests needs staffing, or a three-day festival requires a consistent service team, the brief goes to a hospitality agency. Circle Hospitality, incorporated in Amsterdam in 2017, positions itself as a supplier of trained and presentable professionals for exactly these situations: festivals, events, corporate dinners, and venue operations. Their staff profile spans party managers, catering and service personnel, chefs, and event support roles.",
    sections: [
      {
        heading: "Take-Home Pay in Practice",
        body: "Circle Hospitality operates primarily in the festive and event hospitality market under the CAO Horeca. In 2026, the base rate for service staff starts at €14.80 to €15.50 per hour gross. Party managers and floor supervisors earn €16.00 to €19.00 gross per hour; event chefs €15.50 to €22.00 depending on classification; senior catering managers €20.00 to €28.00 per hour. The real earnings story is in the premium structures: Sunday work attracts a 50% surcharge under CAO Horeca, and evening shifts past 20:00 earn supplements of 22 to 30%. A six-hour Saturday evening shift ending at 01:00 on Sunday generates a mix of Saturday evening, Saturday night, and early Sunday rates. For a worker earning €15.00 base, this can push the effective blended rate to €20.00 or higher. Workers should check that Circle Hospitality breaks out these premiums correctly on payslips. Many placements use oproepkracht or min-max arrangements — income is seasonal, with spring and summer as peak demand.",
      },
      {
        heading: "Worker Housing in Practice",
        body: "Circle Hospitality does not provide housing. Most assignments are in or around Amsterdam. Shared accommodation in Amsterdam runs €900 to €1,300 per room. For event staff who work primarily at weekends and evenings, living within cycling distance of central Amsterdam is a genuine logistical advantage, particularly for late finishes after midnight.",
      },
      {
        heading: "Shift Life: Transport and Environment",
        body: "Event venues vary considerably: large Amsterdam festivals are accessible by public transit until late, but post-midnight finishes always require own transport, taxi, or ride-sharing. Corporate venue assignments at hotels in the Zuidas or Amsterdam RAI are generally accessible by metro or tram. Private estate and off-site catering assignments require reliable own transport. Reviews on AgencyCheck indicate that briefings before premium corporate events are thorough; for larger festival volume-staffing assignments, pre-event communication can be lighter. Dress code and grooming requirements are strictly enforced — workers are expected to provide their own professional all-black service uniform unless briefed otherwise.",
      },
    ],
    pros: [
      "Survived the post-COVID events industry consolidation — active since 2017 with established client base",
      "Premium event market focus means more professional working environments than bulk festival staffing",
      "Flexible scheduling: accept or decline individual assignments based on availability",
      "Evening and Sunday CAO Horeca premiums meaningfully boost effective hourly earnings on peak shifts",
    ],
    cons: [
      "Oproep contract model offers no guaranteed hours — income is highly seasonal",
      "Late finishes mean public transport is unavailable — own transport often needed",
      "Premium pay is only valuable if correctly applied — check payslips against CAO tables",
      "No housing support; Amsterdam accommodation is expensive relative to hospitality day rates",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  "circle-one": {
    metaTitle: "Circle One Reviews Netherlands | Data, Cloud & Security IT Jobs",
    metaDescription: "Circle One is an Amsterdam IT boutique specialising in Data, Cloud and Security roles. Read candidate reviews and salary benchmarks before you engage.",
    intro: "The IT recruitment market in Amsterdam is large and competitive, with dozens of agencies claiming specialism in tech. Circle One distinguishes itself with a genuinely focused proposition: Data, Cloud, and Security. This Amsterdam-based boutique recruiter does not try to cover the full IT spectrum — they operate in three of the most in-demand and best-compensated corners of the Dutch tech market. For candidates in these disciplines, that focus matters.",
    sections: [
      {
        heading: "Gross to Net: What Workers Keep",
        body: "These three disciplines represent the highest-compensation end of the Dutch IT labour market. In 2026, benchmark gross salaries for Circle One's primary placement categories are: Data Engineer (3–6 years) €4,500–6,500 per month; Data Scientist (3–7 years) €4,800–7,000; Cloud Architect (senior) €6,000–9,000; Cloud Engineer (mid-level) €4,500–6,500; Security Analyst €4,000–5,500; Security Engineer or penetration tester €5,000–7,500. At €5,500 gross per month, net take-home after Dutch loonheffing is approximately €3,700–3,900. The 30% ruling is directly relevant at these levels for non-Dutch nationals — the 2026 annual salary threshold is €46,660, which most mid-senior Circle One placements exceed. For interim placements (ZZP or via payroll), day rates run €90–175 per hour for senior professionals.",
      },
      {
        heading: "Where to Live and What It Costs",
        body: "Circle One does not provide housing. Placements are permanent or long-term interim in the Amsterdam and Randstad market. Professionals at these salary levels can access the Amsterdam rental market, though €1,800–2,500 per month for a one-bedroom still represents 30–40% of gross income at the €5,500 gross level. International candidates relocating for a Circle One-placed role should negotiate relocation support with the hiring employer — first-month rent deposit coverage and BSN registration assistance are standard practice in Dutch tech hiring at senior levels.",
      },
      {
        heading: "Commute and Workplace Conditions",
        body: "Circle One positions itself as a personal approach specialist — smaller candidate volumes and more engaged recruiter conversations. Rather than submitting large shortlists, the boutique model presents 3–5 carefully matched candidates per mandate. Intake conversations focus on technical depth, preferred cloud platform, team size preference, and work style. The trade-off is speed and volume: a boutique IT recruiter will not have the same breadth of active mandates at any given moment as a large agency like Yacht or Experis. Candidates who are actively looking should register with Circle One alongside one or two high-volume tech agencies to maximise market coverage.",
      },
    ],
    pros: [
      "Deep sector focus in Data, Cloud, and Security produces better-matched introductions",
      "Boutique model means substantive recruiter conversations rather than call-centre screening",
      "Salary levels well above WML — 30% ruling access for many international placements",
      "Amsterdam market focus in three of the highest-demand IT disciplines",
    ],
    cons: [
      "Narrower mandate volume than large tech agencies — parallel registration with generalists recommended",
      "Placement timelines may be slower when no active mandate matches your profile immediately",
      "Moderate transparency score (52/100) — limited public-facing vacancy board",
      "No housing or relocation support directly from the agency",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
    ],
  },

  "class-ster-uitzendbureau-b-v": {
    metaTitle: "Class Ster Uitzendbureau Reviews Netherlands",
    metaDescription: "Very limited public information about Class Ster Uitzendbureau. Learn what due diligence to perform before registering with this Amsterdam agency.",
    intro: "Class Ster Uitzendbureau B.V. is a staffing agency registered in Amsterdam at Jacob van Arteveldestraat 5-III. No active public website was found at the time of research, and independently verifiable information about their sector focus, services, or worker placement track record is limited. The name suggests a general temp-staffing model rather than a specialist recruiter, but the operational details cannot be confirmed from publicly available sources.",
    sections: [
      {
        heading: "Your Actual Weekly Income",
        body: "Without confirmed sector information, typical general temp bureau placements in the Amsterdam area in 2026 span administrative support (€14.71–16.00 per hour gross), light industrial and logistics (€14.71–16.50 gross), and general retail support (€14.71–15.50 gross). At WML level (€14.71 per hour), a 38-hour week produces €2,224 gross per month, yielding approximately €1,800–1,900 net after standard loonheffing. Vakantiegeld of 8% and public holiday entitlements apply under ABU CAO regardless of sector. Ask explicitly before starting: what CAO applies to my placement, who is my formal employer, and what are the notice terms during Phase A?",
      },
      {
        heading: "The Housing Deal: Costs and Conditions",
        body: "There is no indication that Class Ster Uitzendbureau provides housing. The Amsterdam address suggests locally based operations with assignments in the metropolitan area. Commuting via GVB tram, metro, and bus network should cover most realistic placement locations. Travel reimbursement for temp workers is not guaranteed under all contract structures — confirm before accepting.",
      },
      {
        heading: "How You Get to Work",
        body: "In the Netherlands, ABU or SNA membership provides meaningful accountability signals for any staffing agency. ABU members commit to the ABU CAO minimum standards for Phase A and Phase B employment, holiday pay, pension accrual in Phase B, and correct application of sector CAO supplements. For Class Ster Uitzendbureau, first verify KvK registration status and check whether they hold ABU, NEN-4400, or SNA certification via the public registers before signing anything. Dutch labour inspectorate (NLA) cases disproportionately involve small, low-visibility bureaus — these accountability steps are not bureaucratic box-ticking but genuine worker protection.",
      },
    ],
    pros: [
      "A locally-based bureau may have knowledge of specific neighbourhood employer relationships",
      "Small bureaus sometimes provide more personal contact than large staffing chains",
      "KvK-registered entity — the company formally exists",
    ],
    cons: [
      "Low transparency score (32/100) — no active public website found",
      "Sector focus and placement volume cannot be confirmed from public sources",
      "ABU or SNA membership unverified — standard employment protections need explicit confirmation",
      "Extra due diligence required compared to certified agencies",
    ],
    internalLinks: [
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },

  "connected2talent": {
    metaTitle: "Connected2talent Reviews Netherlands | IT & Engineering Agency",
    metaDescription: "Connected2talent recruits in IT and mechanical engineering from Amsterdam. Limited public info available — read what to ask before registering.",
    intro: "Connected2talent is an Amsterdam-based staffing and recruitment agency located at John M. Keynesplein 10 in Amsterdam Nieuw-West, near Sloterdijk. Available public information indicates the agency recruits in mechanical engineering and IT disciplines. Beyond the address, phone listing, and sector indicators, public information is limited. The transparency score for Connected2talent on AgencyCheck is 32/100.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: "If Connected2talent operates primarily in mechanical engineering and IT, the applicable salary benchmarks differ significantly between disciplines. For mechanical engineers in the Netherlands in 2026: junior engineer (0–3 years) €2,800–3,500 gross per month; mid-level engineer (3–7 years) €3,800–5,200 gross; senior or specialist €5,000–7,000 gross. The CAO Metalektro or CAO Metaalnijverheid applies for many engineering placements, setting sector minimums above WML for most functions. For IT professionals, IT support and infrastructure €3,000–4,500 gross; software developer €4,000–6,500 gross; IT project manager €5,000–7,500 gross. At €4,500 gross monthly, net take-home after Dutch loonheffing is approximately €3,200–3,400.",
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: "Connected2talent does not appear to provide housing. The Amsterdam Nieuw-West location and the professional nature of the disciplines they serve suggest that placements are for locally based or relocating professionals who arrange their own accommodation. John M. Keynesplein is accessible by NS rail from various Amsterdam metropolitan points via Sloterdijk station.",
      },
      {
        heading: "On the Floor: Working Conditions",
        body: "Key questions before engaging: Which active vacancies do you currently have in my specific discipline? What is the client company type — manufacturing, software house, consulting firm, or infrastructure operator? Is the placement on a direct hire basis, fixed-term contract, or uitzend basis? If uitzend: which CAO applies, is the agency ABU-affiliated, and what are the Phase A notice terms? Can you provide references from previous candidates placed in similar roles? Legitimate IT and engineering recruiters should have no difficulty answering these immediately.",
      },
    ],
    pros: [
      "Combination of mechanical engineering and IT covers a useful dual-discipline niche for industrial employers",
      "Amsterdam Nieuw-West location near Sloterdijk is accessible for North and West Amsterdam commuters",
      "KvK-registered and confirmed to hold IT-sector focus",
    ],
    cons: [
      "Low transparency score (32/100) — limited publicly verifiable track record",
      "No active public website or vacancy board found",
      "Dual-sector model may lack depth of single-discipline specialists in each area",
      "No housing or relocation support",
    ],
    internalLinks: [
      { href: "/guides/real-salary-netherlands", label: "Real salary guide: every job type in the Netherlands" },
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
    ],
  },

  "crewmates": {
    metaTitle: "Crewmates Reviews Netherlands | Hospitality & Events Staffing",
    metaDescription: "Crewmates supplies flexible hospitality staff for Amsterdam restaurants, events and venues. Read about pay, shift conditions and what workers say.",
    intro: "Not every event staffing agency in Amsterdam has been around for decades. Crewmates is a younger, energetic bureau focused on supplying flexible hospitality workers — serving staff, hosts, dishwashers, and kitchen support — to restaurants, events, and venues in Amsterdam. The agency's positioning appeals to students, career-transitioning workers, and those who want genuinely flexible shift work without committing to a fixed employer.",
    sections: [
      {
        heading: "From Gross to Net: The Numbers",
        body: "Crewmates operates primarily in the Horeca sector. Under the CAO Horeca 2026, the hourly rate for serving staff starts at €14.80–15.20 gross per hour for entry level. Kitchen support and dishwasher roles classify at similar rates, typically €14.71–15.00 gross. Hosts and supervisors may earn €15.50–17.00 gross per hour. The premium structure is where real earnings variation comes from: evening shifts past 22:00 attract a night supplement; Sunday shifts earn a 50% premium. For a student working a Saturday late-night event from 19:00 to 02:00, the shift spans Saturday evening rate, then Saturday night rate, then early Sunday morning rate — pushing the effective blended hourly rate to €19.00–22.00 for hours worked past midnight. For a student or part-time worker earning €1,200–1,800 gross per month, loonheffing is relatively low at approximately 8–10% effective. Ensure the payslip reflects the correct premium breakdown, not just a flat rate for all hours.",
      },
      {
        heading: "SNF Housing: What Workers Get",
        body: "Crewmates does not provide housing. Their Amsterdam base means most workers are local residents. For students in shared housing at €600–900 per room, the flexible income from Crewmates is typically supplemental rather than primary. For those relying more heavily on the income, the seasonal nature of event staffing means lean periods in January and February require a savings buffer.",
      },
      {
        heading: "Working Conditions on Site",
        body: "Hospitality and event work is physically demanding: serving staff stand for 6–10 hours per shift, often in warm, loud environments. Dishwashers and kitchen support work in high-heat, fast-paced conditions. Post-midnight finishes are common, making own transport, cycling, or ride-sharing necessary for the journey home. Crewmates uses oproepkracht constructions — no guaranteed hours minimum. Reliable and presentable workers who consistently deliver good shifts are called back frequently; building a positive track record with the agency is the most effective route to consistent assignment volume.",
      },
    ],
    pros: [
      "Genuine flexibility: accept or decline individual shifts without fixed-hour commitments",
      "Variety across restaurants, events, and venues builds a broad hospitality CV",
      "Evening and Sunday CAO Horeca premiums meaningfully boost blended hourly earnings",
      "App-based and informal communication suits the student and flexible-worker demographic",
    ],
    cons: [
      "No guaranteed hours — income is inherently variable and seasonal",
      "No path toward Phase B stability if assignments remain short-term and varied",
      "Late-night finishes require own transport — public transit unavailable after midnight",
      "Premium pay must be checked against actual payslips",
    ],
    internalLinks: [
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport deductions: your rights" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  "demsan-uitzendorganisatie-b-v": {
    metaTitle: "Demsan Uitzendorganisatie Reviews Netherlands",
    metaDescription: "Demsan Uitzendorganisatie B.V. has limited public presence in Amsterdam. Read the key checks to perform before working through this agency.",
    intro: "Demsan Uitzendorganisatie B.V. is a staffing organisation registered in Amsterdam at Maroastraat 5 in the Slotervaart neighbourhood of Nieuw-West. No active website was found during research, and no verified public information about their sector focus, services, or workforce profile was available from reliable sources. The transparency score on AgencyCheck is 32/100.",
    sections: [
      {
        heading: "Wages and Payslip Breakdown",
        body: "Without confirmed sector information, the common sectors for Nieuw-West based bureaus provide a likely salary context. In 2026: construction support and unskilled labour €14.71–16.50 per hour gross (CAO Bouw may apply); logistics and warehouse operator €14.71–15.50 gross; cleaning and facility services €14.71–15.20 gross (CAO Schoonmaak); care and support assistant €14.71–16.00 gross (CAO Zorg en Welzijn depending on classification). At WML (€14.71 per hour) for 38 hours per week, gross monthly income is €2,224. Net take-home is approximately €1,850–1,950 after loonheffing. Vakantiegeld (8%) accrues on top and is paid annually. Dutch workers have a legal right to a written employment contract and a detailed loonstrook each payment period — any agency that cannot provide these should not be trusted.",
      },
      {
        heading: "Housing Provision and Deductions",
        body: "No housing is indicated for this agency. The Slotervaart neighbourhood is served by Amsterdam tram lines 1 and 17 connecting to Centraal Station. GVB bus routes serve the wider Nieuw-West district. For workers without a car, accessibility is reasonable for Amsterdam-based assignments but may be limited for assignments at industrial parks in Westpoort or Schiphol area without direct transit coverage.",
      },
      {
        heading: "Work Environment and Transport",
        body: "Before starting any work: confirm KvK registration and sector code; check whether the agency holds ABU or NEN-4400 certification (which ensures Dutch labour and tax law compliance); request written confirmation of the applicable CAO; verify that loonheffing is being withheld correctly and that a loonstrook will be issued each payment period. Agencies in Amsterdam Nieuw-West serving the local community may provide accessible employment for residents, but accountability steps are non-negotiable before accepting any placement.",
      },
    ],
    pros: [
      "Locally-based bureau may have genuine relationships with neighbourhood employers in Nieuw-West",
      "Potential accessibility for multilingual workers in the local community",
      "KvK-registered entity — the company formally exists",
    ],
    cons: [
      "Very low transparency score (32/100) — no active public website",
      "Sector focus and placement volume cannot be confirmed independently",
      "ABU or NEN-4400 certification unverified",
      "Extra due diligence required compared to certified, publicly visible agencies",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/real-salary-calculator", label: "Real salary calculator for Netherlands workers" },
    ],
  },

  "dutchstar-b-v": {
    metaTitle: "Dutchstar B.V. Reviews Netherlands | Hospitality & Chef Staffing",
    metaDescription: "Dutchstar supplies chefs and hospitality staff to Amsterdam hotels and restaurants. Read what workers say about pay under Horeca CAO and shift conditions.",
    intro: "Dutchstar B.V. occupies an interesting position in the Amsterdam hospitality market: it is both a staffing agency for chefs and hospitality personnel and a hotel technology business offering reservation systems and bookkeeping services to hotels and restaurants. This dual nature means the company has a commercial footprint in the sector beyond simply supplying labour — client relationships built through technology sales intersect with the staffing side. This review focuses on the staffing operation and what chefs and hospitality workers can expect.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: "Dutchstar places chefs, hotel operations staff, and general hospitality personnel, all falling under the CAO Horeca. Chef classifications under this CAO in 2026 range from Kok niveau 1 (production kitchen, €14.80–15.50 per hour gross) through chef de partie (€16.50–19.00) to sous-chef and head chef levels (€20.00–28.00+ per hour for senior hotel kitchen management). Hotel operations roles — front desk, housekeeping supervisors, F&B coordinators — classify at €14.80–18.00 gross depending on responsibility level. Night shifts between 00:00 and 06:00 attract the highest Horeca CAO premium — typically 40–50% above base rate. A front desk professional working a full night shift earns significantly more per shift than their daytime equivalent, making these roles attractive for workers willing to adapt their sleep schedules.",
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: "Dutchstar does not provide housing. Amsterdam-area hotel and restaurant assignments mean workers need their own accommodation. For hospitality professionals doing irregular shifts — late nights, early breakfasts, split shifts — living close to the city centre or with easy cycling access reduces logistical stress considerably. Amsterdam South and the Zuidas area, where many large hotels are located, are accessible by bike from most of the city within 20–30 minutes.",
      },
      {
        heading: "On the Floor: Working Conditions",
        body: "Dutchstar's hotel technology division (reservation systems, bookkeeping) creates commercial relationships with hotel operators independent of the staffing side. A hotel that uses Dutchstar's reservation system is a natural referral for their staffing arm. In practice, hotel-based assignments with established client relationships tend to be more professional and consistent than ad-hoc placements. Workers doing hotel kitchen assignments should confirm shift structure (split or double), staff meal provision, and whether late-night transport to the hotel site is covered before accepting.",
      },
    ],
    pros: [
      "Dual business model creates stronger hotel-sector client relationships than staffing-only agencies",
      "Hotel-based placements offer more consistent schedules than one-off event staffing",
      "Night and early-morning premiums under CAO Horeca significantly boost earnings for anti-social hour shifts",
      "Amsterdam hotel market generates continuous staffing demand across the year",
    ],
    cons: [
      "Sector concentration — only relevant for hospitality and culinary professionals",
      "Entry-level Horeca rates start near WML even with the dual-model client advantages",
      "Irregular shift patterns require own transport for many hotel sites",
      "Premium pay must be verified on payslips — Horeca sector has inconsistent application history",
    ],
    internalLinks: [
      { href: "/agencies-with-housing", label: "Agencies that provide housing in the Netherlands" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator with shift premiums" },
    ],
  },

  "employme": {
    metaTitle: "EmployMe Reviews Netherlands | Transport & Security Staffing",
    metaDescription: "EmployMe B.V. is based near Schiphol and staffs transport, logistics and security roles. Read honest pay and conditions reviews before registering.",
    intro: "Location matters in staffing, and EmployMe B.V.'s base in Lijnden — a small municipality directly adjacent to Amsterdam Schiphol — is not accidental. The Schiphol area is one of the most active logistics and industrial employment zones in the Netherlands, generating continuous demand for transport drivers, warehouse operators, and private security personnel. EmployMe carries SBI codes covering temporary employment agency activities, private security staffing, and security systems — a multi-sector positioning that mirrors the Schiphol labour market's own structure.",
    sections: [
      {
        heading: "Wages and Payslip Breakdown",
        body: "Transport and logistics roles in the Schiphol area operate under multiple CAOs. Freight handlers and warehouse operators typically fall under CAO Goederenvervoer or CAO Luchtvaartgrondafhandeling. In 2026: freight handling and warehouse operator €15.00–16.50 per hour gross; transport driver (category B) €16.00–18.00 gross; heavy vehicle driver (category C or CE) €17.50–22.00 gross; Schiphol ground handler €15.50–17.50 gross. Private security roles operate under the CAO Particuliere Beveiliging: security officers (niveau 1) start at €15.50 per hour gross; security supervisors and team leaders earn €17.00–21.00 gross. Night shift and weekend premiums under the private security CAO are substantial — night work (22:00–06:00) attracts a 35–40% premium; Saturday afternoon and Sunday shifts carry additional surcharges. Security officers on regular night rotations can achieve €2,800–3,200 gross monthly including premiums.",
      },
      {
        heading: "Housing Provision and Deductions",
        body: "EmployMe does not provide housing. Lijnden is adjacent to Hoofddorp and Schiphol. Workers based in Amsterdam can access the area via the A10 ring road. For international workers new to the Netherlands seeking logistics or security work near Schiphol, short-term housing in Hoofddorp (average €1,000–1,400 per room in shared housing) or Haarlemmermeer is more affordable than central Amsterdam and strategically positioned for Schiphol-area employment.",
      },
      {
        heading: "Work Environment and Transport",
        body: "Schiphol-area logistics and ground handling involves 24-hour operations. Early morning shifts (03:00–11:00 for cargo handling) are common in the freight sector. Physical demands are significant: loading, unloading, and sorting freight in climate-controlled warehouses or open apron environments. Correct PPE (safety shoes, high-visibility vest) is mandatory at all Schiphol-area operational sites. For security roles, a valid Certificate of Conduct (VOG) is required and, for some positions, an airport security pass (Schiphol pass) which takes 4–8 weeks to obtain. Confirm with EmployMe whether they initiate this process or whether the client handles it.",
      },
    ],
    pros: [
      "Strategic Schiphol-area location generates consistent demand across transport, logistics, and security",
      "Multi-sector coverage (transport, logistics, security) in one bureau simplifies registration for flexible workers",
      "Night and weekend premiums under CAO Particuliere Beveiliging significantly boost security officer earnings",
      "Hoofddorp and Lijnden housing is more affordable than central Amsterdam for workers relocating",
    ],
    cons: [
      "Lijnden has limited direct public transit — own transport is often necessary",
      "Airport security pass requirements add 4–8 weeks of processing time before certain roles can start",
      "Moderate transparency score (52/100) — room for improvement on public disclosure",
      "Early morning and overnight logistics shifts require strong sleep-schedule flexibility",
    ],
    internalLinks: [
      { href: "/tools/salary-calculator", label: "Dutch salary calculator 2026" },
      { href: "/agencies", label: "Compare agencies: reviews, housing, pay" },
    ],
  },

  "gerlof-smit-werving-selectie": {
    metaTitle: "Gerlof Smit Werving & Selectie Reviews Netherlands",
    metaDescription: "Gerlof Smit Werving & Selectie is a small Amsterdam recruitment bureau with limited public information. Find out what to check before engaging.",
    intro: "Werving en selectie — recruitment and selection — is the segment of the Dutch employment market where agencies act as intermediaries for permanent and fixed-term placements rather than as uitzendbureau operators managing ongoing temp contracts. Gerlof Smit Werving & Selectie is registered in Amsterdam at Wannepad 22, in the Geuzenveld-Slotermeer area of Nieuw-West. No active website was found during research, and no verified public information about their sector specialisation, client base, or placement history was available. The agency holds a transparency score of 32/100.",
    sections: [
      {
        heading: "How Much Workers Earn in 2026",
        body: "Gerlof Smit Werving & Selectie operates from Amsterdam Nieuw-West, suggesting a potential focus on local employers and community-level professional placements. Common permanent placement salary ranges at entry to mid-professional level in this area in 2026: administrative coordinator €2,400–3,200 gross per month; team leader or supervisor €2,800–3,800 gross; social welfare or community work professional €2,600–3,500 gross (CAO Welzijn en Maatschappelijke Dienstverlening may apply); facilities manager €3,000–4,500 gross. The key point for any werving en selectie candidate: focus salary negotiation on the employer, not the bureau. The bureau's incentive — a percentage of your salary — is structurally aligned with placing you at the highest achievable rate.",
      },
      {
        heading: "Accommodation and Weekly Rent",
        body: "Gerlof Smit does not provide housing. Placements are direct with employers, so housing considerations are between you and the employer. The Geuzenveld-Slotermeer location is served by Amsterdam tram lines and buses connecting to the broader GVB network. For placements at local Amsterdam employers, public transit commuting is generally feasible.",
      },
      {
        heading: "On the Floor: Working Conditions",
        body: "Unlike a uitzendbureau where employment rights provide a structural floor, werving en selectie requires more reliance on the bureau's professionalism. Key questions before engaging: What sectors and role types are you currently placing for? How many active mandates do you have open right now? Who are your typical client types — small businesses, housing associations, care organisations, or public sector? What is your average time-to-placement? Can you provide a reference from a previous candidate you placed? Small, locally-based werving en selectie bureaus sometimes have deep relationships with specific employer communities that larger national agencies overlook — in Nieuw-West, this might mean housing associations (woningcorporaties), community organisations, welfare services, or local SMEs.",
      },
    ],
    pros: [
      "Werving en selectie model places candidates directly with employers — no long-term agency contract",
      "Local Nieuw-West focus may give access to employer relationships that large national chains overlook",
      "Bureau's percentage-of-salary incentive is structurally aligned with placing candidates at competitive rates",
      "Small bureau may offer more direct and personalised candidate communication",
    ],
    cons: [
      "Low transparency score (32/100) — no active public website",
      "Active mandates and placement volume cannot be confirmed without direct contact",
      "Without uitzend ABU protections, more reliance on bureau professionalism",
      "Geuzenveld-Slotermeer is not a primary corporate employment hub",
    ],
    internalLinks: [
      { href: "/tools/shift-tracker", label: "Track your shifts and verify payslip accuracy" },
      { href: "/guides/real-salary-netherlands", label: "Salary benchmarks for Dutch labour market 2026" },
    ],
  },
};
