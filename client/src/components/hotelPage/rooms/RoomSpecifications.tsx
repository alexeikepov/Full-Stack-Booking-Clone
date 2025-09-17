import { MdBed, MdBathtub, MdSquare, MdGroup } from "react-icons/md";

interface RoomSpecificationsProps {
  room: any;
}

export default function RoomSpecifications({ room }: RoomSpecificationsProps) {
  return (
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
          Max {room.maxAdults} adults, {room.maxChildren} children
        </span>
      </div>
    </div>
  );
}
