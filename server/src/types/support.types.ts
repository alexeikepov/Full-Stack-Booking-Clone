import { ID } from "./common";

export enum TicketStatus { OPEN="OPEN", IN_PROGRESS="IN_PROGRESS", CLOSED="CLOSED" }

export type SupportTicket = {
  id: ID;
  userId: ID;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: Date;
  closedAt?: Date;
};
