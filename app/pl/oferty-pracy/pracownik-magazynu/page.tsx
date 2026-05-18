// /pl/oferty-pracy/pracownik-magazynu — Pracownik Magazynu z zakwaterowaniem
// Polskojęzyczna wersja /apply/warehouse

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Pracownik Magazynu z Zakwaterowaniem — Holandia | AgencyCheck",
  description:
    "Praca w magazynie w Holandii z zakwaterowaniem. Picking, packing, sorting. Min. stawka+, natychmiastowy start. Aplikuj przez WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/pl/oferty-pracy/pracownik-magazynu",
    languages: {
      "en":        "https://agencycheck.io/apply/warehouse",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-magazynu",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-depozit",
      "x-default": "https://agencycheck.io/apply/warehouse",
    },
  },
};

const WA_BASE   = "https://wa.me/31613754893";
const JOB_TITLE = "Pracownik Magazynu (Holandia)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Pracownik Magazynu",
  description:    "Praca w magazynie w Holandii — picking, packing, sortowanie. Zakwaterowanie dostępne przez partnera agencji. Min. stawka+. Natychmiastowy start.",
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
  pageUrl:        "/pl/oferty-pracy/pracownik-magazynu",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Cześć, chcę aplikować na: Pracownik Magazynu (Holandia)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Jak aplikować?",
    a: "Kliknij 'Aplikuj przez WhatsApp' — wiadomość otworzy się bezpośrednio. Odpowiadamy w ciągu 24 godzin.",
  },
  {
    q: "Czy zakwaterowanie jest naprawdę zapewnione?",
    a: "Tak — zakwaterowanie jest dostępne przez naszego partnera agencji. Koszt jest odliczany z wynagrodzenia po regulowanej stawce.",
  },
  {
    q: "Co obejmuje praca w magazynie?",
    a: "Typowe zadania to picking zamówień, pakowanie produktów, sortowanie towarów i przemieszczanie towaru. Szczegółowy zakres zależy od lokalizacji.",
  },
  {
    q: "Czy wymagane jest doświadczenie?",
    a: "Nie. Większość stanowisk jest dla osób bez doświadczenia. Ważna jest dyspozycyjność i kondycja fizyczna.",
  },
  {
    q: "Czy muszę znać holenderski?",
    a: "Nie. Podstawowy angielski wystarczy. Wielu pracowników to Polacy, Rumuni i obywatele innych krajów UE.",
  },
  {
    q: "Jakie dokumenty są potrzebne?",
    a: "Paszport UE lub dokument potwierdzający prawo do pracy w Holandii. Szczegóły potwierdzimy przy kontakcie.",
  },
];

export default function PracownikMagazynuPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Strona główna",        url: "/pl" },
        { name: "Oferty pracy",         url: "/pl/oferty-pracy" },
        { name: "Pracownik Magazynu",   url: "/pl/oferty-pracy/pracownik-magazynu" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Rekrutacja otwarta · Holandia
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Pracownik Magazynu<br />
          <span className="text-[#22C55E]">z Zakwaterowaniem</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Holandia</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          Min. stawka+ · Zakwaterowanie wliczone · Start od zaraz
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "🏠", label: "Zakwaterowanie" },
            { icon: "📦", label: "Magazyn" },
            { icon: "⚡", label: "Start od zaraz" },
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
              Praca w magazynie w Holandii — picking, packing, sortowanie.<br />
              <span className="text-gray-300 font-normal">Stabilne godziny, zakwaterowanie przez agencję.</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Co oferujemy</p>
            <ul className="space-y-3">
              {[
                "Min. stawka godzinowa lub wyższa",
                "Zakwaterowanie dostępne przez agencję",
                "Natychmiastowy start",
                "Praca zmianowa — różne godziny",
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
                "Podstawowy angielski",
                "Dobra kondycja fizyczna",
                "Dyspozycyjność i punktualność",
                "Prawo do pracy w UE",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-400/10 border border-purple-400/25 rounded-xl px-5 py-4">
            <p className="text-purple-300 font-semibold mb-1">🏠 Zakwaterowanie wliczone</p>
            <p className="text-gray-300 text-sm">
              Zakwaterowanie jest organizowane przez naszego partnera agencji. Koszt jest odliczany po stałej regulowanej stawce — nie musisz szukać mieszkania przed startem.
            </p>
          </div>
        </div>

        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            referralMode waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="warehouse-pl"
            jobId="warehouse"
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

      <StickyApplyBar referralMode waBase={WA_BASE} jobTitle={JOB_TITLE} source="warehouse-pl" jobId="warehouse" />
    </div>
  );
}
