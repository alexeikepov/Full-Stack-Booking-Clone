import { useNavigate } from "react-router-dom";
import MostPopularFacilities from "./MostPopularFacilities";
import FacilitiesGrid from "./FacilitiesGrid";
import type { Hotel } from "@/types/hotel";

interface HotelFacilitiesProps {
  hotel: Hotel;
}

export default function HotelFacilities({ hotel }: HotelFacilitiesProps) {
  const navigate = useNavigate();

  const handleSeeAvailability = () => {
    navigate("/coming-soon");
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
