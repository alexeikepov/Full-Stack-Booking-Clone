import { useNavigate, useSearchParams } from "react-router-dom";
import MostPopularFacilities from "./MostPopularFacilities";
import FacilitiesGrid from "./FacilitiesGrid";
import type { Hotel } from "@/types/hotel";

interface HotelFacilitiesProps {
  hotel: Hotel;
}

export default function HotelFacilities({ hotel }: HotelFacilitiesProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSeeAvailability = () => {
    const sp = new URLSearchParams();
    const from = params.get("from");
    const to = params.get("to");
    const adults = params.get("adults");
    const children = params.get("children");
    const rooms = params.get("rooms");
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (adults) sp.set("adults", adults);
    if (children) sp.set("children", children);
    if (rooms) sp.set("rooms", rooms);
    const qs = sp.toString();
    // Scroll to prices/rooms section on the same page
    const target = document.getElementById("info");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`?${qs}`);
    }
  };

  return (
    <div id="facilities" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {hotel?.name
                ? `Facilities of ${hotel.name}`
                : "Facilities of Villa Albi - Machne Yehuda Hotel"}
            </h2>
            <p className="text-sm text-gray-600">
              {`Great facilities! Review score, ${(
                (hotel?.guestReviews?.overallRating ??
                  hotel?.averageRating ??
                  8.8) as number
              ).toFixed(1)}`}
            </p>
          </div>
          <button
            onClick={handleSeeAvailability}
            className="bg-[#003b95] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d73] transition-colors"
          >
            See availability
          </button>
        </div>

        <MostPopularFacilities facilities={hotel?.mostPopularFacilities} />
        <FacilitiesGrid hotel={hotel} />
      </div>
    </div>
  );
}
