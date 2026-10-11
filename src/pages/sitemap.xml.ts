import { publicProjects } from "@/data/projects";
import { toCanonicalUrl } from "@/data/siteMetadata";

const homeAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/")}" />`;

const catalogueAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/projects/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/projects/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/projects/")}" />`;

const projectAlternates = (slug: string) => `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl(`/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl(`/de/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl(`/projects/${slug}/`)}" />`;

const oeffigoAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/oeffigo/")}" />`;

const hiAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/hi/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/hi/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/hi/")}" />`;

const usesAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/uses/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/uses/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/uses/")}" />`;

export function GET() {
  // Updated when page content or its shared template changes significantly.
  // Daily GitHub metadata rebuilds must not advance this date.
  const contentRevision = "2026-10-04";
  const homeRevision = "2026-10-06";
  const urls = [
    { path: "/", alternates: homeAlternates, lastmod: homeRevision },
    { path: "/de/", alternates: homeAlternates, lastmod: homeRevision },
    { path: "/oeffigo/", alternates: oeffigoAlternates },
    { path: "/de/oeffigo/", alternates: oeffigoAlternates },
    { path: "/uses/", alternates: usesAlternates, lastmod: "2026-10-11" },
    { path: "/de/uses/", alternates: usesAlternates, lastmod: "2026-10-11" },
    { path: "/hi/", alternates: hiAlternates, lastmod: "2026-10-11" },
    { path: "/de/hi/", alternates: hiAlternates, lastmod: "2026-10-11" },
    { path: "/projects/", alternates: catalogueAlternates, lastmod: contentRevision },
    { path: "/de/projects/", alternates: catalogueAlternates, lastmod: contentRevision },
    ...publicProjects.flatMap((project) => [
      { path: `/projects/${project.slug}/`, alternates: projectAlternates(project.slug), lastmod: contentRevision },
      { path: `/de/projects/${project.slug}/`, alternates: projectAlternates(project.slug), lastmod: contentRevision },
    ]),
    // German-only legal pages: indexable, but no locale alternates.
    { path: "/impressum/", alternates: "", lastmod: contentRevision },
    { path: "/datenschutz/", alternates: "" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${toCanonicalUrl(url.path)}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}${url.alternates}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
