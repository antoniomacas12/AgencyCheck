// ─── AgencyCheck — City-Specific Content ─────────────────────────────────────
// Unique, researched content per city — never generated, never templated.
// Each entry describes what the city actually looks like for agency workers:
// which industries dominate, which companies hire, what workers encounter.
//
// Cities without an entry use the default template layout with no intro text.
// Last reviewed: 2026-05-30

export interface CityContent {
  /** City-specific h1 angle — replaces "Agency Jobs in {city}, Netherlands" */
  headline?: string;
  /** 2–4 sentences of factual, city-specific context for workers */
  intro: string;
  /** Which sectors dominate (shown as chips below the intro) */
  industryFocus: string[];
  /** Known large employers or distribution centres in the area */
  keyEmployers?: string[];
  /** Specific housing note for workers relocating to this city */
  housingNote?: string;
  /** Anything specific workers need to know before coming */
  workerNote?: string;
}

// Slug → content
const CITY_CONTENT: Record<string, CityContent> = {

  rotterdam: {
    headline: "Agency Jobs in Rotterdam — Port, Logistics & Warehouse Work",
    intro:
      "Rotterdam is home to Europe's largest seaport — the Port of Rotterdam handles over 450 million tonnes of cargo per year, which means a permanent demand for logistics operators, warehouse pickers, crane operators, and dock workers. The main industrial areas are Botlek (petrochemical and bulk cargo), Europoort (deep-sea containers), Coolport (fresh produce and cold storage), and Waalhaven (general cargo). Agency work in Rotterdam pays at or slightly above WML, though crane and equipment operators can earn significantly more. Many roles involve shift work and weekend supplements under the ABU CAO.",
    industryFocus: ["Port logistics", "Warehouse & DC", "Cold storage", "Chemical production", "Food processing"],
    keyEmployers: ["ECT (Euromax Terminal)", "DFDS", "Geodis", "DSV", "Greenyard Logistics (Coolport)", "Vopak"],
    housingNote:
      "Rotterdam has more affordable housing than Amsterdam. Agencies like HOBIJ and Charlie Works provide accommodation for relocating workers, typically in Spijkenisse or Barendrecht — not in the city centre.",
    workerNote:
      "Many roles in the port and Europoort area require a valid ID and EU work status before Day 1. Some industrial zones are not reachable by public transport — check transport arrangements with your agency before accepting.",
  },

  venlo: {
    headline: "Agency Jobs in Venlo — Logistics Hub on the German Border",
    intro:
      "Venlo sits directly on the Rhine at the German border, making it one of the Netherlands' most important cross-border logistics corridors. The city's Tradeport Noord and Tradeport Oost business parks house dozens of major distribution centres, including Amazon (Venlo Swalmen), Zalando, DHL, and DB Schenker. OTTO Workforce is headquartered in Venlo and places the largest number of workers in the region. The logistics sector here runs on three shifts, 24/7, including Christmas and public holidays under the ABU CAO supplement structure.",
    industryFocus: ["Logistics & DC", "E-commerce fulfillment", "Cross-border freight", "Food production"],
    keyEmployers: ["Amazon (Venlo Swalmen)", "Zalando", "DHL", "DB Schenker", "Geodis", "Lidl DC"],
    housingNote:
      "OTTO Workforce provides SNF-certified housing in the Venlo region, with deductions of approximately €100–€125 per week. Workers are typically housed in Venlo, Horst, or Venray. Private rooms in Venlo's city centre start around €450/month.",
    workerNote:
      "Venlo has a large established Polish and Romanian worker community, with Polish-speaking coordinators at most logistics agencies. The A73 motorway connects Venlo directly to Eindhoven and the A67 to Belgium.",
  },

  venray: {
    headline: "Agency Jobs in Venray — Amazon Logistics and Limburg Horticulture",
    intro:
      "Venray is a mid-size Limburg municipality that has become one of the most active temp-work areas in the Netherlands. Amazon operates one of its largest Dutch fulfilment centres here — handling tens of thousands of daily shipments — and is the city's single biggest employer of agency workers. Beyond Amazon, Venray has a substantial greenhouse and horticulture cluster, with cultivation sites for capsicum, tomatoes, and herbs. OTTO Workforce is by far the most active agency in the Venray area.",
    industryFocus: ["E-commerce fulfillment (Amazon)", "Horticulture", "Food production", "Logistics"],
    keyEmployers: ["Amazon Fulfillment (VNO1 & VNO2)", "Royal Cosun", "Greenport Venlo farms"],
    housingNote:
      "OTTO Housing provides accommodation in Venray and surrounding villages. Shared housing with deductions around €100–€120/week is standard. The town centre has limited private rental availability.",
    workerNote:
      "Amazon in Venray runs day and night shifts. Night shifts attract a 45–50% ABU CAO supplement. Many workers start on sorting and stowing — no experience required, but physical stamina matters.",
  },

  tilburg: {
    headline: "Agency Jobs in Tilburg — E-Commerce and Distribution Centres",
    intro:
      "Tilburg has transformed from a textile city into one of the Netherlands' largest logistics hubs. The Vossenberg West and Loven industrial parks host major distribution centres for e-commerce and retail — Wehkamp, one of the Netherlands' largest online retailers, has its main fulfilment operation here, alongside fashion logistics companies and fast-moving consumer goods distributors. Charlie Works is headquartered in nearby Breda and is particularly active in the Tilburg–Eindhoven corridor. The city has good motorway links to the A58 (Eindhoven), A261 (Rotterdam) and the Belgian border.",
    industryFocus: ["Warehouse & DC", "E-commerce fulfillment", "Fashion logistics", "Food production"],
    keyEmployers: ["Wehkamp", "Catom (fashion DC)", "Albert Heijn DC", "Lidl", "Cargill"],
    housingNote:
      "Tilburg housing is cheaper than Amsterdam or Rotterdam. Agencies rarely provide housing for Tilburg roles specifically — most workers commute from nearby towns. Private rooms from around €400/month.",
    workerNote:
      "Shift differentials in Tilburg DCs follow the ABU CAO: +25% evenings (18:00–22:00), +50% nights (22:00–06:00), +100% Sundays. Always ask for the shift schedule before your first day.",
  },

  westland: {
    headline: "Agency Jobs in Westland — Greenhouse Capital of Europe",
    intro:
      "Westland is the largest greenhouse municipality in the Netherlands and one of the most concentrated horticulture areas on earth — over 80% of its land area is covered by greenhouses producing tomatoes, peppers, cucumbers, chrysanthemums, and orchids. Demand for harvest workers, propagation staff, and packing-line operators is near-permanent, though it peaks February–May and again September–October. Most work is at WML with limited upward mobility, but workers report getting 40+ consistent hours per week. EG Personeel (Wateringen), Fix Team (Schipluiden), and Westflex are the main agencies active here.",
    industryFocus: ["Greenhouse horticulture", "Flower & vegetable packing", "Propagation", "Cold chain logistics"],
    keyEmployers: ["Royal Pride Holland", "Looije Tomaten", "Van der Knaap Group", "Duijvestijn Tomaten"],
    housingNote:
      "Westland has very limited private rental availability. Most agencies house workers in Wateringen, Naaldwijk, Monster, or Maasdijk. Fix Team has faced criticism for housing quality — check SNF certification status before signing.",
    workerNote:
      "Greenhouse work is repetitive and physically demanding in warm, humid conditions. Many roles require you to stand or bend for 8+ hours. Good footwear and layered clothing are important. Dutch language is rarely required.",
  },

  wateringen: {
    headline: "Agency Jobs in Wateringen — Greenhouse Region, South Holland",
    intro:
      "Wateringen is the agency hub for the broader Westland greenhouse region. Both EG Personeel and Westflex are based here, placing workers in tomato, pepper, and chrysanthemum cultivation across the surrounding area. Most roles involve harvest picking, plant pruning, and packing-line work — all physical, repetitive tasks requiring no qualifications but consistent effort. Most growers run 6-day weeks during peak season.",
    industryFocus: ["Greenhouse horticulture", "Vegetable packing", "Flower cultivation"],
    keyEmployers: ["Westland growers via EG Personeel", "Westflex client network"],
    housingNote:
      "EG Personeel and Westflex both provide housing. Wateringen has limited accommodation for agency workers privately. Agencies typically charge €95–€115/week for a shared room.",
    workerNote:
      "Work in Westland greenhouses starts early — usually 07:00 or 08:00. Most sites don't have heating in winter, and summer temperatures inside greenhouses can exceed 35°C.",
  },

  aalsmeer: {
    headline: "Agency Jobs in Aalsmeer — Flower Auction and Schiphol Corridor",
    intro:
      "Aalsmeer is home to FloraHolland, the world's largest flower auction — a trading floor larger than 200 football pitches where over 12 billion flowers are sold every year. Logistics and packing work at and around FloraHolland is the main source of agency employment in Aalsmeer, with operations running from 04:00 onwards. The Schiphol cargo zone begins just 6 km north, adding further aviation logistics opportunities. Ruigrok Personeel, based in Aalsmeer's Thailand business park, specialises in horticulture and logistics placements in this corridor.",
    industryFocus: ["Flower auction logistics", "Horticulture packing", "Schiphol cargo", "Cold chain"],
    keyEmployers: ["FloraHolland (Royal FloraHolland)", "Dümmen Orange", "Brinkman Group"],
    housingNote:
      "Ruigrok Personeel provides purpose-built accommodation in a modern building in Aalsmeer. Aalsmeer has limited private accommodation and is expensive given its proximity to Amsterdam Schiphol.",
    workerNote:
      "FloraHolland operations start before sunrise. The 04:00–07:00 shift window is common for logistics and loading staff. A valid ID and transport to early shifts is essential — public transport is limited at those hours.",
  },

  schiphol: {
    headline: "Agency Jobs at Schiphol — Airport Logistics and Cargo",
    intro:
      "Amsterdam Airport Schiphol is one of Europe's busiest cargo hubs, handling over 1.7 million tonnes of freight per year in addition to passenger operations. Agency workers in the Schiphol zone work in airside cargo, ground handling, baggage logistics, aircraft cleaning, and the broader supply chain that feeds the airport's 500+ shops, restaurants, and lounges. EmployMe (Lijnden), Top Match Recruitment, Tressunt, and Ruigrok Personeel (Aalsmeer) are the main agencies operating in this zone. Roles require background checks and airport security passes (Schipholpas), which take 2–4 weeks to process.",
    industryFocus: ["Airport cargo", "Ground handling", "Airside logistics", "Aircraft services", "Retail & hospitality"],
    keyEmployers: ["Menzies Aviation", "Swissport", "Aviapartner", "Worldwide Flight Services", "KLM Catering"],
    housingNote:
      "Schiphol-area housing is among the most expensive in the Netherlands. Most workers commute from Amsterdam, Haarlem, or Hoofddorp. EmployMe (Lijnden) is 2 km from the cargo zone.",
    workerNote:
      "A Schipholpas (airport security pass) is mandatory for any airside role. Your agency arranges this, but it takes time. You cannot start working airside without it. Non-EU nationals face additional screening requirements.",
  },

  amsterdam: {
    headline: "Agency Jobs in Amsterdam — Logistics, Hospitality & Office Work",
    intro:
      "Amsterdam's agency market is one of the most diverse in the country, spanning warehouse logistics (Schiphol corridor, Westpoort industrial port), hospitality (hotels, events, catering), office and admin roles, IT contracting, and construction. Amsterdam has over 100 registered employment agencies — more than any other Dutch city — ranging from small hospitality specialists to global recruitment firms. For blue-collar and flex work specifically, the Westpoort industrial zone and the Schiphol-linked Lijnden/Hoofddorp corridor are the main areas. Timing (RAI branch, Amsterdam West branch) and Youbahn are among the most active general-staffing platforms in the city.",
    industryFocus: ["Logistics & Westpoort", "Hospitality & events", "Office & admin", "IT & tech", "Construction"],
    keyEmployers: ["RAI Amsterdam (events)", "Heineken Experience Centre", "Foodex (Westpoort)", "Albert Heijn DC Zaandam"],
    housingNote:
      "Private rooms in Amsterdam start around €800–€1,200/month — among the most expensive in Europe. Very few agencies provide housing for Amsterdam-based roles. Budget accordingly or consider commuting from Almere, Haarlem, or Zaandam.",
    workerNote:
      "Many Amsterdam agencies focus on professional placements (IT, finance, marketing). If you're looking for warehouse, logistics, or production work, target agencies in the Westpoort zone or look at Schiphol-adjacent towns rather than central Amsterdam.",
  },

  den_haag: {
    headline: "Agency Jobs in Den Haag — Government, Logistics and Westland Proximity",
    intro:
      "Den Haag (The Hague) is the seat of the Dutch government and home to international organisations including the International Court of Justice, Europol, and dozens of embassies — but it also sits at the centre of a significant logistics and industrial zone. The Binckhorstlaan area houses production and logistics companies, and the city is 10 km from the Westland greenhouse region. HOBIJ Uitzendbureau is based in Den Haag and is the dominant agency for logistics and production roles in the Den Haag–Delft–Zoetermeer corridor. HappyNurse has its Dutch headquarters here for healthcare staffing.",
    industryFocus: ["Government & public sector", "Logistics & DC", "Healthcare", "Greenhouse (Westland proximity)", "Office & admin"],
    keyEmployers: ["HOBIJ client network", "Cofely / Engie (facilities)", "PostNL Sorting Centre", "Ahold DC Zoetermeer"],
    housingNote:
      "Den Haag is significantly more affordable than Amsterdam. Private rooms start around €500–€700/month. HOBIJ provides housing for workers placed in the logistics corridor.",
    workerNote:
      "The HOBIJ agency requires workers to have EU citizenship and a valid BSN before placement. The RandstadRail tram connects Den Haag to Delft and Zoetermeer quickly. For Westland roles, a bicycle or agency transport is usually needed.",
  },

  utrecht: {
    headline: "Agency Jobs in Utrecht — Central Location, Logistics and Production",
    intro:
      "Utrecht's position at the geographic centre of the Netherlands makes it a natural logistics node — every major motorway (A2, A12, A27, A28) connects through or near the city. The industrial areas of Lage Weide and Overvecht house warehouses, printing companies, and production facilities. AB Groep and AB Midden are based in nearby Nieuwegein (5 km south) and are the most active housing-providing agencies in the Utrecht–Nieuwegein corridor. Covebo also maintains an active presence with confirmed accommodation options.",
    industryFocus: ["Warehouse & logistics", "Production", "Office & admin", "Healthcare", "Transport"],
    keyEmployers: ["PostNL (Houtense Vlakte DC)", "Wehkamp (Utrecht DC)", "Graydon", "Districon"],
    housingNote:
      "Private rooms in Utrecht start around €600–€900/month and are difficult to find. AB Groep provides housing in Nieuwegein, which is a 10-minute bus ride from Utrecht Centraal. Covebo has accommodation options in nearby Breukelen and Woerden.",
    workerNote:
      "Utrecht Centraal is one of the busiest train stations in Europe — connections to Amsterdam (25 min), Rotterdam (40 min), and Eindhoven (50 min) are fast and frequent. Workers who can commute have good access to multiple regions.",
  },

  eindhoven: {
    headline: "Agency Jobs in Eindhoven — High-Tech Logistics and Brabant Production",
    intro:
      "Eindhoven is best known as the home of ASML — the world's only manufacturer of EUV chip-making machines — and the broader Brainport technology ecosystem. For agency workers, this translates into a significant demand for logistics and production staff supporting high-tech supply chains, alongside more conventional warehouse and distribution roles. The A2/A67/A58 motorways make Eindhoven central for the entire Brabant region. Charlie Works (Breda), Hays, Brunel, and Michael Page all have active placement operations here.",
    industryFocus: ["High-tech logistics", "Production & assembly", "Warehouse & DC", "Technical roles", "IT & engineering"],
    keyEmployers: ["ASML (supply chain logistics)", "Philips / Signify", "DAF Trucks", "Lidl DC Eindhoven"],
    housingNote:
      "Eindhoven is significantly more affordable than Amsterdam or Rotterdam. Private rooms start around €450–€650/month. Charlie Works and Covebo cover nearby Helmond and Waalwijk with accommodation options.",
    workerNote:
      "Eindhoven Airport has connections to Eastern Europe (Wizz Air, Ryanair), making it practical for workers flying home. The city has a growing expat community driven by Brainport — English is widely spoken in most workplaces.",
  },

  breda: {
    headline: "Agency Jobs in Breda — Southwest Logistics Corridor and Distribution",
    intro:
      "Breda is the logistics gateway between the Netherlands and Belgium, sitting at the intersection of the A16 (Rotterdam) and A58 (Eindhoven) motorways. The Haagse Beemden and Emer industrial parks house distribution centres for retail, e-commerce, and food logistics. Charlie Works has its headquarters in Breda and primarily places workers in DC roles along the Rotterdam–Tilburg–Breda–Roosendaal corridor. HOBIJ also extends into this area via its South Holland network.",
    industryFocus: ["Warehouse & DC", "Cross-border logistics", "Food production", "E-commerce fulfillment"],
    keyEmployers: ["Aldi DC (Breda)", "bol.com DC (Waalwijk area)", "Hessing Supervers", "Menzies Distribution"],
    housingNote:
      "Charlie Works provides accommodation for workers placed in Breda. Private housing starts around €400–€550/month — reasonably affordable by Dutch standards. Roosendaal (30 min) and Bergen op Zoom (40 min) have cheaper housing options.",
    workerNote:
      "Breda is well connected by train to Rotterdam (45 min), Tilburg (15 min), and Antwerp (35 min). Workers placed in Belgian cross-border DC roles should check whether work permits are required for Belgian territory.",
  },

  almere: {
    headline: "Agency Jobs in Almere — Amsterdam Overspill and Flevoland Logistics",
    intro:
      "Almere is the youngest and fastest-growing city in the Netherlands, built on reclaimed land in Flevoland just 30 km from Amsterdam by A6 motorway. The Almere logistics cluster — particularly around Almere Poort and the Wacker Chemie / IKEA distribution area — generates a steady demand for warehouse and production workers. Covebo actively places workers here. Amsterdam-based agencies frequently extend their coverage to Almere given the quick A6 connection.",
    industryFocus: ["Warehouse & DC", "Flat-pack / furniture logistics", "Production", "E-commerce"],
    keyEmployers: ["IKEA Almere (DC)", "PostNL DC", "Bol.com (nearby)", "DPD"],
    housingNote:
      "Almere is significantly cheaper than Amsterdam — rooms from €500–€700/month. The Flevolijn train runs directly to Amsterdam Centraal (30 min). Covebo has accommodation in Almere Zeewolde area.",
    workerNote:
      "Almere has limited night-time public transport. For shift work in industrial zones, a bicycle or agency-arranged transport is strongly recommended. The A6 can be congested during morning rush hours.",
  },

  groningen: {
    headline: "Agency Jobs in Groningen — North Netherlands Hub",
    intro:
      "Groningen is the largest city in the northern Netherlands and serves as the regional hub for Drenthe, Groningen, and Friesland. Unlike the logistics-heavy south, the Groningen labour market is more mixed — food production (FrieslandCampina, McCain), transport and distribution, healthcare, and a growing tech and energy sector linked to the energy transition (previously natural gas, now hydrogen and renewables). Randstad and Brunel have established operations here. Agency wages in the north broadly match the national WML, but the cost of living is markedly lower than in the Randstad.",
    industryFocus: ["Food production", "Transport & logistics", "Healthcare", "Energy & renewables", "Office & admin"],
    keyEmployers: ["FrieslandCampina (Leeuwarden/Groningen)", "McCain Foods (Lelystad/region)", "PostNL", "OCI Nitrogen"],
    housingNote:
      "Groningen has the most affordable housing of any major Dutch city — private rooms from €400–€550/month. Agency housing is rarely provided for Groningen-based roles since local accommodation is plentiful.",
    workerNote:
      "Groningen University draws a large young population, which keeps service and hospitality sectors active. For international workers, English is widely understood in the city. Distances to the south (Amsterdam: 2.5 hrs by train) mean most workers based here commit to the region.",
  },

  zaandam: {
    headline: "Agency Jobs in Zaandam — Food Industry and Amsterdam Fringe",
    intro:
      "Zaandam, on the north bank of the North Sea Canal, is the food industry capital of the Netherlands. Albert Heijn is headquartered here, as is Verkade (biscuits and confectionery), and the area has a deep history in cacao processing, flour milling, and food manufacturing that continues to the present day. The Achtersluispolder and Hoogtij industrial areas generate a high volume of food production, packing, and logistics jobs. Select Uitzendbureau (Haarlem) and Carrière extend their coverage to Zaandam. Amsterdam is 20 minutes by rail.",
    industryFocus: ["Food production", "FMCG packing", "Logistics & DC", "Chemical production"],
    keyEmployers: ["Albert Heijn (AH HQ + DC)", "Verkade", "ADM Cocoa", "Vion Food Group"],
    housingNote:
      "Zaandam housing is considerably cheaper than Amsterdam — rooms from €550–€750/month — with a direct NS train to Amsterdam Centraal every 10 minutes. An underrated option for workers placed in the Amsterdam metro area.",
    workerNote:
      "The food production plants around Zaandam frequently operate 24/7. Night shift supplements apply under the ABU CAO. Some facilities have strict hygiene requirements (hairnets, no jewellery, food safety training).",
  },

  waalwijk: {
    headline: "Agency Jobs in Waalwijk — Shoe Capital Turned Logistics Hub",
    intro:
      "Waalwijk has a centuries-old leather and shoemaking history, but today the industrial parks Zevenbergen and Haven are dominated by logistics and distribution — particularly for fashion, retail, and e-commerce. Covebo is very active here, and the city sits in the 'logistics golden triangle' between Rotterdam port (50 km west), the Brabant highway network, and the Rhine waterway. NL Jobs also places workers here in packing and warehouse roles.",
    industryFocus: ["Fashion & footwear logistics", "Warehouse & DC", "E-commerce fulfillment", "Food production"],
    keyEmployers: ["Van Mossel (auto logistics)", "G-Star RAW (DC)", "Bol.com (regional DC)", "PostNL"],
    housingNote:
      "Covebo provides accommodation in Waalwijk with deductions around €100–€115/week. Private rooms are available in the town centre from approximately €420/month. Good train connection to 's-Hertogenbosch (20 min).",
    workerNote:
      "Waalwijk's logistics season is particularly intense from August–December due to fashion season and pre-Christmas fulfilment peaks. Agencies typically scale up significantly during this period — good time to find consistent hours.",
  },

  "s-hertogenbosch": {
    headline: "Agency Jobs in 's-Hertogenbosch — Brabant Regional Hub",
    intro:
      "Known locally as Den Bosch, 's-Hertogenbosch is the capital of Noord-Brabant and a regional hub for office, logistics, and professional services. The Rietveldt and Maaspoort industrial areas have established logistics and food production activity. StudentenBureau has its Dutch head office here. Nearby Oss (15 km) has a significant pharmaceutical sector (Organon, formerly MSD) and E&A Uitzendbureau places workers in the Oss–Berghem production corridor. Triangle intérim also covers Den Bosch in its national network.",
    industryFocus: ["Logistics & distribution", "Food production", "Pharmaceutical (nearby Oss)", "Office & admin"],
    keyEmployers: ["Organon (Oss)", "Jumbo (HQ)", "PostNL DC", "Fuji Seal (Oss)"],
    housingNote:
      "Private rooms in Den Bosch from €500–€700/month. Good rail connections: Amsterdam (1 hr), Eindhoven (30 min), Utrecht (45 min).",
    workerNote:
      "Den Bosch has a large Carnival celebration in February — the city has an active local culture beyond work. For workers from Eastern Europe, it's a convenient commuting hub given Eindhoven Airport's low-cost connections.",
  },

  haarlem: {
    headline: "Agency Jobs in Haarlem — North Holland Logistics and Industry",
    intro:
      "Haarlem is a historic city between Amsterdam (20 km) and the North Sea, with a significant industrial presence in its Waarderpolder business park — one of the largest industrial sites in North Holland. Food and beverage production, metalworking, printing, and logistics are the main industries. Select Uitzendbureau is based in Haarlem's Huifakkerweg and places workers primarily in logistics and production roles across North Holland. The city also has a strong hospitality and retail sector.",
    industryFocus: ["Warehouse & production", "Printing", "Hospitality", "Logistics", "Food & beverage"],
    keyEmployers: ["Hein Gericke (logistics)", "Heineken (regional logistics)", "DSM (Delft but region)", "Various Waarderpolder employers"],
    housingNote:
      "Haarlem is expensive by Dutch standards outside Amsterdam — rooms from €650–€900/month. Select Uitzendbureau provides housing for longer-term placements. Zaandam (cheaper) is reachable in 20 min by train.",
    workerNote:
      "Haarlem's proximity to both Amsterdam and the coast makes it attractive but costly. The North Sea Canal provides direct access to Amsterdam's Westpoort industrial port, which some agencies cover from here.",
  },

  nijmegen: {
    headline: "Agency Jobs in Nijmegen — Gelderland Hub Near the German Border",
    intro:
      "Nijmegen is the oldest city in the Netherlands, sitting on the Waal river 10 km from the German border. It has a mixed economy combining a significant university (Radboud Universiteit), a growing healthcare cluster (Radboud UMC), and traditional manufacturing and logistics in its Winkelsteeg and Westkanaaldijk industrial zones. Randstad is active here, and the city benefits from German cross-border logistics flows. Triangle intérim's Arnhem office covers the Nijmegen region.",
    industryFocus: ["Healthcare (Radboud UMC)", "Logistics & production", "University services", "Cross-border freight"],
    keyEmployers: ["Radboud UMC", "Synthon (pharma)", "DAF (regional)", "PostNL"],
    housingNote:
      "Nijmegen has affordable housing — private rooms from €450–€600/month. Large student population keeps supply relatively stable.",
    workerNote:
      "Nijmegen hosts the world's largest walking event (Four Days Marches / Vierdaagse) every July — accommodation is near-impossible to find that week. Plan around it if you're relocating.",
  },

  nieuwegein: {
    headline: "Agency Jobs in Nieuwegein — Utrecht Region Production and Logistics",
    intro:
      "Nieuwegein is an industrial satellite of Utrecht, connected by tram and bus in under 15 minutes. Its industrial zones — particularly Plettenburg and Galecopperzoom — house logistics companies, food producers, and manufacturing plants. AB Groep and AB Midden, both based in Nieuwegein, are the dominant housing-providing agencies here. Covebo also maintains an active presence with accommodation in nearby Breukelen.",
    industryFocus: ["Production & manufacturing", "Warehouse & logistics", "Food processing", "Technical roles"],
    keyEmployers: ["Attero (waste)", "Sligro (food DC)", "ENGIE (utilities services)", "Various industrial clients"],
    housingNote:
      "AB Groep provides accommodation in Nieuwegein — well-maintained, typically shared apartments with individual rooms. Private rooms start around €550–€750/month. Good value compared to Utrecht city centre.",
    workerNote:
      "Nieuwegein's Galecopperzoom industrial area has limited public transport in the early morning. AB Groep typically arranges shuttle buses from housing locations to client sites.",
  },

  zwolle: {
    headline: "Agency Jobs in Zwolle — East Netherlands Logistics Junction",
    intro:
      "Zwolle is the main logistics and distribution hub for Overijssel and the eastern Netherlands, positioned at the intersection of the A28 (Utrecht–Groningen) and A50 (Arnhem–Emmen) motorways. The Hessenpoort and Voorst industrial parks house a range of distribution, production, and food companies. OTTO Workforce is active in Zwolle, particularly for food production and logistics roles. Triangle intérim's network extends here via its Deventer branch (30 km south).",
    industryFocus: ["Warehouse & DC", "Food production", "Transport & logistics", "Technical roles"],
    keyEmployers: ["Refresco Gerber (beverages)", "Nutreco (animal nutrition)", "PostNL DC", "Lidl DC"],
    housingNote:
      "Zwolle has good private rental availability at reasonable prices — rooms from €420–€580/month. OTTO Workforce may arrange housing for workers placed on longer contracts.",
    workerNote:
      "Zwolle is an important station on the Amsterdam–Groningen rail corridor — direct intercity trains run frequently. Good base for workers who want to access both northern and central Netherlands.",
  },
};

// Slug lookup with fallback for alternative city name formats
const SLUG_ALIASES: Record<string, string> = {
  "den-haag":     "den_haag",
  "the-hague":    "den_haag",
  "s-gravenhage": "den_haag",
  "den-bosch":    "s-hertogenbosch",
};

export function getCityContent(slug: string): CityContent | null {
  const resolved = SLUG_ALIASES[slug] ?? slug;
  return CITY_CONTENT[resolved] ?? null;
}

/** Returns true if we have specific content for this city slug */
export function hasCityContent(slug: string): boolean {
  return getCityContent(slug) !== null;
}
