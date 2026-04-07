"use client";

/**
 * HomepageCRO — Conversion-optimised landing page component.
 *
 * Designed for EU workers seeking jobs in the Netherlands.
 * Submit leads to POST /api/leads.
 *
 * Usage in app/page.tsx (or any locale homepage):
 *   import HomepageCRO from "@/components/HomepageCRO";
 *   export default function Page() { return <HomepageCRO locale="en" />; }
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Page locale — used as sourcePage tag for lead attribution */
  locale?: "en" | "pl" | "ro" | "pt";
}

interface FormState {
  fullName:       string;
  phone:          string;
  driversLicense: "yes" | "no" | "";
  currentCountry: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─── Localised copy ───────────────────────────────────────────────────────────

const COPY = {
  en: {
    heroHeadline:    "Work in the Netherlands — simple and clear",
    heroSub:         "Warehouse and logistics jobs with accommodation. See real salary and apply quickly.",
    bullet1:         "Accommodation available",
    bullet2:         "Fast start possible",
    bullet3:         "Clear salary after costs",
    ctaPrimary:      "Apply in 30 seconds",
    formTitle:       "Get job options",
    labelName:       "Your name",
    labelPhone:      "Phone / WhatsApp",
    labelLicense:    "Do you have a driving licence?",
    licenseYes:      "Yes",
    licenseNo:       "No",
    labelLocation:   "Where are you now?",
    locationPlaceholder: "Country or city",
    submitBtn:       "Get job options",
    submitting:      "Sending…",
    successTitle:    "Done — we received your details.",
    successBody:     "Someone will be in touch with job options that match your situation.",
    errorMsg:        "Something went wrong. Please try again or send us a message directly.",
    trust1:          "We help you understand real working conditions in the Netherlands",
    trust2:          "You see what you earn after costs — not just the gross number",
    trust3:          "Apply quickly and get contacted with matching options",
    realityHeadline: "Many job offers show only gross salary.",
    realityBody:     "We focus on what actually matters:",
    realityEmphasis: "what you keep after rent, transport, and insurance.",
    cta2Headline:    "Ready to start working in the Netherlands?",
    cta2Button:      "Apply now",
  },
  pl: {
    heroHeadline:    "Praca w Holandii — prosto i jasno",
    heroSub:         "Praca w magazynie i logistyce z zakwaterowaniem. Sprawdź realne zarobki i aplikuj szybko.",
    bullet1:         "Zakwaterowanie dostępne",
    bullet2:         "Szybki start możliwy",
    bullet3:         "Jasne zarobki po odliczeniach",
    ctaPrimary:      "Aplikuj w 30 sekund",
    formTitle:       "Pobierz opcje pracy",
    labelName:       "Twoje imię i nazwisko",
    labelPhone:      "Telefon / WhatsApp",
    labelLicense:    "Czy masz prawo jazdy?",
    licenseYes:      "Tak",
    licenseNo:       "Nie",
    labelLocation:   "Gdzie teraz jesteś?",
    locationPlaceholder: "Kraj lub miasto",
    submitBtn:       "Pobierz opcje pracy",
    submitting:      "Wysyłanie…",
    successTitle:    "Gotowe — otrzymaliśmy Twoje dane.",
    successBody:     "Skontaktujemy się z Tobą z opcjami pracy dopasowanymi do Twojej sytuacji.",
    errorMsg:        "Coś poszło nie tak. Spróbuj ponownie lub napisz do nas bezpośrednio.",
    trust1:          "Pomagamy zrozumieć realne warunki pracy w Holandii",
    trust2:          "Widzisz co zarabiasz po odliczeniach — nie tylko kwotę brutto",
    trust3:          "Aplikuj szybko i otrzymaj kontakt z dopasowanymi ofertami",
    realityHeadline: "Wiele ofert pracy pokazuje tylko wynagrodzenie brutto.",
    realityBody:     "Skupiamy się na tym, co naprawdę ważne:",
    realityEmphasis: "co zostaje po zapłaceniu za mieszkanie, transport i ubezpieczenie.",
    cta2Headline:    "Gotowy żeby zacząć pracować w Holandii?",
    cta2Button:      "Aplikuj teraz",
  },
  ro: {
    heroHeadline:    "Muncă în Olanda — simplu și clar",
    heroSub:         "Locuri de muncă în depozit și logistică cu cazare. Vezi salariul real și aplică rapid.",
    bullet1:         "Cazare disponibilă",
    bullet2:         "Start rapid posibil",
    bullet3:         "Salariu clar după costuri",
    ctaPrimary:      "Aplică în 30 de secunde",
    formTitle:       "Obțineți opțiuni de muncă",
    labelName:       "Numele tău",
    labelPhone:      "Telefon / WhatsApp",
    labelLicense:    "Ai permis de conducere?",
    licenseYes:      "Da",
    licenseNo:       "Nu",
    labelLocation:   "Unde ești acum?",
    locationPlaceholder: "Țară sau oraș",
    submitBtn:       "Obțineți opțiuni de muncă",
    submitting:      "Se trimite…",
    successTitle:    "Gata — am primit detaliile tale.",
    successBody:     "Cineva te va contacta cu opțiuni de muncă care se potrivesc situației tale.",
    errorMsg:        "Ceva a mers greșit. Încearcă din nou sau trimite-ne un mesaj direct.",
    trust1:          "Te ajutăm să înțelegi condițiile reale de muncă din Olanda",
    trust2:          "Vezi ce câștigi după costuri — nu doar suma brută",
    trust3:          "Aplică rapid și ești contactat cu opțiuni potrivite",
    realityHeadline: "Multe oferte de muncă arată doar salariul brut.",
    realityBody:     "Ne concentrăm pe ce contează cu adevărat:",
    realityEmphasis: "ce îți rămâne după chirie, transport și asigurare.",
    cta2Headline:    "Gata să începi să lucrezi în Olanda?",
    cta2Button:      "Aplică acum",
  },
  pt: {
    heroHeadline:    "Trabalho na Holanda — simples e claro",
    heroSub:         "Empregos em armazém e logística com alojamento. Veja o salário real e candidate-se rapidamente.",
    bullet1:         "Alojamento disponível",
    bullet2:         "Início rápido possível",
    bullet3:         "Salário claro após custos",
    ctaPrimary:      "Candidatar em 30 segundos",
    formTitle:       "Obter opções de emprego",
    labelName:       "O seu nome",
    labelPhone:      "Telefone / WhatsApp",
    labelLicense:    "Tem carta de condução?",
    licenseYes:      "Sim",
    licenseNo:       "Não",
    labelLocation:   "Onde está agora?",
    locationPlaceholder: "País ou cidade",
    submitBtn:       "Obter opções de emprego",
    submitting:      "A enviar…",
    successTitle:    "Concluído — recebemos os seus dados.",
    successBody:     "Alguém entrará em contacto com opções de emprego que se adequam à sua situação.",
    errorMsg:        "Algo correu mal. Tente novamente ou envie-nos uma mensagem diretamente.",
    trust1:          "Ajudamo-lo a compreender as condições reais de trabalho na Holanda",
    trust2:          "Vê o que ganha após custos — não apenas o valor bruto",
    trust3:          "Candidate-se rapidamente e seja contactado com opções adequadas",
    realityHeadline: "Muitas ofertas de emprego mostram apenas o salário bruto.",
    realityBody:     "Focamo-nos no que realmente importa:",
    realityEmphasis: "o que fica depois de renda, transporte e seguro.",
    cta2Headline:    "Pronto para começar a trabalhar na Holanda?",
    cta2Button:      "Candidatar agora",
  },
} as const;

// ─── Scroll helper ────────────────────────────────────────────────────────────

function scrollToForm() {
  document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomepageCRO({ locale = "en" }: Props) {
  const c = COPY[locale];

  const [form, setForm] = useState<FormState>({
    fullName:       "",
    phone:          "",
    driversLicense: "",
    currentCountry: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");

    const sourceLocale = locale === "en" ? "/" : `/${locale}`;

    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fullName:        form.fullName.trim(),
          phone:           form.phone.trim(),
          driversLicense:  form.driversLicense === "yes" ? true
                         : form.driversLicense === "no"  ? false
                         : undefined,
          currentCountry:  form.currentCountry.trim() || undefined,
          sourceType:      "general_apply",
          sourcePage:      sourceLocale,
          housingPreference: "with_housing",
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════════════════
          1 · HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-2xl mx-auto text-center">

          {/* Flag badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-300 mb-7 tracking-wide">
            🇳🇱 Netherlands · Warehouse · Logistics
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
            {c.heroHeadline}
          </h1>

          {/* Subheadline */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            {c.heroSub}
          </p>

          {/* Bullet points */}
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10 text-sm">
            {[c.bullet1, c.bullet2, c.bullet3].map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 font-medium text-gray-200"
              >
                <span className="text-green-400 text-base leading-none">✓</span>
                {b}
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 active:scale-95 text-white text-base sm:text-lg font-black px-8 py-4 rounded-2xl shadow-lg shadow-green-900/30 transition-all duration-150"
          >
            {c.ctaPrimary}
            <span className="text-lg">→</span>
          </button>

          {/* Social proof — no fake numbers, just honest statement */}
          <p className="mt-5 text-xs text-gray-500">
            Free · No commitment · Your data is not shared with third parties
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2 · APPLICATION FORM
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="apply-form"
        className="px-4 py-12 sm:py-16 bg-gray-50 border-b border-gray-100 scroll-mt-16"
      >
        <div className="max-w-lg mx-auto">

          {/* ── ET benefit info block ── */}
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-3">
              <span className="text-sm leading-none">💡</span>
              Important income info
            </div>

            {/* Headline */}
            <h2 className="text-base sm:text-lg font-black text-gray-900 leading-snug mb-2">
              Some agency workers in the Netherlands keep 100+ euros more per week
            </h2>

            {/* Body */}
            <p className="text-sm text-gray-700 leading-relaxed mb-1">
              Many workers do not know about the{" "}
              <span className="font-semibold text-gray-900">ET tax benefit</span>.
              Depending on your situation, it can increase your weekly net income by{" "}
              <span className="font-semibold text-gray-900">100+ euros</span>.
            </p>

            {/* Supporting line */}
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              We help you understand what you really keep after rent, transport and insurance.
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("apply-form-fields");
                el
                  ? el.scrollIntoView({ behavior: "smooth", block: "start" })
                  : document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-amber-200"
            >
              Check job options
              <span className="text-base leading-none">→</span>
            </button>
          </div>

          {status === "success" ? (
            /* ── Success state ── */
            <div className="bg-white rounded-3xl border border-green-200 shadow-sm px-8 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl mx-auto mb-4">
                ✅
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">{c.successTitle}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{c.successBody}</p>
            </div>
          ) : (
            /* ── Form ── */
            <div id="apply-form-fields" className="bg-white rounded-3xl border border-gray-200 shadow-sm px-6 sm:px-8 py-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{c.formTitle}</h2>
              <p className="text-sm text-gray-500 mb-6">Takes about 30 seconds.</p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {c.labelName} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="e.g. Andrei Popescu"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {c.labelPhone} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+48 600 000 000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  />
                </div>

                {/* Driving licence — pill toggle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {c.labelLicense}
                  </label>
                  <div className="flex gap-3">
                    {(["yes", "no"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => update("driversLicense", val)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                          form.driversLicense === val
                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {val === "yes" ? c.licenseYes : c.licenseNo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {c.labelLocation}
                  </label>
                  <input
                    type="text"
                    autoComplete="country-name"
                    value={form.currentCountry}
                    onChange={(e) => update("currentCountry", e.target.value)}
                    placeholder={c.locationPlaceholder}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {c.errorMsg}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading" || !form.fullName.trim() || !form.phone.trim()}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white text-base font-black py-4 rounded-2xl shadow-md shadow-green-200 transition-all duration-150 mt-2"
                >
                  {status === "loading" ? c.submitting : c.submitBtn}
                </button>

                <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                  By submitting you agree that we may contact you about job options.
                  We do not share your data with third parties.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3 · TRUST SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "🔍", text: c.trust1 },
              { icon: "💶", text: c.trust2 },
              { icon: "⚡", text: c.trust3 },
            ].map(({ icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                  {icon}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4 · REALITY SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16 bg-gray-950 text-white">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-3">
            {c.realityHeadline}
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-2">
            {c.realityBody}
          </p>
          <p className="text-xl sm:text-2xl font-black text-white leading-snug">
            {c.realityEmphasis}
          </p>

          {/* Simple salary example — honest, no fake numbers */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left max-w-sm mx-auto">
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">
              Example: warehouse job, 40h/week
            </p>
            {[
              { label: "Gross wage (WML ×40h)",      amount: "+€588", pos: true  },
              { label: "Tax (approx. 10%)",           amount: "−€63",  pos: false },
              { label: "Housing (agency, SNF norm)",  amount: "−€95",  pos: false },
              { label: "Health insurance",            amount: "−€35",  pos: false },
              { label: "Transport",                   amount: "−€25",  pos: false },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-400">{row.label}</span>
                <span className={`text-xs font-bold tabular-nums ${row.pos ? "text-green-400" : "text-red-400"}`}>
                  {row.amount}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/20">
              <span className="text-sm font-bold text-white">You keep</span>
              <span className="text-sm font-black text-green-400">≈ €370 / week</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 mt-3">
            Indicative figures for 2026. Actual amounts depend on your contract.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5 · SECOND CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-14 sm:py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-6">
            {c.cta2Headline}
          </h2>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white text-base sm:text-lg font-black px-8 py-4 rounded-2xl shadow-lg transition-all duration-150"
          >
            {c.cta2Button}
            <span className="text-lg">→</span>
          </button>
          <p className="mt-4 text-xs text-gray-400">Free · No commitment</p>
        </div>
      </section>

    </div>
  );
}
