export const canonicalOrigin = "https://www.johannesgrof.me";

// The branded link-preview cards, one per locale — both 1200×630, both built
// from tools/brand/card.html. A project page with a usable screenshot passes
// its own image instead; everything else falls back to these.
export const socialCard = {
  en: {
    src: "/og-card.png",
    alt: "Johannes Grof — software developer in Styria, Austria",
  },
  de: {
    src: "/og-card-de.png",
    alt: "Johannes Grof — Softwareentwickler aus der Südost-Steiermark",
  },
} as const;

export const toCanonicalUrl = (path: string) => new URL(path, canonicalOrigin).toString();

export const author = {
  name: "Johannes Grof",
  email: "contact@johannesgrof.me",
  region: "Südost-Steiermark, Österreich",
} as const;

// Entity graph for Google: the profiles/products that represent the same maker.
// Including https://oeffigo.app is what ties this site and the ÖffiGo product
// site together as one entity (reciprocated by oeffigo.app's own sameAs).
export const personSameAs = [
  "https://oeffigo.app",
  "https://github.com/jx-grxf",
] as const;
