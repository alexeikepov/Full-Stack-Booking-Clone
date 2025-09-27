export interface Application {
  id: string;
  ownerName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
  description: string;
  hotelName: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: number;
  status: string;
  approvalStatus: string;
  owner: string;
  createdAt: string;
  isVisible: boolean;
  _id?: string;
}

export interface OwnerPageProps {}
