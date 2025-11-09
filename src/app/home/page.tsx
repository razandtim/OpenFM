import Link from "next/link";

export default function MarketingHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900">
      {/* Top navigation */}
      <nav className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black">OFM</div>
            <span className="font-semibold">OpenFM</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-slate-300 px-4 py-1.5 text-sm">Open the Player</Link>
            <a href="#install" className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">Install</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="font-heading text-4xl leading-tight md:text-6xl">Mood‑based music for your stream.</h1>
            <p className="mt-4 text-lg text-slate-700">A modern OBS dock that crossfades smoothly, keeps artwork beautiful, and lets your voice and alerts sit on top when it matters.</p>
            <div className="mt-6 flex gap-3">
              <a href="#install" className="rounded-full bg-slate-900 px-6 py-2 text-white">Install OpenFM</a>
              <Link href="/" className="rounded-full border border-slate-300 px-6 py-2">Open the Player</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=640&auto=format&fit=crop" alt="Artwork 1" className="aspect-square w-full rounded-2xl object-cover" />
            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=640&auto=format&fit=crop" alt="Artwork 2" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src="https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?q=80&w=640&auto=format&fit=crop" alt="Artwork 3" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=640&auto=format&fit=crop" alt="Artwork 4" className="aspect-square w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Alternating bands */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl grid items-center gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Two ways to play</p>
            <h2 className="mt-2 text-3xl font-semibold">Local Mood Packs or Suno Library</h2>
            <p className="mt-3 text-slate-700">Install curated ZIP packs once and play offline, or paste your Suno API key and browse cover‑art rich tracks. Switching is one click.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop" alt="Epic" className="aspect-square w-full rounded-xl object-cover" />
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop" alt="Romantic" className="aspect-square w-full rounded-xl object-cover" />
            <img src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop" alt="Funny" className="aspect-square w-full rounded-xl object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl grid items-center gap-12 px-6 py-16 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=900&auto=format&fit=crop" alt="Smooth crossfade" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm uppercase tracking-wide text-slate-500">Smooth transitions</p>
            <h2 className="mt-2 text-3xl font-semibold">Silky crossfades, adjustable anytime</h2>
            <p className="mt-3 text-slate-700">Default 250 ms. Slide it where you like. Switching moods or songs always feels polished.</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl grid items-center gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Audio priority</p>
            <h2 className="mt-2 text-3xl font-semibold">Your mic and alerts stay on top</h2>
            <p className="mt-3 text-slate-700">Tick checkboxes for any OBS source to duck OpenFM automatically when needed. When they stop, your music returns.</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=900&auto=format&fit=crop" alt="Audio priority" className="w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Install OpenFM</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">1. Download the installer for Windows or macOS.</li>
            <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">2. Run it, then launch OBS.</li>
            <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">3. OBS: View → Docks → check OpenFM.</li>
            <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">4. Click a mood and you’re live.</li>
          </ol>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl items-center justify-between gap-6 px-6 py-16 md:flex">
          <h3 className="text-2xl font-semibold">Let the mood lead the stream.</h3>
          <div className="mt-4 flex gap-3 md:mt-0">
            <a href="#install" className="rounded-full bg-slate-900 px-6 py-2 text-white">Install OpenFM</a>
            <Link href="/" className="rounded-full border border-slate-300 px-6 py-2">Open the Player</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
