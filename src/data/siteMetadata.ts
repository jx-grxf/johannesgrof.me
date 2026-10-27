export const canonicalOrigin = "https://johannesgrof.me";

// The branded link-preview cards, one per locale — both 1200×630, both built
// from tools/brand/card.html. A project page with a usable screenshot passes
// its own image instead; everything else falls back to these. The ?v= query is
// bumped with every new card, otherwise LinkedIn and others keep the old one.
export const socialCard = {
  en: {
    src: "/og-card.png?v=2026-10-27",
    alt: "Johannes Grof with his apps ÖffiGo, PortPirate, BriskEdit, dirhop, NotchTray, CSwap and Kontobuch",
  },
  de: {
    src: "/og-card-de.png?v=2026-10-27",
    alt: "Johannes Grof mit seinen Apps ÖffiGo, PortPirate, BriskEdit, dirhop, NotchTray, CSwap und Kontobuch",
  },
} as const;

export const toCanonicalUrl = (path: string) => new URL(path, canonicalOrigin).toString();

export const author = {
  name: "Johannes Grof",
  email: "contact@johannesgrof.me",
  region: "Südost-Steiermark, Österreich",
} as const;

// Profile pages for the same person. The ÖffiGo app is linked via its creator
// field on the SoftwareApplication entity, not as another identity for Johannes.
export const personSameAs = [
  "https://github.com/jx-grxf",
  "https://www.linkedin.com/in/johannes-grof",
  "https://x.com/johannesgrofdev",
] as const;
