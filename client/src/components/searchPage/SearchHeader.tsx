import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SortBar from "./SortBar";
import ViewToggle from "./ViewToggle";
import InfoNotice from "./InfoNotice";
import type { SortKey } from "@/utils/sortHotels";

type ViewMode = "list" | "grid";

interface SearchHeaderProps {
  isLoading: boolean;
  filteredCount: number;
  sortKey: SortKey;
  view: ViewMode;
  onSortChange: (key: SortKey) => void;
  onViewChange: (view: ViewMode) => void;
}

export default function SearchHeader({
  isLoading,
  filteredCount,
  sortKey,
  view,
  onSortChange,
  onViewChange,
}: SearchHeaderProps) {
  const { t } = useTranslation();
  const [params] = useSearchParams();

  return (
    <>
      <h1 className="text-[18px] font-semibold">
        {(params.get("city") ?? t("search.breadcrumb.city")) + ": "}
        {isLoading ? "…" : filteredCount} {t("search.count.propertiesFound")}
      </h1>

      <div className="mt-2 flex items-center justify-between">
        <SortBar value={sortKey} onChange={onSortChange} />
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>

      <div className="mt-2">
        <InfoNotice>{t("search.notice.conflict")}</InfoNotice>
      </div>
    </>
  );
}
