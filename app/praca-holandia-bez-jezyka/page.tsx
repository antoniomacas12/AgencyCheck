import type { Metadata } from "next";
import Link from "next/link";
import StickyApplyBar from "@/components/StickyApplyBar";
import GateLink      from "@/components/GateLink";
import { WA_NUMBER } from "@/lib/whatsapp";

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Oferty Pracy Holandia bez Języka — Magazyn i Produkcja | AgencyCheck",
  description:
    "Praca w Holandii bez znajomości holenderskiego. Magazyn, produkcja, logistyka. Bez opłat, zakwaterowanie dostępne. Aplikuj przez WhatsApp — odpowiedź tego samego dnia.",
  keywords: [
    "praca holandia bez języka", "oferty pracy Holandia bez języka",
    "praca w Holandii bez holenderskiego", "praca holandia bez jezyka polskiego",
    "praca za granica bez języka holandia", "magazyn holandia bez języka",
  ],
  alternates: {
    canonical: "https://agencycheck.io/praca-holandia-bez-jezyka",
    languages: {
      "pl":        "https://agencycheck.io/praca-holandia-bez-jezyka",
      "en":        "https://agencycheck.io/work-netherlands-warehouse",
      "x-default": "https://agencycheck.io/work-netherlands-warehouse",
    },
  },
  openGraph: {
    title: "Praca w Holandii bez Języka — Magazyn, Produkcja | AgencyCheck",
    description: "100+ ofert bez wymagań językowych. Zakwaterowanie dostępne. Aplikuj przez WhatsApp.",
  },
};

// ─── Real jobs — no language badge (eng-free), warehouse + production ──────────
const JOBS = [
  {
    slug:  "warehouse-worker-amsterdam-tilburg-den-bosch",
    title: "Pracownik Magazynowy",
    location: "Amsterdam / Tilburg / Den Bosch",
    salary: "€14,71/h brutto",
    lang: "Bez języka",
    desc: "Praca w dużym centrum dystrybucyjnym. Kompletacja i pakowanie. Instrukcje podawane wizualnie — język nie jest wymagany.",
  },
  {
    slug:  "allround-warehouse-eindhoven",
    title: "Pracownik Magazynowy All-round",
    location: "Helmond / Eindhoven",
    salary: "€14,71/h brutto",
    lang: "Bez języka",
    desc: "Różnorodne zadania magazynowe — kompletacja, pakowanie, przyjęcie towaru. Wystarczy podstawowe porozumiewanie się.",
  },
  {
    slug:  "order-picker-ept-driver-food-freezer-waalwijk",
    title: "Order Picker / Kierowca EPT",
    location: "Waalwijk",
    salary: "€14,98/h brutto",
    lang: "Bez języka",
    desc: "Praca w chłodzonej hali. Obsługa EPT. Komunikacja minimalna — praca indywidualna przy skanerem.",
  },
  {
    slug:  "flexible-production-employee",
    title: "Pracownik Produkcji (elastyczny)",
    location: "Holandia",
    salary: "Wg stawek CAO",
    lang: "Bez języka",
    desc: "Praca na różnych liniach produkcyjnych. Elastyczne godziny. Brak wymagań językowych — instrukcje wizualne i gestami.",
  },
  {
    slug:  "production-packing-worker-nieuwegein",
    title: "Pracownik Produkcji i Pakowania",
    location: "Nieuwegein",
    salary: "€16,43/h brutto",
    lang: "Bez języka",
    desc: "Pakowanie produktów na linii. Praca rutynowa i szybka do nauczenia. Wyższa stawka godzinowa.",
  },
  {
    slug:  "order-picker-ept-experience-fresh-netherlands",
    title: "Order Picker — Dział Świeży (Fresh)",
    location: "Holandia",
    salary: "€14,98/h brutto",
    lang: "Bez języka",
    desc: "Kompletacja zamówień w dziale świeżym. Praca ze skanerem — bez konieczności mówienia po holendersku.",
  },
] as const;

const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const SOURCE  = "pl-bez-jezyka";

