export const SponsorSpot = () => (
  <section className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 via-transparent to-white/10 p-6 text-white shadow-lg shadow-black/20">
    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
      Sponsor Moment
    </p>
    <h3 className="mt-2 text-2xl font-semibold">Reserve a branded drop-in</h3>
    <p className="mt-2 text-sm text-white/80">
      Keep playback uninterrupted while surfacing partner copy, discount codes,
      or campaign CTAs. Slots rotate every 4 tracks by default.
    </p>
    <div className="mt-4 rounded-2xl border border-white/15 bg-black/40 p-4 text-sm text-white/70">
      <p>Next slot opens in 12m 10s</p>
      <p className="text-white">Insert sponsor.json to automate creative.</p>
    </div>
    <a
      href="mailto:hello@openfm.fake"
      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white"
    >
      Contact partnerships →
    </a>
  </section>
);
