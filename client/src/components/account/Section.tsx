import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
      <div className="px-5 py-4 border-b border-[#e6eaf0] text-[14px] font-semibold">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
