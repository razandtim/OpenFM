## OpenFM Implementation Checklist

> Update this document as each checkbox is completed. Only advance to the next section when the previous section is fully checked off.

### 1. Planning & Foundations
- [x] Confirm platform (Next.js SSR) and deployment target (Vercel).
- [x] Lock mood catalog (`Romantic`, `Funny`, `Scary`, `Epic`, `Sad`) and track counts.
- [ ] Finalize pending questions from overview (`audio licensing`, `loop strategy`, `sponsor CTA`).
- [ ] Gather visual references (palette validation, mood icon sketches).

### 2. Project Setup
- [ ] Bootstrap Next.js App Router project (`create-next-app@latest` with TypeScript & ESLint).
- [ ] Configure Tailwind CSS with custom color tokens & typography.
- [ ] Install helper deps (`clsx`, `framer-motion` optional, `@heroicons/react` optional).
- [ ] Establish base layout: global styles, font loading, metadata.

### 3. Data & Playback Model
- [ ] Create `data/tracks.ts` (10 mocked tracks per mood with metadata).
- [ ] Implement mood-to-track shuffler utility.
- [ ] Build playback context/provider with hooks for play/pause/next mood.
- [ ] Wire HTML `<audio>` element controller with resilient loop.

### 4. UI & Interaction
- [ ] Home page hero with current mood badge & CTA.
- [ ] Mood selector (pills or segmented control) with animated transition.
- [ ] “Now Playing” card with artwork placeholder, timer, and upcoming queue preview.
- [ ] Sponsor slot and optional CTA section.
- [ ] Responsive layout checks (desktop, tablet, mobile).

### 5. Polishing & Feedback
- [ ] Add microcopy for mood changes (“Switching to Epic vibes…”).
- [ ] Include loading/skeleton states for initial render & mood switch.
- [ ] Accessibility pass (keyboard controls, ARIA labels, color contrast).
- [ ] QA audio switching across browsers (Chrome, Firefox, Safari if possible).

### 6. Deployment & Handoff
- [ ] Prepare `.env.example` (future API hooks).
- [ ] Configure Vercel project (build command, envs, analytics opt-in).
- [ ] Smoke-test production build (`vercel --prod` or `npm run build && npm run start`).
- [ ] Document MVP usage & next steps in `README.md`.

