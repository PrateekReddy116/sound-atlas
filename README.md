# Sound Atlas

**By the world, for the world.**

A shared 3D / 2D world of music. Wander freely, discover songs strangers left behind, listen through Spotify, and leave one of your own.

Inspired by [odeta (father of three) on Reddit](https://www.reddit.com/).

---

## Features

- **3D Abyss** — React Three Fiber space of floating songs with cinematic camera travel
- **2D World Map** — geographic map with cities, regions, and song pins
- **Take Me Anywhere** — jump to a random song somewhere in the world
- **Leave a Song** — search Spotify (or paste a track link), pick a place, leave it for others
- **Auth** — email/password via Supabase (required only to leave a song; wandering is open)
- **Realtime** — songs sync live through Supabase

## Stack

| Layer | Tech |
| --- | --- |
| App | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 3D | Three.js, React Three Fiber, Drei |
| Data | Supabase (Auth + Postgres + Realtime) |
| Client state | TanStack Query |
| Search | Spotify Web API (optional) with iTunes fallback |
| Deploy | Vercel |

## Project structure

```
app/                      Next.js routes & layout
  page.tsx                Home — the world
  auth/page.tsx           Sign in / sign up
  providers.tsx           React Query + toasts
src/
  components/
    atlas/                Intro, panels, leave-song sheet, world page
    world/                3D canvas, 2D map, camera, song objects
    ui/                   Shared UI (toasts)
  hooks/                  Session, songs, reduced motion
  integrations/supabase/  Browser client + generated types
  lib/
    atlas/                Brand, geo, palette, types, placement helpers
    spotify.functions.ts  Server Actions (search / resolve)
    spotify.server.ts     Spotify + iTunes helpers (server-only)
public/                   Favicon & static assets
supabase/                 Migrations / config (if present)
```

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- Optional: [Spotify Developer](https://developer.spotify.com/) app for richer search

### Install

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Environment

Create `.env.local` (or `.env`) in the project root:

```bash
# Required — Supabase (browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Required — Supabase (server / fallback)
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=

# Optional — project id
NEXT_PUBLIC_SUPABASE_PROJECT_ID=
SUPABASE_PROJECT_ID=

# Optional — Spotify search (iTunes fallback works without these)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

Copy the same values into your Vercel project → **Settings → Environment Variables** for Production (and Preview if you want).

## How it works

1. **Wander** — enter the world without an account; switch between 3D Abyss and 2D Map.
2. **Discover** — click a song or use **Take Me Anywhere**; the Spotify embed plays in-panel (nothing is hosted on our servers).
3. **Leave** — sign in, search or paste a Spotify link, place the song in the abyss or on the map. It’s stored in Supabase and appears for everyone.

Brand copy lives in `src/lib/atlas/brand.ts` so the product name can change in one place.

## Deploy on Vercel

1. Push to GitHub (`main`).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). Defaults for build (`next build`) are fine — no `vercel.json` required.
4. Add the environment variables above.
5. Deploy. Later pushes to `main` redeploy automatically.

CLI alternative:

```bash
npx vercel
npx vercel --prod
```

## Notes

- 3D and 2D canvases load client-only (`next/dynamic` with `ssr: false`) so WebGL / `window` never run on the server.
- Spotify credentials stay server-side via Server Actions in `src/lib/spotify.functions.ts`.
- Song playback uses Spotify’s official embed — we never stream audio ourselves.
