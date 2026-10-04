export type Locale = "en" | "de";

export interface ServiceItem {
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface LocaleContent {
  lang: string;
  ogLocale: string;
  meta: {
    title: string;
    description: string;
  };
  nav: NavItem[];
  langSwitch: {
    label: string;
    href: string;
    ariaLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    /** Substring of `title` rendered in the signal colour. */
    titleAccent?: string;
    body: string;
    facts: string[];
    primaryAction: string;
    contactAction: string;
  };
  oeffigo: {
    eyebrow: string;
    detailCta: string;
  };
  projects: {
    title: string;
    highlights: string;
  };
  skills: {
    title: string;
    groups: { title: string; items: string[] }[];
  };
  services: {
    title: string;
    lead: string;
    items: ServiceItem[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    note: string;
    form: ContactFormContent;
  };
}

export interface ContactFormContent {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  sending: string;
}

const en: LocaleContent = {
  lang: "en",
  ogLocale: "en_US",
  meta: {
    title: "Johannes Grof | Apps, websites and developer tools",
    description:
      "Portfolio of Johannes Grof, an HTL Kaindorf student in Austria building iOS and macOS apps, developer tools, automations and websites, and offering tech support.",
  },
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Tech", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  langSwitch: {
    label: "DE",
    href: "/de/",
    ariaLabel: "Diese Seite auf Deutsch ansehen",
  },
  hero: {
    eyebrow: "Hi, I’m Johannes. Developer and HTL student.",
    title: "Software that does one thing, properly.",
    titleAccent: "one thing",
    body: "I’m from south-east Styria and study at HTL Kaindorf. Most of my time goes into ÖffiGo and Kontobuch. I also build small tools for things I run into while working.",
    facts: ["Styria, Austria", "Swift · TypeScript · Rust", "macOS · iOS · Web"],
    primaryAction: "See the projects",
    contactAction: "Contact",
  },
  oeffigo: {
    eyebrow: "My main project",
    detailCta: "ÖffiGo in detail",
  },
  projects: {
    title: "Projects",
    highlights: "highlights",
  },
  skills: {
    title: "What I work with",
    groups: [
      {
        title: "Native and web",
        items: ["Swift", "SwiftUI", "AppKit", "TypeScript", "Rust", "Python", "Astro"],
      },
      {
        title: "Automation",
        items: ["CLI tools", "Browser automation", "Document workflows", "MCP servers", "Local-first agent tooling"],
      },
      {
        title: "Shipping",
        items: ["GitHub releases", "DMG packaging", "Notarization", "Sparkle update feeds", "GitHub Actions CI", "Static hosting & deploys"],
      },
    ],
  },
  services: {
    title: "What I can help with",
    lead: "Outside my software projects, I help people I know with websites, computers and everyday tech. These are the kinds of things I work on.",
    items: [
      {
        title: "Website development & hosting",
        body: "Building a website, connecting its domain and keeping it up to date.",
      },
      {
        title: "Electronics repair & setup",
        body: "PC and Mac repair, setting up new devices, printers and peripherals, getting things running again.",
      },
      {
        title: "Technical support / IT help",
        body: "Fixing everyday tech problems, backups and updates, explained in plain words.",
      },
      {
        title: "Custom tools & automation",
        body: "Small macOS utilities, scripts, and automations for when off-the-shelf software isn't enough.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Do you work remotely?",
        a: "Websites, tools and support: yes, anywhere. Repairs and device setup happen on site in south-east Styria.",
      },
      {
        q: "Can I try your apps?",
        a: "Kontobuch runs in your browser and has desktop downloads. ÖffiGo is in a closed TestFlight beta; you can join the waitlist on its website. The other project pages show their current availability.",
      },
      {
        q: "How can I reach you?",
        a: "contact@johannesgrof.me, or the form below. LinkedIn and GitHub work too.",
      },
    ],
  },
  about: {
    eyebrow: "about",
    title: "The short version.",
    body: "I live in south-east Styria and study at HTL Kaindorf. Most of what I build starts as a problem I ran into myself: a workflow that takes too many steps, a device that won't cooperate, an app that should exist and doesn't. I work with TypeScript, Swift and Python, but the stack matters less than whether the finished thing actually gets used.",
  },
  contact: {
    eyebrow: "contact",
    title: "Get in touch.",
    note: "Questions about a project, an idea or just something you want to tell me? Write here or send me an email.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "What can I help you with?",
      submit: "Send message",
      sending: "Sending…",
    },
  },
};

