import React from "react";

interface HotelSurroundingsProps {
  hotelId?: string;
}

export default function HotelSurroundings({ hotelId }: HotelSurroundingsProps) {
  const handleShowMap = () => {
    // TODO: Implement map display
    console.log("Show map clicked");
  };

  const handleSeeAvailability = () => {
    // TODO: Navigate to booking or show availability
    console.log("See availability clicked");
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
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  What's nearby
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Zion Square", distance: "1.1 km" },
                  { name: "Shrine of the Book", distance: "1.9 km" },
                  { name: "Israel Museum", distance: "2 km" },
                  { name: "Jaffa Gate", distance: "2.1 km" },
                  { name: "Damascus Gate", distance: "2.1 km" },
                  { name: "Tower of David Museum", distance: "2.1 km" },
                  { name: "Holyland Model of Jerusalem", distance: "2.2 km" },
                  { name: "Montefiore Windmill", distance: "2.3 km" },
                  { name: "Jerusalem Botanical Garden", distance: "2.7 km" },
                  { name: "Rockefeller Museum", distance: "3 km" },
                ].map((location, index) => (
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
                ))}
              </div>
            </div>

            {/* Top attractions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  Top attractions
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Garden of Gethsemane", distance: "3.5 km" },
                  { name: "Yad Vashem", distance: "4.8 km" },
                  { name: "Rachel's Tomb", distance: "8 km" },
                  { name: "Manger Square", distance: "11 km" },
                  { name: "Al Manara Square", distance: "18 km" },
                ].map((location, index) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-8">
            {/* Restaurants & cafes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  Restaurants & cafes
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Cafe/bar • Cafe Rosterie", distance: "250 m" },
                  {
                    name: "Cafe/bar • Gatsby Cocktail Room",
                    distance: "950 m",
                  },
                  {
                    name: "Cafe/bar • The Barrel Public House",
                    distance: "1.1 km",
                  },
                ].map((location, index) => (
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
                ))}
              </div>
            </div>

            {/* Natural beauty */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  Natural beauty
                </h3>
              </div>
              <div className="space-y-2">
                {[{ name: "Mountain • Temple Mount", distance: "3.1 km" }].map(
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

          {/* Right Column */}
          <div className="space-y-8">
            {/* Public transport */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  Public transport
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Bus • Jerusalem Central Bus Station",
                    distance: "1.1 km",
                  },
                  {
                    name: "Train • Jerusalem - Yitzhak Navon",
                    distance: "1.1 km",
                  },
                  { name: "Train • Jerusalem Malha", distance: "5 km" },
                  { name: "Bus • Ramallah Bus Station", distance: "18 km" },
                ].map((location, index) => (
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
                ))}
              </div>
            </div>

            {/* Closest airports */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <h3 className="text-sm font-bold text-gray-900">
                  Closest airports
                </h3>
              </div>
              <div className="space-y-2">
                {[{ name: "Ben Gurion Airport", distance: "46 km" }].map(
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
