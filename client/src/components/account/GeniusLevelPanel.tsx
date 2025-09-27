import { Link } from "react-router-dom";

export default function GeniusLevelPanel() {
  return (
    <div className="rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,.06)] ring-1 ring-[#e6eaf0]">
      <div className="px-6 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://t-cf.bstatic.com/design-assets/assets/v3.160.0/illustrations-traveller/GeniusAllBookingsStamp@2x.png"
              alt=""
              className="h-12 w-12 object-contain"
            />
            <div className="text-[16px] font-semibold text-black">
              You're 5 bookings away from Genius Level 2
            </div>
          </div>
          <Link
            to="/account/genius"
            className="inline-block bg-transparent text-[#0071c2] px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[#e6f2ff] hover:text-[#0071c2] text-left"
          >
            Check your progress
          </Link>
        </div>
      </div>
    </div>
  );
}
