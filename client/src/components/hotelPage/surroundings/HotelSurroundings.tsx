import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelById } from "@/lib/api";
import { Utensils, User, Mountain, Star, Bus, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HotelSurroundingsProps {
  hotelId?: string;
}

export default function HotelSurroundings({ hotelId }: HotelSurroundingsProps) {
  const { data: hotel } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => getHotelById(String(hotelId)),
    enabled: Boolean(hotelId),
    staleTime: 5 * 60 * 1000,
  });
  const navigate = useNavigate();

  const handleShowMap = () => {
    // TODO: Implement map display
    console.log("Show map clicked");
  };

  const handleSeeAvailability = () => {
    navigate("/coming-soon");
  };

  const handleLocationClick = (location: string) => {
    // TODO: Handle location click (show on map, get directions, etc.)
    console.log("Location clicked:", location);
  };

  return (
    <div id="hotel-surroundings" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Hotel surroundings
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-[#003b95] text-xs">
                Guests loved walking around the neighbourhood!
              </p>
              <button
                onClick={handleShowMap}
                className="text-[#003b95] text-xs underline hover:no-underline"
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

        {/* Content Grid - 3 columns as in the image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* What's nearby */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  What's nearby
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.nearbyAttractions || []).map(
                  (location, index) => (
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

            {/* Top attractions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Top attractions
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.topAttractions || []).map(
                  (location, index) => (
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
          </div>

          {/* Middle Column */}
          <div className="space-y-8">
            {/* Restaurants & cafes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Restaurants & cafes
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.restaurantsCafes || []).map(
                  (location, index) => (
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

            {/* Natural beauty */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mountain className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Natural beauty
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.naturalBeauty || []).map(
                  (location, index) => (
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
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Public transport */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bus className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Public transport
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.publicTransport || []).map(
                  (location, index) => (
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

            {/* Closest airports */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Closest airports
                </h3>
              </div>
              <div className="space-y-2">
                {(hotel?.surroundings?.closestAirports || []).map(
                  (location, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
