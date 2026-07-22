// ÖffiGo — flagship iOS app, currently in closed TestFlight beta.
// Copy is bilingual; the HomePage renders the matching language.
//
// Status discipline: this section must never claim more than the product
// actually does. ÖffiGo is not released, the old automated position
// measurement network is paused, and live vehicle positions run as a beta on a
// deliberately sparing on-demand lookup. Keep this in sync with oeffigo.app.

export interface OeffigoFeature {
  /** Inline SVG path data (24x24 viewBox) for the feature glyph. */
  icon: string;
  title: { en: string; de: string };
  body: { en: string; de: string };
}

export interface OeffigoContent {
  name: string;
  eyebrow: { en: string; de: string };
  tagline: { en: string; de: string };
  lead: { en: string; de: string };
  platform: { en: string; de: string };
  status: { en: string; de: string };
  dataNote: { en: string; de: string };
  appStoreUrl: string | null;
  /** Canonical product site — the cross-link to oeffigo.app for SEO + users. */
  websiteUrl: string;
  liveUrl: string;
  statusUrl: string;
  icon: string;
  liveProof: {
    eyebrow: { en: string; de: string };
    title: { en: string; de: string };
    body: { en: string; de: string };
    stats: { en: string; de: string }[];
    liveLabel: { en: string; de: string };
    statusLabel: { en: string; de: string };
  };
  features: OeffigoFeature[];
  beta: {
    headline: { en: string; de: string };
    body: { en: string; de: string };
    note: { en: string; de: string };
    ctaLabel: { en: string; de: string };
  };
  // The real app brand palette, lifted from the app's own theme.
  brand: {
    green: string;
    greenBright: string;
    ink: string;
  };
}

// 24x24 line-icon paths (Lucide-style), so the section needs no image deps.
const ICONS = {
  clock: "M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  route: "M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 19h6a3 3 0 0 0 3-3v-3M6 13V8a3 3 0 0 1 3-3h3",
  map: "m9 5-6 2v14l6-2 6 2 6-2V5l-6 2-6-2Zm0 0v14m6-12v14",
  spark: "M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2",
  star: "M12 3.5 14.6 9l6 .8-4.4 4.2 1.1 6L12 17.2 6.7 20l1.1-6L3.4 9.8 9.4 9 12 3.5Z",
  bell: "M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8m4.3 12a2 2 0 0 0 3.4 0",
} as const;

