export type Locale = "en" | "de";

/** One stack group, proven by the projects that use it. */
export interface StackGroup {
  title: string;
  items: string[];
  /** Project slugs, or "oeffigo" / "kontobuch" for the two products. */
  proof: string[];
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
    primaryAction: string;
    contactAction: string;
    status: {
      now: string;
      nowValue: string;
      push: string;
      stack: string;
      stackValue: string;
      clock: string;
    };
  };
  oeffigo: {
    eyebrow: string;
    detailCta: string;
  };
  more: {
    title: string;
    catalogue: string;
    catalogueAction: string;
  };
  stack: {
    title: string;
    lead: string;
    proofLabel: string;
    groups: StackGroup[];
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
    elsewhere: string;
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
    title: "Johannes Grof | Apps and developer tools",
    description:
      "Portfolio of Johannes Grof, an HTL Kaindorf student in Austria building iOS and macOS apps, web projects and developer tools.",
  },
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Stack", href: "#services" },
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
    primaryAction: "See the projects",
    contactAction: "Contact",
    status: {
      now: "Working on",
      nowValue: "ÖffiGo, TestFlight beta",
      push: "Last push",
      stack: "Stack",
      stackValue: "Swift · TypeScript · Rust",
      clock: "Local time",
    },
  },
  oeffigo: {
    eyebrow: "My main project",
    detailCta: "ÖffiGo in detail",
  },
  more: {
    title: "More of my work",
    catalogue: "Smaller tools, experiments and older projects are in the catalogue.",
    catalogueAction: "All projects",
  },
  stack: {
    title: "Stack",
    lead: "What I work with, and where you can see it. Every line links to a project that uses it.",
    proofLabel: "Used in",
    groups: [
      {
        title: "iPhone and Mac",
        items: ["Swift", "SwiftUI", "AppKit", "Menu bar apps", "Bluetooth LE"],
        proof: ["oeffigo", "briskedit", "macphone", "poise"],
      },
      {
        title: "Web",
        items: ["TypeScript", "Astro", "Vite", "Vercel", "Cloudflare"],
        proof: ["kontobuch", "tools", "johannesgrof-me"],
      },
      {
        title: "CLI and tools",
        items: ["Rust", "Python", "Node", "Local LLMs"],
        proof: ["agent-presence", "ip-multitool", "patchpilot"],
      },
      {
        title: "Shipping",
        items: ["Code signing", "Notarisation", "Sparkle updates", "GitHub Actions"],
        proof: ["briskedit", "bottlelite"],
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
    elsewhere: "Elsewhere",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "What’s it about?",
      submit: "Send message",
      sending: "Sending…",
    },
  },
};

const de: LocaleContent = {
  lang: "de-AT",
  ogLocale: "de_AT",
  meta: {
    title: "Johannes Grof | Apps und Entwickler-Tools",
    description:
      "Johannes Grof aus der Südost-Steiermark: Softwareentwickler und HTL-Kaindorf-Schüler. iOS- und macOS-Apps, Web-Projekte und Entwickler-Tools.",
  },
  nav: [
    { label: "Projekte", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Stack", href: "#services" },
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
    primaryAction: "Projekte ansehen",
    contactAction: "Kontakt",
    status: {
      now: "Gerade dran",
      nowValue: "ÖffiGo, TestFlight-Beta",
      push: "Zuletzt gepusht",
      stack: "Stack",
      stackValue: "Swift · TypeScript · Rust",
      clock: "Uhrzeit bei mir",
    },
  },
  oeffigo: {
    eyebrow: "Mein größtes Projekt",
    detailCta: "ÖffiGo im Detail",
  },
  more: {
    title: "Weitere Arbeiten",
    catalogue: "Kleine Tools, Experimente und ältere Projekte findest du im Katalog.",
    catalogueAction: "Alle Projekte",
  },
  stack: {
    title: "Stack",
    lead: "Womit ich arbeite und wo man es sieht. Jede Zeile verlinkt ein Projekt, das es verwendet.",
    proofLabel: "Steckt in",
    groups: [
      {
        title: "iPhone und Mac",
        items: ["Swift", "SwiftUI", "AppKit", "Menüleisten-Apps", "Bluetooth LE"],
        proof: ["oeffigo", "briskedit", "macphone", "poise"],
      },
      {
        title: "Web",
        items: ["TypeScript", "Astro", "Vite", "Vercel", "Cloudflare"],
        proof: ["kontobuch", "tools", "johannesgrof-me"],
      },
      {
        title: "CLI und Tools",
        items: ["Rust", "Python", "Node", "Lokale LLMs"],
        proof: ["agent-presence", "ip-multitool", "patchpilot"],
      },
      {
        title: "Ausliefern",
        items: ["Code-Signing", "Notarisierung", "Sparkle-Updates", "GitHub Actions"],
        proof: ["briskedit", "bottlelite"],
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
    elsewhere: "Sonst findest du mich hier",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Dein Name",
      emailLabel: "E-Mail",
      emailPlaceholder: "du@beispiel.at",
      messageLabel: "Nachricht",
      messagePlaceholder: "Worum geht’s?",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
    },
  },
};

export const siteContentByLocale: Record<Locale, LocaleContent> = { en, de };
