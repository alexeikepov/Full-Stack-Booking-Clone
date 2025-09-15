import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoomOption {
  id: string;
  name: string;
  guests: number;
  price: number;
  breakfast: {
    included: boolean;
    price?: number;
  };
  features: string[];
  availability: string;
  bedType: string;
  roomSize: string;
  view: string;
  amenities: string[];
  includedAmenities: string[];
}

interface RoomSelectionProps {
  rooms: RoomOption[];
}

const fmt = (n: number, currency = "ILS") =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency }).format(n);

export default function RoomSelection({ rooms }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {}
  );
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

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
                key={room.id}
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
                      Recommended for {room.guests} adults
                    </div>

                    {/* Availability warning */}
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span>{room.availability}</span>
                    </div>

                    {/* Bed type */}
                    <div className="flex items-center gap-2 text-sm">
                      <span>🛏️</span>
                      <span>{room.bedType}</span>
                    </div>

                    {/* Cot availability */}
                    <div className="flex items-center gap-2 text-sm">
                      <span>🛏️</span>
                      <span>Cot available on request</span>
                    </div>

                    {/* Room specifications */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>🚪</span>
                        <span>Room</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📐</span>
                        <span>{room.roomSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>{room.view}</span>
                      </div>
                    </div>

                    {/* Key amenities */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span>❄️</span>
                        <span>Air conditioning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🛁</span>
                        <span>Private bathroom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📺</span>
                        <span>Flat-screen TV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🔇</span>
                        <span>Soundproofing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>☕</span>
                        <span>Coffee machine</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📶</span>
                        <span>Free WiFi</span>
                      </div>
                    </div>

                    {/* Included amenities */}
                    <div className="space-y-1 text-sm">
                      {room.includedAmenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Number of guests */}
                  <div className="flex items-center justify-center">
                    <div className="text-2xl">
                      {room.guests === 1 ? "👤" : "👥"}
                    </div>
                  </div>

                  {/* Today's price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ₪ {room.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Additional charges may apply
                    </div>
                  </div>

                  {/* Your choices */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>☕</span>
                      <span className="text-sm">
                        {room.breakfast.included
                          ? `Good breakfast included`
                          : `Good breakfast ₪ ${(
                              room.breakfast.price || 70
                            ).toLocaleString()}`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Includes high-speed internet</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Free cancellation before 21 January 2026</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>No prepayment needed – pay at the property</span>
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
                      value={selectedRooms[room.id] || 0}
                      onChange={(e) =>
                        handleRoomSelect(room.id, parseInt(e.target.value))
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {[0, 1, 2, 3, 4, 5].map((num) => (
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
