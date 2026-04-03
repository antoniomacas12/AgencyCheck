/**
 * agencyI18nStrings.ts
 *
 * Inline UI strings for localized agency, city, and agency+city pages.
 * Polish (pl) and Romanian (ro) only — English versions live in the
 * main English routes.
 *
 * Rules:
 *  - UI chrome (headings, labels, CTAs) is translated here.
 *  - Worker comments and reviews are NEVER translated — they stay in the
 *    original language and are labelled "Original comment" / "Opinia oryginalna".
 *  - Add interpolation placeholders with {agency}, {city}, {count}.
 */

export type I18nLocale = "pl" | "ro";

interface AgencyPageStrings {
  // Meta
  metaTitleSuffix:     string; // "opinie" / "pareri"
  metaDescTemplate:    string; // uses {agency} {city}
  agencyMetaDesc:      (agency: string) => string;
  // Headings
  h1Suffix:            string;
  h1SubTitle:          string;
  // Section headings
  workerReviews:       string;
  workerComments:      string;
  workerCommentsCity:  (agency: string, city: string) => string;
  citiesMentioned:     string;
  relatedAgencies:     string;
  otherCities:         string;
  // Labels
  unverifiedBadge:     string;
  workerBadge:         string;
  originalComment:     string; // label on untranslated comment
  housingLabel:        string;
  salaryLabel:         string;
  transportLabel:      string;
  managementLabel:     string;
  contractLabel:       string;
  overallRating:       string;
  reviewsCount:        (n: number) => string;
  // CTA
  ctaHeading:          (agency: string, city?: string) => string;
  ctaBody:             string;
  ctaButton:           string;
  // Footer nav
  backToAgency:        (agency: string) => string;
  backToCity:          (city: string) => string;
  allAgencies:         string;
  viewReview:          string;
  noCommentsYet:       string;
  noCommentsBody:      string;
  // Trust note
  trustNote:           string;
  // Worker housing info
  housingAvailable:    string;
  housingNotProvided:  string;
  housingUnknown:      string;
  // Recommend
  recommended:         string;
  notRecommended:      string;
}

interface CityPageStrings {
  h1Template:          (city: string) => string;
  intro:               (city: string) => string;
  agenciesMentioned:   (city: string) => string;
  recentComments:      (city: string) => string;
  trustNote:           string;
  originalComment:     string;
  noData:              string;
  viewAgencyCity:      (agency: string, city: string) => string;
  ctaHeading:          (city: string) => string;
  ctaBody:             string;
  ctaButton:           string;
  allCities:           string;
  breadcrumbCities:    string;
  metaTitleTemplate:   (city: string) => string;
  metaDescTemplate:    (city: string) => string;
}

// ─── Polish strings ────────────────────────────────────────────────────────────

