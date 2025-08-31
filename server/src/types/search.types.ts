import { ID } from "./common";

export type SearchHistory = {
  id: ID;
  userId: ID;
  query: string;
  createdAt: Date;
};
