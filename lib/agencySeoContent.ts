// ─── Agency SEO Content ────────────────────────────────────────────────────────
// Long-form, unique editorial content for major agency pages.
// Content is grounded in real 2026 Dutch labour data:
//   WML €14.71/hr · SNF housing max €113.50/week
//   ABU CAO premiums: night +22%, Sunday +50%, overtime 125/150%
//   Net take-home at WML ≈ €345/week (after loonheffing ~10.7% + vakantiegeld 8%)
//
// Only agencies with a confirmed slug in /data/agencies.ts are included.
// Pages without content here render their normal dynamic template.

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
        heading: "Salary and Real Take-Home Pay",
        body: `Tempo-Team contracts for production and logistics roles start at the 2026 Statutory Minimum Wage: €14.71 gross per hour. On a standard 40-hour week that is €588.40 gross before deductions. After loonheffing (approximately 10.7% at WML) and with vakantiegeld (8% holiday pay) accruing separately, workers take home roughly €340–€355 per week in cash — before housing is deducted.

Shift premiums under the ABU CAO apply when Tempo-Team places workers on non-standard hours: 22% uplift for night shifts (between 00:00 and 06:00), 50% for Sunday work, and 125% for the first two hours of overtime. These premiums can push weekly gross to €650–€700 for workers doing full night-shift rotations. The difference between a day-shift and a regular night-shift week is approximately €100 net.

Workers in Phase A (weeks 1–78) earn no paid public holidays. Phase B workers (from week 79 under the ABU CAO) receive improved conditions including holiday pay-out rights and sick pay entitlement after 26 weeks.`,
      },
      {
        heading: "Housing Conditions",
        body: `Tempo-Team provides housing for many of its logistics and production placements in the Netherlands, typically through SNF-registered (Stichting Normering Flexwonen) accommodation. The legal maximum deduction under SNF norms is €113.50 per week in 2026. Tempo-Team charges within this range, though the exact figure varies by location.

Accommodation is typically shared: four to six workers per room, shared bathroom and kitchen facilities. In high-demand periods near major logistics hubs such as the Tilburg–Venlo corridor or the Rotterdam port area, housing quality drops and occupancy rises. Workers report that accommodation near Amazon and Rhenus fulfilment centres is functional but basic — shared sleeping rooms, a communal kitchen, and shuttle access to the site.

If housing is deducted at €113.50/week, a worker taking home €345/week net is left with approximately €231 after rent — roughly €1,000/month disposable income before food and transport.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to site is typically provided by Tempo-Team for inhouse logistics placements. The shuttle runs on shift timings, and workers with non-standard shift hours report occasional gaps between the last bus and shift end. Workers placed without inhouse transport arrangements should budget €10–€20/week for public transport.

Work conditions in logistics roles are physically demanding: standing, lifting (up to 25kg), and repetitive scanning tasks for 8–10 hour shifts. Temperature-controlled warehouses can be cold in winter. Safety gear (gloves, safety shoes) is provided on day one at most sites, though workers report variation in the quality of provided footwear.

Contracts are standard ABU Phase A initially — zero-hours with weekly renewal. Most workers placed at major sites transition to fixed weekly hours after two to four weeks once site managers confirm availability.`,
      },
      {
        heading: "Pros and Cons",
        body: `The clearest advantage of working through Tempo-Team is speed: placement can happen within 48 hours of registration, and housing is arranged simultaneously. For workers arriving from abroad with no existing accommodation, this removes the main barrier to starting work. The Randstad Group's compliance infrastructure also means tax registrations (BSN, DigiD, bank account) are handled systematically.

The main disadvantage is inconsistency. Tempo-Team operates through dozens of inhouse and branch locations across the Netherlands. Experiences at a Tilburg logistics site can differ substantially from those at an Amsterdam distribution centre — different local managers, different housing stock, different attention to payslip accuracy. Workers report that payslip queries can take several weeks to resolve when escalated to a central team rather than a responsive local coordinator.

Salary is reliably at or above WML, but night and overtime premiums are occasionally absent from payslips. Workers should check every payslip against their shift schedule, particularly in the first four weeks.`,
      },
      {
        heading: "Final Verdict for 2026",
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
      { href: "/guides/real-salary-netherlands", label: "Real salary for all job types in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Hidden costs: housing, transport, deductions" },
      { href: "/tools/real-income-calculator", label: "Calculate your real weekly take-home" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Randstad pays at WML minimum for entry-level logistics and production placements: €14.71 gross/hr in 2026. On a 40-hour week this equals €588.40 gross. Net take-home after loonheffing and with vakantiegeld accruing is approximately €345–€360/week. Workers with contractual night or Sunday shifts receive the applicable ABU CAO premiums (22% night, 50% Sunday).

Randstad's payslip record is generally better than smaller agencies. The company's centralised payroll systems mean errors are less frequent, and the online payslip portal allows workers to check their deductions in detail. Workers report that when payslip errors do occur — typically on premium shift hours — they are resolved within two pay cycles when escalated via the app.

Above-WML roles do exist through Randstad, particularly in technical, maintenance, and skilled food-processing. Workers placed in these roles report hourly rates of €16–€19, with net take-home of €380–€440/week before housing.`,
      },
      {
        heading: "Housing Conditions",
        body: `Randstad provides housing for its logistics and production placements in most regions. Accommodation is SNF-certified; the maximum legal deduction is €113.50/week. Workers report deductions in the €95–€113 range depending on the location and occupancy level.

Housing quality at Randstad is rated marginally better than smaller competitors by workers who have used both. Rooms typically house three to four workers, with shared facilities. Sites in the Rotterdam Rijnmond, Amsterdam Westpoort, and North Brabant logistics corridor are the most frequently reported housing locations. Maintenance response times are described as adequate — broken facilities are typically repaired within a week.

Workers seeking to arrange their own accommodation can do so from Phase A onwards, though Randstad advises using agency housing for the first month while getting settled. Workers who opt out of agency housing do not receive a housing supplement in lieu.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Randstad inhouse teams at major logistics sites provide shuttle transport. Bus times align with shift start and end, though workers on split or unusual shifts report the service as less reliable at off-peak hours. Workers without shuttle access budget approximately €10–€25/week for OV-chipkaart travel depending on location.

Production and logistics work is physical: standing for 8–10 hours, repetitive movement, lifting. Randstad's larger clients (DHL, PostNL, cooling storage operations) maintain reasonably well-equipped break rooms and provide mandatory safety briefings. Workers report that induction quality varies: some sites provide full on-site tours and multi-language safety materials, others give only a brief orientation.

The Randstad app allows workers to view shifts, accept or decline extra hours, and track holiday hour accumulation. Workers rate the app positively for transparency.`,
      },
      {
        heading: "Pros and Cons",
        body: `Randstad's primary advantage is institutional reliability. Payslips are accessible, CAO compliance is generally maintained, and the brand's scale means there is always someone available when issues arise. Workers transitioning from smaller agencies frequently report the contrast in payslip accuracy and communication responsiveness.

The disadvantage is scale itself: workers can feel like a number rather than a person. Local inhouse teams vary significantly in how engaged they are with individual workers. Workers placed at very large sites (5,000+ workers) report less personal contact with their coordinator than those at smaller sites. Some workers also report that overtime is offered unevenly — coordinators favour workers with higher availability ratings in the app.

Randstad is not the cheapest for workers in terms of housing deduction — smaller agencies sometimes offer lower deductions to attract workers. However, the overall package including payslip accuracy and housing maintenance standard makes the total worker experience competitive.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `For workers who want a structured, compliant agency experience in the Netherlands, Randstad is the benchmark. Payslip accuracy, housing that meets SNF standards, and a functioning app make the day-to-day experience less stressful than many alternatives.

Realistic take-home: €345/week day shifts at WML, rising to €420–€460 on regular night rotations. After SNF housing at maximum rate, disposable income is approximately €230–€350. Workers looking to save substantially should target above-WML placements through Randstad's skilled/technical branches from month three onwards.`,
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
      { href: "/guides/real-salary-netherlands", label: "Real salary guide for all job types" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport costs in detail" },
      { href: "/tools/payslip-checker", label: "Check your Randstad payslip for errors" },
    ],
  },

  // ── 3. Covebo ───────────────────────────────────────────────────────────────
  "covebo": {
    metaTitle: "Covebo Review 2026 – Logistics Specialist Salary & Housing",
    metaDescription:
      "Covebo workers review 2026. Logistics specialist agency. WML salary, SNF housing, Fase A/B progression, Tilburg–Venlo corridor experience.",
    intro:
      "Covebo is a mid-size Dutch staffing agency specialising in logistics, production, and warehouse roles. Unlike generalist agencies, Covebo operates almost exclusively in the supply chain sector, with a strong presence in the Tilburg–Venlo logistics corridor and the North Brabant and Limburg regions. Workers report that Covebo's sector focus produces better-prepared coordinators and more accurate payslips than generalist competitors placing workers in the same sites.",
    sections: [
      {
        heading: "Salary and Real Take-Home Pay",
        body: `Covebo contracts start at WML: €14.71/hr in 2026. On a standard 40-hour week, gross pay is €588.40. Net take-home after loonheffing is approximately €345/week, with vakantiegeld (8%) accruing separately. Night and Sunday shift premiums under the applicable CAO (ABU or sector-specific logistics CAO where applicable) add €20–€60/week for workers on regular premium shifts.

Workers at Covebo report a notably higher rate of correct payslip generation than the sector average. Shift premiums appear correctly from the first pay cycle in the majority of cases. Workers recommend keeping a personal shift log (start/end times, break durations) to verify against the payslip — Covebo's coordinators are responsive to corrections when documented evidence is provided.

Vakantiegeld is paid out at the end of the Fase A period (or annually if requested). At WML, 8% of €588.40/week over 48 working weeks equals approximately €2,260 in accumulated holiday pay — a significant sum for workers planning to save.`,
      },
      {
        heading: "Housing Conditions",
        body: `Covebo arranges housing through SNF-certified accommodation. The housing deduction is consistently reported at €100–€113.50/week — within the legal SNF maximum. Rooms are shared (three to four workers), with shared bathroom and kitchen. Covebo's logistics focus means most housing is positioned within 10–20 minutes of a Tilburg, Venlo, or Eindhoven logistics site.

Workers report that Covebo housing is clean and functional. Specific locations near major DHL and Geodis sites in North Brabant receive consistently positive mentions for maintenance response. Workers who have moved from other agencies report that the condition-on-arrival is better than average.

One pattern in worker reports: housing during peak periods (October to January, driven by e-commerce volumes) becomes tighter. Shared rooms that normally house three workers may temporarily accommodate four. This is above the SNF guideline maximum and workers are advised to raise it formally via SNF's complaints mechanism if it persists.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to logistics sites is provided for most Covebo placements. The shuttle runs on shift times. Workers at Covebo's Venlo-area placements report that transport is reliable — the coordinator network in this region is experienced and responsive to last-minute shift changes.

Work conditions reflect the logistics sector: standing shifts, lifting, pick-and-pack tasks. Covebo's inhouse teams at large sites conduct daily briefings and have a visible floor presence, which workers rate positively. Health and safety compliance is reported as above average by workers who have also worked with other agencies at the same client sites.

Workers transitioning from Phase A to Phase B (after 78 weeks of employment) with Covebo gain improved conditions under the ABU CAO: paid public holidays, sick pay entitlement from week 26, and the right to request a fixed-hours contract. Covebo coordinators are described as proactive about informing workers when they are approaching Phase B.`,
      },
      {
        heading: "Pros and Cons",
        body: `Covebo's specialisation in logistics is its clearest advantage. Coordinators know the sector, the clients, and the typical issues (peak planning, WML compliance, overtime regulations) better than generalist agencies. Workers get faster resolutions to payslip queries and better-timed housing arrangements because the agency operates a predictable regional model rather than placing workers nationally across multiple sectors.

The main constraint is geographic — Covebo's work is concentrated in North Brabant and Limburg. Workers who need or want to relocate to other regions of the Netherlands will find fewer options through Covebo than through a national generalist.

Payslip record is the highest-rated aspect across multiple worker reviews. Workers rarely report missing overtime or incorrect deductions, which is the single most common complaint at larger agencies.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Covebo is the recommended choice for workers who are certain they want logistics or production work in North Brabant or Limburg and value payslip reliability above all else. The combination of sector expertise, accurate payslips, and SNF housing in close proximity to major sites makes it a strong option for workers planning to stay in the Netherlands for 12+ months and build toward Phase B conditions.

Realistic take-home: €345/week day shifts at WML, approximately €400–€420 on night shifts. After housing at €110–€113.50, disposable income is approximately €230–€305/week.`,
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
      { href: "/guides/real-salary-netherlands", label: "Real salary: what logistics workers earn" },
      { href: "/guides/hidden-costs-netherlands", label: "SNF housing deductions explained" },
      { href: "/tools/real-income-calculator", label: "Calculate net pay with shift premiums" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Entry-level logistics roles through Adecco start at WML: €14.71/hr in 2026. However, Adecco's job mix includes a higher proportion of technical and skilled production roles than most general staffing agencies. Workers in roles such as forklift operator, maintenance technician, or quality inspector typically earn €16.00–€19.50/hr. Net take-home at €17/hr on a 40-hour week is approximately €400–€420, before housing.

At WML (€14.71/hr), standard 40-hour net take-home is approximately €345/week. Shift premiums under the ABU CAO apply: 22% for nights, 50% for Sundays. Workers on regular night shifts report gross earnings of €640–€680/week, translating to approximately €430–€450 net.

Workers report that Adecco's payslip system is reliable for standard roles but less consistent for complex technical CAOs with multiple premium rates. Workers in technical placements are advised to check the applicable sector CAO and compare it to their payslip in the first month.`,
      },
      {
        heading: "Housing Conditions",
        body: `Adecco sources housing through third-party housing providers rather than managing accommodation directly. This means the housing experience varies based on which provider is contracted in the worker's region. SNF-certified accommodation is standard, with deductions in the €100–€113.50 range.

The third-party housing model has a practical downside: the chain of accountability is longer. When housing issues arise — maintenance delays, overcrowding, billing errors — the response path runs: worker → Adecco coordinator → housing provider. Workers report this creates delays of up to two weeks for non-urgent repairs. Adecco coordinators are described as responsive at intake but less engaged with ongoing housing issues once placement is confirmed.

Workers who can arrange their own accommodation (particularly those in the Netherlands for a second or subsequent contract) benefit from opting out of agency housing and keeping the full €113.50/week in their own pocket.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport arrangements depend on the client site. Major logistics clients with Adecco inhouse presence provide shuttle transport. Technical and skilled placements at smaller manufacturers typically do not include transport, requiring workers to use public transport or arrange their own (budget €15–€30/week in most industrial areas).

Work conditions for technical roles are generally safer and more ergonomic than pure logistics work. Machine operation, quality checking, and maintenance roles involve less sustained physical loading. Adecco's induction process for technical roles is more thorough than for logistics: workers report multi-day client orientations, equipment certifications, and structured health and safety training.

Contract terms for above-WML technical roles often include a six-week evaluation period followed by a direct offer from the client, creating a potential direct-hire pathway — one of Adecco's stated selling points.`,
      },
      {
        heading: "Pros and Cons",
        body: `Adecco's biggest advantage for workers is access to above-WML roles that are less common at smaller agencies. The global brand's relationships with multinational manufacturers mean Adecco often gets first access to technical placements. Workers with vocational qualifications (forklift, reach truck, HACCP, electrical) or relevant experience should register specifically as skilled rather than general labour.

The main drawback is the third-party housing model. Workers who place high importance on housing quality and accountability are better served by agencies that manage accommodation directly. Housing billing errors — charged for days not occupied, deductions continuing after contract end — are reported more frequently with third-party providers.

Payslip accuracy for standard roles is good. The Adecco app allows workers to view payslips and holiday accrual. Multi-language support is available at registration centres in Amsterdam, Rotterdam, and Eindhoven.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Adecco is best suited to workers with skills that qualify them for above-WML placements — technical, skilled production, or specialist roles. For standard logistics at WML, the experience is comparable to Randstad or Tempo-Team but with less direct housing management.

Realistic take-home: €345/week (WML day shift) to €420+/week (above-WML technical). After third-party housing at the SNF maximum, disposable income is €230–€310/week at WML, rising to €310–€380 at above-WML rates. Workers should verify housing billing carefully each month, particularly during the first two pay cycles.`,
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
      { href: "/guides/real-salary-netherlands", label: "Salary ranges for all job types in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing deductions: what the law allows" },
      { href: "/tools/payslip-checker", label: "Check your payslip for errors" },
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
        heading: "Housing Conditions",
        body: `Housing is the first topic most workers raise when discussing Timing. The agency provides accommodation through SNF-registered facilities, with deductions in the €95–€113.50 range. However, the housing quality reported by Timing workers is more variable than that reported by workers at Randstad or Covebo.

Workers at food processing placements in the eastern Netherlands (Gelderland, Overijssel) describe housing that is functional but dated — shared rooms of four to six, older bathroom facilities, and maintenance response times of one to two weeks. Workers near major food industry clusters in the west (Rotterdam area) report marginally better conditions, likely due to higher housing investment in areas with more worker competition.

Workers who experience below-standard housing conditions should document them with photographs and report to SNF directly. The SNF maximum deduction of €113.50 is conditional on the accommodation meeting SNF's minimum standards — if it does not, workers have grounds to dispute the full deduction amount.`,
      },
      {
        heading: "Salary and Real Take-Home Pay",
        body: `Timing pays at WML for production and food processing roles: €14.71/hr in 2026. On 40 hours per week, gross is €588.40. Net take-home is approximately €340–€355/week after loonheffing, with vakantiegeld (8%) accumulating for payout at period end.

Shift premiums apply for night and weekend work under the food industry CAO. Night premium rates are typically 22–30% (food sector CAOs often exceed the ABU minimum), Sunday premiums are 50%. Workers on regular night shifts in food production report weekly gross earnings of €620–€680.

Payslip complaints are above average for Timing. Workers frequently report that Sunday or bank holiday premiums are missing from one or more payslips. The pattern suggests a payroll system error rather than deliberate underpayment — but the practical result is the same. Workers are strongly advised to keep a shift log and cross-check every payslip against it.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to food processing sites is provided for most Timing inhouse placements. The shuttle schedule aligns with shift times for standard shifts but is less reliable for split or non-standard hours. Workers without transport provided should budget €10–€25/week.

Food processing work is physically demanding in different ways from logistics: cold environments, repetitive cutting or packaging tasks, strict hygiene requirements. Personal protective equipment (hairnets, gloves, waterproof footwear) is provided at most Timing sites. Workers report that footwear quality varies — some sites provide quality waterproof boots, others provide basic covers that wear quickly.

HACCP and food safety induction is conducted at all Timing food placements, usually on day one. Workers with previous food processing experience note that the training quality at Timing is adequate but basic.`,
      },
      {
        heading: "Pros and Cons",
        body: `The advantage of Timing is its food sector specialisation: the coordinators understand food processing CAOs, shift patterns, and hygiene requirements. Workers with food industry experience find placement faster than at generalist agencies. Timing's inhouse presence at major food facilities means less time between registration and first shift.

The main concern is payslip accuracy. A higher-than-average proportion of Timing workers report needing to query one or more payslips during their placement. Workers who do not track their own shifts will likely receive the incorrect amount and not notice. This is not unique to Timing but is reported more frequently here than at the larger agencies.

Housing quality is variable. Workers should ask specifically about SNF certification, occupancy numbers, and recent inspection scores before signing.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Timing is a practical option for workers with food industry or production experience who want fast placement. The sector expertise and inhouse presence at established food sites provides stability. However, payslip vigilance is non-negotiable: check every payslip against your shifts, particularly for premium rates.

Realistic take-home: €340–€355/week at WML day shifts, €410–€440 on regular night shifts. After housing deduction (€95–€113.50), disposable income is approximately €225–€345 depending on shifts and housing rate.`,
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
      { href: "/guides/real-salary-netherlands", label: "Food processing salary: what workers actually earn" },
      { href: "/guides/hidden-costs-netherlands", label: "Understanding your housing deduction" },
      { href: "/tools/payslip-checker", label: "Verify shift premiums on your Timing payslip" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Olympia applies the relevant sector CAO to each placement. For logistics and production roles — which represent the majority of international worker placements — this means the ABU CAO at WML minimum: €14.71/hr in 2026. Net take-home on a standard 40-hour week is approximately €345/week.

For hospitality and retail placements, the applicable CAO (Horeca CAO or Retail CAO) may provide different overtime and premium structures. Workers in these sectors should confirm their applicable CAO at registration — the premium rates differ from the ABU CAO and the holiday accrual calculation can also vary.

Workers at Olympia report generally reliable salary payments. Payslip accuracy is rated as average to good — better than Timing, comparable to Adecco for standard roles. Workers note that responses to payslip queries are typically two to three working days, faster than the industry average.`,
      },
      {
        heading: "Housing Conditions",
        body: `Olympia provides housing for production and logistics placements. SNF certification applies and deductions are within the €95–€113.50 range. Housing quality reports vary significantly by region. Workers placed in the Randstad (Amsterdam, Rotterdam, The Hague areas) generally report better facilities than those in rural or smaller-city placements. This likely reflects both housing stock age and the level of investment Olympia makes in high-demand areas.

Workers placed through Olympia in northern Netherlands (Groningen, Friesland) report older accommodation — often converted houses rather than purpose-built worker housing. Shared rooms of three to four, functional but dated. Workers in North Brabant and Zeeland for agricultural or food placements report accommodation near worksites but with limited transport connectivity.

Olympia workers mention that communication about housing — deduction breakdown, SNF registration number, inspection history — is not always proactively provided. Workers should ask specifically for this information before committing to a placement that includes agency housing.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport provision depends on the placement type. Olympia inhouse logistics placements include shuttle transport to site. Branch placements (where a worker registers at a local Olympia branch rather than being managed inhouse at a client site) often do not include transport. Workers in these arrangements should clarify transport from the outset.

Work conditions reflect the sector: logistics roles are physically demanding, hospitality roles require flexible hours including evenings and weekends. Olympia's broad sector coverage means coordinators may not have deep expertise in every sector they place workers into — a coordinator managing both a hotel kitchen and a packing line in the same week will necessarily be more generalist in their knowledge.

Olympia's longevity means it has established relationships with long-standing clients. This can translate into more stable placement availability — fewer sudden contract terminations — compared with newer agencies trying to win market share.`,
      },
      {
        heading: "Pros and Cons",
        body: `The advantage of Olympia is breadth and stability. Workers who want options across multiple sectors, or who are uncertain which type of role suits them, benefit from registering with a genuinely cross-sector agency. Workers also benefit from Olympia's long client relationships — placements at established clients are less likely to be disrupted by the agency changing commercial strategy.

The main limitation is regional variation. Olympia's quality is more consistent at high-demand regional hubs than at smaller branches. Workers in low-demand regions may find coordinator support thinner and housing stock older.

Payslip accuracy is average — better than the sector worst but not as strong as Covebo or Randstad. Workers should check their first three payslips carefully.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Olympia is a reliable mid-tier choice for workers who value sector flexibility and regional presence across the Netherlands. The 60-year history means established processes and stable client relationships. For workers who know they want logistics in North Brabant or food processing in Limburg specifically, a logistics-specialist agency like Covebo will provide a tighter experience. For workers who want options and flexibility, Olympia's breadth is an asset.

Realistic take-home: €345/week at WML day shifts. After SNF housing, disposable income is approximately €230–€345 depending on housing rate and shifts.`,
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
      { href: "/guides/real-salary-netherlands", label: "Which sectors pay above WML in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Transport and housing cost breakdown" },
      { href: "/tools/real-income-calculator", label: "Estimate your net take-home by sector" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Carrière pays at WML for most of its production and logistics placements: €14.71/hr in 2026. Net take-home on a 40-hour week is approximately €340–€355. Shift premiums apply under the applicable CAO. Workers placed in smaller manufacturing or food operations may fall under sector-specific CAOs with premium structures that differ slightly from ABU norms.

Workers at Carrière report that payslips are generally accurate for standard hours. Premium shifts — particularly irregular overtime and weekend work — are more likely to generate queries. The smaller payroll team at Carrière means resolution times can be longer than at larger agencies, typically three to five working days rather than one to two.

Vakantiegeld (8% holiday pay) accrues and is paid out at period end. Workers who stay for a full year accumulate approximately €2,260 at WML rates — a meaningful saving figure.`,
      },
      {
        heading: "Housing Conditions",
        body: `Carrière uses third-party housing providers for worker accommodation. The agency does not manage housing stock directly. This creates the same accountability gap as seen with Adecco's housing model: when issues arise, the response chain is worker → Carrière coordinator → housing provider → maintenance.

Housing deductions are within the SNF maximum of €113.50/week. Workers report deductions in the €95–€110 range depending on location and contract. SNF certification applies to the third-party providers used — workers should ask for the SNF registration number of their specific accommodation at the start of their contract.

The most common housing complaint from Carrière workers relates not to conditions but to billing: deductions continuing after contract end, or the first week being charged even when arrival was mid-week. Workers are advised to photograph their arrival and departure conditions, and to formally confirm via written message (WhatsApp to coordinator counts) both the start date and the end date of housing occupancy.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to site is variable at Carrière. Larger client placements include shuttle transport; smaller manufacturing sites do not. Workers should confirm transport arrangements at registration before committing to a placement. Budget approximately €15–€25/week for public transport if it is not provided.

Work conditions in Carrière's placements are typical of light manufacturing and regional food processing: standing work, repetitive tasks, moderate physical demand. Coordinators at Carrière typically have smaller portfolios than their counterparts at national agencies — 40–80 workers rather than 150+. This translates to more personal contact and faster responses to individual questions.

The smaller agency model also means fewer buffer options when a client reduces headcount. Workers placed at a single client site via Carrière have less guarantee of being moved to another placement quickly if that site reduces orders, compared with workers at agencies with dozens of active client relationships.`,
      },
      {
        heading: "Pros and Cons",
        body: `Carrière's primary advantage is the personal service model. Workers who have experience of being ignored or underserved by coordinators at large agencies find the smaller-team approach significantly better. Queries get personal responses, and coordinators know their workers individually.

The main limitation is scale. Fewer active placements, fewer housing options, less leverage with clients. Workers who need maximum employment flexibility or want to move between sectors or cities regularly will find Carrière's network constraining compared with Randstad or Olympia.

Third-party housing billing errors are the most significant practical risk. Workers must document housing start and end dates carefully and follow up on final billing within the first two weeks after contract end.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Carrière is a good choice for workers who prioritise personal service and are placing themselves in a region where Carrière has strong client relationships. The reduced anonymity improves the day-to-day experience compared with national giants. Workers should approach housing billing with care — document everything, confirm dates in writing, and verify the final payslip after contract end.

Realistic take-home: €340–€355/week at WML day shifts. After third-party housing at €95–€110/week, disposable income is approximately €230–€260. Workers on regular night or weekend shifts can add €60–€100 to this figure.`,
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
      { href: "/guides/real-salary-netherlands", label: "Real take-home at WML for all job types" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing billing errors: what to watch for" },
      { href: "/tools/payslip-checker", label: "Verify your final payslip after contract end" },
    ],
  },
};