const pl: AgencyPageStrings = {
  metaTitleSuffix:     "opinie",
  agencyMetaDesc:      (a) =>
    `${a} opinie pracowników – zakwaterowanie, zarobki, warunki pracy. Prawdziwe doświadczenia pracowników w Holandii zebrane przez AgencyCheck.`,
  metaDescTemplate:    "{agency} {city} opinie – zakwaterowanie, zarobki, doświadczenia pracowników w Holandii.",
  h1Suffix:            "opinie",
  h1SubTitle:          "Zarobki · Zakwaterowanie · Doświadczenia pracowników",
  workerReviews:       "Opinie pracowników",
  workerComments:      "Komentarze pracowników",
  workerCommentsCity:  (a, c) => `Co mówią pracownicy o ${a} w ${c}`,
  citiesMentioned:     "Miasta wymieniane przez pracowników",
  relatedAgencies:     "Podobne agencje",
  otherCities:         "Inne miasta",
  unverifiedBadge:     "Niezweryfikowana – zgłoszona przez pracowników",
  workerBadge:         "Opinia pracownika",
  originalComment:     "Komentarz w oryginalnym języku",
  housingLabel:        "Zakwaterowanie",
  salaryLabel:         "Zarobki",
  transportLabel:      "Transport",
  managementLabel:     "Zarządzanie",
  contractLabel:       "Jasność umowy",
  overallRating:       "Ocena ogólna",
  reviewsCount:        (n) => n === 1 ? "1 opinia" : n < 5 ? `${n} opinie` : `${n} opinii`,
  ctaHeading:          (a, c) => c ? `Pracowałeś/aś w ${a} w ${c}?` : `Pracowałeś/aś w ${a}?`,
  ctaBody:             "Podziel się swoją opinią – pomóż innym pracownikom podjąć właściwą decyzję.",
  ctaButton:           "Dodaj opinię →",
  backToAgency:        (a) => `← Pełny profil ${a}`,
  backToCity:          (c) => `Wszystkie agencje w ${c} →`,
  allAgencies:         "Wszystkie agencje",
  viewReview:          "Zobacz opinię →",
  noCommentsYet:       "Brak komentarzy dla tego miasta",
  noCommentsBody:      "Bądź pierwszą osobą, która podzieli się swoją opinią.",
  trustNote:           "Na podstawie opinii zgłoszonych przez pracowników w AgencyCheck. Więcej opinii może pojawić się z czasem.",
  housingAvailable:    "Zakwaterowanie dostępne",
  housingNotProvided:  "Brak zakwaterowania",
  housingUnknown:      "Status zakwaterowania nieznany",
  recommended:         "Polecam",
  notRecommended:      "Nie polecam",
};

const plCity: CityPageStrings = {
  h1Template:         (c) => `Praca w ${c} – agencje pracy, opinie pracowników`,
  intro:              (c) => `Sprawdź opinie pracowników o agencjach pracy w ${c}. Dowiedz się, co mówią pracownicy o zakwaterowaniu, zarobkach i warunkach pracy.`,
  agenciesMentioned:  (c) => `Agencje wymieniane przez pracowników w ${c}`,
  recentComments:     (c) => `Ostatnie komentarze pracowników z ${c}`,
  trustNote:          "Na podstawie komentarzy zgłoszonych przez pracowników w AgencyCheck.",
  originalComment:    "Komentarz w oryginalnym języku",
  noData:             "Brak danych dla tego miasta.",
  viewAgencyCity:     (a, c) => `${a} w ${c} →`,
  ctaHeading:         (c) => `Pracujesz lub pracowałeś/aś w ${c}?`,
  ctaBody:            "Podziel się swoją opinią i pomóż innym pracownikom.",
  ctaButton:          "Dodaj opinię →",
  allCities:          "Wszystkie miasta",
  breadcrumbCities:   "Miasta",
  metaTitleTemplate:  (c) => `Praca w ${c} – agencje, opinie, zakwaterowanie`,
  metaDescTemplate:   (c) => `Opinie pracowników o agencjach pracy w ${c}. Zakwaterowanie, zarobki i doświadczenia pracownicze zgromadzone przez AgencyCheck.`,
};

// ─── Romanian strings ─────────────────────────────────────────────────────────

