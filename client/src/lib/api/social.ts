import type {
  FriendRequest,
  Friend,
  SendFriendRequestData,
  SharedHotel,
  Group,
  Chat,
  Message,
  SendSharedHotelData,
  CreateGroupData,
  SendMessageData,
} from "./types/index.js";
import { api } from "./instance.js";

export type {
  FriendRequest,
  Friend,
  SendFriendRequestData,
  SharedHotel,
  Group,
  Chat,
  Message,
  SendSharedHotelData,
  CreateGroupData,
  SendMessageData,
};

export async function sendFriendRequest(
  data: SendFriendRequestData
): Promise<FriendRequest> {
  const res = await api.post("/api/friend-requests", data);
  return res.data;
}

export async function getFriendRequests(
  type: "sent" | "received" | "all" = "all"
): Promise<FriendRequest[]> {
  const res = await api.get("/api/friend-requests", { params: { type } });
  return res.data;
}

export async function acceptFriendRequest(
  requestId: string
): Promise<FriendRequest> {
  const res = await api.patch(`/api/friend-requests/${requestId}/accept`);
  return res.data;
}

export async function rejectFriendRequest(
  requestId: string
): Promise<FriendRequest> {
  const res = await api.patch(`/api/friend-requests/${requestId}/reject`);
  return res.data;
}

export async function cancelFriendRequest(
  requestId: string
): Promise<{ message: string }> {
  const res = await api.delete(`/api/friend-requests/${requestId}`);
  return res.data;
}

export async function getFriends(): Promise<Friend[]> {
  const res = await api.get("/api/friend-requests/friends");
  return res.data;
}

export async function removeFriend(
  friendId: string
): Promise<{ message: string }> {
  const res = await api.delete(`/api/friend-requests/friends/${friendId}`);
  return res.data;
}

export async function shareHotel(
  data: SendSharedHotelData
): Promise<SharedHotel> {
  const res = await api.post("/api/shared-hotels", data);
  return res.data;
}

export async function getSharedHotels(
  status: string = "all"
): Promise<SharedHotel[]> {
  const res = await api.get("/api/shared-hotels", { params: { status } });
  return res.data;
}

export async function getMySharedHotels(): Promise<SharedHotel[]> {
  const res = await api.get("/api/shared-hotels/my-shares");
  return res.data;
}

export async function updateSharedHotelStatus(
  sharedHotelId: string,
  status: string
): Promise<SharedHotel> {
  const res = await api.patch(`/api/shared-hotels/${sharedHotelId}/status`, {
    status,
  });
  return res.data;
}

export async function deleteSharedHotel(sharedHotelId: string): Promise<void> {
  await api.delete(`/api/shared-hotels/${sharedHotelId}`);
}

export async function createGroup(data: CreateGroupData): Promise<Group> {
  const res = await api.post("/api/groups", data);
  return res.data;
}

export async function getMyGroups(status: string = "all"): Promise<Group[]> {
  const res = await api.get("/api/groups", { params: { status } });
  return res.data;
}

export async function getGroupById(groupId: string): Promise<Group> {
  const res = await api.get(`/api/groups/${groupId}`);
  return res.data;
}

export async function addMemberToGroup(
  groupId: string,
  memberId: string
): Promise<Group> {
  const res = await api.post(`/api/groups/${groupId}/members`, { memberId });
  return res.data;
}

export async function removeMemberFromGroup(
  groupId: string,
  memberId: string
): Promise<Group> {
  const res = await api.delete(`/api/groups/${groupId}/members`, {
    data: { memberId },
  });
  return res.data;
}

export async function updateGroupStatus(
  groupId: string,
  status: string
): Promise<Group> {
  const res = await api.patch(`/api/groups/${groupId}/status`, { status });
  return res.data;
}

export async function deleteGroup(groupId: string): Promise<void> {
  await api.delete(`/api/groups/${groupId}`);
}

export async function getOrCreateChat(friendId: string): Promise<Chat> {
  const res = await api.get(`/api/chats/with/${friendId}`);
  return res.data;
}

export async function getMyChats(): Promise<Chat[]> {
  const res = await api.get("/api/chats");
  return res.data;
}

export async function getChatMessages(
  chatId: string,
  page: number = 1,
  limit: number = 50
): Promise<Message[]> {
  const res = await api.get(`/api/chats/${chatId}/messages`, {
    params: { page, limit },
  });
  return res.data;
}

export async function sendMessage(
  chatId: string,
  data: SendMessageData
): Promise<Message> {
  const res = await api.post(`/api/chats/${chatId}/messages`, data);
  return res.data;
}

export async function markMessagesAsRead(chatId: string): Promise<void> {
  await api.patch(`/api/chats/${chatId}/read`);
}

export async function getUnreadCount(): Promise<{ unreadCount: number }> {
  const res = await api.get("/api/chats/unread/count");
  return res.data;
}
