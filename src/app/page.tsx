import { Hero } from "@/components/hero";
import { MoodSelector } from "@/components/mood-selector";
import { NowPlayingCard } from "@/components/now-playing-card";
import { QueuePreview } from "@/components/queue-preview";
import { SponsorSpot } from "@/components/sponsor-spot";
import { ScheduleTeaser } from "@/components/schedule-teaser";

export default function HomePage() {
  return (
    <main className="relative">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-8 lg:px-0">
        <div className="flex flex-col gap-6 px-0 lg:px-4">
          <Hero />
          <MoodSelector />
          <NowPlayingCard />
        </div>
        <div className="flex flex-col gap-6 px-0 lg:px-4">
          <QueuePreview />
          <SponsorSpot />
          <ScheduleTeaser />
        </div>
      </div>
    </main>
  );
}
