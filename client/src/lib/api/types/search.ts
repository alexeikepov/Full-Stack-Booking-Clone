export type SearchHotelsParams = {
  q?: string;
  city?: string;
  roomType?: "STANDARD" | "DELUXE" | "SUITE";
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  from?: string;
  to?: string;
  adults?: number;
  children?: number;
  rooms?: number;
};

export type LastSearch = {
  city?: string;
  from?: string;
  to?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  createdAt?: string;
};
