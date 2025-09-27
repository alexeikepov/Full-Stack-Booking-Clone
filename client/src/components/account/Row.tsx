import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface RowProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export default function Row({ to, icon, label }: RowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-[10px] px-4 py-4 hover:bg-[#f6f7fb]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[#003b95]">{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-black/30" />
    </Link>
  );
}
