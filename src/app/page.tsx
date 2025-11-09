import { Hero } from "@/components/hero";
import { MoodSelector } from "@/components/mood-selector";
import { NowPlayingCard } from "@/components/now-playing-card";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main className="relative min-h-screen pb-20">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-0">
        <SiteHeader />
        <div className="sticky top-6 z-20">
          <NowPlayingCard />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.8fr_minmax(280px,1fr)]">
          <div className="space-y-6">
            <Hero />
            <MoodSelector />
          </div>
          <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/40 p-6 text-white/70 shadow-inner shadow-black/30">
            <h2 className="text-lg font-semibold text-white">Coming Soon</h2>
            <p className="text-sm">
              Library, trending playlists, and personalized recommendations will
              live here as we expand OpenFM&apos;s experience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
