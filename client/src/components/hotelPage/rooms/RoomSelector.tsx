import { useState } from "react";

interface RoomSelectorProps {
  room: any;
  selectedRooms: Record<string, number>;
  onRoomSelect: (roomId: string, count: number) => void;
  getRoomId: (room: any) => string;
}

export default function RoomSelector({
  room,
  selectedRooms,
  onRoomSelect,
  getRoomId,
}: RoomSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const roomId = getRoomId(room);
  const currentCount = selectedRooms[roomId] || 0;
  const maxRooms = Math.min(room.availableRooms, 5);

  const options = Array.from({ length: maxRooms + 1 }, (_, i) => i);

  const handleSelect = (value: number) => {
    onRoomSelect(roomId, value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer text-center flex items-center justify-between"
      >
        <span>{currentCount}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
          {options.map((value, index) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`w-full px-3 py-2 text-sm font-medium text-left transition-colors ${
                value === currentCount
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${
                index < options.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
