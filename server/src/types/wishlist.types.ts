import { ID } from "./common";

export type Wishlist = {
  id: ID;
  userId: ID;
  name: string;
  description?: string;
  hotelIds: ID[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateWishlistRequest = {
  name?: string;
  description?: string;
  isPublic?: boolean;
};

export type UpdateWishlistRequest = {
  name?: string;
  description?: string;
  isPublic?: boolean;
};

export type AddHotelToWishlistRequest = {
  hotelId: string;
};

export type WishlistWithHotels = Wishlist & {
  hotelIds: Array<{
    _id: ID;
    name: string;
    location: {
      coordinates: [number, number];
    };
    media: Array<{
      url: string;
      type: string;
    }>;
    rating?: number;
    price?: number;
    city?: string;
  }>;
};

export type PublicWishlistResponse = WishlistWithHotels & {
  userId: {
    _id: ID;
    name: string;
  };
};

export type HotelInWishlistResponse = {
  isInWishlist: boolean;
  wishlists: Array<{
    _id: ID;
    name: string;
  }>;
};
