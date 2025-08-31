 import { ID } from "./common";

export type Media = {
  id: ID;
  url: string;
  caption?: string;
  uploadedAt: Date;
  uploadedBy: ID;
};

export type Amenity = {
  id: ID;
  name: string;
  icon?: string;
};
