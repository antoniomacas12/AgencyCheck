// /ro/oferte-de-munca/sofer-ce — Șofer CE, Dordrecht
// Versiunea în română a /apply/reachtruck

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Șofer CE — Muncă în Dordrecht, Olanda | AgencyCheck",
  description:
    "Loc de muncă șofer CE în Olanda. Contract direct, €150+/zi, rute Olanda–Franța–Germania. Acasă în fiecare zi. Aplică prin WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/ro/oferte-de-munca/sofer-ce",
    languages: {
      "en":        "https://agencycheck.io/apply/reachtruck",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/kierowca-ce",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/sofer-ce",
      "x-default": "https://agencycheck.io/apply/reachtruck",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Șofer CE (Dordrecht, Olanda)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Șofer CE",
  description:    "Șofer CE pentru rute internaționale Olanda–Franța–Germania. Acasă în fiecare zi. Contract direct cu angajatorul, fără intermediari. De la €150/zi. Permis CE + Codul 95 obligatoriu.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Dordrecht",
  region:         "South Holland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      150,
  maxSalary:      200,
  salaryUnit:     "DAY",
  pageUrl:        "/ro/oferte-de-munca/sofer-ce",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Bună, vreau să aplic pentru: Șofer CE (Dordrecht, Olanda)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Cum aplic?",
    a: "Apasă butonul 'Aplică prin WhatsApp' — se va deschide un mesaj direct către noi. Răspundem de obicei în 24 de ore.",
  },
  {
    q: "Trebuie să știu olandeză?",
    a: "Nu. Engleza de bază este suficientă. Mulți șoferi sunt din România și se descurcă foarte bine.",
  },
  {
    q: "Cazarea este inclusă?",
    a: "Cazarea nu este inclusă în această ofertă. Candidații trebuie să locuiască sau să se poată muta în zona Dordrecht.",
  },
  {
    q: "Ce acte sunt necesare?",
    a: "Permis de conducere CE, certificat Codul 95 și dovada dreptului de muncă în UE (pașaport UE sau permis valabil).",
  },
  {
    q: "Când pot începe?",
    a: "Dacă actele sunt în regulă, putem organiza startul în 1–2 săptămâni.",
  },
  {
    q: "Este contract direct sau prin agenție?",
    a: "Contract direct cu angajatorul — fără intermediari, fără comisioane reținute din salariu.",
  },
];

export default function SoferCEPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Acasă",             url: "/ro" },
        { name: "Oferte de muncă",   url: "/ro/oferte-de-munca" },
        { name: "Șofer CE",          url: "/ro/oferte-de-munca/sofer-ce" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Recrutare activă · Olanda
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Șofer CE<br />
          <span className="text-[#22C55E]">Dordrecht, Olanda</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Dordrecht, Olanda</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          €150+/zi · Contract direct · Acasă zilnic
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "🏠", label: "Acasă zilnic" },
            { icon: "🚛", label: "Rute CE" },
            { icon: "📄", label: "Contract direct" },
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
              Șofer CE pe rute internaționale Olanda–Franța–Germania.<br />
              <span className="text-gray-300 font-normal">Acasă în fiecare zi, contract direct cu angajatorul.</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Ce oferim</p>
            <ul className="space-y-3">
              {[
                "€150+/zi — de la prima zi",
                "Acasă în fiecare zi",
                "Contract direct — fără agenție",
                "Rute: Olanda, Franța, Germania",
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
                "Permis CE + Codul 95",
                "Experiență în conducerea de TIR",
                "Engleză de bază",
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
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="reachtruck-ro"
            jobId="reachtruck"
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

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="reachtruck-ro" jobId="reachtruck" />
    </div>
  );
}
