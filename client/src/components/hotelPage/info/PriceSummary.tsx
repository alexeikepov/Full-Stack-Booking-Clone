import { Button } from "@/components/ui/button";

interface PriceSummaryProps {
  totalSelectedRooms: number;
  totalPrice: number;
  firstSelectedRoom: any;
}

export default function PriceSummary({
  totalSelectedRooms,
  totalPrice,
  firstSelectedRoom,
}: PriceSummaryProps) {
  if (totalSelectedRooms === 0) {
    return (
      <div>
        <Button className="bg-[#0071c2] hover:bg-[#005fa3] text-white px-4 py-2 text-sm font-medium">
          I'll reserve
        </Button>
        <div className="mt-3 text-sm text-gray-600">
          • You won't be charged in the next step
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected rooms count and price */}
      <div>
        <div className="text-sm font-semibold text-gray-900">
          {totalSelectedRooms >= 6 ? "5+" : totalSelectedRooms} room
          {totalSelectedRooms !== 1 ? "s" : ""} for
        </div>
        <div className="text-xl font-bold text-gray-900">
          ₪ {totalPrice.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">
          Additional charges may apply
        </div>
      </div>

      {/* Reserve button */}
      <Button className="w-full bg-[#0071c2] hover:bg-[#005fa3] text-white py-3 text-base font-medium">
        I'll reserve
      </Button>

      {/* Reservation info */}
      <div className="text-sm text-gray-600">
        <div>You'll be taken to the next step</div>
        <div>• You won't be charged yet</div>
      </div>

      {/* Your package section */}
      {firstSelectedRoom && (
        <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
          <div className="text-base font-bold text-gray-900">Your package:</div>

          {/* Breakfast - показываем если есть в amenities */}
          {firstSelectedRoom.amenities.some((a: string) =>
            /breakfast/i.test(a)
          ) && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>☕</span>
              <span>Good breakfast ₪ 70</span>
            </div>
          )}

          {/* High-speed internet - показываем если есть WiFi */}
          {(firstSelectedRoom.amenities.some((a: string) =>
            /wifi|internet/i.test(a)
          ) ||
            firstSelectedRoom.facilities.some((a: string) =>
              /wifi|internet/i.test(a)
            )) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>Includes high-speed internet</span>
            </div>
          )}

          {/* Free cancellation - показываем если есть в categories */}
          {firstSelectedRoom.categories.some((c: string) =>
            /free cancellation/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>Free cancellation before 21 January 2026</span>
            </div>
          )}

          {/* No prepayment - показываем если есть в categories */}
          {firstSelectedRoom.categories.some((c: string) =>
            /no prepayment/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>No prepayment needed – pay at the property</span>
            </div>
          )}

          {/* Genius discount - показываем если есть в categories */}
          {firstSelectedRoom.categories.some((c: string) =>
            /genius/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-[#0071c2]">
              <span>🏷️</span>
              <span>Genius discount may be available</span>
            </div>
          )}

          {/* Показываем реальные amenities с бэка */}
          {firstSelectedRoom.amenities.map((amenity: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-green-600"
            >
              <span>✓</span>
              <span>{amenity}</span>
            </div>
          ))}

          {/* Показываем реальные facilities с бэка */}
          {firstSelectedRoom.facilities.map(
            (facility: string, index: number) => (
              <div
                key={`facility-${index}`}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                <span>✓</span>
                <span>{facility}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
