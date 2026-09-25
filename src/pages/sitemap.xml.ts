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

export function GET() {
  // Only publish modification dates when we can derive them from changes to
  // each rendered page. Deploy dates and GitHub push dates are not that signal.
  const urls = [
    { path: "/", alternates: homeAlternates },
    { path: "/de/", alternates: homeAlternates },
    { path: "/oeffigo/", alternates: oeffigoAlternates },
    { path: "/de/oeffigo/", alternates: oeffigoAlternates },
    ...publicProjects.flatMap((project) => [
      { path: `/projects/${project.slug}/`, alternates: projectAlternates(project.slug) },
      { path: `/de/projects/${project.slug}/`, alternates: projectAlternates(project.slug) },
    ]),
    // German-only legal pages: indexable, but no locale alternates.
    { path: "/impressum/", alternates: "" },
    { path: "/datenschutz/", alternates: "" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${toCanonicalUrl(url.path)}</loc>${url.alternates}
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
