import { ID } from "./common";

export type Review = {
  id: ID;
  authorId: ID;
  hotelId?: ID;
  roomId?: ID;
  rating: number;
  comment: string;
  createdAt: Date;
};
