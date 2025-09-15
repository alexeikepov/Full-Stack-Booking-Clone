import type { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/search/DatePicker";
import { GuestsPopover } from "@/components/search/GuestsPopover";
import { useSearchStore } from "@/stores/search";
import { MdPerson, MdPeople } from "react-icons/md";

interface HotelInfoPricesProps {
  hotel: Hotel;
}

export default function HotelInfoPrices({ hotel }: HotelInfoPricesProps) {
  const rooms = hotel.rooms || [];

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

  // Helper to check if two date ranges overlap
  function isOverlapping(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && bStart < aEnd;
  }

  function roomIsAvailable(room: Hotel["rooms"][number]): boolean {
    const from = picker.mode === "calendar" ? picker.range?.from ?? null : null;
    const to = picker.mode === "calendar" ? picker.range?.to ?? null : null;
    if (!from || !to || !(to > from)) {
      // If dates are not selected, treat as available
      return true;
    }
    for (const r of room.reservations || []) {
      const rStart = new Date(r.checkIn);
      const rEnd = new Date(r.checkOut);
      if (isOverlapping(from, to, rStart, rEnd)) return false;
    }
    return true;
  }

  return (
    <div id="info" className="bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
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
            />

            {/* Change search button */}
            <button className="h-14 rounded-md bg-[#0071c2] px-6 text-[18px] font-semibold text-white hover:bg-[#0a69b4]">
              Change search
            </button>
          </div>
        </div>

        {/* Room selection table */}
        {rooms.length > 0 ? (
          <div className="border border-[#e6e6e6] overflow-hidden">
            {/* Table header */}
            <div className="bg-[#003580] text-white">
              <div className="grid grid-cols-[minmax(320px,1.2fr)_140px_220px_1.8fr_88px_180px]">
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Room type
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Number of guests
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Today's price
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Your choices
                </div>
                <div className="px-4 py-3 font-semibold border-r border-white/30">
                  Select rooms
                </div>
                <div className="px-4 py-3 font-semibold" />
              </div>
            </div>

            {/* Room details */}
            <div className="bg-white">
              {rooms.map((room, index) => (
                <div key={room.id}>
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

                      {/* Amenities from backend */}
                      <div className="space-y-1 text-sm">
                        {room.amenities?.slice(0, 3).map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{amenity}</span>
                          </div>
                        )) || (
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <span>WiFi</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Air Conditioning</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✓</span>
                              <span>TV</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Number of guests */}
                    <div
                      className={`p-4 flex items-center justify-center ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="text-2xl text-gray-600">
                        {room.capacity === 1 ? (
                          <MdPerson className="text-gray-600" size={22} />
                        ) : (
                          <MdPeople className="text-gray-600" size={22} />
                        )}
                      </div>
                    </div>

                    {/* Today's price */}
                    <div
                      className={`p-4 text-left ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center justify-start gap-2 mb-1">
                        <div className="text-gray-600">₪</div>
                        <div className="text-2xl font-bold">
                          {room.pricePerNight.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Additional charges may apply
                      </div>
                    </div>

                    {/* Your choices */}
                    <div
                      className={`p-4 space-y-2 text-[14px] ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      {/* Breakfast */}
                      {room.amenities?.some((a) => /breakfast/i.test(a)) && (
                        <div className="flex items-center gap-2">
                          <span>☕</span>
                          <span>
                            <span className="font-medium">Good breakfast</span>
                          </span>
                        </div>
                      )}

                      {/* High-speed internet */}
                      {(room.amenities?.some((a) => /wifi|internet/i.test(a)) ||
                        room.facilities?.some((a) =>
                          /wifi|internet/i.test(a)
                        )) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Includes high-speed internet</span>
                        </div>
                      )}

                      {/* Free cancellation */}
                      {room.categories?.some((c) =>
                        /free cancellation/i.test(c)
                      ) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>Free cancellation</span>
                        </div>
                      )}

                      {/* No prepayment */}
                      {room.categories?.some((c) =>
                        /no prepayment/i.test(c)
                      ) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>
                            No prepayment needed – pay at the property
                          </span>
                        </div>
                      )}

                      {/* Genius discount */}
                      {room.categories?.some((c) => /genius/i.test(c)) && (
                        <div className="flex items-center gap-2 text-[#0071c2]">
                          <span>🏷️</span>
                          <span>Genius discount may be available</span>
                        </div>
                      )}

                      {/* If nothing matched, show neutral note */}
                      {!(
                        room.amenities?.some((a) =>
                          /wifi|internet|breakfast/i.test(a)
                        ) ||
                        room.facilities?.some((a) =>
                          /wifi|internet/i.test(a)
                        ) ||
                        room.categories?.some((c) =>
                          /(free cancellation|no prepayment|genius)/i.test(c)
                        )
                      ) && (
                        <div className="text-sm text-gray-500">
                          No additional information available
                        </div>
                      )}
                    </div>

                    {/* Select rooms */}
                    <div
                      className={`p-4 flex items-center gap-2 ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
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
