import { MOOD_CONFIG, MOOD_ROTATION } from "@/lib/moods";

export const ScheduleTeaser = () => (
  <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-white shadow-lg shadow-black/30">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Mood Forecast
        </p>
        <p className="text-lg font-semibold">Tonight&apos;s Rotation</p>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
        Auto-schedule
      </span>
    </div>
    <ul className="mt-4 space-y-2 text-sm">
      {MOOD_ROTATION.map(({ time, mood }) => {
        const config = MOOD_CONFIG[mood];
        return (
          <li
            key={`${time}-${mood}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="font-mono text-xs text-white/60">{time}</span>
            <div className="flex-1 px-3">
              <p className="font-semibold">
                {config.icon} {config.label}
              </p>
              <p className="text-xs text-white/60">{config.tagline}</p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs"
              style={{ background: config.accentMuted }}
            >
              Safe to stream
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
