// /pl/oferty-pracy/kierowca-ce — Kierowca CE, Dordrecht
// Polskojęzyczna wersja /apply/reachtruck

import type { Metadata } from "next";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import StickyApplyBar from "@/components/StickyApplyBar";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Kierowca CE — Praca w Dordrecht, Holandia | AgencyCheck",
  description:
    "Praca kierowcy CE w Holandii. Bezpośrednia umowa, €150+/dzień, trasy Holandia–Francja–Niemcy. Codziennie do domu. Aplikuj przez WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/pl/oferty-pracy/kierowca-ce",
    languages: {
      "en":        "https://agencycheck.io/apply/reachtruck",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/kierowca-ce",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/sofer-ce",
      "x-default": "https://agencycheck.io/apply/reachtruck",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Kierowca CE (Dordrecht, Holandia)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Kierowca CE",
  description:    "Praca kierowcy CE na trasach międzynarodowych Holandia–Francja–Niemcy. Codzienny powrót do domu. Bezpośrednia umowa z pracodawcą, bez pośredników. Od €150/dzień. Wymagane prawo jazdy CE + Kod 95.",
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
  pageUrl:        "/pl/oferty-pracy/kierowca-ce",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Cześć, chcę aplikować na: Kierowca CE (Dordrecht, Holandia)")}`,
});

const FAQ_ITEMS = [
  {
    q: "Jak aplikować?",
    a: "Kliknij przycisk 'Aplikuj przez WhatsApp' — otworzy się wiadomość bezpośrednio do nas. Zazwyczaj odpowiadamy w ciągu 24 godzin.",
  },
  {
    q: "Czy muszę znać holenderski?",
    a: "Nie. Wystarczy podstawowy angielski. Wielu naszych kierowców pochodzi z Polski i doskonale radzi sobie w pracy.",
  },
  {
    q: "Czy zakwaterowanie jest zapewnione?",
    a: "Zakwaterowanie nie jest wliczone w tę ofertę. Kandydaci muszą mieszkać lub być gotowi do relokacji w okolicach Dordrecht.",
  },
  {
    q: "Jakie dokumenty są potrzebne?",
    a: "Prawo jazdy CE, certyfikat Kod 95 oraz dokument potwierdzający prawo do pracy w UE (paszport unijny lub ważne zezwolenie).",
  },
  {
    q: "Kiedy można zacząć pracę?",
    a: "Jeśli dokumenty są w porządku, zazwyczaj możemy zorganizować start w ciągu 1–2 tygodni.",
  },
  {
    q: "Czy to bezpośrednia umowa?",
    a: "Tak — bezpośrednia umowa z pracodawcą. Żadnych pośredników, żadnych opłat agencyjnych.",
  },
];

export default function KierowcaCEPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Strona główna",  url: "/pl" },
        { name: "Oferty pracy",  url: "/pl/oferty-pracy" },
        { name: "Kierowca CE",   url: "/pl/oferty-pracy/kierowca-ce" },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Rekrutacja otwarta · Holandia
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Kierowca CE<br />
          <span className="text-[#22C55E]">Dordrecht, Holandia</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Dordrecht, Holandia</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-8 tracking-wide uppercase">
          €150+/dzień · Bezpośrednia umowa · Codzienny powrót do domu
        </p>

        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "🏠", label: "Dom każdy dzień" },
            { icon: "🚛", label: "Trasy CE" },
            { icon: "📄", label: "Bezpośrednia umowa" },
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
              Kierowca CE na trasach Holandia–Francja–Niemcy.<br />
              <span className="text-gray-300 font-normal">Codzienny powrót do domu, bezpośrednia umowa z pracodawcą.</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Co oferujemy</p>
            <ul className="space-y-3">
              {[
                "€150+/dzień — od pierwszego dnia",
                "Codzienny powrót do domu",
                "Bezpośrednia umowa — brak agencji",
                "Trasy: Holandia, Francja, Niemcy",
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
                "Prawo jazdy CE + Kod 95",
                "Doświadczenie w jeździe ciężarówką",
                "Podstawowy angielski",
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

        {/* CTA desktop */}
        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            referralMode waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="reachtruck-pl"
            jobId="reachtruck"
          />
          <p className="text-center text-gray-500 text-xs mt-3">Najszybszy sposób · Odpowiedź w 24h</p>
        </div>

        {/* FAQ */}
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

      <StickyApplyBar referralMode waBase={WA_BASE} jobTitle={JOB_TITLE} source="reachtruck-pl" jobId="reachtruck" />
    </div>
  );
}
