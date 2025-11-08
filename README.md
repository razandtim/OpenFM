# OpenFM

Royalty-safe, mood-driven radio built with Next.js App Router, Tailwind v4, and a resilient HTML
audio controller. This repo powers the OpenFM hackathon MVP that streamers can self-host or deploy
to Vercel without extra backend services.

## Requirements

- Node.js 20+
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and use the mood selector to switch between playlists. The hero also
links to `stream-kit.zip`, which bundles logos, gradients, and mood badges for easy overlays.

## Project Structure

- `src/app` – App Router entry (`layout.tsx`, `page.tsx`, global styles/fonts).
- `src/components` – Hero, mood selector, now playing card, queue preview, sponsor slot, etc.
- `src/context/player-context.tsx` – Playback provider handling play/pause/next/previous logic plus
  resilient shuffle refills.
- `src/data/tracks.ts` – 10 mocked tracks per mood with metadata + helpers.
- `src/lib` – Mood catalog/config, playlist utilities, and shared types.
- `public/songs/*` – Local royalty-free stems grouped by mood for the MVP.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start Next.js in development with HMR.       |
| `npm run lint`  | Run ESLint across the project.               |
| `npm run build` | Production build (also used by Vercel).      |
| `npm run start` | Serve the optimized build locally.           |

## Environment & Config

Copy `.env.example` to `.env.local` and adjust as needed:

```
NEXT_PUBLIC_STREAM_KIT_URL=/stream-kit.zip
NEXT_PUBLIC_DEFAULT_MOOD=epic
SPONSOR_FEED_URL=https://api.openfm.fake/sponsor-spots
TRACK_REGISTRY_URL=https://api.openfm.fake/tracks
VERCEL_ANALYTICS_ID=vercel-analytics-placeholder
```

The provided `vercel.json` sets the build command, output directory, public env defaults, and
declares a placeholder `analyticsId`. Replace it with your real Vercel Analytics ID (or remove it)
before deploying.

## QA & Accessibility

- Loading states, keyboard-focus rings, and `aria` labels exist across interactive controls.
- Audio playback was smoke-tested via `npm run lint` and `npm run build`; the queue automatically
  refills per mood when exhausted.
- For manual verification, confirm playback in Chrome, Firefox, and Safari to ensure autoplay
  policies match your deployment domain.

## Deployment

1. Ensure `.env.local` contains any overrides for public URLs or sponsor feeds.
2. Run `npm run build && npm run start` locally for a production smoke test.
3. Deploy to Vercel (or another Node host) – the repo is already configured for App Router SSR.

## Next Steps

- Plug the sponsor feed into `SponsorSpot` once partner creatives are ready.
- Connect remote track ingestion to `SPONSOR_FEED_URL`/`TRACK_REGISTRY_URL` when APIs exist.
