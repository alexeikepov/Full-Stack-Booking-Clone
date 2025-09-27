import { useTranslation } from "react-i18next";

interface NoResultsPanelProps {
  city: string | null;
}

export default function NoResultsPanel({ city }: NoResultsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto w-full max-w-[680px] rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-muted-foreground/30 p-3">
          <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">
          {city ? `${city}: 0 properties found` : "0 properties found"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no matching properties for your search criteria. Try
          updating your search.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
        >
          Update search
        </button>
      </div>
    </div>
  );
}
