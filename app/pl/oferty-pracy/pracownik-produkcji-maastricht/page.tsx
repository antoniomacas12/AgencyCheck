// /pl/oferty-pracy/pracownik-produkcji-maastricht
// Polskojęzyczna wersja /apply/production-worker-maastricht

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Pracownik Produkcji / Picker — Fabryka Ciastek Maastricht | AgencyCheck",
  description:
    "Praca w fabryce ciastek koło Maastricht. €16,12/godz., dodatki zmianowe, natychmiastowy start. Wymagany własny transport. Aplikuj przez WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/pl/oferty-pracy/pracownik-produkcji-maastricht",
    languages: {
      "en":        "https://agencycheck.io/apply/production-worker-maastricht",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-produkcji-maastricht",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-productie-maastricht",
      "x-default": "https://agencycheck.io/apply/production-worker-maastricht",
    },
  },
};

const WA_BASE   = "https://wa.me/31613754893";
const JOB_TITLE = "Pracownik Produkcji / Picker (okolice Maastricht)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Pracownik Produkcji / Picker",
  description:    "Praca przy produkcji i pickowaniu w fabryce ciastek koło Maastricht. €16,12/godz. + dodatki zmianowe. System 2 lub 3 zmian. Natychmiastowy start. Wymagany własny transport.",
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
  pageUrl:        "/pl/oferty-pracy/pracownik-produkcji-maastricht",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Cześć, chcę aplikować na: Pracownik Produkcji / Picker (okolice Maastricht)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Jak aplikować?",
    a: "Kliknij 'Aplikuj przez WhatsApp' — wiadomość otworzy się bezpośrednio do nas. Odpowiadamy w ciągu 24 godzin.",
  },
  {
    q: "Czy potrzebuję doświadczenia?",
    a: "Nie. Praca nie wymaga doświadczenia — szkolenie jest zapewniane na miejscu. Liczy się dyspozycyjność i kondycja fizyczna.",
  },
  {
    q: "Czy muszę mieć samochód?",
    a: "Tak — własny transport jest wymagany. Fabryka nie jest dostępna komunikacją miejską.",
  },
  {
    q: "Jakie zmiany są dostępne?",
    a: "System 2 lub 3 zmian. Szczegółowe godziny ustalamy przy aplikacji.",
  },
  {
    q: "Czy zakwaterowanie jest zapewnione?",
    a: "Zakwaterowanie nie jest wliczone. Kandydaci muszą mieć mieszkanie w okolicach Maastricht.",
  },
  {
    q: "Jakie dokumenty są potrzebne?",
    a: "Paszport UE lub dokument uprawniający do pracy w Holandii. Szczegóły przy kontakcie.",
  },
];

export default function PracownikProdukcjiMaastrichtPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Strona główna",                          url: "/pl" },
        { name: "Oferty pracy",                           url: "/pl/oferty-pracy" },
        { name: "Pracownik Produkcji — Maastricht",       url: "/pl/oferty-pracy/pracownik-produkcji-maastricht" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Rekrutacja otwarta · Okolice Maastricht
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Pracownik Produkcji<br />
          <span className="text-[#22C55E]">/ Picker</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Okolice Maastricht, Holandia</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          €16,12/godz. · Natychmiastowy start · Fabryka ciastek
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start od zaraz" },
            { icon: "🏭", label: "Fabryka ciastek" },
            { icon: "🚗", label: "Własny transport" },
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
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Stanowisko</p>
            <p className="text-white text-base font-medium">
              Praca przy produkcji i pickowaniu w fabryce ciastek koło Maastricht.<br />
              <span className="text-gray-300 font-normal">Stabilne środowisko pracy, system zmianowy, natychmiastowy start.</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Co oferujemy</p>
            <ul className="space-y-3">
              {[
                "€16,12/godz. — dodatki zmianowe na górę",
                "System 2 lub 3 zmian",
                "Start natychmiastowy",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Wymagania</p>
            <ul className="space-y-3">
              {[
                "Angielski lub holenderski — podstawowa komunikacja",
                "Własny transport do pracy",
                "Dobra kondycja fizyczna",
                "Prawo do pracy w UE",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl px-5 py-4">
            <p className="text-amber-300 font-semibold mb-1">⚠ Ważne</p>
            <p className="text-gray-300 text-sm">Własny transport jest wymagany — fabryka nie jest dostępna komunikacją miejską.</p>
          </div>
        </div>

        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="maastricht-pl"
            jobId="production-worker-maastricht"
          />
          <p className="text-center text-gray-500 text-xs mt-3">Najszybszy sposób · Odpowiedź w 24h</p>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Najczęstsze pytania</p>
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="border border-white/10 rounded-xl px-5 py-4">
              <p className="text-white font-semibold text-sm mb-2">{item.q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/pl/oferty-pracy" className="text-[#22C55E] text-sm font-semibold hover:underline">
            ← Wszystkie oferty pracy
          </a>
        </div>
      </div>

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="maastricht-pl" jobId="production-worker-maastricht" />
    </div>
  );
}
