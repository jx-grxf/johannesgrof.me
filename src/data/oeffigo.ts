// ÖffiGo — flagship iOS app, currently in a closed TestFlight beta.
// Copy is bilingual; the pages render the matching language.
//
// Status discipline: this must never claim more than the product does. Keep it
// in sync with oeffigo-website/src/data/strings.ts, which is checked against
// the app itself. As of 2026-10-11: iPhone and Apple Watch only, Android paused,
// sign-up is a beta-place request, and the times carry Echtzeit or Fahrplan. ÖffiGo's
// own Live estimate is in development there, so it may only appear as "later".

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
  liveUrl: { en: string; de: string };
  statusUrl: string;
  /** The "Das neue ÖffiGo" page for the current beta build. */
  newUrl: { en: string; de: string };
  betaUrl: { en: string; de: string };
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
    newLabel: { en: string; de: string };
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
    en: "The transit app for all of Austria.",
    de: "Die Öffi-App für ganz Österreich.",
  },
  lead: {
    en: "Routes, departures and step-by-step guidance for bus, train and tram, from village to city, on the iPhone, the Apple Watch and the lock screen. Every time shows whether it comes from the operator or the timetable, and when a connection gets tight, ÖffiGo already has a plan B. No ads, no account.",
    de: "Verbindungen, Abfahrten und Zielführung für Bus, Bahn und Bim, vom Dorf bis in die Stadt, am iPhone, an der Apple Watch und am Sperrbildschirm. Bei jeder Zeit steht, ob sie vom Verkehrsbetrieb kommt oder aus dem Fahrplan, und wird ein Anschluss knapp, hat ÖffiGo schon einen Plan B. Ohne Werbung, ohne Konto.",
  },
  platform: { en: "iPhone (iOS 17+) and Apple Watch. Android is paused for now.", de: "iPhone (ab iOS 17) und Apple Watch. Android ist derzeit pausiert." },
  status: { en: "closed TestFlight beta, not released yet", de: "geschlossene TestFlight-Beta, noch nicht veröffentlicht" },
  dataNote: {
    en: "Place search, route planning and disruptions run on Verkehrsauskunft Österreich (VAO), which supports ÖffiGo as a school project. Realtime comes from the operators where they supply it. The punctuality analysis currently covers Vienna and Styria.",
    de: "Ortssuche, Routenplanung und Störungsmeldungen laufen über die Verkehrsauskunft Österreich (VAO), die ÖffiGo als Schülerprojekt unterstützt. Echtzeit kommt von den Betreibern, wo sie sie liefern. Die Pünktlichkeits-Auswertung deckt derzeit Wien und die Steiermark ab.",
  },
  appStoreUrl: null,
  websiteUrl: "https://oeffigo.app",
  liveUrl: { en: "https://oeffigo.app/en/puenktlichkeit/", de: "https://oeffigo.app/puenktlichkeit/" },
  statusUrl: "https://status.oeffigo.app/",
  newUrl: { en: "https://oeffigo.app/en/neu/", de: "https://oeffigo.app/neu/" },
  betaUrl: { en: "https://oeffigo.app/en/#beta", de: "https://oeffigo.app/#beta" },
  icon: "/projects/oeffigo/icon.webp",
  shots: [
    {
      src: "/projects/oeffigo/today-praterstern.webp",
      alt: {
        en: "ÖffiGo Today on iPhone near Wien Praterstern: the next two U2 trains and the O tram with live delays, a saved route and the nearby map.",
        de: "ÖffiGo Heute auf dem iPhone beim Wiener Praterstern: die nächsten zwei U2 und der O-Wagen mit Live-Verspätung, eine gespeicherte Route und die Umgebungskarte.",
      },
      caption: { en: "Today", de: "Heute" },
    },
    {
      src: "/projects/oeffigo/departures-praterstern.webp",
      alt: {
        en: "ÖffiGo departures at Wien Praterstern: U2, O tram, buses 80A and 5B and tram 5, each marked on time or with its delay.",
        de: "ÖffiGo Abfahrten am Wiener Praterstern: U2, O-Wagen, die Busse 80A und 5B und die Linie 5, jeweils mit pünktlich oder Verspätung.",
      },
      caption: { en: "Departures", de: "Abfahrten" },
    },
    {
      src: "/projects/oeffigo/trip-praterstern.webp",
      alt: {
        en: "ÖffiGo trip view of a U2 to Karlsplatz: the stops after Praterstern with their times, the delay shown at the stop just passed.",
        de: "ÖffiGo Fahrtverlauf einer U2 zum Karlsplatz: die Halte nach dem Praterstern mit Zeiten, die Verspätung beim gerade passierten Halt.",
      },
      caption: { en: "Trip", de: "Fahrtverlauf" },
    },
    {
      src: "/projects/oeffigo/routes-praterstern.webp",
      alt: {
        en: "ÖffiGo connections from Wien Praterstern to Wien Schönbrunn: three options via U1 and U4 with live status, transfer time and fare.",
        de: "ÖffiGo Verbindungen vom Wiener Praterstern nach Wien Schönbrunn: drei Varianten über U1 und U4 mit Live-Status, Umstiegszeit und Preis.",
      },
      caption: { en: "Connections", de: "Verbindungen" },
    },
  ],
  support: {
    en: "Verkehrsauskunft Österreich supports ÖffiGo as a school project with access to its services.",
    de: "Die Verkehrsauskunft Österreich unterstützt ÖffiGo als Schülerprojekt mit Zugang zu ihren Diensten.",
  },
  liveProof: {
    eyebrow: { en: "where the time comes from", de: "woher die zeit kommt" },
    title: { en: "Every time says where it comes from.", de: "Jede Zeit sagt, woher sie kommt." },
    body: {
      en: "A departure time comes from the operator or from the timetable. In the app every row says which one applies.",
      de: "Eine Abfahrtszeit kommt vom Verkehrsbetrieb oder aus dem Fahrplan. In der App steht bei jeder Zeile, was gerade gilt.",
    },
    stats: [
      { en: "Real time: the time comes from the operator and keeps updating, wherever the operator provides it", de: "Echtzeit: die Zeit kommt vom Verkehrsbetrieb und wird laufend aktualisiert, überall dort, wo er sie liefert" },
      { en: "Timetable: nobody supplies real time for this trip, so you see the timetable, and ÖffiGo says so", de: "Fahrplan: für diese Fahrt liefert niemand Echtzeit, also steht da der Fahrplan, und ÖffiGo sagt das dazu" },
      { en: "Later: ÖffiGo's own forecast from real time and measured punctuality, always next to the official time. It is in development.", de: "Später: eine eigene Prognose von ÖffiGo aus Echtzeit und gemessener Pünktlichkeit, immer neben der offiziellen Zeit. Sie ist in Entwicklung." },
    ],
    liveLabel: { en: "How punctual is your line?", de: "Wie pünktlich ist deine Linie?" },
    statusLabel: { en: "System status", de: "Systemstatus" },
  },
  features: [
    {
      icon: ICONS.clock,
      title: { en: "Departures", de: "Abfahrten" },
      body: {
        en: "Your stop with every line, delays, platform changes and cancellations, and a label on each time saying whether it is real time or timetable.",
        de: "Deine Haltestelle mit allen Linien, Verspätungen, Steigwechseln und Ausfällen, und an jeder Zeit steht, ob sie Echtzeit oder Fahrplan ist.",
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
    headline: { en: "Closed beta on the iPhone", de: "Geschlossene Beta auf dem iPhone" },
    body: {
      en: "ÖffiGo runs as a TestFlight beta. You can request a beta place at oeffigo.app; there is no guarantee of one. The app is in German.",
      de: "ÖffiGo läuft als TestFlight-Beta. Auf oeffigo.app kannst du einen Beta-Platz anfragen, eine Zusage gibt es nicht. Die App ist auf Deutsch.",
    },
    note: {
      en: "Free during the beta. What applies after that is not decided yet.",
      de: "Während der Beta kostenlos. Was danach gilt, ist noch offen.",
    },
    ctaLabel: { en: "Request a beta place", de: "Beta-Platz anfragen" },
    newLabel: { en: "What's new in the beta", de: "Neu in der Beta" },
  },
};
