// GuestData type for use in search and booking flows

export type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
  pets: boolean;
};
