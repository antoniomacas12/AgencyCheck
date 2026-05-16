// /ro/oferte-de-munca — Toate ofertele de muncă active
// Versiunea în română a /apply

import Link from "next/link";
import type { Metadata } from "next";
import { WA_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Oferte de Muncă în Olanda — Locuri Disponibile | AgencyCheck",
  description:
    "Oferte de muncă active în Olanda — șofer CE, operator producție, lucrător depozit. Aplică direct prin WhatsApp. Fără intermediari, proces rapid.",
  alternates: {
    canonical: "https://agencycheck.io/ro/oferte-de-munca",
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
    href:       "/ro/oferte-de-munca/sofer-ce",
    emoji:      "🚛",
    title:      "Șofer CE",
    location:   "Dordrecht, Olanda",
    pay:        "€150+/zi",
    type:       "Contract direct",
    tag:        "Contract direct",
    tagColor:   "text-blue-400 border-blue-400/30",
    applicants: 18,
  },
  {
    href:       "/ro/oferte-de-munca/operator-productie-alimentara",
    emoji:      "🏭",
    title:      "Operator Producție Alimentară",
    location:   "Olanda",
    pay:        "Salariu min.+",
    type:       "Angajare rapidă",
    tag:        "Angajare rapidă",
    tagColor:   "text-emerald-400 border-emerald-400/30",
    applicants: 34,
  },
  {
    href:       "/ro/oferte-de-munca/lucrator-productie-maastricht",
    emoji:      "🍪",
    title:      "Lucrător Producție / Picker",
    location:   "Lângă Maastricht",
    pay:        "€16,12/oră",
    type:       "Start imediat",
    tag:        "€16,12/oră",
    tagColor:   "text-amber-400 border-amber-400/30",
    applicants: 27,
  },
  {
    href:       "/ro/oferte-de-munca/lucrator-depozit",
    emoji:      "📦",
    title:      "Lucrător Depozit",
    location:   "Olanda",
    pay:        "Salariu min.+",
    type:       "Cazare inclusă",
    tag:        "Cazare inclusă",
    tagColor:   "text-purple-400 border-purple-400/30",
    applicants: 41,
  },
];

export default function RoOferteDeMuncaPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          {JOBS.length} locuri disponibile · Olanda
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-white">
          Muncă în Olanda<br />
          <span className="text-[#22C55E]">— oferte active</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg">
          Joburi reale, proces rapid. Aplică prin WhatsApp — fără formulare lungi,
          fără intermediari. Răspundem în 24h.
        </p>

        <div className="border-t border-white/10 mb-8" />

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
                  <span className="ml-auto text-gray-600">{job.applicants} aplicații săpt. aceasta</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-gray-500">Aplică direct · Fără taxe</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#22C55E] group-hover:text-green-400 transition-colors">
                    Vezi &amp; Aplică
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
          <p className="text-white font-bold text-[14px] mb-1">Nu știi ce post ți se potrivește?</p>
          <p className="text-gray-500 text-[13px]">
            Alege orice post de mai sus și apasă <strong className="text-gray-300">Aplică prin WhatsApp</strong> — răspunde la 2 întrebări de eligibilitate și te vom ajuta să găsești jobul potrivit.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600 text-[11px]">
          <span>✓ Aplicare gratuită</span>
          <span>✓ Fără taxe ascunse</span>
          <span>✓ Răspuns în 24h</span>
          <span>✓ Contracte UE</span>
        </div>

      </div>
    </div>
  );
}
