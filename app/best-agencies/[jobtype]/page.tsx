import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VERIFIED_AGENCIES } from "@/data/agencies";
import { JOB_SALARY_DATA } from "@/lib/seoData";

export const dynamic = "force-static";

// ─── Job type configuration ────────────────────────────────────────────────────

const JOB_TYPE_META: Record<
  string,
  {
    title: string;
    metaTitle: string;
    metaDescription: string;
    jobFocusSlugs: string[];
    tips: { heading: string; body: string }[];
    faqs: { q: string; a: string }[];
  }
> = {
  "warehouse-worker": {
    title: "Warehouse Worker",
    metaTitle: "Best Warehouse Worker Agencies Netherlands 2026 — Ranked by Transparency Score",
    metaDescription:
      "Compare the best warehouse worker agencies in the Netherlands. Ranked by transparency score. See which agencies offer SNF-certified housing, top pay, and fair contracts.",
    jobFocusSlugs: ["warehouse-worker"],
    tips: [
      {
        heading: "Verify ABU or NBBU membership",
        body: "All legitimate warehouse staffing agencies in the Netherlands should hold ABU or NBBU membership. This guarantees your contract follows the sector CAO — including minimum wage, overtime, and holiday allowance. Ask to see the CAO document before you start.",
      },
      {
        heading: "Understand your shift pattern before accepting",
        body: "Warehouse work in Dutch distribution centres typically runs in two or three shifts: early (06:00–14:00), late (14:00–22:00), and night (22:00–06:00). Night shifts usually earn a 25–33% premium. Confirm your rota before you sign — some agencies assign shifts at short notice.",
      },
      {
        heading: "Check SNF certification if housing is included",
        body: "If the agency provides accommodation, it must meet SNF (Stichting Normering Flexwonen) standards. SNF certification means the housing has been independently audited for safety, hygiene, and space per person. You can verify certification directly at normeringflexwonen.nl.",
      },
      {
        heading: "Know what can legally be deducted from your wage",
        body: "Dutch law allows deductions for housing (max 25% of gross earnings, capped at SNF rates), transport, and health insurance. No other deductions are legal without your written consent. Always request a written payslip breakdown and compare it against your contract.",
      },
      {
        heading: "Check your VCA-B status for forklift or elevated work",
        body: "Some warehouse roles require a VCA-B safety certificate or specific MHE (materials handling equipment) licences. Ask the agency whether certification is required before placement — reputable agencies will organise training or check your existing qualification.",
      },
    ],
    faqs: [
      {
        q: "What is the minimum wage for warehouse workers in the Netherlands in 2026?",
        a: "The Dutch statutory minimum wage (wettelijk minimumloon, WML) in 2026 is €14.71 per hour for workers aged 21 and over working a standard 40-hour week. Many warehouse agencies pay between €14.71 and €16.50/hr depending on the role, shift, and CAO. Night-shift premiums of 25–33% are common on top of the base rate.",
      },
      {
        q: "Do warehouse agencies in the Netherlands provide housing?",
        a: "Many agencies targeting EU migrant workers do provide housing alongside the job. The top agencies — such as OTTO Workforce and Covebo — are SNF-certified, meaning accommodation is independently audited. Housing typically costs €80–120 per week deducted from your gross wage. Always verify SNF certification before accepting.",
      },
      {
        q: "How long does a warehouse temp contract last in the Netherlands?",
        a: "Under the ABU CAO (the standard flex worker collective agreement), phase A covers the first 78 worked weeks across unlimited contracts. After phase A, you enter phase B with fixed-term contracts. After two years or three contracts, you are legally entitled to a permanent contract (fase C). Many warehouse workers renew each season.",
      },
      {
        q: "What documents do I need to start warehouse work in the Netherlands?",
        a: "You will need a valid EU/EEA passport or identity card, a Dutch BSN (burger service number, obtainable at your local municipality), and a Dutch bank account (or a bank account where your employer can transfer wages in euros). Some agencies assist with BSN registration — ask upfront.",
      },
      {
        q: "Can I compare warehouse agencies by transparency score?",
        a: "Yes — AgencyCheck's transparency score rates each agency on a 0–100 scale based on: housing certification status, CAO compliance, public information quality, and worker review signals. Scores above 80 indicate high transparency; scores below 50 indicate limited verifiable information. Use the score as a starting point for your own research.",
      },
    ],
  },
  "order-picker": {
    title: "Order Picker",
    metaTitle: "Best Order Picker Agencies Netherlands 2026 — Top Rated by Workers",
    metaDescription:
      "Find the best order picker agencies in the Netherlands. Ranked by transparency score. Worker-reported pay, housing options, and supported cities.",
    jobFocusSlugs: ["order-picker"],
    tips: [
      {
        heading: "Understand pick-rate targets before you start",
        body: "Order picking in Dutch fulfilment centres (particularly e-commerce and food retail) often involves performance targets measured in picks-per-hour (PPH). Industry standard is 100–150 PPH. Ask the agency what the target is and whether falling short during the first weeks results in contract termination.",
      },
      {
        heading: "Check voice-picking vs scan-picking requirements",
        body: "Larger distribution centres use voice-directed picking or RF scanning systems. If the language is Dutch or English, confirm this with the agency. Some sites use Dutch-language voice systems — ask if multilingual operation is available if you are not yet fluent in Dutch.",
      },
      {
        heading: "Night-shift premium is standard for order picking",
        body: "Order picking runs 24/7 at major DCs. The night premium (onregelmatigheidstoeslag) for hours between 22:00–06:00 is typically 33% extra under most logistics CAOs. Weekend premiums (Saturday 25%, Sunday 50%) also apply under the ABU CAO.",
      },
      {
        heading: "Confirm travel-to-work distance",
        body: "Order picker jobs are often located in out-of-town distribution parks (e.g. Venlo, Tilburg, or Almere logistics zones) that are not easily reachable by public transport. Check if the agency provides a shuttle bus and whether this is charged. Add the commute cost to your net wage calculation.",
      },
      {
        heading: "Physical demands: ask about lifting weights and ergonomics",
        body: "Dutch law requires employers to conduct a risk assessment (RI&E) for repetitive or heavy lifting. Packages can weigh 3–30 kg depending on the client. Confirm with the agency whether mechanical lifting aids are available and what the maximum single-lift weight is.",
      },
    ],
    faqs: [
      {
        q: "What is the average hourly wage for order pickers in the Netherlands in 2026?",
        a: "The average reported wage for order pickers in the Netherlands in 2026 is around €14.50–€16.00 per hour gross, depending on the client, shift, and CAO. The statutory minimum (WML) is €14.71/hr. Some large logistics clients pay above CAO via employer agreements.",
      },
      {
        q: "Do I need a driving licence to work as an order picker?",
        a: "No — order pickers work on foot inside the warehouse. However, some sites require a pedestrian forklift or electric pallet truck certificate (reachtruck or electric hand pallet truck), which the agency may arrange. A driving licence is not a standard requirement.",
      },
      {
        q: "What is the difference between an order picker and a warehouse worker in Dutch agencies?",
        a: "In Dutch staffing, 'order picker' (orderpicker) specifically refers to picking individual items or cases from shelving or pallet locations to fulfil customer orders. A 'warehouse worker' is a broader term covering receiving, put-away, replenishment, packing, and shipping in addition to picking. Pay rates are similar, but picking roles are the most commonly available.",
      },
      {
        q: "How many hours per week is typical for order picking temp work?",
        a: "Most order picker temp contracts in the Netherlands are for 36–40 hours per week. Some agencies also offer 'min/max' contracts with a minimum guaranteed hours (e.g. 24 hrs) and optional extra shifts when the client needs more capacity. Always check whether there is a guaranteed minimum hours clause.",
      },
      {
        q: "Can I switch agencies if I find a better deal after starting work?",
        a: "Yes — there is no obligation to stay with an agency unless you have a fixed-term contract with a notice period (usually 1 week in phase A). If you are in the 'on call' (oproepkracht) phase, you can typically end the contract with short notice. Check your contract for the exact terms.",
      },
    ],
  },
  "forklift-driver": {
    title: "Forklift Driver",
    metaTitle: "Best Forklift Driver Agencies Netherlands 2026 — VCA-B Certified Jobs",
    metaDescription:
      "Find the best forklift driver agencies in the Netherlands. Ranked by transparency score. VCA-B certified jobs, SNF housing, and competitive pay.",
    jobFocusSlugs: ["forklift-driver"],
    tips: [
      {
        heading: "VCA-B certificate is required for most forklift roles",
        body: "The VCA-B (Veiligheid, Gezondheid en Milieu Checklist Aannemers, basic) safety certificate is mandatory for nearly all industrial forklift positions in the Netherlands. If you do not hold one, some agencies will organise the training (1–2 days). Ask whether the cost is deducted from your wages or paid by the employer.",
      },
      {
        heading: "Your forklift licence type determines the sites you can access",
        body: "Dutch forklift certificates are type-specific: counterbalance (tegengewichtheftruck), reach truck (reachtruck), VNA (very narrow aisle), and order picker truck all require separate certifications. Ensure your existing certificate matches the equipment the agency is placing you on.",
      },
      {
        heading: "Forklift roles attract the highest pay in warehousing",
        body: "Forklift drivers earn a premium over general warehouse rates — typically €1–€3/hr more. High-bay reach truck operators in automated DCs can earn €17–€20/hr. When comparing agencies, look specifically at the MHE (materials handling equipment) premium in the contract.",
      },
      {
        heading: "Night-shift forklift work is hazardous — check safety procedures",
        body: "Under Dutch law (Arbowet), employers must provide a written risk assessment for forklift operation. Request this from the agency before starting. Fatigue-related forklift incidents spike during night shifts. Confirm that the site has segregated pedestrian/vehicle routes.",
      },
      {
        heading: "Agency 'certificate loans' must be transparent",
        body: "Some agencies loan money for VCA-B training and deduct it over several payslips. This is legal if: the loan is documented in writing, it does not push your net pay below minimum wage, and the deductions stop once repaid. Request a written loan agreement before accepting.",
      },
    ],
    faqs: [
      {
        q: "How much do forklift drivers earn in the Netherlands in 2026?",
        a: "Forklift drivers in the Netherlands earn between €14.50 and €19.00 per hour gross in 2026, with an average around €16.00/hr. Reach truck and VNA operators at large automated DCs typically earn at the higher end. Night-shift premiums of 25–33% are additional.",
      },
      {
        q: "Is a VCA-B certificate mandatory for forklift work via a temp agency?",
        a: "Yes — virtually all Dutch logistics clients require a valid VCA-B (or higher) for any operator of powered industrial trucks. The VCA-B covers general safety, hazard identification, and accident prevention. It is a one-day exam costing around €150 if you self-fund, or sometimes covered by the employer.",
      },
      {
        q: "What is the difference between a forklift driver and a reach truck driver in Dutch agencies?",
        a: "A forklift driver (heftruck bestuurder) typically operates a counterbalance or reach truck at floor level and standard racking heights. A reach truck driver specifically operates high-bay equipment reaching 10–12 metres, requiring additional certification. Reach truck roles generally pay €1–3/hr more.",
      },
      {
        q: "Do forklift driver agencies in the Netherlands provide housing?",
        a: "Several agencies do — particularly those working in Venlo, Tilburg, Rotterdam, and Eindhoven logistics zones where many EU workers are placed. OTTO Workforce, Covebo, and HOBIJ are the most recognised for SNF-certified housing. Not all agencies offer housing, so confirm before accepting.",
      },
      {
        q: "Can I work as a forklift driver in the Netherlands with a non-Dutch certificate?",
        a: "EU/EEA forklift licences are generally accepted, but the Dutch site client makes the final decision. Bring your original certificate and, if possible, a Dutch or English translation. Some clients require an internal assessment drive before permitting operation. Agencies can advise on site-specific requirements.",
      },
    ],
  },
  "production-worker": {
    title: "Production Worker",
    metaTitle: "Best Production Worker Agencies Netherlands 2026 — Factory & Manufacturing",
    metaDescription:
      "Compare the top production worker agencies in the Netherlands. Ranked by transparency score. Factory, food, and manufacturing jobs with housing options.",
    jobFocusSlugs: ["production-worker"],
    tips: [
      {
        heading: "Confirm the specific production type before accepting",
        body: "Production work in the Netherlands covers food processing, meat cutting, electronics assembly, flower packaging, chemical production, and automotive parts. Conditions, physical demands, odour levels, and temperature vary enormously. Ask the agency for the exact client name and product before accepting.",
      },
      {
        heading: "Food production requires a hygiene certificate",
        body: "Many food factories require a basic food hygiene certificate (HACCP awareness). Some agencies provide this as a half-day induction on the first day. If you already hold one from another EU country, bring the original and a translation — most clients accept it.",
      },
      {
        heading: "Understand the shift premium structure",
        body: "Production factories typically run 2-shift (early/late) or 3-shift (including nights) schedules. Under the Manufacturing CAO, irregular hours attract premiums: early shifts before 07:00 typically earn +20%, nights earn +33%, and Saturdays earn +25%. Compare these in writing against the rate sheet.",
      },
      {
        heading: "Check whether the role involves chemical exposure",
        body: "Some production roles — particularly in cleaning products, coatings, and food preservation — involve chemical exposure. Dutch law requires a written safety data sheet (VIB) and appropriate PPE. Ask the agency what PPE is provided and whether health monitoring is included in the assignment.",
      },
      {
        heading: "Long-term placements in production often lead to direct hire",
        body: "Dutch manufacturers regularly offer direct hire (in vaste dienst) to proven production workers after 78 weeks. Ask the agency whether the client has a track record of converting temp workers to permanent roles — this is a significant factor in the quality of the agency relationship.",
      },
    ],
    faqs: [
      {
        q: "What is the typical wage for production workers in the Netherlands in 2026?",
        a: "Production worker wages in the Netherlands in 2026 range from €14.71 (statutory minimum) to approximately €16.50 per hour, with an average around €15.00/hr for standard day shifts. Shift premiums for early, late, and night work can increase effective hourly earnings by 20–33%.",
      },
      {
        q: "What languages do I need to work in a Dutch factory?",
        a: "Most production roles in the Netherlands do not require Dutch language skills — operational instructions are often given in English or via visual job aids. Some safety briefings are in Dutch; agencies usually provide interpreters for onboarding. Workplace communication becomes easier if you learn basic Dutch workplace vocabulary.",
      },
      {
        q: "Do production agencies provide housing in the Netherlands?",
        a: "Yes — several large production-focused agencies (OTTO Workforce, Covebo, Charlie Works, HOBIJ) provide SNF-certified accommodation alongside production assignments. Housing costs are typically deducted from your gross wage at €80–120/week. Always check the SNF certificate status.",
      },
      {
        q: "Is there a difference between a production worker (productiemedewerker) and a factory worker (fabrieksmedewerker)?",
        a: "In Dutch agency usage, both terms refer to the same role. Some job ads use 'productiewerker' (production worker), 'productiemedewerker' (production employee), or 'fabrieksmedewerker' (factory worker) interchangeably. All typically describe assembly, packing, or machine operation on a production line.",
      },
      {
        q: "Can I work in production without any experience?",
        a: "Yes — most production roles in Dutch factories are entry-level and provide on-the-job training. The key requirements are physical fitness, reliability, and willingness to work shifts. Food production may require a basic HACCP awareness certificate, which agencies can arrange in a half-day induction.",
      },
    ],
  },
  "reach-truck-driver": {
    title: "Reach Truck Driver",
    metaTitle: "Best Reach Truck Driver Agencies Netherlands 2026 — High Bay Warehouse Jobs",
    metaDescription:
      "Find the best reach truck driver agencies in the Netherlands. Ranked by transparency score. MHE certified roles, competitive pay, housing options.",
    jobFocusSlugs: ["reach-truck-driver"],
    tips: [
      {
        heading: "MHE certificate is mandatory — confirm type specificity",
        body: "Reach truck operation in the Netherlands requires a valid MHE (materials handling equipment) certificate specifically for reach trucks (reachtruck). This is separate from a counterbalance forklift certificate. Bring your original certificate; some sites require an internal assessment before permitting unsupervised operation.",
      },
      {
        heading: "High-bay warehouse work is height-specific — ask about maximum lift heights",
        body: "Reach trucks in Dutch DCs typically operate at heights of 8–14 metres. Some very narrow aisle (VNA) trucks operate at 12+ metres and require additional VNA certification. Ask the agency for the maximum rack height at the specific site before accepting — it affects both the physical demands and the certification requirements.",
      },
      {
        heading: "Reach truck operators earn among the highest rates in warehousing",
        body: "Reach truck drivers typically earn €2–5/hr more than general warehouse workers. The average is €17.00/hr, with experienced VNA operators at large automated DCs earning up to €20.00/hr. When comparing agencies, focus on the specific equipment type and premium structure rather than base rates.",
      },
      {
        heading: "Shift rotations at high-bay sites are physically demanding",
        body: "Operating reach trucks at height for 8 hours requires focused concentration. Fatigue-related errors at height are dangerous. Under Dutch Arbo law, operators are entitled to regular breaks. Ask agencies what the site's break schedule is and whether mandatory rotation between high-bay and floor-level tasks is in place.",
      },
      {
        heading: "Night-shift reach truck work attracts the highest premiums",
        body: "Night shifts (22:00–06:00) at logistics DCs attract the highest premiums under most CAOs — typically 33–40% on top of the base rate. For a reach truck operator earning €17/hr base, this means €22.61–€23.80/hr night rate. Confirm the exact premium rates in writing.",
      },
    ],
    faqs: [
      {
        q: "How much do reach truck drivers earn in the Netherlands in 2026?",
        a: "Reach truck drivers in the Netherlands earn between €15.00 and €20.00 per hour in 2026, with an average around €17.00/hr. VNA (very narrow aisle) operators at automated high-bay DCs and experienced operators with multiple MHE certificates earn at the top end. Night-shift premiums add another 33%.",
      },
      {
        q: "What is the difference between a forklift driver and a reach truck driver?",
        a: "A counterbalance forklift operates at lower heights (typically up to 6 metres) and is used for loading/unloading vehicles and moving pallets on flat ground. A reach truck is designed for high-bay racking systems (up to 14+ metres) and requires specific certification, greater spatial awareness, and higher concentration levels. Reach truck roles pay proportionally more.",
      },
      {
        q: "Which Dutch agencies are best for reach truck driver placements?",
        a: "The agencies with the most confirmed reach truck placements in Dutch logistics DCs include OTTO Workforce, Covebo, Randstad, and Olympia. These agencies have established client relationships with major distribution operators (PostNL, Zalando, Albert Heijn, Jumbo) who use reach trucks extensively.",
      },
      {
        q: "Do I need a Dutch MHE certificate or is an EU certificate accepted?",
        a: "EU/EEA MHE certificates are generally accepted, but the site client makes the final decision. Bring the original certificate and a translation into English or Dutch. Some Dutch clients require a verification drive (proefrit) on-site before granting unsupervised access. Agencies can advise on specific client requirements.",
      },
      {
        q: "How do I get a reach truck certificate in the Netherlands if I don't have one?",
        a: "VCA and MHE reach truck certificates can be obtained through certified Dutch training centres such as Vemaro, NTOA, or Bedrijfstraining Nederland. A basic reach truck certificate course takes 1–2 days and costs approximately €200–€350. Some agencies offer to arrange and advance-fund this training.",
      },
    ],
  },
  "greenhouse-worker": {
    title: "Greenhouse Worker",
    metaTitle: "Best Greenhouse Worker Agencies Netherlands 2026 — Horticulture & Serre",
    metaDescription:
      "Find the best greenhouse worker agencies in the Netherlands. Ranked by transparency score. Horticulture, tomato, rose, and serre jobs with housing.",
    jobFocusSlugs: ["greenhouse-worker"],
    tips: [
      {
        heading: "Greenhouse work starts very early — confirm your shift time",
        body: "Horticulture work in Dutch greenhouses typically starts at 05:30–06:00, especially during harvest periods. Some sites run a second shift to 18:00. Early starts in Westland and the Greenhouse Triangle (Venlo, Greenport) mean you may need to commute before public transport starts. Confirm transport arrangements with the agency.",
      },
      {
        heading: "Physical intensity varies enormously by crop type",
        body: "Tomato and cucumber harvesting requires constant bending and reaching at heights of 2–3 metres, working above head level. Rose cutting and orchid processing is precision work at table height. Potting and replanting involves extended kneeling. Ask the agency for the specific crop and task before accepting.",
      },
      {
        heading: "Check whether the greenhouse is heated or ambient temperature",
        body: "Dutch greenhouses maintain specific temperatures for each crop. Tomato greenhouses run at 18–22°C year-round. Some outdoor-facing sections can be cold in winter. Working in a hot, humid greenhouse for 8–10 hours is physically demanding — ask about ventilation and temperature conditions.",
      },
      {
        heading: "Seasonal demand creates peak periods — use this to your advantage",
        body: "The busiest periods for greenhouse work are March–May (planting season) and August–October (harvest peak). During these periods, agencies often pay weekend overtime and offer extra shifts. If you are flexible, you can significantly boost your earnings. Confirm availability of overtime in advance.",
      },
      {
        heading: "Horticulture workers are eligible for the ET (extraterritorial) regime",
        body: "EU nationals working temporarily in the Netherlands may qualify for the ET tax regime, which allows 30% of gross earnings to be paid tax-free as a cost-of-living allowance. Not all agencies offer this. Ask explicitly whether the agency applies the ET scheme — it can significantly increase your net wage.",
      },
    ],
    faqs: [
      {
        q: "How much do greenhouse workers earn in the Netherlands in 2026?",
        a: "Greenhouse workers earn the Dutch minimum wage as a base: €14.71/hr for a 40-hour week in 2026. Many greenhouse agencies pay at or just above minimum. Weekend rates (Saturdays +25%, Sundays +50%) under the agriculture CAO (CAO Glastuinbouw) can significantly boost weekly totals. The average reported gross is around €14.20–€15.00/hr.",
      },
      {
        q: "Where is most greenhouse work located in the Netherlands?",
        a: "The main greenhouse regions in the Netherlands are: Westland (tomatoes, peppers, roses — South Holland), Greenport Venlo (vegetables, herbs — Limburg), Greenport Boskoop (trees, shrubs — South Holland), and the Aalsmeer flower region (Noord-Holland). Agencies based in Wateringen, Naaldwijk, Maasdijk, and Venlo have the most greenhouse placements.",
      },
      {
        q: "Is language a barrier for greenhouse work in the Netherlands?",
        a: "No — greenhouse work is mostly physical and does not require Dutch language skills. Many greenhouse sites in Westland and Limburg employ large numbers of Polish, Romanian, and Bulgarian workers. Supervisors in larger greenhouses often speak English or Polish. Basic Dutch safety vocabulary is helpful.",
      },
      {
        q: "Do greenhouse agencies provide housing near the work sites?",
        a: "Yes — agencies specialising in greenhouse placements (EG Personeel, Westflex, Ruigrok, NL Jobs) often provide accommodation close to greenhouse clusters in Westland, Maasdijk, and Wateringen. Accommodation quality varies significantly. Always check SNF certification status before accepting.",
      },
      {
        q: "What is the difference between a greenhouse worker and an agricultural worker in Dutch agency listings?",
        a: "In Dutch agency listings, 'greenhouse worker' (serrewerker or glastuinbouwmedewerker) specifically refers to indoor cultivation environments — tomatoes, roses, herbs, flowers under glass. 'Agricultural worker' (agrarisch medewerker) is broader, including outdoor crop harvesting, arable farming, and sometimes livestock. Pay and conditions differ; greenhouse work is more seasonal and more physically repetitive.",
      },
    ],
  },
  "truck-driver": {
    title: "Truck Driver",
    metaTitle: "Best Truck Driver Agencies Netherlands 2026 — CE Licence & CPC Card",
    metaDescription:
      "Find the best truck driver agencies in the Netherlands. Ranked by transparency score. CE licence jobs, CPC card required, competitive pay.",
    jobFocusSlugs: ["truck-driver"],
    tips: [
      {
        heading: "Your CE licence and valid CPC card are non-negotiable",
        body: "All truck driver placements in the Netherlands require a valid EU CE driving licence and a valid Driver Certificate of Professional Competence (CPC, or vakbekwaamheidsbewijs) card. Ensure your CPC card is not expired — cards last 5 years and require 35 hours of periodic training. The agency cannot legally place you without both.",
      },
      {
        heading: "Understand the type of driving: regional vs long-haul",
        body: "Dutch truck driver placements fall into three broad types: regional distribution (supermarkets, last mile, city logistics — usually home daily), national distribution (multi-drop routes across the Netherlands), and international (EU cross-border, away 2–5 nights per week). Pay, work patterns, and lifestyle impact differ enormously.",
      },
      {
        heading: "Digital tachograph use is mandatory and monitored",
        body: "All professional truck drivers in the Netherlands must use a digital tachograph. This records driving times, breaks, and rest periods in compliance with EU Regulation 561/2006. Non-compliance results in fines that can be passed to the driver. Confirm the agency's policy on tachograph compliance and whether you are responsible for any infringements.",
      },
      {
        heading: "ADR certification opens higher-paying roles",
        body: "Drivers holding ADR (hazardous goods) certification can access a higher-paying segment of the Dutch logistics market. Chemical plants, fuel distributors, and pharmaceutical logistics pay a premium of €1–3/hr above standard CE rates for ADR-certified drivers.",
      },
      {
        heading: "Confirm overnight allowances and per diem rates",
        body: "International truck drivers working from a Dutch agency are entitled to overnight and per-diem allowances under the ET scheme or via the applicable CAO. These must be separately itemised on the payslip. Confirm the daily allowance rate and whether it is paid as a gross supplement or as a tax-free cost reimbursement.",
      },
    ],
    faqs: [
      {
        q: "How much do truck drivers earn in the Netherlands in 2026?",
        a: "Truck drivers in the Netherlands earn between €15.00 and €21.00 per hour in 2026, with an average around €17.50/hr. Regional distribution drivers typically earn €15–€17/hr; international CE drivers earn €17–€21/hr depending on the route, cargo type, and ADR requirements. Night-shift and weekend premiums add further.",
      },
      {
        q: "Do I need a Dutch CE licence or is an EU CE licence accepted?",
        a: "EU/EEA CE driving licences are fully accepted in the Netherlands without conversion for up to 15 years. Your CPC card must also be valid. If your licence was issued outside the EU/EEA, it must be converted to a Dutch licence before you can work as a professional driver. The agency can advise on this process.",
      },
      {
        q: "What is the CPC card and how do I renew it?",
        a: "The Driver Certificate of Professional Competence (CPC) is a qualification card required by EU law for all professional heavy vehicle drivers. It requires 35 hours of approved training every 5 years to maintain. Renewal training courses are widely available in the Netherlands through CBR and approved training centres for approximately €300–€500.",
      },
      {
        q: "Do truck driver agencies in the Netherlands provide accommodation?",
        a: "Housing is less commonly provided for truck drivers than for warehouse or production workers, because truck drivers typically have fixed regional routes and live locally. However, some agencies placing cross-border drivers can assist with accommodation referrals. Ask the agency specifically.",
      },
      {
        q: "What is the standard working week for a truck driver placed via a Dutch agency?",
        a: "Under EU driving regulations, truck drivers may not drive more than 56 hours in a single week or 90 hours across two consecutive weeks. A typical Dutch agency placement involves 4–5 days of 9–11 hour shifts including driving, loading, and administrative time. Total contract hours are typically 40 hours per week.",
      },
    ],
  },
  "machine-operator": {
    title: "Machine Operator",
    metaTitle: "Best Machine Operator Agencies Netherlands 2026 — Production & Manufacturing",
    metaDescription:
      "Find the best machine operator agencies in the Netherlands. Ranked by transparency score. Factory, food, and production machine operator roles.",
    jobFocusSlugs: ["machine-operator"],
    tips: [
      {
        heading: "Confirm the specific machine type and industry",
        body: "Machine operator roles span injection moulding, CNC turning, packaging line operation, food extrusion, and automated conveyor systems. The skills, training, and physical demands differ significantly between industries. Ask the agency for the exact machine type and client sector before accepting.",
      },
      {
        heading: "LOTO (lockout/tagout) procedures are mandatory",
        body: "Operating industrial machinery in the Netherlands requires compliance with Dutch LOTO (lockout/tagout, uitschakel- en borgsystemen) procedures. You should receive training on the specific machine's lockout procedure before your first independent operation. If the agency does not mention this, ask about it.",
      },
      {
        heading: "GMP certification is required for food and pharmaceutical machine operators",
        body: "Machine operators in food processing and pharmaceutical manufacturing must comply with Good Manufacturing Practice (GMP) hygiene standards. This includes specific clothing, no jewellery rules, and documented cleaning procedures between product runs. Some agencies provide GMP induction training.",
      },
      {
        heading: "Night shifts attract the highest premiums for machine operators",
        body: "Automated production machines run 24/7 in most Dutch factories. Night-shift machine operators earn 25–40% premium above day rate. For a machine operator at €15.50/hr base, a night premium of 33% results in approximately €20.60/hr. Confirm the exact shift premium structure in writing.",
      },
      {
        heading: "Good agencies place you at certified ISO-9001 or BRC-certified sites",
        body: "Manufacturing clients with ISO-9001 or BRC/IFS food safety certification have independently audited quality and safety systems. Machine operators placed at certified sites typically work in better-maintained, safer environments. Ask the agency whether the client holds any quality certifications.",
      },
    ],
    faqs: [
      {
        q: "What is the average wage for machine operators in the Netherlands in 2026?",
        a: "Machine operators in the Netherlands earn between €14.50 and €17.00 per hour in 2026, with an average around €15.50/hr for standard day shift roles. Experienced operators running CNC or automated packaging equipment at larger manufacturers earn at the higher end. Shift premiums add further.",
      },
      {
        q: "What is the difference between a machine operator and a production worker in Dutch agency listings?",
        a: "A machine operator (machineoperator) specifically operates, monitors, and performs basic maintenance on production machinery. A production worker (productiemedewerker) is a broader term covering line work, assembly, packing, and machine operation. Machine operator roles typically require more technical aptitude and pay slightly more.",
      },
      {
        q: "Do I need a specific certification to work as a machine operator in the Netherlands?",
        a: "Certification requirements depend heavily on the machine type and industry. Food production machine operators typically need basic HACCP awareness. CNC operators should hold relevant machining qualifications. Chemical and pharmaceutical operators require sector-specific GMP or safety training. Most agencies provide the required induction training on the first day.",
      },
      {
        q: "Which Dutch regions have the most machine operator vacancies?",
        a: "The main manufacturing regions with the highest demand for machine operators in the Netherlands are: North Brabant (Eindhoven, Tilburg, Helmond — automotive and electronics), Limburg (Venlo, Venray — food and packaging), Overijssel (Hengelo, Enschede — engineering), and South Holland (Rotterdam port area — chemical and food processing).",
      },
      {
        q: "Can I work as a machine operator without Dutch language skills?",
        a: "For most entry-level machine operator roles, Dutch is not required. Safety briefings, SOPs, and operating manuals at larger international factories are often available in English. At smaller Dutch-owned factories, Dutch is more commonly required. Ask the agency whether the client operates in English before accepting.",
      },
    ],
  },
  "assembly-worker": {
    title: "Assembly Worker",
    metaTitle: "Best Assembly Worker Agencies Netherlands 2026 — Electronics & Automotive",
    metaDescription:
      "Find the best assembly worker agencies in the Netherlands. Ranked by transparency score. Electronics, automotive, and industrial assembly roles.",
    jobFocusSlugs: ["assembly-worker"],
    tips: [
      {
        heading: "ESD protection is mandatory in electronics assembly",
        body: "Assembly workers in electronics manufacturing in the Netherlands (especially around Eindhoven — Philips, ASML supply chain) must wear ESD (electrostatic discharge) protective equipment. This includes grounding straps, ESD-safe footwear, and smocks. Non-compliance can destroy expensive components and result in contract termination.",
      },
      {
        heading: "Automotive assembly precision work requires training before independent operation",
        body: "Assembly roles in Dutch automotive supply chains (DAF Trucks Eindhoven, VDL Group) involve torque-controlled fastening and zero-defect quality standards. You should receive 2–5 days of station-specific training before independent operation. Ask the agency how long the training period is and whether it is paid.",
      },
      {
        heading: "Piece-rate bonuses are common in assembly — understand the formula",
        body: "Some Dutch assembly clients offer piece-rate bonuses on top of the hourly wage, based on exceeding the standard output target. This can meaningfully boost earnings. Ask the agency for the target UPH (units per hour), the bonus threshold, and the bonus rate before accepting.",
      },
      {
        heading: "Prolonged repetitive motion can cause RSI — know your rights",
        body: "Assembly work often involves highly repetitive motions — screwdriving, soldering, clipping, or fastening hundreds of times per shift. Under Dutch Arbo law, employers must include RSI risk assessment in the RI&E. Ask whether job rotation between different assembly stations is available.",
      },
      {
        heading: "Good quality agencies offer skill progression into quality control",
        body: "Experienced assembly workers who demonstrate precision and reliability are frequently offered progression to quality inspection or team leader roles. Ask the agency whether the client has a track record of internal progression for temp workers — this is a signal of a quality client and genuine career opportunity.",
      },
    ],
    faqs: [
      {
        q: "How much do assembly workers earn in the Netherlands in 2026?",
        a: "Assembly workers in the Netherlands earn between €14.71 and €16.50 per hour in 2026, with an average around €14.80/hr for entry-level roles. Experienced electronics assembly technicians and automotive assembly operators at tier-1 suppliers can earn up to €18/hr including shift premiums.",
      },
      {
        q: "What is the difference between an assembly worker and a production worker in the Netherlands?",
        a: "An assembly worker (assemblagemedewerker) specifically works with components, subassemblies, or products — joining, fastening, wiring, or fitting parts together according to a technical specification. A production worker is a broader term also covering packing, line operation, and materials handling. Assembly roles generally require higher precision and may pay slightly more.",
      },
      {
        q: "Which Dutch cities have the most assembly worker vacancies?",
        a: "Eindhoven and the surrounding Brainport region (Helmond, Son, Veldhoven) has the highest concentration of electronics and high-tech assembly vacancies, driven by the ASML/Philips supply chain cluster. Tilburg, Venlo, and Roosendaal have automotive and consumer electronics assembly roles. Drenthe and Overijssel have agricultural machinery assembly vacancies.",
      },
      {
        q: "Does assembly work require Dutch language skills?",
        a: "For most assembly roles in the Netherlands, Dutch is not strictly required — technical work instructions are often visual or available in English. At Brainport (Eindhoven) high-tech companies, English is commonly used. At smaller Dutch assembly subcontractors, basic Dutch is more commonly needed for safety briefings.",
      },
      {
        q: "Can I transition from assembly work to a higher-paying technical role?",
        a: "Yes — assembly work in Dutch manufacturing is a recognised pathway to technical roles. Workers who demonstrate accuracy and reliability are often promoted to quality control inspector, team leader, or process technician roles. Some employers offer sponsored training for MBO-level technical qualifications. Ask the agency about the client's internal progression policy.",
      },
    ],
  },
  "delivery-driver": {
    title: "Delivery Driver",
    metaTitle: "Best Delivery Driver Agencies Netherlands 2026 — Van & Last Mile",
    metaDescription:
      "Find the best delivery driver agencies in the Netherlands. Ranked by transparency score. Van, last-mile, and courier delivery roles with competitive pay.",
    jobFocusSlugs: ["delivery-driver"],
    tips: [
      {
        heading: "A valid B driving licence is the minimum requirement",
        body: "All delivery driver roles in the Netherlands require at least a valid Category B driving licence (personenbus or bestelbus — up to 3.5 tonnes). For larger vehicles (3.5–7.5 tonnes), a C1 licence is required. Confirm the vehicle type with the agency before accepting.",
      },
      {
        heading: "Understand your delivery zone and stop count",
        body: "Last-mile delivery in the Netherlands typically involves 80–150 stops per day in dense urban areas, or 50–80 stops in rural routes. The number of stops directly affects your physical workload and earnings if piece-rate bonuses apply. Ask the agency for the average daily stop count and whether you can set your own sequence.",
      },
      {
        heading: "GPS navigation and parcel scan apps are standard — ask about the device",
        body: "Dutch delivery operators (PostNL, DHL, DPD, GLS, Coolblue) use handheld scanning devices and dedicated navigation apps. Confirm whether the device is provided by the client or if you need to use your own smartphone with a client app. Data charges should be reimbursed if your personal device is used.",
      },
      {
        heading: "Failed delivery protocols — know the rules",
        body: "Dutch consumer protection rules require proof of delivery or safe-place authorisation. Failed deliveries (niemand thuis) require a specific protocol. Understand what the agency and client expect for failed deliveries — leaving parcels unattended at the wrong address can result in liability for the driver.",
      },
      {
        heading: "Electric vehicle delivery roles are growing in Dutch cities",
        body: "Several Dutch municipalities (Amsterdam, Utrecht, Rotterdam) restrict diesel vans from city centres. Major e-commerce operators are transitioning to electric cargo bikes and electric vans. Ask the agency whether the role involves EV operation and whether charging logistics are managed by the client.",
      },
    ],
    faqs: [
      {
        q: "How much do delivery drivers earn in the Netherlands in 2026?",
        a: "Delivery drivers in the Netherlands earn between €14.50 and €17.00 per hour in 2026, with an average around €15.50/hr for standard van delivery roles. E-bike and cargo-bike delivery in cities is typically at or near minimum wage. Night-shift and weekend premiums add further. Some operators offer piece-rate bonuses above a daily threshold.",
      },
      {
        q: "Do I need a specific licence for delivery work in the Netherlands?",
        a: "A valid Category B (car/van) driving licence is the minimum for most last-mile delivery roles. Vans up to 3.5 tonnes GVW fall under Category B. Larger vehicles (3.5–7.5 tonnes) require a C1 licence; full articulated lorries require CE. Confirm the exact vehicle category with the agency.",
      },
      {
        q: "What is the typical working day for a delivery driver placed via a Dutch agency?",
        a: "A typical delivery driver day starts at 06:30–08:00 at the depot for van loading. Routes are completed between approximately 09:00 and 17:00–19:00 depending on stop count and location. Return-to-depot paperwork and undelivered parcel scanning typically takes 30–60 minutes. Total working time is usually 9–11 hours.",
      },
      {
        q: "Are there delivery driver agencies that focus on food delivery in the Netherlands?",
        a: "Yes — food delivery (koeltransport, chilled distribution) is a specialised segment in the Netherlands. Agencies placing drivers for Albert Heijn, Picnic, Jumbo, and HelloFresh cold-chain runs require drivers with experience handling temperature-sensitive goods. Some roles require an ADR certificate for specific refrigerants.",
      },
      {
        q: "Can non-Dutch EU nationals work as delivery drivers in the Netherlands?",
        a: "Yes — EU/EEA nationals can work as delivery drivers without a work permit. A valid EU driving licence (Category B minimum), a Dutch BSN number, and a Dutch bank account are the standard requirements. Some agencies also require a BIBOB screening (background check) for city-logistics roles in Amsterdam.",
      },
    ],
  },
  "logistics-operator": {
    title: "Logistics Operator",
    metaTitle: "Best Logistics Operator Agencies Netherlands 2026 — Distribution Centre Jobs",
    metaDescription:
      "Find the best logistics operator agencies in the Netherlands. Ranked by transparency score. Distribution centre, fulfilment, and logistics coordinator roles.",
    jobFocusSlugs: ["logistics-operator"],
    tips: [
      {
        heading: "Logistics operator is a broad category — ask for the exact role",
        body: "In Dutch agency listings, 'logistics operator' (logistiek medewerker) can mean anything from inventory counting to inbound receiving, returns processing, or outbound scanning. The specific tasks determine physical demands, required skills, and pay grade. Ask the agency for a written task description before accepting.",
      },
      {
        heading: "WMS (warehouse management system) experience is increasingly valued",
        body: "Major Dutch distribution centres run on WMS platforms (SAP, Manhattan, Blue Yonder). Workers who demonstrate familiarity with RF scanning, WMS-driven pick tasks, or inventory transactions are often preferred for longer placements and offered higher rates. Mention any WMS experience during the agency interview.",
      },
      {
        heading: "Logistics operators often cross-train into forklift or reach truck roles",
        body: "Many Dutch logistics clients offer cross-training for logistics operators who show aptitude. If you are interested in gaining a forklift or reach truck certificate, ask the agency which of their clients have cross-training programmes. Some agencies fund this training in exchange for a minimum placement commitment.",
      },
      {
        heading: "Nightshift and weekend rates for logistics operators are regulated",
        body: "Under the ABU or sector-specific logistics CAO, logistics operators are entitled to night-shift premiums (typically 33% for 22:00–06:00 shifts) and weekend premiums (25% Saturdays, 50% Sundays). These premiums must be itemised on your payslip. Compare the effective hourly rate including premiums when evaluating offers.",
      },
      {
        heading: "Large distribution centres offer the most stability",
        body: "The major Dutch distribution hubs — Venlo, Tilburg, Waalwijk, Almere, and the Schiphol area — employ thousands of logistics workers on a continuous basis. Agencies with established client relationships at these hubs (OTTO, Covebo, Randstad, Olympia) typically offer more stable, longer-duration placements.",
      },
    ],
    faqs: [
      {
        q: "How much do logistics operators earn in the Netherlands in 2026?",
        a: "Logistics operators in the Netherlands earn between €14.71 and €17.00 per hour in 2026, with an average around €15.20/hr. The role level significantly affects pay: inbound receiving and returns processing typically pay at minimum wage, while inventory control and outbound coordination roles pay €16–€17/hr.",
      },
      {
        q: "What is the difference between a logistics operator and a warehouse worker in Dutch agencies?",
        a: "A logistics operator (logistiek medewerker) typically has a broader scope including coordination, administration, and reporting responsibilities in addition to physical handling. A warehouse worker (magazijnmedewerker) focuses on physical tasks. In practice, agencies sometimes use these terms interchangeably for entry-level roles.",
      },
      {
        q: "Which Dutch cities have the highest demand for logistics operators?",
        a: "The main logistics employment clusters are: Venlo–Roosendaal (Netherlands' largest logistics zone), Tilburg (major e-commerce and retail DCs), Waalwijk (shoe and textile DCs), Almere (Flevopolder DCs), and the Schiphol–Hoofddorp area (air freight). These zones have thousands of vacancies year-round.",
      },
      {
        q: "Do logistics operator agencies in the Netherlands provide housing?",
        a: "Housing is commonly provided by agencies operating in Venlo, Tilburg, and other large logistics zones, primarily for EU migrant workers relocating to the Netherlands. Agencies such as OTTO Workforce, Covebo, and Charlie Works are the best-known providers. SNF certification status should always be verified.",
      },
      {
        q: "What career progression is available for logistics operators in the Netherlands?",
        a: "Logistics operators who demonstrate reliability and initiative commonly progress to team leader, inventory controller, inbound/outbound supervisor, or logistics planner roles. Some Dutch DC operators sponsor MBA or NIMA-level logistics qualifications for high-performing temp workers. Ask the agency whether the client has a structured progression track.",
      },
    ],
  },
};

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return [
    "warehouse-worker",
    "order-picker",
    "forklift-driver",
    "production-worker",
    "reach-truck-driver",
    "greenhouse-worker",
    "truck-driver",
    "machine-operator",
    "assembly-worker",
    "delivery-driver",
    "logistics-operator",
  ].map((jobtype) => ({ jobtype }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { jobtype: string };
}): Promise<Metadata> {
  const cfg = JOB_TYPE_META[params.jobtype];
  if (!cfg) return { title: "Not found" };
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: {
      canonical: `https://agencycheck.io/best-agencies/${params.jobtype}`,
    },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      url: `https://agencycheck.io/best-agencies/${params.jobtype}`,
      type: "website",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BestAgenciesJobTypePage({
  params,
}: {
  params: { jobtype: string };
}) {
  const cfg = JOB_TYPE_META[params.jobtype];
  if (!cfg) notFound();

  // Get salary data for this job type if available
  const salaryData = JOB_SALARY_DATA[params.jobtype] ?? null;

  // Filter agencies that match this job type
  const matchingAgencies = VERIFIED_AGENCIES.filter((a) =>
    cfg.jobFocusSlugs.some((slug) => a.jobFocus.includes(slug))
  )
    .sort((a, b) => b.transparencyScore - a.transparencyScore)
    .slice(0, 8);

  // Housing agencies from the matching list
  const housingAgencies = VERIFIED_AGENCIES.filter(
    (a) =>
      cfg.jobFocusSlugs.some((slug) => a.jobFocus.includes(slug)) &&
      a.accommodation !== "not_provided" &&
      a.accommodation !== "unknown"
  ).sort((a, b) => b.transparencyScore - a.transparencyScore);

  // Score badge colour
  function scoreBadge(score: number): { bg: string; text: string; label: string } {
    if (score >= 80) return { bg: "bg-green-100", text: "text-green-800", label: "High" };
    if (score >= 65) return { bg: "bg-amber-100", text: "text-amber-800", label: "Medium" };
    return { bg: "bg-red-100", text: "text-red-800", label: "Low" };
  }

  function accommodationLabel(acc: string): string {
    if (acc === "confirmed_with_deduction") return "SNF housing (with deduction)";
    if (acc === "confirmed_no_deduction") return "Free housing (no deduction)";
    if (acc === "unverified_claim") return "Housing claimed (unverified)";
    return "No housing provided";
  }

  const weeklyAvg = salaryData ? (salaryData.avg * 40).toFixed(0) : null;
  const monthlyAvg = salaryData ? (salaryData.avg * 160).toFixed(0) : null;

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cfg.metaTitle,
    description: cfg.metaDescription,
    url: `https://agencycheck.io/best-agencies/${params.jobtype}`,
    numberOfItems: matchingAgencies.length,
    itemListElement: matchingAgencies.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://agencycheck.io/agencies/${a.slug}`,
      name: a.name,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-600">Best {cfg.title} Agencies</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Best {cfg.title} Agencies in the Netherlands — Ranked by Workers (2026)
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-2xl">
          {cfg.metaDescription} We rank agencies by their AgencyCheck transparency score —
          a 0–100 rating based on housing certification, CAO compliance, and verified public information.
        </p>
      </div>

      {/* Salary Section */}
      {salaryData && (
        <section className="mb-8">
          <div className="card p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {salaryData.icon} {cfg.title} Salary in the Netherlands (2026)
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-2xl font-extrabold text-green-600">€{salaryData.min.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Min / hr</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-3xl font-extrabold text-brand-600">€{salaryData.avg.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Avg / hr</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-700">€{salaryData.max.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Max / hr</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
              <div>
                <p className="font-semibold text-gray-800 text-sm">€{weeklyAvg}</p>
                <p>Weekly gross (40 hrs)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">€{monthlyAvg}</p>
                <p>Monthly gross (160 hrs)</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-400">
              Gross figures. Net take-home after Dutch loonheffing is typically 60–70%. Holiday allowance (vakantiegeld, 8%) paid separately.
            </p>
            <div className="mt-3">
              <Link
                href={`/salary/${params.jobtype}-netherlands`}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Full salary breakdown for {cfg.title} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top agencies section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Top {cfg.title} Agencies — Ranked by Transparency Score
          </h2>
          <span className="text-xs text-gray-400">{matchingAgencies.length} agencies</span>
        </div>

        {matchingAgencies.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-sm">No agencies found for this job type yet.</p>
            <Link href="/agencies" className="text-xs text-brand-600 mt-2 inline-block hover:underline">
              Browse all agencies →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matchingAgencies.map((agency, idx) => {
              const badge = scoreBadge(agency.transparencyScore);
              const topCities = agency.supportedCities.slice(0, 4);
              const extraCities = agency.supportedCities.length - 4;
              return (
                <div key={agency.slug} className="card p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          href={`/agencies/${agency.slug}`}
                          className="font-semibold text-gray-900 hover:text-brand-600 transition-colors"
                        >
                          {agency.name}
                        </Link>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                        >
                          Score: {agency.transparencyScore} · {badge.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                        <span>
                          {agency.accommodation !== "not_provided" && agency.accommodation !== "unknown"
                            ? "🏠 " + accommodationLabel(agency.accommodation)
                            : "No housing provided"}
                        </span>
                        {agency.city && <span>📍 {agency.city}</span>}
                      </div>

                      {topCities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {topCities.map((c) => (
                            <span
                              key={c}
                              className="inline-block bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded"
                            >
                              {c}
                            </span>
                          ))}
                          {extraCities > 0 && (
                            <span className="inline-block bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded">
                              +{extraCities} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Link
                          href={`/agencies/${agency.slug}`}
                          className="text-xs text-brand-600 hover:underline font-medium"
                        >
                          View profile →
                        </Link>
                        <Link
                          href={`/agencies/${agency.slug}/reviews`}
                          className="text-xs text-gray-500 hover:text-brand-600 hover:underline"
                        >
                          Reviews →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Housing agencies section */}
      {housingAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {cfg.title} Agencies with Housing in the Netherlands
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <span className="text-2xl shrink-0">🏠</span>
            <div>
              <p className="font-semibold text-green-800 text-sm">
                {housingAgencies.length} {cfg.title} {housingAgencies.length === 1 ? "agency offers" : "agencies offer"} accommodation
              </p>
              <p className="text-xs text-green-700 mt-1">
                Agency housing is worth €350–700/month — check SNF certification status before accepting.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingAgencies.slice(0, 6).map((agency) => {
              const badge = scoreBadge(agency.transparencyScore);
              return (
                <Link
                  key={agency.slug}
                  href={`/agencies/${agency.slug}`}
                  className="card p-3 hover:border-brand-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900">{agency.name}</p>
                    <span className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                      {agency.transparencyScore}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    🏠 {accommodationLabel(agency.accommodation)}
                  </p>
                  {agency.city && <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>}
                </Link>
              );
            })}
          </div>
          <div className="mt-3">
            <Link
              href="/best-agencies-with-housing-netherlands"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              View all agencies with housing in the Netherlands →
            </Link>
          </div>
        </section>
      )}

      {/* What to look for section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          What to Look for in a {cfg.title} Agency
        </h2>
        <div className="space-y-4">
          {cfg.tips.map((tip, i) => (
            <div key={i} className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{tip.heading}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions — {cfg.title} Jobs in the Netherlands
        </h2>
        <div className="space-y-4">
          {cfg.faqs.map((faq, i) => (
            <div key={i} className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related salary pages */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Related salary data
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(JOB_SALARY_DATA)
            .filter(([k]) => k !== params.jobtype)
            .slice(0, 8)
            .map(([slug, job]) => (
              <Link
                key={slug}
                href={`/salary/${slug}-netherlands`}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
              >
                {job.icon} {job.title} salary
              </Link>
            ))}
        </div>
      </section>

      {/* Methodology note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Agencies ranked by AgencyCheck transparency score (0–100). Score based on: housing certification, CAO membership,
        public information quality, and worker review signals. Last updated: 2026.
      </p>
    </div>
  );
}
