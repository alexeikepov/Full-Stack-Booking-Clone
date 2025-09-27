import { useMemo, useState } from "react";
import MapToggle from "./MapToggle";
import type { FacetGroup } from "@/utils/buildFacets";
import { useTranslation } from "react-i18next";

export type FiltersState = {
  priceMin?: number | null;
  priceMax?: number | null;
  selected: Record<string, Set<string>>;
};

type Props = {
  bounds: { min: number; max: number };
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  facets: FacetGroup[];
};

function currency(n: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function FiltersSidebar({
  bounds,
  value,
  onChange,
  facets,
}: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const clamp = (v: number) => Math.min(bounds.max, Math.max(bounds.min, v));

  const minDisp = useMemo(
    () =>
      value.priceMin != null
        ? Math.round(value.priceMin)
        : Math.round(bounds.min),
    [value.priceMin, bounds.min]
  );
  const maxDisp = useMemo(
    () =>
      value.priceMax != null
        ? Math.round(value.priceMax)
        : Math.round(bounds.max),
    [value.priceMax, bounds.max]
  );

  const setRange = (k: "priceMin" | "priceMax", v: number) =>
    onChange({ ...value, [k]: clamp(v) });

  const toggle = (group: string, id: string) => {
    const cur = value.selected[group] ?? new Set<string>();
    const next = new Set(cur);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange({ ...value, selected: { ...value.selected, [group]: next } });
  };

  return (
    <aside className="hidden h-fit w-72 shrink-0 lg:block">
      <MapToggle />

      <div className="mt-3 rounded-lg border p-3">
        <div className="mb-2 text-[13px] font-semibold">
          {t("search.filters.budget")}
        </div>

        <div className="mb-2 flex h-14 items-end gap-0.5">
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t bg-muted"
              style={{ height: `${16 + ((i * 7) % 26)}px` }}
            />
          ))}
        </div>

        <div className="relative mt-3">
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={value.priceMin ?? bounds.min}
            onChange={(e) => setRange("priceMin", Number(e.target.value))}
            className="pointer-events-auto absolute z-20 h-2 w-full appearance-none bg-transparent"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={value.priceMax ?? bounds.max}
            onChange={(e) => setRange("priceMax", Number(e.target.value))}
            className="pointer-events-auto absolute z-10 h-2 w-full appearance-none bg-transparent"
          />
          <div className="h-2 w-full rounded bg-muted" />
          <div
            className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded bg-[#0071c2]"
            style={{
              left: `${
                ((minDisp - bounds.min) / (bounds.max - bounds.min || 1)) * 100
              }%`,
              right: `${
                100 -
                ((maxDisp - bounds.min) / (bounds.max - bounds.min || 1)) * 100
              }%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[12px] text-muted-foreground">
          <span>{currency(minDisp)}</span>
          <span>{currency(maxDisp)}+</span>
        </div>
      </div>

      {facets.map((g) => {
        const show = expanded[g.key] ?? false;
        const items = (() => {
          if (g.key === "categories") {
            const counter = new Map<
              string,
              { id: string; label: string; count: number }
            >();
            for (const it of g.items) {
              const parts = (it.label ?? "").includes("|")
                ? (it.label ?? "")
                    .split("|")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [it.label];
              for (const raw of parts) {
                const label = String(raw);
                const key = label.toLowerCase();
                const prev = counter.get(key);
                if (prev) {
                  prev.count += it.count;
                } else {
                  counter.set(key, {
                    id: `cat_${key}`,
                    label,
                    count: it.count,
                  });
                }
              }
            }
            const arr = Array.from(counter.values());
            return show ? arr : arr.slice(0, 10);
          }
          return show ? g.items : g.items.slice(0, 10);
        })();
        const selected = value.selected[g.key] ?? new Set<string>();
        return (
          <div key={g.key} className="mt-3 rounded-lg border p-3">
            <div className="mb-1 text-[13px] font-semibold">
              {t(`search.filters.${g.title}`, g.title)}
            </div>
            <ul className="space-y-1 text-[13px]">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(it.id)}
                    onChange={() => toggle(g.key, it.id)}
                    className="h-4 w-4 accent-[#0071c2]"
                  />
                  <span>
                    {it.label}{" "}
                    <span className="text-muted-foreground">{it.count}</span>
                  </span>
                </li>
              ))}
            </ul>
            {g.items.length > 10 && (
              <button
                className="mt-2 text-[12px] text-[#0071c2] hover:underline"
                onClick={() => setExpanded((e) => ({ ...e, [g.key]: !show }))}
              >
                {show
                  ? t("search.filters.showLess")
                  : g.showAllLabel ?? t("search.filters.showAll")}
              </button>
            )}
          </div>
        );
      })}
    </aside>
  );
}
