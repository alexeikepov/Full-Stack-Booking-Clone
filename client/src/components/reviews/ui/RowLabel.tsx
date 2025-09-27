interface RowLabelProps {
  label: string;
  variant?: "neg";
}

export function RowLabel({ label, variant }: RowLabelProps) {
  return (
    <div
      className={
        "inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[2px] text-[11px] " +
        (variant === "neg"
          ? "bg-[#ffe6e6] text-[#742a2a]"
          : "bg-[#eaf3ff] text-[#0a5ad6]")
      }
    >
      {variant === "neg" ? (
        <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
          <path d="M10 1.667A8.333 8.333 0 1 0 18.333 10 8.343 8.343 0 0 0 10 1.667Zm3.333 11.666H6.667a.833.833 0 0 1 0-1.666h6.666a.833.833 0 0 1 0 1.666ZM7.5 7.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 7.5 7.5Zm5 0a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12.5 7.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
          <path d="M10 1.667A8.333 8.333 0 1 0 18.333 10 8.343 8.343 0 0 0 10 1.667Zm4.1 6.309-4.525 4.525a.833.833 0 0 1-1.178 0L5.9 9.002a.833.833 0 1 1 1.178-1.178l1.955 1.955 3.936-3.936A.833.833 0 1 1 14.1 7.976Z" />
        </svg>
      )}
      <span>{label}</span>
    </div>
  );
}
