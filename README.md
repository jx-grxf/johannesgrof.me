<div align="center">

# johannesgrof.me

Personal website and project portfolio.

[![Astro](https://img.shields.io/badge/Astro-6.x-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Website](https://img.shields.io/badge/website-johannesgrof.me-111111?style=flat-square)](https://johannesgrof.me)
[![License](https://img.shields.io/badge/license-all%20rights%20reserved-lightgrey?style=flat-square)](#license)

[Website](https://johannesgrof.me) · [GitHub](https://github.com/jx-grxf)

</div>

## Overview

This repository contains the source for my personal portfolio website. It is built as a small, fast Astro site with a focused project showcase, skills section, contact surface, and static deployment on Vercel, using Cloudflare as DNS.

## Stack

| Part | Technology |
| --- | --- |
| Framework | Astro |
| Language | TypeScript |
| Styling | CSS |
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
  data/       Site copy and project data
  pages/      Astro pages
  styles/     Global styling
public/       Static assets, redirects, robots, sitemap
```

## Deployment

The site is deployed with Vercel. Production builds use:

```bash
npm run build
```

## License

All rights reserved. The source is public for transparency and to understand the frontend/backend, but reuse is not licensed without permission.
