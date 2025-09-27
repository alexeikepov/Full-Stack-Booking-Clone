import { Link } from "react-router-dom";

interface CreditsPanelProps {
  creditsCount: number;
}

export default function CreditsPanel({ creditsCount }: CreditsPanelProps) {
  return (
    <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[14px] text-black/70">
            No Credits or vouchers yet
          </div>
          <div className="text-[13px] text-black font-bold">{creditsCount}</div>
        </div>
        <Link
          to="/account/rewards"
          className="text-[#0071c2] text-[13px] font-medium hover:underline"
        >
          More details
        </Link>
      </div>
    </div>
  );
}
