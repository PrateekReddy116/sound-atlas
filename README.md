# Sound Atlas — Next.js

A shared 3D / 2D world of songs left by strangers. Built with **Next.js App Router** for native Vercel deploys.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy these into `.env.local` (or `.env`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=

# Optional — improves Spotify search; iTunes fallback works without them
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

## Deploy (Vercel)

Connect the repo in Vercel. Framework preset: **Next.js**. No `vercel.json` required.
