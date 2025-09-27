export type Wishlist = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  hotelIds: Array<{
    _id: string;
    name: string;
    city: string;
    location?: {
      lat: number;
      lng: number;
    };
    images?: Array<{
      url: string;
    }>;
    rating?: number;
    price?: number;
    averageRating?: number;
    reviewsCount?: number;
    stars?: number;
  }>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateWishlistData = {
  name: string;
  description?: string;
  isPublic?: boolean;
};

export type UpdateWishlistData = Partial<CreateWishlistData>;
