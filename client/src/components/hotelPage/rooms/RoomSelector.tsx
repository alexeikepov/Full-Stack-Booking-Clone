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
  return (
    <select
      value={selectedRooms[getRoomId(room)] || 0}
      onChange={(e) => onRoomSelect(getRoomId(room), parseInt(e.target.value))}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      <option value={0}>0</option>
      {room.availableRooms >= 1 && <option value={1}>1</option>}
      {room.availableRooms >= 2 && <option value={2}>2</option>}
      {room.availableRooms >= 3 && <option value={3}>3</option>}
      {room.availableRooms >= 4 && <option value={4}>4</option>}
      {room.availableRooms > 5 && <option value={6}>5+</option>}
    </select>
  );
}
