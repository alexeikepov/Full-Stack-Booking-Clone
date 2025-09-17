import { useEffect, useState, useRef } from "react";
import type { Hotel } from "@/types/hotel";
import { useSearchStore } from "@/stores/search";
import SearchBar from "./SearchBar";
import RoomTableHeader from "./RoomTableHeader";
import RoomRow from "../rooms/RoomRow";
import EmptyState from "./EmptyState";
import PriceMatchBanner from "../header/PriceMatchBanner";

interface HotelInfoPricesProps {
  hotel: Hotel;
  isLoading?: boolean;
}

export default function HotelInfoPrices({
  hotel,
  isLoading = false,
}: HotelInfoPricesProps) {
  const rooms = hotel.rooms || [];
  const [isSticky, setIsSticky] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {}
  );
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { adults, children, rooms: searchRooms, setRooms } = useSearchStore();

  // Calculate required rooms based on specific logic: 2 adults + 1 child = 1 room
  const calculateRequiredRooms = (adults: number, children: number) => {
    // Logic: 2 adults + 1 child = 1 room
    // Each room can accommodate 2 adults + 1 child

    // Total guests = adults + children
    const totalGuests = adults + children;

    // Each room can fit 3 people (2 adults + 1 child)
    const guestsPerRoom = 3;

    // Calculate minimum rooms needed
    const minRooms = Math.ceil(totalGuests / guestsPerRoom);

    return Math.max(1, minRooms);
  };

  // Auto-update rooms when guests change
  const totalGuests = adults + children;
  const requiredRooms = calculateRequiredRooms(adults, children);

  // Update rooms if it's less than the required amount (but allow more)
  if (searchRooms < requiredRooms) {
    console.log(
      `Auto-updating rooms: ${searchRooms} -> ${requiredRooms} (${totalGuests} guests)`
    );
    setRooms(requiredRooms);
  }

  // Auto-update URL when rooms change (only if less than required)
  useEffect(() => {
    if (searchRooms < requiredRooms) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("rooms", requiredRooms.toString());
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newParams.toString()}`
      );
    }
  }, [searchRooms, requiredRooms]);

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

  // Get total selected rooms count
  const totalSelectedRooms = Object.values(selectedRooms).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get first selected room details
  const getFirstSelectedRoomDetails = () => {
    for (const roomId in selectedRooms) {
      if (selectedRooms[roomId] > 0) {
        return rooms.find((r) => getRoomId(r) === roomId);
      }
    }
    return null;
  };

  const firstSelectedRoom = getFirstSelectedRoomDetails();

  // Handle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current && headerRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        const headerHeight = headerRef.current.offsetHeight;

        // Header becomes sticky when table top reaches viewport top
        // and table bottom is still visible
        const shouldBeSticky =
          tableRect.top <= 0 && tableRect.bottom > headerHeight;
        setIsSticky(shouldBeSticky);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rooms.length]);

  return (
    <div id="info" className="bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
            <div className="text-sm text-gray-600 mt-1">
              Prices for {adults} {adults === 1 ? "adult" : "adults"}
              {children > 0 &&
                `, ${children} ${children === 1 ? "child" : "children"}`}
              {requiredRooms > 1 && (
                <span className="text-blue-600 ml-1">
                  ({requiredRooms} rooms needed - max 2 adults + 1 child per
                  room)
                </span>
              )}
            </div>
          </div>
          {/* We Price Match section */}
          <PriceMatchBanner />
        </div>

        {/* Search bar */}
        <SearchBar requiredRooms={requiredRooms} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Updating prices...</span>
            </div>
          </div>
        )}

        {/* Room selection table */}
        {rooms.length > 0 ? (
          <div ref={tableRef} className="border border-[#e6e6e6]">
            {/* Table header */}
            <div ref={headerRef}>
              <RoomTableHeader isSticky={isSticky} />
            </div>

            {/* Room details */}
            <div className="bg-white">
              {rooms.map((room, index) => (
                <RoomRow
                  key={room._id.$oid}
                  room={room}
                  index={index}
                  selectedRooms={selectedRooms}
                  onRoomSelect={handleRoomSelect}
                  getRoomId={getRoomId}
                  totalSelectedRooms={totalSelectedRooms}
                  totalPrice={calculateTotalPrice()}
                  firstSelectedRoom={firstSelectedRoom}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
