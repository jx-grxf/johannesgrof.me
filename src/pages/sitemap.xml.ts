import { publicProjects } from "@/data/projects";
import { toCanonicalUrl } from "@/data/siteMetadata";

const homeAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/")}" />`;

const urls = [
  { path: "/", priority: "1.0", alternates: homeAlternates },
  { path: "/de/", priority: "1.0", alternates: homeAlternates },
  ...publicProjects.map((project) => ({ path: `/projects/${project.slug}/`, priority: "0.8", alternates: "" })),
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
