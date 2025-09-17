interface RoomTableHeaderProps {
  isSticky: boolean;
}

export default function RoomTableHeader({ isSticky }: RoomTableHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-50 bg-[#003580] text-white shadow-lg transition-all duration-200 ${
        isSticky ? "shadow-xl" : ""
      }`}
    >
      <div className="grid grid-cols-[minmax(320px,1.2fr)_140px_220px_1.8fr_88px_180px]">
        <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
          Room type
        </div>
        <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
          Number of guests
        </div>
        <div className="px-4 py-3 font-semibold border-r border-white/30">
          Today's price
        </div>
        <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
          Your choices
        </div>
        <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
          Select rooms
        </div>
        <div className="px-4 py-3 font-semibold bg-[#2c5aa0] text-white" />
      </div>
    </div>
  );
}
