interface RoomAmenitiesProps {
  room: any;
}

export default function RoomAmenities({ room }: RoomAmenitiesProps) {
  const amenities = room.amenities || [];
  const facilities = room.facilities || [];
  const categories = room.categories || [];

  return (
    <div className="space-y-2 text-[14px]">
      {amenities.some((a: string) => /breakfast/i.test(a)) && (
        <div className="flex items-center gap-2">
          <span>☕</span>
          <span>
            <span className="font-medium">Good breakfast</span>
          </span>
        </div>
      )}

      {(amenities.some((a: string) => /wifi|internet/i.test(a)) ||
        facilities.some((a: string) => /wifi|internet/i.test(a))) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>Includes high-speed internet</span>
        </div>
      )}

      {categories.some((c: string) => /free cancellation/i.test(c)) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>Free cancellation</span>
        </div>
      )}

      {categories.some((c: string) => /no prepayment/i.test(c)) && (
        <div className="flex items-center gap-2 text-green-600">
          <span>✓</span>
          <span>No prepayment needed – pay at the property</span>
        </div>
      )}

      {categories.some((c: string) => /genius/i.test(c)) && (
        <div className="flex items-center gap-2 text-[#0071c2]">
          <span>🏷️</span>
          <span>Genius discount may be available</span>
        </div>
      )}

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
