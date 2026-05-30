import type { Metadata } from "next";
import Link from "next/link";
import StickyApplyBar from "@/components/StickyApplyBar";
import GateLink      from "@/components/GateLink";
import { WA_NUMBER } from "@/lib/whatsapp";

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Praca w Holandii z Zakwaterowaniem — Magazyn, Produkcja | AgencyCheck",
  description:
    "100+ ofert pracy w Holandii z zakwaterowaniem. Magazyn, produkcja, logistyka. Mieszkanie blisko pracy, bez opłat. Aplikuj przez WhatsApp — odzywamy się tego samego dnia.",
  keywords: [
    "praca holandia z zakwaterowaniem", "praca w Holandii z mieszkaniem",
    "oferty pracy Holandia zakwaterowanie", "praca magazyn holandia zakwaterowanie",
    "praca holandia nocleg", "praca dla polakow holandia zakwaterowanie",
  ],
  alternates: {
    canonical: "https://agencycheck.io/praca-holandia-zakwaterowanie",
    languages: {
      "pl":        "https://agencycheck.io/praca-holandia-zakwaterowanie",
      "en":        "https://agencycheck.io/jobs-with-accommodation",
      "ro":        "https://agencycheck.io/ro/locuri-de-munca-cu-cazare",
      "x-default": "https://agencycheck.io/jobs-with-accommodation",
    },
  },
  openGraph: {
    title: "Praca w Holandii z Zakwaterowaniem | AgencyCheck",
    description: "100+ ofert pracy z mieszkaniem. Magazyn, produkcja. Bez opłat. Aplikuj przez WhatsApp.",
  },
};

// ─── Real jobs — warehouse + production, all with agency housing available ─────
const JOBS = [
  {
    slug:  "warehouse-worker-amsterdam-tilburg-den-bosch",
    title: "Pracownik Magazynowy",
    location: "Amsterdam / Tilburg / Den Bosch",
    salary: "€14,71/h brutto",
    category: "Magazyn",
    desc: "Praca w dużym centrum dystrybucyjnym. Kompletacja i pakowanie. Zakwaterowanie organizowane przez agencję blisko miejsca pracy.",
  },
  {
    slug:  "order-picker-ept-driver-food-freezer-waalwijk",
    title: "Order Picker / Kierowca EPT (chłodnia)",
    location: "Waalwijk",
    salary: "€14,98/h brutto",
    category: "Magazyn",
    desc: "Praca w chłodzonej hali. EPT wymagane. Zakwaterowanie w pobliżu Waalwijk — bez własnego transportu.",
  },
  {
    slug:  "production-packing-worker-nieuwegein",
    title: "Pracownik Produkcji i Pakowania",
    location: "Nieuwegein",
    salary: "€16,43/h brutto",
    category: "Produkcja",
    desc: "Praca na linii produkcyjnej i przy pakowaniu. Wyższa stawka. Zakwaterowanie w regionie Utrecht/Nieuwegein.",
  },
  {
    slug:  "allround-warehouse-eindhoven",
    title: "Pracownik Magazynowy All-round",
    location: "Helmond / Deurne / Eindhoven",
    salary: "€14,71/h brutto",
    category: "Magazyn",
    desc: "Różnorodne zadania — kompletacja, inwentaryzacja, przyjęcie towaru. Zakwaterowanie w okolicach Eindhoven.",
  },
  {
    slug:  "assembly-mechanic-oisterwijk",
    title: "Monter / Mechanik Montażowy",
    location: "Oisterwijk",
    salary: "€450–€550/tydzień brutto",
    category: "Produkcja",
    desc: "Montaż komponentów na liniach produkcyjnych. Praca zmianowa. Zakwaterowanie dostępne dla osób spoza regionu.",
  },
  {
    slug:  "order-picker-ept-experience-fresh-netherlands",
    title: "Order Picker — Dział Świeży",
    location: "Holandia",
    salary: "€14,98/h brutto",
    category: "Magazyn",
    desc: "Praca w dziale świeżym dużej sieci dystrybucji. Wymagane doświadczenie z EPT. Zakwaterowanie zorganizowane.",
  },
] as const;

const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const SOURCE  = "pl-zakwaterowanie";

