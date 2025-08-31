import { ID } from "./common";

export enum NotificationType {
  RESERVATION = "RESERVATION",
  HOTEL_APPROVAL = "HOTEL_APPROVAL",
  PAYMENT = "PAYMENT",
  MESSAGE = "MESSAGE",
}

export type Notification = {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};
