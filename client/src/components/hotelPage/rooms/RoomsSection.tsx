import { useState } from "react";
import RoomCard from "./RoomCard";

export type Hotel = {
  _id: string;
  id?: string;
  name: string;
  address: string;
  country: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  stars: number;
  description: string;
  shortDescription?: string;
  rooms?: any[];
  photos?: string[];
  amenities?: string[];
  facilities?: string[];
  policies?: any;
  reviews?: any[];
  rating?: number;
  pricePerNight?: number;
  currency?: string;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

interface RoomsSectionProps {
  hotel: Hotel;
  onRoomSelect?: (room: any) => void;
}

export default function RoomsSection({
  hotel,
  onRoomSelect,
}: RoomsSectionProps) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("price");

  const roomTypes = [
    { value: "all", label: "All Rooms" },
    { value: "STANDARD", label: "Standard" },
    { value: "SUPERIOR", label: "Superior" },
    { value: "DELUXE", label: "Deluxe" },
    { value: "SUITE", label: "Suite" },
    { value: "FAMILY", label: "Family" },
    { value: "BUSINESS", label: "Business" },
    { value: "ACCESSIBLE", label: "Accessible" },
    { value: "PREMIUM", label: "Premium" },
  ];

  const sortOptions = [
    { value: "price", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "capacity", label: "Capacity" },
    { value: "size", label: "Room Size" },
  ];

  const filteredAndSortedRooms = (hotel.rooms || [])
    .filter((room) => {
      if (filter === "all") return true;
      return room.roomType === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerNight - b.pricePerNight;
        case "price-desc":
          return b.pricePerNight - a.pricePerNight;
        case "capacity":
          return b.capacity - a.capacity;
        case "size":
          return (b.sizeSqm || 0) - (a.sizeSqm || 0);
        default:
          return 0;
      }
    });

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    onRoomSelect?.(room);
  };

  const getRoomTypeStats = () => {
    const stats: Record<
      string,
      { count: number; minPrice: number; maxPrice: number }
    > = {};

    (hotel.rooms || []).forEach((room) => {
      if (!stats[room.roomType]) {
        stats[room.roomType] = {
          count: 0,
          minPrice: room.pricePerNight,
          maxPrice: room.pricePerNight,
        };
      }

      stats[room.roomType].count++;
      stats[room.roomType].minPrice = Math.min(
        stats[room.roomType].minPrice,
        room.pricePerNight
      );
      stats[room.roomType].maxPrice = Math.max(
        stats[room.roomType].maxPrice,
        room.pricePerNight
      );
    });

    return stats;
  };

  const roomTypeStats = getRoomTypeStats();

  return (
    <div id="rooms" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Available Rooms
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(roomTypeStats).map(([type, stats]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600">{type}</div>
                <div className="text-lg font-bold text-gray-900">
                  {stats.count} rooms
                </div>
                <div className="text-sm text-gray-500">
                  ₪{stats.minPrice} - ₪{stats.maxPrice}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedRooms.map((room) => (
            <RoomCard
              key={room._id || room.id}
              room={room}
              selected={
                selectedRoom?._id === room._id || selectedRoom?.id === room.id
              }
              onSelect={handleRoomSelect}
            />
          ))}
        </div>

        {filteredAndSortedRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No rooms found</div>
            <div className="text-gray-400">Try adjusting your filters</div>
          </div>
        )}

        {selectedRoom && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Room: {selectedRoom.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Price per night</div>
                <div className="text-xl font-bold text-gray-900">
                  ₪{selectedRoom.pricePerNight.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Capacity</div>
                <div className="text-lg font-semibold text-gray-900">
                  {selectedRoom.capacity} guests
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Room size</div>
                <div className="text-lg font-semibold text-gray-900">
                  {selectedRoom.sizeSqm}m²
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Proceed to Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
