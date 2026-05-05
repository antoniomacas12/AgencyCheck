// /pl/oferty-pracy — Wszystkie aktualne oferty pracy
// Polskojęzyczna wersja /apply

import Link from "next/link";
import type { Metadata } from "next";
import { WA_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Oferty Pracy w Holandii — Aktualne Ogłoszenia | AgencyCheck",
  description:
    "Aktualne oferty pracy w Holandii — kierowca CE, pracownik produkcji, magazynier. Aplikuj bezpośrednio przez WhatsApp. Bez pośredników, szybki proces.",
  alternates: {
    canonical: "https://agencycheck.io/pl/oferty-pracy",
    languages: {
      "en":        "https://agencycheck.io/apply",
      "pl":        "https://agencycheck.io/pl/oferty-pracy",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca",
      "x-default": "https://agencycheck.io/apply",
    },
  },
};

const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const JOBS = [
  {
    href:       "/pl/oferty-pracy/kierowca-ce",
    emoji:      "🚛",
    title:      "Kierowca CE",
    location:   "Dordrecht, Holandia",
    pay:        "€150+/dzień",
    type:       "Bezpośrednia umowa",
    tag:        "Bezpośrednia umowa",
    tagColor:   "text-blue-400 border-blue-400/30",
    applicants: 18,
  },
  {
    href:       "/pl/oferty-pracy/operator-produkcji",
    emoji:      "🏭",
    title:      "Operator Produkcji Spożywczej",
    location:   "Holandia",
    pay:        "Min. stawka+",
    type:       "Szybkie zatrudnienie",
    tag:        "Szybkie zatrudnienie",
    tagColor:   "text-emerald-400 border-emerald-400/30",
    applicants: 34,
  },
  {
    href:       "/pl/oferty-pracy/pracownik-produkcji-maastricht",
    emoji:      "🍪",
    title:      "Pracownik Produkcji / Picker",
    location:   "Okolice Maastricht",
    pay:        "€16,12/godz.",
    type:       "Natychmiastowy start",
    tag:        "€16,12/godz.",
    tagColor:   "text-amber-400 border-amber-400/30",
    applicants: 27,
  },
  {
    href:       "/pl/oferty-pracy/pracownik-magazynu",
    emoji:      "📦",
    title:      "Pracownik Magazynu",
    location:   "Holandia",
    pay:        "Min. stawka+",
    type:       "Zakwaterowanie zapewnione",
    tag:        "Zakwaterowanie",
    tagColor:   "text-purple-400 border-purple-400/30",
    applicants: 41,
  },
];

export default function PlOffertyPracyPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          {JOBS.length} oferty pracy · Holandia
        </div>

        {/* Hero */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-white">
          Praca w Holandii<br />
          <span className="text-[#22C55E]">— aktualne oferty</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg">
          Prawdziwe oferty, szybki proces. Aplikuj przez WhatsApp — bez długich formularzy,
          bez pośredników. Odpowiadamy w ciągu 24h.
        </p>

        <div className="border-t border-white/10 mb-8" />

        {/* Job cards */}
        <div className="flex flex-col gap-4">
          {JOBS.map((job) => (
            <Link key={job.href} href={job.href}>
              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#22C55E]/30 active:scale-[0.99] transition-all duration-150 px-5 py-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{job.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-[15px] leading-snug">{job.title}</p>
                      <p className="text-gray-500 text-[12px] mt-0.5">📍 {job.location}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-1 ${job.tagColor} bg-transparent`}>
                    {job.tag}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-gray-400 mb-4">
                  <span className="text-[#22C55E] font-bold">{job.pay}</span>
                  <span className="text-gray-500">{job.type}</span>
                  <span className="ml-auto text-gray-600">{job.applicants} aplikacji w tym tyg.</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-gray-500">Aplikuj bezpośrednio · Bez opłat</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#22C55E] group-hover:text-green-400 transition-colors">
                    Zobacz &amp; Aplikuj
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Not sure */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
          <p className="text-white font-bold text-[14px] mb-1">Nie wiesz, która oferta jest dla Ciebie?</p>
          <p className="text-gray-500 text-[13px] mb-4">
            Napisz do nas — dopasujemy Cię do odpowiedniej oferty na podstawie Twojego doświadczenia.
          </p>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent("Cześć, szukam pracy w Holandii. Możesz mi pomóc znaleźć odpowiednie stanowisko?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#22C55E]/15 hover:bg-[#22C55E]/25 border border-[#22C55E]/30 text-[#22C55E] font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all duration-150"
          >
            Napisz na WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600 text-[11px]">
          <span>✓ Aplikacja bezpłatna</span>
          <span>✓ Brak ukrytych opłat</span>
          <span>✓ Odpowiedź w 24h</span>
          <span>✓ Umowy unijne</span>
        </div>

      </div>
    </div>
  );
}
