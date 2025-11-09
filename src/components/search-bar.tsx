import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchBar = () => {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
      <input
        type="search"
        placeholder="SEARCH"
        className="w-full rounded-full border border-white/20 bg-white/80 py-2 pl-10 pr-4 text-center text-sm font-semibold tracking-wide text-slate-900 placeholder:text-slate-700/70 focus:outline-none focus:ring-2 focus:ring-white"
      />
    </div>
  );
};

