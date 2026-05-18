// /ro/oferte-de-munca/operator-productie-alimentara
// Versiunea în română a /apply/food-production

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Operator Producție Alimentară — Muncă în Olanda | AgencyCheck",
  description:
    "Muncă în producție alimentară în Olanda. Angajare rapidă, contract legal, start în termen de o săptămână. Aplică prin WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/ro/oferte-de-munca/operator-productie-alimentara",
    languages: {
      "en":        "https://agencycheck.io/apply/food-production",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/operator-produkcji",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/operator-productie-alimentara",
      "x-default": "https://agencycheck.io/apply/food-production",
    },
  },
};

const WA_BASE   = "https://wa.me/31613754893";
const JOB_TITLE = "Operator Producție Alimentară (Olanda)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Operator Producție Alimentară",
  description:    "Muncă pe linia de producție în fabrică alimentară în Olanda. Angajare rapidă prin partener agenție. Contract legal, start în termen de o săptămână. Drept de muncă UE obligatoriu.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      14.71,
  maxSalary:      16,
  salaryUnit:     "HOUR",
  pageUrl:        "/ro/oferte-de-munca/operator-productie-alimentara",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Bună, vreau să aplic pentru: Operator Producție Alimentară (Olanda)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Cum aplic?",
    a: "Apasă 'Aplică prin WhatsApp' — se deschide mesajul direct. Răspundem în 24 de ore și discutăm pașii următori.",
  },
  {
    q: "Am nevoie de experiență?",
    a: "Nu. Multe posturi sunt pentru persoane fără experiență. Training-ul este asigurat la locul de muncă.",
  },
  {
    q: "Când pot începe?",
    a: "De obicei în termen de o săptămână dacă actele sunt în regulă.",
  },
  {
    q: "Cazarea este inclusă?",
    a: "Depinde de locație. Contactează-ne pe WhatsApp pentru informații actualizate.",
  },
  {
    q: "Trebuie să știu olandeză?",
    a: "Nu. Engleza de bază este suficientă pe linia de producție. Mulți colegi sunt români.",
  },
];

export default function OperatorProductieAlimentaraPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Acasă",                          url: "/ro" },
        { name: "Oferte de muncă",                url: "/ro/oferte-de-munca" },
        { name: "Operator Producție Alimentară",  url: "/ro/oferte-de-munca/operator-productie-alimentara" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Recrutare activă · Olanda
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Operator Producție<br />
          <span className="text-[#22C55E]">Alimentară</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Olanda</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          Salariu min.+ · Angajare rapidă · Start în săpt.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start rapid" },
            { icon: "🏭", label: "Fabrică alimentară" },
            { icon: "📄", label: "Contract legal" },
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
              Muncă pe linia de producție în fabrică alimentară din Olanda.<br />
              <span className="text-gray-300 font-normal">Angajare rapidă, contract legal, start posibil în termen de o săptămână.</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Ce oferim</p>
            <ul className="space-y-3">
              {[
                "Salariul minim sau mai mare",
                "Angajare rapidă — start în termen de o săptămână",
                "Contract legal prin partener agenție",
                "Training la locul de muncă",
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
                "Engleză sau olandeză de bază",
                "Condiție fizică bună",
                "Disponibilitate pentru ture",
                "Drept de muncă în UE",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            referralMode waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="food-ro"
            jobId="food-production"
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

      <StickyApplyBar referralMode waBase={WA_BASE} jobTitle={JOB_TITLE} source="food-ro" jobId="food-production" />
    </div>
  );
}
