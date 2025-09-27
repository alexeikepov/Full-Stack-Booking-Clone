import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/search";
import { useState } from "react";
import BookingModal from "../booking/BookingModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Hotel, Room } from "@/types/hotel";

interface PriceSummaryProps {
  totalSelectedRooms: number;
  totalPrice: number;
  firstSelectedRoom: Room | null;
  hotel: Hotel;
  selectedRooms: Record<string, number>;
}

export default function PriceSummary({
  totalSelectedRooms,
  totalPrice,
  firstSelectedRoom,
  hotel,
  selectedRooms,
}: PriceSummaryProps) {
  const { picker } = useSearchStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate number of nights
  const calculateNights = () => {
    if (picker.mode === "calendar" && picker.range?.from && picker.range?.to) {
      const from = picker.range.from;
      const to = picker.range.to;

      // Validate that both are Date objects
      if (
        !(from instanceof Date) ||
        !(to instanceof Date) ||
        isNaN(from.getTime()) ||
        isNaN(to.getTime())
      ) {
        console.warn("Invalid dates in PriceSummary calculateNights");
        return 1; // Default to 1 night if dates are invalid
      }

      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 1; // Default to 1 night if no dates selected
  };

  const nights = calculateNights();
  const pricePerRoom = firstSelectedRoom?.pricePerNight || 0;
  const totalPriceForNights = totalPrice * nights;

  const handleReserveClick = () => {
    if (!user) {
      alert("Please log in to make a reservation");
      navigate("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  if (totalSelectedRooms === 0) {
    return (
      <div>
        <Button
          onClick={handleReserveClick}
          className="bg-[#0071c2] hover:bg-[#005fa3] text-white px-4 py-2 text-sm font-medium"
        >
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
          ₪ {totalPriceForNights.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">
          ₪ {pricePerRoom.toLocaleString()} per room per night ×{" "}
          {totalSelectedRooms} room{totalSelectedRooms !== 1 ? "s" : ""} ×{" "}
          {nights} {nights === 1 ? "night" : "nights"}
        </div>
        <div className="text-xs text-gray-500">
          Additional charges may apply
        </div>
      </div>

      {/* Reserve button */}
      <Button
        onClick={handleReserveClick}
        className="w-full bg-[#0071c2] hover:bg-[#005fa3] text-white py-3 text-base font-medium"
      >
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
          {(firstSelectedRoom.amenities || []).some((a: string) =>
            /breakfast/i.test(a)
          ) && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>☕</span>
              <span>Good breakfast ₪ 70</span>
            </div>
          )}

          {/* High-speed internet - показываем если есть WiFi */}
          {((firstSelectedRoom.amenities || []).some((a: string) =>
            /wifi|internet/i.test(a)
          ) ||
            (firstSelectedRoom.facilities || []).some((a: string) =>
              /wifi|internet/i.test(a)
            )) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>Includes high-speed internet</span>
            </div>
          )}

          {/* Free cancellation - показываем если есть в categories */}
          {(firstSelectedRoom.categories || []).some((c: string) =>
            /free cancellation/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>Free cancellation before 21 January 2026</span>
            </div>
          )}

          {/* No prepayment - показываем если есть в categories */}
          {(firstSelectedRoom.categories || []).some((c: string) =>
            /no prepayment/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>No prepayment needed – pay at the property</span>
            </div>
          )}

          {/* Genius discount - показываем если есть в categories */}
          {(firstSelectedRoom.categories || []).some((c: string) =>
            /genius/i.test(c)
          ) && (
            <div className="flex items-center gap-2 text-sm text-[#0071c2]">
              <span>🏷️</span>
              <span>Genius discount may be available</span>
            </div>
          )}

          {/* Показываем реальные amenities с бэка */}
          {(firstSelectedRoom.amenities || []).map(
            (amenity: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                <span>✓</span>
                <span>{amenity}</span>
              </div>
            )
          )}

          {/* Показываем реальные facilities с бэка */}
          {(firstSelectedRoom.facilities || []).map(
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotel={hotel}
        selectedRooms={selectedRooms}
        totalPrice={totalPriceForNights}
        pricePerNight={totalPrice}
        firstSelectedRoom={firstSelectedRoom}
      />
    </div>
  );
}
