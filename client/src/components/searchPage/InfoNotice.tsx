import type { ReactNode } from "react";

export default function InfoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-[#f5f7fb] px-3 py-2 text-[13px] text-foreground/80">
      {children}
    </div>
  );
}
