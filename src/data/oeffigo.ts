// ÖffiGo — flagship iOS app, currently in a closed TestFlight beta.
// Copy is bilingual; the pages render the matching language.
//
// Status discipline: this must never claim more than the product does. Keep it
// in sync with oeffigo-website/src/data/strings.ts, which is checked against
// the app itself. As of 2026-09-16: iPhone and Apple Watch only, Android paused,
// sign-up is a waitlist, and the three time labels are Live, Echtzeit, Fahrplan.

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
  /** Screens from the current build, copied from oeffigo-website/public/shots. */
  shots: { src: string; alt: { en: string; de: string }; caption: { en: string; de: string } }[];
  support: { en: string; de: string };
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
}

// 24x24 line-icon paths (Lucide-style), so the section needs no image deps.
const ICONS = {
  clock: "M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  route: "M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 19h6a3 3 0 0 0 3-3v-3M6 13V8a3 3 0 0 1 3-3h3",
  map: "m9 5-6 2v14l6-2 6 2 6-2V5l-6 2-6-2Zm0 0v14m6-12v14",
  spark: "M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2",
  star: "M12 3.5 14.6 9l6 .8-4.4 4.2 1.1 6L12 17.2 6.7 20l1.1-6L3.4 9.8 9.4 9 12 3.5Z",
  bell: "M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8m4.3 12a2 2 0 0 0 3.4 0",
  signpost: "M12 13v8M12 3v3M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586Z",
} as const;

