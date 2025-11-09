import {
  BellIcon,
  HomeIcon,
  RectangleGroupIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const NavButton = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
}) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
  >
    <Icon className="h-4 w-4" aria-hidden="true" />
    {label}
  </Link>
);

export const SiteHeader = () => {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-black/30 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black uppercase text-slate-900 shadow-md shadow-black/30">
          OFM
        </div>
        <div>
          <p className="text-sm font-semibold text-white">OpenFM</p>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">
            Stream Radio
          </p>
        </div>
        <nav className="ml-6 hidden items-center gap-3 lg:flex">
          <NavButton href="/" label="Home" icon={HomeIcon} />
          <NavButton href="/library" label="Library" icon={RectangleGroupIcon} />
        </nav>
      </div>

      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search tracks, moods, or artists"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white transition placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Profile"
          >
            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Log in
            </button>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


