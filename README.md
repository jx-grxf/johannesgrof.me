<div align="center">

# johannesgrof.me

Personal website and project portfolio.

[![Astro](https://img.shields.io/badge/Astro-7.x-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Website](https://img.shields.io/badge/website-johannesgrof.me-111111?style=flat-square)](https://johannesgrof.me)
[![License](https://img.shields.io/badge/license-all%20rights%20reserved-lightgrey?style=flat-square)](#license)

[Website](https://johannesgrof.me) · [GitHub](https://github.com/jx-grxf)

</div>

## Overview

This repository contains the source for my personal portfolio website: a small, fast Astro site with a bilingual project catalogue and a contact form. Everything is prerendered except the contact endpoint, which runs as a single on-demand function on Vercel. DNS is Cloudflare.

## Highlights

| Feature | Description |
| --- | --- |
| Selected work | Real screenshots for ÖffiGo, Kontobuch, BriskEdit and MacPhone; smaller projects live in the complete catalogue. |
| Project pages | Explain the problem and implementation, with release links and clear availability. |
| Static-first build | Astro renders the portfolio as a fast static site with Vercel deployment. |
| GitHub metadata | Build-time GitHub API data enriches release, update, and download surfaces with safe fallbacks. |
| Bilingual | Portfolio pages exist in English and German with hreflang alternates; legal pages are German-only. |

## Discovery files

`robots.txt` links to the sitemap. The sitemap lists the canonical English and German URLs and their hreflang pairs. The sitemap records the 2026-10-04 content revision for the changed homepages, catalogue, project template and imprint. Advance that date only for a significant content or template change, never for a daily metadata rebuild. Unchanged pages omit `lastmod`. `llms.txt` offers a short page directory for services that read it, and `humans.txt` names the site author. Neither text file is a substitute for the HTML pages or a Google ranking signal.

Both homepages show Kontobuch as its own product section and describe it with `SoftwareApplication` structured data referencing Johannes as its creator. Kontobuch keeps its own canonical URL and sitemap on its subdomain.

## Selected Projects

| Project | Presentation |
| --- | --- |
| [ÖffiGo](https://johannesgrof.me/oeffigo/) | Main iPhone and Apple Watch project, shown with a beta screenshot. |
| [Kontobuch](https://kontobuch.johannesgrof.me/) | Free accounting notebook for HAK and HTL, shown with a real demonstration notebook. |
| [BriskEdit](https://johannesgrof.me/projects/briskedit/) | Native Mac editor, with an interface capture and release links. |
| [MacPhone](https://johannesgrof.me/projects/macphone/) | Bluetooth device testing through an emulator, with a real application capture. |
| [poise](https://johannesgrof.me/projects/poise/) | AirPods posture coaching, included in the smaller selected work. |
| [agent-presence](https://johannesgrof.me/projects/agent-presence/) | Cross-platform coding-agent presence, with platform and architecture choices. |
| [Caruso-Reborn](https://johannesgrof.me/projects/caruso-reborn/) | Internet radio for older hi-fi hardware; packaged Mac application in beta. |

Other projects retain their individual URLs and are listed in the complete catalogue.

## Project catalogue and interactions

The homepages show selected work. `/projects/` and `/de/projects/` keep the full catalogue, including experiments and archived work. Filtering uses the `q` query parameter so a selection can be linked and restored after navigation. The complete list and all project links remain visible without JavaScript.

Download metadata separates the operating system, architecture and file format. Windows ZIPs and Linux tarballs are classified from their target names; Mac archives without a target use an explicit single-project platform. Source archives, updater feeds and checksums are excluded from application choices. No aggregate download count is shown: GitHub asset requests are not unique users or installations.

FAQ and download choices use native `details` elements. Download menus restore keyboard focus on Escape. Demo videos play only on request, so reduced-motion preferences and a deliberate pause are respected. The original bilingual slogan remains unchanged and is fully visible on arrival. Project rows retain directional hover feedback; screenshots move subtly on desktop pointers. Reduced-motion mode keeps these interactions static.

The Kontobuch screenshot is captured from its public demonstration mode using an example cash transfer. Product media should show an actual interface rather than a generated illustration. Keep the image dimensions and lazy loading when replacing captures.

Dependency overrides keep the serializer and cache-policy packages on intentionally selected versions. Run the tests, build and production dependency audit when changing them. A clean package audit does not by itself establish an application vulnerability or its remediation.

## Stack

| Part | Technology |
| --- | --- |
| Framework | Astro |
| Language | TypeScript |
| Styling | CSS |
| Contact form | Vercel function, Resend, Upstash rate limiting |
| Deployment | Vercel |
| DNS | Cloudflare |

## Getting Started

Requirements:

- Node.js 22 or newer
- npm 10 or newer

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Astro dev server. |
| `npm run check` | Runs Astro and TypeScript diagnostics. |
| `npm test` | Checks Turnstile verification and release asset classification. |
| `npm run build` | Checks and builds the production site. |
| `npm run preview` | Previews the production build locally. |

## Project Structure

```text
src/
  components/ Shared head, header, footer, and project detail markup
  data/       Site copy and project data
  layouts/    Page shells
  pages/      Astro pages and the contact API route
  styles/     Global styling
public/       Static assets, robots, icons
```

## Deployment

The site is deployed with Vercel. Production builds use:

```bash
npm run build
```

The canonical host is `johannesgrof.me`. In Vercel project settings, the apex domain must have no redirect and `www.johannesgrof.me` must redirect to `johannesgrof.me` with status 308. Keep the matching host rules in `vercel.json` aligned with these settings. Both domains must remain assigned to the project.

### Build environment

| Variable | Needed for |
| --- | --- |
| `GITHUB_TOKEN` | Build-time GitHub lookups. Without it the build is limited to 60 requests an hour and logs a warning and falls back to the checked-in metadata; use a fine-grained token with read-only access to public repositories. |
| `RESEND_API_KEY` | Sending contact-form mail. |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile widget key, embedded at build time. |
| `TURNSTILE_SECRET` | Server-only Turnstile verification secret. Required before contact messages can be sent. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Per-IP rate limiting on the contact endpoint. Production refuses submissions when they are missing. |

The contact widget uses managed mode and the `turnstile-spin-v2` action. Register the production hostname and the exact preview branch hostname in Cloudflare; deployment-specific Vercel URLs need their own hostname registration. The backend verifies the token, hostname, and action before calling Resend. Keep the secret in Vercel's secret store and an ignored local environment file.

For browser automation, use [Cloudflare's official test sitekeys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) locally and mock mail delivery. Never put test keys in production. Run `npm test` for token-validation regression tests and `npm run build` before deploying.

## License

All rights reserved. The source is public for transparency and to understand the frontend/backend, but reuse is not licensed without permission.
