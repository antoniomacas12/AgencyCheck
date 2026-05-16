// /ro/oferte-de-munca/lucrator-depozit — Lucrător Depozit cu cazare
// Versiunea în română a /apply/warehouse

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
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

        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="warehouse-ro"
            jobId="warehouse"
          />
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

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="warehouse-ro" jobId="warehouse" />
    </div>
  );
}
