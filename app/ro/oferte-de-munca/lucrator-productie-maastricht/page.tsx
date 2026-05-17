// /ro/oferte-de-munca/lucrator-productie-maastricht
// Versiunea în română a /apply/production-worker-maastricht

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Lucrător Producție / Picker — Fabrică Biscuiți Maastricht | AgencyCheck",
  description:
    "Muncă în fabrică de biscuiți lângă Maastricht. €16,12/oră + sporuri ture, start imediat. Transport propriu obligatoriu. Aplică prin WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/ro/oferte-de-munca/lucrator-productie-maastricht",
    languages: {
      "en":        "https://agencycheck.io/apply/production-worker-maastricht",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-produkcji-maastricht",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-productie-maastricht",
      "x-default": "https://agencycheck.io/apply/production-worker-maastricht",
    },
  },
};

const WA_BASE   = "https://wa.me/31613754893";
const JOB_TITLE = "Lucrător Producție / Picker (lângă Maastricht)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Lucrător Producție / Picker",
  description:    "Muncă în producție și picking în fabrică de biscuiți lângă Maastricht, Olanda. €16,12/oră + sporuri de tură. Sistem 2 sau 3 ture. Start imediat. Transport propriu obligatoriu.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Maastricht",
  region:         "Limburg",
  country:        "NL",
  currency:       "EUR",
  minSalary:      16.12,
  maxSalary:      18,
  salaryUnit:     "HOUR",
  pageUrl:        "/ro/oferte-de-munca/lucrator-productie-maastricht",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Bună, vreau să aplic pentru: Lucrător Producție / Picker (lângă Maastricht)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Cum aplic?",
    a: "Apasă 'Aplică prin WhatsApp' — mesajul se deschide direct. Răspundem în 24 de ore.",
  },
  {
    q: "Am nevoie de experiență?",
    a: "Nu. Munca nu necesită experiență anterioară. Training-ul este asigurat la fabrică.",
  },
  {
    q: "Am nevoie de mașină?",
    a: "Da — transport propriu obligatoriu. Fabrica nu este accesibilă cu transportul public.",
  },
  {
    q: "Ce ture sunt disponibile?",
    a: "Sistem de 2 sau 3 ture. Programul exact se confirmă la aplicare.",
  },
  {
    q: "Cazarea este inclusă?",
    a: "Nu. Candidații trebuie să aibă locuință în zona Maastricht.",
  },
  {
    q: "Ce documente sunt necesare?",
    a: "Pașaport UE sau document care atestă dreptul de muncă în Olanda. Detalii la contact.",
  },
];

export default function LucratorProductieMaastrichtPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Acasă",                                   url: "/ro" },
        { name: "Oferte de muncă",                         url: "/ro/oferte-de-munca" },
        { name: "Lucrător Producție — Maastricht",         url: "/ro/oferte-de-munca/lucrator-productie-maastricht" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Recrutare activă · Lângă Maastricht
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Lucrător Producție<br />
          <span className="text-[#22C55E]">/ Picker</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Lângă Maastricht, Olanda</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          €16,12/oră · Start imediat · Fabrică biscuiți
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start imediat" },
            { icon: "🏭", label: "Fabrică biscuiți" },
            { icon: "🚗", label: "Transport propriu" },
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
              Muncă în producție și picking în fabrică de biscuiți lângă Maastricht.<br />
              <span className="text-gray-300 font-normal">Mediu stabil, ture regulate, start imediat disponibil.</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Ce oferim</p>
            <ul className="space-y-3">
              {[
                "€16,12/oră — sporuri de tură suplimentare",
                "Sistem 2 sau 3 ture",
                "Start imediat",
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
                "Engleză sau olandeză — comunicare de bază",
                "Transport propriu la locul de muncă",
                "Condiție fizică bună",
                "Drept de muncă în UE",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl px-5 py-4">
            <p className="text-amber-300 font-semibold mb-1">⚠ Important</p>
            <p className="text-gray-300 text-sm">Transport propriu obligatoriu — fabrica nu este accesibilă cu transportul public.</p>
          </div>
        </div>

        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="maastricht-ro"
            jobId="production-worker-maastricht"
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

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="maastricht-ro" jobId="production-worker-maastricht" />
    </div>
  );
}