const de: LocaleContent = {
  lang: "de-AT",
  ogLocale: "de_AT",
  meta: {
    title: "Johannes Grof | Apps, Websites und Entwickler-Tools",
    description:
      "Johannes Grof aus der Südost-Steiermark: Softwareentwickler und HTL-Kaindorf-Schüler. Websites, iOS- und macOS-Apps, individuelle Tools sowie Elektronik-Reparatur und technischer Support.",
  },
  nav: [
    { label: "Projekte", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Technik", href: "#services" },
    { label: "Über mich", href: "#about" },
    { label: "Kontakt", href: "#contact" },
  ],
  langSwitch: {
    label: "EN",
    href: "/",
    ariaLabel: "View this page in English",
  },
  hero: {
    eyebrow: "Servus, ich bin Johannes. Entwickler und HTL-Schüler.",
    title: "Software, die eine Sache richtig macht.",
    titleAccent: "eine Sache",
    body: "Ich komme aus der Südost-Steiermark und besuche die HTL Kaindorf. Die meiste Zeit stecke ich in ÖffiGo und Kontobuch. Daneben baue ich kleine Tools für Dinge, die mir beim Arbeiten auffallen.",
    facts: ["Südost-Steiermark", "Swift · TypeScript · Rust", "macOS · iOS · Web"],
    primaryAction: "Projekte ansehen",
    contactAction: "Kontakt",
  },
  oeffigo: {
    eyebrow: "Mein größtes Projekt",
    detailCta: "ÖffiGo im Detail",
  },
  projects: {
    title: "Projekte",
    highlights: "auswahl",
  },
  skills: {
    title: "Womit ich arbeite",
    groups: [
      {
        title: "Native und Web",
        items: ["Swift", "SwiftUI", "AppKit", "TypeScript", "Rust", "Python", "Astro"],
      },
      {
        title: "Automatisierung",
        items: ["CLI-Tools", "Browser-Automatisierung", "Dokument-Workflows", "MCP-Server", "Local-first Agent-Tooling"],
      },
      {
        title: "Ausliefern",
        items: ["GitHub-Releases", "DMG-Packaging", "Notarisierung", "Sparkle-Update-Feeds", "GitHub Actions CI", "Static Hosting & Deploys"],
      },
    ],
  },
  services: {
    title: "Womit ich dir helfen kann",
    lead: "Neben meinen Softwareprojekten helfe ich in meinem Umfeld auch bei Websites, Computern und alltäglicher Technik. Mit diesen Themen beschäftige ich mich.",
    items: [
      {
        title: "Website-Erstellung & Hosting",
        body: "Eine Website aufsetzen, die Domain verbinden und die Seite aktuell halten.",
      },
      {
        title: "Elektronik-Reparatur & Einrichtung",
        body: "PC- und Mac-Reparatur, neue Geräte aufsetzen, Drucker und Zubehör einrichten, alles wieder zum Laufen bringen.",
      },
      {
        title: "Technischer Support / IT-Hilfe",
        body: "Alltägliche Technik-Probleme lösen, Backups und Updates, so erklärt, dass man es versteht.",
      },
      {
        title: "Individuelle Tools & Automatisierung",
        body: "Kleine macOS-Tools, Skripte und Automatisierungen, wenn Standardsoftware nicht ausreicht.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen",
    items: [
      {
        q: "Arbeitest du auch vor Ort in der Steiermark?",
        a: "Reparatur und Geräte-Einrichtung mache ich vor Ort in der Südost-Steiermark. Websites, Tools und Support gehen überall remote.",
      },
      {
        q: "Kann ich deine Apps ausprobieren?",
        a: "Kontobuch läuft im Browser und hat Desktop-Downloads. ÖffiGo ist in einer geschlossenen TestFlight-Beta; auf der Website kannst du dich auf die Warteliste setzen. Bei den anderen Projekten steht die Verfügbarkeit auf der jeweiligen Seite.",
      },
      {
        q: "Wie erreiche ich dich?",
        a: "contact@johannesgrof.me oder das Formular unten. LinkedIn und GitHub gehen auch.",
      },
    ],
  },
  about: {
    eyebrow: "über mich",
    title: "Die Kurzfassung.",
    body: "Ich lebe in der Südost-Steiermark und besuche die HTL Kaindorf. Das meiste, was ich baue, fängt als eigenes Problem an: ein Ablauf mit zu vielen Schritten, ein Gerät, das nicht will, eine App, die es geben sollte und nicht gibt. Ich arbeite mit TypeScript, Swift und Python. Wichtiger als der Stack ist aber, ob das fertige Ding am Ende wirklich verwendet wird.",
  },
  contact: {
    eyebrow: "kontakt",
    title: "Melde dich.",
    note: "Eine Frage zu einem Projekt, eine Idee oder einfach etwas, das du mir sagen möchtest? Schreib mir hier oder per E-Mail.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Dein Name",
      emailLabel: "E-Mail",
      emailPlaceholder: "du@beispiel.at",
      messageLabel: "Nachricht",
      messagePlaceholder: "Wobei kann ich dir helfen?",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
    },
  },
};

export const siteContentByLocale: Record<Locale, LocaleContent> = { en, de };

// Backward-compatible default (English) for any importer that expects the old shape.
export const siteContent = en;
