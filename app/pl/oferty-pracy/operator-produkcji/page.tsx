// /pl/oferty-pracy/operator-produkcji — Operator Produkcji Spożywczej
// Polskojęzyczna wersja /apply/food-production

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Operator Produkcji Spożywczej — Praca w Holandii | AgencyCheck",
  description:
    "Praca w produkcji spożywczej w Holandii. Szybkie zatrudnienie, legalna umowa, start w ciągu tygodnia. Aplikuj przez WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/pl/oferty-pracy/operator-produkcji",
    languages: {
      "en":        "https://agencycheck.io/apply/food-production",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/operator-produkcji",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/operator-productie-alimentara",
      "x-default": "https://agencycheck.io/apply/food-production",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Operator Produkcji Spożywczej (Holandia)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Operator Produkcji Spożywczej",
  description:    "Praca na linii produkcyjnej w zakładzie spożywczym w Holandii. Szybkie zatrudnienie przez partnera agencji. Legalna umowa, start w ciągu tygodnia. Wymagane prawo do pracy w UE.",
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
  pageUrl:        "/pl/oferty-pracy/operator-produkcji",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Cześć, chcę aplikować na: Operator Produkcji Spożywczej (Holandia)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Jak aplikować?",
    a: "Kliknij 'Aplikuj przez WhatsApp' — otworzy się wiadomość do nas. Odpowiadamy w ciągu 24 godzin i omawiamy następne kroki.",
  },
  {
    q: "Czy wymagane jest doświadczenie w produkcji?",
    a: "Nie. Wiele stanowisk jest dla osób bez doświadczenia. Szkolenie jest zapewniane na miejscu przez pracodawcę.",
  },
  {
    q: "Kiedy mogę zacząć?",
    a: "Zazwyczaj możliwy jest start w ciągu tygodnia od kontaktu, jeśli dokumenty są w porządku.",
  },
  {
    q: "Czy zakwaterowanie jest zapewnione?",
    a: "Zależy od lokalizacji zakładu. Skontaktuj się z nami przez WhatsApp, a przekażemy aktualne informacje.",
  },
  {
    q: "Czy muszę znać holenderski?",
    a: "Nie. Podstawowy angielski wystarczy na linii produkcyjnej. Wielu pracowników to Polacy.",
  },
];

export default function OperatorProdukcjiPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Strona główna",                 url: "/pl" },
        { name: "Oferty pracy",                  url: "/pl/oferty-pracy" },
        { name: "Operator Produkcji Spożywczej", url: "/pl/oferty-pracy/operator-produkcji" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Rekrutacja otwarta · Holandia
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Operator Produkcji<br />
          <span className="text-[#22C55E]">Spożywczej</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Holandia</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          Min. stawka+ · Szybkie zatrudnienie · Start w tyg.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start w tyg." },
            { icon: "🏭", label: "Zakład spożywczy" },
            { icon: "📄", label: "Legalna umowa" },
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
              Praca na linii produkcyjnej w zakładzie spożywczym w Holandii.<br />
              <span className="text-gray-300 font-normal">Szybkie zatrudnienie, legalna umowa, start możliwy w ciągu tygodnia.</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Co oferujemy</p>
            <ul className="space-y-3">
              {[
                "Minimalna stawka godzinowa lub wyższa",
                "Szybkie zatrudnienie — start w ciągu tygodnia",
                "Legalna umowa przez partnera agencji",
                "Szkolenie na miejscu zapewnione",
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
                "Podstawowy angielski lub holenderski",
                "Dobra kondycja fizyczna",
                "Dyspozycyjność do pracy zmianowej",
                "Prawo do pracy w UE",
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
            source="food-pl"
            jobId="food-production"
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

      <StickyApplyBar referralMode waBase={WA_BASE} jobTitle={JOB_TITLE} source="food-pl" jobId="food-production" />
    </div>
  );
}