export const oeffigo: OeffigoContent = {
  name: "ÖffiGo",
  eyebrow: { en: "closed beta · iPhone and Apple Watch", de: "geschlossene Beta · iPhone und Apple Watch" },
  tagline: {
    en: "Transit, without the guesswork.",
    de: "Öffi fahren, ohne zu raten.",
  },
  lead: {
    en: "A public-transport app for all of Austria: departures, routes and step-by-step guidance, on the iPhone, the Apple Watch and the lock screen. Every time says where it came from, and when a transfer gets tight, ÖffiGo already has a plan B. No ads, no account.",
    de: "Eine Öffi-App für ganz Österreich: Abfahrten, Routen und Zielführung, am iPhone, an der Apple Watch und am Sperrbildschirm. Jede Zeit sagt, woher sie kommt, und wenn ein Umstieg knapp wird, hat ÖffiGo schon einen Plan B. Ohne Werbung, ohne Konto.",
  },
  platform: { en: "iPhone (iOS 17+) and Apple Watch. Android is paused for now.", de: "iPhone (ab iOS 17) und Apple Watch. Android ist derzeit pausiert." },
  status: { en: "closed TestFlight beta, not released yet", de: "geschlossene TestFlight-Beta, noch nicht veröffentlicht" },
  dataNote: {
    en: "Place search, route planning and disruptions run on Verkehrsauskunft Österreich (VAO), which supports ÖffiGo as a school project. Realtime comes from the operators where they supply it. The punctuality analysis currently covers Vienna and Styria.",
    de: "Ortssuche, Routenplanung und Störungsmeldungen laufen über die Verkehrsauskunft Österreich (VAO), die ÖffiGo als Schülerprojekt unterstützt. Echtzeit kommt von den Betreibern, wo sie sie liefern. Die Pünktlichkeits-Auswertung deckt derzeit Wien und die Steiermark ab.",
  },
  appStoreUrl: null,
  websiteUrl: "https://oeffigo.app",
  liveUrl: "https://oeffigo.app/history",
  statusUrl: "https://oeffigo.app/status",
  icon: "/projects/oeffigo/icon.webp",
  shots: [
    {
      src: "/projects/oeffigo/app-today.webp",
      alt: {
        en: "ÖffiGo Today on iPhone: the next departures near Wien Praterstern on the O tram, U2 and U1, with the nearby map below.",
        de: "ÖffiGo Heute auf dem iPhone: die nächsten Abfahrten bei Wien Praterstern mit O-Wagen, U2 und U1, darunter die Umgebungskarte.",
      },
      caption: { en: "Today", de: "Heute" },
    },
    {
      src: "/projects/oeffigo/app-departures.webp",
      alt: {
        en: "ÖffiGo departures at Wien Karlsplatz. The U1 shows its own live reading next to the operator's display.",
        de: "ÖffiGo Abfahrten am Wiener Karlsplatz. Die U1 zeigt die eigene Live-Zeit neben der Anzeige des Betreibers.",
      },
      caption: { en: "Departures", de: "Abfahrten" },
    },
    {
      src: "/projects/oeffigo/app-live.webp",
      alt: {
        en: "ÖffiGo at Wien Karlsplatz: the U2 with a live reading of two minutes late while the operator still shows it on time.",
        de: "ÖffiGo am Karlsplatz: die U2 mit eigener Live-Messung plus zwei Minuten, während der Betreiber noch pünktlich anzeigt.",
      },
      caption: { en: "Live next to the display", de: "Live neben der Anzeige" },
    },
    {
      src: "/projects/oeffigo/app-welcome.webp",
      alt: {
        en: "ÖffiGo route search: start at the current location, pick a destination, find connections.",
        de: "ÖffiGo Routensuche: Start am aktuellen Standort, Ziel wählen, Verbindungen finden.",
      },
      caption: { en: "Where to?", de: "Wohin geht's?" },
    },
  ],
  support: {
    en: "Verkehrsauskunft Österreich supports ÖffiGo as a school project with access to its services.",
    de: "Die Verkehrsauskunft Österreich unterstützt ÖffiGo als Schülerprojekt mit Zugang zu ihren Diensten.",
  },
  liveProof: {
    eyebrow: { en: "where the time comes from", de: "woher die zeit kommt" },
    title: { en: "Every time shows where it came from.", de: "Jede Zeit zeigt, woher sie kommt." },
    body: {
      en: "Some times are reported, some are calculated, some are only scheduled. The row on the board tells you which one you are reading, and ÖffiGo's own estimate never replaces the operator's.",
      de: "Manche Zeiten sind gemeldet, manche gerechnet, manche nur geplant. Welche du gerade liest, steht an der Zeile, und die eigene Schätzung ersetzt nie die des Betreibers.",
    },
    stats: [
      { en: "Live: ÖffiGo's own calculation, shown only when it is confident, next to the official time", de: "Live: selbst nachgerechnet, steht nur da, wenn es sicher genug ist, und immer neben der offiziellen Zeit" },
      { en: "Realtime: times supplied by the operator", de: "Echtzeit: vom Betreiber zugelieferte Zeiten" },
      { en: "Timetable: nobody supplies realtime for this trip, so you see the plan", de: "Fahrplan: für diese Fahrt liefert niemand Echtzeit, also steht da der Plan" },
    ],
    liveLabel: { en: "How punctual is your line?", de: "Wie pünktlich ist deine Linie?" },
    statusLabel: { en: "System status", de: "Systemstatus" },
  },
  features: [
    {
      icon: ICONS.clock,
      title: { en: "Departures", de: "Abfahrten" },
      body: {
        en: "Your stop with every line, delays, platform changes and cancellations, and a label on each time saying whether it is live, realtime or timetable.",
        de: "Deine Haltestelle mit allen Linien, Verspätungen, Steigwechseln und Ausfällen, und an jeder Zeit steht, ob sie live, Echtzeit oder Fahrplan ist.",
      },
    },
    {
      icon: ICONS.route,
      title: { en: "Plan B when it gets tight", de: "Plan B, wenn's knapp wird" },
      body: {
        en: "When a delay costs you the transfer, ÖffiGo works out an alternative from where you are. It only suggests one that saves at least three minutes.",
        de: "Kostet eine Verspätung den Umstieg, rechnet ÖffiGo ab deinem Standort eine Alternative aus. Vorgeschlagen wird sie nur, wenn sie mindestens drei Minuten bringt.",
      },
    },
    {
      icon: ICONS.bell,
      title: { en: "Subscriptions", de: "Abos" },
      body: {
        en: "Save a trip or a whole line. ÖffiGo keeps checking while the app is closed and tells you once when something changes.",
        de: "Speichere eine Verbindung oder eine ganze Linie. ÖffiGo prüft weiter, auch bei geschlossener App, und meldet sich einmal, wenn sich etwas ändert.",
      },
    },
    {
      icon: ICONS.spark,
      title: { en: "Apple Watch and Live Activity", de: "Apple Watch und Live Activity" },
      body: {
        en: "A full app on the wrist, and the next stop on the lock screen and in the Dynamic Island without unlocking.",
        de: "Eine vollwertige App am Handgelenk, und der nächste Halt am Sperrbildschirm und in der Dynamic Island, ohne zu entsperren.",
      },
    },
    {
      icon: ICONS.map,
      title: { en: "All of Austria", de: "Ganz Österreich" },
      body: {
        en: "A to B across the country with up to two stops along the way, real walking legs, and the map in the operators' own colours.",
        de: "Von A nach B im ganzen Land mit bis zu zwei Zwischenstopps, echten Fußwegen und der Karte in den Farben der Betreiber.",
      },
    },
    {
      icon: ICONS.signpost,
      title: { en: "Inside the station", de: "Weg im Bahnhof" },
      body: {
        en: "Transfers through big interchanges via escalator, lift or stairs, wherever OpenStreetMap has mapped the station.",
        de: "Umstiege in großen Knoten über Rolltreppe, Lift oder Stiege, dort wo OpenStreetMap den Bahnhof erfasst hat.",
      },
    },
  ],
  beta: {
    headline: { en: "A small group is testing it right now", de: "Gerade testet eine kleine Runde" },
    body: {
      en: "ÖffiGo runs as a TestFlight beta on the iPhone. Put yourself on the waitlist at oeffigo.app and you hear back when a spot opens up.",
      de: "ÖffiGo läuft als TestFlight-Beta auf dem iPhone. Auf oeffigo.app kannst du dich auf die Warteliste setzen, dann hörst du, sobald ein Platz frei wird.",
    },
    note: {
      en: "Free during the beta. There is no paid offering.",
      de: "Während der Beta kostenlos. Es gibt kein kostenpflichtiges Angebot.",
    },
    ctaLabel: { en: "Join the waitlist", de: "Auf die Warteliste" },
  },
};
