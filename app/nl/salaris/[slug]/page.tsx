import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  JOB_SALARY_DATA,
  parseSalarySlug,
  getJobBySlug,
} from "@/lib/seoData";
import { VERIFIED_AGENCIES } from "@/data/agencies";

export const dynamic = "force-static";

// ─── Dutch job title translations ─────────────────────────────────────────────
const DUTCH_JOB_TITLES: Record<string, string> = {
  "order-picker":           "Orderpicker",
  "forklift-driver":        "Heftruck Bestuurder",
  "warehouse-worker":       "Magazijnmedewerker",
  "production-worker":      "Productiemedewerker",
  "packing-operator":       "Inpakker",
  "truck-driver":           "Vrachtwagenchauffeur",
  "greenhouse-worker":      "Serrewerker",
  "assembly-worker":        "Assemblagemedewerker",
  "cleaning-staff":         "Schoonmaakmedewerker",
  "reach-truck-driver":     "Reachtruck Bestuurder",
  "machine-operator":       "Machineoperator",
  "delivery-driver":        "Bezorger",
  "logistics-operator":     "Logistiek Medewerker",
  "food-production-worker": "Voedingsproductiewerker",
  "meat-processing-worker": "Vleesverwerkingsmedewerker",
  "logistics-coordinator":  "Logistiek Coördinator",
  "quality-inspector":      "Kwaliteitscontroleur",
  "packaging-worker":       "Verpakkingsmedewerker",
  "chemical-plant-worker":  "Chemische Plant Medewerker",
  "construction-worker":    "Bouwvakker",
  "cleaner-industrial":     "Industrieel Schoonmaakmedewerker",
};

