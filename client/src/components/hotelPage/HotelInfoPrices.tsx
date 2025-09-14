import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";

interface HotelInfoPricesProps {
  hotel: Hotel;
}

export default function HotelInfoPrices({ hotel }: HotelInfoPricesProps) {
  const rooms = hotel.rooms || [];

  const roomTypes = [
    {
      name: "Standard Double Room",
      size: "40 m²",
      capacity: "2 guests",
      bed: "1 large double bed",
      amenities: [
        "Air conditioning",
        "Private bathroom",
        "Flat-screen TV",
        "Free WiFi",
      ],
      price: hotel.priceFrom || 520,
      availability: "Only 1 left at this price!",
    },
    {
      name: "Superior Double Room",
      size: "45 m²",
      capacity: "2 guests",
      bed: "1 large double bed",
      amenities: [
        "Air conditioning",
        "Private bathroom",
        "Flat-screen TV",
        "Free WiFi",
        "Balcony",
        "City view",
      ],
      price: (hotel.priceFrom || 520) + 80,
      availability: "3 rooms left",
    },
  ];

  return (
    <div id="info" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Availability</h2>

        {/* Check-in/out info */}
        <div className="bg-[#f0f8ff] rounded-lg p-6 mb-8 border border-[#e6f3ff]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold text-gray-900">Check-in:</span>{" "}
              <span className="text-gray-700">From 15:00</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Check-out:</span>{" "}
              <span className="text-gray-700">Until 11:00</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                Cancellation/prepayment:
              </span>{" "}
              <span className="text-gray-700">Varies by room type</span>
            </div>
          </div>
        </div>

        {/* Room types table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-6 font-semibold text-gray-900">
                  Room type
                </th>
                <th className="text-left p-6 font-semibold text-gray-900">
                  Sleeps
                </th>
                <th className="text-left p-6 font-semibold text-gray-900">
                  Price for 1 night
                </th>
                <th className="text-left p-6 font-semibold text-gray-900">
                  Your choices
                </th>
                <th className="text-left p-6 font-semibold text-gray-900">
                  Select rooms
                </th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((room, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-[#0071c2] text-lg">
                        {room.name}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {room.size} • {room.bed}
                        </div>
                        <ul className="mt-3 space-y-2">
                          {room.amenities.slice(0, 4).map((amenity, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-green-600 text-sm">✓</span>
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      <span className="font-medium">{room.capacity}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₪{room.price}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        +₪{Math.round(room.price * 0.17)} taxes and charges
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <span className="text-lg">✓</span>
                        <span className="font-medium">Free cancellation</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <span className="text-lg">✓</span>
                        <span className="font-medium">No prepayment needed</span>
                      </div>
                      <div className="text-orange-600 font-semibold">
                        {room.availability}
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="space-y-3">
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071c2]">
                        <option value="0">0</option>
                        <option value="1">1 (₪{room.price})</option>
                        <option value="2">2 (₪{room.price * 2})</option>
                      </select>
                      <Button
                        size="sm"
                        className="w-full bg-[#0071c2] hover:bg-[#005fa3] py-2"
                      >
                        Reserve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
          <div>
            • Prices converted to show approximate local currency (ILS). You'll
            pay in the local currency (ILS).
          </div>
          <div>• VAT is not included and may be charged at the property.</div>
          <div>
            • All distances are measured in straight lines. Actual travel
            distances may vary.
          </div>
        </div>
      </div>
    </div>
  );
}