const ro: AgencyPageStrings = {
  metaTitleSuffix:     "pareri",
  agencyMetaDesc:      (a) =>
    `${a} pareri muncitori – cazare, salariu, condiții de muncă. Experiențe reale ale muncitorilor în Olanda colectate de AgencyCheck.`,
  metaDescTemplate:    "{agency} {city} pareri – cazare, salariu, experiențe muncitori în Olanda.",
  h1Suffix:            "pareri",
  h1SubTitle:          "Salariu · Cazare · Experiențe muncitori",
  workerReviews:       "Recenzii muncitori",
  workerComments:      "Comentarii muncitori",
  workerCommentsCity:  (a, c) => `Ce spun muncitorii despre ${a} în ${c}`,
  citiesMentioned:     "Orașe menționate de muncitori",
  relatedAgencies:     "Agenții similare",
  otherCities:         "Alte orașe",
  unverifiedBadge:     "Neverificat – raportat de muncitori",
  workerBadge:         "Recenzie muncitor",
  originalComment:     "Comentariu în limba originală",
  housingLabel:        "Cazare",
  salaryLabel:         "Salariu",
  transportLabel:      "Transport",
  managementLabel:     "Management",
  contractLabel:       "Claritate contract",
  overallRating:       "Rating general",
  reviewsCount:        (n) => n === 1 ? "1 recenzie" : `${n} recenzii`,
  ctaHeading:          (a, c) => c ? `Ai lucrat la ${a} în ${c}?` : `Ai lucrat la ${a}?`,
  ctaBody:             "Împărtășește-ți experiența – ajuți alți muncitori să ia decizii informate.",
  ctaButton:           "Adaugă recenzia →",
  backToAgency:        (a) => `← Profil complet ${a}`,
  backToCity:          (c) => `Toate agențiile din ${c} →`,
  allAgencies:         "Toate agențiile",
  viewReview:          "Vezi recenzia →",
  noCommentsYet:       "Fără comentarii pentru acest oraș",
  noCommentsBody:      "Fii primul care împărtășește experiența sa.",
  trustNote:           "Bazat pe comentarii trimise de muncitori pe AgencyCheck. Mai multe experiențe pot fi adăugate în timp.",
  housingAvailable:    "Cazare disponibilă",
  housingNotProvided:  "Cazare nepusă la dispoziție",
  housingUnknown:      "Status cazare necunoscut",
  recommended:         "Recomandat",
  notRecommended:      "Nu recomand",
};

const roCity: CityPageStrings = {
  h1Template:         (c) => `Munca în ${c} – agenții de muncă, recenzii muncitori`,
  intro:              (c) => `Citește recenziile muncitorilor despre agențiile de muncă din ${c}. Află ce spun muncitorii despre cazare, salariu și condițiile de lucru.`,
  agenciesMentioned:  (c) => `Agenții menționate de muncitori în ${c}`,
  recentComments:     (c) => `Comentarii recente ale muncitorilor din ${c}`,
  trustNote:          "Bazat pe comentarii trimise de muncitori pe AgencyCheck.",
  originalComment:    "Comentariu în limba originală",
  noData:             "Nu există date pentru acest oraș.",
  viewAgencyCity:     (a, c) => `${a} în ${c} →`,
  ctaHeading:         (c) => `Lucrezi sau ai lucrat în ${c}?`,
  ctaBody:            "Împărtășește-ți experiența și ajuți alți muncitori.",
  ctaButton:          "Adaugă recenzia →",
  allCities:          "Toate orașele",
  breadcrumbCities:   "Orașe",
  metaTitleTemplate:  (c) => `Munca în ${c} – agenții, recenzii, cazare`,
  metaDescTemplate:   (c) => `Recenzii muncitori despre agențiile de muncă din ${c}. Cazare, salariu și experiențe muncitorești colectate de AgencyCheck.`,
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const AGENCY_STRINGS: Record<I18nLocale, AgencyPageStrings> = { pl, ro };
export const CITY_STRINGS:   Record<I18nLocale, CityPageStrings>   = { pl: plCity, ro: roCity };

/** Localised agency path prefix: /pl/agencje or /ro/agentii */
export const AGENCY_BASE: Record<I18nLocale, string> = {
  pl: "/pl/agencje",
  ro: "/ro/agentii",
};

/** Localised city path prefix: /pl/miasta or /ro/orase */
export const CITY_BASE: Record<I18nLocale, string> = {
  pl: "/pl/miasta",
  ro: "/ro/orase",
};

/** English equivalents for hreflang */
export const EN_AGENCY_BASE = "/agencies";
export const EN_CITY_BASE   = "/cities";

/** Star rendering helper */
export function renderStars(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