// Dutch FAQ data per job type
const DUTCH_FAQS: Record<string, { q: string; a: string }[]> = {
  "order-picker": [
    { q: "Wat verdient een orderpicker netto per week in Nederland in 2026?", a: "Bij het wettelijk minimumloon van €14,71/uur en een 40-urige werkweek is het bruto weekloon €588. Na loonheffing (~10% na heffingskorting) en inhoudingen voor huisvesting (€80–120) en vervoer (€20–30), houd je netto €330–400 per week over. Overwerk en nacht- en weekendtoeslagen verhogen dit bedrag." },
    { q: "Welke uitzendbureaus zoeken orderpickers in Nederland?", a: "De grootste uitzendbureaus voor orderpickers in Nederland zijn OTTO Workforce, Covebo, Randstad, Olympia en Charlie Works. Deze bureaus plaatsen orderpickers bij grote distributiecentra in Venlo, Tilburg, Almere en Rotterdam. Vergelijk op transparantiescore vóórdat je tekent." },
    { q: "Heb ik een rijbewijs nodig als orderpicker?", a: "Nee — orderpickers werken lopend in het magazijn. Sommige sites vragen een elektrische pallettruck- of reachtruck-certificaat, wat het bureau kan regelen. Een rijbewijs is geen vereiste voor standaard orderpick-functies." },
    { q: "Wat houdt het uitzendbureau in van mijn loon als orderpicker?", a: "Legale inhoudingen zijn: huisvesting (max 25% van bruto loon, gemaximeerd op SNF-norm), zorgverzekering, vervoer (alleen werkelijke kosten als het bureau vervoer regelt) en administratiekosten. Vraag altijd een schriftelijk specificatie van de inhoudingen vóór indiensttreding." },
    { q: "Welke ploegentoeslag ontvang ik als orderpicker bij nacht- of weekendwerk?", a: "Onder de ABU CAO ontvangen orderpickers: vroege ploeg (vóór 07:00) +20%, avondploeg +25%, nachtploeg (22:00–06:00) +33%, zaterdag +25%, zondag +50%. Deze toeslagen staan apart vermeld op de loonstrook." },
  ],
  "forklift-driver": [
    { q: "Wat verdient een heftruck bestuurder per uur in Nederland in 2026?", a: "Heftruck bestuurders verdienen in 2026 gemiddeld €16,00 per uur bruto, met een bandbreedte van €14,50 tot €19,00. Reachtruck-operators in highbay-magazijnen verdienen aan de bovenkant van de schaal. Nachttoeslagen van 33% zijn bovenop het basistarief." },
    { q: "Is een VCA-B certificaat verplicht voor heftruck bestuurders bij een uitzendbureau?", a: "Ja — vrijwel alle logistieke klanten in Nederland vereisen een geldig VCA-B (of hoger) certificaat voor bestuurders van aangedreven industriële trucks. Sommige bureaus regelen de training (1–2 dagen, ca. €150) en verrekenen de kosten met het loon. Vraag dit van tevoren na." },
    { q: "Welke uitzendbureaus plaatsen heftruck bestuurders in Nederland?", a: "OTTO Workforce, HOBIJ, Covebo en Randstad zijn de meest actieve bureaus voor heftruckchauffeurs in de Nederlandse logistiek. Ze plaatsen bij grote DC's in Venlo, Rotterdam, Den Haag en Eindhoven. Vergelijk op transparantiescore en SNF-huisvestingsstatus." },
    { q: "Wat is het verschil in loon tussen een heftruckchauffeur en een reachtruck-operator?", a: "Reachtruck-operators die in highbay-rek-systemen werken (8–14 meter hoogte) verdienen doorgaans €1–3 per uur meer dan standaard heftruckchauffeurs. Voor een reachtruck-operator met €17/uur basis resulteert een nachttoeslag van 33% in €22,61/uur." },
    { q: "Kan ik mijn buitenlandse heftruck-certificaat gebruiken in Nederland?", a: "EU/EER heftruck-certificaten worden doorgaans geaccepteerd, maar de klant beslist uiteindelijk. Breng het originele certificaat mee en indien mogelijk een vertaling naar het Engels of Nederlands. Sommige klanten vereisen een proefrit op locatie vóór onbegeleide inzet. Het bureau kan adviseren over specifieke klantvereisten." },
  ],
  "warehouse-worker": [
    { q: "Wat is het minimumloon voor magazijnmedewerkers in Nederland in 2026?", a: "Het wettelijk minimumloon (WML) in 2026 is €14,71 per uur voor werknemers van 21 jaar en ouder bij een 40-urige werkweek. Veel magazijnbureaus betalen tussen €14,71 en €16,50/uur, afhankelijk van de klant, ploeg en CAO. Nachttoeslagen van 25–33% komen hier bovenop." },
    { q: "Bieden magazijnbureaus in Nederland huisvesting?", a: "Ja — veel bureaus die EU-arbeidsmigranten plaatsen bieden huisvesting naast de baan. De beste bureaus — zoals OTTO Workforce en Covebo — zijn SNF-gecertificeerd. Huisvesting kost doorgaans €80–120 per week, ingehouden van het bruto loon. Controleer altijd de SNF-certificaatstatus." },
    { q: "Hoe lang duurt een magazijn-uitzendcontract in Nederland?", a: "Onder de ABU CAO dekt fase A de eerste 78 gewerkte weken. Na fase A heb je fase B met tijdelijke contracten. Na twee jaar of drie contracten heb je recht op een vast contract (fase C). Veel magazijnmedewerkers vernieuwen elk seizoen." },
    { q: "Welke documenten heb ik nodig om te beginnen als magazijnmedewerker?", a: "Je hebt nodig: een geldig EU/EEA paspoort of identiteitskaart, een Nederlands BSN (burger service nummer, te verkrijgen bij de gemeente), en een bankrekening in euro's. Sommige bureaus helpen met BSN-registratie — vraag dit van tevoren." },
    { q: "Kan ik via AgencyCheck magazijnbureaus vergelijken op transparantiescore?", a: "Ja — AgencyCheck's transparantiescore beoordeelt elk bureau op een schaal van 0–100 op basis van: SNF-huisvestingscertificering, CAO-lidmaatschap, kwaliteit van publieke informatie en werknemersreview-signalen. Scores boven 80 wijzen op hoge transparantie; scores onder 50 op beperkte verifieerbare informatie." },
  ],
  "production-worker": [
    { q: "Wat verdient een productiemedewerker in Nederland in 2026?", a: "Productiemedewerkers verdienen in 2026 gemiddeld €15,00 per uur bruto, met een minimum van €14,71 (WML) en een maximum van €16,50/uur voor standaard dagdiensten. Ploegentoeslagen voor vroege, late en nachtdiensten verhogen het effectieve uurtarief met 20–33%." },
    { q: "Welke talen heb ik nodig voor productiewerk in een Nederlandse fabriek?", a: "De meeste productierollen in Nederland vereisen geen Nederlandse taalvaardigheid — operationele instructies worden vaak gegeven in het Engels of via visuele werkinstructies. Sommige veiligheidsbiefings zijn in het Nederlands; bureaus regelen doorgaans tolken voor de onboarding." },
    { q: "Bieden productie-uitzendbureaus huisvesting in Nederland?", a: "Ja — grote productiegerichte bureaus (OTTO Workforce, Covebo, Charlie Works, HOBIJ) bieden SNF-gecertificeerde accommodatie naast productie-opdrachten. Huisvesting kost doorgaans €80–120 per week, ingehouden van het bruto loon. Controleer altijd de SNF-certificaatstatus." },
    { q: "Wat is het verschil tussen een productiemedewerker en een fabrieksmedewerker?", a: "In het Nederlandse uitzendtaalgebruik zijn dit synoniemen. 'Productiemedewerker' of 'fabrieksmedewerker' verwijst naar hetzelfde type werk: assemblage, verpakking of machinebediening op een productielijn. De keuze voor de term verschilt per bureau of opdrachtgever." },
    { q: "Kan ik productiewerk starten zonder ervaring?", a: "Ja — de meeste productierollen in Nederlandse fabrieken zijn instroomfuncties en bieden on-the-job training. De kernvereisten zijn: lichamelijke fitheid, betrouwbaarheid en bereidheid om ploegendiensten te draaien. Voedselproductie kan een basis HACCP-certificaat vereisen, dat bureaus kunnen regelen." },
  ],
  "greenhouse-worker": [
    { q: "Hoeveel verdient een serrewerker in Nederland in 2026?", a: "Serrewerkers verdienen het WML als basis: €14,71/uur voor een 40-urige week in 2026. Weekendtarieven (zaterdag +25%, zondag +50%) onder de CAO Glastuinbouw kunnen het weektotaal aanzienlijk verhogen. Het gemiddelde gerapporteerde bruto bedrag is €14,20–€15,00/uur." },
    { q: "Waar is het meeste serrewerk te vinden in Nederland?", a: "De belangrijkste kasregio's zijn: Westland (tomaten, paprika's, rozen — Zuid-Holland), Greenport Venlo (groenten, kruiden — Limburg), Greenport Boskoop (bomen, struiken — Zuid-Holland) en de Aalsmeer bloemenregio (Noord-Holland). Bureaus in Wateringen, Naaldwijk en Venlo hebben de meeste serreplaatsingen." },
    { q: "Is taal een barrière voor serrewerk in Nederland?", a: "Nee — serrewerk is overwegend fysiek en vereist geen Nederlandse taalvaardigheid. Veel serres in Westland en Limburg werken met Poolse, Roemeense en Bulgaarse medewerkers. Basiskennis van Nederlandse veiligheidstermen is handig maar niet verplicht." },
    { q: "Bieden serre-uitzendbureaus huisvesting in de buurt van de werklocaties?", a: "Ja — bureaus die gespecialiseerd zijn in serreplaatsingen (EG Personeel, Westflex, Ruigrok, NL Jobs) bieden vaak accommodatie dicht bij kassenconcentraties in Westland, Maasdijk en Wateringen. Kwaliteit varieert sterk — controleer altijd de SNF-certificaatstatus." },
    { q: "Kom ik in aanmerking voor de ET-regeling als serrewerker?", a: "EU-onderdanen die tijdelijk in Nederland werken kunnen in aanmerking komen voor de ET-regeling (extraterritoriale kosten), waarbij 30% van het bruto loon belastingvrij kan worden uitbetaald als verblijfskostenvergoeding. Niet alle bureaus passen dit toe — vraag er expliciet naar, want het verhoogt je nettoloon significant." },
  ],
  "truck-driver": [
    { q: "Hoeveel verdient een vrachtwagenchauffeur in Nederland in 2026?", a: "Vrachtwagenchauffeurs verdienen in 2026 tussen €15,00 en €21,00 per uur, gemiddeld circa €17,50/uur. Regionale distributiechauffeurs verdienen €15–€17/uur; internationale CE-chauffeurs €17–€21/uur afhankelijk van route, ladingtype en ADR-vereisten. Nacht- en weekendtoeslagen komen hier bovenop." },
    { q: "Is een CE-rijbewijs en een geldige CPC-kaart verplicht voor vrachtwagenchauffeurs?", a: "Ja — alle vrachtwagenplaatsingen in Nederland vereisen een geldig EU CE-rijbewijs én een geldige CPC-kaart (vakbekwaamheidsbewijs). Controleer of je CPC-kaart niet verlopen is — kaarten zijn 5 jaar geldig en vereisen 35 uur nascholing. Het bureau kan je niet plaatsen zonder beide documenten." },
    { q: "Welke uitzendbureaus plaatsen vrachtwagenchauffeurs in Nederland?", a: "De bureaus met de meeste chauffeurplaatsingen in Nederland zijn gespecialiseerde transportbureaus. Kijk in onze ranglijst naar bureaus met 'truck-driver' als jobFocus. Vergelijk op transparantiescore en controleer of het bureau ABU- of NBBU-lid is." },
    { q: "Kan ik mijn buitenlandse CE-rijbewijs gebruiken in Nederland?", a: "EU/EEA CE-rijbewijzen worden volledig geaccepteerd in Nederland, zonder omzetting, voor maximaal 15 jaar. Je CPC-kaart moet ook geldig zijn. Als je rijbewijs buiten de EU/EEA is afgegeven, moet het worden omgezet naar een Nederlands rijbewijs vóór je als professioneel chauffeur mag werken." },
    { q: "Hoe werkt de digitale tachograaf bij uitzendopdrachten in Nederland?", a: "Alle professionele vrachtwagenchauffeurs in Nederland zijn verplicht een digitale tachograaf te gebruiken conform EU-verordening 561/2006. Bij overtredingen kunnen boetes op de chauffeur worden verhaald. Informeer bij het bureau naar hun beleid bij tachografaovertredingen." },
  ],
  "reach-truck-driver": [
    { q: "Hoeveel verdient een reachtruck bestuurder in Nederland in 2026?", a: "Reachtruck bestuurders verdienen in 2026 tussen €15,00 en €20,00 per uur, gemiddeld circa €17,00/uur. VNA-operators (very narrow aisle) in geautomatiseerde highbay-DC's en operators met meerdere MHE-certificaten verdienen aan de bovenkant. Nachttoeslagen voegen nog eens 33% toe." },
    { q: "Welk certificaat heb ik nodig als reachtruck bestuurder?", a: "Je hebt een specifiek MHE-certificaat (materials handling equipment) voor reachtrucks nodig. Dit is apart van een heftruckcertificaat. Sommige sites vereisen ook een VNA-certificaat voor smalle gangpadapparatuur. Breng je originele certificaat mee; sommige klanten eisen een verificatieritten op locatie." },
    { q: "Welke Nederlandse uitzendbureaus plaatsen reachtruck bestuurders?", a: "OTTO Workforce, Covebo, Randstad en Olympia zijn de meest actieve bureaus voor reachtruck-operators in de Nederlandse logistiek. Ze plaatsen bij grote DC's in Venlo, Tilburg en Almere, die reachtrucks extensief gebruiken." },
    { q: "Hoe hoog zijn de rekken bij de meeste Nederlandse distributiecentra?", a: "Reachtrucks in Nederlandse DC's werken doorgaans op hoogtes van 8–14 meter. Sommige VNA-trucks werken op 12+ meter en vereisen aanvullende certificering. Vraag het bureau naar de maximale rekhoogte op de specifieke locatie vóórdat je accepteert." },
    { q: "Bieden reachtruck bureaus ook huisvesting in Nederland?", a: "Ja — bureaus zoals OTTO Workforce en Covebo bieden SNF-gecertificeerde huisvesting naast logistieke opdrachten in Venlo, Tilburg en andere grote magazijngebieden. Controleer altijd de SNF-certificaatstatus en vraag naar de weekelijkse huisvestingskosten." },
  ],
  "machine-operator": [
    { q: "Wat verdient een machineoperator in Nederland in 2026?", a: "Machineoperators verdienen in 2026 gemiddeld €15,50 per uur, met een range van €14,50 tot €17,00 voor standaard dagdiensten. Ervaren operators die CNC- of geautomatiseerde verpakkingsapparatuur bedienen bij grotere fabrikanten verdienen aan de bovenkant. Ploegentoeslagen verhogen dit verder." },
    { q: "Welk certificaat heb ik nodig als machineoperator in Nederland?", a: "Certificaatvereisten zijn sterk afhankelijk van het machineType en de sector. Voedselproductieoperators hebben doorgaans basis-HACCP-bewustzijnskennis nodig. CNC-operators moeten relevante verspaningstechnische kwalificaties hebben. Chemische en farmaceutische operators hebben sectorspecifieke GMP- of veiligheidsopleidingen nodig." },
    { q: "Welke Nederlandse regio's hebben de meeste vacatures voor machineoperators?", a: "De voornaamste productieregio's met de hoogste vraag naar machineoperators zijn: Noord-Brabant (Eindhoven, Tilburg, Helmond — automotive en elektronica), Limburg (Venlo, Venray — voeding en verpakking), Overijssel (Hengelo, Enschede — engineering) en Zuid-Holland (Rotterdam — chemie en voedingsverwerking)." },
    { q: "Kan ik als machineoperator werken zonder Nederlandse taalvaardigheid?", a: "Voor de meeste instapfuncties is Nederlands niet vereist. Veiligheidsbriefings, SOPs en bedieningshandleidingen bij grotere internationale fabrieken zijn vaak beschikbaar in het Engels. Bij kleinere Nederlandse fabrieken is Nederlands vaker vereist. Vraag het bureau of de klant in het Engels werkt." },
    { q: "Wat zijn GMP-normen en waarom zijn ze van belang voor machineoperators?", a: "GMP (Good Manufacturing Practice) zijn hygiëne- en kwaliteitsnormen voor de voedings- en farmaceutische industrie. Machineoperators in GMP-omgevingen moeten specifieke kleding dragen, geen sieraden dragen en gedocumenteerde reinigingsprocedures volgen. Sommige bureaus verzorgen een GMP-inductietraining." },
  ],
  "assembly-worker": [
    { q: "Hoeveel verdient een assemblagemedewerker in Nederland in 2026?", a: "Assemblagemedewerkers verdienen in 2026 gemiddeld €14,80 per uur, met een range van €14,71 tot €16,50. Ervaren elektronica-assemblagetechnici en automotive assemblagemonteurs bij tier-1 toeleveranciers kunnen tot €18/uur verdienen inclusief ploegentoeslagen." },
    { q: "In welke Nederlandse steden zijn de meeste assemblage-vacatures?", a: "Eindhoven en de omliggende Brainport-regio (Helmond, Son, Veldhoven) heeft de hoogste concentratie elektronica- en high-tech assemblage-vacatures, gedreven door de ASML/Philips-toeleveranciersketen. Tilburg, Venlo en Roosendaal hebben automotive en consumentselektronica-assemblage. Drenthe en Overijssel hebben landbouwmachineassemblage." },
    { q: "Is ESD-bescherming verplicht bij elektronica-assemblage?", a: "Ja — assemblagemedewerkers in de elektronica (met name rond Eindhoven) moeten ESD-beschermingsuitrusting dragen: aardingsbanden, ESD-veilig schoeisel en laboratoriumjassen. Niet-naleving kan dure onderdelen beschadigen en leiden tot contractbeëindiging." },
    { q: "Kan ik als assemblagemedewerker doorgroeien naar een technische functie?", a: "Ja — assemblagewerk in de Nederlandse maakindustrie is een erkend instappad naar technische functies. Medewerkers die nauwkeurigheid en betrouwbaarheid aantonen, worden regelmatig gepromoveerd naar kwaliteitscontroleur, teamleider of procestechieker. Sommige werkgevers bieden gesponsorde opleidingen aan." },
    { q: "Is er stukloonbonus mogelijk bij assemblagewerk in Nederland?", a: "Sommige Nederlandse assemblageklanten bieden stukloonbonussen bovenop het uurtarief, gebaseerd op het overschrijden van het standaard UPH-doel (units per uur). Vraag het bureau naar het doel-UPH, de bonusdrempel en het bonustarief vóór acceptatie." },
  ],
  "delivery-driver": [
    { q: "Hoeveel verdient een bezorger in Nederland in 2026?", a: "Bezorgers verdienen in 2026 gemiddeld €15,50 per uur, met een range van €14,50 tot €17,00 voor standaard bestelwagen-bezorgrollen. E-bike en cargobike-bezorging in steden is doorgaans op of nabij het minimumloon. Nacht- en weekendtoeslagen verhogen dit verder." },
    { q: "Welk rijbewijs heb ik nodig als bezorger in Nederland?", a: "Een geldig categorie B-rijbewijs is het minimum voor de meeste last-mile bezorgrollen. Bestelwagens tot 3,5 ton GVW vallen onder categorie B. Grotere voertuigen (3,5–7,5 ton) vereisen een C1-rijbewijs. Bevestig het exacte voertuigtype bij het bureau." },
    { q: "Welke bezorgbureaus zijn actief in Nederland?", a: "Bureaus die bezorgers plaatsen zijn vaak actief voor PostNL, DHL, DPD, GLS en Coolblue. Controleer de transparantiescore van het bureau en vraag naar de gemiddelde dagelijkse stopcount en of er stukloonbonussen zijn." },
    { q: "Zijn er specifieke regels voor bezorging in Nederlandse stadscentra?", a: "Ja — meerdere gemeenten (Amsterdam, Utrecht, Rotterdam) beperken dieselbestelwagens in stadscentra. Grote e-commercebedrijven schakelen over op elektrische cargobikes en elektrische bestelwagens. Vraag het bureau of de rol EV-gebruik inhoudt en of laadlogistiek door de klant wordt geregeld." },
    { q: "Kan ik als niet-Nederlandse EU-onderdaan werken als bezorger in Nederland?", a: "Ja — EU/EEA-onderdanen kunnen als bezorger werken zonder werkvergunning. Vereisten zijn: een geldig EU-rijbewijs (categorie B minimum), een Nederlands BSN-nummer en een bankrekening in euro's. Sommige bureaus vragen ook een BIBOB-screening voor stadslogistieke rollen in Amsterdam." },
  ],
  "logistics-operator": [
    { q: "Hoeveel verdient een logistiek medewerker in Nederland in 2026?", a: "Logistieke medewerkers verdienen in 2026 gemiddeld €15,20 per uur, met een range van €14,71 tot €17,00. Het rolniveau beïnvloedt de betaling sterk: inbound ontvangst en retouren zijn doorgaans op minimumloonniveau; voorraadbeheer en outbound coordinatie betalen €16–€17/uur." },
    { q: "Welke Nederlandse steden hebben de hoogste vraag naar logistieke medewerkers?", a: "De belangrijkste logistieke werkgelegenheidsconcentraties zijn: Venlo–Roosendaal (Nederland's grootste logistieke zone), Tilburg (grote e-commerce en retail DC's), Waalwijk (schoen- en textiel-DC's), Almere (Flevopolder-DC's) en de Schiphol–Hoofddorp-regio (luchtvracht). Deze zones hebben het hele jaar door duizenden vacatures." },
    { q: "Bieden logistieke uitzendbureaus huisvesting in Nederland?", a: "Huisvesting wordt veel aangeboden door bureaus die actief zijn in Venlo, Tilburg en andere grote logistieke zones, voornamelijk voor EU-arbeidsmigranten die naar Nederland verhuizen. OTTO Workforce, Covebo en Charlie Works zijn de bekendste aanbieders. Controleer altijd de SNF-certificaatstatus." },
    { q: "Wat is het verschil tussen een logistiek medewerker en een magazijnmedewerker?", a: "Een logistiek medewerker heeft doorgaans een bredere taakopvatting met coördinatie, administratie en rapportageverantwoordelijkheden naast fysieke handelingen. Een magazijnmedewerker richt zich op fysieke taken. In de praktijk gebruiken bureaus deze termen soms door elkaar voor instapfuncties." },
    { q: "Welke WMS-systemen worden gebruikt in Nederlandse distributiecentra?", a: "Grote Nederlandse DC's draaien op WMS-platforms zoals SAP, Manhattan en Blue Yonder. Medewerkers die vertrouwdheid aantonen met RF-scanning, WMS-gestuurde piktaken of voorraadtransacties worden vaak geprefereerd voor langere opdrachten en aangeboden tegen hogere tarieven." },
  ],
};

