"use client";

import { useState, useMemo } from "react";
import ApplyPreScreen from "@/components/ApplyPreScreen";

const WA_BASE = "https://wa.me/31649210631";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Badge = "acc" | "car" | "eng";
type Category =
  | "technical"
  | "production"
  | "warehouse"
  | "driving"
  | "automotive"
  | "food"
  | "hospitality";

interface Job {
  t: string;       // title
  c: Category;     // category
  s: string;       // salary display string
  sm: number;      // salary min (for filtering; 0 = unknown)
  l: string;       // location
  b: Badge[];      // badges
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const CAT_LABELS: Record<Category, string> = {
  technical:   "Technical & Construction",
  production:  "Production & Manufacturing",
  warehouse:   "Warehouse & Logistics",
  driving:     "Driving Jobs",
  automotive:  "Automotive",
  food:        "Food Production",
  hospitality: "Hospitality",
};

const CAT_ICONS: Record<Category, string> = {
  technical:   "🔧",
  production:  "🏭",
  warehouse:   "📦",
  driving:     "🚛",
  automotive:  "🚗",
  food:        "🍖",
  hospitality: "🏨",
};

const BADGE_META: Record<Badge, { label: string; color: string }> = {
  eng: { label: "Language req.",       color: "text-blue-300 bg-blue-400/10 border-blue-400/20" },
  car: { label: "Own car required",    color: "text-purple-300 bg-purple-400/10 border-purple-400/20" },
  acc: { label: "Accommodation incl.", color: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
};

const JOBS: Job[] = [
  // ── Technical & Construction ──────────────────────────────────────────────
  { t: "Electrician",                                     c: "technical",   s: "€550–€650/wk",   sm: 550, l: "Bodegraven",                          b: [] },
  { t: "Construction Welder (MIG/MAG)",                   c: "technical",   s: "€650/wk",        sm: 650, l: "Rotterdam area",                      b: [] },
  { t: "Elevator Fitter",                                 c: "technical",   s: "€700–€800/wk",   sm: 700, l: "Rotterdam area",                      b: [] },
  { t: "Pipe Fitter (Workshop / Prefab)",                 c: "technical",   s: "€700/wk",        sm: 700, l: "Rotterdam area",                      b: [] },
  { t: "Copper Pipe Brazer / Solderer",                   c: "technical",   s: "€650/wk",        sm: 650, l: "Bunschoten Spakenburg",                b: [] },
  { t: "TIG Welder (SS Pipes, HL-045 Certified)",         c: "technical",   s: "€700/wk",        sm: 700, l: "Bunschoten Spakenburg",                b: [] },
  { t: "Ironworker (Shipbuilding)",                       c: "technical",   s: "€560+/wk",       sm: 560, l: "Netherlands",                         b: [] },
  { t: "Mechanical Fitter (Yacht Construction)",          c: "technical",   s: "€600–€650/wk",   sm: 600, l: "Hellevoetsluis",                      b: [] },
  { t: "Technical Production Worker – Safety Glass",      c: "technical",   s: "€600/wk",        sm: 600, l: "Heinoord",                            b: [] },
  { t: "Dock Worker",                                     c: "technical",   s: "€590–€700/wk",   sm: 590, l: "Rotterdam area",                      b: [] },
  { t: "Production Prefab Concrete Worker",               c: "technical",   s: "€600–€625/wk",   sm: 600, l: "Rotterdam area",                      b: [] },
  { t: "TIG/MAG Welder / Assembler",                      c: "technical",   s: "€650/wk",        sm: 650, l: "Sevenum",                             b: [] },
  { t: "Train Electrician / Mechanic",                    c: "technical",   s: "€580/wk",        sm: 580, l: "Roosendaal",                          b: [] },
  { t: "MIG/MAG Welder / Assembler (Black Steel)",        c: "technical",   s: "€640–€960/wk",   sm: 640, l: "Obdam",                              b: [] },
  { t: "MAG Welder / Assembler",                          c: "technical",   s: "€640/wk",        sm: 640, l: "Akersloot",                           b: [] },
  { t: "Junior Construction Plumber",                     c: "technical",   s: "€535–€575/wk",   sm: 535, l: "Rotterdam area",                      b: [] },
  { t: "Plumber",                                         c: "technical",   s: "€560–€660/wk",   sm: 560, l: "Amsterdam",                           b: [] },
  { t: "Tiler",                                           c: "technical",   s: "€560–€660/wk",   sm: 560, l: "Hardenberg",                          b: [] },
  { t: "Prefab Wood Construction Worker",                 c: "technical",   s: "€490–€530/wk",   sm: 490, l: "Uden",                                b: [] },
  { t: "PVC Window Fitter",                               c: "technical",   s: "€535/wk",        sm: 535, l: "Posterholt / Purmerend",               b: ["car"] },
  { t: "Aluminum Window Frame Assembler",                 c: "technical",   s: "€510/wk",        sm: 510, l: "Beverwijk",                           b: [] },
  { t: "PVC Window Assembler (40h)",                      c: "technical",   s: "€510/wk",        sm: 510, l: "Moergestel",                          b: [] },
  { t: "Aluminum Window Fitters",                         c: "technical",   s: "€535–€560/wk",   sm: 535, l: "Netherlands",                         b: [] },
  { t: "Modular Houses Assembly (Carpentry)",             c: "technical",   s: "€520/wk",        sm: 520, l: "Hulst",                               b: ["car"] },
  { t: "Work Planner / Project Coordinator (Petrochemical)", c: "technical", s: "€830+/wk",      sm: 830, l: "Antwerp",                             b: ["eng"] },
  // ── Production & Manufacturing ────────────────────────────────────────────
  { t: "Car Frame Builder / Assembly Worker",             c: "production",  s: "€550–€650/wk",   sm: 550, l: "Waardenburg",                         b: [] },
  { t: "Automotive Electrician",                          c: "production",  s: "€550–€650/wk",   sm: 550, l: "Netherlands",                         b: [] },
  { t: "Welding Robot Operator",                          c: "production",  s: "€520–€650/wk",   sm: 520, l: "Netherlands",                         b: [] },
  { t: "CNC Milling Operator (2nd shift)",                c: "production",  s: "€630/wk",        sm: 630, l: "Oirschot",                            b: ["car"] },
  { t: "CNC Operator / Programmer",                       c: "production",  s: "€500+/wk",       sm: 500, l: "Netherlands",                         b: [] },
  { t: "TIG Welder",                                      c: "production",  s: "€500+/wk",       sm: 500, l: "Netherlands",                         b: [] },
  { t: "MIG/MAG Welder",                                  c: "production",  s: "€500+/wk",       sm: 500, l: "Netherlands",                         b: [] },
  { t: "CNC Turner (Mazak / Mazatrol)",                   c: "production",  s: "€580–€650/wk",   sm: 580, l: "Breskens",                            b: [] },
  { t: "CNC Turners & Millers (Programmers)",             c: "production",  s: "€650/wk",        sm: 650, l: "Netherlands",                         b: [] },
  { t: "Workshop Carpenter",                              c: "production",  s: "€620/wk",        sm: 620, l: "Netherlands",                         b: ["car"] },
  { t: "Industrial Painter",                              c: "production",  s: "€500/wk",        sm: 500, l: "Oisterwijk",                          b: [] },
  { t: "Assembly Mechanic",                               c: "production",  s: "€450–€550/wk",   sm: 450, l: "Oisterwijk",                          b: [] },
  // ── Warehouse & Logistics ─────────────────────────────────────────────────
  { t: "Warehouse Worker",                                c: "warehouse",   s: "—",              sm: 0,   l: "Waalwijk",                            b: [] },
  { t: "Warehouse Employee (EPT, cold environment)",      c: "warehouse",   s: "—",              sm: 0,   l: "Grubbenvorst",                        b: [] },
  { t: "Deepfreeze Warehouse Worker (Sligro)",            c: "warehouse",   s: "—",              sm: 0,   l: "Veghel",                              b: [] },
  { t: "All-round Warehouse Employee",                    c: "warehouse",   s: "—",              sm: 0,   l: "Helmond / Deurne / Eindhoven",         b: [] },
  // ── Driving Jobs ─────────────────────────────────────────────────────────
  { t: "CE Truck Driver (Hook arm)",                      c: "driving",     s: "€1000–€1200/wk", sm: 1000, l: "Eindhoven",                          b: [] },
  { t: "CE Truck Driver – Car Transportation",            c: "driving",     s: "€800–€1000/wk",  sm: 800,  l: "Vianen",                             b: [] },
  { t: "CE Truck Driver (Lidl, 40-55h)",                  c: "driving",     s: "€675–€875/wk",   sm: 675,  l: "Netherlands",                        b: [] },
  { t: "C cat. Truck Driver – Distribution & Logistics",  c: "driving",     s: "€700–€1000/wk",  sm: 700,  l: "Netherlands",                        b: ["car"] },
  { t: "CE Truck Driver – Distribution & Logistics",      c: "driving",     s: "€700–€1000/wk",  sm: 700,  l: "Netherlands",                        b: ["car"] },
  { t: "Damage Repairer (Trailers)",                      c: "driving",     s: "€580+/wk",       sm: 580,  l: "Hoorn",                              b: [] },
  { t: "Truck Mechanic",                                  c: "driving",     s: "€600–€700/wk",   sm: 600,  l: "Alblasserdam",                       b: [] },
  { t: "Industrial Painter (Trailers & Trucks)",          c: "driving",     s: "€600/wk",        sm: 600,  l: "Venlo",                              b: [] },
  { t: "Bus Driver (Public Transport)",                   c: "driving",     s: "€550–€620/wk",   sm: 550,  l: "Netherlands",                        b: [] },
  { t: "Bus Driver – Free Accommodation",                 c: "driving",     s: "€600–€800/wk",   sm: 600,  l: "Netherlands",                        b: ["acc"] },
  { t: "Tractor Driver (Green Sector)",                   c: "driving",     s: "€450–€550/wk",   sm: 450,  l: "Numansdorp",                         b: [] },
  // ── Automotive ───────────────────────────────────────────────────────────
  { t: "MIG/MAG Welder – Fitter (Truck Trailers)",        c: "automotive",  s: "€600–€750/wk",   sm: 600, l: "Netherlands",                         b: [] },
  { t: "Car Mechanic (min. 5 years exp.)",                c: "automotive",  s: "€580–€640/wk",   sm: 580, l: "Netherlands",                         b: [] },
  { t: "Car Pre-Processor",                               c: "automotive",  s: "€560–€600/wk",   sm: 560, l: "Horst",                               b: [] },
  { t: "Car Painter",                                     c: "automotive",  s: "€600–€750/wk",   sm: 600, l: "Netherlands",                         b: [] },
  { t: "Car Mechanic",                                    c: "automotive",  s: "€550+/wk",       sm: 550, l: "Netherlands",                         b: [] },
  // ── Food Production ───────────────────────────────────────────────────────
  { t: "Meat Factory Production Worker & Cleaner",        c: "food",        s: "—",              sm: 0,   l: "Haarlem",                             b: [] },
  { t: "Wooden Packaging Production Worker",              c: "food",        s: "€400–€500/wk",   sm: 400, l: "Nieuw-Bergen",                        b: [] },
  { t: "Poultry Hanger",                                  c: "food",        s: "€320–€370/wk",   sm: 320, l: "Goor",                                b: [] },
  // ── Hospitality ───────────────────────────────────────────────────────────
  { t: "Housekeeper (1-2 yrs exp.)",                      c: "hospitality", s: "—",              sm: 0,   l: "Amsterdam / Utrecht / Tilburg",       b: [] },
  { t: "Cook (with experience)",                          c: "hospitality", s: "—",              sm: 0,   l: "Netherlands",                         b: [] },
  { t: "Assistant Cook",                                  c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Dishwasher",                                      c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Experienced Cook",                                c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Experienced Bartender",                           c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Experienced Housekeeper",                         c: "hospitality", s: "€900/mo net",    sm: 900, l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Experienced Waiter / Waitress",                   c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc"] },
  { t: "Receptionist (German & English req.)",            c: "hospitality", s: "—",              sm: 0,   l: "Rhodes, Crete, Kos",                  b: ["acc", "eng"] },
];

const ALL_CATS = Object.keys(CAT_LABELS) as Category[];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function VacanciesClient() {
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState<"all" | Category>("all");
  const [minSal,   setMinSal]   = useState(0);
  const [badge,    setBadge]    = useState<"" | Badge>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleCat(c: string) {
    setCollapsed((prev) => ({ ...prev, [c]: !prev[c] }));
  }

  // Filtered jobs
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return JOBS.filter((j) => {
      if (cat !== "all" && j.c !== cat) return false;
      if (minSal > 0 && j.sm < minSal) return false;
      if (badge && !(j.b as string[]).includes(badge)) return false;
      if (q && !j.t.toLowerCase().includes(q) && !j.l.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, cat, minSal, badge]);

  // Group by category
  const byCat = useMemo(() => {
    const map: Record<string, Job[]> = {};
    filtered.forEach((j) => {
      (map[j.c] = map[j.c] || []).push(j);
    });
    return map;
  }, [filtered]);

  const visibleCats = cat === "all" ? ALL_CATS : ([cat] as Category[]);

  return (
    <div className="min-h-screen bg-[#0B1F14]">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Current openings · Netherlands & Greece
          </p>
          <h1 className="text-white font-extrabold text-[26px] sm:text-[30px] leading-tight mb-2">
            Actual Jobs
          </h1>
          <p className="text-gray-400 text-[13px]">
            {JOBS.length} positions · EU citizens only · Immediate start · +31 649 210 631
          </p>
        </div>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { n: filtered.length.toString(), l: "Positions" },
            { n: "7",    l: "Categories" },
            { n: "€450+", l: "Per week" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-white/[0.07] bg-white/[0.04] py-3 text-center">
              <p className="text-emerald-400 font-extrabold text-[20px] leading-none">{s.n}</p>
              <p className="text-gray-500 text-[11px] mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        {/* ── Requirements ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-4 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
          <span className="text-[12px] font-semibold text-amber-300">🇪🇺 EU citizens only</span>
          <span className="text-[12px] font-semibold text-blue-300">🌐 English required</span>
          <span className="text-[12px] font-semibold text-emerald-300">⚡ Immediate start</span>
        </div>

        {/* ── Search ───────────────────────────────────────────────── */}
        <div className="relative mb-3">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search jobs, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full bg-white/[0.05] border border-white/10 rounded-xl
              text-white placeholder-gray-600 text-[14px]
              pl-10 pr-4 py-3 outline-none
              focus:border-emerald-500/50 transition-colors
            "
          />
        </div>

        {/* ── Category tabs ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setCat("all")}
            className={`
              flex-shrink-0 rounded-full border text-[12px] font-semibold px-3.5 py-1.5 transition-all
              ${cat === "all"
                ? "bg-emerald-500 border-emerald-500 text-[#0B1F14] font-black"
                : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}
            `}
          >
            All
          </button>
          {ALL_CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`
                flex-shrink-0 rounded-full border text-[12px] font-semibold px-3.5 py-1.5 transition-all whitespace-nowrap
                ${cat === c
                  ? "bg-emerald-500 border-emerald-500 text-[#0B1F14] font-black"
                  : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}
              `}
            >
              {CAT_ICONS[c]} {CAT_LABELS[c].split(" ")[0]}
            </button>
          ))}
        </div>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <select
            value={minSal}
            onChange={(e) => setMinSal(Number(e.target.value))}
            className="bg-white/[0.05] border border-white/10 rounded-xl text-gray-300 text-[12px] px-3 py-2.5 outline-none focus:border-emerald-500/50"
          >
            <option value={0}>Any salary</option>
            <option value={400}>€400+/wk</option>
            <option value={500}>€500+/wk</option>
            <option value={600}>€600+/wk</option>
            <option value={700}>€700+/wk</option>
            <option value={800}>€800+/wk</option>
          </select>
          <select
            value={badge}
            onChange={(e) => setBadge(e.target.value as "" | Badge)}
            className="bg-white/[0.05] border border-white/10 rounded-xl text-gray-300 text-[12px] px-3 py-2.5 outline-none focus:border-emerald-500/50"
          >
            <option value="">All jobs</option>
            <option value="acc">Accommodation incl.</option>
            <option value="car">Own car needed</option>
            <option value="eng">Language req.</option>
          </select>
        </div>

        {/* ── Result count ─────────────────────────────────────────── */}
        {filtered.length !== JOBS.length && (
          <p className="text-gray-500 text-[12px] mb-3">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* ── Job listings ─────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-[14px]">
            No vacancies match your filters.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleCats.map((c) => {
              const jobs = byCat[c];
              if (!jobs?.length) return null;
              const isOpen = collapsed[c] !== true;

              return (
                <div key={c} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCat(c)}
                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                        {CAT_ICONS[c]} {CAT_LABELS[c]}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-400 rounded-full px-2 py-0.5">
                        {jobs.length}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Jobs list */}
                  {isOpen && (
                    <div className="flex flex-col gap-2 px-3 pb-3">
                      {jobs.map((job, i) => (
                        <ApplyPreScreen
                          key={`${c}-${i}`}
                          waBase={WA_BASE}
                          jobTitle={job.t}
                          source={`vacancies-${c}`}
                          jobId={`${c}-${i}`}
                        >
                          {(openFn) => (
                            <div
                              onClick={openFn}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === "Enter" && openFn()}
                              className="
                                rounded-xl border border-white/[0.07] bg-white/[0.04]
                                hover:bg-white/[0.08] active:scale-[0.99]
                                px-3.5 py-3.5 cursor-pointer transition-all duration-150
                              "
                            >
                              <p className="text-white font-semibold text-[14px] leading-snug mb-2">
                                {job.t}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className={`
                                  text-[11px] font-bold rounded-md px-2 py-0.5
                                  ${job.sm > 0
                                    ? "bg-emerald-400/10 text-emerald-400"
                                    : "bg-white/[0.05] text-gray-500"}
                                `}>
                                  {job.s}
                                </span>
                                <span className="text-gray-400 text-[12px]">📍 {job.l}</span>
                              </div>
                              {job.b.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mb-2.5">
                                  {job.b.map((badge) => (
                                    <span
                                      key={badge}
                                      className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${BADGE_META[badge].color}`}
                                    >
                                      {BADGE_META[badge].label}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-black">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Apply on WhatsApp
                              </div>
                            </div>
                          )}
                        </ApplyPreScreen>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer note ──────────────────────────────────────────── */}
        <p className="text-center text-gray-600 text-[11px] mt-8">
          All positions require EU citizenship and existing BSN · +31 649 210 631
        </p>

      </div>
    </div>
  );
}
