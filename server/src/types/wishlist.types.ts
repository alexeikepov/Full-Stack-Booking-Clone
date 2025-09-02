import { ID } from "./common";

export type Wishlist = {
  id: ID;
  userId: ID;
  hotelIds: ID[];
  createdAt: Date;
};
