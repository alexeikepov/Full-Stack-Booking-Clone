export type CreateReservationData = {
  roomName: string;
  roomId: string;
  quantity: number;
  guests: {
    adults: number;
    children: number;
  };
  checkIn: string | Date;
  checkOut: string | Date;
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
    dietaryRequirements?: string;
    arrivalTime?: string;
    departureTime?: string;
  };
  children?: Array<{
    name?: string;
    age: number;
    needsCot?: boolean;
  }>;
  specialRequests?: Array<{
    type: string;
    description: string;
    additionalCost?: number;
  }>;
  payment?: {
    method?: string;
    paid?: boolean;
    transactionId?: string;
  };
  policies?: {
    freeCancellation?: boolean;
    noPrepayment?: boolean;
    priceMatch?: boolean;
    cancellationDeadline?: string;
    cancellationPolicy?: string;
  };
  notes?: string;
};

export type UpdateReservationData = Partial<CreateReservationData>;

export type SpecialRequestData = {
  type: string;
  description: string;
  additionalCost?: number;
};
