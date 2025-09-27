import type { User } from './auth';

export type FriendRequest = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type Friend = {
  _id: string;
  name: string;
  email: string;
};

export type SendFriendRequestData = {
  receiverId: string;
};

export type SharedHotel = {
  _id: string;
  sender: User;
  receiver: User;
  hotel: {
    _id: string;
    name: string;
    city: string;
    images: string[];
    rating: number;
    price: number;
  };
  message?: string;
  status: 'pending' | 'viewed' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  _id: string;
  name: string;
  description?: string;
  creator: User;
  members: User[];
  hotel: {
    _id: string;
    name: string;
    city: string;
    images: string[];
    rating: number;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
};

export type Chat = {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id: string;
  chat: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'hotel_share' | 'group_invite';
  metadata?: {
    hotelId?: string;
    groupId?: string;
    fileName?: string;
    fileUrl?: string;
  };
  readBy: string[];
  createdAt: string;
  updatedAt: string;
};

export type SendSharedHotelData = {
  receiverId: string;
  hotelId: string;
  message?: string;
};

export type CreateGroupData = {
  name: string;
  description?: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms: number;
  memberIds?: string[];
};

export type SendMessageData = {
  content: string;
  type?: 'text' | 'image' | 'file' | 'hotel_share' | 'group_invite';
  metadata?: {
    hotelId?: string;
    groupId?: string;
    fileName?: string;
    fileUrl?: string;
  };
};
