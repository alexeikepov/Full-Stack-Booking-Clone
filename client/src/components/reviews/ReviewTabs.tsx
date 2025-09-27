export function ReviewTabs() {
  return (
    <div className="mt-2 inline-flex rounded-[6px] border border-[#dfe6ef] bg-white p-[3px]">
      <button className="rounded-[4px] px-3 py-1.5 text-[12px] text-[#3b3f46] hover:bg-[#f1f5fb]">
        Reviews
      </button>
      <button className="rounded-[4px] bg-[#eef4ff] px-3 py-1.5 text-[12px] font-medium text-[#0a5ad6]">
        Timeline
      </button>
    </div>
  );
}
