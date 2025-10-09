// src/services/friendRequestService.ts
import FriendRequestModel from "../models/FriendRequest";
import { UserModel } from "../models/User";
import {
  FriendRequestFilter,
  UserSearchFilter,
} from "../types/friendRequestTypes";

export async function createFriendRequest(
  senderId: string,
  receiverId: string
) {
  const friendRequest = new FriendRequestModel({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });

  await friendRequest.save();
  return friendRequest;
}

export async function findFriendRequests(filter: FriendRequestFilter) {
  return await FriendRequestModel.find(filter)
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .sort({ createdAt: -1 });
}

export async function findFriendRequestById(requestId: string) {
  return await FriendRequestModel.findById(requestId);
}

export async function updateFriendRequestStatus(
  requestId: string,
  status: "accepted" | "rejected"
) {
  return await FriendRequestModel.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );
}

export async function deleteFriendRequest(requestId: string) {
  return await FriendRequestModel.findByIdAndDelete(requestId);
}

export async function addFriendsToUsers(senderId: string, receiverId: string) {
  await Promise.all([
    UserModel.findByIdAndUpdate(senderId, {
      $addToSet: { friends: receiverId },
    }),
    UserModel.findByIdAndUpdate(receiverId, {
      $addToSet: { friends: senderId },
    }),
  ]);
}

export async function removeFriendsFromUsers(userId: string, friendId: string) {
  await Promise.all([
    UserModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } }),
    UserModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } }),
  ]);
}

export async function deleteFriendRequestsBetweenUsers(
  userId: string,
  friendId: string
) {
  return await FriendRequestModel.deleteMany({
    $or: [
      { sender: userId, receiver: friendId },
      { sender: friendId, receiver: userId },
    ],
  });
}

export async function searchUsers(filter: UserSearchFilter) {
  return await UserModel.find(filter)
    .select("name email role")
    .limit(20)
    .lean();
}

export async function getUserWithFriends(userId: string) {
  return await UserModel.findById(userId)
    .populate("friends", "name email")
    .lean();
}

export async function checkExistingFriendRequest(
  senderId: string,
  receiverId: string
) {
  return await FriendRequestModel.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });
}

export async function checkIfUsersAreFriends(userId: string, friendId: string) {
  const user = await UserModel.findById(userId);
  return (
    user?.friends?.some((friend) => friend.toString() === friendId) || false
  );
}
