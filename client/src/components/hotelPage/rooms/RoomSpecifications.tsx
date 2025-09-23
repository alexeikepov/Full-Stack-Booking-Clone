import { MdBed, MdBathtub, MdSquare, MdGroup } from "react-icons/md";

interface RoomSpecificationsProps {
  room: any;
}

export default function RoomSpecifications({ room }: RoomSpecificationsProps) {
  // Safely get values with defaults
  const bedrooms = room.bedrooms || 1;
  const bathrooms = room.bathrooms || 1;
  const sizeSqm = room.sizeSqm || 0;
  const maxAdults = room.maxAdults || 2;
  const maxChildren = room.maxChildren || 0;

  return (
    <div className="space-y-1 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <MdBed className="text-gray-500" size={16} />
        <span>
          {bedrooms} bedroom
          {bedrooms > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MdBathtub className="text-gray-500" size={16} />
        <span>
          {bathrooms} bathroom
          {bathrooms > 1 ? "s" : ""}
        </span>
      </div>
      {sizeSqm > 0 && (
        <div className="flex items-center gap-2">
          <MdSquare className="text-gray-500" size={16} />
          <span>{sizeSqm} m²</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <MdGroup className="text-gray-500" size={16} />
        <span>
          Max {maxAdults} adults, {maxChildren} children
        </span>
      </div>
    </div>
  );
}
