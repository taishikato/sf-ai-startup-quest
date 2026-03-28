# SF AI Startup Map

A simple web app for exploring AI-native startups in San Francisco through a map UI with an 8-bit game tone.

You can move between map markers and the sidebar to quickly browse each startup's category, location, and short description. The UI stays clean and product-like, while the map styling adds a light retro game feel.

## What's This

- A map-based app for browsing AI startups in San Francisco
- Startup data is maintained in `lib/companies.ts` with source links
- Built on `maplibre-gl` with an 8-bit / voxel-inspired visual treatment
- Designed for quickly scanning companies in the sidebar and locating them on the map

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MapLibre GL JS
- Lucide React
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```
