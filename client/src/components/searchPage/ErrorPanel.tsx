import { useTranslation } from "react-i18next";

interface ErrorPanelProps {
  error: Error;
}

export default function ErrorPanel({ error }: ErrorPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto w-full max-w-[680px] rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-red-500/30 p-3">
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full text-red-500"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-red-600">
          {t("search.error.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {error.message || t("search.error.description")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
        >
          {t("search.error.retry")}
        </button>
      </div>
    </div>
  );
}
