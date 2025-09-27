import { ID } from "./common";

export enum UserRole {
  OWNER = "OWNER",
  HOTEL_ADMIN = "HOTEL_ADMIN",
  USER = "USER",
}

export type User = {
  id: ID;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  friends?: ID[];
  role: UserRole;
  managedHotels?: ID[];
  createdAt: Date;
  
};
