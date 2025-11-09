export const FeaturedGrids = () => {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-700">Featured Stations</p>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-slate-300/60" />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-700">Genres</p>
        <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-300/60" />
          ))}
        </div>
      </div>
    </section>
  );
};

