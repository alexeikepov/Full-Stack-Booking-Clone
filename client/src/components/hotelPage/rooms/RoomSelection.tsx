import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MdBed, MdBathtub, MdSquare } from "react-icons/md";

interface RoomOption {
  _id: { $oid: string };
  id?: string; // for frontend compatibility
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

// Sticky reservation summary component
function ReservationSummary({
  selectedRooms,
  calculateTotalPrice,
  handleReserve,
}: {
  selectedRooms: Record<string, number>;
  calculateTotalPrice: () => number;
  handleReserve: () => void;
}) {
  const totalRooms = Object.values(selectedRooms).reduce(
    (sum, count) => sum + count,
    0
  );

  if (totalRooms === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={handleReserve}
            className="w-full bg-[#0071c2] hover:bg-[#005fa3] text-white py-3 text-base font-medium"
          >
            I'll reserve
          </Button>
          <div className="mt-2 text-sm text-gray-600 text-center">
            • You won't be charged yet
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">
              {totalRooms >= 6 ? "5+" : totalRooms} room
              {totalRooms !== 1 ? "s" : ""} for
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₪ {calculateTotalPrice().toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              Additional charges may apply
            </div>
          </div>

          <div className="flex-1 max-w-xs ml-8">
            <Button
              onClick={handleReserve}
              className="w-full bg-[#0071c2] hover:bg-[#005fa3] text-white py-3 text-base font-medium"
            >
              I'll reserve
            </Button>
            <div className="mt-2 text-sm text-gray-600 text-center">
              <div>You'll be taken to the next step</div>
              <div>• You won't be charged yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomSelection({ rooms }: RoomSelectionProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {}
  );
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Helper function to get room ID
  const getRoomId = (room: any) => {
    return room.id || room._id?.$oid || room._id || "";
  };

  // Handle room selection
  const handleRoomSelect = (roomId: string, count: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: count,
    }));
  };

  // Calculate total price for selected rooms
  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(selectedRooms).forEach(([roomId, count]) => {
      if (count > 0) {
        const room = rooms.find((r) => getRoomId(r) === roomId);
        if (room && room.pricePerNight) {
          total += room.pricePerNight * count;
        }
      }
    });
    return total;
  };

  const handleReserve = () => {
    // Handle reservation logic
    console.log("Reserving rooms:", selectedRooms);
  };

  // Handle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && tableRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        const tableRect = tableRef.current.getBoundingClientRect();

        // Header becomes sticky when it reaches the top of viewport
        // and table is still visible (not scrolled past)
        const shouldBeSticky =
          headerRect.top <= 0 && tableRect.bottom > headerRect.height;
        setIsSticky(shouldBeSticky);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rooms.length]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-24">
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

        {/* Sticky header overlay */}
        {isSticky && (
          <>
            <div className="bg-[#003b95] text-white flex fixed top-0 left-0 right-0 z-50 shadow-lg">
              <div className="grid grid-cols-5 gap-4 p-4 flex-1 max-w-6xl mx-auto">
                <div className="font-bold flex items-center">Room type</div>
                <div className="font-bold flex items-center justify-center">
                  Number of guests
                </div>
                <div className="font-bold flex items-center justify-end">
                  Today's price
                </div>
                <div className="font-bold flex items-center">Your choices</div>
                <div className="font-bold flex items-center">Select rooms</div>
              </div>
            </div>
            <div className="h-16"></div>
          </>
        )}

        {/* Room selection table */}
        <div className="border border-gray-200 rounded-lg" ref={tableRef}>
          {/* Table header */}
          <div className="bg-[#003b95] text-white flex" ref={headerRef}>
            <div className="grid grid-cols-5 gap-4 p-4 flex-1">
              <div className="font-bold flex items-center">Room type</div>
              <div className="font-bold flex items-center justify-center">
                Number of guests
              </div>
              <div className="font-bold flex items-center justify-end">
                Today's price
              </div>
              <div className="font-bold flex items-center">Your choices</div>
              <div className="font-bold flex items-center">Select rooms</div>
            </div>
          </div>
          {/* Room details */}
          <div className="bg-white overflow-hidden">
            {rooms.map((room, index) => (
              <div
                key={getRoomId(room) || index}
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
                      Recommended for {room.maxAdults} adults,{" "}
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
                          {room.bedrooms} bedroom
                          {room.bedrooms > 1 ? "s" : ""}
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
                        )
                      )}
                    </div>
                  </div>

                  {/* Today's price */}
                  <div className="flex flex-col items-end justify-center">
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
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedRooms[getRoomId(room)] || 0}
                      onChange={(e) =>
                        handleRoomSelect(
                          getRoomId(room),
                          parseInt(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={0}>0</option>
                      {room.availableRooms >= 1 && <option value={1}>1</option>}
                      {room.availableRooms >= 2 && <option value={2}>2</option>}
                      {room.availableRooms >= 3 && <option value={3}>3</option>}
                      {room.availableRooms >= 4 && <option value={4}>4</option>}
                      {room.availableRooms > 5 && <option value={6}>5+</option>}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky reservation summary */}
      <ReservationSummary
        selectedRooms={selectedRooms}
        calculateTotalPrice={calculateTotalPrice}
        handleReserve={handleReserve}
      />
    </div>
  );
}