// Fallback FAQs for job types without specific Dutch FAQs
function getDutchFaqs(jobSlug: string, dutchTitle: string): { q: string; a: string }[] {
  if (DUTCH_FAQS[jobSlug]) return DUTCH_FAQS[jobSlug];
  return [
    { q: `Wat verdient een ${dutchTitle} per uur in Nederland in 2026?`, a: `Het salaris voor ${dutchTitle} in Nederland varieert op basis van de cao, de klant en de ploegendienst. Het wettelijk minimumloon is €14,71/uur. Controleer de salarisgegevens in de tabel hierboven voor specifieke cijfers voor jouw functie.` },
    { q: `Welke uitzendbureaus plaatsen ${dutchTitle}s in Nederland?`, a: "De uitzendbureaus in onze ranglijst zijn gerangschikt op transparantiescore. Hogere scores wijzen op betere CAO-naleving, SNF-huisvestingscertificering en meer beschikbare publieke informatie." },
    { q: `Heb ik een certificaat nodig als ${dutchTitle}?`, a: "Dit hangt af van de specifieke functie en de klant. Vraag het bureau expliciet welke certificaten of opleidingen verplicht zijn vóór aanvang." },
    { q: `Bieden uitzendbureaus huisvesting aan ${dutchTitle}s in Nederland?`, a: "Meerdere uitzendbureaus bieden SNF-gecertificeerde huisvesting naast hun vacatures. Controleer of het bureau SNF-gecertificeerd is vóór acceptatie. De kosten bedragen doorgaans €80–120 per week." },
    { q: `Kan ik als ${dutchTitle} werken zonder Nederlandse taalvaardigheid?`, a: "Voor de meeste productie- en logistieke functies is Nederlands niet vereist. Grotere internationale bedrijven werken vaak in het Engels. Vraag het bureau naar de taalvereisten bij de specifieke klant." },
  ];
}

