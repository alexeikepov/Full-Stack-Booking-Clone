import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getHotelById } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Users,
  Wifi,
  Home,
  Sparkles,
  Coffee,
  Utensils,
} from "lucide-react";

interface HotelFacilitiesProps {
  hotelId?: string;
}

export default function HotelFacilities({ hotelId }: HotelFacilitiesProps) {
  const { data: hotel } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => getHotelById(String(hotelId)),
    enabled: Boolean(hotelId),
    staleTime: 5 * 60 * 1000,
  });
  const navigate = useNavigate();

  const handleSeeAvailability = () => {
    navigate("/coming-soon");
  };

  const handleFacilityClick = (facility: string) => {
    // TODO: Handle facility click
    console.log("Facility clicked:", facility);
  };

  return (
    <div id="facilities" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
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

        {/* Most popular facilities */}
        {hotel?.mostPopularFacilities &&
          hotel.mostPopularFacilities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Most popular facilities
              </h3>
              <div className="space-y-2">
                {hotel.mostPopularFacilities.map(
                  (facility: any, index: number) => {
                    const facilityName =
                      typeof facility === "string" ? facility : facility.name;

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm text-gray-900"
                      >
                        <svg
                          className="w-4 h-4 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{facilityName}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {/* Facilities Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Great for your stay */}
            {hotel?.facilities?.greatForStay &&
              hotel.facilities.greatForStay.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                      Great for your stay
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.greatForStay.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Bathroom */}
            {hotel?.facilities?.bathroom &&
              hotel.facilities.bathroom.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Bathroom
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.bathroom.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Bedroom */}
            {hotel?.facilities?.bedroom &&
              hotel.facilities.bedroom.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">Bedroom</h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.bedroom.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* View */}
            {hotel?.facilities?.view && hotel.facilities.view.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                  <h3 className="text-sm font-bold text-gray-900">View</h3>
                </div>
                <div className="space-y-2">
                  {hotel.facilities.view.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3 text-green-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-900">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outdoors */}
            {hotel?.facilities?.outdoors &&
              hotel.facilities.outdoors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                      Outdoors
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.outdoors.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Kitchen */}
            {hotel?.facilities?.kitchen &&
              hotel.facilities.kitchen.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                    <h3 className="text-sm font-bold text-gray-900">Kitchen</h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.kitchen.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Room Amenities */}
            {hotel?.facilities?.roomAmenities &&
              hotel.facilities.roomAmenities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                      Room Amenities
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.roomAmenities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Living Area */}
            {hotel?.facilities?.livingArea &&
              hotel.facilities.livingArea.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Living Area
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.livingArea.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Media & Technology */}
            {hotel?.facilities?.mediaTechnology &&
              hotel.facilities.mediaTechnology.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Media & Technology
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.mediaTechnology.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Food & Drink */}
            {hotel?.facilities?.foodDrink &&
              hotel.facilities.foodDrink.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                      Food & Drink
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.foodDrink.map(
                      (facility: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-3 h-3 text-green-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm text-gray-900">
                              {typeof facility === "string"
                                ? facility
                                : facility.name}
                            </span>
                          </div>
                          {facility.note && (
                            <span className="text-xs text-gray-500">
                              {facility.note}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Internet */}
            {hotel?.facilities?.internet &&
              hotel.facilities.internet.trim() !== "" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Internet
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {hotel.facilities.internet}
                    </p>
                  </div>
                </div>
              )}

            {/* Parking */}
            {hotel?.facilities?.parking &&
              hotel.facilities.parking.trim() !== "" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                    <h3 className="text-sm font-bold text-gray-900">Parking</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {hotel.facilities.parking}
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Reception services */}
            {hotel?.facilities?.receptionServices &&
              hotel.facilities.receptionServices.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 7h5V1h-5v6z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Reception services
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.receptionServices.map(
                      (facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg
                            className="w-3 h-3 text-green-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">
                            {facility}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Safety & security */}
            {hotel?.facilities?.safetySecurity &&
              hotel.facilities.safetySecurity.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Safety & security
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.safetySecurity.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* General */}
            {hotel?.facilities?.generalFacilities &&
              hotel.facilities.generalFacilities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">General</h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.generalFacilities.map(
                      (facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg
                            className="w-3 h-3 text-green-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">
                            {facility}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Languages spoken */}
            {hotel?.facilities?.languagesSpoken &&
              hotel.facilities.languagesSpoken.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900">
                      Languages spoken
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hotel.facilities.languagesSpoken.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="w-3 h-3 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-900">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
