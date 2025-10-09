import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/search/DatePicker";
import { GuestsPopover } from "@/components/search/GuestsPopover";
import { useSearchStore } from "@/stores/search";
import {
  MdPerson,
  MdPeople,
  MdBed,
  MdBathtub,
  MdSquare,
  MdGroup,
} from "react-icons/md";

interface HotelInfoPricesProps {
  hotel: Hotel;
  isLoading?: boolean;
}

export default function HotelInfoPrices({
  hotel,
  isLoading = false,
}: HotelInfoPricesProps) {
  const rooms = hotel.rooms || [];

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    picker,
    adults,
    children,
    rooms: searchRooms,
    setPicker,
    setAdults,
    setChildren,
    setRooms,
  } = useSearchStore();

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
      `Auto-updating rooms: ${searchRooms} -> ${requiredRooms} (${totalGuests} guests)`,
    );
    setRooms(requiredRooms);
  }

  // Auto-update URL when rooms change (only if less than required)
  useEffect(() => {
    if (searchRooms < requiredRooms) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("rooms", requiredRooms.toString());
      setSearchParams(newParams);
    }
  }, [searchRooms, requiredRooms, searchParams, setSearchParams]);

  const handleChangeSearch = (e: React.MouseEvent) => {
    e.preventDefault();

    const base: Record<string, string> = {
      ...(searchParams.get("city") ? { city: searchParams.get("city")! } : {}),
      adults: String(adults),
      children: String(children),
      rooms: String(searchRooms),
    };

    if (picker.mode === "calendar" && picker.range?.from && picker.range?.to) {
      const next = new URLSearchParams({
        ...base,
        from: picker.range.from.toISOString().slice(0, 10),
        to: picker.range.to.toISOString().slice(0, 10),
      });
      setSearchParams(next);
      // Обновляем URL без перенаправления и прокрутки
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${next.toString()}`,
      );

      // Прокручиваем к секции с ценами
      setTimeout(() => {
        const infoSection = document.getElementById("info");
        if (infoSection) {
          infoSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

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
          <div className="flex items-center gap-2 text-blue-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-sm font-medium hover:bg-blue-50 rounded px-2 py-1 cursor-pointer transition-colors">
              We Price Match
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="rounded-[8px] bg-[hsl(44,99%,50%)] p-1 shadow-[0_2px_10px_rgba(0,0,0,0.12)] mb-8 max-w-2xl">
          <div className="grid grid-cols-[1.3fr_1.1fr_auto] gap-1">
            <DatePicker
              value={picker}
              onChange={setPicker}
              triggerClassName="h-14"
            />

            <GuestsPopover
              adults={adults}
              children={children}
              rooms={searchRooms}
              setAdults={setAdults}
              setChildren={setChildren}
              setRooms={setRooms}
              minRooms={requiredRooms}
            />

            {/* Change search button */}
            <button
              onClick={handleChangeSearch}
              className="h-14 rounded-md bg-[#0071c2] px-6 text-[18px] font-semibold text-white hover:bg-[#0a69b4]"
            >
              Change search
            </button>
          </div>
        </div>

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
          <div className="border border-[#e6e6e6] overflow-hidden">
            {/* Table header */}
            <div className="bg-[#003580] text-white">
              <div className="grid grid-cols-[minmax(320px,1.2fr)_140px_220px_1.8fr_88px_180px]">
                <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
                  Room type
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
                  Number of guests
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Today's price
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
                  Your choices
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30 bg-[#2c5aa0] text-white">
                  Select rooms
                </div>
                <div className="px-4 py-3 font-semibold bg-[#2c5aa0] text-white" />
              </div>
            </div>

            {/* Room details */}
            <div className="bg-white">
              {rooms.map((room, index) => (
                <div key={room._id.$oid}>
                  {/* Row grid mirrors header widths */}
                  <div className="grid grid-cols-[minmax(320px,1.2fr)_140px_220px_1.8fr_88px_180px] gap-0 p-0 divide-x divide-[#e6e6e6]">
                    <div
                      className={`p-4 space-y-3 ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <a
                        href="#"
                        className="text-[#0071c2] font-semibold text-lg inline-block hover:underline"
                      >
                        {room.name}
                      </a>

                      {/* Room specifications */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MdBed className="text-gray-500" size={16} />
                          <span>
                            {room.bedrooms} bedroom
                            {room.bedrooms > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MdBathtub className="text-gray-500" size={16} />
                          <span>
                            {room.bathrooms} bathroom
                            {room.bathrooms > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MdSquare className="text-gray-500" size={16} />
                          <span>{room.sizeSqm} m²</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MdGroup className="text-gray-500" size={16} />
                          <span>
                            Max {room.maxAdults} adults, {room.maxChildren}{" "}
                            children
                          </span>
                        </div>
                      </div>

                      {/* Availability warning */}
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span>Only {room.availableRooms} left on our site</span>
                      </div>

                      {/* Categories */}
                      {room.categories && room.categories.length > 0 && (
                        <div className="space-y-1 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {room.categories.map((category, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Amenities from backend */}
                      <div className="space-y-1 text-sm">
                        {room.amenities.slice(0, 6).map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Number of guests */}
                    <div
                      className={`p-4 flex items-start justify-start ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-2xl text-gray-600 mb-1">
                          {Array.from(
                            { length: Math.min(room.capacity, 4) },
                            (_, i) => (
                              <span key={i} className="inline-block mr-1">
                                <MdPerson className="text-gray-600" size={22} />
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Today's price */}
                    <div
                      className={`p-4 text-left ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-2xl font-bold text-gray-900">
                          ₪{" "}
                          {room.pricePerNight
                            ? room.pricePerNight.toLocaleString()
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                      {/* Show room calculation details */}
                      {(room as any).roomsNeeded &&
                        (room as any).roomsNeeded > 1 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {(room as any).roomsNeeded} rooms needed for{" "}
                            {adults + children} guests (₪
                            {(room as any).pricePerRoom?.toLocaleString()} per
                            room)
                          </div>
                        )}
                    </div>

                    {/* Your choices */}
                    <div
                      className={`p-4 space-y-2 text-[14px] ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      {/* Breakfast */}
                      {room.amenities.some((a) => /breakfast/i.test(a)) && (
                        <div className="flex items-center gap-2">
                          <span>☕</span>
                          <span>
                            <span className="font-medium">Good breakfast</span>
                          </span>
                        </div>
                      )}

                      {/* High-speed internet */}
                      {(room.amenities.some((a) => /wifi|internet/i.test(a)) ||
                        room.facilities.some((a) =>
                          /wifi|internet/i.test(a),
                        )) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Includes high-speed internet</span>
                        </div>
                      )}

                      {room.categories.some((c) =>
                        /free cancellation/i.test(c),
                      ) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Free cancellation</span>
                        </div>
                      )}

                      {/* No prepayment */}
                      {room.categories.some((c) =>
                        /no prepayment/i.test(c),
                      ) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>
                            No prepayment needed – pay at the property
                          </span>
                        </div>
                      )}

                      {/* Genius discount */}
                      {room.categories.some((c) => /genius/i.test(c)) && (
                        <div className="flex items-center gap-2 text-[#0071c2]">
                          <span>🏷️</span>
                          <span>Genius discount may be available</span>
                        </div>
                      )}

                      {/* Standard amenities */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Free WiFi</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Free cancellation</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>No prepayment needed</span>
                        </div>
                      </div>
                    </div>

                    {/* Select rooms */}
                    <div
                      className={`p-4 flex items-start gap-2 ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                        {Array.from(
                          { length: (room.availableRooms || 0) + 1 },
                          (_, i) => i,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reserve button column */}
                    <div className="p-4 flex items-start border-b-0">
                      {index === 0 ? (
                        <div>
                          <Button className="bg-[#0071c2] hover:bg-[#005fa3] text-white px-4 py-2 text-sm font-medium">
                            I'll reserve
                          </Button>
                          <div className="mt-3 text-sm text-gray-600">
                            • You won't be charged in the next step
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-gray-400"
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
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Нет свободных комнат
              </h3>
              <p className="text-gray-600">
                К сожалению, в данный момент нет доступных комнат для выбранных
                дат.
              </p>
            </div>
          </div>
        )}

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
