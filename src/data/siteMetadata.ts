export const canonicalOrigin = "https://www.johannesgrof.me";

export const defaultSocialImage = "/og.png";

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
