export default function MapToggle() {
  return (
    <div className="rounded-lg border p-0 overflow-hidden">
      {/* header with button */}
      <div className="flex items-center justify-between p-3">
        <div className="text-[13px] font-semibold">Map</div>
        <button className="rounded-md border px-3 py-1.5 text-[13px] text-[#0071c2]">
          Show on map
        </button>
      </div>

      {/* mini map placeholder (Google tile feel) */}
      <div
        className="h-40 w-full bg-[length:40px_40px] bg-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        }}
      />
    </div>
  );
}