function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function PracaBezJezyka() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-5">
            <span className="text-blue-400 text-[14px]">🗣</span>
            <span className="text-[12px] font-bold uppercase tracking-wide text-blue-400">
              Bez języka holenderskiego
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Oferty pracy Holandia{" "}
            <span className="text-emerald-400">bez języka</span>{" "}
            — magazyn i produkcja
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
            Ponad 100 aktualnych ofert bez wymagań językowych. Wystarczy chęć do pracy.
            Zakwaterowanie dostępne. Aplikuj przez WhatsApp —{" "}
            <strong className="text-white">odzywamy się tego samego dnia</strong>.
          </p>

          <GateLink
            source={SOURCE}
            jobTitle="Praca w Holandii bez języka"
            jobId="pl-bez-jezyka"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>

          <p className="text-gray-500 text-[12px] mt-3">
            Bezpłatne · Bez rejestracji · Odpowiadamy tego samego dnia
          </p>

          {/* Language badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Bez holenderskiego", "Bez angielskiego", "Zakwaterowanie", "Bez doświadczenia"].map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-gray-300">
                <span className="text-emerald-400">✓</span> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB CARDS ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0c1524] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-black text-xl mb-1">Oferty bez wymagań językowych</h2>
          <p className="text-gray-400 text-sm mb-6">Żadna z poniższych ofert nie wymaga znajomości holenderskiego.</p>

          <div className="space-y-3">
            {JOBS.map((job) => (
              <div key={job.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-blue-400/10 text-blue-300 border border-blue-400/20 rounded-full px-2 py-0.5">
                    🗣 {job.lang}
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
              { n: "2", title: "Wyślij zgłoszenie", body: "Otworzy się WhatsApp z gotową wiadomością. Wyślij ją i potwierdź swoje dane." },
              { n: "3", title: "Odzywamy się", body: "Oddzwaniamy tego samego dnia. Potwierdzamy termin startu i szczegóły." },
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
              { icon: "🏠", title: "Zakwaterowanie w cenie", body: "Dom pracowniczy blisko pracy od pierwszego dnia. Standard SNF." },
              { icon: "✅", title: "Sprawdzone oferty", body: "Tylko certyfikowane agencje pracy w Holandii — żadnych agencji z negatywnymi opiniami." },
              { icon: "⚡", title: "Szybka odpowiedź", body: "Tego samego dnia odpowiadamy i potwierdzamy dostępność stanowiska." },
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
              { q: "Naprawdę nie trzeba znać holenderskiego?", a: "Tak. Większość prac magazynowych i produkcyjnych opiera się na skanerach i wizualnych instrukcjach. Język holenderski nie jest wymagany — wystarczy podstawowe porozumiewanie się po angielsku lub polsku." },
              { q: "Czy muszę płacić za pośrednictwo?", a: "Nie. Praca przez AgencyCheck jest w 100% bezpłatna dla pracownika." },
              { q: "Jak działa zakwaterowanie?", a: "Agencja organizuje dom pracowniczy blisko miejsca pracy. Koszt to ok. €95–€113/tydzień, odliczany od wynagrodzenia." },
              { q: "Jak szybko mogę zacząć pracować?", a: "Zazwyczaj start jest możliwy w ciągu 7–14 dni od kontaktu. Wiele stanowisk ma start natychmiastowy." },
              { q: "Czy potrzebuję BSN?", a: "Jeśli nie masz jeszcze BSN, agencja pomoże Ci go wyrobić po przyjeździe. Brak BSN nie blokuje zatrudnienia." },
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
          <h2 className="text-white font-black text-xl mb-3">Gotowy do aplikowania?</h2>
          <p className="text-gray-400 text-sm mb-6">Język nie jest przeszkodą. Napisz do nas — odpowiemy tego samego dnia.</p>
          <GateLink
            source={SOURCE}
            jobTitle="Praca w Holandii bez języka"
            jobId="pl-bez-jezyka"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-black text-[16px] px-8 py-4 rounded-2xl transition-all duration-150"
            style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
          >
            <WAIcon />
            Aplikuj przez WhatsApp →
          </GateLink>
          <div className="mt-6 text-[12px] text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="mailto:hello@agencycheck.io" className="hover:text-gray-400">hello@agencycheck.io</a>
            <Link href="/praca-holandia-magazyn" className="hover:text-gray-400">Praca w magazynie</Link>
            <Link href="/pl" className="hover:text-gray-400">AgencyCheck po polsku</Link>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile apply bar ─────────────────────────────────────────── */}
      <StickyApplyBar
        waBase={WA_BASE}
        jobTitle="Praca w Holandii bez języka"
        source={SOURCE}
        jobId="pl-bez-jezyka"
        referralMode={true}
      />
      <div className="h-24 md:hidden" />
    </>
  );
}
