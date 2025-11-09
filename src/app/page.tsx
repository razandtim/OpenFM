import { NowPlayingCard } from "@/components/now-playing-card";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { MoodChips } from "@/components/mood-chips";
import { FeaturedGrids } from "@/components/featured-grids";
import { NowPlayingTopBar } from "@/components/now-playing-topbar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          {/* Gradient content area */}
          <div className="min-h-screen bg-gradient-to-b from-rose-300 via-rose-200 to-white px-6 py-6">
            <div className="mx-auto max-w-6xl space-y-6">
              <SearchBar />
              <NowPlayingTopBar />
              <MoodChips />
              <div className="grid gap-6 md:grid-cols-2">
                <NowPlayingCard />
                <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg">
                  <div className="aspect-square w-full rounded-2xl bg-sky-200" />
                </div>
              </div>
              <FeaturedGrids />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
