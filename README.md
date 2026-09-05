<div align="center">

# johannesgrof.me

Personal website and project portfolio.

[![Astro](https://img.shields.io/badge/Astro-7.x-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Website](https://img.shields.io/badge/website-johannesgrof.me-111111?style=flat-square)](https://johannesgrof.me)
[![License](https://img.shields.io/badge/license-all%20rights%20reserved-lightgrey?style=flat-square)](#license)

[Website](https://www.johannesgrof.me) · [GitHub](https://github.com/jx-grxf)

</div>

## Overview

This repository contains the source for my personal portfolio website: a small, fast Astro site with a bilingual project catalogue and a contact form. Everything is prerendered except the contact endpoint, which runs as a single on-demand function on Vercel. DNS is Cloudflare.

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
| [PatchPilot](https://www.johannesgrof.me/projects/patchpilot/) | npm package and coding-agent TUI release. |
| [BriskEdit](https://www.johannesgrof.me/projects/briskedit/) | Native macOS developer text editor with a DMG release. |
| [MacPhone](https://www.johannesgrof.me/projects/macphone/) | Native macOS companion app with a GitHub release. |
| [CCrab](https://www.johannesgrof.me/projects/ccrab/) | Claude Code desktop companion at 0% idle CPU. |
| [Caruso-Reborn](https://www.johannesgrof.me/projects/caruso-reborn/) | Local playback dashboard with GitHub release. |
| [Tools](https://www.johannesgrof.me/projects/tools/) | Browser-only PDF and image toolkit, live at tools.johannesgrof.me. |

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

### Build environment

| Variable | Needed for |
| --- | --- |
| `GITHUB_TOKEN` | Build-time GitHub lookups. Without it the build is limited to 60 requests an hour and logs a warning and falls back to the checked-in metadata; use a fine-grained token with read-only access to public repositories. |
| `RESEND_API_KEY` | Sending contact-form mail. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Per-IP rate limiting on the contact endpoint. Production refuses submissions when they are missing. |

## License

All rights reserved. The source is public for transparency and to understand the frontend/backend, but reuse is not licensed without permission.
