interface RoomAmenitiesProps {
  room: any;
}

export default function RoomAmenities({ room }: RoomAmenitiesProps) {
  return (
    <div className="space-y-2 text-[14px]">
      {/* Breakfast */}
      {room.amenities.some((a: string) => /breakfast/i.test(a)) && (
        <div className="flex items-center gap-2">
          <span>☕</span>
          <span>
            <span className="font-medium">Good breakfast</span>
          </span>
        </div>
      )}

      {/* High-speed internet */}
      {(room.amenities.some((a: string) => /wifi|internet/i.test(a)) ||
        room.facilities.some((a: string) => /wifi|internet/i.test(a))) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>Includes high-speed internet</span>
        </div>
      )}

      {/* Free cancellation */}
      {room.categories.some((c: string) => /free cancellation/i.test(c)) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>Free cancellation</span>
        </div>
      )}

      {/* No prepayment */}
      {room.categories.some((c: string) => /no prepayment/i.test(c)) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>No prepayment needed – pay at the property</span>
        </div>
      )}

      {/* Genius discount */}
      {room.categories.some((c: string) => /genius/i.test(c)) && (
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
  );
}
