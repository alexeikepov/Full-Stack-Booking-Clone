import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdBed, MdBathtub, MdSquare } from "react-icons/md";

interface RoomOption {
  _id: { $oid: string };
  name: string;
  capacity: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  amenities: string[];
  facilities: string[];
  categories: string[];
  media: { url: string; type?: string }[];
  availableRooms: number;
  reservations: Array<{
    reservationId: string;
    checkIn: string;
    checkOut: string;
  }>;
}

interface RoomSelectionProps {
  rooms: RoomOption[];
}

export default function RoomSelection({ rooms }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {},
  );

  const handleRoomSelect = (roomId: string, count: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: count,
    }));
  };

  const handleReserve = () => {
    // Handle reservation logic
    console.log("Reserving rooms:", selectedRooms);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Select your room</h2>

        {/* Filter by section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Filter by:</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Suites</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Rooms</span>
            </label>
          </div>
        </div>

        {/* Room selection table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="bg-[#003b95] text-white">
            <div className="grid grid-cols-5 gap-4 p-4">
              <div className="font-semibold">Room type</div>
              <div className="font-semibold">Number of guests</div>
              <div className="font-semibold">Today's price</div>
              <div className="font-semibold">Your choices</div>
              <div className="font-semibold">Select rooms</div>
            </div>
          </div>

          {/* Room details */}
          <div className="bg-white">
            {rooms.map((room, index) => (
              <div
                key={room._id.$oid}
                className={`${index > 0 ? "border-t border-gray-200" : ""}`}
              >
                {/* Room type details */}
                <div className="grid grid-cols-5 gap-4 p-4">
                  <div className="space-y-3">
                    <div className="text-[#0071c2] font-semibold text-lg">
                      {room.name}
                    </div>

                    {/* Recommendation banner */}
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      Recommended for {room.maxAdults} adults,
                      {room.maxChildren} children
                    </div>

                    {/* Availability warning */}
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span>{room.availableRooms} rooms available</span>
                    </div>

                    {/* Room specifications */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MdBed className="text-gray-500" size={16} />
                        <span>
                          {room.bedrooms} bedroom{room.bedrooms > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdSquare className="text-gray-500" size={16} />
                        <span>{room.sizeSqm} m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdBathtub className="text-gray-500" size={16} />
                        <span>
                          {room.bathrooms} bathroom
                          {room.bathrooms > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Key amenities */}
                    <div className="space-y-1 text-sm">
                      {room.amenities.slice(0, 6).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Included amenities */}
                    <div className="space-y-1 text-sm">
                      {room.facilities.slice(0, 4).map((facility, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Number of guests */}
                  <div className="flex items-center justify-center">
                    <div className="text-2xl">
                      {Array.from(
                        { length: Math.min(room.capacity, 4) },
                        (_, i) => (
                          <span key={i} className="inline-block mr-1">
                            👤
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Today's price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ₪ {room.pricePerNight.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>

                  {/* Your choices */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Free WiFi included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Free cancellation available</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>No prepayment needed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#0071c2]">
                      <span>🏷️</span>
                      <span>Genius discount may be available</span>
                    </div>
                  </div>

                  {/* Select rooms */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRooms[room._id.$oid] || 0}
                      onChange={(e: { target: { value: string } }) =>
                        handleRoomSelect(
                          room._id.$oid,
                          parseInt(e.target.value),
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Array.from(
                        { length: (room.availableRooms || 0) + 1 },
                        (_, i) => i,
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    {index === 0 && (
                      <Button
                        onClick={handleReserve}
                        className="bg-[#0071c2] hover:bg-[#005fa3] text-white px-4 py-2 text-sm font-medium"
                      >
                        I'll reserve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom notice */}
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>•</span>
            <span>You won't be charged in the next step</span>
          </div>
        </div>
      </div>
    </div>
  );
}
