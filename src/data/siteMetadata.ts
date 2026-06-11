export const canonicalOrigin = "https://www.johannesgrof.me";

export const defaultSocialImage = "/og.png";

export const toCanonicalUrl = (path: string) => new URL(path, canonicalOrigin).toString();
