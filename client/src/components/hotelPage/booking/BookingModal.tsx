import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createReservation } from "@/lib/api";
import { useSearchStore } from "@/stores/search";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: any;
  selectedRooms: Record<string, number>;
  totalPrice: number; // Общая цена за все ночи
  pricePerNight: number; // Цена за одну ночь
  firstSelectedRoom: any;
}

export default function BookingModal({
  isOpen,
  onClose,
  hotel,
  selectedRooms,
  totalPrice,
  pricePerNight,
  firstSelectedRoom,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const { adults, children, picker } = useSearchStore();
  const from = picker.range.from;
  const to = picker.range.to;
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate number of nights
  const calculateNights = () => {
    if (from && to) {
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 1;
  };

  const nights = calculateNights();
  // totalPrice уже содержит цену за все ночи, не нужно умножать

  // Calculate total quantity of selected rooms
  const totalQuantity = Object.values(selectedRooms).reduce(
    (sum, count) => sum + count,
    0
  );

  const createReservationMutation = useMutation({
    mutationFn: (data: any) => createReservation(data),
    onSuccess: () => {
      alert("Reservation created successfully!");
      onClose();
    },
    onError: (error: any) => {
      console.error("Reservation error:", error);
      if (error.response?.status === 401) {
        alert("Please log in to make a reservation");
        navigate("/login");
        onClose();
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.error || "Invalid data provided";
        alert(`Error creating reservation: ${errorMessage}`);
      } else {
        alert(`Error creating reservation: ${error.message}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверяем, что даты выбраны
    if (!from || !to) {
      alert("Please select check-in and check-out dates");
      return;
    }

    // Подготавливаем данные для бронирования
    const totalQuantity = Object.values(selectedRooms).reduce(
      (sum, count) => sum + count,
      0
    );

    const reservationData = {
      hotelId: hotel.id || hotel._id?.$oid,
      roomType: firstSelectedRoom?.roomType || "STANDARD",
      roomName: firstSelectedRoom?.name || "Standard",
      roomId: firstSelectedRoom?._id || firstSelectedRoom?.id,
      quantity: totalQuantity,
      guests: {
        adults: adults,
        children: children,
      },
      checkIn: (() => {
        const date = from || new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      checkOut: (() => {
        const date = to || new Date(Date.now() + 86400000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
      guestInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests,
      },
      // Добавляем specialRequests на верхний уровень тоже
      specialRequests: formData.specialRequests
        ? [
            {
              type: "general",
              description: formData.specialRequests,
              additionalCost: 0,
            },
          ]
        : [],
      payment: {
        method: "CARD",
        paid: false,
      },
    };

    console.log("Sending reservation data:", reservationData);
    console.log("Dates from search store:", { from, to });
    createReservationMutation.mutate(reservationData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Book Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Booking information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Booking Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Hotel: {hotel.name}</div>
              <div>Room: {firstSelectedRoom?.name}</div>
              <div>
                Dates: {from ? from.toLocaleDateString() : "Not selected"} -{" "}
                {to ? to.toLocaleDateString() : "Not selected"}
              </div>
              <div>
                Guests: {adults} adults, {children} children
              </div>
              <div>
                Price: ₪{pricePerNight.toLocaleString()} per night × {nights}{" "}
                nights = ₪{totalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                ({totalQuantity} room{totalQuantity !== 1 ? "s" : ""} × ₪
                {firstSelectedRoom?.pricePerNight?.toLocaleString() || 0} per
                room per night)
              </div>
            </div>
          </div>

          {/* Guest form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Guest Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests or preferences..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReservationMutation.isPending}
              className="flex-1 px-4 py-2 bg-[#0071c2] text-white rounded-md hover:bg-[#005fa3] disabled:opacity-50"
            >
              {createReservationMutation.isPending ? "Creating..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
