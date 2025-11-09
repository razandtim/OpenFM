import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchBar = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div
      className={compact ? "relative w-full max-w-md" : "relative mx-auto w-full max-w-2xl"}
    >
      <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-white/80" />
      <input
        type="search"
        placeholder="SEARCH"
        className="h-12 w-full rounded-full border border-white/15 bg-slate-900/40 pl-12 pr-4 text-center text-sm font-semibold tracking-wide text-white shadow-lg shadow-black/20 backdrop-blur-xl placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
    </div>
  );
};
