import { publicProjects } from "@/data/projects";
import { toCanonicalUrl } from "@/data/siteMetadata";

const homeAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/")}" />`;

const projectAlternates = (slug: string) => `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl(`/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl(`/de/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl(`/projects/${slug}/`)}" />`;

const oeffigoAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/oeffigo/")}" />`;

const urls = [
  { path: "/", priority: "1.0", alternates: homeAlternates },
  { path: "/de/", priority: "1.0", alternates: homeAlternates },
  { path: "/oeffigo/", priority: "0.9", alternates: oeffigoAlternates },
  { path: "/de/oeffigo/", priority: "0.8", alternates: oeffigoAlternates },
  ...publicProjects.flatMap((project) => [
    { path: `/projects/${project.slug}/`, priority: "0.8", alternates: projectAlternates(project.slug) },
    { path: `/de/projects/${project.slug}/`, priority: "0.7", alternates: projectAlternates(project.slug) },
  ]),
  // German-only legal pages: indexable, but no locale alternates.
  { path: "/impressum/", priority: "0.3", alternates: "" },
  { path: "/datenschutz/", priority: "0.3", alternates: "" },
];

export function GET() {
  const lastmod = new Date().toISOString().split("T")[0];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${toCanonicalUrl(url.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>${url.alternates}
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
