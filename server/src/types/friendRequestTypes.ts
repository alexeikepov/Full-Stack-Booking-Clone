// src/types/friendRequestTypes.ts
export interface FriendRequestQuery {
  type?: "sent" | "received" | "all";
}

export interface SearchUsersQuery {
  q: string;
}

export interface FriendRequestFilter {
  sender?: string;
  receiver?: string;
  $or?: Array<{ sender: string } | { receiver: string }>;
}

export interface UserSearchFilter {
  _id: { $ne: string };
  $or: Array<
    | { name: { $regex: string; $options: string } }
    | { email: { $regex: string; $options: string } }
  >;
}

export interface FriendRequestResponse {
  message: string;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  email: string;
  role: string;
}
