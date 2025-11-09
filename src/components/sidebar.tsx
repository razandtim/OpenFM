import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="sticky top-0 h-screen w-56 flex-shrink-0 border-r border-white/10 bg-slate-900/30 p-6 text-white/80 backdrop-blur-xl">
      <div className="mb-8">
        <p className="text-2xl font-black text-white">OpenFM</p>
      </div>
      <nav className="space-y-3 text-sm">
        <Link className="block rounded-lg px-2 py-1.5 hover:bg-white/5" href="/home">hom</Link>
        <Link className="block rounded-lg px-2 py-1.5 hover:bg-white/5" href="/">muzic</Link>
        <Link className="block rounded-lg px-2 py-1.5 hover:bg-white/5" href="/library">library</Link>
        <span className="block rounded-lg px-2 py-1.5 text-white/60">What's ur mood</span>
      </nav>
      <div className="mt-8 space-y-2">
        <button className="w-full rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/50">LOG IN</button>
        <button className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">REGISTER</button>
      </div>
    </aside>
  );
};
