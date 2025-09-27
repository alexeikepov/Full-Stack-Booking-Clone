export type Trip = {
  id: string;
  city: string;
  from: string;
  to: string;
  bookings: number;
  imageUrl: string;
  quantity: number;
  pricePerNight: number;
  totalPrice: number;
  hotelId?: string;
  sharedWith?: string[];
  isShared?: boolean;
  isOwner?: boolean;
};

export type ApiPayload = {
  past: Trip[];
  cancelled: Trip[];
  shared: Trip[];
};
