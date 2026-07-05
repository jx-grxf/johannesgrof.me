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
  eyebrow: { en: "live measurement network · launching soon", de: "Messnetz live · bald verfügbar" },
  tagline: {
    en: "Austria's public transport — truly native.",
    de: "Österreichs Öffis — wirklich nativ.",
  },
  lead: {
    en: "Real-time departures, journey planning and live disruptions for all of Austria, in a modern, fast interface. ÖffiGo talks straight to VAO / HAFAS, overlays Wiener Linien realtime for the Vienna subway, and now runs its own measurement network to spot delays earlier than the official display.",
    de: "Echtzeit-Abfahrten, Routenplanung und Live-Störungen für ganz Österreich, in einer modernen, schnellen Oberfläche. ÖffiGo spricht direkt mit VAO/HAFAS, blendet Wiener-Linien-Echtzeit für die Wiener U-Bahn ein und betreibt inzwischen ein eigenes Messnetz, das Verspätungen früher erkennt als die offizielle Anzeige.",
  },
  platform: { en: "iOS 17+ first, Android in the works", de: "zuerst iOS 17+, Android in Arbeit" },
  status: { en: "in active development", de: "in aktiver Entwicklung" },
  dataNote: {
    en: "Data sources match oeffigo.app: VAO / HAFAS for Austria-wide transport, Wiener Linien open data for Vienna subway realtime, HERE traffic, GeoSphere Austria weather and open timetable data where used.",
    de: "Datenquellen wie auf oeffigo.app: VAO/HAFAS für Österreichs Öffis, Wiener-Linien-Open-Data für die Wiener U-Bahn-Echtzeit, HERE-Verkehrslage, GeoSphere-Austria-Wetter und offene Fahrplandaten, wo sie genutzt werden.",
  },
  appStoreUrl: null,
  websiteUrl: "https://oeffigo.app",
  liveUrl: "https://oeffigo.app/live",
  statusUrl: "https://oeffigo.app/status",
  icon: "/projects/oeffigo/icon.png",
  liveProof: {
    eyebrow: { en: "running right now", de: "läuft gerade" },
    title: { en: "The measurement network never sleeps.", de: "Das Messnetz schläft nie." },
    body: {
      en: "ÖffiGo doesn't just trust the official displays — it measures Austria's public transport itself, around the clock: GPS against schedule, across the whole country. Everything the system measures is public. Watch it work, live.",
      de: "ÖffiGo vertraut nicht einfach den offiziellen Anzeigen — es vermisst Österreichs Öffis selbst, rund um die Uhr: GPS gegen Fahrplan, quer durchs ganze Land. Alles, was das System misst, ist öffentlich. Schau ihm live bei der Arbeit zu.",
    },
    stats: [
      { en: "measuring non-stop since July 2, 2026", de: "misst ununterbrochen seit 2. Juli 2026" },
      { en: "20 measurement zones across Austria", de: "20 Messzonen in ganz Österreich" },
      { en: "a full sweep roughly every 35 seconds", de: "alle ~35 Sekunden ein kompletter Durchlauf" },
      { en: "four data streams: GPS positions, subway monitors, road traffic, weather", de: "vier Datenströme: GPS-Positionen, U-Bahn-Monitore, Verkehrslage, Wetter" },
    ],
    liveLabel: { en: "Watch it live", de: "Live zusehen" },
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
      title: { en: "Live map & measurement network", de: "Live-Karte & Messnetz" },
      body: {
        en: "Nearby stops, live vehicle positions where available, and ÖffiGo's own GPS-vs-schedule measurement for confident predictions.",
        de: "Haltestellen in der Nähe, Fahrzeugpositionen wo verfügbar und ÖffiGos eigene GPS-gegen-Fahrplan-Messung für sichere Prognosen.",
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
      icon: ICONS.spark,
      title: { en: "ÖffiGo AI", de: "ÖffiGo KI" },
      body: {
        en: "A chat on your iPhone that explains routes, departures and disruptions — private, where Apple Intelligence is supported.",
        de: "Ein Chat am iPhone, der dir Routen, Abfahrten und Störungen erklärt — privat, wenn Apple Intelligence unterstützt wird.",
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
  promo: {
    active: false,
    code: "OEFFIGO2X",
    headline: { en: "Launch offer: double the free trial", de: "Launch-Aktion: doppelte Testphase" },
    body: {
      en: "The first 100 on the waitlist get a double free trial and 15% off the first month at launch. Enough time to see whether ÖffiGo fits your daily routine.",
      de: "Die ersten 100 auf der Warteliste bekommen zum Launch die doppelte Testphase und 15% Rabatt im ersten Monat. Genug Zeit, um zu schauen, ob ÖffiGo in deinen Alltag passt.",
    },
    note: {
      en: "The code drops when ÖffiGo hits the App Store — iOS first, with Android to follow. Want it first? Reach out and I'll send it your way.",
      de: "Der Code kommt, sobald ÖffiGo im App Store ist — zuerst für iOS, Android folgt. Zuerst dabei sein? Melde dich, dann schicke ich ihn dir.",
    },
  },
  brand: {
    green: "#56c441",
    greenBright: "#7be25a",
    ink: "#0a0b0c",
  },
};