export const oeffigo: OeffigoContent = {
  name: "ÖffiGo",
  eyebrow: { en: "closed TestFlight beta · iOS 17+", de: "geschlossene TestFlight-Beta · iOS 17+" },
  tagline: {
    en: "Austria's public transport — truly native.",
    de: "Österreichs Öffis — wirklich nativ.",
  },
  lead: {
    en: "Real-time departures, journey planning and live disruptions for all of Austria, in a modern, fast interface. ÖffiGo pulls its Austria-wide transport data from VAO / HAFAS, overlays Wiener Linien open realtime for the Vienna subway, and always labels whether a time is live or straight from the timetable.",
    de: "Echtzeit-Abfahrten, Routenplanung und Live-Störungen für ganz Österreich, in einer modernen, schnellen Oberfläche. ÖffiGo bezieht die österreichweiten Fahrtdaten von VAO/HAFAS, blendet für die Wiener U-Bahn die offene Wiener-Linien-Echtzeit ein und kennzeichnet immer, ob eine Zeit live ist oder aus dem Fahrplan kommt.",
  },
  platform: { en: "iOS 17+ and Apple Watch, Android in the works", de: "iOS 17+ und Apple Watch, Android in Arbeit" },
  status: { en: "closed TestFlight beta — not released yet", de: "geschlossene TestFlight-Beta — noch nicht veröffentlicht" },
  dataNote: {
    en: "Data sources match oeffigo.app: VAO / HAFAS for Austria-wide transport, Wiener Linien open data for Vienna subway realtime, and official TRIAS stop-event history from Verkehrsverbund Steiermark (open data) — which carries no fleet positions.",
    de: "Datenquellen wie auf oeffigo.app: VAO/HAFAS für Österreichs Öffis, Wiener-Linien-Open-Data für die Wiener U-Bahn-Echtzeit und offizielle TRIAS-StopEvent-History vom Verkehrsverbund Steiermark (OGD) — die keine Fahrzeugpositionen enthält.",
  },
  appStoreUrl: null,
  websiteUrl: "https://oeffigo.app",
  liveUrl: "https://oeffigo.app/live",
  statusUrl: "https://oeffigo.app/status",
  icon: "/projects/oeffigo/icon.png",
  liveProof: {
    eyebrow: { en: "live positions · beta", de: "live-positionen · beta" },
    title: { en: "An honest label beats a confident guess.", de: "Ehrlich beschriftet schlägt selbstsicher geraten." },
    body: {
      en: "Official operator realtime is what ÖffiGo shows first, clearly separated from the timetable. Live vehicle positions run as a beta on a deliberately sparing on-demand lookup, and ÖffiGo only adds a prediction of its own when the measurement basis behind it is fresh and approved. The whole data status is public.",
      de: "ÖffiGo zeigt zuerst die offizielle Betreiber-Echtzeit, klar getrennt vom Fahrplan. Live-Fahrzeugpositionen laufen als Beta über einen bewusst sparsamen On-Demand-Abruf, und eine eigene Prognose kommt nur dazu, wenn die Messbasis dahinter frisch und freigegeben ist. Der gesamte Datenstatus ist öffentlich einsehbar.",
    },
    stats: [
      { en: "schedule and realtime are always labelled apart", de: "Fahrplan und Echtzeit sind immer getrennt gekennzeichnet" },
      { en: "live vehicle positions in beta, on-demand and rate-limited", de: "Live-Fahrzeugpositionen in Beta, on demand und mengenbegrenzt" },
      { en: "the old automated measurement network stays paused", de: "das alte automatische Messnetz bleibt pausiert" },
      { en: "own predictions only with a fresh, approved measurement basis", de: "eigene Prognosen nur mit frischer, freigegebener Messbasis" },
    ],
    liveLabel: { en: "See the data status", de: "Datenstatus ansehen" },
    statusLabel: { en: "System status", de: "Systemstatus" },
  },
  features: [
    {
      icon: ICONS.clock,
      title: { en: "Live departure board", de: "Live-Abfahrtstafel" },
      body: {
        en: "Your nearest stop, departures for every mode, and realtime where it's available — including delays, platform changes and disruptions. For the Vienna subway it even overlays Wiener Linien realtime where VAO ships only a schedule.",
        de: "Deine nächste Haltestelle, Abfahrten für alle Öffis und Echtzeit dort, wo sie verfügbar ist — inklusive Verspätungen, Steigwechseln und Störungen. Für die Wiener U-Bahn blendet sie sogar die Wiener-Linien-Echtzeit ein, wo die VAO nur den Fahrplan liefert.",
      },
    },
    {
      icon: ICONS.route,
      title: { en: "Journey planner", de: "Routenplaner" },
      body: {
        en: "Plan your route with all transfers, the walk to the first stop, and a depart-at or arrive-by time.",
        de: "Plane deine Route mit allen Umstiegen, Fußweg zur ersten Haltestelle und Abfahrts- oder Ankunftszeit.",
      },
    },
    {
      icon: ICONS.map,
      title: { en: "Live map & nearby stops", de: "Live-Karte & Haltestellen in der Nähe" },
      body: {
        en: "Stops around you on the map, plus live vehicle positions where they are available — a beta capability that fetches sparingly instead of polling the network.",
        de: "Haltestellen rund um dich auf der Karte, dazu Live-Fahrzeugpositionen, wo es sie gibt — eine Beta-Funktion, die sparsam abruft statt dauerhaft zu pollen.",
      },
    },
    {
      icon: ICONS.route,
      title: { en: "Indoor station guidance", de: "Wegweisung im Bahnhof" },
      body: {
        en: "At mapped major stations, transfers can use OpenStreetMap indoor data for stairs, escalators and lifts.",
        de: "Bei gemappten großen Bahnhöfen nutzt der Umstieg OpenStreetMap-Indoor-Daten für Treppen, Rolltreppen und Aufzüge.",
      },
    },
    {
      icon: ICONS.bell,
      title: { en: "Live Activities & widgets", de: "Live-Aktivitäten & Widgets" },
      body: {
        en: "Lock Screen and Dynamic Island countdowns for an active trip, departure reminders, and home-screen widgets.",
        de: "Countdown auf Sperrbildschirm und Dynamic Island für die aktive Fahrt, Abfahrts-Erinnerungen und Home-Screen-Widgets.",
      },
    },
    {
      icon: ICONS.star,
      title: { en: "Favorites & saved routes", de: "Favoriten & gespeicherte Routen" },
      body: {
        en: "Save home, work, the stops you use, and your usual routes.",
        de: "Speichere Zuhause, Arbeit, wichtige Haltestellen und deine üblichen Wege.",
      },
    },
  ],
  beta: {
    headline: { en: "Testers wanted, spots are limited", de: "Testerinnen und Tester gesucht, Plätze sind begrenzt" },
    body: {
      en: "ÖffiGo runs as an internal iOS TestFlight beta. You can ask for a spot on oeffigo.app — it's a request, not an automatic invite, and you get exactly one email when a suitable place opens.",
      de: "ÖffiGo läuft als interne iOS-TestFlight-Beta. Einen Platz kannst du auf oeffigo.app anfragen — das ist eine Anfrage, keine automatische Zusage, und du bekommst genau eine E-Mail, sobald ein passender Platz frei wird.",
    },
    note: {
      en: "Free during the beta. There is no paid offering yet, and the scope and price of a later Pro tier are not decided.",
      de: "Während der Beta kostenlos. Es gibt noch kein kostenpflichtiges Angebot, und Umfang und Preis eines späteren Pro-Tarifs sind nicht entschieden.",
    },
    ctaLabel: { en: "Request a beta spot", de: "Beta-Platz anfragen" },
  },
  brand: {
    green: "#56c441",
    greenBright: "#7be25a",
    ink: "#0a0b0c",
  },
};
