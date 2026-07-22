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
    /** Substring of `title` rendered with the signature gradient. */
    titleAccent?: string;
    body: string;
    proof: string;
    primaryAction: string;
    secondaryAction: string;
    contactAction: string;
    githubAction: string;
  };
  skills: {
    eyebrow: string;
    title: string;
    groups: { title: string; items: string[] }[];
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ServiceItem[];
  };
  faq: {
    eyebrow: string;
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
    { label: "Skills", href: "#skills" },
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
    eyebrow: "student developer / austria",
    title: "Building useful tools before the idea gets boring.",
    titleAccent: "useful",
    body: "I'm a student at HTL Kaindorf in Austria. I build macOS apps, automations, websites, and small CLI tools that turn annoying technical problems into something usable.",
    proof: "native macOS apps · shipped GitHub releases · TypeScript / Swift / Python",
    primaryAction: "View projects",
    secondaryAction: "Services",
    contactAction: "Contact",
    githubAction: "GitHub",
  },
  skills: {
    eyebrow: "skills",
    title: "Tools and areas I work with.",
    groups: [
      {
        title: "Native and web build work",
        items: ["TypeScript", "Swift", "Python", "Astro", "macOS utilities", "CLI tools"],
      },
      {
        title: "Developer automation",
        items: ["Browser automation", "Document workflows", "GitHub releases", "Local-first agent tooling"],
      },
      {
        title: "AI-assisted tooling",
        items: ["Codex", "OpenClaw", "Claude Code", "Provider-aware workflows", "Debugging real device/app problems"],
      },
    ],
  },
  services: {
    eyebrow: "services",
    title: "What I can help with.",
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
    eyebrow: "faq",
    title: "Frequently asked questions.",
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
    title: "Student, builder, fast learner.",
    body: "I live in Austria and study at HTL Kaindorf. I love programming, especially when a project solves a real problem or makes a technical workflow easier. I build with TypeScript, Swift, Python, and AI-assisted workflows, but in the end what counts is the finished tool, not the stack it's built on.",
  },
  contact: {
    eyebrow: "contact",
    title: "Get in touch.",
    note: "Need a website, a repair, tech support, or a small custom tool? Send me a message below, or reach out via email, LinkedIn, or GitHub.",
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
    { label: "Skills", href: "#skills" },
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
    title: "Nützliche Tools bauen, bevor die Idee langweilig wird.",
    titleAccent: "Nützliche",
    body: "Ich bin Schüler an der HTL Kaindorf in Österreich. Ich baue macOS-Apps, Automatisierungen, Websites und kleine Tools – und helfe in der Südost-Steiermark bei Reparatur und Technik-Problemen.",
    proof: "native macOS-Apps · veröffentlichte GitHub-Releases · TypeScript / Swift / Python",
    primaryAction: "Projekte ansehen",
    secondaryAction: "Leistungen",
    contactAction: "Kontakt",
    githubAction: "GitHub",
  },
  skills: {
    eyebrow: "skills",
    title: "Womit ich arbeite.",
    groups: [
      {
        title: "Native- und Web-Entwicklung",
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
    eyebrow: "leistungen",
    title: "Womit ich Ihnen helfen kann.",
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
    eyebrow: "faq",
    title: "Häufige Fragen.",
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
    title: "Schüler, Macher, schneller Lerner.",
    body: "Ich lebe in der Südost-Steiermark und besuche die HTL Kaindorf. Ich liebe das Programmieren – besonders, wenn ein Projekt ein echtes Problem löst oder einen Ablauf einfacher macht. Ich arbeite mit TypeScript, Swift, Python und KI-gestützten Workflows, aber am Ende zählt das fertige Tool, nicht der Stack dahinter.",
  },
  contact: {
    eyebrow: "kontakt",
    title: "Melden Sie sich.",
    note: "Sie brauchen eine Website, eine Reparatur, technischen Support oder ein kleines individuelles Tool? Schreiben Sie mir direkt hier – oder per E-Mail, LinkedIn oder GitHub.",
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
