// ÖffiGo — flagship iOS app, promoted ahead of its App Store release.
// Copy is bilingual; the HomePage renders the matching language.

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
  icon: string;
  features: OeffigoFeature[];
  promo: {
    /** Launch code is teased before release; the real code drops at launch. */
    active: boolean;
    code: string;
    headline: { en: string; de: string };
    body: { en: string; de: string };
    note: { en: string; de: string };
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
  eyebrow: { en: "launching soon · iOS", de: "bald im app store · iOS" },
  tagline: {
    en: "Austria's public transport — truly native.",
    de: "Österreichs Öffis — wirklich nativ.",
  },
  lead: {
    en: "Real-time departures, journey planning, and live disruptions for all of Austria, wrapped in a modern iOS 26 Liquid Glass interface. ÖffiGo talks straight to the VAO / HAFAS backend — the same data behind the official apps — and presents it the way iOS should.",
    de: "Echtzeit-Abfahrten, Routenplanung und Live-Störungen für ganz Österreich, in einer modernen iOS-26-Liquid-Glass-Oberfläche. ÖffiGo spricht direkt mit dem VAO-/HAFAS-Backend — denselben Daten wie die offiziellen Apps — und zeigt sie so, wie iOS es verdient.",
  },
  platform: { en: "iOS 17+ · Liquid Glass on iOS 26", de: "iOS 17+ · Liquid Glass ab iOS 26" },
  status: { en: "in active development", de: "in aktiver Entwicklung" },
  dataNote: {
    en: "Live data from Verkehrsauskunft Österreich (VAO / HAFAS). All of Austria, every mode — tram, bus, train, S-Bahn, subway, cableway, ship.",
    de: "Live-Daten von der Verkehrsauskunft Österreich (VAO / HAFAS). Ganz Österreich, alle Verkehrsmittel — Tram, Bus, Bahn, S-Bahn, U-Bahn, Seilbahn, Schiff.",
  },
  appStoreUrl: null,
  icon: "/projects/oeffigo/icon.png",
  features: [
    {
      icon: ICONS.clock,
      title: { en: "Live departure board", de: "Live-Abfahrtstafel" },
      body: {
        en: "Your nearest stop and live departures for every mode, with realtime delays and platform-change warnings.",
        de: "Deine nächste Haltestelle und Live-Abfahrten für jedes Verkehrsmittel — mit Echtzeit-Verspätungen und Steig-Wechsel-Warnungen.",
      },
    },
    {
      icon: ICONS.route,
      title: { en: "Journey planner", de: "Routenplaner" },
      body: {
        en: "Full transfers and leg timeline, now / depart-at / arrive-by, routed from your exact position — including the walk to the first stop.",
        de: "Komplette Umstiege und Leg-Timeline, jetzt / Abfahrt / Ankunft, geroutet von deiner genauen Position — inklusive Fußweg zur ersten Haltestelle.",
      },
    },
    {
      icon: ICONS.map,
      title: { en: "Live map", de: "Live-Karte" },
      body: {
        en: "Nearby stops and live vehicle positions that glide between polls instead of jumping across the map.",
        de: "Haltestellen in der Nähe und Live-Fahrzeugpositionen, die zwischen den Updates gleiten statt über die Karte zu springen.",
      },
    },
    {
      icon: ICONS.spark,
      title: { en: "ÖffiGo AI", de: "ÖffiGo KI" },
      body: {
        en: "An on-device Apple Intelligence transit chat that plans routes, shows departures and disruptions, and keeps context for follow-ups.",
        de: "Ein On-Device-Apple-Intelligence-Chat, der Routen plant, Abfahrten und Störungen zeigt und den Kontext für Rückfragen behält.",
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
        en: "Home, work, and custom stops, plus saved routes with a pinned daily connection and a “Dein Weg” status card.",
        de: "Zuhause, Arbeit und eigene Haltestellen, dazu gespeicherte Routen mit angepinnter Tagesverbindung und „Dein Weg“-Statuskarte.",
      },
    },
  ],
  promo: {
    active: false,
    code: "OEFFIGO2X",
    headline: { en: "Launch offer: double the free trial", de: "Launch-Aktion: doppelte Testphase" },
    body: {
      en: "Redeem a launch code at release for twice the standard free trial — plenty of time to make ÖffiGo your daily transit app.",
      de: "Löse zum Release einen Launch-Code ein und erhalte die doppelte Standard-Testphase — genug Zeit, ÖffiGo zu deiner täglichen Öffi-App zu machen.",
    },
    note: {
      en: "The code drops when ÖffiGo hits the App Store. Want it first? Reach out and I'll send it your way.",
      de: "Der Code kommt, sobald ÖffiGo im App Store ist. Zuerst dabei sein? Melde dich, dann schicke ich ihn dir.",
    },
  },
  brand: {
    green: "#56c441",
    greenBright: "#7be25a",
    ink: "#0a0b0c",
  },
};
