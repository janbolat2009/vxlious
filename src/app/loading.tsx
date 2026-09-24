export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-32 rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
        <div className="h-10 w-96 rounded-2xl bg-black/[0.08] dark:bg-white/[0.10]" />
        <div className="h-4 w-72 rounded-lg bg-black/[0.04] dark:bg-white/[0.06]" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl liquid-glass border border-black/[0.04] dark:border-white/[0.06] p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
              <div className="h-5 w-24 rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
            </div>
            <div className="h-6 w-3/4 rounded-xl bg-black/[0.06] dark:bg-white/[0.08]" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-black/[0.04] dark:bg-white/[0.05]" />
              <div className="h-3 w-4/5 rounded bg-black/[0.04] dark:bg-white/[0.05]" />
            </div>
            <div className="pt-6 border-t border-black/[0.04] dark:border-white/[0.06] flex justify-between items-center">
              <div className="h-6 w-16 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
              <div className="h-8 w-24 rounded-full bg-black/[0.08] dark:bg-white/[0.10]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
