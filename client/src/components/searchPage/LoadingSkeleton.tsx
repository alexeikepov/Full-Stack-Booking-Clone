type ViewMode = "list" | "grid";

interface LoadingSkeletonProps {
  view: ViewMode;
}

export default function LoadingSkeleton({ view }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) =>
        view === "grid" ? (
          <div key={i} className="rounded-xl border p-3">
            <div className="h-44 w-full rounded-lg bg-muted" />
            <div className="mt-3 h-5 w-1/2 rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
            <div className="mt-4 h-8 w-28 rounded bg-muted" />
          </div>
        ) : (
          <div
            key={i}
            className="flex animate-pulse gap-4 rounded-xl border p-3 sm:flex-row"
          >
            <div className="h-40 w-full rounded-lg bg-muted sm:w-[260px]" />
            <div className="flex w-full flex-1 flex-col gap-3">
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="mt-auto h-8 w-28 rounded bg-muted" />
            </div>
          </div>
        )
      )}
    </>
  );
}