function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function PracaZakwaterowanie() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wide text-emerald-400">
              Zakwaterowanie w cenie
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Praca w Holandii{" "}
            <span className="text-emerald-400">z zakwaterowaniem</span>{" "}
            — magazyn i produkcja
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
            Ponad 100 aktualnych ofert z mieszkaniem blisko pracy. Bez opłat dla pracownika.
            Aplikuj przez WhatsApp i odzywamy się{" "}
            <strong className="text-white">tego samego dnia</strong>.
          </p>

          <GateLink
            source={SOURCE}
            jobTitle="Praca w Holandii z zakwaterowaniem"
            jobId="pl-zakwaterowanie"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>

          <p className="text-gray-500 text-[12px] mt-3">
            Bezpłatne · Bez rejestracji · Odpowiadamy tego samego dnia
          </p>

          {/* Housing info strip */}
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            <p className="text-amber-300 text-[13px] font-semibold mb-1">🏠 Jak działa zakwaterowanie?</p>
            <p className="text-gray-400 text-[12px] leading-relaxed">
              Agencja organizuje dom pracowniczy blisko miejsca pracy. Koszt to ok.{" "}
              <strong className="text-white">€95–€113/tydzień</strong> odliczane od wynagrodzenia.
              Certyfikacja SNF — standardy holenderskie.
            </p>
          </div>
        </div>
      </section>

      {/* ── JOB CARDS ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl mb-1">Oferty z zakwaterowaniem</h2>
          <p className="text-gray-400 text-sm mb-6">Wszystkie poniższe oferty — zakwaterowanie dostępne przez agencję.</p>

          <div className="space-y-3">
            {JOBS.map((job) => (
              <div key={job.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-blue-400/10 text-blue-300 border border-blue-400/20 rounded-full px-2 py-0.5">
                    {job.category}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 rounded-full px-2 py-0.5">
                    🏠 zakwaterowanie
                  </span>
                </div>
                <h3 className="text-white font-bold text-[15px] leading-snug mb-1">{job.title}</h3>
                <p className="text-gray-400 text-[12px] mb-3">📍 {job.location} &nbsp;·&nbsp; 💶 {job.salary}</p>
                <p className="text-gray-300 text-[13px] leading-relaxed mb-4">{job.desc}</p>
                <GateLink
                  source={SOURCE}
                  jobTitle={job.title}
                  jobId={job.slug}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-bold text-[14px] py-3 rounded-xl transition-all duration-150"
                >
                  <WAIcon className="w-4 h-4" />
                  Aplikuj na WhatsApp
                </GateLink>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-[12px] mt-5">
            Więcej ofert?{" "}
            <Link href="/apply" className="text-emerald-400 underline">
              Zobacz wszystkie stanowiska →
            </Link>
          </p>
        </div>
      </section>

      {/* ── 3 STEPS ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f1f14] border-y border-white/[0.06] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-8">Jak to działa?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "1", title: "Wybierz ofertę", body: "Kliknij «Aplikuj przez WhatsApp» pod ofertą, która Cię interesuje." },
              { n: "2", title: "Wyślij zgłoszenie", body: "WhatsApp otworzy się z gotową wiadomością. Potwierdź swoje dane i dostępność." },
              { n: "3", title: "Start i zakwaterowanie", body: "Odzywamy się tego samego dnia. Potwierdzamy miejsce pracy i zakwaterowanie." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-400 font-black text-[14px]">{s.n}</span>
                </div>
                <h3 className="text-white font-bold text-[14px] mb-1">{s.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Dlaczego przez nas?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "🆓", title: "Bez opłat dla pracownika", body: "Pośrednictwo jest całkowicie bezpłatne. Agencja pokrywa nasze koszty." },
              { icon: "🏠", title: "Zakwaterowanie w cenie", body: "Dom pracowniczy blisko pracy od pierwszego dnia. Standard SNF — certyfikowany." },
              { icon: "✅", title: "Sprawdzone agencje", body: "Tylko certyfikowane agencje (SNA/ABU). Żadnych agencji z negatywnymi opiniami pracowników." },
              { icon: "⚡", title: "Szybka odpowiedź", body: "Tego samego dnia potwierdzamy dostępność stanowiska i termin startu." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="text-white font-bold text-[14px] mb-1">{b.title}</h3>
                <p className="text-gray-400 text-[12px] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] px-4 py-10 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl text-center mb-7">Często zadawane pytania</h2>
          <div className="space-y-3">
            {[
              { q: "Ile kosztuje zakwaterowanie?", a: "Zakwaterowanie kosztuje ok. €95–€113/tydzień (certyfikowany standard SNF 2024). Jest odliczane bezpośrednio od wynagrodzenia — bez zaliczek ani kaucji." },
              { q: "Czy muszę płacić za pośrednictwo?", a: "Nie. Usługa jest bezpłatna dla pracownika. Agencja płaci nam za skuteczne pośrednictwo." },
              { q: "Czy potrzebuję znajomości języka?", a: "Nie. Większość ofert nie wymaga holenderskiego — wystarczy komunikatywny angielski lub nawet tylko chęci do pracy." },
              { q: "Jak szybko mogę zacząć?", a: "Zazwyczaj start jest możliwy w ciągu 7–14 dni od kontaktu. Wiele stanowisk ma start natychmiastowy." },
              { q: "Co jeśli nie mam BSN?", a: "Agencja pomoże Ci wyrobić numer BSN po przyjeździe. Brak BSN nie blokuje zatrudnienia." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white font-bold text-[14px] mb-2">{faq.q}</p>
                <p className="text-gray-400 text-[13px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1f14] px-4 py-10 border-t border-[#25D366]/10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-white font-black text-xl mb-3">Szukasz pracy z zakwaterowaniem?</h2>
          <p className="text-gray-400 text-sm mb-6">Napisz do nas — pomożemy znaleźć ofertę z mieszkaniem.</p>
          <GateLink
            source={SOURCE}
            jobTitle="Praca w Holandii z zakwaterowaniem"
            jobId="pl-zakwaterowanie"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>
          <div className="mt-6 text-[12px] text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="mailto:hello@agencycheck.io" className="hover:text-gray-400">hello@agencycheck.io</a>
            <Link href="/pl/praca-z-zakwaterowaniem" className="hover:text-gray-400">Więcej ofert z zakwaterowaniem</Link>
            <Link href="/pl" className="hover:text-gray-400">AgencyCheck po polsku</Link>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile apply bar ─────────────────────────────────────────── */}
      <StickyApplyBar
        waBase={WA_BASE}
        jobTitle="Praca w Holandii z zakwaterowaniem"
        source={SOURCE}
        jobId="pl-zakwaterowanie"
        referralMode={true}
      />
      <div className="h-24 md:hidden" />
    </>
  );
}
