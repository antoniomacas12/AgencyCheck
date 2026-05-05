// /ro/oferte-de-munca/lucrator-depozit — Lucrător Depozit cu cazare
// Versiunea în română a /apply/warehouse

import type { Metadata } from "next";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Lucrător Depozit cu Cazare — Olanda | AgencyCheck",
  description:
    "Muncă în depozit în Olanda cu cazare inclusă. Picking, packing, sortare. Salariu min.+, start imediat. Aplică prin WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/ro/oferte-de-munca/lucrator-depozit",
    languages: {
      "en":        "https://agencycheck.io/apply/warehouse",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-magazynu",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-depozit",
      "x-default": "https://agencycheck.io/apply/warehouse",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Lucrător Depozit (Olanda)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Lucrător Depozit",
  description:    "Muncă în depozit în Olanda — picking, packing, sortare și logistică. Cazare disponibilă prin partener agenție. Salariu min.+. Start imediat posibil.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      13.27,
  maxSalary:      15,
  salaryUnit:     "HOUR",
  pageUrl:        "/ro/oferte-de-munca/lucrator-depozit",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Bună, vreau să aplic pentru: Lucrător Depozit (Olanda)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Cum aplic?",
    a: "Apasă 'Aplică prin WhatsApp' — mesajul se deschide direct. Răspundem în 24 de ore și discutăm disponibilitatea și pașii următori.",
  },
  {
    q: "Cazarea este cu adevărat inclusă?",
    a: "Da — cazarea este disponibilă prin partenerul nostru agenție. Costul se reține din salariu la o rată reglementată.",
  },
  {
    q: "Ce presupune munca în depozit?",
    a: "Sarcini tipice: picking comenzi, ambalare produse, sortare mărfuri, gestionare stoc. Detaliile depind de locație.",
  },
  {
    q: "Am nevoie de experiență?",
    a: "Nu. Majoritatea posturilor sunt pentru persoane fără experiență. Contează disponibilitatea și condiția fizică.",
  },
  {
    q: "Trebuie să știu olandeză?",
    a: "Nu. Engleza de bază este suficientă. Mulți colegi sunt din România, Polonia și alte țări UE.",
  },
  {
    q: "Ce documente sunt necesare?",
    a: "Pașaport UE sau document care atestă dreptul de muncă în Olanda. Detaliile complete se confirmă la contact.",
  },
];

export default function LucratorDepozitPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Acasă",             url: "/ro" },
        { name: "Oferte de muncă",   url: "/ro/oferte-de-munca" },
        { name: "Lucrător Depozit",  url: "/ro/oferte-de-munca/lucrator-depozit" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Recrutare activă · Olanda
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Lucrător Depozit<br />
          <span className="text-[#22C55E]">cu Cazare</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Olanda</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          Salariu min.+ · Cazare inclusă · Start imediat
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "🏠", label: "Cazare inclusă" },
            { icon: "📦", label: "Depozit" },
            { icon: "⚡", label: "Start imediat" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mb-10" />

        <div className="space-y-10 text-sm text-gray-300 leading-relaxed">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Postul</p>
            <p className="text-white text-base font-medium">
              Muncă în depozit în Olanda — picking, packing, sortare.<br />
              <span className="text-gray-300 font-normal">Program stabil, cazare organizată prin agenție.</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Ce oferim</p>
            <ul className="space-y-3">
              {[
                "Salariu minim sau mai mare",
                "Cazare disponibilă prin partener agenție",
                "Start imediat",
                "Muncă în ture — program variat",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Cerințe</p>
            <ul className="space-y-3">
              {[
                "Engleză de bază",
                "Condiție fizică bună",
                "Punctualitate și seriozitate",
                "Drept de muncă în UE",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-400/10 border border-purple-400/25 rounded-xl px-5 py-4">
            <p className="text-purple-300 font-semibold mb-1">🏠 Cazare inclusă</p>
            <p className="text-gray-300 text-sm">
              Cazarea este organizată prin partenerul nostru agenție. Costul se reține la o rată fixă reglementată — nu trebuie să cauți locuință înainte de start.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(`Bună, vreau să aplic pentru: ${JOB_TITLE} [src:warehouse-ro]`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-green-900/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            Aplică prin WhatsApp
          </a>
          <p className="text-center text-gray-500 text-xs mt-3">Cel mai rapid mod · Răspuns în 24h</p>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Întrebări frecvente</p>
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="border border-white/10 rounded-xl px-5 py-4">
              <p className="text-white font-semibold text-sm mb-2">{item.q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/ro/oferte-de-munca" className="text-[#22C55E] text-sm font-semibold hover:underline">
            ← Toate ofertele de muncă
          </a>
        </div>
      </div>
    </div>
  );
}
