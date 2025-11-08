## OpenFM Project Overview

### Concept Snapshot
- **Mission**: Deliver a royalty-free, AI-branded radio experience tailored for streamers and small businesses within a 24 hour hackathon window.
- **Positioning**: Mood-driven, always-on audio companion that stays “safe to stream” while feeling dynamic and on-brand.
- **Platform**: Next.js SSR (App Router) single repo; no separate backend service for the PoC.

### Core Value Pillars
- **Mood-first programming**: Five curated moods—`Romantic`, `Funny`, `Scary`, `Epic`, `Sad`—with quick switching and animated feedback.
- **Reliable playback**: Seamless audio handoff, graceful handling when tracks loop or switch moods.
- **Streamer-ready metadata**: Surface upcoming track info, mood badges, and royalty-safe messaging.
- **Sponsor moments**: Reserve layout space for branded cards or timed callouts without disrupting playback.

### Experience Targets
- **Primary flow**: Visitor lands on home page → selects or confirms current mood → stream starts immediately with visible “Now Playing”.
- **Secondary flow**: Mood switcher persists on screen; transitions with a short crossfade or “tuning” animation.
- **Tertiary flow**: Optional schedule teaser & “Download Stream Kit” CTA (logo pack, overlays) for brand continuity.

### Content Strategy (PoC Simulation)
- Seed **10 tracks per mood** stored locally (JSON/TS module); include title, artist alias, duration, stream-safe slug, artwork fallback.
- Generate backstory copy (e.g., “AI Session 07”) to reinforce synthetic-yet-human vibe.
- Support extensibility hooks for future AI generation (e.g., remote track fetcher).

### High-Level Architecture
- **Application shell**: Next.js App Router, TypeScript, edge-friendly SSR.
- **UI layer**: Tailwind CSS + CSS variables for theming; Framer Motion for light transitions if time permits.
- **State**: React Context for global playback + mood state; hooks for audio element control.
- **Data**: Static TS dataset (`data/tracks.ts`) + helper to shuffle and cycle per mood.
- **Audio playback**: HTML `<audio>` element + lightweight controller (no external player unless needed).
- **Deployment**: Vercel (automatic builds, environment secrets for future APIs, streaming SSR support).

### Brand & Visual Direction (Hackathon Draft)
- **Name**: OpenFM (tagline: “Mood-perfect radio for streamers”).
- **Palette**: Midnight Navy `#0A1128`, Synth Violet `#5E60CE`, Electric Mint `#72F2EB`, Warm Sand `#F9C784`, Pure White `#FFFFFF`.
- **Typography**: Headings — “Space Grotesk” (or fallback sans); body — “Inter”.
- **Imagery**: Abstract waveforms, soft glow gradients, minimal iconography per mood.
- **Voice**: Friendly tech DJ, short quips (“Tuning into Epic waves…”).

### Key Implementation Assumptions
- Browser-only playback is acceptable for PoC; no offline support.
- All audio assets are locally hosted (public folder) or sourced from royalty-free libraries with permissive licenses.
- MVP avoids auth; future sponsor portal can extend the same Next.js instance.

### Open Questions / Next Steps
- Validate audio source licensing (royalty-free vs generated placeholders).
- Decide on fallback behavior when track list exhausts (loop vs shuffle).
- Confirm whether sponsor CTA is mandatory for Day 1.
- Gather reference assets (icons, background textures) once visual direction is approved.

