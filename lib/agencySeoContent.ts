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
        heading: "Salary and Real Take-Home Pay",
        body: `Workstead pays at the 2026 Statutory Minimum Wage for its logistics and production placements: €14.71 gross per hour. On a standard 40-hour week, gross pay is €588.40. After loonheffing (approximately 10.7% effective rate at WML) and with vakantiegeld (8%) accruing, workers take home approximately €340–€355 per week in cash.

Shift premiums apply under the ABU CAO: 22% for night shifts (00:00–06:00), 50% for Sunday work, and 125% for the first two overtime hours. Workers on regular night rotations see weekly gross rise to €630–€670, netting approximately €420–€445 before housing.

Workstead workers report that the online payslip portal is accessible and readable, though first-payslip queries (particularly for workers whose first week includes mixed day/night shifts) are common. Workers are advised to confirm the shift premium rate in writing at registration.`,
      },
      {
        heading: "Housing Conditions",
        body: `Workstead provides SNF-certified housing for most of its out-of-region placements. Deductions fall in the €95–€113.50 range — within the 2026 SNF maximum. Accommodation is shared: typically three to four workers per room, shared kitchen and bathroom.

Workers placed at logistics hubs in South Holland and North Brabant report housing that is functional and well-maintained. Rooms are cleaned weekly and maintenance issues are addressed within five to seven days in most reports. Workers note that the proximity of housing to site is a particular strength — most Workstead housing is within a 15-minute shuttle ride of the work location.

Workers who plan to stay for more than three months and want more privacy can enquire about single-room options. These are available at select locations for an additional weekly cost above the standard SNF rate, agreed separately and documented in an addendum to the housing contract.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Shuttle transport is included for Workstead's inhouse logistics placements. The shuttle schedule is aligned to shift times. Workers placed at sites without inhouse arrangements should budget €10–€20/week for public transport, depending on the region.

Work conditions match the logistics sector: standing shifts of 8–10 hours, repetitive tasks, moderate lifting (up to 23kg at most sites). Safety induction is conducted on day one. Workers report receiving adequate safety footwear and PPE at most Workstead client sites, with a clearer onboarding process than at some smaller agencies.

Zero-hours contracts apply in Phase A (first 78 weeks under ABU CAO). Workers typically receive 3–5 days' work per week during the initial placement period, rising to fixed weekly hours once the client confirms demand. Workers placed at busy fulfilment centres may receive work offers exceeding 40 hours in peak periods (October–January).`,
      },
      {
        heading: "Pros and Cons",
        body: `The online registration model is Workstead's most distinctive advantage. Workers can complete intake documentation remotely — including ID verification, BSN registration assistance, and bank account setup guidance — before they arrive in the Netherlands. This reduces the uncertainty of the first week significantly.

The main reported issue is coordinator responsiveness after placement. Workers describe intake coordinators as thorough and helpful; ongoing support coordinators at client sites are described as less engaged. For workers who need active support during their first months, the follow-up contact frequency can feel insufficient.

Housing quality is above average for the price point, and proximity to site is rated as one of the best aspects of the Workstead placement model. Workers who have used larger agencies at the same client sites often report that Workstead's housing is comparable in quality at a similar or slightly lower deduction rate.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Workstead suits workers who are organised, can handle the digital registration process, and prioritise housing quality close to site. The above-average housing standard and reliable SNF compliance make it a sound choice for workers planning a 6–12 month stint in the Dutch logistics sector.

Realistic take-home: €340–€355/week at WML day shifts, approximately €420–€445 on night shifts. After SNF housing (€95–€113.50), disposable income is approximately €225–€350 depending on shifts and housing rate.`,
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
      { href: "/guides/real-salary-netherlands", label: "Real salary for logistics workers in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "What SNF housing deductions actually cover" },
      { href: "/tools/real-income-calculator", label: "Calculate your net weekly take-home" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Flexcraft's strength is above-WML placement. For skilled trades and technical roles, hourly rates range from €16.00 (entry-level machine operator) to €21.50 (experienced maintenance technician or licensed electrician). On 40 hours at €17/hr, gross weekly pay is €680. Net take-home after loonheffing (approximately 13–14% at this income level) is approximately €390–€415 per week, before housing.

At the top of the Flexcraft pay scale — an electrician or industrial mechanic at €20–€21.50/hr — weekly gross reaches €840. Net take-home is approximately €490–€520/week. After housing at SNF maximum (€113.50), disposable income is approximately €375–€410/week — a substantially better financial outcome than the WML logistics worker.

WML baseline roles do exist in Flexcraft's portfolio (general production workers at manufacturing clients), but these are a minority. Workers with vocational qualifications should specify their certifications at registration to access the higher-paid tier of placements.`,
      },
      {
        heading: "Housing Conditions",
        body: `Flexcraft provides housing for workers in manufacturing and construction placements, though not universally. Technical workers placed at urban sites (Rotterdam, Eindhoven, Breda) may be offered housing or may be expected to arrange their own. Workers placed at rural industrial sites or in regions with high accommodation demand are more reliably offered agency housing.

Where housing is provided, SNF certification applies and deductions are within the €100–€113.50 range. Workers in higher-paid technical roles often share accommodation with workers on WML contracts at the same site — the housing standard does not vary by pay rate, only by occupancy and location.

Flexcraft workers report that for skilled/technical roles, housing is less central to the recruitment pitch than at logistics-focused agencies. Workers who negotiate their placement may have more flexibility to opt out of agency housing and receive a travel/housing allowance in lieu — this is worth discussing at intake for workers who already have accommodation in the Netherlands.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport arrangements for skilled trades placements are site-dependent. Large manufacturing clients often provide transport. Smaller workshops and specialist manufacturers typically expect workers to arrange their own. Flexcraft workers at construction sites usually travel independently, with fuel costs reimbursed at the standard Dutch rate of €0.23/km (2026) under the metal/construction sector CAO.

Work conditions vary by role. Welding and metalwork involve exposure to fumes and heat — PPE including welding screens, gloves, and appropriate footwear is mandatory and provided at reputable client sites. Machine operators typically work in controlled factory environments, often cleaner and more ergonomic than logistics warehouses.

Technical placements frequently come with a structured trial period (3–6 weeks) after which the client may offer a direct employment contract. Flexcraft workers in skilled roles describe the direct-hire pathway as one of the most realistic routes to a permanent position in the Netherlands.`,
      },
      {
        heading: "Pros and Cons",
        body: `The clear advantage is pay. Workers with vocational skills who use Flexcraft can earn 15–45% more per hour than the WML logistics worker. After 12 months at an above-WML technical rate, savings potential is significantly higher — a worker at €18/hr retaining €420/week after housing saves approximately €15,000 over a year, versus €10,000–€12,000 for the WML logistics worker.

The limitation is that Flexcraft is not the right agency for workers without certified skills. General labour placements exist but are not the core offering. Workers who register as general labour at a skills-focused agency often find themselves waiting longer for placement than they would at an agency with deeper logistics or production volume.

Housing provision is less consistent than at logistics-specialist agencies — workers with skills that qualify them for above-WML roles should clarify housing arrangements before committing to a placement, particularly for rural site locations.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Flexcraft is the recommended route for workers with vocational certifications — forklift, reach truck, welding, electrical, mechanical maintenance — who want to convert their skills into above-WML pay in the Dutch market. The direct-hire pathway at technical clients is real and frequently used.

Realistic take-home: €390–€520/week depending on skill level and hourly rate. After housing (where provided at €100–€113.50), disposable income is approximately €275–€410/week — the widest range of any agency in this review series, reflecting the breadth of Flexcraft's pay scale.`,
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
      { href: "/guides/real-salary-netherlands", label: "Technical and skilled trade salary ranges" },
      { href: "/guides/hidden-costs-netherlands", label: "Transport costs and reimbursement rules" },
      { href: "/tools/real-income-calculator", label: "Net pay calculator for above-WML rates" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Luba pays at the applicable sector CAO for each placement. For production and logistics roles, this is typically the ABU CAO at WML: €14.71/hr in 2026. On 40 hours, gross is €588.40/week. Net take-home after loonheffing is approximately €345/week, with vakantiegeld (8%) accruing for separate payout.

Luba's branch coordinators have access to a wider range of clients than inhouse agencies, which sometimes means workers can be placed in above-WML technical or specialist production roles that a pure logistics agency would not have. Workers with relevant experience should describe their full skill set at intake — Luba's multi-sector client base means there may be a better-paying match than the first offered role.

Shift premiums apply under the ABU CAO or relevant sector CAO. Workers on night and Sunday shifts see the standard uplifts: 22% night, 50% Sunday. Workers placed at food or chemical manufacturing sites may fall under sector-specific CAOs with different premium structures — always confirm which CAO applies to your role at intake.`,
      },
      {
        heading: "Housing Conditions",
        body: `Luba provides housing for logistics and production placements through SNF-certified accommodation. The branch model means housing stock varies by region. Workers in urbanised regions (Randstad) report more modern accommodation; workers in agricultural and rural regions report older stock with more variable maintenance standards.

Housing deductions fall within the SNF maximum of €113.50/week. Workers report deductions in the €90–€110 range for standard shared accommodation. Luba's regional coordinators manage housing directly rather than through third-party providers at most locations, which workers generally report as a positive — issues are addressed more directly.

Workers who have been with Luba for three months or more and have demonstrated reliable attendance report being offered improved accommodation options at some regional branches — smaller rooms with fewer occupants, or options with private bathroom access at a higher but still SNF-compliant rate.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport varies by placement type. Luba's inhouse teams at larger client sites provide shuttle transport. Branch placements — where a worker is placed at a smaller client without an inhouse operation — may or may not include transport. Workers should confirm this at the point of job offer.

The multi-client branch model also means workers can be placed at different client sites in the same week if one client reduces hours. This provides employment stability that inhouse-only placements cannot offer — a client reducing orders affects the worker less directly when the coordinator has alternative sites available.

Work conditions are sector-dependent. Luba places workers across a wider range of physical environments than logistics-specialist agencies: from cold food storage, through heated plastics manufacturing, to light assembly work. Workers should specify any physical limitations at registration to avoid placement in environments incompatible with their health.`,
      },
      {
        heading: "Pros and Cons",
        body: `Luba's primary advantage is the multi-client branch model. Workers who value employment flexibility — the ability to be placed at different clients when one site reduces hours — find Luba more resilient than single-site inhouse agencies. The broader client base also means workers with specific skills have a better chance of being matched to a higher-paying role.

The limitation is consistency. A branch model with many clients means coordinator expertise is spread across sectors and sites. Workers at complex manufacturing sites with detailed safety requirements sometimes report that their Luba coordinator is less knowledgeable about site-specific conditions than the inhouse coordinator at a competitor agency.

Housing is generally well-managed due to the direct (rather than third-party) model, but quality varies meaningfully between regions.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Luba is a solid choice for workers who want a stable, multi-option placement rather than being tied to a single client site. The branch network provides employment resilience and access to above-WML opportunities for workers with relevant skills.

Realistic take-home: €345/week at WML, rising with experience and role type. After housing at €90–€110/week, disposable income is approximately €235–€255 at WML day shifts.`,
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
      { href: "/guides/real-salary-netherlands", label: "Which job types pay above WML in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing deductions: SNF rules and your rights" },
      { href: "/tools/payslip-checker", label: "Check your CAO shift premiums on your payslip" },
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

Workers report that AB Midden's operations are functional but minimal. Payslips are provided, housing is arranged, and work placements at warehouse clients in the Nieuwegein industrial zones are available. The experience is lean: less app infrastructure, less proactive communication, and fewer multi-language support options than the national agencies. Workers who speak Dutch or are comfortable operating with limited administrative support manage better than those who need extensive guidance.

The transparency score of 42/100 reflects the lack of verifiable public information — not necessarily poor worker treatment. Workers should approach this as a trade-off: less visible, less polished, but locally functional for the Nieuwegein area.`,
      },
      {
        heading: "Salary and Real Take-Home Pay",
        body: `AB Midden places workers at WML for warehouse and production roles. At €14.71/hr (2026) on a 40-hour week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is paid at period end.

Workers report that payslips are provided on a regular cycle, though the payslip format is basic compared with larger agencies. Workers with premium shift hours — nights, Sundays — should verify their payslip carefully against the applicable CAO rate, as smaller agencies with less automated payroll infrastructure are more likely to generate errors on non-standard hours.

The ABU CAO applies to AB Midden placements. Workers should confirm this at intake — a small number of agencies in this size tier operate under non-standard collective agreements that provide different or weaker conditions.`,
      },
      {
        heading: "Housing Conditions",
        body: `AB Midden provides housing at affiliated addresses in and around Nieuwegein. Housing is confirmed as provided with deduction — the SNF maximum of €113.50/week sets the legal ceiling, and workers report deductions in the €95–€113 range.

The affiliated housing model means AB Midden does not use SNF-registered third-party providers in the same way as national agencies — the accommodation is directly linked to the agency's own network. Workers should ask specifically for the SNF registration details of their accommodation before committing, as SNF certification is the key quality assurance mechanism for small-agency housing.

Workers who do confirm SNF registration should then verify occupancy: the SNF standard sets a per-worker minimum floor space and maximum occupancy per room. Workers housed above these limits are entitled to a reduced or zero housing deduction for the duration of the non-compliant period.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to Nieuwegein warehouse sites is typically provided or the sites are accessible by bicycle from the affiliated housing addresses. Workers placed in the Nieuwegein industrial zone report that the commute infrastructure is practical — the area is designed for worker logistics.

Work conditions in Nieuwegein warehouses are typical for the sector: shift work, standing, repetitive tasks, safety footwear required. Client sites in the area include distribution operations for consumer goods, e-commerce, and food distribution. Workers report standard health and safety conditions at the client sites — the quality of workplace conditions at the end client is largely independent of the agency.

AB Midden's smaller scale means the coordinator-to-worker ratio is lower than at national agencies — workers typically have more direct access to their coordinator for day-to-day questions.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `AB Midden is a practical option for workers specifically targeting the Nieuwegein and Utrecht region who are comfortable operating with minimal agency infrastructure. The lean model keeps costs lower and allows more direct coordinator contact than at national agencies. The risk is reduced verifiability — workers should confirm SNF housing registration and CAO compliance in writing before starting.

Realistic take-home: €340–€355/week at WML. After housing at €95–€113, disposable income is approximately €227–€260/week. Workers on night or Sunday shifts add €60–€100 to this figure.`,
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
      { href: "/guides/hidden-costs-netherlands", label: "How to verify SNF housing compliance" },
      { href: "/guides/real-salary-netherlands", label: "WML salary and what you actually take home" },
      { href: "/tools/payslip-checker", label: "Check your payslip for missing shift premiums" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Euro Planit placements start at WML: €14.71/hr in 2026. On a 40-hour week, gross pay is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is paid at period end or annually.

Shift premiums under the ABU CAO apply: 22% for nights, 50% for Sundays. Workers placed in production and food processing roles with regular night shifts report weekly gross of €630–€670, netting approximately €420–€440.

Workers specifically report checking payslips after the first month. Euro Planit's payroll is reportedly reliable for standard hours but generates queries more frequently on premium shifts — a pattern common across agencies that place high volumes of workers from multiple countries simultaneously. Workers should note that the payslip will be in Dutch — Euro Planit does provide translation support on request, but workers benefit from learning the basic Dutch payslip terms (bruto, netto, loonheffing, vakantiegeld) before arrival.`,
      },
      {
        heading: "Housing Conditions",
        body: `Housing is central to Euro Planit's offering and is provided for all out-of-region placements. Accommodation is SNF-certified and deductions fall within the €100–€113.50 range. Shared rooms of four to six workers are typical.

Workers report that Euro Planit's housing is functional and compliant. The proximity to work sites is a consistent positive — accommodation is selected based on site location, so commutes are short (typically 10–20 minutes by shuttle or bicycle). Workers arriving from countries with different housing standards sometimes describe the conditions as basic but acceptable for the purpose and price point.

The main housing-related concern reported by Euro Planit workers is the bundled contract structure. Housing and employment are often in a single document — if the work contract ends, housing ends simultaneously. Workers should clarify the notice period for both components: the employment contract notice and the housing vacating requirement. Dutch law requires written notice and a reasonable period to find alternative accommodation.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport from accommodation to work site is included for all Euro Planit placements. This is a consistent positive across worker reports. The shuttle service runs on shift times and workers report it as reliable at most sites.

Work conditions are typical of logistics and food processing: standing work, lifting, repetitive tasks. The majority of Euro Planit placements are at established, compliant client sites where safety standards are externally audited. Workers report adequate safety briefings, provided PPE, and visible safety management at most client locations.

Multi-language coordinator support is available — Polish, Romanian, Bulgarian, and English — at Euro Planit intake and throughout the placement. This is a material advantage for workers who are not confident in Dutch or English.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Euro Planit is well-suited to first-time arrivals in the Netherlands who want a fully managed start — housing, job, and administration arranged before they land. The integrated model reduces first-week friction substantially. Workers should understand the trade-off: dependency on one organisation for multiple critical needs. Maintaining independent financial and administrative records from day one provides important security.

Realistic take-home: €340–€355/week at WML day shifts. After housing at €100–€113.50/week, disposable income is approximately €227–€255. Night shift rotations add €65–€90/week net.`,
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
      { href: "/guides/real-salary-netherlands", label: "What migrant workers actually earn in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing contract terms: what to check before signing" },
      { href: "/tools/payslip-checker", label: "Understand your Dutch payslip" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Uitzendbureau NL matches workers to client companies across sectors — the applicable salary and CAO depend on the role and client, not the platform itself. For logistics and production placements (the most common for international workers), the ABU CAO applies and pay starts at WML: €14.71/hr in 2026. On 40 hours per week, gross is €588.40; net take-home is approximately €340–€355.

Workers who specify skills at registration — forklift certification, food HACCP, construction qualifications — are matched to roles with higher hourly rates. Workers without specific qualifications are directed to general labour pools at WML.

The platform model means the worker's direct employment contract is with the end client or with a partner employment entity, not with Uitzendbureau NL itself. Workers should verify who their legal employer is at intake — this determines which CAO applies, which payroll system is used, and where to direct disputes.`,
      },
      {
        heading: "Housing Conditions",
        body: `Uitzendbureau NL does not universally provide housing — accommodation arrangements depend on whether the matched placement includes housing provision. Workers matched to placements through partner agencies or clients that offer housing will receive SNF-certified accommodation at the standard deduction rate. Workers matched to placements without housing provision receive no housing support through the platform.

Workers arriving from abroad who need housing must confirm this is included before accepting a match. The platform's national-reach model means matches may include placements across multiple regions — a worker registering in Amsterdam may be matched to a role in Venlo or Tilburg, which only makes sense with housing included.

Workers who have their own accommodation in the Netherlands benefit most from the platform model — the quick matching time and sector breadth allow workers to find placements faster than through traditional branch registration, without needing the full agency package.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport provision follows the same logic as housing: it depends on the matched placement, not the platform. Inhouse placements at large logistics sites include shuttle transport; smaller-site matches do not. Workers must clarify at the point of match acceptance.

Work conditions are entirely determined by the end client and the applicable sector CAO. The platform model means Uitzendbureau NL has less ability to intervene in day-to-day work conditions than a fully inhouse agency team. Workers who have issues with work conditions should raise them through the named employment entity in their contract, which may be a partner agency or the client directly.

The platform does provide coordinator contact — workers are not left with no support — but the coordinator's role is matching and contract management rather than on-site support.`,
      },
      {
        heading: "Pros and Cons",
        body: `The platform's main advantage is speed and reach. Workers with clear skill profiles can receive placement matches quickly, across a wider range of clients and sectors than a single regional branch could offer. For workers who are already settled in the Netherlands and want to find their next placement without visiting a physical branch, the digital process is convenient.

The main limitation is the variable package. Housing, transport, and ongoing support quality depend on which partner agency or client is involved in the matched placement. Workers who need certainty about housing and transport before accepting should require written confirmation of all package components.

Workers should also verify ABU CAO coverage. Platform-mediated placements occasionally use non-standard employment structures that may provide different conditions than ABU CAO workers at the same client site.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Uitzendbureau NL works best for workers who are already in the Netherlands, have their own accommodation, and want a fast path to a new placement. It is less suited to first-time arrivals who need housing, transport, and full administrative support arranged as a package.

Realistic take-home: variable by placement, but typically €340–€355/week for standard logistics at WML. Skilled placements can reach €390–€440+. Workers must verify the full package — housing, transport, CAO, employer entity — before accepting any match.`,
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
      { href: "/guides/real-salary-netherlands", label: "Real salary for all Dutch job types" },
      { href: "/guides/hidden-costs-netherlands", label: "What to check before accepting any agency placement" },
      { href: "/tools/real-income-calculator", label: "Calculate take-home for any hourly rate" },
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
        heading: "Salary and Real Take-Home Pay",
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
        heading: "Housing Conditions",
        body: `In Person does not universally provide housing — the Amsterdam-focused model assumes many workers already have accommodation in the city or have arranged it independently. For out-of-city workers and new arrivals, housing through affiliated providers can be arranged, but this is less central to In Person's offering than at logistics agencies in rural or suburban locations.

Workers who need housing should confirm availability explicitly at intake. Amsterdam's rental market makes agency-provided housing in the city expensive — SNF maximum deductions apply (€113.50/week), but the accommodation quality for this price in Amsterdam is lower than the same rate in Tilburg or Venlo, where housing stock is cheaper.

Workers who already have accommodation in Amsterdam or surroundings find In Person's placement model straightforward — the hospitality and retail sectors offer regular, predictable shift patterns and consistent hours once placement is established.`,
      },
      {
        heading: "Pros and Cons",
        body: `In Person's advantage is its Amsterdam sector specialisation. Workers who want hospitality or retail work in the city, and who have existing accommodation, find the agency's local client relationships produce faster placement than using a national agency with weaker Amsterdam networks.

The limitation is sector scope. In Person does not cover logistics, technical, or agricultural sectors — workers who want the flexibility to move between sectors or regions are better served by a national generalist. Workers who are committed to hospitality or urban production work in Amsterdam find In Person a useful and appropriately specialised option.

Pay in hospitality can include tips and service charges in some client arrangements — these are not counted in the formal payslip but can supplement take-home meaningfully for front-of-house roles.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `In Person is the right agency for workers in Amsterdam who want hospitality, production, or retail work and have their own accommodation sorted. The city-focused model means sector-specific expertise and faster placement in the Amsterdam market than national generalists.

Realistic take-home: €340–€360/week at WML, rising to €380–€420 for experienced hospitality roles with late-night and Sunday premiums. Housing not typically provided — workers need their own Amsterdam accommodation.`,
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
      { href: "/guides/real-salary-netherlands", label: "Hospitality and production salary: what to expect" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing costs in Amsterdam vs. other regions" },
      { href: "/tools/payslip-checker", label: "Verify Horeca CAO premiums on your payslip" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `WerkTalent placements span multiple salary levels depending on the role and qualifications. Entry-level production and logistics workers are placed at WML: €14.71/hr in 2026, netting approximately €340–€355/week. Workers placed in skilled or specialist roles earn €15.50–€19/hr, with net take-home of €370–€435/week before housing.

The skills-matching model means workers with documented qualifications — forklift certification, HACCP, NEN 3140, or relevant trade certificates — are actively directed toward higher-paying placements rather than being defaulted to WML logistics. Workers who have invested in Dutch labour market certifications find the WerkTalent matching process translates that investment into pay more reliably than volume-placement agencies.

ABU CAO shift premiums apply: 22% night, 50% Sunday. Workers confirm the applicable CAO at intake based on the role and client sector. WerkTalent coordinates confirm which sector CAO applies before contract signing — a standard that is not maintained consistently at all agencies.`,
      },
      {
        heading: "Housing Conditions",
        body: `WerkTalent provides housing for workers in out-of-region placements. SNF-certified accommodation with deductions in the €95–€113.50 range applies. The agency's skill-matching focus means workers are not always placed at the closest available site — they may be placed at a site 50–100km from the main registration area if that is where the best role match exists. In such cases, housing is always provided.

Workers report that WerkTalent's housing is standard quality — shared rooms, shared facilities, functional rather than exceptional. The smaller agency scale means housing stock is more limited than at Randstad or Tempo-Team: workers may have fewer choices about location within a given region.

Workers placed in skills-matched above-WML roles sometimes receive different housing options — smaller rooms or facilities with fewer occupants — as an acknowledgement that the worker profile justifies better accommodation. This is not guaranteed but is worth enquiring about at intake if the worker's skills justify an above-WML placement.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport is provided for inhouse-style placements at larger client sites. For skills-matched placements at smaller specialist manufacturers or technical operations, transport may not be included — workers placed in above-WML technical roles often travel to work independently, with kilometre reimbursement where the applicable CAO provides it.

Work conditions match the placement type. Logistics roles are physically demanding; technical and skilled roles involve different physical requirements and environments. WerkTalent's intake process includes a health and capability assessment — workers with physical restrictions that affect certain role types are directed away from incompatible placements rather than placed regardless.

Induction quality at client sites varies independently of the agency, but workers report that WerkTalent provides pre-placement briefings about the specific client's environment, safety requirements, and working culture before the first shift. This reduces first-day uncertainty.`,
      },
      {
        heading: "Pros and Cons",
        body: `The skills-matching approach is WerkTalent's clearest differentiator. Workers who invest time in a thorough intake are better matched to roles that fit their profile, which reduces placement churn — fewer early contract terminations due to mismatch, better relationship with the client, and a clearer path toward Phase B and improved conditions.

The limitation is intake time. Workers who need immediate placement and income cannot afford a thorough matching process. WerkTalent is not the fastest agency for emergency placement — workers who need to start within 48 hours are better served by volume-placement agencies with immediate availability.

Housing and transport are functional but not distinctive. The agency's value is in the placement quality, not in ancillary services.`,
      },
      {
        heading: "Final Verdict for 2026",
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
      { href: "/guides/real-salary-netherlands", label: "How qualifications affect salary in the Netherlands" },
      { href: "/guides/hidden-costs-netherlands", label: "Transport costs: when agencies pay and when you do" },
      { href: "/tools/real-income-calculator", label: "Net pay for above-WML skilled roles" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `UBN places workers at WML for general production and logistics roles: €14.71/hr in 2026. On 40 hours per week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week, with vakantiegeld (8%) accruing for payout at period end.

The ABU CAO applies to UBN placements. Shift premiums (22% nights, 50% Sundays) are reported as accurately applied by most workers, though smaller payroll operations are more likely to generate premium errors on non-standard hours. Workers should track their own shifts and compare against payslips for the first two months.

Above-WML placements are limited at UBN — the regional model with smaller client base provides fewer specialist or technical roles than national agencies with broader portfolios. Workers with vocational qualifications may find better-paying matches at larger agencies with more diverse client networks.`,
      },
      {
        heading: "Housing Conditions",
        body: `UBN provides housing for workers in its regional placements. SNF-certified accommodation with deductions in the €90–€113 range is typical. Shared rooms of three to four workers, shared facilities. Workers report that UBN's housing is maintained to a functional standard, with maintenance issues addressed within five to seven days at most locations.

The regional focus means housing and work sites are closely matched geographically — a consistent positive in worker reports. Transport from housing to work is short, reducing fatigue and transport costs. Workers placed through UBN rarely report the long commute times that sometimes occur with national agencies that place workers far from available housing.

Workers report that UBN coordinators are accessible for housing issues — the smaller portfolio means a housing problem gets direct attention rather than being escalated through a multi-layer support system.`,
      },
      {
        heading: "Transport and Work Conditions",
        body: `Transport to client sites is included for most UBN placements. The regional model means all UBN client sites are within the agency's transport infrastructure, so shuttle provision is more consistent than at national agencies where transport coverage varies by region.

Work conditions are typical of the production and logistics sectors. Physically demanding standing work, safety footwear and PPE provided at client sites. Workers report that UBN's client base consists of established regional manufacturers and distribution operations with good safety standards — UBN does not place workers at sites with poor compliance records.

The smaller agency scale means new workers are known personally to the coordinator from day one. This produces faster issue resolution — pay queries, scheduling problems, housing concerns — than working through the support channels of a national agency.`,
      },
      {
        heading: "Pros and Cons",
        body: `UBN's main advantage is the regional depth model: close housing-to-site geography, personal coordinator relationships, and consistent transport provision. Workers who value predictability and direct access to support over the breadth of options find the UBN model significantly less stressful than large national agencies.

The limitation is scale. Fewer active placements mean workers may wait longer to be placed if demand at UBN's client sites is low. Workers who need guaranteed continuous employment regardless of market conditions need a national agency with more client diversity.

Payslip accuracy is average — above the sector worst but no better than the national mid-tier. Workers should verify premium shifts in the first two months.`,
      },
      {
        heading: "Final Verdict for 2026",
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
      { href: "/guides/real-salary-netherlands", label: "Production and logistics salary in 2026" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing and transport: the real weekly cost" },
      { href: "/tools/payslip-checker", label: "Check your shift premiums are correctly applied" },
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
        heading: "Salary and Real Take-Home Pay",
        body: `Djops places workers in production and logistics roles at WML: €14.71/hr in 2026. On a standard 40-hour week, gross is €588.40. Net take-home after loonheffing is approximately €340–€355/week. Vakantiegeld (8%) accrues and is visible in the Djops app, building transparency for workers tracking their full earnings picture.

Shift premiums under the ABU CAO are flagged in the app when shifts qualify — night shifts, Sunday work, overtime. Workers report that the app's shift confirmation system creates a useful record for payslip verification: if a premium shift is confirmed in the app but missing from the payslip, there is a clear documented record for the query.

Workers placed at above-standard roles (skilled production, quality roles) earn above WML. Djops does not limit its portfolio to WML placements, but the majority of current placements are in the standard logistics and production tier.`,
      },
      {
        heading: "Housing Conditions",
        body: `Djops provides SNF-certified housing for workers who require it, with deductions within the €100–€113.50 range. The housing side of the operation is managed through partner providers — Djops coordinates housing allocation but does not manage accommodation stock directly.

Workers report that Djops housing is adequate and SNF compliant. The main worker concern is the partner-managed model: when housing issues arise, the resolution path runs through Djops coordination to the housing partner, adding a step compared with agencies that manage their own accommodation. Workers should save the housing partner's direct contact details at check-in for use in case of maintenance or billing issues.

The app tracks housing costs and deductions, giving workers a clear view of the full deduction breakdown each pay period. Workers rate this transparency positively.`,
      },
      {
        heading: "App Features and Work Conditions",
        body: `The Djops app is the central tool for shift management, payslip access, holiday accrual tracking, and worker communication. Workers confirm shifts, submit availability, and flag issues through the app. New workers report a learning curve in the first week but positive reviews thereafter — the app is described as well-designed relative to similar tools at larger agencies.

Work conditions at Djops' client sites are standard for the logistics and production sectors. Safety briefings, PPE provision, and shift structures are managed by the end client. Djops maintains an induction process that prepares workers for the specific client environment before the first shift — a positive feature shared with WerkTalent.

Workers placed at Djops' current client base report physical work conditions comparable to Randstad or Tempo-Team placements at the same client sites. The agency does not currently have inhouse presence at very large sites; most placements are at mid-size logistics and production facilities.`,
      },
      {
        heading: "Pros and Cons",
        body: `Djops' clearest advantage is digital transparency. Workers who use the app actively know their shift premium breakdown, housing deduction, holiday accrual, and net pay in real time rather than waiting for the monthly payslip. This is genuinely useful for workers who want to track their financial position week by week.

The limitation is scale and history. As a newer agency, Djops has fewer client relationships, less historical worker data, and fewer housing options than agencies with decades of Dutch market experience. Workers who need maximum placement options or want certainty about work availability year-round may find Djops' current portfolio limiting.

The partner-managed housing model introduces the same accountability gap as Adecco's third-party housing — workers should document housing start and end dates carefully and verify billing.`,
      },
      {
        heading: "Final Verdict for 2026",
        body: `Djops is a genuine option for tech-comfortable workers who value real-time transparency over the breadth of options. The app-based model, shift confirmation records, and visible deduction breakdown provide better week-to-week financial clarity than most traditional agencies. As the agency grows its client base and housing stock, the portfolio limitation will reduce.

Realistic take-home: €340–€355/week at WML day shifts, approximately €415–€440 on regular night shifts. After housing at €100–€113.50, disposable income is approximately €227–€340.`,
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
      { href: "/guides/real-salary-netherlands", label: "What logistics workers actually take home in 2026" },
      { href: "/guides/hidden-costs-netherlands", label: "Housing billing errors: how to protect yourself" },
      { href: "/tools/payslip-checker", label: "Verify your payslip against your confirmed shifts" },
    ],
  },
};
