import { Utensils, User, Mountain, Star, Bus, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "@/types/hotel";

interface LocationItem {
  name: string;
  distance: string;
  type?: string;
}

interface HotelSurroundingsProps {
  hotel: Hotel;
  onShowMap?: () => void;
}

export default function HotelSurroundings({
  hotel,
  onShowMap,
}: HotelSurroundingsProps) {
  const navigate = useNavigate();

  const hasSurroundingsData =
    hotel?.surroundings &&
    (hotel.surroundings.nearbyAttractions?.length > 0 ||
      hotel.surroundings.topAttractions?.length > 0 ||
      hotel.surroundings.restaurantsCafes?.length > 0 ||
      hotel.surroundings.naturalBeauty?.length > 0 ||
      hotel.surroundings.publicTransport?.length > 0 ||
      hotel.surroundings.closestAirports?.length > 0);

  if (!hasSurroundingsData) {
    return null;
  }

  const handleShowMap = () => {
    if (onShowMap) {
      onShowMap();
    } else {
      const mapElement = document.getElementById("hotel-map");
      if (mapElement) {
        mapElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleSeeAvailability = () => {
    navigate("/coming-soon");
  };

  const handleLocationClick = (location: string) => {
    console.log("Location clicked:", location);
  };

  return (
    <div id="hotel-surroundings" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Hotel surroundings
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-[#003b95] text-sm">
                Guests loved walking around the neighbourhood!
              </p>
              <button
                onClick={handleShowMap}
                className="text-[#003b95] text-sm underline hover:no-underline"
              >
                Excellent location - show map
              </button>
            </div>
          </div>
          <button
            onClick={handleSeeAvailability}
            className="bg-[#003b95] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d73] transition-colors"
          >
            See availability
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            {hotel?.surroundings?.nearbyAttractions?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    What's nearby
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.nearbyAttractions.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-gray-900 group-hover:text-[#003b95] transition-colors text-sm">
                          {location.name}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {hotel?.surroundings?.topAttractions?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Top attractions
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.topAttractions.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-gray-900 group-hover:text-[#003b95] transition-colors text-sm">
                          {location.name}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {hotel?.surroundings?.restaurantsCafes?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Restaurants & cafes
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.restaurantsCafes.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          {location.type && (
                            <>
                              <span className="text-gray-500 text-xs">
                                {location.type}
                              </span>
                              <span className="text-gray-400 mx-1">•</span>
                            </>
                          )}
                          <span className="text-gray-900 group-hover:text-[#003b95] transition-colors text-sm">
                            {location.name}
                          </span>
                        </div>
                        <span className="text-gray-600 text-xs">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {hotel?.surroundings?.naturalBeauty?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mountain className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Natural beauty
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.naturalBeauty.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          {location.type && (
                            <>
                              <span className="text-gray-500 text-xs">
                                {location.type}
                              </span>
                              <span className="text-gray-400 mx-1">•</span>
                            </>
                          )}
                          <span className="text-gray-900 group-hover:text-[#003b95] transition-colors text-sm">
                            {location.name}
                          </span>
                        </div>
                        <span className="text-gray-600 text-xs">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {hotel?.surroundings?.publicTransport?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bus className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Public transport
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.publicTransport.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          {location.type && (
                            <>
                              <span className="text-gray-500 text-xs">
                                {location.type}
                              </span>
                              <span className="text-gray-400 mx-1">•</span>
                            </>
                          )}
                          <span className="text-gray-900 group-hover:text-[#003b95] transition-colors text-sm">
                            {location.name}
                          </span>
                        </div>
                        <span className="text-gray-600 text-xs">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {hotel?.surroundings?.closestAirports?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Closest airports
                  </h3>
                </div>
                <div className="space-y-2">
                  {hotel.surroundings.closestAirports.map(
                    (location: LocationItem, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationClick(location.name)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-gray-900 group-hover:text-[#003b95] transition-colors">
                          {location.name}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {location.distance}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
