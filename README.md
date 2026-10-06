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
| Selected work | Real screenshots for ÖffiGo and Kontobuch, six further projects as an icon index; everything else lives in the complete catalogue. |
| Project pages | Explain the problem and implementation, with release links and clear availability. |
| Static-first build | Astro renders the portfolio as a fast static site with Vercel deployment. |
| GitHub metadata | Build-time GitHub API data enriches release, update, and download surfaces with safe fallbacks. |
| Bilingual | Portfolio pages exist in English and German with hreflang alternates; legal pages are German-only. |

## Discovery files

`robots.txt` allows every crawler, including the major search engines and AI assistant crawlers listed by name, and keeps only `/api/` closed. The sitemap lists the canonical English and German URLs and their hreflang pairs. It records the 2026-10-06 revision for the homepages and the 2026-10-04 revision for the catalogue, project template and imprint. Advance those dates only for a significant content or template change, never for a daily metadata rebuild. Unchanged pages omit `lastmod`. `/llms.txt` (directory) and `/llms-full.txt` (every project in full) are generated at build time from the same data as the pages (`src/lib/llms.ts`), so they cannot drift. `humans.txt` names the author, and `/.well-known/security.txt` gives a security contact; renew its `Expires` date before 2027-10-06.

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

Download choices use native `details` elements and restore keyboard focus on Escape. Demo videos play only on request, so reduced-motion preferences and a deliberate pause are respected. The original bilingual slogan remains unchanged and is fully visible on arrival.

The header is a row of cells, pinned on screens wider than 860px. Two hairlines frame the content column on every page. On the home page the hero sits between stepped blocks with pixel sprites, and its bottom border is a track with a pixel train in ÖffiGo green; hovering stops it and lights a destination sign, clicking it jumps to ÖffiGo. Sprites are drawn from text grids in `src/components/PixelSprite.astro`. On mouse and trackpad the site uses its own cursor: a smooth ink arrow, and the same arrow in signal red on anything clickable. They are real CSS cursors (no script, about 2 KB, 2x variants for Retina), so they move exactly like the system cursor; text fields keep the system I-beam. `npm run cursors` regenerates `src/styles/cursors.css` from `tools/cursors/build.mjs`.

For developers: the DevTools console greets with an ASCII train and view-source carries a note. A small terminal (`src/scripts/terminal.ts`, loaded on first use) opens with `~`, Option+N on German Macs, the ^ key left of 1, by typing `terminal` anywhere, or by tapping the pixel terminal in the headline. It knows `help`, `ls`, `open`, `stack`, `contact`, `train` and a few undocumented commands, and prints text only, never HTML. The home scene hides more (`src/scripts/scene.ts`): the Mac boots into a happy face, the pumpkin drops seeds and turns into pumpkin seed oil, stars appear after 20:00 Styrian time, and typing `train` or `kernoel` triggers them directly.

The ÖffiGo band on the home page shows live departures for five Vienna stops (Praterstern, Karlsplatz, Stephansplatz, Westbahnhof, Hauptbahnhof) on an LED board. `/api/departures` reads only Wiener Linien open data (CC BY 4.0, Stadt Wien), never the VAO data ÖffiGo has under contract; a closed stop list, a 25 s per-stop cache with single-flight requests and a CDN cache header keep the upstream load bounded. Times supplied by the operator are labelled real time, everything else timetable, matching ÖffiGo's own wording. The board loads when it scrolls into view and refreshes every 30 s while the tab is visible. Parsing lives in `src/lib/departures.ts` and is tested.

Project pages share one template (`src/components/ProjectDetail.astro`): the app icon on an LED dot screen (or a monogram), the facts as a row of cells, the media in a macOS-style window, and for projects without screenshots a terminal card built only from real data (repo, status, version, stack, platform, clone command). A still that is only a video poster is not shown twice. Developer-setup commands have a copy button with a fallback for blocked clipboards. Windows across the site use macOS traffic lights and a soft shadow; the header carries a small menu-bar clock on wide screens. The footer has a short intro, four link columns (pages, projects, for developers, legal), a sources line and a "built with ♥" row with a pixel heart. Every page ends with the name set huge on an LED dot screen that lights up in signal red on hover.

The 404 page is a departure board: the requested path is a cancelled train, home and the catalogue are the replacement service, and the pixel train waits at a buffer stop.

Under the hero a status line shows what is going on right now: the current main project, the most recently pushed public repository (from build-time GitHub data, left out when only fallback data is available), the stack and the local time in Styria (`src/scripts/clock.ts`, hidden without JavaScript). Further work is one compact index with app icons instead of screenshots. The stack band (`#services`, `#skills`) lists each group together with the projects that use it. Project rows keep a small hover offset on desktop pointers; reduced-motion mode keeps them static.

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
| `npm test` | Checks Turnstile verification, release asset classification and the departures parser. |
| `npm run build` | Checks and builds the production site. |
| `npm run preview` | Previews the production build locally. |
| `npm run cursors` | Regenerates `src/styles/cursors.css` from `tools/cursors/build.mjs`. |

## Project Structure

```text
src/
  components/ Shared head, header, footer, and project detail markup
  data/       Site copy and project data
  layouts/    Page shells
  lib/        Pure helpers with tests (release classification, Turnstile)
  pages/      Astro pages and the contact API route
  scripts/    Small client scripts (theme, clock, contact form, catalogue search)
  styles/     Global styling
public/       Static assets, robots, icons
tests/        node --test suites
tools/brand/  Renders the OG cards and icons
```

## Deployment

The site is deployed with Vercel. Production builds use:

```bash
npm run build
```

The canonical host is `johannesgrof.me`. In Vercel project settings, the apex domain must have no redirect and `www.johannesgrof.me` must redirect to `johannesgrof.me` with status 308. Keep the matching host rules in `vercel.json` aligned with these settings. Both domains must remain assigned to the project.

### Caching

| Path | Cache-Control | Why |
| --- | --- | --- |
| HTML pages | `max-age=0, must-revalidate` (Vercel default) | Always fresh in the browser; the CDN serves them and is purged on every deploy. |
| `/_astro/*` | `max-age=31536000, immutable` | Hashed build output, the name changes with the content. |
| `/projects/*`, OG cards, icons | `max-age=86400, s-maxage=31536000, stale-while-revalidate=604800` | Stable file names, so no `immutable`; a day in the browser, CDN until the next deploy. |
| `robots.txt`, `humans.txt`, `llms*.txt`, `sitemap.xml`, `security.txt` | `max-age=3600, s-maxage=86400, stale-while-revalidate=86400` | Regenerated with every build. |
| `/api/departures` | browser `max-age=0`; `Vercel-CDN-Cache-Control: max-age=20, stale-while-revalidate=30` | One answer per stop on the CDN, plus a 10 s instance cache; at most about a minute old. Errors are `no-store`. |
| `/api/contact` | `no-store` | Never cached. |

Check after a deploy with `curl -sI https://johannesgrof.me/_astro/<file> | grep -i cache-control`.

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
