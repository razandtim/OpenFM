import { MOOD_CONFIG, MOOD_ORDER } from "@/lib/moods";

const Pill = ({ label, accent }: { label: string; accent: string }) => (
  <span
    className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/80"
    style={{
      boxShadow: `0 0 24px ${accent}33`,
    }}
  >
    {label}
  </span>
);

export const Hero = () => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl shadow-black/20 backdrop-blur-lg">
      <p className="text-sm uppercase tracking-[0.4em] text-white/60">
        Royalty-free Stream Radio
      </p>
      <h1 className="mt-4 font-heading text-4xl leading-tight md:text-5xl">
        OpenFM keeps your stream on-brand with mood-perfect AI sessions.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/80">
        Switch vibes instantly, surface metadata for your overlays, and loop a
        safe soundtrack that never gets flagged. Built for hackathon speed,
        designed for streamer polish.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:translate-y-0.5 hover:bg-slate-100"
          href="#now-playing"
        >
          Start Listening
        </a>
        <a
          className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:text-white"
          href="/stream-kit.zip"
        >
          Download Stream Kit
        </a>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {MOOD_ORDER.map((mood) => (
          <Pill
            key={mood}
            label={`${MOOD_CONFIG[mood].icon} ${MOOD_CONFIG[mood].label}`}
            accent={MOOD_CONFIG[mood].accent}
          />
        ))}
      </div>
    </section>
  );
};
