interface ReviewSummaryProps {
  avgScore: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export function ReviewSummary({
  avgScore,
  publishedCount,
  pendingCount,
  rejectedCount,
}: ReviewSummaryProps) {
  return (
    <div className="mt-4 w-[260px] max-w-full rounded-[10px] border border-[#e6eaf0] bg-white p-3 text-[12px]">
      <div className="mb-2 text-[12.5px] font-semibold text-[#3b3f46]">
        Summary
      </div>
      <div className="grid grid-cols-2 gap-y-1">
        <span className="text-[#6b7280]">Average score</span>
        <span className="text-right font-medium">{avgScore.toFixed(1)}</span>

        <span className="text-[#6b7280]">Published</span>
        <span className="text-right font-medium">{publishedCount}</span>

        <span className="text-[#6b7280]">Pending</span>
        <span className="text-right font-medium">{pendingCount}</span>

        <span className="text-[#6b7280]">Rejected</span>
        <span className="text-right font-medium">{rejectedCount}</span>
      </div>
    </div>
  );
}
