import { ID } from "./common";

export type Message = {
  id: ID;
  fromUserId: ID;
  toUserId: ID;
  hotelId?: ID;
  content: string;
  createdAt: Date;
  read: boolean;
};
