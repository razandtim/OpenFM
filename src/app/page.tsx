import { NowPlayingCard } from "@/components/now-playing-card";
import { Sidebar } from "@/components/sidebar";
import { FeaturedGrids } from "@/components/featured-grids";
import { StickySearchAndMini } from "@/components/sticky-search-and-mini";
import { MoodSelector } from "@/components/mood-selector";
import { MoodBackground } from "@/components/mood-background";
import { LayoutGroup } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen pb-20">
      <MoodBackground />
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-1 px-6 py-6">
          <LayoutGroup id="now-playing-group">
            <div className="mx-auto max-w-6xl space-y-6">
              <StickySearchAndMini />
              <section className="space-y-6">
                <MoodSelector />
                <NowPlayingCard />
              </section>
              <FeaturedGrids />
            </div>
          </LayoutGroup>
        </div>
      </div>
    </main>
  );
}
