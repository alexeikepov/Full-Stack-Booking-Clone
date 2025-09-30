import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Hotel, Room } from "@/types/hotel";
import { useSearchStore } from "@/stores/search";
import { getHotelRooms } from "@/lib/api";
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
  const [isSticky, setIsSticky] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {}
  );
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const {
    adults,
    children,
    rooms: searchRooms,
    setRooms,
    picker,
  } = useSearchStore();

  const from = picker.mode === "calendar" ? picker.range?.from : undefined;
  const to = picker.mode === "calendar" ? picker.range?.to : undefined;

  // Fetch rooms from backend with availability data
  const {
    data: roomsData,
    isLoading: roomsLoading,
    error: roomsError,
  } = useQuery({
    queryKey: ["hotelRooms", hotel._id?.$oid, from, to],
    queryFn: () => {
      const formatDateForAPI = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      return getHotelRooms(hotel._id?.$oid, {
        from: from ? formatDateForAPI(from) : undefined,
        to: to ? formatDateForAPI(to) : undefined,
      });
    },
    enabled: Boolean(hotel._id?.$oid),
    retry: 1,
  });

  // Use backend data if available, otherwise fallback to hotel data
  const rooms = roomsData?.rooms || hotel.rooms || [];

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

  // Helper: stable unique room id (never empty)
  const getRoomId = (room: Room, index: number) => {
    const nameToken = String((room as any).name || "room").replace(/\s+/g, "-");
    return (room as any)._id?.$oid || (room as any).id || `${index}-${nameToken}`;
  };

  // Handle room selection
  const handleRoomSelect = (roomId: string, count: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: count,
    }));
  };

  // Calculate total price for selected rooms (per night)
  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(selectedRooms).forEach(([roomId, count]) => {
      if (count > 0) {
        const room = rooms.find((r: Room) => getRoomId(r) === roomId);
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
        return rooms.find((r: Room) => getRoomId(r) === roomId);
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

        // Header becomes sticky when table top reaches viewport top
        const tableTopReached = tableRect.top <= 0;

        // Header stops being sticky when table bottom is above viewport top
        const tableBottomVisible = tableRect.bottom > 0;

        const shouldBeSticky = tableTopReached && tableBottomVisible;

        if (shouldBeSticky !== isSticky) {
          setIsSticky(shouldBeSticky);
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky, rooms.length]);

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
        {(isLoading || roomsLoading) && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Updating prices...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {roomsError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">
                Failed to load room availability
              </p>
              <p className="text-gray-500 text-sm">Please try again later</p>
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
            <div
              className="bg-white"
              style={{ paddingTop: isSticky ? "60px" : "0" }}
            >
              {rooms.map((room: Room, index: number) => {
                return (
                  <RoomRow
                    key={getRoomId(room, index)}
                    room={room}
                    index={index}
                    selectedRooms={selectedRooms}
                    onRoomSelect={handleRoomSelect}
                    getRoomId={getRoomId}
                    totalSelectedRooms={totalSelectedRooms}
                    totalPrice={calculateTotalPrice()}
                    firstSelectedRoom={firstSelectedRoom}
                    adults={adults}
                    children={children}
                    hotel={hotel}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
