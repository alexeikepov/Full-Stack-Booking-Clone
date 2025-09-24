import type { Hotel } from "@/types/hotel";

interface HotelOverviewProps {
  hotel: Hotel;
}

export default function HotelOverview({ hotel }: HotelOverviewProps) {
  // Get amenities from hotel rooms
  const getHotelAmenities = () => {
    const amenities = new Set<string>();

    // Collect amenities from all rooms
    hotel.rooms?.forEach((room) => {
      room.amenities.forEach((amenity) => {
        amenities.add(amenity);
      });
    });

    // Convert to array and return first 8 amenities
    return Array.from(amenities).slice(0, 8);
  };

  const handleReserveClick = () => {
    const availabilityElement = document.getElementById("info");
    if (availabilityElement) {
      availabilityElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = hotel.mostPopularFacilities || getHotelAmenities();

  return (
    <div id="overview" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hotel description */}
            {hotel.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  About this hotel
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {hotel.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Property highlights
              </h3>
              <p className="text-base font-bold text-gray-900 mb-3">
                Perfect for a 1-night stay!
              </p>

              <div className="space-y-3">
                {/* Location info */}
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Situated in the real heart of Jerusalem, this hotel has an
                    excellent location score of 9.5
                  </p>
                </div>

                {/* Rooms with features (only when provided by backend) */}
                {Array.isArray(hotel.propertyHighlights?.roomsWith) &&
                  hotel.propertyHighlights!.roomsWith.length > 0 && (
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-2">
                        Rooms with:
                      </h4>
                      <div className="space-y-2">
                        {hotel.propertyHighlights!.roomsWith.map(
                          (item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5 text-gray-600 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <span className="text-sm text-gray-700">
                                {item}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Reserve button */}
              <button
                onClick={handleReserveClick}
                className="w-full bg-[#007BFF] text-white font-bold py-2 px-3 rounded text-sm hover:bg-[#0056b3] transition-colors mt-4"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
