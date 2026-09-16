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

This repository contains my macOS-style portfolio desktop: an Astro and TypeScript site with movable application windows, a bilingual project catalogue and a contact form. Everything is prerendered except the contact endpoint, which runs as a single on-demand function on Vercel. DNS is Cloudflare.

## Desktop

- `/` and `/de/` open the desktop. Direct `/projects/:slug/` and `/de/projects/:slug/` links open that project straight away, server-rendered, so a shared link needs no JavaScript to be readable.
- `/classic/` and `/de/classic/` keep the conventional reading layout, with project pages under `/classic/projects/:slug/`. Both canonicalise to the desktop URLs so the two renderings of the same copy do not compete in search.
- The menu bar is a real one: menus open on click, walk with the arrow keys, close on Escape, and the Window menu ticks whatever is open. Language lives in the status area as a DE/EN menu; the choice is remembered, and a German-speaking first-time visitor on the English page is offered the switch rather than redirected.
- Finder has category filters, search and list/grid views. `Ctrl/Cmd+K` opens Spotlight. Windows close, minimise, maximise and centre, and the resize corner also takes arrow keys.
- Project detail markup is fetched per project from `/partials/projects/:slug/` when a window opens, rather than being rendered into every page. That is what keeps the home page at ~16 KB gzipped instead of ~33 KB.
- The clock widget sits next to a weather panel showing the visitor's own place beside mine, both with local time. Preview flips through real project screenshots. The Archive holds the projects I stopped working on, not invented filenames.
- TextEdit reads text files locally, keeps one browser-local note, toggles wrapping and exports a text file. It never uploads editor content, and it says so when storage is blocked.
- The terminal is wired to the rest of the desktop: `ls`, `open <app>`, `project <name>`, `gh` and `weather` read the same data the windows do.
- Mail reuses the contact endpoint, honeypot, rate limiting and Turnstile action. Hidden windows do not render zero-width challenges.

The desktop frames no third-party site and makes no third-party request. App icons come from `public/desktop/`; `ICON_SOURCE` in `src/lib/appIcons.ts` switches the whole set between those and a drawn SVG set defined in the same file. Wallpapers are CSS gradients, so they cost no request at all. See [asset provenance](docs/desktop-assets.md).

Browser checks: with the dev server running, `node tools/desktop/browser-check.mjs` drives the desktop through the locally installed `agent-browser` CLI. It creates its own session, and Turnstile, contact submission, GitHub and the weather are all fixtures, so the check never sends an email, mutates the live rate-limit store, or depends on a third party being up.

## Highlights

| Feature | Description |
| --- | --- |
| Project proof | Highlights shipped GitHub releases, npm packages, DMG builds, and Windows EXE assets. |
| Case studies | Each project page explains the problem, build approach, result, and audience. |
| Static-first build | Astro renders the portfolio as a fast static site with Vercel deployment. |
| GitHub metadata | Build-time GitHub API data enriches release, update, and download surfaces with safe fallbacks. |
| Bilingual | Portfolio pages exist in English and German with hreflang alternates; legal pages are German-only. |

## Featured Projects

| Project | Public proof |
| --- | --- |
| [PatchPilot](https://johannesgrof.me/projects/patchpilot/) | npm package and coding-agent TUI release. |
| [BriskEdit](https://johannesgrof.me/projects/briskedit/) | Native macOS developer text editor with a DMG release. |
| [MacPhone](https://johannesgrof.me/projects/macphone/) | Native macOS companion app with a GitHub release. |
| [CCrab](https://johannesgrof.me/projects/ccrab/) | Claude Code desktop companion at 0% idle CPU. |
| [Caruso-Reborn](https://johannesgrof.me/projects/caruso-reborn/) | Local playback dashboard with GitHub release. |
| [Tools](https://johannesgrof.me/projects/tools/) | Browser-only PDF and image toolkit, live at tools.johannesgrof.me. |

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

### Environment

| Variable | Needed for | Where |
| --- | --- | --- |
| `GITHUB_TOKEN` | Release and repository metadata on project pages, **and** the `/api/github` endpoint the desktop's Workshop reads. Set it for both build and runtime: without it the endpoint shares the unauthenticated 60-requests-an-hour budget against Vercel's egress addresses, which is exhausted quickly and leaves the Workshop showing its saved snapshot. Use a fine-grained token with read-only access to public repositories. | Build + Runtime |
| `RESEND_API_KEY` | Sending contact-form mail. | Runtime |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile widget key, embedded at build time. | Build |
| `TURNSTILE_SECRET` | Server-only Turnstile verification. Required before contact messages can be sent. | Runtime |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Per-IP rate limiting on the contact endpoint. Production refuses submissions when they are missing. | Runtime |

`/api/weather` needs no configuration: it reads Vercel's geolocation headers and calls Open-Meteo's free tier, which takes no key.

### Endpoints

| Route | Purpose | Cache |
| --- | --- | --- |
| `/api/contact` | Contact form: honeypot, origin check, Upstash rate limit, Turnstile verification, Resend delivery. | `no-store` |
| `/api/github` | Public repositories, latest commits and releases for the Workshop window. Called from the server so the visitor's browser never contacts GitHub. | `s-maxage=900`, SWR one day |
| `/api/weather` | The visitor's weather and mine, from Vercel's geolocation headers plus Open-Meteo. Coordinates are rounded to one decimal before they leave the server, and no IP address is forwarded. | `private, max-age=900` — the answer names the visitor's own city, so it must never sit in a shared edge cache |

The contact widget uses managed mode and the `turnstile-spin-v2` action. Register the production hostname and the exact preview branch hostname in Cloudflare; deployment-specific Vercel URLs need their own hostname registration. The backend verifies the token, hostname, and action before calling Resend. Keep the secret in Vercel's secret store and an ignored local environment file.

For browser automation, use [Cloudflare's official test sitekeys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) locally and mock mail delivery. Never put test keys in production. Run `npm test` for token-validation regression tests and `npm run build` before deploying.

## License

All rights reserved. The source is public for transparency and to understand the frontend/backend, but reuse is not licensed without permission.
