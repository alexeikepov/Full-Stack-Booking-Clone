export default function TripSkeleton() {
  return (
    <div className="flex items-center gap-5 rounded-[12px] bg-white px-5 py-5 min-h-[108px]">
      <div className="h-[84px] w-[80px] rounded bg-[#eef2f7]" />
      <div className="flex-1">
        <div className="h-4 w-28 rounded bg-[#eef2f7]" />
        <div className="mt-2 h-4 w-48 rounded bg-[#eef2f7]" />
      </div>
    </div>
  );
}
