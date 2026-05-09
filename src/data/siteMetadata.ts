export const canonicalOrigin = "https://www.johannesgrof.me";

export const defaultSocialImage = "/projects/slamx/monitor-dash.webp";

export const toCanonicalUrl = (path: string) => new URL(path, canonicalOrigin).toString();
