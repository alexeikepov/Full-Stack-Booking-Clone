export default function FiltersSidebar() {
  return (
    <aside className="sticky top-20 hidden h-fit w-72 shrink-0 rounded-lg border p-3 lg:block">
      <h3 className="mb-2 text-base font-semibold">Filter by:</h3>

      <div className="space-y-3 text-sm">
        <section>
          <div className="mb-1 font-medium">Your previous filters</div>
          <ul className="space-y-1">
            {[
              "All-inclusive",
              "Swimming Pool",
              "Hotels",
              "Superb: 9+",
              "Very good: 8+",
              "5 stars",
              "Free WiFi",
              "Only show available properties",
            ].map((label) => (
              <li key={label} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-2">
          <div className="mb-1 font-medium">Your budget (per night)</div>
          <div className="h-4 w-full rounded bg-muted" />
        </section>
      </div>
    </aside>
  );
}
