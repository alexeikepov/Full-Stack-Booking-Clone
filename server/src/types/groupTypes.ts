// src/types/groupTypes.ts
export interface GroupQuery {
  status?: "planning" | "booked" | "completed" | "cancelled" | "all";
}

export interface GroupFilter {
  members: string;
  status?: string;
}

export interface GroupMember {
  _id: string;
  name: string;
  email: string;
}

export interface GroupHotel {
  _id: string;
  name: string;
  city: string;
  images: string[];
  rating: number;
  price: number;
}

export interface GroupCreator {
  _id: string;
  name: string;
  email: string;
}

export interface GroupResponse {
  _id: string;
  name: string;
  description?: string;
  creator: GroupCreator;
  members: GroupMember[];
  hotel: GroupHotel;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMessageResponse {
  message: string;
}

export interface GroupValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}
