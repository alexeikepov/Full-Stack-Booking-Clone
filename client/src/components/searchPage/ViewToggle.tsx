import { useTranslation } from "react-i18next";

type ViewMode = "list" | "grid";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <button
        onClick={() => onViewChange("list")}
        className={`rounded-md border px-2 py-1 text-[12px] ${
          view === "list" ? "bg-muted" : ""
        }`}
      >
        {t("search.view.list")}
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={`rounded-md border px-2 py-1 text-[12px] ${
          view === "grid" ? "bg-muted" : ""
        }`}
      >
        {t("search.view.grid")}
      </button>
    </div>
  );
}
