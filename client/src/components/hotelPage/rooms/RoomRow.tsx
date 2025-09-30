import { useState } from "react";
import { MdPerson } from "react-icons/md";
import RoomSpecifications from "./RoomSpecifications";
import RoomAmenities from "./RoomAmenities";
import RoomSelector from "./RoomSelector";
import PriceSummary from "../info/PriceSummary";
import ImageViewer from "../gallery/ImageViewer";

interface RoomRowProps {
  room: any;
  index: number;
  selectedRooms: Record<string, number>;
  onRoomSelect: (roomId: string, count: number) => void;
  getRoomId: (room: any, index: number) => string;
  totalSelectedRooms: number;
  totalPrice: number;
  firstSelectedRoom: any;
  adults: number;
  children: number;
  hotel: any;
}

export default function RoomRow({
  room,
  index,
  selectedRooms,
  onRoomSelect,
  getRoomId,
  totalSelectedRooms,
  totalPrice,
  firstSelectedRoom,
  adults,
  children,
  hotel,
}: RoomRowProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const calculateRequiredRooms = (adults: number, children: number) => {
    const totalGuests = adults + children;
    const guestsPerRoom = 3;
    const minRooms = Math.ceil(totalGuests / guestsPerRoom);
    return Math.max(1, minRooms);
  };

  const requiredRooms = calculateRequiredRooms(adults, children);
  const pricePerRoom = room.pricePerNight;

  const roomImages: string[] = Array.isArray(room.photos) && room.photos.length
    ? room.photos
    : Array.isArray(room.media)
    ? room.media
        .filter((m: any) => m && (m.url || typeof m === "string"))
        .map((m: any) => (typeof m === "string" ? m : m.url))
    : [];

  const openViewer = (startIdx = 0) => {
    if (!roomImages.length) return;
    setViewerIndex(Math.min(Math.max(0, startIdx), roomImages.length - 1));
    setViewerOpen(true);
  };
  const closeViewer = () => setViewerOpen(false);
  const nextImage = () =>
    setViewerIndex((i) => (i + 1) % Math.max(1, roomImages.length));
  const prevImage = () =>
    setViewerIndex((i) => (i - 1 + Math.max(1, roomImages.length)) % Math.max(1, roomImages.length));

  return (
    <div key={room._id || room.id}>
      <ImageViewer
        isOpen={viewerOpen}
        currentIndex={viewerIndex}
        images={roomImages}
        hotel={hotel}
        onClose={closeViewer}
        onNext={nextImage}
        onPrev={prevImage}
      />
      <div
        className={`grid grid-cols-[minmax(320px,1.2fr)_140px_220px_1.8fr_88px_180px] gap-0 p-0 divide-x divide-[#e6e6e6] ${
          index === 0 ? "sticky top-16 z-30" : ""
        }`}
      >
        <div
          className={`p-4 space-y-3 ${
            index > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <button
            onClick={() => openViewer(0)}
            className="text-[#0071c2] font-semibold text-lg inline-block hover:underline"
          >
            {room.name}
          </button>

          <RoomSpecifications room={room} />
          {(room.availableRooms || room.availableUnits || 0) > 0 && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Only {room.availableRooms || room.availableUnits || 0} left on our site</span>
            </div>
          )}
          {(room.availableRooms || room.availableUnits || 0) === 0 && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span>Sold out</span>
            </div>
          )}

          {room.categories && room.categories.length > 0 && (
            <div className="space-y-1 text-sm">
              <div className="flex flex-wrap gap-1">
                {room.categories.map((category: string, idx: number) => (
                  <span
                    key={`category-${room._id || room.id}-${idx}`}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1 text-sm">
            {(room.amenities || [])
              .slice(0, 6)
              .map((amenity: string, idx: number) => (
                <div
                  key={`amenity-${room._id || room.id}-${idx}`}
                  className="flex items-center gap-2"
                >
                  <span className="text-green-600">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
          </div>
        </div>

        <div
          className={`p-4 flex items-start justify-start ${
            index > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <div className="text-left">
            <div className="text-2xl text-gray-600 mb-1">
              {Array.from(
                { length: Math.min(room.capacity || 2, 4) },
                (_, i) => (
                  <span
                    key={`person-${room._id || room.id}-${i}`}
                    className="inline-block mr-1"
                  >
                    <MdPerson className="text-gray-600" size={22} />
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div
          className={`p-4 text-left ${
            index > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900">
              ₪{" "}
              {room.pricePerNight ? room.pricePerNight.toLocaleString() : "N/A"}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
          {requiredRooms > 1 && (
            <div className="text-xs text-gray-400 mt-1">
              {requiredRooms} rooms needed for {adults + children} guests (₪
              {pricePerRoom?.toLocaleString()} per room)
            </div>
          )}
        </div>

        <div className={`p-4 ${index > 0 ? "border-t border-gray-200" : ""}`}>
          <RoomAmenities room={room} />
        </div>

        <div
          className={`p-4 flex items-start gap-2 ${
            index > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <RoomSelector
            room={room}
            selectedRooms={selectedRooms}
            onRoomSelect={onRoomSelect}
            getRoomId={(room, idx) => getRoomId(room, index)}
            index={index}
          />
        </div>

        <div
          className={`p-4 flex items-start border-b-0 ${
            totalSelectedRooms > 0 ? "bg-blue-50" : "bg-white"
          }`}
        >
          {index === 0 ? (
            <div className="w-full">
              <PriceSummary
                totalSelectedRooms={totalSelectedRooms}
                totalPrice={totalPrice}
                firstSelectedRoom={firstSelectedRoom}
                hotel={hotel}
                selectedRooms={selectedRooms}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
