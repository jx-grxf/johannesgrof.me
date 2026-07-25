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
    /** Unit for the shipped-project counter, e.g. "projects in public". */
    factsCountLabel: string;
    facts: string[];
    primaryAction: string;
    secondaryAction: string;
    contactAction: string;
  };
  oeffigo: {
    eyebrow: string;
    detailCta: string;
  };
  projects: {
    title: string;
    /** Unit for the total row count shown next to the section title. */
    countLabel: string;
    highlights: string;
    comingSoon: string;
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
  success: string;
  error: string;
  rateLimited: string;
}

const en: LocaleContent = {
  lang: "en",
  ogLocale: "en_US",
  meta: {
    title: "Johannes Grof - Student Developer in Austria",
    description:
      "Portfolio of Johannes Grof, an HTL Kaindorf student in Austria building iOS and macOS apps, developer tools, automations and websites, and offering tech support.",
  },
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  langSwitch: {
    label: "DE",
    href: "/de/",
    ariaLabel: "Diese Seite auf Deutsch ansehen",
  },
  hero: {
    eyebrow: "software developer / styria, austria",
    title: "Software that does one thing, properly.",
    titleAccent: "one thing",
    body: "I'm a developer from south-east Styria and a student at HTL Kaindorf. I build macOS and iOS apps, developer tools and automations — and I help people nearby with websites, repairs and everyday technology.",
    factsCountLabel: "projects in public",
    facts: ["macOS · iOS · CLI", "TypeScript · Swift · Python", "Styria, Austria"],
    primaryAction: "See the projects",
    secondaryAction: "What I do",
    contactAction: "Contact",
  },
  oeffigo: {
    eyebrow: "flagship",
    detailCta: "ÖffiGo in detail",
  },
  projects: {
    title: "Projects",
    countLabel: "entries",
    highlights: "highlights",
    comingSoon: "coming soon",
  },
  skills: {
    title: "What I work with",
    groups: [
      {
        title: "Native and web",
        items: ["TypeScript", "Swift", "Python", "Astro", "macOS utilities", "CLI tools"],
      },
      {
        title: "Automation",
        items: ["Browser automation", "Document workflows", "GitHub releases", "Local-first agent tooling"],
      },
      {
        title: "AI-assisted tooling",
        items: ["Codex", "OpenClaw", "Claude Code", "Provider-aware workflows", "Debugging real device problems"],
      },
    ],
  },
  services: {
    title: "What I can help with",
    lead: "Based in south-east Styria, Austria — on-site nearby, remote everywhere else.",
    items: [
      {
        title: "Website development & hosting",
        body: "Modern, fast portfolio, business, and club websites — built with hosting, domain setup, and ongoing maintenance in mind, so everything runs from one place.",
      },
      {
        title: "Electronics repair & setup",
        body: "PC and Mac repair, setting up new devices, printers and peripherals, getting things running again.",
      },
      {
        title: "Technical support / IT help",
        body: "Fixing everyday tech problems, backups, updates, and clear advice without the jargon.",
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
        q: "What does Johannes Grof do?",
        a: "I'm a software developer and student at HTL Kaindorf in Austria. I build macOS apps, developer tools, and websites, and I also offer electronics repair and technical support.",
      },
      {
        q: "Do you work remotely?",
        a: "Yes. Websites, tools, and tech support can be done remotely worldwide. On-site repair and setup is available in south-east Styria, Austria.",
      },
      {
        q: "How much does a website cost?",
        a: "It depends on scope — hosting, domain, and maintenance can all be part of it. Send me a short message about what you need and I'll get back to you.",
      },
      {
        q: "How can I reach you?",
        a: "By email at contact@johannesgrof.me, or via LinkedIn and GitHub.",
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
    note: "Need a website, a repair, tech support, or a small custom tool? Send me a message below, or reach out by email.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "What can I help you with?",
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks — your message is on its way. I'll get back to you soon.",
      error: "Something went wrong. Please try again or email contact@johannesgrof.me.",
      rateLimited: "Too many requests. Please wait a few minutes, or email contact@johannesgrof.me.",
    },
  },
};

const de: LocaleContent = {
  lang: "de-AT",
  ogLocale: "de_AT",
  meta: {
    title: "Johannes Grof - Softwareentwickler & Tech-Support aus der Südost-Steiermark",
    description:
      "Johannes Grof aus der Südost-Steiermark: Softwareentwickler und HTL-Kaindorf-Schüler. Websites, iOS- und macOS-Apps, individuelle Tools sowie Elektronik-Reparatur und technischer Support.",
  },
  nav: [
    { label: "Projekte", href: "#projects" },
    { label: "ÖffiGo", href: "#oeffigo" },
    { label: "Leistungen", href: "#services" },
    { label: "Über mich", href: "#about" },
    { label: "Kontakt", href: "#contact" },
  ],
  langSwitch: {
    label: "EN",
    href: "/",
    ariaLabel: "View this page in English",
  },
  hero: {
    eyebrow: "softwareentwickler / südost-steiermark",
    title: "Software, die eine Sache richtig macht.",
    titleAccent: "eine Sache",
    body: "Ich bin Entwickler aus der Südost-Steiermark und Schüler an der HTL Kaindorf. Ich baue macOS- und iOS-Apps, Developer-Tools und Automatisierungen — und helfe in der Umgebung bei Websites, Reparaturen und alltäglicher Technik.",
    factsCountLabel: "veröffentlichte Projekte",
    facts: ["macOS · iOS · CLI", "TypeScript · Swift · Python", "Steiermark, Österreich"],
    primaryAction: "Projekte ansehen",
    secondaryAction: "Leistungen",
    contactAction: "Kontakt",
  },
  oeffigo: {
    eyebrow: "hauptprojekt",
    detailCta: "ÖffiGo im Detail",
  },
  projects: {
    title: "Projekte",
    countLabel: "Einträge",
    highlights: "highlights",
    comingSoon: "bald verfügbar",
  },
  skills: {
    title: "Womit ich arbeite",
    groups: [
      {
        title: "Native und Web",
        items: ["TypeScript", "Swift", "Python", "Astro", "macOS-Tools", "CLI-Tools"],
      },
      {
        title: "Automatisierung",
        items: ["Browser-Automatisierung", "Dokument-Workflows", "GitHub-Releases", "Local-first Agent-Tooling"],
      },
      {
        title: "KI-gestützte Tools",
        items: ["Codex", "OpenClaw", "Claude Code", "Provider-bewusste Workflows", "Geräte- & App-Probleme lösen"],
      },
    ],
  },
  services: {
    title: "Womit ich Ihnen helfen kann",
    lead: "Standort Südost-Steiermark — vor Ort in der Umgebung, sonst österreichweit remote.",
    items: [
      {
        title: "Website-Erstellung & Hosting",
        body: "Moderne, schnelle Portfolio-, Business- und Vereinsseiten — gleich mit Hosting, Domain und laufender Wartung gedacht, damit alles aus einer Hand läuft.",
      },
      {
        title: "Elektronik-Reparatur & Einrichtung",
        body: "PC- und Mac-Reparatur, neue Geräte aufsetzen, Drucker und Zubehör einrichten, alles wieder zum Laufen bringen.",
      },
      {
        title: "Technischer Support / IT-Hilfe",
        body: "Alltägliche Technik-Probleme lösen, Backups, Updates und verständliche Beratung ohne Fachchinesisch.",
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
        q: "Was macht Johannes Grof?",
        a: "Ich bin Softwareentwickler und Schüler an der HTL Kaindorf in Österreich. Ich baue macOS-Apps, Developer-Tools und Websites und biete außerdem Elektronik-Reparatur und technischen Support an.",
      },
      {
        q: "Arbeiten Sie auch vor Ort in der Steiermark?",
        a: "Ja. Reparatur und Geräte-Einrichtung mache ich vor Ort in der Südost-Steiermark. Websites, Tools und Support gehen auch österreichweit remote.",
      },
      {
        q: "Was kostet eine Website?",
        a: "Das hängt vom Umfang ab – Hosting, Domain und Wartung können alles dabei sein. Schreiben Sie mir kurz, was Sie brauchen, und ich melde mich.",
      },
      {
        q: "Wie erreiche ich Sie?",
        a: "Per E-Mail an contact@johannesgrof.me oder über LinkedIn und GitHub.",
      },
    ],
  },
  about: {
    eyebrow: "über mich",
    title: "Die Kurzfassung.",
    body: "Ich lebe in der Südost-Steiermark und besuche die HTL Kaindorf. Das meiste, was ich baue, fängt als eigenes Problem an: ein Ablauf mit zu vielen Schritten, ein Gerät, das nicht will, eine App, die es geben sollte und nicht gibt. Ich arbeite mit TypeScript, Swift und Python — wichtiger als der Stack ist aber, ob das fertige Ding am Ende wirklich verwendet wird.",
  },
  contact: {
    eyebrow: "kontakt",
    title: "Melden Sie sich.",
    note: "Sie brauchen eine Website, eine Reparatur, technischen Support oder ein kleines individuelles Tool? Schreiben Sie mir direkt hier oder per E-Mail.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Ihr Name",
      emailLabel: "E-Mail",
      emailPlaceholder: "sie@beispiel.at",
      messageLabel: "Nachricht",
      messagePlaceholder: "Wobei kann ich Ihnen helfen?",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
      success: "Danke – Ihre Nachricht ist unterwegs. Ich melde mich bald.",
      error: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder an contact@johannesgrof.me schreiben.",
      rateLimited: "Zu viele Anfragen. Bitte ein paar Minuten warten oder an contact@johannesgrof.me schreiben.",
    },
  },
};

export const siteContentByLocale: Record<Locale, LocaleContent> = { en, de };

// Backward-compatible default (English) for any importer that expects the old shape.
export const siteContent = en;
