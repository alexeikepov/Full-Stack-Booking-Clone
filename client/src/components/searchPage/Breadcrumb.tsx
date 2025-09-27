import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Breadcrumb() {
  const { t } = useTranslation();
  const [params] = useSearchParams();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <nav className="text-sm text-gray-500">
          <Link to="/" className="text-[#0071c2] hover:underline">
            {t("search.breadcrumb.home")}
          </Link>
          <span className="mx-2">›</span>
          <Link to="#" className="text-[#0071c2] hover:underline">
            {t("search.breadcrumb.country")}
          </Link>
          <span className="mx-2">›</span>
          <Link to="#" className="text-[#0071c2] hover:underline">
            {params.get("city") ?? t("search.breadcrumb.city")}
          </Link>
          <span className="mx-2">›</span>
          <span>{t("search.breadcrumb.results")}</span>
        </nav>
      </div>
    </div>
  );
}