// ─── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return Object.keys(JOB_SALARY_DATA).map((jobSlug) => ({
    slug: `${jobSlug}-nederland`,
  }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Map Dutch "nederland" slugs to the English "netherlands" format for parseSalarySlug
  const enSlug = params.slug.replace(/-nederland$/, "-netherlands");
  const { jobSlug } = parseSalarySlug(enSlug);
  const job = getJobBySlug(jobSlug);
  if (!job) return { title: "Salaris niet gevonden" };

  const dutchTitle = DUTCH_JOB_TITLES[jobSlug] ?? job.title;
  const title = `Salaris ${dutchTitle} Nederland 2026 — Bruto en Netto`;
  const desc = `Wat verdient een ${dutchTitle} in Nederland in 2026? Bruto €${job.avg.toFixed(2)}/uur gemiddeld. Inclusief netto berekening, ploegentoeslag, en de beste uitzendbureaus.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://agencycheck.io/nl/salaris/${params.slug}`,
      languages: {
        nl: `https://agencycheck.io/nl/salaris/${params.slug}`,
        en: `https://agencycheck.io/salary/${jobSlug}-netherlands`,
        "x-default": `https://agencycheck.io/salary/${jobSlug}-netherlands`,
      },
    },
    openGraph: {
      title,
      description: desc,
      locale: "nl_NL",
      type: "article",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DutchSalaryPage({ params }: { params: { slug: string } }) {
  // Map Dutch "nederland" slugs to the English "netherlands" format
  const enSlug = params.slug.replace(/-nederland$/, "-netherlands");
  const { jobSlug, isNational } = parseSalarySlug(enSlug);
  const job = getJobBySlug(jobSlug);

  if (!job || !isNational) notFound();

  const dutchTitle = DUTCH_JOB_TITLES[jobSlug] ?? job.title;

  // Salary calculations
  const weeklyAvg = (job.avg * 40).toFixed(0);
  const monthlyAvg = (job.avg * 160).toFixed(0);
  const weeklyMin = (job.min * 40).toFixed(0);
  const weeklyMax = (job.max * 40).toFixed(0);

  // Net calculation (rough estimate)
  const grossWeekly = job.avg * 40;
  const loonheffing = grossWeekly * 0.10; // ~10% after heffingskorting at WML level
  const huisvesting = 95; // average SNF housing deduction
  const vervoer = 25;
  const overige = 25; // insurance + admin
  const netWeekly = grossWeekly - loonheffing - huisvesting - vervoer - overige;

  // Filter matching agencies
  const matchingAgencies = VERIFIED_AGENCIES.filter((a) => {
    // Try matching by partial job slug
    const jobParts = jobSlug.split("-");
    return a.jobFocus.some((jf) =>
      jobParts.some((part) => jf.toLowerCase().includes(part))
    );
  })
    .sort((a, b) => b.transparencyScore - a.transparencyScore)
    .slice(0, 8);

  const faqs = getDutchFaqs(jobSlug, dutchTitle);

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Salaris ${dutchTitle} Nederland 2026 — Bruto en Netto`,
    description: `Wat verdient een ${dutchTitle} in Nederland in 2026? Bruto €${job.avg.toFixed(2)}/uur gemiddeld.`,
    url: `https://agencycheck.io/nl/salaris/${params.slug}`,
    inLanguage: "nl-NL",
    author: { "@type": "Organization", name: "AgencyCheck" },
    publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
    dateModified: "2026-06-01",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  function scoreBadge(score: number): { bg: string; text: string } {
    if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-300" };
    if (score >= 65) return { bg: "bg-amber-500/20", text: "text-amber-300" };
    return { bg: "bg-red-500/20", text: "text-red-300" };
  }

  function accommodationLabel(acc: string): string {
    if (acc === "confirmed_with_deduction") return "Huisvesting beschikbaar (met inhouding)";
    if (acc === "confirmed_no_deduction") return "Gratis huisvesting";
    if (acc === "unverified_claim") return "Huisvesting geclaimd (niet geverifieerd)";
    return "Geen huisvesting";
  }

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white"><div className="max-w-3xl mx-auto px-4 py-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        <span>›</span>
        <Link href="/nl" className="hover:text-emerald-400">Nederland</Link>
        <span>›</span>
        <span className="text-gray-300">Salaris {dutchTitle}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{job.icon}</span>
          <div>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Salaris {dutchTitle} Nederland 2026
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Bruto en Netto — Bijgewerkt 2026</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed max-w-2xl">
          {job.description} Bekijk het gemiddelde bruto uurloon, de netto berekening na inhoudingen,
          en de beste uitzendbureaus voor jouw functie in Nederland.
        </p>
      </div>

      {/* Salary table */}
      <section className="mb-8">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-5">
          <h2 className="text-base font-bold text-white mb-4">
            Salaris {dutchTitle} — Overzicht Nederland 2026
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center mb-5">
            <div>
              <p className="text-2xl font-extrabold text-emerald-400">€{job.min.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Min / uur</p>
            </div>
            <div className="border-x border-white/[0.07]">
              <p className="text-3xl font-extrabold text-emerald-400">€{job.avg.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Gem / uur</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-100">€{job.max.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Max / uur</p>
            </div>
          </div>

          {/* Weekly/monthly */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.03] text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left py-2 px-3 font-semibold">Periode</th>
                  <th className="text-right py-2 px-3 font-semibold">Min</th>
                  <th className="text-right py-2 px-3 font-semibold text-emerald-400">Gem</th>
                  <th className="text-right py-2 px-3 font-semibold">Max</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/[0.07]">
                  <td className="py-2 px-3 text-gray-100">Per uur</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{job.min.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-400">€{job.avg.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{job.max.toFixed(2)}</td>
                </tr>
                <tr className="border-t border-white/[0.07] bg-white/[0.03]">
                  <td className="py-2 px-3 text-gray-100">Per week (40u)</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{weeklyMin}</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-400">€{weeklyAvg}</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{weeklyMax}</td>
                </tr>
                <tr className="border-t border-white/[0.07]">
                  <td className="py-2 px-3 text-gray-100">Per maand (160u)</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{(job.min * 160).toFixed(0)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-400">€{monthlyAvg}</td>
                  <td className="py-2 px-3 text-right text-gray-300">€{(job.max * 160).toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            Bruto bedragen. Vakantiegeld (8%) wordt doorgaans apart uitbetaald in juni.
          </p>
        </div>
      </section>

      {/* Net calculation */}
      <section className="mb-8">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-5">
          <h2 className="text-base font-bold text-white mb-4">
            Netto Berekening — {dutchTitle} bij Gemiddeld Loon
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Op basis van het gemiddelde bruto uurloon van €{job.avg.toFixed(2)} en een 40-urige werkweek.
            Met standaard uitzendbureau-inhoudingen (huisvesting, vervoer, verzekering).
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-emerald-900/20 rounded">
              <span className="text-sm font-medium text-gray-100">
                Bruto weekloon (€{job.avg.toFixed(2)} × 40u)
              </span>
              <span className="text-sm font-bold text-emerald-300">+€{grossWeekly.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-red-900/20 rounded">
              <span className="text-sm text-gray-300">Loonheffing (~10% na heffingskorting)</span>
              <span className="text-sm font-medium text-red-400">−€{loonheffing.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-red-900/20 rounded">
              <span className="text-sm text-gray-300">Huisvesting uitzendbureau (SNF-norm)</span>
              <span className="text-sm font-medium text-red-400">−€{huisvesting}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-red-900/20 rounded">
              <span className="text-sm text-gray-300">Vervoer (busservice uitzendbureau)</span>
              <span className="text-sm font-medium text-red-400">−€{vervoer}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-red-900/20 rounded">
              <span className="text-sm text-gray-300">Zorgverzekering + administratiekosten</span>
              <span className="text-sm font-medium text-red-400">−€{overige}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-emerald-500/20 rounded border border-emerald-500/30 mt-1">
              <span className="text-sm font-bold text-white">Nettoloon per week (schatting)</span>
              <span className="text-base font-extrabold text-emerald-300">€{netWeekly.toFixed(0)}</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            Dit is een schatting. Werkelijke inhoudingen verschillen per uitzendbureau.
            Als het bureau geen huisvesting of vervoer biedt, is je nettoloon hoger.
            Vraag altijd een schriftelijk overzicht van alle inhoudingen vóór ondertekening.
          </p>
          <div className="mt-3 flex gap-3 flex-wrap">
            <Link
              href="/nl/nettoloon-nederland"
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Uitgebreide nettoloon uitleg →
            </Link>
            <Link
              href="/nl/minimumloon-nederland-2026"
              className="text-xs text-gray-400 hover:text-emerald-400 hover:underline"
            >
              Minimumloon 2026 →
            </Link>
          </div>
        </div>
      </section>

      {/* Top agencies for this job type */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Uitzendbureaus voor {dutchTitle}s in Nederland
          </h2>
          <span className="text-xs text-gray-400">{matchingAgencies.length} bureaus</span>
        </div>

        {matchingAgencies.length === 0 ? (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-8 text-center text-gray-400">
            <p className="text-sm">Geen bureaus gevonden voor dit functietype.</p>
            <Link href="/agencies" className="text-xs text-emerald-400 mt-2 inline-block hover:underline">
              Bekijk alle uitzendbureaus →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {matchingAgencies.map((agency, idx) => {
              const badge = scoreBadge(agency.transparencyScore);
              const topCities = agency.supportedCities.slice(0, 4);
              const extraCities = agency.supportedCities.length - 4;
              return (
                <div key={agency.slug} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-4 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          href={`/agencies/${agency.slug}`}
                          className="font-semibold text-white hover:text-emerald-400 transition-colors"
                        >
                          {agency.name}
                        </Link>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                        >
                          Score: {agency.transparencyScore}
                        </span>
                      </div>
                      {agency.accommodation !== "not_provided" && agency.accommodation !== "unknown" && (
                        <p className="text-xs text-emerald-300 mb-1">
                          🏠 {accommodationLabel(agency.accommodation)}
                        </p>
                      )}
                      {topCities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {topCities.map((c) => (
                            <span key={c} className="inline-block bg-white/[0.07] text-gray-400 text-[11px] px-2 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                          {extraCities > 0 && (
                            <span className="inline-block bg-white/[0.07] text-gray-500 text-[11px] px-2 py-0.5 rounded">
                              +{extraCities}
                            </span>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/agencies/${agency.slug}`}
                        className="text-xs text-emerald-400 hover:underline font-medium"
                      >
                        Bekijk bureau →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Dutch FAQs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Veelgestelde Vragen — {dutchTitle} Salaris Nederland
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-4">
              <h3 className="font-semibold text-white text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Gerelateerde paginas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Link
            href="/nl/minimumloon-nederland-2026"
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">Minimumloon 2026</p>
            <p className="text-[11px] text-gray-400 mt-0.5">WML uurloon en weekbedrag</p>
          </Link>
          <Link
            href="/nl/nettoloon-nederland"
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">Nettoloon Nederland</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Wat houd je netto over?</p>
          </Link>
          <Link
            href={`/salary/${jobSlug}-netherlands`}
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">{job.title} Salary (EN)</p>
            <p className="text-[11px] text-gray-400 mt-0.5">English salary data</p>
          </Link>
          <Link
            href="/best-agencies-with-housing-netherlands"
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">Bureaus met Huisvesting</p>
            <p className="text-[11px] text-gray-400 mt-0.5">SNF-gecertificeerde opties</p>
          </Link>
          <Link
            href={`/best-agencies/${jobSlug}`}
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">Beste {job.title} Bureaus</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Gerangschikt op score</p>
          </Link>
          <Link
            href="/nl"
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-sm hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
          >
            <p className="font-semibold text-gray-200 text-xs">Uitzendbureaus NL</p>
            <p className="text-[11px] text-gray-400 mt-0.5">150+ bureaus vergelijken</p>
          </Link>
        </div>
      </section>

      {/* Related salary pages */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Andere functies — salaris
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(JOB_SALARY_DATA)
            .filter(([k]) => k !== jobSlug)
            .slice(0, 8)
            .map(([slug, j]) => {
              const nlTitle = DUTCH_JOB_TITLES[slug] ?? j.title;
              return (
                <Link
                  key={slug}
                  href={`/nl/salaris/${slug}-nederland`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/[0.06] text-gray-300 border border-white/[0.10] rounded-full px-3 py-1.5 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                >
                  {j.icon} {nlTitle}
                </Link>
              );
            })}
        </div>
      </section>

      <p className="text-xs text-gray-500 text-center mt-4">
        Salarisgegevens zijn indicatief en gebaseerd op beschikbare data. AgencyCheck verifieert geen individuele salariscijfers.
        Minimumloon 2026: €14,71/uur (40-urige werkweek). Bijgewerkt: juni 2026.
      </p>
    </div>
    </div>
  );
}
